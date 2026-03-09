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

// ─── Fetch Listings from DDF ──────────────────────────────────────────────

async function fetchAllDdfListings(): Promise<any[]> {
    const token = await getDdfToken()
    const allListings: any[] = []
    let skip = 0
    let total = Infinity

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

    return allListings
}

// ─── Upsert into Supabase ─────────────────────────────────────────────────

async function ensureAgent(agentKey: string): Promise<number> {
    // Try to find existing
    const { data: existing } = await supabase
        .from('agents')
        .select('id')
        .eq('agent_key', agentKey)
        .single()

    if (existing) return existing.id

    // Insert new
    const { data, error } = await supabase
        .from('agents')
        .upsert({ agent_key: agentKey, updated_at: new Date().toISOString() }, { onConflict: 'agent_key' })
        .select('id')
        .single()

    if (error) throw error
    return data!.id
}

async function ensureOffice(officeKey: string, officeName?: string): Promise<number> {
    const { data: existing } = await supabase
        .from('offices')
        .select('id')
        .eq('office_key', officeKey)
        .single()

    if (existing) return existing.id

    const { data, error } = await supabase
        .from('offices')
        .upsert(
            { office_key: officeKey, name: officeName || officeKey, updated_at: new Date().toISOString() },
            { onConflict: 'office_key' }
        )
        .select('id')
        .single()

    if (error) throw error
    return data!.id
}

async function upsertListing(raw: any): Promise<void> {
    let agentId: number | null = null
    let officeId: number | null = null

    if (raw.ListAgentKey) agentId = await ensureAgent(raw.ListAgentKey)
    if (raw.ListOfficeKey) officeId = await ensureOffice(raw.ListOfficeKey, raw.ListOfficeName)

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

    const lat = raw.Latitude
    const lng = raw.Longitude

    // Build the row for upsert (without location — PostGIS needs raw SQL)
    const row: Record<string, any> = {
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
        rooms: JSON.stringify(rooms),
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

    // Upsert the row (without location)
    const { error } = await supabase
        .from('listings')
        .upsert(row, { onConflict: 'listing_key' })

    if (error) throw error

    // Update location separately using raw SQL via RPC
    if (lat && lng) {
        await supabase.rpc('update_listing_location', {
            p_listing_key: raw.ListingKey,
            p_lat: lat,
            p_lng: lng,
        })
    }
}

// ─── Main Import Loop ─────────────────────────────────────────────────────

async function runImport(): Promise<void> {
    const startTime = Date.now()
    console.log(`[${new Date().toISOString()}] Starting DDF import...`)

    try {
        const listings = await fetchAllDdfListings()
        console.log(`  Fetched ${listings.length} listings from DDF`)

        let success = 0
        let errors = 0

        for (const raw of listings) {
            try {
                await upsertListing(raw)
                success++
                if (success % 50 === 0) console.log(`  Upserted ${success}/${listings.length}...`)
            } catch (err) {
                errors++
                if (errors <= 5) {
                    console.error(`  Error upserting ${raw.ListingKey}:`, err)
                }
            }
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1)
        console.log(`  Import complete: ${success} upserted, ${errors} errors, ${elapsed}s elapsed`)

        // Mark stale listings as inactive
        const { count } = await supabase
            .from('listings')
            .update({ status: 'Inactive', updated_at: new Date().toISOString() })
            .eq('status', 'Active')
            .lt('ddf_last_synced', new Date(Date.now() - 30 * 60 * 1000).toISOString())

        if (count && count > 0) {
            console.log(`  Marked ${count} stale listings as Inactive`)
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
