import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export const revalidate = 300

/**
 * GET /api/listings/map-pins
 *
 * Legacy-compatible endpoint. Returns all active pins (large default bbox).
 * For the new bbox-based endpoint, use GET /api/listings?bbox=...
 */
export async function GET(request: NextRequest) {
    try {
        // Use a large bbox covering the service area
        const { data, error } = await supabase.rpc('get_listings_in_bbox', {
            bbox_west: -81.0,
            bbox_south: 43.0,
            bbox_east: -79.5,
            bbox_north: 44.0,
            filter_status: 'Active',
            max_results: 5000,
        })

        if (error) throw error

        return NextResponse.json({
            pins: data || [],
            totalCount: data?.length || 0,
        })
    } catch (error) {
        console.error('Map pins query error:', error)
        // Fallback to DDF direct fetch if DB is not available
        const { getAllMapPins } = await import('@/lib/listings')
        const { pins, totalCount } = await getAllMapPins()
        return NextResponse.json({ pins, totalCount })
    }
}
