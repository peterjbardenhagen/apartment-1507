<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getReceipts,
  saveReceipt,
  type Receipt
} from '@/services/paymentService'
import { generateReceiptNo, numberToWords, formatDateLong, formatCurrency, generateReceiptPDF, type ReceiptData } from '@/services/pdfService'
import { useTenantStore } from '@/stores/tenant'

const tenantStore = useTenantStore()
const receipts = ref<Receipt[]>(getReceipts())
const showForm = ref(false)
const successMessage = ref('')

const form = ref({
  tenantId: 0,
  tenantName: '',
  description: '',
  amount: 0,
  paymentMethod: 'bank-transfer',
  bankRef: '',
  notes: ''
})

const activeTenants = computed(() =>
  tenantStore.tenants.filter(t => t.status === 'active' || t.status === 'pending')
)

const amountWords = computed(() => {
  if (!form.value.amount || form.value.amount <= 0) return ''
  return numberToWords(form.value.amount)
})

const newReceiptNo = computed(() => generateReceiptNo())

function selectTenant(id: number) {
  const t = tenantStore.tenants.find(t => t.id === id)
  if (t) {
    form.value.tenantId = t.id
    form.value.tenantName = t.name
  }
}

function resetForm() {
  form.value = {
    tenantId: 0,
    tenantName: '',
    description: '',
    amount: 0,
    paymentMethod: 'bank-transfer',
    bankRef: '',
    notes: ''
  }
}

function submitReceipt() {
  if (!form.value.tenantName || !form.value.amount || !form.value.description) return

  const paymentMethodLabels: Record<string, string> = {
    'bank-transfer': 'Electronic funds transfer (Osko)',
    'cash': 'Cash',
    'cheque': 'Cheque',
    'credit-card': 'Credit Card',
    'other': 'Other'
  }

  const receipt: Receipt = {
    id: Date.now().toString(),
    receiptNo: newReceiptNo.value,
    flatmateName: form.value.tenantName,
    description: form.value.description,
    amount: form.value.amount,
    amountWords: amountWords.value,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: paymentMethodLabels[form.value.paymentMethod] || form.value.paymentMethod,
    bankRef: form.value.bankRef,
    notes: form.value.notes,
    createdAt: new Date().toISOString()
  }

  saveReceipt(receipt)
  receipts.value = getReceipts()
  showForm.value = false
  successMessage.value = `Receipt ${receipt.receiptNo} created for ${receipt.flatmateName}`

  setTimeout(() => { successMessage.value = '' }, 4000)
  resetForm()
}

