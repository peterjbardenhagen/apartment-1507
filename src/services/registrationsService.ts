import { supabase, TABLES } from '@/services/supabaseClient'

export interface Registration {
  id: number
  first_name: string
  email: string
  username: string | null
  phone: string | null
  status: 'pending' | 'converted' | 'rejected'
  created_at: string
}

// Supabase isn't configured in every environment (missing/placeholder env
// vars), and a request to an unreachable host can hang far longer than a
// user should ever stare at a spinner — so every call here gets a hard
// timeout instead of relying on the network to fail on its own.
function withTimeout<T>(promise: Promise<T>, ms = 10000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('Timed out reaching Supabase.')), ms))
  ])
}

export async function getRegistrations(): Promise<Registration[]> {
  const { data, error } = await withTimeout(
    supabase.from(TABLES.REGISTRATIONS).select('*').order('created_at', { ascending: false })
  )
  if (error) throw error
  return (data || []) as Registration[]
}

export async function markRegistrationStatus(id: number, status: 'converted' | 'rejected'): Promise<void> {
  const { error } = await withTimeout(supabase.from(TABLES.REGISTRATIONS).update({ status }).eq('id', id))
  if (error) throw error
}
