<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const totalRentReceived = 450
const bondDeposits = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const guestCharges = 0
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Financials</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-sm text-slate-500 mb-1">Weekly Rent</p>
        <p class="text-3xl font-bold text-emerald-600">${{ totalRentReceived }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-sm text-slate-500 mb-1">Bond Held</p>
        <p class="text-3xl font-bold text-blue-600">${{ bondDeposits }}</p>
      </div>
      <div class="bg-white border border-slate-200 rounded-xl p-5">
        <p class="text-sm text-slate-500 mb-1">Guest Charges</p>
        <p class="text-3xl font-bold text-slate-600">${{ guestCharges }}</p>
      </div>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-4">Expected This Week</h2>
      <div class="space-y-3">
        <div v-for="tenant in tenantStore.tenants" :key="tenant.id" class="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
          <span class="text-slate-700">{{ tenant.name }}</span>
          <span class="font-semibold text-slate-800">${{ tenant.rent }}</span>
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-slate-200">
          <span class="font-bold text-slate-800">Total</span>
          <span class="font-bold text-emerald-600 text-lg">${{ tenantStore.tenants.reduce((s, t) => s + t.rent, 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
