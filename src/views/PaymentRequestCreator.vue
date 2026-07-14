<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  getPaymentRequests,
  createPaymentRequest,
  savePaymentRequest,
  type PaymentRequest
} from '@/services/paymentService'
import jsPDF from 'jspdf'
import { DEFAULT_PROPERTY, DEFAULT_LANDLORD, formatDate, formatCurrency } from '@/services/pdfService'

const router = useRouter()
const paymentRequests = ref<PaymentRequest[]>([])
const showForm = ref(false)
const form = ref({
  flatmateName: '',
  amount: 0,
  description: '',
  dueDate: ''
})

const loadRequests = () => {
  paymentRequests.value = getPaymentRequests()
}

const submitPaymentRequest = () => {
  if (!form.value.flatmateName || !form.value.amount || !form.value.description) return

  const request = createPaymentRequest(form.value.flatmateName, form.value.amount, form.value.description)
  request.dueDate = form.value.dueDate
  savePaymentRequest(request)
  loadRequests()
  showForm.value = false
  form.value = { flatmateName: '', amount: 0, description: '', dueDate: '' }
}

const generatePaymentRequestPDF = (request: PaymentRequest) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()

  let yPos = 15

  // Header
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
  doc.setFontSize(18)
  doc.setFont(undefined, 'bold')
  doc.text('PAYMENT REQUEST', pageWidth / 2, yPos, { align: 'center' })

  // Details
  yPos += 15
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text(`Flatmate: ${request.flatmateName}`, 10, yPos)
  yPos += 8
  doc.text(`Date: ${formatDate(new Date(request.createdAt))}`, 10, yPos)
  yPos += 8
  doc.text(`Due Date: ${formatDate(new Date(request.dueDate))}`, 10, yPos)

  // Amount Box
  yPos += 15
  doc.setFillColor(220, 220, 220)
  doc.rect(10, yPos, pageWidth - 20, 25, 'F')
  doc.setFontSize(14)
  doc.setFont(undefined, 'bold')
  doc.text(`Amount Due: ${formatCurrency(request.amount)}`, pageWidth / 2, yPos + 15, { align: 'center' })

  // Description
  yPos += 35
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
  doc.text('Description:', 10, yPos)
  yPos += 6
  doc.setFont(undefined, 'bold')
  doc.text(request.description, 10, yPos, { maxWidth: pageWidth - 20 })

  // Footer
  yPos = pageHeight - 40
  doc.setFontSize(10)
  doc.text('Landlord Signature:', 10, yPos)
  doc.line(50, yPos + 2, 100, yPos + 2)
  yPos += 8
  doc.setFont(undefined, 'normal')
  doc.text(DEFAULT_LANDLORD.name, 50, yPos)
  yPos += 6
  doc.text(`Date: ${formatDate()}`, pageWidth - 60, yPos - 6)

  doc.save(`payment-request-${request.flatmateName.replace(/\s/g, '-')}.pdf`)
}

loadRequests()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg mb-8">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg">
            💳
          </div>
          <div>
            <h1 class="text-3xl font-bold">Payment Requests</h1>
            <p class="text-blue-100 text-sm mt-0.5">Create and manage payment requests for flatmates</p>
          </div>
        </div>
        <button
          @click="showForm = !showForm"
          class="btn-primary"
        >
          <span class="flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
            </svg>
            New Payment Request
          </span>
        </button>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-8">
      <!-- Form -->
      <div v-if="showForm" class="card-elevated p-8 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Create Payment Request</h2>
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
              <label class="input-label">Due Date</label>
              <input v-model="form.dueDate" type="date" class="input" />
            </div>
          </div>

          <div>
            <label class="input-label">Description</label>
            <textarea v-model="form.description" rows="4" class="input resize-none" placeholder="e.g., Weekly rent for week of July 14-20"></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t border-slate-100">
            <button @click="submitPaymentRequest" class="btn-primary flex-1">Create Request</button>
            <button @click="showForm = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- List -->
      <div v-if="paymentRequests.length > 0" class="space-y-4">
        <div v-for="request in paymentRequests" :key="request.id" class="card-elevated p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ request.flatmateName }}</h3>
              <p class="text-sm text-slate-500">{{ formatDate(new Date(request.createdAt)) }}</p>
            </div>
            <span :class="[
              'badge px-3 py-1 rounded-full font-semibold text-sm',
              request.status === 'paid' ? 'bg-emerald-50 text-emerald-700' : request.status === 'overdue' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
            ]">
              {{ request.status.charAt(0).toUpperCase() + request.status.slice(1) }}
            </span>
          </div>

          <div class="mb-6">
            <p class="text-3xl font-bold text-slate-900">${{ request.amount.toFixed(2) }}</p>
            <p class="text-slate-600 mt-2">{{ request.description }}</p>
            <p class="text-sm text-slate-500 mt-2">Due: {{ formatDate(new Date(request.dueDate)) }}</p>
          </div>

          <button @click="generatePaymentRequestPDF(request)" class="btn-primary w-full">Download PDF</button>
        </div>
      </div>

      <div v-else-if="!showForm" class="card-elevated p-12 text-center">
        <p class="text-6xl mb-4">💳</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Payment Requests</h3>
        <p class="text-slate-600 mb-6">Create a payment request to invoice flatmates</p>
        <button @click="showForm = true" class="btn-primary">Create Request</button>
      </div>
    </div>
  </div>
</template>
