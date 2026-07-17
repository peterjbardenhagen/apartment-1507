<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenant'
import { messagesService } from '@/services/messagesService'

const router = useRouter()
const tenantStore = useTenantStore()

const unreadMessageCount = computed(() =>
  messagesService.getUnreadCount({ type: 'landlord', id: 'landlord', name: 'Peter Bardenhagen' })
)

const totalRent = tenantStore.tenants.reduce((sum, t) => sum + t.rent, 0)
const totalBond = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const activeTenants = tenantStore.tenants.filter(t => t.status === 'active').length
const monthlyRevenue = Math.round(totalRent * 4.33)

const metrics = [
  {
    label: 'Weekly Rent',
    value: `$${totalRent}`,
    detail: `From ${activeTenants} active tenants`,
    pill: '+ on track',
    pillClass: 'stat-change-positive',
    tile: 'bg-emerald-50 text-emerald-600',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  {
    label: 'Est. Monthly Revenue',
    value: `$${monthlyRevenue}`,
    detail: '4.33 weeks per month',
    pill: 'monthly',
    pillClass: 'badge-neutral',
    tile: 'bg-teal-100 text-teal-700',
    icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
  },
  {
    label: 'Bond Held',
    value: `$${totalBond}`,
    detail: 'Tenant security deposits',
    pill: 'secured',
    pillClass: 'badge-info',
    tile: 'bg-purple-100 text-purple-600',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z'
  },
  {
    label: 'Active Tenants',
    value: `${activeTenants}`,
    detail: `Of ${tenantStore.tenants.length} total`,
    pill: 'active',
    pillClass: 'stat-change-positive',
    tile: 'bg-amber-100 text-amber-700',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
  }
]

const tools = [
  { name: 'Tenants', desc: 'Manage tenant list and details', path: '/admin/tenants', tile: 'bg-emerald-50 text-emerald-600' },
  { name: 'Messages', desc: 'Message tenants or everyone at once', path: '/admin/messages', tile: 'bg-teal-100 text-teal-700' },
  { name: 'Contacts', desc: 'Everyone\'s contact details', path: '/admin/contacts', tile: 'bg-amber-100 text-amber-700' },
  { name: 'Event Log', desc: 'Logins, warnings and errors', path: '/admin/event-log', tile: 'bg-slate-100 text-slate-600' },
  { name: 'Landlord Details', desc: 'Your contact & login details', path: '/admin/landlord-details', tile: 'bg-slate-100 text-slate-600' },
  { name: 'Financials', desc: 'Rent, bond and payment overview', path: '/admin/financials', tile: 'bg-teal-100 text-teal-700' },
  { name: 'Transactions', desc: 'Import & analyse Frollo exports', path: '/admin/transactions', tile: 'bg-purple-100 text-purple-600' },
  { name: 'Agreements', desc: 'Create & amend accommodation agreements', path: '/admin/flatmate-agreements', tile: 'bg-amber-100 text-amber-700' },
  { name: 'Boarding Files', desc: 'Signed agreements & amendments', path: '/admin/boarding-agreements', tile: 'bg-emerald-100 text-emerald-700' },
  { name: 'Utilities Evidence', desc: 'Normalised bills evidence pack', path: '/admin/utilities-evidence', tile: 'bg-purple-100 text-purple-600' },
  { name: 'Guest Tracking', desc: 'Monitor guest nights and charges', path: '/admin/guest-tracking', tile: 'bg-purple-100 text-purple-600' },
  { name: 'Enquiries', desc: 'Requests and submissions inbox', path: '/admin/enquiries', tile: 'bg-teal-100 text-teal-700' },
  { name: 'Guardian System', desc: 'Security protocols & sensors', path: '/admin/guardian', tile: 'bg-slate-100 text-slate-600' },
  { name: 'Medical & Health', desc: 'Hospitals, GPs & home doctors nearby', path: '/flatmate/health-services', tile: 'bg-red-50 text-red-600' },
  { name: 'Settings', desc: 'Rates, thresholds & preferences', path: '/admin/settings', tile: 'bg-slate-100 text-slate-600' }
]

const quickActions = [
  { label: 'New Agreement', path: '/admin/flatmate-agreements' },
  { label: 'Request Payment', path: '/admin/payment-requests' },
  { label: 'Issue Receipt', path: '/admin/receipts' }
]
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Greeting -->
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 pt-2">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Hello, Peter 👋</h1>
        <p class="text-sm text-slate-500 mt-1.5">Here's what's happening at 1507/477 Boundary St.</p>
      </div>
    </div>

    <!-- Metrics -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="m in metrics" :key="m.label" class="card-metric">
        <div class="flex items-start justify-between mb-4">
          <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center', m.tile]">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" :d="m.icon"/>
            </svg>
          </div>
          <span :class="m.pillClass">{{ m.pill }}</span>
        </div>
        <p class="card-metric-header">{{ m.label }}</p>
        <p class="card-metric-value text-slate-900">{{ m.value }}</p>
        <p class="card-metric-detail">{{ m.detail }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="rounded-3xl bg-emerald-700 text-white p-6 sm:p-8 shadow-card-lg overflow-hidden relative">
      <div class="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-emerald-600/40 blur-2xl pointer-events-none"></div>
      <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div>
          <h2 class="font-display text-lg font-bold text-white">Quick actions</h2>
          <p class="text-sm text-emerald-100/90 mt-1">Create documents and payment requests in seconds.</p>
        </div>
        <div class="flex flex-wrap gap-2.5">
          <button
            v-for="action in quickActions"
            :key="action.path"
            @click="router.push(action.path)"
            class="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 ring-1 ring-white/20 rounded-full px-4 py-2 text-sm font-semibold transition"
          >
            {{ action.label }}
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Management tools -->
    <div>
      <p class="form-section-title mb-4">Management tools</p>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="tool in tools"
          :key="tool.path"
          @click="router.push(tool.path)"
          class="card-hover p-5 sm:p-6 text-left group"
        >
          <div class="flex items-start justify-between mb-4">
            <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105', tool.tile]">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <span
              v-if="tool.path === '/admin/messages' && unreadMessageCount > 0"
              class="badge-danger"
            >
              {{ unreadMessageCount }} new
            </span>
            <svg v-else class="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">{{ tool.name }}</h3>
          <p class="text-sm text-slate-500">{{ tool.desc }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
