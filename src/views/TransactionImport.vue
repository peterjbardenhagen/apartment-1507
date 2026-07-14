<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTenantStore } from '@/stores/tenant'
import { transactionService, type CategorizedTransaction } from '@/services/transactionService'

const tenantStore = useTenantStore()
const file = ref<File | null>(null)
const processing = ref(false)
const transactions = ref<CategorizedTransaction[]>([])
const summary = ref<any>(null)
const error = ref('')
const success = ref('')
const filterCategory = ref('')

const tenantNames = computed(() => tenantStore.tenants.map(t => t.name))

const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  transactions.value.forEach(tx => {
    counts[tx.category] = (counts[tx.category] || 0) + 1
  })
  return counts
})

const filteredTransactions = computed(() => {
  if (!filterCategory.value) return transactions.value
  return transactions.value.filter(tx => tx.category === filterCategory.value)
})

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  file.value = target.files?.[0] || null
  error.value = ''
}

const handleUpload = async () => {
  if (!file.value) {
    error.value = 'Please select a file'
    return
  }

  processing.value = true
  error.value = ''
  success.value = ''

  try {
    const content = await file.value.text()
    const parsed = transactionService.parseCSV(content)

    if (parsed.length === 0) {
      error.value = 'No valid transactions found in file'
      processing.value = false
      return
    }

    const categorized = transactionService.categorizeTransactions(parsed, tenantNames.value)
    transactions.value = categorized
    summary.value = transactionService.getTransactionSummary(categorized)
    success.value = `Successfully imported ${categorized.length} transactions`
  } catch (err) {
    error.value = `Error processing file: ${err instanceof Error ? err.message : 'Unknown error'}`
  } finally {
    processing.value = false
  }
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Utility Bill':
      return 'bg-orange-50 border-orange-200'
    case 'Tenant Payment':
      return 'bg-emerald-50 border-emerald-200'
    default:
      return 'bg-slate-50 border-slate-200'
  }
}

const getCategoryBadgeClass = (category: string) => {
  switch (category) {
    case 'Utility Bill':
      return 'badge-warning'
    case 'Tenant Payment':
      return 'badge-success'
    default:
      return 'badge-neutral'
  }
}

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case 'high':
      return 'text-emerald-600'
    case 'medium':
      return 'text-amber-600'
    default:
      return 'text-slate-600'
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Transaction Import</h1>
      <p class="text-sm text-slate-500 mt-2">Upload Frollo transaction exports to categorize utilities, rent, and bond payments</p>
    </div>

    <!-- Upload Card -->
    <div class="card-elevated p-8">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Upload Frollo Export</h2>
        <p class="text-sm text-slate-600 mb-4">Supported formats: CSV, Excel (.xlsx, .xls)</p>
      </div>

      <div class="space-y-4">
        <!-- File Input -->
        <div class="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition">
          <div class="mb-4">
            <svg class="w-12 h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
          </div>
          <label class="block">
            <span class="sr-only">Choose file</span>
            <input type="file" @change="handleFileSelect" accept=".csv,.xlsx,.xls" class="block w-full cursor-pointer" />
          </label>
          <p class="text-sm text-slate-600 mt-2">
            <span v-if="!file" class="text-slate-500">Click to upload or drag and drop</span>
            <span v-else class="text-emerald-600 font-medium">{{ file.name }}</span>
          </p>
        </div>

        <!-- Error/Success Messages -->
        <div v-if="error" class="alert alert-error">
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
          </svg>
          {{ error }}
        </div>

        <div v-if="success" class="alert alert-success">
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
          </svg>
          {{ success }}
        </div>

        <!-- Upload Button -->
        <button
          @click="handleUpload"
          :disabled="!file || processing"
          class="btn-primary w-full"
        >
          <span v-if="processing" class="flex items-center gap-2">
            <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
            Processing...
          </span>
          <span v-else class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
            </svg>
            Upload & Process
          </span>
        </button>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="summary" class="space-y-6">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="card-elevated p-6">
          <p class="card-metric-header">Total Transactions</p>
          <p class="card-metric-value text-slate-900">{{ summary.total }}</p>
        </div>
        <div class="card-elevated p-6">
          <p class="card-metric-header">Utility Costs</p>
          <p class="card-metric-value text-orange-600">${{ summary.totalUtilityCosts.toFixed(2) }}</p>
        </div>
        <div class="card-elevated p-6">
          <p class="card-metric-header">Tenant Payments</p>
          <p class="card-metric-value text-emerald-600">${{ summary.totalTenantPayments.toFixed(2) }}</p>
        </div>
      </div>

      <!-- Category Breakdown -->
      <div class="card-elevated p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Transaction Categories</h3>
        <div class="space-y-3">
          <div
            v-for="(count, category) in categoryCounts"
            :key="category"
            class="flex items-center justify-between p-3 rounded-lg"
            :class="getCategoryColor(category as string)"
          >
            <div class="flex items-center gap-3">
              <span :class="getCategoryBadgeClass(category as string)" class="badge">
                {{ category }}
              </span>
              <span class="text-sm text-slate-600">{{ count }} transactions</span>
            </div>
            <button
              @click="filterCategory = filterCategory === category ? '' : (category as string)"
              class="text-xs px-2 py-1 rounded bg-white hover:bg-slate-100 transition border border-current opacity-50"
            >
              {{ filterCategory === category ? 'Clear' : 'Filter' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="card-elevated p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">
          Transactions {{ filterCategory ? `(${filterCategory})` : '' }}
        </h3>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-slate-200">
                <th class="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-700">Merchant</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                <th class="text-right py-3 px-4 font-semibold text-slate-700">Amount</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-700">Category</th>
                <th class="text-left py-3 px-4 font-semibold text-slate-700">Confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(tx, idx) in filteredTransactions"
                :key="idx"
                class="border-b border-slate-100 hover:bg-slate-50"
              >
                <td class="py-3 px-4 text-slate-600">{{ tx.date }}</td>
                <td class="py-3 px-4 text-slate-700 font-medium">{{ tx.merchant }}</td>
                <td class="py-3 px-4 text-slate-600">{{ tx.description.substring(0, 30) }}...</td>
                <td class="py-3 px-4 text-right font-semibold text-slate-900">${{ Math.abs(tx.amount).toFixed(2) }}</td>
                <td class="py-3 px-4">
                  <span :class="getCategoryBadgeClass(tx.category)" class="badge text-xs">
                    {{ tx.subcategory }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span :class="getConfidenceColor(tx.confidence)" class="text-xs font-medium capitalize">
                    {{ tx.confidence }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!processing" class="card-elevated p-12 text-center">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">No Transactions Loaded</h3>
      <p class="text-slate-600">Upload a Frollo transaction export file to get started</p>
    </div>
  </div>
</template>
