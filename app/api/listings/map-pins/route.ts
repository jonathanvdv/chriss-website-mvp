import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'
import { SERVICE_AREA_BBOX } from '@/lib/constants'

export const revalidate = 300

/**
 * GET /api/listings/map-pins
 *
 * Legacy-compatible endpoint. Returns all active pins (large default bbox).
 * For the new bbox-based endpoint, use GET /api/listings?bbox=...
 */
export async function GET(_request: NextRequest) {
    const PAGE_SIZE = 1000
    const MAX_RESULTS = 5000
    const rpcParams = {
        bbox_west: SERVICE_AREA_BBOX.west,
        bbox_south: SERVICE_AREA_BBOX.south,
        bbox_east: SERVICE_AREA_BBOX.east,
        bbox_north: SERVICE_AREA_BBOX.north,
        filter_status: 'Active',
        max_results: MAX_RESULTS,
    }

    try {
        const allRows: Record<string, unknown>[] = []
        let from = 0

        while (from < MAX_RESULTS) {
            const to = Math.min(from + PAGE_SIZE - 1, MAX_RESULTS - 1)
            const { data, error } = await supabase.rpc('get_listings_in_bbox', rpcParams).range(from, to)

            if (error) throw error

            const rows = data || []
            allRows.push(...rows)

            if (rows.length < PAGE_SIZE) break
            from += PAGE_SIZE
        }

        return NextResponse.json({
            pins: allRows,
            totalCount: allRows.length,
        })
    } catch (error) {
        console.error('Map pins query error:', error)
        // Fallback to DDF direct fetch if DB is not available
        const { getAllMapPins } = await import('@/lib/listings')
        const { pins, totalCount } = await getAllMapPins()
        return NextResponse.json({ pins, totalCount })
    }
}
