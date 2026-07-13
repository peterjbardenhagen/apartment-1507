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

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p class="text-sm text-slate-500 mt-1">Welcome back. Here's what's happening with your property.</p>
      </div>
      <button @click="handleLogout" class="btn-secondary text-sm">
        <span class="mr-2">🚪</span>
        Exit Admin
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 mb-1">Total Rent/Week</p>
            <p class="text-2xl font-bold text-slate-900">${{ totalRent }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            💰
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 mb-1">Bond Held</p>
            <p class="text-2xl font-bold text-slate-900">${{ totalBond }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            🛡️
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 mb-1">Active Tenants</p>
            <p class="text-2xl font-bold text-slate-900">{{ activeTenants }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            👥
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div @click="router.push('/admin/tenants')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            👥
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Tenants</h2>
            <p class="text-sm text-slate-500 mt-0.5">Manage tenant list and details</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/financials')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            💰
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Financials</h2>
            <p class="text-sm text-slate-500 mt-0.5">Rent, bond, and payment overview</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/guest-tracking')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            📋
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Guest Tracking</h2>
            <p class="text-sm text-slate-500 mt-0.5">Monitor guest nights and charges</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/settings')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            ⚙️
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Settings</h2>
            <p class="text-sm text-slate-500 mt-0.5">Configure rates and thresholds</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/guardian')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            🛡️
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Guardian System</h2>
            <p class="text-sm text-slate-500 mt-0.5">Security protocols and sensor status</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/guardian-docs')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            📖
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Guardian Docs</h2>
            <p class="text-sm text-slate-500 mt-0.5">Hardware requirements and billing rules</p>
          </div>
        </div>
      </div>

      <div @click="router.push('/admin/enquiries')" class="card-hover p-5 cursor-pointer group">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            📨
          </div>
          <div>
            <h2 class="font-semibold text-slate-900">Enquiries</h2>
            <p class="text-sm text-slate-500 mt-0.5">Manage requests and submissions</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
