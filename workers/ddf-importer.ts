/**
 * DDF Import Worker
 *
 * Pulls listings from the CREA DDF feed every 10 minutes and upserts them
 * into the Supabase PostgreSQL database.
 *
 * Usage:
 *   npx tsx workers/ddf-importer.ts
 *
 * Environment variables:
 *   NEXT_PUBLIC_SUPABASE_URL  - Supabase project URL
 *   SUPABASE_SERVICE_ROLE_KEY - Supabase service role key
 *   DDF_CLIENT_ID             - CREA DDF OAuth client ID
 *   DDF_CLIENT_SECRET         - CREA DDF OAuth client secret
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

// Load .env.local
dotenv.config({ path: resolve(__dirname, '..', '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const DDF_TOKEN_URL = 'https://identity.crea.ca/connect/token'
const DDF_API_BASE = 'https://ddfapi.realtor.ca/odata/v1'
const DDF_CLIENT_ID = process.env.DDF_CLIENT_ID || ''
const DDF_CLIENT_SECRET = process.env.DDF_CLIENT_SECRET || ''
const IMPORT_INTERVAL_MS = 10 * 60 * 1000
const BATCH_SIZE = 100
const UPSERT_BATCH_SIZE = 50

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required')
    process.exit(1)
}

if (!DDF_CLIENT_ID || !DDF_CLIENT_SECRET) {
    console.error('DDF_CLIENT_ID and DDF_CLIENT_SECRET are required')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// ─── Token Management ─────────────────────────────────────────────────────

let cachedToken: string | null = null
let tokenExpiry = 0

async function getDdfToken(): Promise<string> {
    if (cachedToken && Date.now() < tokenExpiry) return cachedToken

    const res = await fetch(DDF_TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: DDF_CLIENT_ID,
            client_secret: DDF_CLIENT_SECRET,
            grant_type: 'client_credentials',
            scope: 'DDFApi_Read',
        }),
    })

    if (!res.ok) throw new Error(`Token error: ${res.status} ${res.statusText}`)

    const data = await res.json()
    cachedToken = data.access_token
    tokenExpiry = Date.now() + 55 * 60 * 1000
    return cachedToken!
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function ddfStr(val: any): string | null {
    if (!val) return null
    if (Array.isArray(val)) return val.join(', ')
    return String(val)
}

function normalizeStatus(status: string): string {
    const s = (status || '').toLowerCase()
    if (s.includes('sold') || s.includes('closed')) return 'Sold'
    if (s.includes('pending') || s.includes('contingent')) return 'Pending'
    return 'Active'
}

interface FetchResult {
    listings: any[]
    partial: boolean
}

// ─── Fetch Listings from DDF ──────────────────────────────────────────────

async function fetchAllDdfListings(): Promise<FetchResult> {
    const token = await getDdfToken()
    const allListings: any[] = []
    let skip = 0
    let total = Infinity
    let partial = false

    const filter = "(City eq 'Kitchener' or City eq 'Waterloo' or City eq 'Cambridge' or City eq 'Guelph' or City eq 'Brampton' or City eq 'Mississauga' or City eq 'Toronto') and (ListPrice gt 0 or TotalActualRent gt 0)"

    while (skip < total) {
        const params = new URLSearchParams()
        params.set('$top', BATCH_SIZE.toString())
        if (skip > 0) params.set('$skip', skip.toString())
        if (skip === 0) params.set('$count', 'true')
        params.set('$filter', filter)
        params.set('$orderby', 'ModificationTimestamp desc')

        const url = `${DDF_API_BASE}/Property?${params.toString()}`
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
            console.error(`DDF fetch error at skip=${skip}:`, res.status)
            partial = true
            break
        }

        const data = await res.json()
        if (skip === 0 && data['@odata.count'] != null) {
            total = data['@odata.count']
        }

        const batch = data.value || []
        allListings.push(...batch)

        if (batch.length < BATCH_SIZE) break
        skip += BATCH_SIZE

        console.log(`  Fetched ${allListings.length}/${total} listings...`)
    }

    return { listings: allListings, partial }
}

// ─── Batch Upsert into Supabase ──────────────────────────────────────────

async function ensureAgentsBatch(agentKeys: string[]): Promise<Map<string, number>> {
    const map = new Map<string, number>()
    if (agentKeys.length === 0) return map

    // Fetch existing agents
    const { data: existing } = await supabase
        .from('agents')
        .select('id, agent_key')
        .in('agent_key', agentKeys)

    for (const row of existing || []) {
        map.set(row.agent_key, row.id)
    }

    // Upsert missing agents
    const missing = agentKeys.filter(k => !map.has(k))
    if (missing.length > 0) {
        const rows = missing.map(k => ({ agent_key: k, updated_at: new Date().toISOString() }))
        const { data, error } = await supabase
            .from('agents')
            .upsert(rows, { onConflict: 'agent_key' })
            .select('id, agent_key')

        if (error) console.error('Agent batch upsert error:', error)
        for (const row of data || []) {
            map.set(row.agent_key, row.id)
        }
    }

    return map
}

async function ensureOfficesBatch(offices: Map<string, string | undefined>): Promise<Map<string, number>> {
    const map = new Map<string, number>()
    const keys = [...offices.keys()]
    if (keys.length === 0) return map

    // Fetch existing offices
    const { data: existing } = await supabase
        .from('offices')
        .select('id, office_key')
        .in('office_key', keys)

    for (const row of existing || []) {
        map.set(row.office_key, row.id)
    }

    // Upsert missing offices
    const missing = keys.filter(k => !map.has(k))
    if (missing.length > 0) {
        const rows = missing.map(k => ({
            office_key: k,
            name: offices.get(k) || k,
            updated_at: new Date().toISOString(),
        }))
        const { data, error } = await supabase
            .from('offices')
            .upsert(rows, { onConflict: 'office_key' })
            .select('id, office_key')

        if (error) console.error('Office batch upsert error:', error)
        for (const row of data || []) {
            map.set(row.office_key, row.id)
        }
    }

    return map
}

function buildListingRow(raw: any, agentMap: Map<string, number>, officeMap: Map<string, number>): Record<string, any> {
    const agentId = raw.ListAgentKey ? agentMap.get(raw.ListAgentKey) ?? null : null
    const officeId = raw.ListOfficeKey ? officeMap.get(raw.ListOfficeKey) ?? null : null

    const streetNum = raw.StreetNumber || ''
    const streetName = raw.StreetName || ''
    const streetSuffix = raw.StreetSuffix || ''
    const unit = raw.UnitNumber || null
    const city = raw.City || ''
    const province = raw.StateOrProvince || 'ON'
    const postal = raw.PostalCode || ''
    const unitPart = unit ? ` Unit ${unit}` : ''
    const fullAddress = `${streetNum} ${streetName} ${streetSuffix}${unitPart}, ${city}, ${province} ${postal}`.trim()

    const photos = (raw.Media || [])
        .filter((m: any) => m.MediaCategory === 'Photo' || (m.MediaURL && /\.(jpg|jpeg|png|webp|gif)/i.test(m.MediaURL)))
        .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0))
        .map((m: any) => m.MediaURL)
        .filter(Boolean)

    const isRental = !raw.ListPrice && !!raw.TotalActualRent

    const rooms = (raw.Rooms || []).map((r: any) => ({
        type: r.RoomType || 'Room',
        level: r.RoomLevel || '',
        dimensions: r.RoomDimensions || '',
        description: r.RoomDescription || '',
    }))

    return {
        listing_key: raw.ListingKey,
        mls_number: raw.ListingId || raw.ListingKey,
        agent_id: agentId,
        office_id: officeId,
        street_number: streetNum,
        street_name: streetName,
        street_suffix: streetSuffix,
        unit_number: unit,
        city,
        province,
        postal_code: postal,
        neighbourhood: raw.MLSAreaMinor || raw.SubdivisionName || null,
        full_address: fullAddress,
        list_price: raw.ListPrice || null,
        rent_price: raw.TotalActualRent || null,
        is_rental: isRental,
        rent_frequency: raw.LeaseAmountFrequency || null,
        beds: raw.BedroomsTotal || 0,
        beds_above: raw.BedroomsAboveGrade ?? null,
        beds_below: raw.BedroomsBelowGrade ?? null,
        baths: raw.BathroomsTotalInteger || 0,
        baths_full: raw.BathroomsFull ?? null,
        baths_half: raw.BathroomsHalf ?? null,
        sqft: raw.LivingArea || raw.BuildingAreaTotal || null,
        lot_size: raw.LotSizeArea ? String(raw.LotSizeArea) : null,
        lot_dimensions: raw.LotSizeDimensions || null,
        property_type: (Array.isArray(raw.StructureType) && raw.StructureType[0]) || raw.PropertySubType || 'Residential',
        building_type: raw.PropertySubType || null,
        storeys: ddfStr(raw.StoriesTotal || raw.Stories),
        year_built: raw.YearBuilt || null,
        description: raw.PublicRemarks || '',
        status: normalizeStatus(raw.StandardStatus || raw.MlsStatus || ''),
        photos,
        virtual_tour: raw.VirtualTourURLUnbranded || raw.VirtualTourURLBranded || null,
        construction_material: ddfStr(raw.ConstructionMaterials),
        foundation: ddfStr(raw.FoundationDetails || raw.Foundation),
        roof: ddfStr(raw.Roof),
        exterior_features: ddfStr(raw.ExteriorFeatures),
        flooring: ddfStr(raw.Flooring),
        interior_features: ddfStr(raw.InteriorFeatures),
        appliances: ddfStr(raw.Appliances),
        basement: ddfStr(raw.Basement),
        heating: ddfStr(raw.Heating),
        heating_fuel: ddfStr(raw.HeatingFuel),
        cooling: ddfStr(raw.Cooling),
        water_source: ddfStr(raw.WaterSource),
        sewer: ddfStr(raw.Sewer),
        parking_total: raw.ParkingTotal ?? raw.ParkingSpaces ?? null,
        garage_spaces: raw.GarageSpaces ?? null,
        parking_features: ddfStr(raw.ParkingFeatures),
        tax_amount: raw.TaxAnnualAmount ?? null,
        tax_year: raw.TaxYear ?? null,
        association_fee: raw.AssociationFee ?? null,
        association_fee_frequency: raw.AssociationFeeFrequency || null,
        rooms,
        rooms_total: raw.RoomsTotal ?? null,
        zoning: raw.Zoning || raw.ZoningDescription || null,
        community_features: ddfStr(raw.CommunityFeatures),
        pool_features: ddfStr(raw.PoolFeatures),
        fencing: ddfStr(raw.Fencing),
        realtor_ca_url: raw.ListingURL ? `https://${raw.ListingURL}` : `https://www.realtor.ca/real-estate/${raw.ListingKey}`,
        listing_brokerage: raw.ListOfficeName || '',
        list_date: raw.OriginalEntryTimestamp || null,
        modification_date: raw.ModificationTimestamp || null,
        ddf_last_synced: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    }
}

// ─── Main Import Loop ─────────────────────────────────────────────────────

async function runImport(): Promise<void> {
    const startTime = Date.now()
    console.log(`[${new Date().toISOString()}] Starting DDF import...`)

    try {
        const { listings, partial } = await fetchAllDdfListings()
        console.log(`  Fetched ${listings.length} listings from DDF`)

        // Collect unique agent and office keys
        const agentKeys = new Set<string>()
        const officeEntries = new Map<string, string | undefined>()
        for (const raw of listings) {
            if (raw.ListAgentKey) agentKeys.add(raw.ListAgentKey)
            if (raw.ListOfficeKey) officeEntries.set(raw.ListOfficeKey, raw.ListOfficeName)
        }

        // Batch upsert agents and offices
        const agentMap = await ensureAgentsBatch([...agentKeys])
        const officeMap = await ensureOfficesBatch(officeEntries)
        console.log(`  Resolved ${agentMap.size} agents, ${officeMap.size} offices`)

        let success = 0
        let errors = 0

        // Batch upsert listings
        for (let i = 0; i < listings.length; i += UPSERT_BATCH_SIZE) {
            const batch = listings.slice(i, i + UPSERT_BATCH_SIZE)
            const rows = batch.map(raw => buildListingRow(raw, agentMap, officeMap))

            try {
                const { error } = await supabase
                    .from('listings')
                    .upsert(rows, { onConflict: 'listing_key' })

                if (error) throw error
                success += batch.length
            } catch (err) {
                errors += batch.length
                if (errors <= 5 * UPSERT_BATCH_SIZE) {
                    console.error(`  Error upserting batch at index ${i}:`, err)
                }
                if (errors > 50 && success < errors) {
                    console.error(`  Aborting: ${errors} errors vs ${success} successes -- likely a systemic issue`)
                    break
                }
                continue
            }

            // TODO: location updates are still sequential per listing.
            // Consider a batch RPC or trigger to reduce round trips.
            for (const raw of batch) {
                if (raw.Latitude && raw.Longitude) {
                    try {
                        await supabase.rpc('update_listing_location', {
                            p_listing_key: raw.ListingKey,
                            p_lat: raw.Latitude,
                            p_lng: raw.Longitude,
                        })
                    } catch (err) {
                        console.error(`  Location update failed for ${raw.ListingKey}:`, err)
                    }
                }
            }

            if (success % 200 === 0 || i + UPSERT_BATCH_SIZE >= listings.length) {
                console.log(`  Upserted ${success}/${listings.length}...`)
            }
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`  Import complete: ${success} upserted, ${errors} errors, ${elapsed}s elapsed`)

        // Only mark stale listings if we completed a full fetch (not partial)
        // Use a 24-hour window to avoid false positives from slow imports
        if (partial) {
            console.log('  Skipping stale-listing cleanup (partial fetch)')
        } else {
            const STALE_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
            const { count } = await supabase
                .from('listings')
                .update({ status: 'Inactive', updated_at: new Date().toISOString() })
                .eq('status', 'Active')
                .lt('ddf_last_synced', new Date(Date.now() - STALE_WINDOW_MS).toISOString())

            if (count && count > 0) {
                console.log(`  Marked ${count} stale listings as Inactive`)
            }
        }
    } catch (err) {
        console.error('  Import failed:', err)
    }
}

// ─── Entry Point ──────────────────────────────────────────────────────────

async function main() {
    console.log('DDF Import Worker started')
    console.log(`Import interval: ${IMPORT_INTERVAL_MS / 1000}s`)

    // Run immediately on start
    await runImport()

    // Then schedule recurring imports
    setInterval(runImport, IMPORT_INTERVAL_MS)
}

main().catch((err) => {
    console.error('Worker fatal error:', err)
    process.exit(1)
})
