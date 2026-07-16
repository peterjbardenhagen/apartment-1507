<script setup lang="ts">
import { useTenantStore } from '@/stores/tenant'
import { useRouter } from 'vue-router'

const tenantStore = useTenantStore()
const router = useRouter()
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Tenants</h1>
        <p class="text-slate-500 mt-2">Manage tenant information, rent, and bond details</p>
      </div>
      <button @click="router.push('/admin/tenants/new')" class="btn-primary inline-flex items-center gap-2 self-start sm:self-auto">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        <span>Add Tenant</span>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="tenantStore.tenants.length === 0" class="card-elevated p-16 text-center">
      <div class="text-6xl mb-4">👥</div>
      <h3 class="text-xl font-bold text-slate-900 mb-2">No Tenants Yet</h3>
      <p class="text-slate-600 mb-6">Start by adding your first tenant to the system</p>
      <button
        @click="router.push('/admin/tenants/new')"
        class="btn-primary inline-flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
        Add First Tenant
      </button>
    </div>

    <!-- Tenants Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="tenant in tenantStore.tenants"
        :key="tenant.id"
        class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all"
        @click="router.push(`/admin/tenants/${tenant.id}`)"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-5">
          <div class="flex items-center gap-4 min-w-0">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:scale-110 transition-transform">
              {{ tenant.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
            </div>
            <div class="min-w-0">
              <h3 class="font-bold text-slate-900 truncate">{{ tenant.name }}</h3>
              <p class="text-xs text-slate-500">{{ tenant.room }}</p>
            </div>
          </div>
          <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            {{ tenant.status }}
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-3 border-t border-slate-100 pt-4">
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">Weekly Rent</span>
            <span class="font-semibold text-emerald-600">${{ tenant.rent }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-sm text-slate-600">Bond Held</span>
            <span class="font-semibold text-blue-600">${{ tenant.bond }}</span>
          </div>
        </div>

        <!-- Contact -->
        <div v-if="tenant.email || tenant.contact" class="mt-4 pt-4 border-t border-slate-100 space-y-1 text-xs text-slate-500">
          <p v-if="tenant.email" class="truncate">{{ tenant.email }}</p>
          <p v-if="tenant.contact">{{ tenant.contact }}</p>
        </div>

        <!-- Footer -->
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span v-if="tenant.username" class="badge bg-purple-50 text-purple-700 border border-purple-200">
            Login enabled
          </span>
          <span v-else class="text-xs text-slate-400">No login access</span>
          <svg class="w-4 h-4 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>
