const DDF_TOKEN_URL = 'https://identity.crea.ca/connect/token'
const DDF_API_BASE = 'https://ddfapi.realtor.ca/odata/v1'
const DDF_CLIENT_ID = process.env.DDF_CLIENT_ID || ''
const DDF_CLIENT_SECRET = process.env.DDF_CLIENT_SECRET || ''

// ─── Token Cache ─────────────────────────────────────────────────────────
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

    if (!res.ok) {
        console.error('DDF token error:', res.status, res.statusText)
        throw new Error('Failed to authenticate with CREA DDF')
    }

    const data = await res.json()
    cachedToken = data.access_token
    // Token lasts 60 min, refresh 5 min early
    tokenExpiry = Date.now() + 55 * 60 * 1000
    return cachedToken!
}

// ─── Types ──────────────────────────────────────────────────────────────

export interface MapPin {
    id: string
    lat: number
    lng: number
    price: number
    beds: number
    baths: number
    sqft: number | null
    address: string
    photo: string
    propertyType: string
    isRental: boolean
    status: 'Active' | 'Sold' | 'Pending'
    listDate: string
}

export interface Room {
    type: string
    level: string
    dimensions: string
    description: string
}

export interface Listing {
    id: string
    mlsNumber: string
    address: {
        full: string
        streetNumber: string
        streetName: string
        unitNumber: string | null
        city: string
        province: string
        postalCode: string
        neighbourhood: string | null
    }
    price: number
    latitude: number | null
    longitude: number | null
    isRental: boolean
    rentPrice: number | null
    rentFrequency: string | null
    beds: number
    bedsAboveGrade: number | null
    bedsBelowGrade: number | null
    baths: number
    bathsFull: number | null
    bathsHalf: number | null
    sqft: number | null
    lotSize: string | null
    lotSizeDimensions: string | null
    propertyType: string
    buildingType: string | null
    storeys: string | null
    yearBuilt: number | null
    description: string
    photos: string[]
    listDate: string
    daysOnMarket: number
    status: 'Active' | 'Sold' | 'Pending'
    virtualTour: string | null
    // Building & structure
    constructionMaterial: string | null
    foundation: string | null
    roof: string | null
    exteriorFeatures: string | null
    // Interior
    flooring: string | null
    interiorFeatures: string | null
    appliances: string | null
    basement: string | null
    // Utilities
    heating: string | null
    heatingFuel: string | null
    cooling: string | null
    waterSource: string | null
    sewer: string | null
    // Parking
    parkingTotal: number | null
    garageSpaces: number | null
    parkingFeatures: string | null
    // Financial
    taxAmount: number | null
    taxYear: number | null
    associationFee: number | null
    associationFeeFrequency: string | null
    // Rooms
    rooms: Room[]
    roomsTotal: number | null
    // Misc
    zoning: string | null
    communityFeatures: string | null
    poolFeatures: string | null
    fencing: string | null
    // Required
    realtorCaUrl: string
    listingBrokerage: string
}

export interface ListingFilters {
    minPrice?: number
    maxPrice?: number
    beds?: number
    baths?: number
    propertyType?: string // StructureType: House, Apartment, Row / Townhouse, etc.
    buildingType?: string // PropertySubType: Single Family, Multi-family, etc.
    city?: string
    transactionType?: 'sale' | 'rent'
    storeys?: number
    yearBuilt?: number
    limit?: number
    offset?: number
    sortField?: 'listingPrice' | 'listingDate'
    sortDirection?: 'asc' | 'desc'
}

// ─── Build OData filter string ──────────────────────────────────────────

// StructureType values (Collection enum): House, Apartment, Row / Townhouse, Duplex, Triplex, etc.
// Land uses PropertySubType 'Vacant Land' since it has no StructureType

const SERVICE_AREA_CITIES = ['Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Brampton', 'Mississauga', 'Toronto']

