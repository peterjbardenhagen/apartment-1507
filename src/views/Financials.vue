<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const totalRentReceived = 450
const bondDeposits = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const guestCharges = 0
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Financials</h1>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Weekly Rent</h3>
        <p class="text-2xl font-bold">${{ totalRentReceived }}</p>
      </div>
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-slate-600">Bond Held</h3>
        <p class="text-2xl font-bold">${{ bondDeposits }}</p>
      </div>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-4">Expected This Week</h2>
      <div class="space-y-2">
        <div v-for="tenant in tenantStore.tenants" :key="tenant.id" class="flex justify-between">
          <span>{{ tenant.name }}</span>
          <span>${{ tenant.rent }}</span>
        </div>
        <hr>
        <div class="flex justify-between font-bold">
          <span>Total</span>
          <span>${{ tenantStore.tenants.reduce((s, t) => s + t.rent, 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>