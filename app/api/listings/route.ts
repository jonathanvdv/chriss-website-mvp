import { NextRequest, NextResponse } from 'next/server'
import { getAllMapPins, parseFilterParams, filterBySearchQuery, type MapPin } from '@/lib/listings'

// ─── Server-side pin cache ──────────────────────────────────────────────
// Caches the full DDF API result for 5 minutes per filter combination.
// This eliminates the 10-15s DDF fetch on every map pan/zoom/filter change.
const PIN_CACHE_TTL = 5 * 60 * 1000 // 5 minutes
const pinCache = new Map<string, { pins: MapPin[]; totalCount: number; expiresAt: number; promise?: Promise<{ pins: MapPin[]; totalCount: number }> }>()

function getCacheKey(filterObj: Record<string, string>): string {
    // Only include DDF-relevant filter keys (not bbox, q, sort — those are client-side)
    const relevant = ['tt', 'lp', 'hp', 'bd', 'ba', 'pt', 'bt', 'city'] as const
    return relevant.map(k => `${k}=${filterObj[k] || ''}`).join('&')
}

async function getCachedPins(filterObj: Record<string, string>): Promise<{ pins: MapPin[]; totalCount: number }> {
    const key = getCacheKey(filterObj)
    const cached = pinCache.get(key)

    // Return fresh cache immediately
    if (cached && Date.now() < cached.expiresAt) {
        return { pins: cached.pins, totalCount: cached.totalCount }
    }

    // If stale cache exists, return it immediately and refresh in background
    if (cached && cached.pins.length > 0) {
        if (!cached.promise) {
            cached.promise = fetchAndCache(filterObj, key)
        }
        return { pins: cached.pins, totalCount: cached.totalCount }
    }

    // No cache at all — must wait for fetch
    // Deduplicate concurrent requests for the same key
    if (cached?.promise) {
        return cached.promise
    }

    const promise = fetchAndCache(filterObj, key)
    pinCache.set(key, { pins: [], totalCount: 0, expiresAt: 0, promise })
    return promise
}

async function fetchAndCache(filterObj: Record<string, string>, key: string): Promise<{ pins: MapPin[]; totalCount: number }> {
    try {
        const filters = parseFilterParams(filterObj)
        const result = await getAllMapPins(filters)
        pinCache.set(key, { pins: result.pins, totalCount: result.totalCount, expiresAt: Date.now() + PIN_CACHE_TTL })
        return result
    } catch (error) {
        pinCache.delete(key)
        throw error
    }
}

/**
 * GET /api/listings?bbox=lng1,lat1,lng2,lat2
 *
 * Returns listings within a bounding box via DDF API.
 * Filters are passed as query params (tt, lp, hp, bd, ba, pt).
 */
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams

    // Build filter params from query string
    const filterObj: Record<string, string> = {}
    for (const key of ['tt', 'lp', 'hp', 'bd', 'ba', 'pt', 'bt', 'city', 'q']) {
        const val = params.get(key)
        if (val) filterObj[key] = val
    }

    try {
        const searchQuery = filterObj.q
        delete filterObj.q // Don't pass to OData or cache key

        const { pins } = await getCachedPins(filterObj)

        // Filter by search query (address matching)
        let filteredPins = filterBySearchQuery(pins, searchQuery)

        // If bbox is provided, filter by bounds
        const bbox = params.get('bbox')
        if (bbox) {
            const [west, south, east, north] = bbox.split(',').map(Number)
            if (![west, south, east, north].some(isNaN)) {
                filteredPins = filteredPins.filter(p =>
                    p.lat >= south && p.lat <= north &&
                    p.lng >= west && p.lng <= east
                )
            }
        }

        return NextResponse.json(
            { pins: filteredPins, totalCount: filteredPins.length },
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
                },
            }
        )
    } catch (error) {
        console.error('Listings query error:', error)
        return NextResponse.json({ pins: [], totalCount: 0 }, { status: 500 })
    }
}
