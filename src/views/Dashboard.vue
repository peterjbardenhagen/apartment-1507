<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const totalRent = tenantStore.tenants.reduce((sum, t) => sum + t.rent, 0)
const totalBond = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const activeTenants = tenantStore.tenants.filter(t => t.status === 'active').length
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Dashboard</h1>
    
    <div class="grid grid-cols-3 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Total Rent/Week</h3>
        <p class="text-3xl font-bold text-green-600">${{ totalRent }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Total Bond</h3>
        <p class="text-3xl font-bold text-blue-600">${{ totalBond }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Active Tenants</h3>
        <p class="text-3xl font-bold text-purple-600">{{ activeTenants }}</p>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-4">Recent Tenants</h2>
      <div v-for="tenant in tenantStore.tenants" :key="tenant.id" class="border-b py-2">
        {{ tenant.name }} - ${{ tenant.rent }}/week
      </div>
    </div>
  </div>
</template>