<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'

const props = defineProps<{ id: string }>()
const tenantStore = useTenantStore()
const tenant = tenantStore.tenants.find(t => t.id.toString() === props.id)
</script>

<template>
  <div v-if="tenant" class="space-y-6">
    <h1 class="text-2xl font-bold">{{ tenant.name }}</h1>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-bold mb-2">Lease Details</h3>
      <p>Room: {{ tenant.room }}</p>
      <p>Rent: ${{ tenant.rent }}/week</p>
      <p>Bond: ${{ tenant.bond }}</p>
      <p>Lease: {{ tenant.leaseStart }} to {{ tenant.leaseEnd }}</p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h3 class="font-bold mb-2">Guest Tracking</h3>
      <p v-if="tenant.guests.length === 0">No guests recorded</p>
      <div v-for="guest in tenant.guests" :key="guest.id">
        {{ guest.name }} - {{ guest.nights }} nights
        <span v-if="guest.nights > 2" class="text-red-600">
          +${{ tenantStore.calculateGuestCharge(guest) }} extra charge
        </span>
      </div>
    </div>
  </div>
</template>