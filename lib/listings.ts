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
    tokenExpiry = Date.now() + (55 * 60 * 1000)
    return cachedToken!
}

// ─── Types ──────────────────────────────────────────────────────────────

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
    }
    price: number
    beds: number
    baths: number
    sqft: number | null
    lotSize: string | null
    propertyType: string
    yearBuilt: number | null
    description: string
    photos: string[]
    listDate: string
    daysOnMarket: number
    status: 'Active' | 'Sold' | 'Pending'
    virtualTour: string | null
    features: {
        garage?: string
        heating?: string
        cooling?: string
        basement?: string
        [key: string]: string | undefined
    }
    realtorCaUrl: string       // required link back to REALTOR.ca listing
    listingBrokerage: string   // required brokerage attribution
}

export interface ListingFilters {
    minPrice?: number
    maxPrice?: number
    beds?: number
    baths?: number
    propertyType?: string
    city?: string
    limit?: number
    offset?: number
    sortField?: 'listingPrice' | 'listingDate'
    sortDirection?: 'asc' | 'desc'
}

// ─── Build OData filter string ──────────────────────────────────────────

function buildODataFilter(filters: ListingFilters): string {
    const parts: string[] = []

    if (filters.minPrice) parts.push(`ListPrice ge ${filters.minPrice}`)
    if (filters.maxPrice) parts.push(`ListPrice le ${filters.maxPrice}`)
    if (filters.beds) parts.push(`BedroomsTotal ge ${filters.beds}`)
    if (filters.baths) parts.push(`BathroomsTotalInteger ge ${filters.baths}`)
    if (filters.city) parts.push(`City eq '${filters.city}'`)
    if (filters.propertyType) parts.push(`PropertyType eq '${filters.propertyType}'`)

    return parts.join(' and ')
}

function buildODataOrderBy(filters: ListingFilters): string {
    const dir = filters.sortDirection || 'desc'
    if (filters.sortField === 'listingPrice') return `ListPrice ${dir}`
    return `ListingContractDate ${dir}`
}

// ─── Fetch All Listings ──────────────────────────────────────────────────

export async function getListings(filters: ListingFilters = {}): Promise<Listing[]> {
    if (!DDF_CLIENT_ID) {
        console.warn('⚠️  No DDF_CLIENT_ID set - returning mock listings')
        const { mockListings } = await import('./mock-listings')
        return applyMockFilters(mockListings, filters)
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$top', (filters.limit || 12).toString())
    if (filters.offset) params.set('$skip', filters.offset.toString())

    const filter = buildODataFilter(filters)
    if (filter) params.set('$filter', filter)
    params.set('$orderby', buildODataOrderBy(filters))
    params.set('$expand', 'Media')

    const res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (!res.ok) {
        console.error('DDF API error:', res.status, res.statusText)
        throw new Error(`Failed to fetch listings: ${res.status}`)
    }

    const data = await res.json()
    return (data.value || []).map(normalizeDdfListing)
}

// ─── Fetch Single Listing ────────────────────────────────────────────────

export async function getListing(listingId: string): Promise<Listing> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        const found = mockListings.find(l => l.id === listingId)
        if (!found) throw new Error('Listing not found')
        return found
    }

    const token = await getDdfToken()
    const params = new URLSearchParams()
    params.set('$expand', 'Media')
    params.set('$filter', `ListingKey eq '${listingId}'`)

    const res = await fetch(`${DDF_API_BASE}/Property?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 300 },
    })

    if (!res.ok) throw new Error(`Listing not found: ${listingId}`)

    const data = await res.json()
    if (!data.value || data.value.length === 0) throw new Error('Listing not found')
    return normalizeDdfListing(data.value[0])
}

// ─── Fetch Featured Listings ─────────────────────────────────────────────

export async function getFeaturedListings(limit = 6): Promise<Listing[]> {
    if (!DDF_CLIENT_ID) {
        const { mockListings } = await import('./mock-listings')
        return mockListings.slice(0, limit)
    }

    // Get most recent active listings as "featured"
    return getListings({ limit, sortField: 'listingDate', sortDirection: 'desc' })
}

// ─── Normalize DDF RESO response to our Listing type ─────────────────────

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

    // Media array from DDF
    const photos = (raw.Media || [])
        .filter((m: any) => m.MediaCategory === 'Photo' || m.MediaType?.startsWith('image'))
        .sort((a: any, b: any) => (a.Order || 0) - (b.Order || 0))
        .map((m: any) => m.MediaURL)

    // Calculate days on market
    const listDate = raw.ListingContractDate || raw.OriginalEntryTimestamp || ''
    const dom = listDate ? Math.floor((Date.now() - new Date(listDate).getTime()) / (1000 * 60 * 60 * 24)) : 0

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
        },
        price: raw.ListPrice || 0,
        beds: raw.BedroomsTotal || 0,
        baths: raw.BathroomsTotalInteger || 0,
        sqft: raw.LivingArea || null,
        lotSize: raw.LotSizeArea ? `${raw.LotSizeArea}` : null,
        propertyType: raw.PropertySubType || raw.PropertyType || 'Residential',
        yearBuilt: raw.YearBuilt || null,
        description: raw.PublicRemarks || '',
        photos,
        listDate,
        daysOnMarket: dom,
        status: normalizeStatus(raw.StandardStatus || raw.MlsStatus),
        virtualTour: raw.VirtualTourURLUnbranded || raw.VirtualTourURLBranded || null,
        features: {
            garage: raw.GarageSpaces ? `${raw.GarageSpaces} spaces` : undefined,
            heating: raw.Heating ? (Array.isArray(raw.Heating) ? raw.Heating.join(', ') : raw.Heating) : undefined,
            cooling: raw.Cooling ? (Array.isArray(raw.Cooling) ? raw.Cooling.join(', ') : raw.Cooling) : undefined,
            basement: raw.Basement ? (Array.isArray(raw.Basement) ? raw.Basement.join(', ') : raw.Basement) : undefined,
        },
        realtorCaUrl: `https://www.realtor.ca/real-estate/${raw.ListingKey}`,
        listingBrokerage: raw.ListOfficeName || '',
    }
}

function normalizeStatus(status: string): 'Active' | 'Sold' | 'Pending' {
    const s = (status || '').toLowerCase()
    if (s.includes('sold') || s.includes('closed')) return 'Sold'
    if (s.includes('pending') || s.includes('contingent')) return 'Pending'
    return 'Active'
}

// ─── Mock data filter helper ─────────────────────────────────────────────

function applyMockFilters(listings: Listing[], filters: ListingFilters): Listing[] {
    let result = [...listings]

    if (filters.minPrice) result = result.filter(l => l.price >= filters.minPrice!)
    if (filters.maxPrice) result = result.filter(l => l.price <= filters.maxPrice!)
    if (filters.beds) result = result.filter(l => l.beds >= filters.beds!)
    if (filters.baths) result = result.filter(l => l.baths >= filters.baths!)
    if (filters.city) result = result.filter(l => l.address.city === filters.city)

    return result.slice(0, filters.limit || 12)
}
