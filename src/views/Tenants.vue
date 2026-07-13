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
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-slate-800">Tenants</h1>
      <button @click="router.push('/admin/tenants/new')" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition">
        Add Tenant
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="tenant in tenantStore.tenants" :key="tenant.id" 
           class="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-lg hover:border-emerald-300 transition cursor-pointer"
           @click="router.push(`/admin/tenants/${tenant.id}`)">
        <div class="flex justify-between items-start mb-3">
          <h3 class="font-bold text-lg text-slate-800">{{ tenant.name }}</h3>
          <span class="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full font-medium">
            {{ tenant.status }}
          </span>
        </div>
        <div class="space-y-1 text-sm text-slate-600">
          <p>Room: {{ tenant.room }}</p>
          <p>Rent: ${{ tenant.rent }}/week</p>
          <p>Bond: ${{ tenant.bond }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
