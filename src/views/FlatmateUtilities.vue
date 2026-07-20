<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  parseTransactionsForAnalytics,
  calculateCostAllocations,
  getMonthlyTotals,
  compareToBenchmark,
  BRISBANE_BENCHMARKS,
  FLATMATE_CONTRIBUTIONS,
  formatCurrency,
  getVarianceColor,
  getStatusIcon,
  type WeeklyMetrics,
  type CostAllocation
} from '@/services/utilitiesAnalyticsService'

const router = useRouter()
const weeklyMetrics = ref<WeeklyMetrics[]>([])
const costAllocations = ref<CostAllocation[]>([])
const selectedView = ref<'weekly' | 'monthly'>('weekly')
const selectedService = ref<'all' | 'Electricity' | 'Water' | 'Broadband'>('all')
const isSampleData = ref(false)

const WEEKLY_BUDGET = 210
const MONTHLY_BUDGET = WEEKLY_BUDGET * 4.33
const BUDGET_TOLERANCE = 0.07 // within 7% counts as "on budget"

onMounted(() => {
  loadAnalytics()
})

const loadAnalytics = () => {
  const transactionsStored = localStorage.getItem('importedTransactions')

  let transactions: any[] = []
  if (transactionsStored) {
    try {
      transactions = JSON.parse(transactionsStored)
    } catch {
      transactions = []
    }
  }

  // If no real transactions have been imported yet, show sample data so the
  // page isn't empty — clearly labelled so it's never mistaken for real bills.
  if (transactions.length === 0) {
    transactions = generateSampleData()
    isSampleData.value = true
  } else {
    isSampleData.value = false
  }

  weeklyMetrics.value = parseTransactionsForAnalytics(transactions)
  costAllocations.value = calculateCostAllocations(weeklyMetrics.value)
}

const generateSampleData = () => {
  const data = []
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 84) // Start 12 weeks ago

  for (let week = 0; week < 12; week++) {
    const weekDate = new Date(baseDate)
    weekDate.setDate(weekDate.getDate() + week * 7)

    // Electricity: varies $60-$75/week
    data.push({
      date: weekDate.toISOString(),
      merchant: 'Origin Energy',
      description: 'Electricity bill',
      amount: 60 + Math.random() * 15,
      category: 'Electricity',
      confidence: 'high'
    })

    // Water: varies $30-$45/week
    data.push({
      date: weekDate.toISOString(),
      merchant: 'Brisbane Water',
      description: 'Water bill',
      amount: 30 + Math.random() * 15,
      category: 'Water',
      confidence: 'high'
    })

    // Broadband: $45/week (usually fixed)
    data.push({
      date: weekDate.toISOString(),
      merchant: 'Origin Broadband',
      description: 'Internet bill',
      amount: 45,
      category: 'Broadband',
      confidence: 'high'
    })
  }

  return data
}

const monthlyMetrics = computed(() => getMonthlyTotals(weeklyMetrics.value))

const benchmarkComparisons = computed(() => {
  return BRISBANE_BENCHMARKS.map(benchmark => compareToBenchmark(weeklyMetrics.value, benchmark))
})

const avgWeeklyCost = computed(() => {
  if (weeklyMetrics.value.length === 0) return 0
  return weeklyMetrics.value.reduce((sum, w) => sum + w.totalCost, 0) / weeklyMetrics.value.length
})

const avgMonthlyCost = computed(() => avgWeeklyCost.value * 4.33)

// Bills take a while to land, so we compare the most recently *completed*
// month of tracked data against the monthly budget rather than the
// still-filling-up current month.
const lastMonthStatus = computed(() => {
  const months = monthlyMetrics.value
  if (months.length === 0) {
    return { label: 'No data yet', month: '', total: 0, tone: 'neutral' as const }
  }

  const last = months[months.length - 1]
  const varianceRatio = (last.totalCost - MONTHLY_BUDGET) / MONTHLY_BUDGET

  let label: string
  let tone: 'over' | 'under' | 'on' | 'neutral'
  if (varianceRatio > BUDGET_TOLERANCE) {
    label = 'Exceeding Budget'
    tone = 'over'
  } else if (varianceRatio < -BUDGET_TOLERANCE) {
    label = 'Below Budget'
    tone = 'under'
  } else {
    label = 'On Budget'
    tone = 'on'
  }

  return { label, month: last.month, total: last.totalCost, tone }
})

const filteredMetrics = computed(() => {
  if (selectedService.value === 'all') {
    return weeklyMetrics.value
  }

  return weeklyMetrics.value.map((week) => {
    if (selectedService.value === 'Electricity') {
      return { ...week, totalCost: week.energyCost }
    } else if (selectedService.value === 'Water') {
      return { ...week, totalCost: week.waterCost }
    } else if (selectedService.value === 'Broadband') {
      return { ...week, totalCost: week.broadbandCost }
    }
    return week
  })
})

const getContributionColor = (name: string): string => {
  const flatmate = FLATMATE_CONTRIBUTIONS.find(f => f.name === name)
  return flatmate?.color || 'bg-slate-500'
}

