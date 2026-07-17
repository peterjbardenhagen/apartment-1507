import { useTenantStore } from '@/stores/tenant'
import { hashPassword } from './cryptoService'

const BOOTSTRAP_FLAG = 'coreTenantsBootstrapped'

interface CoreTenantDefaults {
  name: string
  username: string
  password: string
  room: string
  rent: number
  bond: number
  leaseStart: string
  email: string
  status: string
}

// Real household members who should always have a login, sourced from the
// current boarding agreements (src/data/tenantAgreements.json).
const CORE_TENANTS: CoreTenantDefaults[] = [
  { name: 'Kevin', username: 'kevin', password: 'Kevin1507', room: 'Room 1', rent: 90, bond: 450, leaseStart: '2025-01-01', email: 'kevin@boundary-st.apartments', status: 'active' },
  { name: 'Kaitlin', username: 'kaitlin', password: 'Kaitlin1507', room: 'Room 2', rent: 60, bond: 300, leaseStart: '2026-05-01', email: 'kaitlin@boundary-st.apartments', status: 'active' },
  { name: 'Jacob', username: 'jacob', password: 'Jacob1507', room: 'Room 3', rent: 60, bond: 300, leaseStart: '2026-07-18', email: 'jacob@boundary-st.apartments', status: 'pending' }
]

// Runs once per browser: creates any of the core tenants that don't exist yet,
// and fills in a username/password for any that exist but were never given one.
// Never overwrites a username or password that's already set.
export async function ensureCoreTenants(): Promise<void> {
  if (localStorage.getItem(BOOTSTRAP_FLAG)) return
  const store = useTenantStore()

  for (const def of CORE_TENANTS) {
    const existing = store.tenants.find(t => t.name.toLowerCase() === def.name.toLowerCase())
    if (!existing) {
      store.addTenant({
        name: def.name,
        room: def.room,
        rent: def.rent,
        bond: def.bond,
        leaseStart: def.leaseStart,
        leaseEnd: '',
        contact: '',
        email: def.email,
        status: def.status,
        username: def.username,
        passwordHash: await hashPassword(def.password)
      })
    } else if (!existing.username || !existing.passwordHash) {
      store.updateTenant(existing.id, {
        username: existing.username || def.username,
        passwordHash: existing.passwordHash || await hashPassword(def.password)
      })
    }
  }

  localStorage.setItem(BOOTSTRAP_FLAG, '1')
}
