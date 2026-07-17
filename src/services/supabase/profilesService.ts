import { supabase } from '@/lib/supabaseClient'

export interface Profile {
  id: string
  role: 'landlord' | 'tenant'
  name: string
  username: string
  room: string | null
  rent: number | null
  bond: number | null
  rent_cycle: 'weekly' | 'fortnightly' | 'monthly'
  advance_paid_until: string | null
  bills_included: boolean
  bills_included_amount: number | null
  lease_start: string | null
  lease_end: string | null
  contact: string | null
  email: string | null
  status: string
  created_at: string
}

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase.from('profiles').select('*').order('created_at')
  if (error) throw error
  return data as Profile[]
}

export async function getTenants(): Promise<Profile[]> {
  return (await getAllProfiles()).filter(p => p.role === 'tenant')
}

export async function getLandlord(): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('role', 'landlord').single()
  if (error) return null
  return data as Profile
}

export async function updateProfile(id: string, changes: Partial<Profile>): Promise<void> {
  const { error } = await supabase.from('profiles').update(changes).eq('id', id)
  if (error) throw error
}

export async function deleteTenant(id: string): Promise<void> {
  // Only removes the profile row here — deleting the underlying auth user
  // needs the service-role key, so that part happens server-side too (see
  // api/create-tenant.ts's sibling delete endpoint, not yet built).
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}

export interface CreateTenantInput {
  name: string
  username: string
  password: string
  room?: string
  rent?: number
  bond?: number
  rentCycle?: 'weekly' | 'fortnightly' | 'monthly'
  advancePaidUntil?: string
  billsIncluded?: boolean
  billsIncludedAmount?: number
  leaseStart?: string
  leaseEnd?: string
  contact?: string
  email?: string
  status?: string
}

// Goes through /api/create-tenant (a Vercel serverless function) because
// creating a new Supabase Auth user needs the service-role key, which the
// browser must never hold.
export async function createTenant(input: CreateTenantInput): Promise<{ id: string; username: string }> {
  const { data: sessionData } = await supabase.auth.getSession()
  const token = sessionData.session?.access_token
  if (!token) throw new Error('Not signed in.')

  const res = await fetch('/api/create-tenant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(input)
  })

  const body = await res.json()
  if (!res.ok) throw new Error(body.error || 'Could not create tenant.')
  return body
}
