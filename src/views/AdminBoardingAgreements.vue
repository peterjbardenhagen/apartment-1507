<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import tenantAgreementsData from '@/data/tenantAgreements.json'

interface Amendment {
  id: string
  type: string
  description: string
  effectiveDate: string
  createdDate: string
  details?: Record<string, any>
}

interface Agreement {
  id: string
  tenantName: string
  startDate: string
  status: 'active' | 'inactive' | 'pending'
  weeklyRent: number
  bond: number
  utilitiesContribution?: number
  notes?: string
  documentName?: string
  amendments?: Amendment[]
}

const agreements = ref<Agreement[]>([])
const selectedAgreement = ref<Agreement | null>(null)

const activeAgreements = computed(() =>
  agreements.value.filter(a => a.status === 'active')
)

const utilitiesTotal = computed(() =>
  activeAgreements.value.reduce((sum, a) => sum + (a.utilitiesContribution || 0), 0)
)

const rentTotal = computed(() =>
  activeAgreements.value.reduce((sum, a) => sum + a.weeklyRent, 0)
)

const bondTotal = computed(() =>
  activeAgreements.value.reduce((sum, a) => sum + a.bond, 0)
)

onMounted(() => {
  agreements.value = tenantAgreementsData.agreements
})

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200'
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200'
    case 'inactive':
      return 'bg-slate-50 text-slate-700 border-slate-200'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

const getAmendmentTypeIcon = (type: string) => {
  switch (type) {
    case 'rent-increase':
      return '📈'
    case 'utilities-increase':
      return '💡'
    case 'conditions-change':
      return '📝'
    default:
      return '📄'
  }
}

