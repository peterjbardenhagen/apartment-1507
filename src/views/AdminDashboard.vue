<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'

const router = useRouter()
const auth = useAuthStore()
const tenantStore = useTenantStore()

const totalRent = tenantStore.tenants.reduce((sum, t) => sum + t.rent, 0)
const totalBond = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const activeTenants = tenantStore.tenants.filter(t => t.status === 'active').length
const monthlyRevenue = totalRent * 4.33

const handleLogout = () => {
  auth.logout()
  router.push('/')
}

const quickActions = [
  { label: 'View Agreements', icon: '📋', path: '/admin/flatmate-agreements' },
  { label: 'Create Payment', icon: '💳', path: '/admin/payment-requests' },
  { label: 'Generate Receipt', icon: '🧾', path: '/admin/receipts' }
]
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
        <p class="text-slate-500 mt-2">Property 1507 • 477 Boundary St, Spring Hill QLD 4000</p>
      </div>
      <button @click="handleLogout" class="btn-secondary flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
        Exit Admin
      </button>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-2xl">
            💰
          </div>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Weekly</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Weekly Rent</p>
        <p class="text-3xl font-bold text-slate-900">${{ totalRent }}</p>
        <p class="text-xs text-slate-500 mt-3">From {{ activeTenants }} active tenants</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">
            📈
          </div>
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Monthly</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Estimated Revenue</p>
        <p class="text-3xl font-bold text-slate-900">${{ monthlyRevenue.toFixed(0) }}</p>
        <p class="text-xs text-slate-500 mt-3">4.33 weeks per month</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Held</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Bond Held</p>
        <p class="text-3xl font-bold text-slate-900">${{ totalBond }}</p>
        <p class="text-xs text-slate-500 mt-3">Tenant security deposit</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center text-2xl">
            👥
          </div>
          <span class="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-full">Active</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Tenants</p>
        <p class="text-3xl font-bold text-slate-900">{{ activeTenants }}</p>
        <p class="text-xs text-slate-500 mt-3">Of {{ tenantStore.tenants.length }} total</p>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
      <h2 class="text-xl font-bold mb-6">Quick Actions</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          v-for="action in quickActions"
          :key="action.path"
          @click="router.push(action.path)"
          class="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl p-4 transition-all text-left group"
        >
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">{{ action.icon }}</div>
          <p class="font-semibold">{{ action.label }}</p>
        </button>
      </div>
    </div>

    <!-- Features Grid -->
    <div>
      <h2 class="text-lg font-bold text-slate-900 mb-5">Management Tools</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Tenant Management Section -->
        <div @click="router.push('/admin/tenants')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              👥
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Tenants</h3>
          <p class="text-sm text-slate-500">Manage tenant list and details</p>
        </div>

        <!-- Financials Section -->
        <div @click="router.push('/admin/financials')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              💰
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Financials</h3>
          <p class="text-sm text-slate-500">Rent, bond, and payment overview</p>
        </div>

        <!-- Transactions Section -->
        <div @click="router.push('/admin/transactions')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📥
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Transactions</h3>
          <p class="text-sm text-slate-500">Import & analyze Frollo exports</p>
        </div>

        <!-- Agreements Section -->
        <div @click="router.push('/admin/flatmate-agreements')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📋
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Agreements</h3>
          <p class="text-sm text-slate-500">Create & manage accommodation agreements</p>
        </div>

        <!-- Boarding Files Section -->
        <div @click="router.push('/admin/boarding-agreements')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📄
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Boarding Files</h3>
          <p class="text-sm text-slate-500">View signed agreements & amendments</p>
        </div>

        <!-- Guest Tracking Section -->
        <div @click="router.push('/admin/guest-tracking')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🏠
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Guest Tracking</h3>
          <p class="text-sm text-slate-500">Monitor guest nights and charges</p>
        </div>

        <!-- Settings Section -->
        <div @click="router.push('/admin/settings')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              ⚙️
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Settings</h3>
          <p class="text-sm text-slate-500">Configure rates and thresholds</p>
        </div>
      </div>
    </div>

    <!-- Advanced Features -->
    <div>
      <h2 class="text-lg font-bold text-slate-900 mb-5">Advanced Features</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div @click="router.push('/admin/guardian')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all border-l-4 border-l-blue-500">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              🛡️
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Guardian System</h3>
          <p class="text-sm text-slate-500 mb-3">Security protocols and sensor status</p>
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Security</span>
        </div>

        <div @click="router.push('/admin/guardian-docs')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all border-l-4 border-l-blue-500">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📖
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Guardian Documentation</h3>
          <p class="text-sm text-slate-500 mb-3">Hardware requirements and billing</p>
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Reference</span>
        </div>

        <div @click="router.push('/admin/enquiries')" class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all border-l-4 border-l-purple-500">
          <div class="flex items-start justify-between mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              📨
            </div>
            <svg class="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">Enquiries</h3>
          <p class="text-sm text-slate-500 mb-3">Manage requests and submissions</p>
          <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-full">Communication</span>
        </div>
      </div>
    </div>
  </div>
</template>
