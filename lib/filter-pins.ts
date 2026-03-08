import type { MapPin } from '@/lib/listings'

/** Client-side filter: apply transaction type, price, beds, baths, property type, and sort. */
export function filterPins(pins: MapPin[], params: Record<string, string>): MapPin[] {
    let result = pins

    const tt = params.tt
    if (tt === 'sale') result = result.filter(p => !p.isRental)
    else if (tt === 'rent') result = result.filter(p => p.isRental)

    const lp = params.lp ? Number(params.lp) : 0
    const hp = params.hp ? Number(params.hp) : 0
    if (lp) result = result.filter(p => p.price >= lp)
    if (hp) result = result.filter(p => p.price <= hp)

    const bd = params.bd ? Number(params.bd) : 0
    if (bd) result = result.filter(p => p.beds >= bd)

    const ba = params.ba ? Number(params.ba) : 0
    if (ba) result = result.filter(p => p.baths >= ba)

    const pt = params.pt
    if (pt) result = result.filter(p => p.propertyType === pt)

    // Sort
    const sortField = params.sortField
    const sortDir = params.sortDirection || 'desc'
    if (sortField === 'listingPrice') {
        result = [...result].sort((a, b) => sortDir === 'asc' ? a.price - b.price : b.price - a.price)
    } else {
        // Default: newest first (by listDate)
        result = [...result].sort((a, b) => {
            const da = a.listDate ? new Date(a.listDate).getTime() : 0
            const db = b.listDate ? new Date(b.listDate).getTime() : 0
            return sortDir === 'asc' ? da - db : db - da
        })
    }

    return result
}
