import { describe, it, expect } from 'vitest'
import {
    odataString,
    buildODataFilter,
    normalizeDdfToPin,
    normalizeStatus,
    parseFilterParams,
    toMapPin,
    type ListingFilters,
    type Listing,
} from '../listings'

// ─── odataString ────────────────────────────────────────────────────────

describe('odataString', () => {
    it('returns the value unchanged when no single quotes', () => {
        expect(odataString('Kitchener')).toBe('Kitchener')
    })

    it('escapes single quotes by doubling them', () => {
        expect(odataString("O'Brien")).toBe("O''Brien")
    })

    it('handles multiple single quotes', () => {
        expect(odataString("it's a 'test'")).toBe("it''s a ''test''")
    })

    it('returns empty string unchanged', () => {
        expect(odataString('')).toBe('')
    })
})

// ─── normalizeStatus ────────────────────────────────────────────────────

describe('normalizeStatus', () => {
    it('returns Active for standard active status', () => {
        expect(normalizeStatus('Active')).toBe('Active')
    })

    it('returns Sold for sold status', () => {
        expect(normalizeStatus('Sold')).toBe('Sold')
    })

    it('returns Sold for closed status', () => {
        expect(normalizeStatus('Closed')).toBe('Sold')
    })

    it('returns Pending for pending status', () => {
        expect(normalizeStatus('Pending')).toBe('Pending')
    })

    it('returns Pending for contingent status', () => {
        expect(normalizeStatus('Contingent')).toBe('Pending')
    })

    it('is case-insensitive', () => {
        expect(normalizeStatus('SOLD')).toBe('Sold')
        expect(normalizeStatus('pending')).toBe('Pending')
    })

    it('returns Active for unknown status', () => {
        expect(normalizeStatus('SomethingElse')).toBe('Active')
    })

    it('handles empty string', () => {
        expect(normalizeStatus('')).toBe('Active')
    })
})

// ─── parseFilterParams ──────────────────────────────────────────────────

describe('parseFilterParams', () => {
    it('returns empty filters for empty params', () => {
        const result = parseFilterParams({})
        expect(result.minPrice).toBeUndefined()
        expect(result.maxPrice).toBeUndefined()
        expect(result.beds).toBeUndefined()
        expect(result.baths).toBeUndefined()
    })

    it('parses price filters', () => {
        const result = parseFilterParams({ lp: '200000', hp: '500000' })
        expect(result.minPrice).toBe(200000)
        expect(result.maxPrice).toBe(500000)
    })

    it('parses beds and baths', () => {
        const result = parseFilterParams({ bd: '3', ba: '2' })
        expect(result.beds).toBe(3)
        expect(result.baths).toBe(2)
    })

    it('parses property type and city', () => {
        const result = parseFilterParams({ pt: 'House', city: 'Kitchener' })
        expect(result.propertyType).toBe('House')
        expect(result.city).toBe('Kitchener')
    })

    it('parses transaction type', () => {
        const result = parseFilterParams({ tt: 'sale' })
        expect(result.transactionType).toBe('sale')
    })

    it('parses sort params', () => {
        const result = parseFilterParams({ sortField: 'listingPrice', sortDirection: 'asc' })
        expect(result.sortField).toBe('listingPrice')
        expect(result.sortDirection).toBe('asc')
    })

    it('rejects invalid property type', () => {
        const result = parseFilterParams({ pt: "House') or 1 eq 1 or ('x" })
        expect(result.propertyType).toBeUndefined()
    })

    it('rejects invalid building type', () => {
        const result = parseFilterParams({ bt: 'MaliciousValue' })
        expect(result.buildingType).toBeUndefined()
    })

    it('rejects invalid transaction type', () => {
        const result = parseFilterParams({ tt: 'steal' })
        expect(result.transactionType).toBeUndefined()
    })

    it('rejects invalid sort field', () => {
        const result = parseFilterParams({ sortField: 'DROP TABLE' })
        expect(result.sortField).toBeUndefined()
    })

    it('rejects invalid sort direction', () => {
        const result = parseFilterParams({ sortDirection: 'sideways' })
        expect(result.sortDirection).toBeUndefined()
    })

    it('returns undefined for non-numeric price values', () => {
        const result = parseFilterParams({ lp: 'abc', hp: 'not-a-number' })
        expect(result.minPrice).toBeUndefined()
        expect(result.maxPrice).toBeUndefined()
    })

    it('parses zero values correctly', () => {
        const result = parseFilterParams({ lp: '0', bd: '0', ba: '0' })
        expect(result.minPrice).toBe(0)
        expect(result.beds).toBe(0)
        expect(result.baths).toBe(0)
    })
})

// ─── buildODataFilter ───────────────────────────────────────────────────