/** Escape a value for use inside an OData single-quoted string literal. */
export function odataString(value: string): string {
    return value.replace(/'/g, "''")
}

/** Validate that a value is a finite number before interpolating into OData. */
function safeNum(value: number | undefined): number | undefined {
    if (value === undefined) return undefined
    return Number.isFinite(value) ? value : undefined
}

export function buildODataFilter(filters: ListingFilters): string {
    const parts: string[] = []

    const beds = safeNum(filters.beds)
    const baths = safeNum(filters.baths)
    const storeys = safeNum(filters.storeys)
    const yearBuilt = safeNum(filters.yearBuilt)
    const minPrice = safeNum(filters.minPrice)
    const maxPrice = safeNum(filters.maxPrice)

    if (beds != null) parts.push(`BedroomsTotal ge ${beds}`)
    if (baths != null) parts.push(`BathroomsTotalInteger ge ${baths}`)

    if (filters.propertyType) {
        if (filters.propertyType === 'Land') {
            parts.push(`PropertySubType eq 'Vacant Land'`)
        } else {
            parts.push(`StructureType/any(s: s eq '${odataString(filters.propertyType)}')`)
        }
    }
    if (filters.buildingType) parts.push(`PropertySubType eq '${odataString(filters.buildingType)}'`)
    if (storeys != null) parts.push(`Stories ge ${storeys}`)
    if (yearBuilt != null) parts.push(`YearBuilt ge ${yearBuilt}`)

    // Transaction type filtering
    // Rentals: ListPrice is null, price is in TotalActualRent
    // Sales: ListPrice has the value, TotalActualRent is null/0
    if (filters.transactionType === 'sale') {
        parts.push('ListPrice gt 0')
        if (minPrice != null) parts.push(`ListPrice ge ${minPrice}`)
        if (maxPrice != null) parts.push(`ListPrice le ${maxPrice}`)
    } else if (filters.transactionType === 'rent') {
        parts.push('TotalActualRent gt 0')
        if (minPrice != null) parts.push(`TotalActualRent ge ${minPrice}`)
        if (maxPrice != null) parts.push(`TotalActualRent le ${maxPrice}`)
    } else {
        // "All" — include sales and rentals, with proper price filtering on each field
        if (minPrice != null || maxPrice != null) {
            const saleParts = ['ListPrice gt 0']
            const rentParts = ['TotalActualRent gt 0']
            if (minPrice != null) {
                saleParts.push(`ListPrice ge ${minPrice}`)
                rentParts.push(`TotalActualRent ge ${minPrice}`)
            }
            if (maxPrice != null) {
                saleParts.push(`ListPrice le ${maxPrice}`)
                rentParts.push(`TotalActualRent le ${maxPrice}`)
            }
            parts.push(`((${saleParts.join(' and ')}) or (${rentParts.join(' and ')}))`)
        } else {
            parts.push('(ListPrice gt 0 or TotalActualRent gt 0)')
        }
    }

    if (filters.city) {
        parts.push(`City eq '${odataString(filters.city)}'`)
    } else {
        // Default to Abdul's service area
        const cityFilter = SERVICE_AREA_CITIES.map((c) => `City eq '${odataString(c)}'`).join(' or ')
        parts.push(`(${cityFilter})`)
    }

    return parts.join(' and ')
}

function buildODataOrderBy(filters: ListingFilters): string {
    const dir = filters.sortDirection || 'desc'
    if (filters.sortField === 'listingPrice') return `ListPrice ${dir}`
    return `OriginalEntryTimestamp ${dir}`
}

// ─── Fetch All Listings ──────────────────────────────────────────────────

/**
 * Fetches listings from the CREA DDF API or mock data source based on provided filters.
 * Supports pagination, sorting, and various property attribute filters.
 *
 * @param filters - Criteria to filter and paginate results
 * @returns Object containing the listings array and the total count of matches
 */
export async function getListings(filters: ListingFilters = {}): Promise<{ listings: Listing[]; totalCount: number }> {
    if (!DDF_CLIENT_ID) {
        // DDF credentials not configured — fall back to mock data
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        return { listings: paginateMockResults(filtered, filters), totalCount: filtered.length }
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$top', (filters.limit || 12).toString())
    if (filters.offset) params.set('$skip', filters.offset.toString())
    params.set('$count', 'true')

    const filter = buildODataFilter(filters)
    if (filter) params.set('$filter', filter)
    params.set('$orderby', buildODataOrderBy(filters))

    const url = `${DDF_API_BASE}/Property?${params.toString()}`
    let res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    // Retry once on 401 with a fresh token
    if (res.status === 401) {
        cachedToken = null
        tokenExpiry = 0
        const freshToken = await getDdfToken()
        res = await fetch(url, {
            headers: { Authorization: `Bearer ${freshToken}` },
            next: { revalidate: 300 },
        })
    }

    if (!res.ok) {
        const body = await res.text()
        console.error('DDF API error:', res.status, url, body)
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        return { listings: paginateMockResults(filtered, filters), totalCount: filtered.length }
    }

    const data = await res.json()
    const listings = (data.value || []).map(normalizeDdfListing)
    const totalCount = data['@odata.count'] ?? listings.length

    // Post-fetch sort by price since rentals use TotalActualRent, not ListPrice
    if (filters.sortField === 'listingPrice') {
        const dir = filters.sortDirection || 'desc'
        listings.sort((a: Listing, b: Listing) => (dir === 'asc' ? a.price - b.price : b.price - a.price))
    }

    return { listings, totalCount }
}

// ─── Fetch All Listings (batched) ────────────────────────────────────────

const DDF_PAGE_LIMIT = 100

/**
 * Fetches ALL listings matching filters by batching paginated requests in parallel.
 * Used for map view where we need every listing for clustering.
 * Results are cached via Next.js revalidate for 5 minutes.
 */
export async function getAllListings(
    filters: ListingFilters = {}
): Promise<{ listings: Listing[]; totalCount: number }> {
    if (!DDF_CLIENT_ID) {
        // DDF credentials not configured — fall back to mock data
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        return { listings: paginateMockResults(filtered, filters), totalCount: filtered.length }
    }

    const token = await getDdfToken()
    const filterStr = buildODataFilter(filters)
    const orderBy = buildODataOrderBy(filters)

    // First request: get page 1 + total count
    const firstParams = new URLSearchParams()
    firstParams.set('$top', DDF_PAGE_LIMIT.toString())
    firstParams.set('$count', 'true')
    if (filterStr) firstParams.set('$filter', filterStr)
    firstParams.set('$orderby', orderBy)

    const firstUrl = `${DDF_API_BASE}/Property?${firstParams.toString()}`
    const firstRes = await fetch(firstUrl, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (firstRes.status === 401) {
        // Token may be stale — force refresh and retry once
        cachedToken = null
        tokenExpiry = 0
        const freshToken = await getDdfToken()
        const retryRes = await fetch(firstUrl, {
            headers: { Authorization: `Bearer ${freshToken}` },
            next: { revalidate: 300 },
        })
        if (!retryRes.ok) {
            const body = await retryRes.text()
            console.error('DDF API error (batch first, after retry):', retryRes.status, body)
            const { mockListings } = await import('./mock-listings')
            const filtered = applyMockFilters(mockListings, filters)
            return { listings: paginateMockResults(filtered, filters), totalCount: filtered.length }
        }
        const retryData = await retryRes.json()
        const retryTotal: number = retryData['@odata.count'] ?? 0
        const retryBatch: Listing[] = (retryData.value || []).map(normalizeDdfListing)
        // Continue with fresh token for remaining batches
        return fetchRemainingBatches(retryBatch, retryTotal, freshToken, firstParams, filterStr, orderBy, filters)
    }

    if (!firstRes.ok) {
        const body = await firstRes.text()
        console.error('DDF API error (batch first):', firstRes.status, body)
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        return { listings: paginateMockResults(filtered, filters), totalCount: filtered.length }
    }

    const firstData = await firstRes.json()
    const totalCount: number = firstData['@odata.count'] ?? 0
    const firstBatch: Listing[] = (firstData.value || []).map(normalizeDdfListing)

    return fetchRemainingBatches(firstBatch, totalCount, token, firstParams, filterStr, orderBy, filters)
}

async function fetchRemainingBatches(
    firstBatch: Listing[],
    totalCount: number,
    token: string,
    baseParams: URLSearchParams,
    _filterStr: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    _orderBy: string, // eslint-disable-line @typescript-eslint/no-unused-vars
    _filters: ListingFilters // eslint-disable-line @typescript-eslint/no-unused-vars
): Promise<{ listings: Listing[]; totalCount: number }> {
    if (totalCount <= DDF_PAGE_LIMIT) {
        return { listings: firstBatch, totalCount }
    }

    const remainingPages = Math.ceil((totalCount - DDF_PAGE_LIMIT) / DDF_PAGE_LIMIT)
    const batchPromises = Array.from({ length: remainingPages }, (_, i) => {
        const skip = (i + 1) * DDF_PAGE_LIMIT
        const params = new URLSearchParams(baseParams)
        params.delete('$count')
        params.set('$skip', skip.toString())

        const url = `${DDF_API_BASE}/Property?${params.toString()}`
        return fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        }).then(async (res) => {
            if (!res.ok) {
                console.error('DDF batch error:', res.status, `skip=${skip}`)
                return []
            }
            const data = await res.json()
            return (data.value || []).map(normalizeDdfListing)
        })
    })

    const batches = await Promise.all(batchPromises)
    const allListings = [firstBatch, ...batches].flat()
    return { listings: allListings, totalCount }
}

// ─── Fetch Single Listing ────────────────────────────────────────────────

/**
 * Retrieves detailed information for a single listing by its unique ID.
 *
 * @param listingId - The unique identifier (ListingKey) of the property
 * @returns The normalized listing object
 */
export async function getListing(listingId: string): Promise<Listing> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        const found = mockListings.find((l) => l.id === listingId)
        if (!found) throw new Error('Listing not found')
        return found
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$filter', `ListingKey eq '${odataString(listingId)}'`)
    params.set('$expand', 'Rooms')

    let res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    // If $expand=Rooms isn't supported, retry without it
    if (!res.ok) {
        params.delete('$expand')
        res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` },
            next: { revalidate: 300 },
        })
    }

    if (!res.ok) throw new Error(`Listing not found: ${listingId}`)

    const data = await res.json()
    if (!data.value || data.value.length === 0) throw new Error('Listing not found')
    return normalizeDdfListing(data.value[0])
}

// ─── Fetch Featured Listings ─────────────────────────────────────────────

/**
 * Fetches a list of featured listings, typically displayed on the home page.
 * Defaults to recent listings in Abdul's core service area.
 *
 * @param limit - Maximum number of featured listings to return
 * @returns Array of featured listing objects
 */
export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        return mockListings.slice(0, limit)
    }

    // Get most recent active residential listings in Abdul's service area
    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$top', limit.toString())
    params.set('$filter', "(City eq 'Kitchener' or City eq 'Waterloo' or City eq 'Cambridge') and ListPrice gt 200000")
    params.set('$orderby', 'ModificationTimestamp desc')

    const res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (!res.ok) {
        console.error('DDF featured error:', res.status)
        return []
    }

    const data = await res.json()
    return (data.value || []).map(normalizeDdfListing)
}

// ─── Fetch Abdul's Own Listings ──────────────────────────────────────────

const AGENT_KEY = process.env.AGENT_KEY || ''

/**
 * Fetches listings belonging to the configured agent (AGENT_KEY env var).
 *
 * @returns Array of listings where the agent is the primary listing agent
 */
export async function getAgentListings(): Promise<Listing[]> {
    if (!DDF_CLIENT_ID || !AGENT_KEY) {
        const { mockListings } = await import('./mock-listings')
        return mockListings.slice(0, 6)
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$top', '50')
    params.set('$filter', `ListAgentKey eq '${odataString(AGENT_KEY)}'`)
    params.set('$orderby', 'ModificationTimestamp desc')

    const res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (!res.ok) {
        console.error('DDF agent listings error:', res.status)
        return []
    }

    const data = await res.json()
    return (data.value || []).map(normalizeDdfListing)
}

// ─── Normalize DDF RESO response to our Listing type ─────────────────────

// Helper: coerce DDF value (string | array | null) to a display string
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ddfStr(val: any): string | null {
    if (!val) return null
    if (Array.isArray(val)) return val.join(', ')
    return String(val)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDdfListing(raw: any): Listing {
    const streetNum = raw.StreetNumber || ''
    const streetName = raw.StreetName || ''
    const streetSuffix = raw.StreetSuffix || ''
    const unit = raw.UnitNumber || null
    const city = raw.City || ''
    const province = raw.StateOrProvince || 'ON'
    const postal = raw.PostalCode || ''

    const unitPart = unit ? ` Unit ${unit}` : ''
    const fullAddress = `${streetNum} ${streetName} ${streetSuffix}${unitPart}, ${city}, ${province} ${postal}`.trim()

    /* eslint-disable @typescript-eslint/no-explicit-any */
    // Media array from DDF — filter to actual image URLs only
    const photos = (raw.Media || [])
        .filter(
            (m: any) => m.MediaCategory === 'Photo' || (m.MediaURL && /\.(jpg|jpeg|png|webp|gif)/i.test(m.MediaURL))
        )
        .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0))
        .map((m: any) => m.MediaURL)
        .filter(Boolean)

    // Calculate days on market
    const listDate = raw.OriginalEntryTimestamp || ''
    const dom = listDate ? Math.floor((Date.now() - new Date(listDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

    // Parse rooms from $expand=Rooms
    const rooms: Room[] = (raw.Rooms || []).map((r: any) => ({
        type: r.RoomType || 'Room',
        level: r.RoomLevel || '',
        dimensions: r.RoomDimensions || (r.RoomLength && r.RoomWidth ? `${r.RoomLength} x ${r.RoomWidth}` : ''),
        description: r.RoomDescription || '',
    }))
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return {
        id: raw.ListingKey,
        mlsNumber: raw.ListingId || raw.ListingKey,
        address: {
            full: fullAddress,
            streetNumber: streetNum,
            streetName: `${streetName} ${streetSuffix}`.trim(),
            unitNumber: unit,
            city,
            province,
            postalCode: postal,
            neighbourhood: raw.MLSAreaMinor || raw.SubdivisionName || null,
        },
        price: raw.ListPrice || raw.TotalActualRent || 0,
        latitude: raw.Latitude ?? null,
        longitude: raw.Longitude ?? null,
        isRental: !raw.ListPrice && !!raw.TotalActualRent,
        rentPrice: raw.TotalActualRent || null,
        rentFrequency: raw.LeaseAmountFrequency || null,
        beds: raw.BedroomsTotal || 0,
        bedsAboveGrade: raw.BedroomsAboveGrade ?? null,
        bedsBelowGrade: raw.BedroomsBelowGrade ?? null,
        baths: raw.BathroomsTotalInteger || 0,
        bathsFull: raw.BathroomsFull ?? null,
        bathsHalf: raw.BathroomsHalf ?? null,
        sqft: raw.LivingArea || raw.BuildingAreaTotal || null,
        lotSize: raw.LotSizeArea ? `${raw.LotSizeArea}` : null,
        lotSizeDimensions: raw.LotSizeDimensions || null,
        propertyType:
            (Array.isArray(raw.StructureType) && raw.StructureType[0]) || raw.PropertySubType || 'Residential',
        buildingType: raw.PropertySubType || null,
        storeys: ddfStr(raw.StoriesTotal || raw.Stories),
        yearBuilt: raw.YearBuilt || null,
        description: raw.PublicRemarks || '',
        photos,
        listDate,
        daysOnMarket: dom,
        status: normalizeStatus(raw.StandardStatus || ''),
        virtualTour: raw.VirtualTourURLUnbranded || raw.VirtualTourURLBranded || null,
        // Building
        constructionMaterial: ddfStr(raw.ConstructionMaterials),
        foundation: ddfStr(raw.FoundationDetails || raw.Foundation),
        roof: ddfStr(raw.Roof),
        exteriorFeatures: ddfStr(raw.ExteriorFeatures),
        // Interior
        flooring: ddfStr(raw.Flooring),
        interiorFeatures: ddfStr(raw.InteriorFeatures),
        appliances: ddfStr(raw.Appliances),
        basement: ddfStr(raw.Basement),
        // Utilities
        heating: ddfStr(raw.Heating),
        heatingFuel: ddfStr(raw.HeatingFuel),
        cooling: ddfStr(raw.Cooling),
        waterSource: ddfStr(raw.WaterSource),
        sewer: ddfStr(raw.Sewer),
        // Parking
        parkingTotal: raw.ParkingTotal ?? raw.ParkingSpaces ?? null,
        garageSpaces: raw.GarageSpaces ?? null,
        parkingFeatures: ddfStr(raw.ParkingFeatures),
        // Financial
        taxAmount: raw.TaxAnnualAmount ?? null,
        taxYear: raw.TaxYear ?? null,
        associationFee: raw.AssociationFee ?? null,
        associationFeeFrequency: raw.AssociationFeeFrequency || null,
        // Rooms
        rooms,
        roomsTotal: raw.RoomsTotal ?? null,
        // Misc
        zoning: raw.Zoning || raw.ZoningDescription || null,
        communityFeatures: ddfStr(raw.CommunityFeatures),
        poolFeatures: ddfStr(raw.PoolFeatures),
        fencing: ddfStr(raw.Fencing),
        // Required
        realtorCaUrl: raw.ListingURL
            ? `https://${raw.ListingURL}`
            : `https://www.realtor.ca/real-estate/${raw.ListingKey}`,
        listingBrokerage: raw.ListOfficeName || '',
    }
}

