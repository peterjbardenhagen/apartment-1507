<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const allGuests = tenantStore.tenants.flatMap(t => 
  t.guests.map(g => ({ ...g, tenantName: t.name }))
)
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Guest Tracking</h1>
      <p class="text-slate-500 mt-2">Monitor guest nights and calculate charges for extended stays</p>
    </div>

    <!-- Policy Info Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
      <!-- Policy Card -->
      <div class="card-elevated p-6 border-l-4 border-l-amber-500">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-600 flex items-center justify-center text-2xl shrink-0">
            📋
          </div>
          <div>
            <h3 class="font-bold text-slate-900 mb-1">Guest Policy</h3>
            <p class="text-sm text-slate-600 mb-2">Guests staying more than 2 nights per week incur extra charges</p>
            <p class="text-xs text-slate-500">
              <strong>Rate:</strong> ${{ tenantStore.tenants[0]?.rent || 450 }}/week ÷ 7 = <strong class="text-amber-600">${{ ((tenantStore.tenants[0]?.rent || 450) / 7).toFixed(2) }}/night</strong>
            </p>
          </div>
        </div>
      </div>

      <!-- Free Nights Card -->
      <div class="card-elevated p-6 border-l-4 border-l-emerald-500">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
            🌙
          </div>
          <div>
            <h3 class="font-bold text-slate-900 mb-1">Free Guest Nights</h3>
            <p class="text-3xl font-bold text-emerald-600 my-2">2 nights</p>
            <p class="text-xs text-slate-500">Per tenant, per week</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Guests Table -->
    <div class="card-elevated overflow-hidden">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-lg font-bold text-slate-900">Guest Records</h2>
        <p class="text-sm text-slate-500 mt-1">Current guest stays and associated charges</p>
      </div>

      <div v-if="allGuests.length === 0" class="p-12 text-center">
        <div class="text-4xl mb-3">🏠</div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Guest Records</h3>
        <p class="text-slate-600">Guest information will appear here when records are added</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 bg-slate-50">
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Guest Name</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tenant</th>
              <th class="px-6 py-4 text-left text-sm font-semibold text-slate-700">Nights</th>
              <th class="px-6 py-4 text-right text-sm font-semibold text-slate-700">Charge</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="guest in allGuests" :key="guest.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
              <td class="px-6 py-4">
                <p class="font-medium text-slate-900">{{ guest.name }}</p>
              </td>
              <td class="px-6 py-4">
                <p class="text-sm text-slate-600">{{ guest.tenantName }}</p>
              </td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold',
                  guest.nights > 2
                    ? 'bg-red-50 text-red-700'
                    : 'bg-emerald-50 text-emerald-700'
                ]">
                  {{ guest.nights }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <p :class="[
                  'font-semibold',
                  guest.nights > 2 ? 'text-red-600' : 'text-slate-500'
                ]">
                  ${{ guest.nights > 2 ? ((guest.nights - 2) * ((tenantStore.tenants[0]?.rent || 450) / 7)).toFixed(2) : '0.00' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
