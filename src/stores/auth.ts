import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { username: string; name: string; role: 'admin' | 'tenant'; initials?: string } | null
  }),
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  actions: {
    login(username: string, password: string, role: 'admin' | 'tenant') {
      // Admin credentials
      if (role === 'admin' && username === 'peterb' && password === 'Omnfxop09!') {
        this.user = { username: 'peterb', name: 'Peter', role: 'admin', initials: 'PB' }
        return true
      }
      // Tenant credentials  
      if (role === 'tenant' && username === 'kevin' && password === 'Omnfxop09!') {
        this.user = { username: 'kevin', name: 'Kevin', role: 'tenant', initials: 'K' }
        return true
      }
      return false
    },
    logout() {
      this.user = null
    }
  }
})