export function normalizeStatus(status: string): 'Active' | 'Sold' | 'Pending' {
    const s = (status || '').toLowerCase()
    if (s.includes('sold') || s.includes('closed')) return 'Sold'
    if (s.includes('pending') || s.includes('contingent')) return 'Pending'
    return 'Active'
}

// ─── MapPin helper ───────────────────────────────────────────────────────

export function toMapPin(listing: Listing): MapPin | null {
    if (!listing.latitude || !listing.longitude) return null
    // Exclude outliers outside the KW / Southern Ontario service area
    if (listing.latitude < 43.0 || listing.latitude > 44.0 || listing.longitude < -81.0 || listing.longitude > -79.5)
        return null
    return {
        id: listing.id,
        lat: listing.latitude,
        lng: listing.longitude,
        price: listing.price,
        beds: listing.beds,
        baths: listing.baths,
        sqft: listing.sqft,
        address: listing.address.full,
        photo: listing.photos[0] || '',
        propertyType: listing.propertyType,
        isRental: listing.isRental,
        status: listing.status,
        listDate: listing.listDate,
    }
}

// ─── Fetch All Map Pins (lightweight, uses $select) ─────────────────────

const MAP_PIN_SELECT = [
    'ListingKey',
    'Latitude',
    'Longitude',
    'ListPrice',
    'TotalActualRent',
    'BedroomsTotal',
    'BathroomsTotalInteger',
    'LivingArea',
    'BuildingAreaTotal',
    'StreetNumber',
    'StreetName',
    'StreetSuffix',
    'UnitNumber',
    'City',
    'StateOrProvince',
    'PostalCode',
    'Media',
    'StructureType',
    'PropertySubType',
    'StandardStatus',
    'OriginalEntryTimestamp',
].join(',')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeDdfToPin(raw: any): MapPin | null {
    const lat = raw.Latitude
    const lng = raw.Longitude
    if (!lat || !lng) return null

    // Exclude outliers outside the KW / Southern Ontario service area
    if (lat < 43.0 || lat > 44.0 || lng < -81.0 || lng > -79.5) return null

    const streetNum = raw.StreetNumber || ''
    const streetName = raw.StreetName || ''
    const streetSuffix = raw.StreetSuffix || ''
    const unit = raw.UnitNumber || ''
    const city = raw.City || ''
    const unitPart = unit ? ` Unit ${unit}` : ''
    const address = `${streetNum} ${streetName} ${streetSuffix}${unitPart}, ${city}`.trim()

    /* eslint-disable @typescript-eslint/no-explicit-any */
    const photos = (raw.Media || [])
        .filter(
            (m: any) => m.MediaCategory === 'Photo' || (m.MediaURL && /\.(jpg|jpeg|png|webp|gif)/i.test(m.MediaURL))
        )
        .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0))
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const status = normalizeStatus(raw.StandardStatus || '')

    return {
        id: raw.ListingKey,
        lat,
        lng,
        price: raw.ListPrice || raw.TotalActualRent || 0,
        beds: raw.BedroomsTotal || 0,
        baths: raw.BathroomsTotalInteger || 0,
        sqft: raw.LivingArea || raw.BuildingAreaTotal || null,
        address,
        photo: photos[0]?.MediaURL || '',
        propertyType:
            (Array.isArray(raw.StructureType) && raw.StructureType[0]) || raw.PropertySubType || 'Residential',
        isRental: !raw.ListPrice && !!raw.TotalActualRent,
        status,
        listDate: raw.OriginalEntryTimestamp || '',
    }
}

