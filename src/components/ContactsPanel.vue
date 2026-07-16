<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useTenantStore } from '@/stores/tenant'
import { landlordService, type LandlordAccount } from '@/services/landlordService'

const tenantStore = useTenantStore()
const landlord = ref<LandlordAccount | null>(null)

onMounted(async () => {
  landlord.value = await landlordService.getLandlord()
})

const initials = (name: string) =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
</script>

<template>
  <div class="space-y-6">
    <!-- Landlord -->
    <div v-if="landlord">
      <p class="form-section-title mb-3">Landlord</p>
      <div class="card-elevated p-6 flex flex-wrap items-center gap-5">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">
          {{ initials(landlord.name) }}
        </div>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-slate-900">{{ landlord.name }}</p>
          <p class="text-xs text-slate-500 mb-2">Landlord · 1507/477 Boundary St, Spring Hill</p>
          <div class="flex flex-wrap gap-4 text-sm">
            <a v-if="landlord.email" :href="`mailto:${landlord.email}`" class="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {{ landlord.email }}
            </a>
            <a v-if="landlord.phone" :href="`tel:${landlord.phone}`" class="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              {{ landlord.phone }}
            </a>
            <span v-if="!landlord.email && !landlord.phone" class="text-slate-400">No contact details on file</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tenants -->
    <div>
      <p class="form-section-title mb-3">Flatmates</p>
      <div v-if="tenantStore.tenants.length === 0" class="card-elevated p-8 text-center text-slate-500">
        No tenants on file yet.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="t in tenantStore.tenants" :key="t.id" class="card-elevated p-6">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
              {{ initials(t.name) }}
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <p class="font-bold text-slate-900">{{ t.name }}</p>
                <span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">{{ t.status }}</span>
              </div>
              <p class="text-xs text-slate-500 mb-2">{{ t.room }}</p>
              <div class="flex flex-col gap-1.5 text-sm">
                <a v-if="t.email" :href="`mailto:${t.email}`" class="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium truncate">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <span class="truncate">{{ t.email }}</span>
                </a>
                <a v-if="t.contact" :href="`tel:${t.contact}`" class="inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 font-medium">
                  <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  {{ t.contact }}
                </a>
                <span v-if="!t.email && !t.contact" class="text-slate-400 text-xs">No contact details on file</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