describe('buildODataFilter', () => {
    it('includes default service area cities when no city specified', () => {
        const result = buildODataFilter({ transactionType: 'sale' })
        expect(result).toContain("City eq 'Kitchener'")
        expect(result).toContain("City eq 'Waterloo'")
        expect(result).toContain("City eq 'Toronto'")
    })

    it('uses specified city instead of default service area', () => {
        const result = buildODataFilter({ city: 'Hamilton', transactionType: 'sale' })
        expect(result).toContain("City eq 'Hamilton'")
        expect(result).not.toContain("City eq 'Kitchener'")
    })

    it('escapes OData injection in city name', () => {
        const result = buildODataFilter({ city: "O'Brien", transactionType: 'sale' })
        expect(result).toContain("City eq 'O''Brien'")
    })

    it('adds beds filter', () => {
        const result = buildODataFilter({ beds: 3, transactionType: 'sale' })
        expect(result).toContain('BedroomsTotal ge 3')
    })

    it('adds baths filter', () => {
        const result = buildODataFilter({ baths: 2, transactionType: 'sale' })
        expect(result).toContain('BathroomsTotalInteger ge 2')
    })

    it('filters sales by ListPrice', () => {
        const result = buildODataFilter({ transactionType: 'sale', minPrice: 200000, maxPrice: 500000 })
        expect(result).toContain('ListPrice gt 0')
        expect(result).toContain('ListPrice ge 200000')
        expect(result).toContain('ListPrice le 500000')
    })

    it('filters rentals by TotalActualRent', () => {
        const result = buildODataFilter({ transactionType: 'rent', minPrice: 1500, maxPrice: 3000 })
        expect(result).toContain('TotalActualRent gt 0')
        expect(result).toContain('TotalActualRent ge 1500')
        expect(result).toContain('TotalActualRent le 3000')
    })

    it('handles property type Land as PropertySubType', () => {
        const result = buildODataFilter({ propertyType: 'Land', transactionType: 'sale' })
        expect(result).toContain("PropertySubType eq 'Vacant Land'")
    })

    it('handles property type House as StructureType', () => {
        const result = buildODataFilter({ propertyType: 'House', transactionType: 'sale' })
        expect(result).toContain("StructureType/any(s: s eq 'House')")
    })

    it('escapes OData injection in property type', () => {
        const result = buildODataFilter({ propertyType: "Row / Town'house", transactionType: 'sale' })
        expect(result).toContain("StructureType/any(s: s eq 'Row / Town''house')")
    })

    it('handles "all" transaction type with price filters', () => {
        const result = buildODataFilter({ minPrice: 200000, maxPrice: 500000 })
        expect(result).toContain('ListPrice gt 0')
        expect(result).toContain('ListPrice ge 200000')
        expect(result).toContain('ListPrice le 500000')
        expect(result).toContain('TotalActualRent gt 0')
        expect(result).toContain('TotalActualRent ge 200000')
        expect(result).toContain('TotalActualRent le 500000')
    })

    it('handles "all" transaction type without price filters', () => {
        const result = buildODataFilter({})
        expect(result).toContain('(ListPrice gt 0 or TotalActualRent gt 0)')
    })

    it('includes beds filter with zero value', () => {
        const result = buildODataFilter({ beds: 0, transactionType: 'sale' })
        expect(result).toContain('BedroomsTotal ge 0')
    })

    it('includes min price filter with zero value', () => {
        const result = buildODataFilter({ transactionType: 'sale', minPrice: 0 })
        expect(result).toContain('ListPrice ge 0')
    })

    it('handles "all" transaction type with only maxPrice', () => {
        const result = buildODataFilter({ maxPrice: 500000 })
        expect(result).toContain('ListPrice le 500000')
        expect(result).toContain('TotalActualRent le 500000')
        expect(result).not.toContain('ListPrice ge')
        expect(result).not.toContain('TotalActualRent ge')
    })
})

// ─── normalizeDdfToPin ──────────────────────────────────────────────────