export async function getAllMapPins(filters: ListingFilters = {}): Promise<{ pins: MapPin[]; totalCount: number }> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        const pins = filtered.map(toMapPin).filter((p): p is MapPin => p !== null)
        return { pins, totalCount: filtered.length }
    }

    const token = await getDdfToken()
    const filterStr = buildODataFilter(filters)
    const orderBy = buildODataOrderBy(filters)

    // First request: get page 1 + total count
    const firstParams = new URLSearchParams()
    firstParams.set('$top', DDF_PAGE_LIMIT.toString())
    firstParams.set('$count', 'true')
    firstParams.set('$select', MAP_PIN_SELECT)
    if (filterStr) firstParams.set('$filter', filterStr)
    firstParams.set('$orderby', orderBy)

    const firstUrl = `${DDF_API_BASE}/Property?${firstParams.toString()}`
    let res = await fetch(firstUrl, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (res.status === 401) {
        cachedToken = null
        tokenExpiry = 0
        const freshToken = await getDdfToken()
        res = await fetch(firstUrl, {
            headers: { Authorization: `Bearer ${freshToken}` },
            next: { revalidate: 300 },
        })
    }

    if (!res.ok) {
        const errorBody = await res.text().catch(() => '')
        console.error('DDF map pins error:', res.status, errorBody)
        const { mockListings } = await import('./mock-listings')
        const filtered = applyMockFilters(mockListings, filters)
        const pins = filtered.map(toMapPin).filter((p): p is MapPin => p !== null)
        return { pins, totalCount: filtered.length }
    }

    const firstData = await res.json()
    const totalCount: number = firstData['@odata.count'] ?? 0
    const firstPins: MapPin[] = (firstData.value || []).map(normalizeDdfToPin).filter(Boolean)

    if (totalCount <= DDF_PAGE_LIMIT) {
        return { pins: firstPins, totalCount }
    }

    // Fetch remaining pages in parallel
    const currentToken = cachedToken || token
    const remainingPages = Math.ceil((totalCount - DDF_PAGE_LIMIT) / DDF_PAGE_LIMIT)
    const batchPromises = Array.from({ length: remainingPages }, (_, i) => {
        const skip = (i + 1) * DDF_PAGE_LIMIT
        const params = new URLSearchParams(firstParams)
        params.delete('$count')
        params.set('$skip', skip.toString())

        const url = `${DDF_API_BASE}/Property?${params.toString()}`
        return fetch(url, {
            headers: { Authorization: `Bearer ${currentToken}` },
            next: { revalidate: 300 },
        }).then(async (r) => {
            if (!r.ok) {
                console.error('DDF map pins batch error:', r.status, `skip=${skip}`)
                return [] as MapPin[]
            }
            const data = await r.json()
            return (data.value || []).map(normalizeDdfToPin).filter(Boolean) as MapPin[]
        })
    })

    const batches = await Promise.all(batchPromises)
    const allPins = [firstPins, ...batches].flat()
    return { pins: allPins, totalCount }
}

