import { createClient } from '@supabase/supabase-js'
import { config } from '@/config/env'

// These come from VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
const supabaseUrl = config.supabase.url
const supabaseAnonKey = config.supabase.anonKey

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

/**
 * Database type definitions matching the Supabase schema.
 */
export const TABLES = {
  LANDLORD: 'landlord',
  TENANTS: 'tenants',
  REGISTRATIONS: 'registrations',
  MESSAGES: 'messages',
  REPAIR_REQUESTS: 'repair_requests',
  ENQUIRIES: 'enquiries'
} as const

/**
 * Ensure all required tables exist (call on app mount).
 * Uses Supabase REST API to create tables if they don't exist.
 * This requires the database to be set up with the schema first.
 */
export async function ensureDatabaseSchema(): Promise<void> {
  // Schema setup is handled via Supabase SQL migrations.
  // At runtime we check connectivity only.
  const { error } = await supabase.from(TABLES.TENANTS).select('id', { count: 'exact', head: true }).limit(1)
  if (error && error.code === '42P01') {
    console.error('Database tables not found. Run the schema migration first.')
    console.info('See: src/services/supabase-schema.sql')
  }
}
