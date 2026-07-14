<script setup lang="ts">
import { ref } from 'vue'
import {
  getReceipts,
  createReceipt,
  saveReceipt,
  type Receipt
} from '@/services/paymentService'
import jsPDF from 'jspdf'
import { DEFAULT_PROPERTY, DEFAULT_LANDLORD, formatDate, formatCurrency } from '@/services/pdfService'

const receipts = ref<Receipt[]>([])
const showForm = ref(false)
const form = ref({
  flatmateName: '',
  description: '',
  amount: 0,
  paymentMethod: 'bank-transfer',
  notes: ''
})

const loadReceipts = () => {
  receipts.value = getReceipts()
}

const submitReceipt = () => {
  if (!form.value.flatmateName || !form.value.amount) return

  const receipt = createReceipt(form.value.flatmateName, form.value.amount, form.value.description)
  receipt.paymentMethod = form.value.paymentMethod
  receipt.notes = form.value.notes
  saveReceipt(receipt)
  loadReceipts()
  showForm.value = false
  form.value = { flatmateName: '', description: '', amount: 0, paymentMethod: 'bank-transfer', notes: '' }
}

const generateReceiptPDF = (receipt: Receipt) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yPos = 15

  // Header with address
  doc.setFontSize(10)
  doc.text(`${DEFAULT_PROPERTY.unit}/${DEFAULT_PROPERTY.address}`, pageWidth / 2, yPos, { align: 'center' })
  yPos += 6
  doc.text(`${DEFAULT_PROPERTY.city}, ${DEFAULT_PROPERTY.state} ${DEFAULT_PROPERTY.postcode}`, pageWidth / 2, yPos, { align: 'center' })

  // Line
  doc.setLineWidth(0.5)
  yPos += 8
  doc.line(10, yPos, pageWidth - 10, yPos)

  // Title
  yPos += 10
  doc.setFontSize(20)
  doc.setFont(undefined, 'bold')
  doc.text('RECEIPT', pageWidth / 2, yPos, { align: 'center' })

  // Receipt details
  yPos += 15
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text(`Receipt #: ${receipt.id}`, 10, yPos)
  yPos += 6
  doc.text(`Date: ${formatDate(new Date(receipt.date))}`, 10, yPos)

  // Recipient
  yPos += 12
  doc.setFont(undefined, 'bold')
  doc.text('Received from:', 10, yPos)
  yPos += 6
  doc.setFont(undefined, 'normal')
  doc.text(receipt.flatmateName, 10, yPos)

  // Amount Box
  yPos += 15
  doc.setFillColor(230, 240, 250)
  doc.rect(10, yPos, pageWidth - 20, 20, 'F')
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(`Amount: ${formatCurrency(receipt.amount)}`, pageWidth / 2, yPos + 12, { align: 'center' })

  // Details
  yPos += 25
  doc.setFontSize(10)
  doc.setFont(undefined, 'normal')
  doc.text('Payment Description:', 10, yPos)
  yPos += 6
  doc.setFont(undefined, 'bold')
  doc.text(receipt.description, 10, yPos, { maxWidth: pageWidth - 20 })

  yPos += 10
  doc.setFont(undefined, 'normal')
  doc.text(`Payment Method: ${receipt.paymentMethod}`, 10, yPos)

  if (receipt.notes) {
    yPos += 8
    doc.text('Notes:', 10, yPos)
    yPos += 6
    doc.text(receipt.notes, 10, yPos, { maxWidth: pageWidth - 20 })
  }

  // Footer
  yPos = pageHeight - 40
  doc.setFontSize(10)
  doc.text('Landlord Signature:', 10, yPos)
  doc.line(50, yPos + 2, 100, yPos + 2)
  yPos += 8
  doc.setFont(undefined, 'normal')
  doc.text(DEFAULT_LANDLORD.name, 50, yPos)
  yPos += 8
  doc.text(DEFAULT_LANDLORD.email, 50, yPos)

  doc.save(`receipt-${receipt.flatmateName.replace(/\s/g, '-')}-${receipt.id}.pdf`)
}

loadReceipts()
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Receipts</h1>
        <p class="text-sm text-slate-500 mt-1.5">Create and download signed payment receipts.</p>
      </div>
      <button @click="showForm = !showForm" class="btn-primary self-start sm:self-auto shrink-0">
        {{ showForm ? 'Cancel' : '+ New Receipt' }}
      </button>
    </div>

    <div>
      <!-- Form -->
      <div v-if="showForm" class="card-elevated p-8 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Create Receipt</h2>
        <div class="space-y-6">
          <div>
            <label class="input-label">Flatmate Name</label>
            <input v-model="form.flatmateName" type="text" class="input" placeholder="e.g., Jacob Smith" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="input-label">Amount</label>
              <input v-model.number="form.amount" type="number" class="input" placeholder="0.00" />
            </div>
            <div>
              <label class="input-label">Payment Method</label>
              <select v-model="form.paymentMethod" class="input">
                <option value="bank-transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="cheque">Cheque</option>
                <option value="credit-card">Credit Card</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="input-label">Payment Description</label>
            <input v-model="form.description" type="text" class="input" placeholder="e.g., Weekly rent" />
          </div>

          <div>
            <label class="input-label">Notes (Optional)</label>
            <textarea v-model="form.notes" rows="3" class="input resize-none" placeholder="Any additional notes..."></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t border-slate-100">
            <button @click="submitReceipt" class="btn-primary flex-1">Create Receipt</button>
            <button @click="showForm = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-if="receipts.length > 0" class="space-y-4">
        <div v-for="receipt in receipts" :key="receipt.id" class="card-elevated p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ receipt.flatmateName }}</h3>
              <p class="text-sm text-slate-500">{{ formatDate(new Date(receipt.date)) }} • Receipt #{{ receipt.id }}</p>
            </div>
            <span class="badge bg-emerald-50 text-emerald-700">✓ Issued</span>
          </div>

          <div class="mb-6 p-4 bg-slate-50 rounded-lg">
            <p class="text-sm text-slate-600 mb-2">{{ receipt.description }}</p>
            <p class="text-3xl font-bold text-slate-900">${{ receipt.amount.toFixed(2) }}</p>
            <p class="text-xs text-slate-500 mt-2">{{ receipt.paymentMethod.charAt(0).toUpperCase() + receipt.paymentMethod.slice(1) }}</p>
          </div>

          <button @click="generateReceiptPDF(receipt)" class="btn-primary w-full">Download PDF</button>
        </div>
      </div>

      <div v-else-if="!showForm" class="card-elevated p-12 text-center">
        <p class="text-6xl mb-4">🧾</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Receipts Generated</h3>
        <p class="text-slate-600 mb-6">Create a receipt to document payment received</p>
        <button @click="showForm = true" class="btn-primary">Create Receipt</button>
      </div>
    </div>
  </div>
</template>
