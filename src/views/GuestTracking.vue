<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const allGuests = tenantStore.tenants.flatMap(t => 
  t.guests.map(g => ({ ...g, tenantName: t.name }))
)
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Guest Tracking</h1>
    
    <div class="bg-white rounded-lg shadow p-4">
      <p class="text-slate-600">Guests staying more than 2 nights/week incur extra charges at standard rate</p>
      <p class="text-slate-600">Rate: ${{ tenantStore.tenants[0]?.rent || 450 }}/week ÷ 7 nights</p>
    </div>
    
    <div class="bg-white rounded-lg shadow">
      <table class="w-full">
        <thead class="bg-slate-50">
          <tr>
            <th class="p-3 text-left">Guest</th>
            <th class="p-3 text-left">Tenant</th>
            <th class="p-3 text-left">Nights</th>
            <th class="p-3 text-left">Extra Charge</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="guest in allGuests" :key="guest.id" class="border-t">
            <td class="p-3">{{ guest.name }}</td>
            <td class="p-3">{{ guest.tenantName }}</td>
            <td class="p-3">{{ guest.nights }}</td>
            <td class="p-3" :class="guest.nights > 2 ? 'text-red-600' : ''">
              ${{ guest.nights > 2 ? ((guest.nights - 2) * ((tenantStore.tenants[0]?.rent || 450) / 7)).toFixed(2) : 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>