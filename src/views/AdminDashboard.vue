<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
      <button @click="handleLogout" class="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
        Exit Admin
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div @click="router.push('/admin/tenants')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-emerald-100 transition">👥</div>
        <h2 class="font-bold text-slate-800">Tenants</h2>
        <p class="text-sm text-slate-500 mt-1">Manage tenant list and details</p>
      </div>

      <div @click="router.push('/admin/financials')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-emerald-100 transition">💰</div>
        <h2 class="font-bold text-slate-800">Financials</h2>
        <p class="text-sm text-slate-500 mt-1">Rent, bond, and payment overview</p>
      </div>

      <div @click="router.push('/admin/guest-tracking')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-emerald-100 transition">📋</div>
        <h2 class="font-bold text-slate-800">Guest Tracking</h2>
        <p class="text-sm text-slate-500 mt-1">Monitor guest nights and charges</p>
      </div>

      <div @click="router.push('/admin/settings')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-emerald-100 transition">⚙️</div>
        <h2 class="font-bold text-slate-800">Settings</h2>
        <p class="text-sm text-slate-500 mt-1">Configure rates and thresholds</p>
      </div>

      <div @click="router.push('/admin/guardian')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-blue-100 transition">🛡️</div>
        <h2 class="font-bold text-slate-800">Guardian System</h2>
        <p class="text-sm text-slate-500 mt-1">Security protocols and sensor status</p>
      </div>

      <div @click="router.push('/admin/guardian-docs')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-blue-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-blue-100 transition">📖</div>
        <h2 class="font-bold text-slate-800">Guardian Documentation</h2>
        <p class="text-sm text-slate-500 mt-1">Hardware requirements and billing rules</p>
      </div>

      <div @click="router.push('/admin/enquiries')" class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-purple-300 transition cursor-pointer group">
        <div class="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center text-xl mb-3 group-hover:bg-purple-100 transition">📨</div>
        <h2 class="font-bold text-slate-800">Flatmate Enquiries</h2>
        <p class="text-sm text-slate-500 mt-1">Manage requests and submissions</p>
      </div>
    </div>
  </div>
</template>