const formatDate = (dateString: string) => {
  if (dateString === 'TBA') return 'TBA'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Boarding Agreements</h1>
      <p class="text-slate-500 mt-2">View and manage all tenant boarding agreements and amendments</p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-2xl">
            👥
          </div>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Active</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Active Tenants</p>
        <p class="text-3xl font-bold text-slate-900">{{ activeAgreements.length }}</p>
        <p class="text-xs text-slate-500 mt-3">Of {{ agreements.length }} total</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-2xl">
            💰
          </div>
          <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Weekly</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Weekly Rent</p>
        <p class="text-3xl font-bold text-slate-900">${{ rentTotal }}</p>
        <p class="text-xs text-slate-500 mt-3">Active tenants only</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center text-2xl">
            🛡️
          </div>
          <span class="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Total</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Bond Held</p>
        <p class="text-3xl font-bold text-slate-900">${{ bondTotal }}</p>
        <p class="text-xs text-slate-500 mt-3">Security deposits</p>
      </div>

      <div class="card-elevated p-6 group hover:shadow-lg transition-all">
        <div class="flex items-start justify-between mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center text-2xl">
            💡
          </div>
          <span class="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">Weekly</span>
        </div>
        <p class="text-sm font-medium text-slate-600 mb-1">Total Utilities</p>
        <p class="text-3xl font-bold text-slate-900">${{ utilitiesTotal }}</p>
        <p class="text-xs text-slate-500 mt-3">Tenant contributions</p>
      </div>
    </div>

    <!-- Agreements Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="agreement in agreements"
        :key="agreement.id"
        class="card-elevated p-6 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all"
        @click="selectedAgreement = agreement"
      >
        <!-- Header -->
        <div class="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ agreement.tenantName }}</h3>
            <p class="text-sm text-slate-500 mt-1">Since {{ formatDate(agreement.startDate) }}</p>
          </div>
          <span :class="['badge border', getStatusColor(agreement.status)]">
            {{ agreement.status.charAt(0).toUpperCase() + agreement.status.slice(1) }}
          </span>
        </div>

        <!-- Details -->
        <div class="space-y-3 mb-4">
          <div class="flex justify-between">
            <span class="text-sm text-slate-600">Weekly Rent</span>
            <span class="font-semibold text-slate-900" v-if="agreement.weeklyRent > 0">${{ agreement.weeklyRent }}</span>
            <span class="font-semibold text-slate-500" v-else>—</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-600">Bond</span>
            <span class="font-semibold text-slate-900" v-if="agreement.bond > 0">${{ agreement.bond }}</span>
            <span class="font-semibold text-slate-500" v-else>—</span>
          </div>
          <div class="flex justify-between">
            <span class="text-sm text-slate-600">Utilities</span>
            <span class="font-semibold text-emerald-600" v-if="agreement.utilitiesContribution">${{ agreement.utilitiesContribution }}/week</span>
            <span class="font-semibold text-slate-500" v-else>TBD</span>
          </div>
        </div>

        <!-- Amendments Badge -->
        <div v-if="agreement.amendments && agreement.amendments.length > 0" class="pt-4 border-t border-slate-100">
          <div class="flex items-center gap-2">
            <span class="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">
              {{ agreement.amendments.length }} Amendment{{ agreement.amendments.length !== 1 ? 's' : '' }}
            </span>
          </div>
        </div>

        <!-- Document -->
        <div v-if="agreement.documentName" class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ agreement.documentName }}
        </div>
      </div>
    </div>

    <!-- Selected Agreement Details -->
    <div v-if="selectedAgreement" class="card-elevated p-8 border-l-4 border-l-purple-500">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">{{ selectedAgreement.tenantName }}</h2>
          <p class="text-slate-500 mt-1">{{ selectedAgreement.notes }}</p>
        </div>
        <button @click="selectedAgreement = null" class="text-slate-400 hover:text-slate-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Key Information -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-slate-200">
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Start Date</p>
          <p class="text-lg font-bold text-slate-900">{{ formatDate(selectedAgreement.startDate) }}</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Status</p>
          <p :class="['text-lg font-bold', selectedAgreement.status === 'active' ? 'text-emerald-600' : selectedAgreement.status === 'pending' ? 'text-amber-600' : 'text-slate-600']">
            {{ selectedAgreement.status.charAt(0).toUpperCase() + selectedAgreement.status.slice(1) }}
          </p>
        </div>
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">Document</p>
          <p class="text-sm font-medium text-slate-900">{{ selectedAgreement.documentName || 'On File' }}</p>
        </div>
      </div>

      <!-- Financial Details -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <p class="text-sm text-emerald-700 font-semibold mb-1">Weekly Rent</p>
          <p class="text-2xl font-bold text-emerald-700">${{ selectedAgreement.weeklyRent }}</p>
        </div>
        <div class="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p class="text-sm text-blue-700 font-semibold mb-1">Bond</p>
          <p class="text-2xl font-bold text-blue-700">${{ selectedAgreement.bond }}</p>
        </div>
        <div class="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <p class="text-sm text-amber-700 font-semibold mb-1">Utilities/Week</p>
          <p class="text-2xl font-bold text-amber-700">${{ selectedAgreement.utilitiesContribution || 'TBD' }}</p>
        </div>
      </div>

      <!-- Amendments -->
      <div v-if="selectedAgreement.amendments && selectedAgreement.amendments.length > 0">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Amendments</h3>
        <div class="space-y-4">
          <div
            v-for="amendment in selectedAgreement.amendments"
            :key="amendment.id"
            class="p-4 bg-slate-50 border border-slate-200 rounded-lg"
          >
            <div class="flex items-start gap-3 mb-2">
              <span class="text-xl">{{ getAmendmentTypeIcon(amendment.type) }}</span>
              <div>
                <p class="font-semibold text-slate-900">{{ amendment.description }}</p>
                <p class="text-sm text-slate-600 mt-1">
                  Effective: {{ formatDate(amendment.effectiveDate) }} | Created: {{ formatDate(amendment.createdDate) }}
                </p>
              </div>
            </div>
            <div v-if="amendment.details" class="mt-3 text-sm text-slate-600">
              <p v-for="(value, key) in amendment.details" :key="key" class="mb-1">
                <strong>{{ key }}:</strong> {{ typeof value === 'object' ? JSON.stringify(value) : value }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
