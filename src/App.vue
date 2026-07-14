<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(false)

const navSections = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: '▦' }
    ]
  },
  {
    label: 'Property',
    items: [
      { name: 'Tenants', path: '/admin/tenants', icon: '◉' },
      { name: 'Financials', path: '/admin/financials', icon: '◈' },
      { name: 'Transactions', path: '/admin/transactions', icon: '⇅' },
      { name: 'Guest Tracking', path: '/admin/guest-tracking', icon: '☾' }
    ]
  },
  {
    label: 'Documents',
    items: [
      { name: 'Agreements', path: '/admin/flatmate-agreements', icon: '✎' },
      { name: 'Boarding Files', path: '/admin/boarding-agreements', icon: '❐' },
      { name: 'Payments', path: '/admin/payment-requests', icon: '↗' },
      { name: 'Receipts', path: '/admin/receipts', icon: '✓' }
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Enquiries', path: '/admin/enquiries', icon: '✉' },
      { name: 'Guardian', path: '/admin/guardian', icon: '◇' },
      { name: 'Guardian Docs', path: '/admin/guardian-docs', icon: '≡' },
      { name: 'Settings', path: '/admin/settings', icon: '⚙' }
    ]
  }
]

const allItems = navSections.flatMap(s => s.items)

const pageTitle = computed(() => {
  const current = allItems.find(n => route.path.startsWith(n.path))
  return current?.name || 'Admin'
})

const today = new Date().toLocaleDateString('en-AU', {
  weekday: 'short',
  day: 'numeric',
  month: 'short'
})

// Close the drawer whenever the route changes (mobile nav)
watch(() => route.path, () => {
  sidebarOpen.value = false
})

const logout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div v-if="auth.isAdminAuthenticated" class="min-h-screen bg-emerald-50">
    <!-- Mobile backdrop -->
    <transition name="fade">
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
        @click="sidebarOpen = false"
      ></div>
    </transition>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-40 w-72 bg-white flex flex-col transition-transform duration-300 ease-out',
        'border-r border-slate-100 shadow-card-lg lg:shadow-none',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Brand -->
      <div class="px-6 pt-6 pb-5 flex items-center justify-between">
        <router-link to="/admin/dashboard" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-display font-bold text-sm shadow-pill">
            15
          </div>
          <div>
            <p class="font-display font-bold text-slate-900 leading-tight">Apartment 1507</p>
            <p class="text-[11px] text-slate-400 font-medium tracking-wide uppercase">Property Manager</p>
          </div>
        </router-link>
        <button
          class="lg:hidden p-2 -mr-2 text-slate-400 hover:text-slate-900 transition"
          @click="sidebarOpen = false"
          aria-label="Close menu"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Nav -->
      <nav class="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
        <div v-for="section in navSections" :key="section.label">
          <p class="px-3.5 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
            {{ section.label }}
          </p>
          <div class="space-y-1">
            <router-link
              v-for="item in section.items"
              :key="item.path"
              :to="item.path"
              class="sidebar-link"
              active-class="sidebar-link-active"
            >
              <span class="w-6 text-center text-base leading-none shrink-0" aria-hidden="true">{{ item.icon }}</span>
              <span class="ml-2.5 truncate">{{ item.name }}</span>
            </router-link>
          </div>
        </div>
      </nav>

      <!-- Footer / logout -->
      <div class="p-4 border-t border-slate-100">
        <div class="rounded-2xl bg-emerald-50 p-4 mb-3">
          <p class="text-xs font-semibold text-emerald-700">1507/477 Boundary St</p>
          <p class="text-xs text-slate-500 mt-0.5">Spring Hill, QLD 4000</p>
        </div>
        <button @click="logout" class="sidebar-link w-full text-red-600 hover:bg-red-50 hover:text-red-700">
          <span class="w-6 text-center text-base leading-none shrink-0">⏻</span>
          <span class="ml-2.5">Exit Admin</span>
        </button>
      </div>
    </aside>

    <!-- Main column -->
    <div class="lg:pl-72 flex flex-col min-h-screen">
      <!-- Topbar -->
      <header class="sticky top-0 z-20 bg-emerald-50/80 backdrop-blur-md">
        <div class="flex items-center justify-between px-4 sm:px-6 lg:px-10 h-16">
          <div class="flex items-center gap-3">
            <button
              class="lg:hidden p-2 -ml-2 rounded-xl text-slate-600 hover:bg-white hover:shadow-card transition"
              @click="sidebarOpen = true"
              aria-label="Open menu"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            </button>
            <h1 class="font-display font-bold text-slate-900 text-lg">{{ pageTitle }}</h1>
          </div>
          <div class="flex items-center gap-2">
            <span class="hidden sm:inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-card">
              <span class="status-dot bg-emerald-400"></span>
              {{ today }}
            </span>
            <button
              @click="logout"
              class="sm:hidden p-2 rounded-xl text-slate-500 hover:bg-white hover:shadow-card transition"
              aria-label="Exit admin"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Page content -->
      <main class="flex-1 px-4 sm:px-6 lg:px-10 pb-12 pt-2">
        <div class="max-w-6xl mx-auto">
          <router-view />
        </div>
      </main>
    </div>
  </div>

  <router-view v-else />
</template>
