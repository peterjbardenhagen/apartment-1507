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
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Tenants</h1>
        <p class="text-sm text-slate-500 mt-1">Manage tenant information and details.</p>
      </div>
      <button @click="router.push('/admin/tenants/new')" class="btn-primary text-sm">
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add Tenant
      </button>
    </div>

    <div v-if="tenantStore.tenants.length === 0" class="card p-12 text-center">
      <div class="text-4xl mb-3">👥</div>
      <p class="text-slate-500">No tenants added yet</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="tenant in tenantStore.tenants" :key="tenant.id" 
           class="card-hover p-5 cursor-pointer"
           @click="router.push(`/admin/tenants/${tenant.id}`)">
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              {{ tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
            </div>
            <div>
              <h3 class="font-bold text-slate-900">{{ tenant.name }}</h3>
              <p class="text-xs text-slate-500">{{ tenant.room }}</p>
            </div>
          </div>
          <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">
            {{ tenant.status }}
          </span>
        </div>
        <div class="space-y-1.5 text-sm">
          <div class="flex justify-between text-slate-600">
            <span>Rent</span>
            <span class="font-medium text-slate-900">${{ tenant.rent }}/week</span>
          </div>
          <div class="flex justify-between text-slate-600">
            <span>Bond</span>
            <span class="font-medium text-slate-900">${{ tenant.bond }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
