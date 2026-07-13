<script setup lang="ts">
import { ref, computed } from 'vue'
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

const pageTitle = computed(() => {
  const current = navigation.find(n => n.path === route.path)
  return current?.name || 'Admin'
})

const breadcrumbs = computed(() => {
  return [
    { name: 'Admin', path: '/admin/dashboard' },
    { name: pageTitle.value }
  ]
})

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div v-if="auth.isAdminAuthenticated" class="min-h-screen bg-slate-50 flex">
    <nav :class="[sidebarOpen ? 'w-64' : 'w-20', 'bg-slate-900 text-white transition-all duration-300 flex flex-col']">
      <div class="p-4 border-b border-slate-700">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-lg font-bold shrink-0">
            A
          </div>
          <div v-if="sidebarOpen" class="min-w-0">
            <h1 class="text-sm font-bold truncate">Apartment 1507</h1>
            <p class="text-xs text-slate-400 truncate">Admin Panel</p>
          </div>
        </div>
      </div>

      <div class="p-3 flex-1 overflow-y-auto">
        <router-link 
          v-for="item in navigation" 
          :key="item.path" 
          :to="item.path" 
          class="sidebar-link mb-1"
          active-class="sidebar-link-active"
        >
          <span class="text-lg shrink-0">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="ml-3 truncate">{{ item.name }}</span>
        </router-link>
      </div>

      <div class="p-4 border-t border-slate-700">
        <button @click="logout" class="sidebar-link w-full">
          <span class="text-lg shrink-0">🚪</span>
          <span v-if="sidebarOpen" class="ml-3">Exit Admin</span>
        </button>
      </div>
    </nav>

    <div class="flex-1 overflow-auto">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div class="flex items-center justify-between px-4 sm:px-6 h-14">
          <div class="flex items-center gap-4">
            <button @click="sidebarOpen = !sidebarOpen" class="p-2 -ml-2 hover:bg-slate-100 rounded-lg transition">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <nav class="hidden sm:flex items-center text-sm">
              <template v-for="(crumb, index) in breadcrumbs" :key="index">
                <span v-if="index > 0" class="mx-2 text-slate-400">/</span>
                <router-link 
                  :to="crumb.path" 
                  class="text-slate-500 hover:text-slate-700 transition"
                  :class="index === breadcrumbs.length - 1 ? 'text-slate-900 font-medium' : ''"
                >
                  {{ crumb.name }}
                </router-link>
              </template>
            </nav>
          </div>
          <div class="text-sm text-slate-500">
            {{ new Date().toLocaleDateString('en-AU', { weekday: 'short', month: 'short', day: 'numeric' }) }}
          </div>
        </div>
      </header>
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
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
