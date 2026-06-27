import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as { username: string; name: string; role: 'admin' | 'tenant' } | null,
    token: ''
  }),
  
  getters: {
    isAuthenticated: (state) => !!state.user
  },
  
  actions: {
    init() {
      const saved = localStorage.getItem('auth')
      if (saved) {
        const data = JSON.parse(saved)
        this.user = data.user
        this.token = data.token
      }
    },
    
    login(username: string, password: string) {
      // In production, verify against API
      if (username === 'peterb' && password === 'Omnfxop09!') {
        this.user = { username: 'peterb', name: 'Peter Bardenhagen', role: 'admin', initials: 'PB' }
      } else if (username === 'kevin' && password === 'kevin187') {
        this.user = { username: 'kevin', name: 'Kevin', role: 'tenant', initials: 'KV' }
      } else {
        throw new Error('Invalid credentials')
      }
      this.token = btoa(`${username}:${password}`)
      localStorage.setItem('auth', JSON.stringify({ user: this.user, token: this.token }))
    },
    
    logout() {
      this.user = null
      this.token = ''
      localStorage.removeItem('auth')
    }
  }
})