describe('normalizeDdfToPin', () => {
    const validDdfRecord = {
        ListingKey: 'ABC123',
        Latitude: 43.45,
        Longitude: -80.5,
        ListPrice: 500000,
        TotalActualRent: null,
        BedroomsTotal: 3,
        BathroomsTotalInteger: 2,
        LivingArea: 1500,
        StreetNumber: '123',
        StreetName: 'Main',
        StreetSuffix: 'St',
        UnitNumber: '',
        City: 'Kitchener',
        Media: [{ MediaCategory: 'Photo', MediaURL: 'https://example.com/photo.jpg', Order: 1 }],
        StructureType: ['House'],
        StandardStatus: 'Active',
        OriginalEntryTimestamp: '2025-03-01T12:00:00Z',
    }

    it('returns a valid MapPin for a complete record', () => {
        const pin = normalizeDdfToPin(validDdfRecord)
        expect(pin).not.toBeNull()
        expect(pin!.id).toBe('ABC123')
        expect(pin!.lat).toBe(43.45)
        expect(pin!.lng).toBe(-80.5)
        expect(pin!.price).toBe(500000)
        expect(pin!.beds).toBe(3)
        expect(pin!.baths).toBe(2)
        expect(pin!.address).toBe('123 Main St, Kitchener')
    })

    it('returns null when latitude is missing', () => {
        expect(normalizeDdfToPin({ ...validDdfRecord, Latitude: null })).toBeNull()
    })

    it('returns null when longitude is missing', () => {
        expect(normalizeDdfToPin({ ...validDdfRecord, Longitude: null })).toBeNull()
    })

    it('returns null for coordinates outside service area', () => {
        expect(normalizeDdfToPin({ ...validDdfRecord, Latitude: 42.0 })).toBeNull()
        expect(normalizeDdfToPin({ ...validDdfRecord, Latitude: 45.0 })).toBeNull()
        expect(normalizeDdfToPin({ ...validDdfRecord, Longitude: -82.0 })).toBeNull()
        expect(normalizeDdfToPin({ ...validDdfRecord, Longitude: -79.0 })).toBeNull()
    })

    it('detects rental by TotalActualRent with no ListPrice', () => {
        const rental = normalizeDdfToPin({
            ...validDdfRecord,
            ListPrice: null,
            TotalActualRent: 2500,
        })
        expect(rental!.isRental).toBe(true)
        expect(rental!.price).toBe(2500)
    })

    it('detects sale when ListPrice is set', () => {
        const pin = normalizeDdfToPin(validDdfRecord)
        expect(pin!.isRental).toBe(false)
    })

    it('includes unit number in address when present', () => {
        const pin = normalizeDdfToPin({ ...validDdfRecord, UnitNumber: '4B' })
        expect(pin!.address).toBe('123 Main St Unit 4B, Kitchener')
    })

    it('uses PropertySubType as fallback property type', () => {
        const pin = normalizeDdfToPin({
            ...validDdfRecord,
            StructureType: [],
            PropertySubType: 'Vacant Land',
        })
        expect(pin!.propertyType).toBe('Vacant Land')
    })

    it('defaults to Residential when no type info', () => {
        const pin = normalizeDdfToPin({
            ...validDdfRecord,
            StructureType: [],
            PropertySubType: undefined,
        })
        expect(pin!.propertyType).toBe('Residential')
    })
})

// ─── toMapPin ───────────────────────────────────────────────────────────

describe('toMapPin', () => {
    const baseListing: Listing = {
        id: 'L1',
        mlsNumber: 'MLS1',
        address: {
            full: '123 Main St, Kitchener, ON N2H 1A1',
            streetNumber: '123',
            streetName: 'Main St',
            unitNumber: null,
            city: 'Kitchener',
            province: 'ON',
            postalCode: 'N2H 1A1',
            neighbourhood: null,
        },
        price: 500000,
        latitude: 43.45,
        longitude: -80.5,
        isRental: false,
        rentPrice: null,
        rentFrequency: null,
        beds: 3,
        bedsAboveGrade: 3,
        bedsBelowGrade: 0,
        baths: 2,
        bathsFull: 2,
        bathsHalf: 0,
        sqft: 1500,
        lotSize: null,
        lotSizeDimensions: null,
        propertyType: 'House',
        buildingType: 'Single Family',
        storeys: '2',
        yearBuilt: 2010,
        description: 'A nice house',
        photos: ['https://example.com/photo.jpg'],
        listDate: '2025-03-01',
        daysOnMarket: 7,
        status: 'Active',
        virtualTour: null,
        constructionMaterial: null,
        foundation: null,
        roof: null,
        exteriorFeatures: null,
        flooring: null,
        interiorFeatures: null,
        appliances: null,
        basement: null,
        heating: null,
        heatingFuel: null,
        cooling: null,
        waterSource: null,
        sewer: null,
        parkingTotal: null,
        garageSpaces: null,
        parkingFeatures: null,
        taxAmount: null,
        taxYear: null,
        associationFee: null,
        associationFeeFrequency: null,
        rooms: [],
        roomsTotal: null,
        zoning: null,
        communityFeatures: null,
        poolFeatures: null,
        fencing: null,
        realtorCaUrl: 'https://www.realtor.ca/real-estate/L1',
        listingBrokerage: 'RE/MAX',
    }

    it('returns a valid MapPin for a listing with coordinates', () => {
        const pin = toMapPin(baseListing)
        expect(pin).not.toBeNull()
        expect(pin!.id).toBe('L1')
        expect(pin!.price).toBe(500000)
    })

    it('returns null when latitude is missing', () => {
        expect(toMapPin({ ...baseListing, latitude: null })).toBeNull()
    })

    it('returns null when longitude is missing', () => {
        expect(toMapPin({ ...baseListing, longitude: null })).toBeNull()
    })

    it('returns null for coordinates outside service area', () => {
        expect(toMapPin({ ...baseListing, latitude: 42.0 })).toBeNull()
    })
})
