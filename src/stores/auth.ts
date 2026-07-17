import { defineStore } from 'pinia'
import { verifyPassword } from '@/services/cryptoService'
import { landlordService } from '@/services/landlordService'
import { useTenantStore } from '@/stores/tenant'
import { eventLogService } from '@/services/eventLogService'

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
        if (!ok) {
          eventLogService.log('warning', `Failed login attempt for "${landlord.username}" (incorrect password)`, landlord.username)
          return { success: false, error: 'Incorrect password.' }
        }
        this.role = 'landlord'
        this.tenantId = null
        this.name = landlord.name
        this.persist()
        eventLogService.log('login', `${landlord.name} signed in as landlord`, landlord.username)
        return { success: true }
      }

      const tenantStore = useTenantStore()
      const tenant = tenantStore.findByUsername(cleanUsername)
      if (tenant) {
        const ok = await verifyPassword(password, tenant.passwordHash || '')
        if (!ok) {
          eventLogService.log('warning', `Failed login attempt for "${tenant.username}" (incorrect password)`, tenant.username)
          return { success: false, error: 'Incorrect password.' }
        }
        this.role = 'tenant'
        this.tenantId = tenant.id
        this.name = tenant.name
        this.persist()
        eventLogService.log('login', `${tenant.name} signed in`, tenant.username)
        return { success: true }
      }

      eventLogService.log('warning', `Failed login attempt for unknown username "${cleanUsername}"`, cleanUsername)
      return { success: false, error: 'No account found with that username.' }
    },

    // Kept for backwards compatibility with the old hardcoded admin password flow.
    async setAdminPassword(password: string) {
      return this.login('peter', password)
    },

    logout() {
      if (this.name) {
        eventLogService.log('login', `${this.name} signed out`, this.name)
      }
      this.role = null
      this.tenantId = null
      this.name = ''
      localStorage.removeItem(STORAGE_KEY)
    }
  }
})
