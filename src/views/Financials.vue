<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const totalRentReceived = 450
const bondDeposits = tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0)
const guestCharges = 0
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Financials</h1>
      <p class="text-sm text-slate-500 mt-1">Financial overview and payment tracking.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 mb-1">Weekly Rent</p>
            <p class="text-2xl font-bold text-slate-900">${{ totalRentReceived }}</p>
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
            <p class="text-2xl font-bold text-slate-900">${{ bondDeposits }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            🛡️
          </div>
        </div>
      </div>
      <div class="card p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500 mb-1">Guest Charges</p>
            <p class="text-2xl font-bold text-slate-900">${{ guestCharges }}</p>
          </div>
          <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            📋
          </div>
        </div>
      </div>
    </div>

    <div class="card overflow-hidden">
      <div class="px-6 py-4 border-b border-slate-200">
        <h2 class="text-base font-bold text-slate-900">Expected This Week</h2>
      </div>
      <div class="divide-y divide-slate-100">
        <div v-for="tenant in tenantStore.tenants" :key="tenant.id" class="px-6 py-4 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
              {{ tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
            </div>
            <span class="text-slate-700">{{ tenant.name }}</span>
          </div>
          <span class="font-semibold text-slate-900">${{ tenant.rent }}</span>
        </div>
        <div v-if="tenantStore.tenants.length === 0" class="px-6 py-8 text-center text-slate-500">
          No tenants to display
        </div>
        <div v-else class="px-6 py-4 bg-slate-50 flex justify-between items-center border-t border-slate-200">
          <span class="font-bold text-slate-900">Total</span>
          <span class="font-bold text-emerald-600 text-lg">${{ tenantStore.tenants.reduce((s, t) => s + t.rent, 0) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
