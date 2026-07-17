import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

// Creating a new Supabase Auth user requires the service-role key, which
// must never reach the browser — that's why this has to be a server
// function rather than something the client SDK can do directly with the
// anon key. Only an already-authenticated landlord may call this; every
// other caller (including a logged-in tenant) is rejected.

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

interface CreateTenantBody {
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

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
    res.status(500).json({ error: 'Server is missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY.' })
    return
  }

  const authHeader = req.headers.authorization || ''
  const callerToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!callerToken) {
    res.status(401).json({ error: 'Missing bearer token.' })
    return
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  // Verify the caller is a real, currently-signed-in landlord before doing
  // anything privileged.
  const { data: callerData, error: callerError } = await admin.auth.getUser(callerToken)
  if (callerError || !callerData?.user) {
    res.status(401).json({ error: 'Invalid or expired session.' })
    return
  }

  const { data: callerProfile, error: profileError } = await admin
    .from('profiles')
    .select('role')
    .eq('id', callerData.user.id)
    .single()

  if (profileError || callerProfile?.role !== 'landlord') {
    res.status(403).json({ error: 'Only the landlord can create tenant accounts.' })
    return
  }

  const body = req.body as CreateTenantBody
  if (!body?.name?.trim() || !body?.username?.trim() || !body?.password) {
    res.status(400).json({ error: 'name, username and password are required.' })
    return
  }

  const username = body.username.trim()
  const email = body.email?.trim() || `${username.toLowerCase()}@login.apartment1507.internal`

  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: body.password,
    email_confirm: true
  })

  if (createError || !created?.user) {
    res.status(400).json({ error: createError?.message || 'Could not create the account.' })
    return
  }

  const { error: insertError } = await admin.from('profiles').insert({
    id: created.user.id,
    role: 'tenant',
    name: body.name.trim(),
    username,
    room: body.room || null,
    rent: body.rent ?? null,
    bond: body.bond ?? null,
    rent_cycle: body.rentCycle || 'weekly',
    advance_paid_until: body.advancePaidUntil || null,
    bills_included: body.billsIncluded || false,
    bills_included_amount: body.billsIncludedAmount ?? null,
    lease_start: body.leaseStart || null,
    lease_end: body.leaseEnd || null,
    contact: body.contact || null,
    email: body.email || null,
    status: body.status || 'active'
  })

  if (insertError) {
    // Roll back the orphaned auth user so a failed insert doesn't leave a
    // login with no profile behind it.
    await admin.auth.admin.deleteUser(created.user.id)
    res.status(400).json({ error: insertError.message })
    return
  }

  res.status(200).json({ id: created.user.id, username })
}
