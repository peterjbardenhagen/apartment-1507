<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(true)

const navigation = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  { name: 'Tenants', path: '/admin/tenants', icon: '👥' },
  { name: 'Financials', path: '/admin/financials', icon: '💰' },
  { name: 'Guest Tracking', path: '/admin/guest-tracking', icon: '📋' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  { name: 'Guardian', path: '/admin/guardian', icon: '🛡️' },
  { name: 'Docs', path: '/admin/guardian-docs', icon: '📖' },
  { name: 'Enquiries', path: '/admin/enquiries', icon: '📨' }
]


const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div v-if="auth.isAdminAuthenticated" class="min-h-screen bg-slate-50 flex">
    <nav :class="[sidebarOpen ? 'w-64' : 'w-20', 'bg-slate-900 text-white transition-all duration-300 flex flex-col']">
      <div class="p-4 border-b border-slate-700">
        <h1 class="text-xl font-bold">🏢 Apartment 1507</h1>
        <p v-if="sidebarOpen" class="text-xs text-slate-400">Admin Panel</p>
      </div>
      
      <div class="p-3 flex-1">
        <router-link 
          v-for="item in navigation" 
          :key="item.path" 
          :to="item.path" 
          class="flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors mb-1"
          active-class="bg-emerald-600"
        >
          <span class="text-xl mr-3">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="font-medium">{{ item.name }}</span>
        </router-link>
      </div>
      
      <div class="p-4 border-t border-slate-700">
        <button @click="logout" class="w-full text-left text-sm text-slate-400 hover:text-white flex items-center gap-2">
          <span>🚪</span>
          <span v-if="sidebarOpen">Exit Admin</span>
        </button>
      </div>
    </nav>

    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-slate-100 rounded-lg transition">
          ☰
        </button>
        <h2 class="text-lg font-semibold text-slate-800">{{ route.meta.title || 'Admin' }}</h2>
        <div></div>
      </header>
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
  
  <router-view v-else />
</template>

<style scoped>
.router-link-active {
  @apply bg-emerald-600 text-white;
}
</style>
