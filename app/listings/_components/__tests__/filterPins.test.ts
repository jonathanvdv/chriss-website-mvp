import { describe, it, expect } from 'vitest'
import { filterPins } from '../MapView'
import type { MapPin } from '@/lib/listings'

function makePin(overrides: Partial<MapPin> = {}): MapPin {
    return {
        id: 'pin-1',
        lat: 43.45,
        lng: -80.5,
        price: 500000,
        beds: 3,
        baths: 2,
        sqft: 1500,
        address: '123 Main St, Kitchener',
        photo: 'https://example.com/photo.jpg',
        propertyType: 'House',
        isRental: false,
        status: 'Active',
        listDate: '2025-03-01',
        ...overrides,
    }
}

describe('filterPins', () => {
    const pins: MapPin[] = [
        makePin({ id: '1', price: 300000, beds: 2, baths: 1, isRental: false, propertyType: 'Apartment' }),
        makePin({ id: '2', price: 500000, beds: 3, baths: 2, isRental: false, propertyType: 'House' }),
        makePin({ id: '3', price: 700000, beds: 4, baths: 3, isRental: false, propertyType: 'House' }),
        makePin({ id: '4', price: 2500, beds: 1, baths: 1, isRental: true, propertyType: 'Apartment' }),
    ]

    it('returns all pins with no filters', () => {
        expect(filterPins(pins, {})).toHaveLength(4)
    })

    it('filters by transaction type sale', () => {
        const result = filterPins(pins, { tt: 'sale' })
        expect(result).toHaveLength(3)
        expect(result.every(p => !p.isRental)).toBe(true)
    })

    it('filters by transaction type rent', () => {
        const result = filterPins(pins, { tt: 'rent' })
        expect(result).toHaveLength(1)
        expect(result[0].isRental).toBe(true)
    })

    it('filters by min price', () => {
        const result = filterPins(pins, { lp: '400000' })
        expect(result).toHaveLength(2)
        expect(result.every(p => p.price >= 400000)).toBe(true)
    })

    it('filters by max price', () => {
        const result = filterPins(pins, { hp: '500000' })
        expect(result).toHaveLength(3)
        expect(result.every(p => p.price <= 500000)).toBe(true)
    })

    it('filters by min beds', () => {
        const result = filterPins(pins, { bd: '3' })
        expect(result).toHaveLength(2)
        expect(result.every(p => p.beds >= 3)).toBe(true)
    })

    it('filters by min baths', () => {
        const result = filterPins(pins, { ba: '2' })
        expect(result).toHaveLength(2)
        expect(result.every(p => p.baths >= 2)).toBe(true)
    })

    it('filters by property type', () => {
        const result = filterPins(pins, { pt: 'House' })
        expect(result).toHaveLength(2)
        expect(result.every(p => p.propertyType === 'House')).toBe(true)
    })

    it('combines multiple filters', () => {
        const result = filterPins(pins, { tt: 'sale', lp: '400000', bd: '3' })
        expect(result).toHaveLength(2)
    })

    it('sorts by price ascending', () => {
        const result = filterPins(pins, { sortField: 'listingPrice', sortDirection: 'asc' })
        for (let i = 1; i < result.length; i++) {
            expect(result[i].price).toBeGreaterThanOrEqual(result[i - 1].price)
        }
    })

    it('sorts by price descending', () => {
        const result = filterPins(pins, { sortField: 'listingPrice', sortDirection: 'desc' })
        for (let i = 1; i < result.length; i++) {
            expect(result[i].price).toBeLessThanOrEqual(result[i - 1].price)
        }
    })

    it('sorts by date descending by default', () => {
        const dated = [
            makePin({ id: 'a', listDate: '2025-01-01' }),
            makePin({ id: 'b', listDate: '2025-03-01' }),
            makePin({ id: 'c', listDate: '2025-02-01' }),
        ]
        const result = filterPins(dated, {})
        expect(result[0].id).toBe('b')
        expect(result[1].id).toBe('c')
        expect(result[2].id).toBe('a')
    })
})
