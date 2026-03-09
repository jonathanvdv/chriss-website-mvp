import 'server-only'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

/**
 * Public client using the anon key. Safe for read-only queries where
 * Row Level Security controls access (e.g. public listing data).
 * Used by API routes serving data to visitors.
 */
export const supabase = createClient(
    SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

/**
 * Admin client using the service role key. Bypasses RLS entirely.
 * Only use for server-side admin operations (DDF importer, data writes).
 */
export const supabaseAdmin = createClient(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)
