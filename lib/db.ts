import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

function requireEnv(name: string): string {
    const value = process.env[name]
    if (!value) throw new Error(`Missing required environment variable: ${name}`)
    return value
}

/**
 * Public client using the anon key. Safe for read-only queries where
 * Row Level Security controls access (e.g. public listing data).
 * Used by API routes serving data to visitors.
 */
export const supabase = createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
)

/**
 * Admin client using the service role key. Bypasses RLS entirely.
 * Only use for server-side admin operations (DDF importer, data writes).
 * Lazily initialized to avoid loading the service role key unless needed.
 */
let _supabaseAdmin: SupabaseClient | null = null
export function getSupabaseAdmin(): SupabaseClient {
    if (!_supabaseAdmin) {
        _supabaseAdmin = createClient(
            requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
            requireEnv('SUPABASE_SERVICE_ROLE_KEY')
        )
    }
    return _supabaseAdmin
}
