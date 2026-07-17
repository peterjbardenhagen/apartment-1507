import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Set them in .env.local (dev) ' +
    'and in the Vercel project\'s Environment Variables (Settings > Environment Variables) ' +
    'using the Project URL and anon/public key from Supabase (Settings > API).'
  )
}

export const supabase = createClient(url, anonKey)
