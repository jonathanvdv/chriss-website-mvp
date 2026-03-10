import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

const VALID_STATUSES = new Set(['Active', 'Sold', 'Pending'])
const VALID_TRANSACTION_TYPES = new Set(['sale', 'rent'])
const VALID_PROPERTY_TYPES = new Set([
    'House',
    'Apartment',
    'Row / Townhouse',
    'Duplex',
    'Triplex',
    'Fourplex',
    'Mobile Home',
    'Manufactured Home/Mobile',
    'Land',
    'Residential',
    'Commercial',
    'Vacant Land',
])

function safeNum(value: string | null): number | undefined {
    if (value == null || value === '') return undefined
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
}

const KEY_PATTERN = /^[a-zA-Z0-9_-]{1,50}$/

/**
 * GET /api/listings?bbox=lng1,lat1,lng2,lat2&agent_id=123
 *
 * Returns listings within a bounding box, with optional multi-tenant filtering.
 * Uses a PostGIS RPC function on Supabase for spatial queries.
 *
 * Query params:
 *   bbox       - required: "west,south,east,north"
 *   agent_id   - optional: filter by agent's internal ID
 *   office_id  - optional: filter by office's internal ID
 *   agent_key  - optional: filter by CREA agent key
 *   office_key - optional: filter by CREA office key
 *   status     - optional: Active|Sold|Pending (default: Active)
 *   tt         - optional: sale|rent (transaction type)
 *   lp         - optional: min price
 *   hp         - optional: max price
 *   bd         - optional: min beds
 *   ba         - optional: min baths
 *   pt         - optional: property type
 *   limit      - optional: max results (default: 5000)
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams

    const bbox = params.get('bbox')
    if (!bbox) {
        return NextResponse.json({ error: 'bbox parameter is required (west,south,east,north)' }, { status: 400 })
    }

    const parts = bbox.split(',').map(Number)
    if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) {
        return NextResponse.json({ error: 'Invalid bbox format. Expected: west,south,east,north' }, { status: 400 })
    }

    const [west, south, east, north] = parts

    if (south < -90 || north > 90 || west < -180 || east > 180 || south >= north) {
        return NextResponse.json({ error: 'Invalid bbox coordinates' }, { status: 400 })
    }

    const rpcParams: Record<string, string | number | boolean> = {
        bbox_west: west,
        bbox_south: south,
        bbox_east: east,
        bbox_north: north,
    }

    const agentId = safeNum(params.get('agent_id'))
    const officeId = safeNum(params.get('office_id'))
    if (agentId) rpcParams.filter_agent_id = agentId
    if (officeId) rpcParams.filter_office_id = officeId

    const agentKey = params.get('agent_key')
    const officeKey = params.get('office_key')
    if (agentKey && KEY_PATTERN.test(agentKey)) rpcParams.filter_agent_key = agentKey
    if (officeKey && KEY_PATTERN.test(officeKey)) rpcParams.filter_office_key = officeKey

    const status = params.get('status')
    if (status && VALID_STATUSES.has(status)) rpcParams.filter_status = status

    const tt = params.get('tt')
    if (tt && VALID_TRANSACTION_TYPES.has(tt)) rpcParams.filter_tt = tt

    const lp = safeNum(params.get('lp'))
    const hp = safeNum(params.get('hp'))
    if (lp != null) rpcParams.filter_min_price = lp
    if (hp != null) rpcParams.filter_max_price = hp

    const bd = safeNum(params.get('bd'))
    const ba = safeNum(params.get('ba'))
    if (bd != null) rpcParams.filter_min_beds = bd
    if (ba != null) rpcParams.filter_min_baths = ba

    const pt = params.get('pt')
    if (pt && VALID_PROPERTY_TYPES.has(pt)) rpcParams.filter_property_type = pt

    const limit = safeNum(params.get('limit'))
    rpcParams.max_results = Math.min(limit || 5000, 10000)

    const maxResults = rpcParams.max_results as number
    const PAGE_SIZE = 1000

    try {
        const allRows: Record<string, unknown>[] = []
        let from = 0

        while (from < maxResults) {
            const to = Math.min(from + PAGE_SIZE - 1, maxResults - 1)
            const { data, error } = await supabase.rpc('get_listings_in_bbox', rpcParams).range(from, to)

            if (error) {
                console.error('Listings RPC error:', error)
                return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
            }

            const rows = data || []
            allRows.push(...rows)

            if (rows.length < PAGE_SIZE) break
            from += PAGE_SIZE
        }

        return NextResponse.json(
            { pins: allRows, totalCount: allRows.length },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error) {
        console.error('Listings query error:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
