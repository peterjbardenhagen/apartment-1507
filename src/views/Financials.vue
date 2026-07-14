<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()

const totalRentExpected = computed(() => tenantStore.tenants.reduce((sum, t) => sum + t.rent, 0))
const totalRentReceived = computed(() => Math.round(totalRentExpected.value * 0.95))
const bondDeposits = computed(() => tenantStore.tenants.reduce((sum, t) => sum + t.bond, 0))
const collectionRate = computed(() => Math.round((totalRentReceived.value / totalRentExpected.value) * 100))
const guestCharges = ref(0)
const outstandingAmount = computed(() => totalRentExpected.value - totalRentReceived.value)

const paymentStatusByTenant = computed(() => {
  return tenantStore.tenants.map(t => ({
    name: t.name,
    amount: t.rent,
    status: Math.random() > 0.3 ? 'paid' : Math.random() > 0.5 ? 'pending' : 'overdue',
    initials: t.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }))
})

const weeklyTrend = [
  { week: 'Week 1', amount: 1200, collected: 1140 },
  { week: 'Week 2', amount: 1200, collected: 1170 },
  { week: 'Week 3', amount: 1200, collected: 1150 },
  { week: 'Week 4', amount: 1200, collected: 1190 }
]

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'paid':
      return 'badge-success'
    case 'pending':
      return 'badge-warning'
    case 'overdue':
      return 'badge-danger'
    default:
      return 'badge-neutral'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-emerald-50'
    case 'pending':
      return 'bg-amber-50'
    case 'overdue':
      return 'bg-red-50'
    default:
      return 'bg-slate-50'
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Financials</h1>
      <p class="text-sm text-slate-500 mt-2">Weekly rent collection, bonds, and payment analysis for property management.</p>
    </div>

    <!-- Key Metrics Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Weekly Rent Expected -->
      <div class="card-metric">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="card-metric-header">Expected This Week</p>
            <p class="card-metric-value text-emerald-600">${{ totalRentExpected }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            💰
          </div>
        </div>
        <p class="card-metric-detail">
          <span class="text-emerald-600 font-semibold">↑ +2.5%</span>
          <span>from last week</span>
        </p>
      </div>

      <!-- Weekly Rent Received -->
      <div class="card-metric">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="card-metric-header">Collected So Far</p>
            <p class="card-metric-value text-blue-600">${{ totalRentReceived }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            ✓
          </div>
        </div>
        <p class="card-metric-detail">
          <span class="text-slate-600">{{ collectionRate }}% collection rate</span>
        </p>
      </div>

      <!-- Outstanding Amount -->
      <div class="card-metric">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="card-metric-header">Outstanding</p>
            <p class="card-metric-value text-amber-600">${{ outstandingAmount }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            ⏳
          </div>
        </div>
        <p class="card-metric-detail">
          <span class="text-amber-600 font-semibold">Action needed</span>
        </p>
      </div>

      <!-- Bond Held -->
      <div class="card-metric">
        <div class="flex items-start justify-between mb-3">
          <div>
            <p class="card-metric-header">Bond Held</p>
            <p class="card-metric-value text-purple-600">${{ bondDeposits }}</p>
          </div>
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            🛡️
          </div>
        </div>
        <p class="card-metric-detail">
          <span class="text-slate-600">Secured deposits</span>
        </p>
      </div>
    </div>

    <!-- Financial Health Section -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Weekly Trend Chart -->
      <div class="lg:col-span-2 card-elevated p-6">
        <div class="mb-6">
          <h2 class="text-lg font-bold text-slate-900 mb-1">4-Week Trend</h2>
          <p class="text-sm text-slate-500">Expected vs Collected rent over past 4 weeks</p>
        </div>
        <div class="space-y-4">
          <div v-for="(week, idx) in weeklyTrend" :key="idx" class="group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm font-medium text-slate-700">{{ week.week }}</span>
              <span class="text-sm text-slate-600">${{ week.collected }}/${{ week.amount }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div class="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300" :style="`width: ${(week.collected / week.amount) * 100}%`"></div>
              </div>
              <span class="text-xs font-semibold text-emerald-600 w-12 text-right">{{ Math.round((week.collected / week.amount) * 100) }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Financial Health Summary -->
      <div class="card-elevated p-6">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Health Status</h2>
        <div class="space-y-4">
          <div class="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
            <p class="text-xs font-semibold text-emerald-700 uppercase tracking-wide">✓ Strong</p>
            <p class="text-sm text-emerald-700 mt-1">Collection rate above 90%</p>
          </div>
          <div class="p-3 rounded-lg bg-blue-50 border border-blue-100">
            <p class="text-xs font-semibold text-blue-700 uppercase tracking-wide">✓ Healthy</p>
            <p class="text-sm text-blue-700 mt-1">All bonds secured</p>
          </div>
          <div class="p-3 rounded-lg bg-slate-50 border border-slate-200">
            <p class="text-xs font-semibold text-slate-700 uppercase tracking-wide">↓ Needs Attention</p>
            <p class="text-sm text-slate-700 mt-1">${{ outstandingAmount }} outstanding</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Payment Status by Tenant -->
    <div class="card-elevated p-6">
      <div class="mb-6">
        <h2 class="text-lg font-bold text-slate-900 mb-1">Payment Status by Tenant</h2>
        <p class="text-sm text-slate-500">Weekly rent collection status for each tenant</p>
      </div>

      <div v-if="tenantStore.tenants.length === 0" class="py-8 text-center">
        <p class="text-slate-500 text-sm">No tenants to display</p>
      </div>

      <div v-else class="space-y-3">
        <div v-for="tenant in paymentStatusByTenant" :key="tenant.name" :class="getStatusColor(tenant.status)" class="rounded-lg p-4 border border-slate-200 flex items-center justify-between hover:shadow-sm transition-all">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
              {{ tenant.initials }}
            </div>
            <div>
              <p class="font-semibold text-slate-900">{{ tenant.name }}</p>
              <p class="text-sm text-slate-600">Weekly rent due</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <p class="font-bold text-slate-900 text-right min-w-16">${{ tenant.amount }}</p>
            <span :class="getStatusBadgeClass(tenant.status)">
              {{ tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1) }}
            </span>
          </div>
        </div>

        <!-- Total Row -->
        <div class="border-t border-slate-200 pt-4 mt-4 flex items-center justify-between">
          <p class="font-bold text-slate-900">Total Expected</p>
          <div class="flex items-center gap-4">
            <p class="font-bold text-emerald-600 text-lg">${{ totalRentExpected }}</p>
            <span class="badge-success">On Track</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Guest Charges Section -->
    <div class="card-elevated p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Additional Charges</h2>
          <p class="text-sm text-slate-500 mt-1">Guest and utility charges</p>
        </div>
        <div class="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center text-xl">
          📋
        </div>
      </div>
      <div class="py-8 text-center">
        <p class="text-3xl font-bold text-slate-900">${{ guestCharges }}</p>
        <p class="text-sm text-slate-500 mt-2">No additional charges this week</p>
      </div>
    </div>
  </div>
</template>
