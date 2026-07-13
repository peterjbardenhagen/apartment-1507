import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    adminAuthenticated: false
  }),
  getters: {
    isAdminAuthenticated: (state) => state.adminAuthenticated
  },
  actions: {
    setAdminPassword(password: string) {
      if (password === '2595') {
        this.adminAuthenticated = true
      }
    },
    logout() {
      this.adminAuthenticated = false
    }
  }
})
