import { defineStore } from 'pinia'
import { verifyPassword } from '@/services/cryptoService'
import { landlordService } from '@/services/landlordService'
import { useTenantStore } from '@/stores/tenant'

type Role = 'landlord' | 'tenant' | null

interface Session {
  role: Role
  tenantId: number | null
  name: string
}

const STORAGE_KEY = 'session'

function loadSession(): Session {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // fall through to default
  }
  return { role: null, tenantId: null, name: '' }
}

export interface LoginResult {
  success: boolean
  error?: string
}

export const useAuthStore = defineStore('auth', {
  state: (): Session => loadSession(),
  getters: {
    isLoggedIn: (state) => state.role !== null,
    isAdminAuthenticated: (state) => state.role === 'landlord',
    isTenant: (state) => state.role === 'tenant',
    currentTenantId: (state) => state.tenantId
  },
  actions: {
    persist() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        role: this.role,
        tenantId: this.tenantId,
        name: this.name
      }))
    },

    async login(username: string, password: string): Promise<LoginResult> {
      const cleanUsername = username.trim()
      if (!cleanUsername || !password) {
        return { success: false, error: 'Enter your username and password.' }
      }

      const landlord = await landlordService.getLandlord()
      if (cleanUsername.toLowerCase() === landlord.username.toLowerCase()) {
        const ok = await verifyPassword(password, landlord.passwordHash)
        if (!ok) return { success: false, error: 'Incorrect password.' }
        this.role = 'landlord'
        this.tenantId = null
        this.name = landlord.name
        this.persist()
        return { success: true }
      }

      const tenantStore = useTenantStore()
      const tenant = tenantStore.findByUsername(cleanUsername)
      if (tenant) {
        const ok = await verifyPassword(password, tenant.passwordHash || '')
        if (!ok) return { success: false, error: 'Incorrect password.' }
        this.role = 'tenant'
        this.tenantId = tenant.id
        this.name = tenant.name
        this.persist()
        return { success: true }
      }

      return { success: false, error: 'No account found with that username.' }
    },

    // Kept for backwards compatibility with the old hardcoded admin password flow.
    async setAdminPassword(password: string) {
      return this.login('peter', password)
    },

    logout() {
      this.role = null
      this.tenantId = null
      this.name = ''
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
