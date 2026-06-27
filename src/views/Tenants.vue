<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const tenantStore = useTenantStore()
const router = useRouter()

onMounted(() => {
  tenantStore.$reset()
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Tenants</h1>
    
    <div class="bg-white rounded-lg shadow p-4">
      <button @click="router.push('/tenants/new')" class="bg-green-600 text-white px-4 py-2 rounded">
        Add Tenant
      </button>
    </div>
    
    <div class="space-y-4">
      <div v-for="tenant in tenantStore.tenants" :key="tenant.id" 
           class="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md"
           @click="router.push(`/tenants/${tenant.id}`)">
        <h3 class="font-bold text-lg">{{ tenant.name }}</h3>
        <p class="text-slate-600">Room: {{ tenant.room }}</p>
        <p class="text-slate-600">Rent: ${{ tenant.rent }}/week</p>
        <p class="text-slate-600">Bond: ${{ tenant.bond }}</p>
        <span class="inline-block px-2 py-1 text-xs bg-green-100 text-green-800 rounded">{{ tenant.status }}</span>
      </div>
    </div>
  </div>
</template>