async function downloadPDF(receipt: Receipt) {
  const data: ReceiptData = {
    receiptNo: receipt.receiptNo,
    dateIssued: formatDateLong(new Date(receipt.date)),
    tenantName: receipt.flatmateName,
    amount: receipt.amount,
    amountWords: receipt.amountWords || numberToWords(receipt.amount),
    description: receipt.description,
    paymentMethod: receipt.paymentMethod,
    bankRef: receipt.bankRef || undefined,
    notes: receipt.notes || undefined,
    landlordName: 'Peter Bardenhagen',
    propertyAddress: '477 Boundary Street, Apartment 1507, Spring Hill, QLD 4000'
  }
  await generateReceiptPDF(data)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Receipts</h1>
        <p class="text-sm text-slate-500 mt-1.5">Create and download signed payment receipts.</p>
      </div>
      <button @click="showForm = !showForm; resetForm()" class="btn-primary self-start sm:self-auto shrink-0">
        {{ showForm ? 'Cancel' : '+ New Receipt' }}
      </button>
    </div>

    <!-- Success Toast -->
    <div v-if="successMessage" class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm animate-slide-in">
      {{ successMessage }}
    </div>

    <!-- Form -->
    <div v-if="showForm" class="card-elevated p-8 mb-8">
      <h2 class="text-xl font-bold text-slate-900 mb-6">Create Receipt</h2>
      <div class="space-y-6">

        <!-- Tenant Selection -->
        <div>
          <label class="input-label">Tenant</label>
          <select v-model="form.tenantId" @change="selectTenant(form.tenantId)" class="input">
            <option :value="0" disabled>Select tenant...</option>
            <option v-for="t in activeTenants" :key="t.id" :value="t.id">
              {{ t.name }} — {{ t.room }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div>
          <label class="input-label">Payment For</label>
          <input v-model="form.description" type="text" class="input" placeholder="e.g., 3 months rent paid in advance" />
        </div>

        <!-- Amount -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Amount (AUD $)</label>
            <input v-model.number="form.amount" type="number" step="0.01" min="0" class="input" placeholder="0.00" />
            <p v-if="amountWords" class="text-xs text-slate-500 mt-1 italic">Amount in words: {{ amountWords }}</p>
          </div>
          <div>
            <label class="input-label">Payment Method</label>
            <select v-model="form.paymentMethod" class="input">
              <option value="bank-transfer">Bank Transfer / Osko</option>
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="credit-card">Credit Card</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <!-- Bank Reference -->
        <div>
          <label class="input-label">Bank Reference (Optional)</label>
          <input v-model="form.bankRef" type="text" class="input" placeholder="e.g., Osko Payment ID 485287 / Rent advance" />
        </div>

        <!-- Notes -->
        <div>
          <label class="input-label">Notes (Optional)</label>
          <textarea v-model="form.notes" rows="2" class="input resize-none" placeholder="Any additional notes..."></textarea>
        </div>

        <!-- Preview box -->
        <div v-if="form.tenantName && form.amount > 0" class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Receipt Preview</p>
          <p class="text-sm"><span class="font-semibold">No:</span> {{ newReceiptNo }}</p>
          <p class="text-sm"><span class="font-semibold">Date:</span> {{ formatDateLong(new Date()) }}</p>
          <p class="text-sm"><span class="font-semibold">From:</span> {{ form.tenantName }}</p>
          <p class="text-sm"><span class="font-semibold">For:</span> {{ form.description || '—' }}</p>
          <p class="text-lg font-bold text-slate-900 mt-1">${{ form.amount.toFixed(2) }}</p>
        </div>

        <div class="flex gap-3 pt-4 border-t border-slate-100">
          <button @click="submitReceipt" class="btn-primary flex-1">Create &amp; Save Receipt</button>
          <button @click="showForm = false; resetForm()" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Receipts List -->
    <div v-if="receipts.length > 0" class="space-y-4">
      <div v-for="receipt in receipts" :key="receipt.id" class="card-elevated p-6">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-lg font-bold text-slate-900">{{ receipt.flatmateName }}</h3>
            <p class="text-sm text-slate-500">{{ formatDateLong(new Date(receipt.date)) }} • {{ receipt.receiptNo }}</p>
          </div>
          <span class="badge bg-emerald-50 text-emerald-700">✓ Issued</span>
        </div>

        <div class="mb-4 p-4 bg-slate-50 rounded-lg">
          <p class="text-sm text-slate-600 mb-2">{{ receipt.description }}</p>
          <p class="text-3xl font-bold text-slate-900">${{ receipt.amount.toFixed(2) }}</p>
          <p v-if="receipt.amountWords" class="text-xs text-slate-500 mt-1 italic">{{ receipt.amountWords }}</p>
        </div>

        <div class="flex justify-between items-center">
          <div class="text-xs text-slate-400">
            <p>{{ receipt.paymentMethod }}</p>
            <p v-if="receipt.bankRef">{{ receipt.bankRef }}</p>
          </div>
          <button @click="downloadPDF(receipt)" class="btn-primary text-sm px-4 py-2">Download PDF</button>
        </div>
      </div>
    </div>

    <div v-else-if="!showForm" class="card-elevated p-12 text-center">
      <p class="text-6xl mb-4">🧾</p>
      <h3 class="text-lg font-bold text-slate-900 mb-2">No Receipts Generated</h3>
      <p class="text-slate-600 mb-6">Create a receipt to document payment received</p>
      <button @click="showForm = true" class="btn-primary">Create Receipt</button>
    </div>
  </div>
</template>