// ─── Fast count-only query ───────────────────────────────────────────────

export async function getListingCount(filters: ListingFilters = {}): Promise<number> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        return applyMockFilters(mockListings, filters).length
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$top', '1')
    params.set('$count', 'true')
    const filter = buildODataFilter(filters)
    if (filter) params.set('$filter', filter)

    const url = `${DDF_API_BASE}/Property?${params.toString()}`
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (!res.ok) return 0
    const data = await res.json()
    return data['@odata.count'] ?? 0
}

// ─── Parse filter params from URL search params ─────────────────────────

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
])

const VALID_BUILDING_TYPES = new Set(['Single Family', 'Multi-family', 'Vacant Land', 'Commercial'])

const VALID_TRANSACTION_TYPES = new Set(['sale', 'rent'])
const VALID_SORT_FIELDS = new Set(['listingPrice', 'listingDate'])
const VALID_SORT_DIRECTIONS = new Set(['asc', 'desc'])

function finiteOrUndefined(value: string | undefined): number | undefined {
    if (!value) return undefined
    const n = Number(value)
    return Number.isFinite(n) ? n : undefined
}

export function parseFilterParams(params: Record<string, string>): ListingFilters {
    return {
        minPrice: finiteOrUndefined(params.lp),
        maxPrice: finiteOrUndefined(params.hp),
        beds: finiteOrUndefined(params.bd),
        baths: finiteOrUndefined(params.ba),
        propertyType: params.pt && VALID_PROPERTY_TYPES.has(params.pt) ? params.pt : undefined,
        buildingType: params.bt && VALID_BUILDING_TYPES.has(params.bt) ? params.bt : undefined,
        city: params.city || undefined,
        transactionType:
            params.tt && VALID_TRANSACTION_TYPES.has(params.tt) ? (params.tt as 'sale' | 'rent') : undefined,
        storeys: finiteOrUndefined(params.storeys),
        yearBuilt: finiteOrUndefined(params.yb),
        sortField:
            params.sortField && VALID_SORT_FIELDS.has(params.sortField)
                ? (params.sortField as 'listingPrice' | 'listingDate')
                : undefined,
        sortDirection:
            params.sortDirection && VALID_SORT_DIRECTIONS.has(params.sortDirection)
                ? (params.sortDirection as 'asc' | 'desc')
                : undefined,
    }
}

// ─── Mock data filter helper ─────────────────────────────────────────────

function applyMockFilters(listings: Listing[], filters: ListingFilters): Listing[] {
    let result = [...listings]

    if (filters.minPrice) result = result.filter((l) => l.price >= filters.minPrice!)
    if (filters.maxPrice) result = result.filter((l) => l.price <= filters.maxPrice!)
    if (filters.beds) result = result.filter((l) => l.beds >= filters.beds!)
    if (filters.baths) result = result.filter((l) => l.baths >= filters.baths!)
    if (filters.city) result = result.filter((l) => l.address.city === filters.city)

    return result
}

function paginateMockResults(listings: Listing[], filters: ListingFilters): Listing[] {
    const offset = filters.offset || 0
    return listings.slice(offset, offset + (filters.limit || 12))
}
