import { NextRequest, NextResponse } from 'next/server'
import { getAllMapPins } from '@/lib/listings'

export const revalidate = 300

/**
 * GET /api/listings/map-pins
 *
 * Returns all active map pins for the service area via DDF.
 */
export async function GET(_request: NextRequest) {
    try {
        const { pins, totalCount } = await getAllMapPins()
        return NextResponse.json({ pins, totalCount })
    } catch (error) {
        console.error('Map pins error:', error)
        return NextResponse.json({ pins: [], totalCount: 0 })
    }
}