const getVarianceStatus = (allocation: CostAllocation) => {
  if (allocation.isOverBudget) {
    const overage = allocation.weeklyShare - allocation.weeklyAmount
    return `Over budget by ${formatCurrency(overage)}/week`
  } else {
    return `Under budget by ${formatCurrency(-allocation.variance)}/week`
  }
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="max-w-6xl mx-auto">
        <div class="bg-white rounded-full shadow-card px-4 sm:px-6 py-3 flex items-center justify-between">
          <button @click="router.push('/flatmate/dashboard')" class="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Flatmate Portal
          </button>
          <span class="font-display font-bold text-slate-900 text-sm">Apartment 1507</span>
        </div>
      </div>
    </header>

    <!-- Heading -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-2 animate-fade-in">
      <div class="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/>
        </svg>
      </div>
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Bills Tracker</h1>
      <p class="mt-2 text-slate-500 max-w-xl">
        Utilities, consumables and everything supplied by the owner — tracked weekly &amp; monthly against Brisbane benchmarks.
      </p>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <!-- Sample data notice -->
      <div v-if="isSampleData" class="alert-warning mb-6">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.743 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clip-rule="evenodd"/>
        </svg>
        <span>
          <strong>Sample data.</strong> No Frollo transactions have been imported yet, so the figures below are randomly
          generated placeholders — not real bills. Upload a real export from
          <router-link to="/admin/transactions" class="underline font-semibold">Transactions</router-link>
          to replace them with actual costs.
        </span>
      </div>

      <!-- Key Metrics -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div class="card-elevated p-6">
          <p class="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Average Weekly Cost</p>
          <p class="text-3xl font-bold text-slate-900 mb-3">{{ formatCurrency(avgWeeklyCost) }}</p>
          <p class="text-xs text-slate-500">
            Budget: {{ formatCurrency(WEEKLY_BUDGET) }} •
            <span :class="avgWeeklyCost > WEEKLY_BUDGET ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'">
              {{ avgWeeklyCost > WEEKLY_BUDGET ? '↑' : '↓' }}
              {{ formatCurrency(Math.abs(avgWeeklyCost - WEEKLY_BUDGET)) }}
            </span>
          </p>
        </div>

        <div class="card-elevated p-6">
          <p class="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Average Monthly Cost</p>
          <p class="text-3xl font-bold text-slate-900 mb-3">{{ formatCurrency(avgMonthlyCost) }}</p>
          <p class="text-xs text-slate-500">
            Budget: {{ formatCurrency(MONTHLY_BUDGET) }} •
            <span :class="avgMonthlyCost > MONTHLY_BUDGET ? 'text-red-600 font-semibold' : 'text-emerald-600 font-semibold'">
              {{ avgMonthlyCost > MONTHLY_BUDGET ? 'Over' : 'Under' }}
            </span>
          </p>
        </div>

        <div class="card-elevated p-6">
          <p class="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Last Month</p>
          <p
            :class="[
              'text-2xl font-bold mb-1',
              lastMonthStatus.tone === 'over' ? 'text-red-600' : lastMonthStatus.tone === 'under' ? 'text-emerald-600' : lastMonthStatus.tone === 'on' ? 'text-slate-900' : 'text-slate-400'
            ]"
          >
            {{ lastMonthStatus.label }}
          </p>
          <p class="text-xs text-slate-500">
            <span v-if="lastMonthStatus.month">{{ lastMonthStatus.month }} · {{ formatCurrency(lastMonthStatus.total) }}</span>
            <span v-else>Bills take a while to land</span>
          </p>
        </div>

        <div class="card-elevated p-6">
          <p class="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wide">Data Points</p>
          <p class="text-3xl font-bold text-slate-900 mb-3">{{ weeklyMetrics.length }}</p>
          <p class="text-xs text-slate-500">weeks of tracking data available</p>
        </div>
      </div>

      <!-- Cost Allocation -->
      <div class="card-elevated p-6 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Fair Cost Allocation</h2>
        <div class="space-y-4">
          <div v-for="allocation in costAllocations" :key="allocation.flatmate" class="p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition">
            <div class="flex justify-between items-start mb-3">
              <div>
                <p class="font-semibold text-slate-900">{{ allocation.flatmate }}</p>
                <p class="text-sm text-slate-500">{{ getVarianceStatus(allocation) }}</p>
              </div>
              <div :class="[
                'badge px-3 py-1 rounded-full font-semibold text-sm',
                allocation.isOverBudget ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
              ]">
                {{ allocation.isOverBudget ? '⚠️ Over' : '✓ On Track' }}
              </div>
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-slate-500 mb-1">Weekly Share</p>
                <p class="text-lg font-bold text-slate-900">{{ formatCurrency(allocation.weeklyShare) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">Monthly Share</p>
                <p class="text-lg font-bold text-slate-900">{{ formatCurrency(allocation.monthlyShare) }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500 mb-1">Contribution</p>
                <p class="text-lg font-bold text-slate-900">
                  {{ formatCurrency(FLATMATE_CONTRIBUTIONS.find(f => f.name === allocation.flatmate)?.weeklyAmount || 0) }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Benchmarks -->
      <div class="card-elevated p-6 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Brisbane Benchmark Comparison</h2>
        <p class="text-sm text-slate-600 mb-6">How your apartment compares to other 3-bedroom rentals in Brisbane</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="comparison in benchmarkComparisons" :key="comparison.service" class="p-4 border border-slate-200 rounded-lg">
            <div class="flex items-start justify-between mb-3">
              <div>
                <p class="font-semibold text-slate-900">{{ comparison.service }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ comparison.actualCost }} vs {{ comparison.benchmarkCost }} avg</p>
              </div>
              <span :class="[
                'text-2xl',
                comparison.status === 'high' ? 'text-red-600' : comparison.status === 'low' ? 'text-emerald-600' : 'text-slate-600'
              ]">
                {{ getStatusIcon(comparison.status) }}
              </span>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">Range</span>
                <span class="text-slate-600">{{ comparison.minRange }} - {{ comparison.maxRange }}</span>
              </div>
              <div class="w-full bg-slate-200 rounded-full h-2">
                <div
                  class="h-2 rounded-full transition-all"
                  :class="comparison.status === 'high' ? 'bg-red-500' : comparison.status === 'low' ? 'bg-emerald-500' : 'bg-blue-500'"
                  :style="{
                    width: Math.min(100, Math.max(0, ((comparison.actualCost - comparison.minRange) / (comparison.maxRange - comparison.minRange)) * 100)) + '%'
                  }"
                ></div>
              </div>
              <p :class="['text-xs font-semibold', getVarianceColor(comparison.variance)]">
                {{ comparison.variance > 0 ? '↑' : '↓' }}
                {{ Math.abs(comparison.variancePercent) }}% vs average
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- View Toggle -->
      <div class="flex gap-3 mb-8">
        <button
          @click="selectedView = 'weekly'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all',
            selectedView === 'weekly'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          Weekly Breakdown
        </button>
        <button
          @click="selectedView = 'monthly'"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all',
            selectedView === 'monthly'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          Monthly Breakdown
        </button>
      </div>

      <!-- Service Filter -->
      <div class="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          v-for="service in ['all', 'Electricity', 'Water', 'Broadband']"
          :key="service"
          @click="selectedService = service as any"
          :class="[
            'px-4 py-2 rounded-lg font-semibold transition-all whitespace-nowrap',
            selectedService === service
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          ]"
        >
          {{ service === 'all' ? 'All Services' : service }}
        </button>
      </div>

      <!-- Weekly/Monthly Table -->
      <div class="card-elevated p-6 overflow-x-auto">
        <h2 class="text-lg font-bold text-slate-900 mb-4">
          {{ selectedView === 'weekly' ? 'Weekly' : 'Monthly' }} Cost Breakdown
        </h2>

        <table v-if="selectedView === 'weekly'" class="w-full min-w-[640px] text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Week</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Electricity</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Water</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Broadband</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Total</th>
              <th class="text-center py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">vs Budget</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(week, idx) in weeklyMetrics" :key="idx" class="border-b border-slate-100 hover:bg-slate-50 transition">
              <td class="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">{{ week.week }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(week.energyCost) }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(week.waterCost) }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(week.broadbandCost) }}</td>
              <td class="text-right py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{{ formatCurrency(week.totalCost) }}</td>
              <td class="text-center py-3 px-4 whitespace-nowrap">
                <span :class="[
                  'text-xs font-semibold px-2 py-1 rounded',
                  week.totalCost > 210 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                ]">
                  {{ week.totalCost > 210 ? '↑' : '↓' }}
                  {{ formatCurrency(Math.abs(week.totalCost - 210)) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>

        <table v-else class="w-full min-w-[560px] text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Month</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Electricity</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Water</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Broadband</th>
              <th class="text-right py-3 px-4 font-semibold text-slate-600 whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(month, idx) in monthlyMetrics" :key="idx" class="border-b border-slate-100 hover:bg-slate-50 transition">
              <td class="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">{{ month.month }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(month.energyCost) }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(month.waterCost) }}</td>
              <td class="text-right py-3 px-4 text-slate-600 whitespace-nowrap">{{ formatCurrency(month.broadbandCost) }}</td>
              <td class="text-right py-3 px-4 font-semibold text-slate-900 whitespace-nowrap">{{ formatCurrency(month.totalCost) }}</td>
            </tr>
          </tbody>
        </table>

        <p v-if="(selectedView === 'weekly' && weeklyMetrics.length === 0) || (selectedView === 'monthly' && monthlyMetrics.length === 0)" class="text-center py-8 text-slate-500">
          No data available yet. Transaction imports will appear here.
        </p>
      </div>

      <!-- Info Box -->
      <div class="mt-8 p-4 rounded-lg bg-emerald-50 border border-emerald-100">
        <p class="text-sm text-emerald-800 flex items-start gap-2">
          <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
          </svg>
          <span><strong>How it works:</strong> This dashboard automatically analyzes utility bills uploaded by the landlord. Costs are allocated fairly based on your weekly contributions. If actual costs exceed your budget, overage is split proportionally among all flatmates.</span>
        </p>
      </div>
    </div>
  </div>
</template>
