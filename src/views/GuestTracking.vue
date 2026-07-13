<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const allGuests = tenantStore.tenants.flatMap(t => 
  t.guests.map(g => ({ ...g, tenantName: t.name }))
)
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Guest Tracking</h1>

    <div class="bg-white border border-slate-200 rounded-xl p-5">
      <p class="text-slate-600 text-sm mb-1">Guests staying more than 2 nights/week incur extra charges at the standard weekly rate.</p>
      <p class="text-slate-600 text-sm">Rate: ${{ tenantStore.tenants[0]?.rent || 450 }}/week ÷ 7 nights = ${{ ((tenantStore.tenants[0]?.rent || 450) / 7).toFixed(2) }}/night</p>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table class="w-full">
        <thead class="bg-slate-50 border-b border-slate-200">
          <tr>
            <th class="p-4 text-left text-sm font-semibold text-slate-600">Guest</th>
            <th class="p-4 text-left text-sm font-semibold text-slate-600">Tenant</th>
            <th class="p-4 text-left text-sm font-semibold text-slate-600">Nights</th>
            <th class="p-4 text-left text-sm font-semibold text-slate-600">Extra Charge</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in allGuests" :key="guest.id" class="border-b border-slate-100 hover:bg-slate-50 transition">
            <td class="p-4 text-slate-800">{{ guest.name }}</td>
            <td class="p-4 text-slate-600">{{ guest.tenantName }}</td>
            <td class="p-4 text-slate-800">{{ guest.nights }}</td>
            <td class="p-4 font-medium" :class="guest.nights > 2 ? 'text-red-600' : 'text-slate-500'">
              ${{ guest.nights > 2 ? ((guest.nights - 2) * ((tenantStore.tenants[0]?.rent || 450) / 7)).toFixed(2) : '0.00' }}
            </td>
          </tr>
          <tr v-if="allGuests.length === 0">
            <td colspan="4" class="p-8 text-center text-slate-500">No guest records yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
