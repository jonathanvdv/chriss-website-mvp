import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

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

    const [west, south, east, north] = bbox.split(',').map(Number)
    if ([west, south, east, north].some(isNaN)) {
        return NextResponse.json({ error: 'Invalid bbox format. Expected: west,south,east,north' }, { status: 400 })
    }

    const rpcParams: Record<string, any> = {
        bbox_west: west,
        bbox_south: south,
        bbox_east: east,
        bbox_north: north,
    }

    const agentId = params.get('agent_id')
    const officeId = params.get('office_id')
    const agentKey = params.get('agent_key')
    const officeKey = params.get('office_key')

    if (agentId) rpcParams.filter_agent_id = Number(agentId)
    if (officeId) rpcParams.filter_office_id = Number(officeId)
    if (agentKey) rpcParams.filter_agent_key = agentKey
    if (officeKey) rpcParams.filter_office_key = officeKey

    const status = params.get('status')
    if (status) rpcParams.filter_status = status

    const tt = params.get('tt')
    if (tt) rpcParams.filter_tt = tt

    const lp = params.get('lp')
    const hp = params.get('hp')
    if (lp) rpcParams.filter_min_price = Number(lp)
    if (hp) rpcParams.filter_max_price = Number(hp)

    const bd = params.get('bd')
    const ba = params.get('ba')
    if (bd) rpcParams.filter_min_beds = Number(bd)
    if (ba) rpcParams.filter_min_baths = Number(ba)

    const pt = params.get('pt')
    if (pt) rpcParams.filter_property_type = pt

    rpcParams.max_results = Math.min(Number(params.get('limit') || 5000), 10000)

    try {
        const { data, error } = await supabase.rpc('get_listings_in_bbox', rpcParams)

        if (error) {
            console.error('Listings RPC error:', error)
            return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
        }

        return NextResponse.json(
            { pins: data || [], totalCount: data?.length || 0 },
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
