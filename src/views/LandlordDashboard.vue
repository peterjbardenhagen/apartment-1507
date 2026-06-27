<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'

const router = useRouter()
const auth = useAuthStore()
const tenantStore = useTenantStore()

const totalRent = tenantStore.tenants.reduce((sum, t) => sum + t.rent, 0)
const totalBond = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const activeCount = tenantStore.tenants.filter(t => t.status === 'active').length

const impersonate = (username: string) => {
  auth.impersonate(username)
  router.push('/flatmate')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Landlord Portal</h1>
      <button @click="$router.push('/flatmate/login')" class="text-sm bg-blue-600 text-white px-3 py-1 rounded">
        Switch to Flatmate View
      </button>
    </div>
    
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Total Rent/Week</h3>
        <p class="text-3xl font-bold text-green-600">${{ totalRent }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Bond Held</h3>
        <p class="text-3xl font-bold text-blue-600">${{ totalBond }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Active Tenants</h3>
        <p class="text-3xl font-bold text-purple-600">{{ activeCount }}</p>
      </div>
    </div>
    
    <div class="space-y-4">
      <h2 class="text-lg font-bold">Apartment Guardian Documentation</h2>
      <div class="bg-white rounded-lg shadow p-4">
        <a href="/Apartment-Guardian.md" class="text-blue-600 hover:underline">.md version</a>
        <span class="mx-2">|</span>
        <a href="/apartment-guardian-system.html" class="text-blue-600 hover:underline">HTML version</a>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-4">Manage Tenants</h2>
      <button @click="$router.push('/tenants')" class="bg-green-600 text-white px-4 py-2 rounded">
        Add/Edit Tenants
      </button>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-4">Impersonate Flatmate (Testing)</h2>
      <button @click="impersonate('kevin')" class="bg-blue-600 text-white px-4 py-2 rounded text-sm">
        Login as Kevin
      </button>
    </div>
  </div>
</template>