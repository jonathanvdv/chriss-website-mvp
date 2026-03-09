-- Multi-tenant real estate listings database schema
-- Requires PostgreSQL with PostGIS extension

CREATE EXTENSION IF NOT EXISTS postgis;

-- ─── Offices ──────────────────────────────────────────────────────────────

CREATE TABLE offices (
    id          SERIAL PRIMARY KEY,
    office_key  VARCHAR(50) UNIQUE NOT NULL,   -- CREA DDF ListOfficeKey
    name        VARCHAR(255) NOT NULL,
    phone       VARCHAR(30),
    email       VARCHAR(255),
    address     TEXT,
    city        VARCHAR(100),
    province    VARCHAR(10),
    postal_code VARCHAR(10),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offices_office_key ON offices (office_key);

-- ─── Agents ───────────────────────────────────────────────────────────────

CREATE TABLE agents (
    id          SERIAL PRIMARY KEY,
    agent_key   VARCHAR(50) UNIQUE NOT NULL,   -- CREA DDF ListAgentKey
    office_id   INT REFERENCES offices(id) ON DELETE SET NULL,
    first_name  VARCHAR(100),
    last_name   VARCHAR(100),
    email       VARCHAR(255),
    phone       VARCHAR(30),
    photo_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agents_agent_key ON agents (agent_key);
CREATE INDEX idx_agents_office_id ON agents (office_id);

-- ─── Listings ─────────────────────────────────────────────────────────────

CREATE TABLE listings (
    id              SERIAL PRIMARY KEY,
    listing_key     VARCHAR(100) UNIQUE NOT NULL,  -- CREA DDF ListingKey
    mls_number      VARCHAR(50),
    agent_id        INT REFERENCES agents(id) ON DELETE SET NULL,
    office_id       INT REFERENCES offices(id) ON DELETE SET NULL,

    -- Address
    street_number   VARCHAR(20),
    street_name     VARCHAR(255),
    street_suffix   VARCHAR(50),
    unit_number     VARCHAR(20),
    city            VARCHAR(100),
    province        VARCHAR(10) DEFAULT 'ON',
    postal_code     VARCHAR(10),
    neighbourhood   VARCHAR(255),
    full_address    TEXT NOT NULL,

    -- Geographic (PostGIS)
    location        GEOMETRY(Point, 4326),   -- SRID 4326 = WGS84

    -- Pricing
    list_price      NUMERIC(12,2),
    rent_price      NUMERIC(12,2),
    is_rental       BOOLEAN NOT NULL DEFAULT FALSE,
    rent_frequency  VARCHAR(20),

    -- Property details
    beds            SMALLINT NOT NULL DEFAULT 0,
    beds_above      SMALLINT,
    beds_below      SMALLINT,
    baths           SMALLINT NOT NULL DEFAULT 0,
    baths_full      SMALLINT,
    baths_half      SMALLINT,
    sqft            INT,
    lot_size        VARCHAR(50),
    lot_dimensions  VARCHAR(100),
    property_type   VARCHAR(100),
    building_type   VARCHAR(100),
    storeys         VARCHAR(20),
    year_built      SMALLINT,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'Active',

    -- Media
    photos          TEXT[],                -- Array of photo URLs
    virtual_tour    TEXT,

    -- Building & structure
    construction_material VARCHAR(255),
    foundation      VARCHAR(255),
    roof            VARCHAR(255),
    exterior_features VARCHAR(255),

    -- Interior
    flooring        VARCHAR(255),
    interior_features VARCHAR(255),
    appliances      VARCHAR(255),
    basement        VARCHAR(255),

    -- Utilities
    heating         VARCHAR(255),
    heating_fuel    VARCHAR(255),
    cooling         VARCHAR(255),
    water_source    VARCHAR(255),
    sewer           VARCHAR(255),

    -- Parking
    parking_total   SMALLINT,
    garage_spaces   SMALLINT,
    parking_features VARCHAR(255),

    -- Financial
    tax_amount      NUMERIC(10,2),
    tax_year        SMALLINT,
    association_fee NUMERIC(10,2),
    association_fee_frequency VARCHAR(20),

    -- Rooms (JSON array for flexibility)
    rooms           JSONB DEFAULT '[]',
    rooms_total     SMALLINT,

    -- Misc
    zoning          VARCHAR(100),
    community_features VARCHAR(255),
    pool_features   VARCHAR(255),
    fencing         VARCHAR(255),

    -- Required
    realtor_ca_url  TEXT,
    listing_brokerage VARCHAR(255),

    -- Timestamps
    list_date           TIMESTAMPTZ,
    modification_date   TIMESTAMPTZ,
    ddf_last_synced     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Spatial index for bounding-box queries
CREATE INDEX idx_listings_location ON listings USING GIST (location);

-- Filtering indexes
CREATE INDEX idx_listings_agent_id ON listings (agent_id);
CREATE INDEX idx_listings_office_id ON listings (office_id);
CREATE INDEX idx_listings_status ON listings (status);
CREATE INDEX idx_listings_city ON listings (city);
CREATE INDEX idx_listings_is_rental ON listings (is_rental);
CREATE INDEX idx_listings_list_price ON listings (list_price);
CREATE INDEX idx_listings_rent_price ON listings (rent_price);
CREATE INDEX idx_listings_beds ON listings (beds);
CREATE INDEX idx_listings_baths ON listings (baths);
CREATE INDEX idx_listings_property_type ON listings (property_type);
CREATE INDEX idx_listings_list_date ON listings (list_date DESC);

-- Composite index for common multi-tenant + bbox query pattern
CREATE INDEX idx_listings_agent_status ON listings (agent_id, status);
CREATE INDEX idx_listings_office_status ON listings (office_id, status);
