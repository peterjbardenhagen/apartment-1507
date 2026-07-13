<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { emailService } from '@/services/emailService'

const router = useRouter()
const flatmates = ref<Array<{ id: string; name: string }>>([])
const selectedFlatmate = ref('')
const enquiryType = ref('')
const message = ref('')
const submitted = ref(false)
const loading = ref(false)
const error = ref('')
const touched = ref({ flatmate: false, type: false, message: false })

const messageLength = computed(() => message.value.length)
const isFormValid = computed(() => selectedFlatmate.value && enquiryType.value && message.value.trim().length >= 10)

const enquiryTypes = [
  'Idea for home',
  'Cleaning issues',
  'General complaint',
  'Request Repair',
  'Private Matter (Confidential)',
  'Other'
]

onMounted(async () => {
  try {
    const response = await fetch('/flatmates.json')
    const data = await response.json()
    flatmates.value = data.flatmates
  } catch (error) {
    console.error('Error loading flatmates:', error)
  }
})

const validate = () => {
  if (!selectedFlatmate.value) {
    error.value = 'Please select a flatmate'
    return false
  }
  if (!enquiryType.value) {
    error.value = 'Please select an enquiry type'
    return false
  }
  if (message.value.trim().length < 10) {
    error.value = 'Message must be at least 10 characters'
    return false
  }
  if (message.value.trim().length > 1000) {
    error.value = 'Message must be less than 1000 characters'
    return false
  }
  return true
}

const handleSubmit = async () => {
  touched.value = { flatmate: true, type: true, message: true }
  error.value = ''
  if (!validate()) return

  loading.value = true

  try {
    const enquiryId = Date.now()
    const enquiry = {
      id: enquiryId,
      flatmate: selectedFlatmate.value,
      enquiryType: enquiryType.value,
      message: message.value,
      timestamp: new Date().toISOString(),
      status: 'new' as const,
      notes: ''
    }

    const enquiries = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    enquiries.push(enquiry)
    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    await emailService.sendEnquiryNotification(
      selectedFlatmate.value,
      enquiryType.value,
      message.value,
      enquiryId
    )

    submitted.value = true
    selectedFlatmate.value = ''
    enquiryType.value = ''
    message.value = ''
    touched.value = { flatmate: false, type: false, message: false }

    setTimeout(() => {
      submitted.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Failed to submit enquiry. Please try again.'
    console.error('Submission error:', err)
  } finally {
    loading.value = false
  }
}

const getFieldError = (field: string) => {
  if (!touched.value[field as keyof typeof touched.value]) return null
  if (field === 'flatmate' && !selectedFlatmate.value) return 'Please select a flatmate'
  if (field === 'type' && !enquiryType.value) return 'Please select an enquiry type'
  if (field === 'message' && message.value.trim().length < 10) return 'At least 10 characters required'
  return null
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-2xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl">
            🆘
          </div>
          <div>
            <h1 class="text-2xl font-bold">Request Help</h1>
            <p class="text-slate-400 text-sm">Submit a request to your flatmates</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-4 sm:p-6">
      <div class="card p-6 sm:p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Flatmate</label>
            <select
              v-model="selectedFlatmate"
              @blur="touched.flatmate = true"
              :class="{'border-red-300 focus:ring-red-500': touched.flatmate && !selectedFlatmate, 'border-slate-200': !touched.flatmate || selectedFlatmate}"
              class="input"
            >
              <option value="">Select a flatmate...</option>
              <option v-for="flatmate in flatmates" :key="flatmate.id" :value="flatmate.name">
                {{ flatmate.name }}
              </option>
            </select>
            <p v-if="touched.flatmate && !selectedFlatmate" class="text-red-600 text-xs mt-1">Please select a flatmate</p>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Enquiry Type</label>
            <select
              v-model="enquiryType"
              @blur="touched.type = true"
              :class="{'border-red-300 focus:ring-red-500': touched.type && !enquiryType, 'border-slate-200': !touched.type || enquiryType}"
              class="input"
            >
              <option value="">Select enquiry type...</option>
              <option v-for="type in enquiryTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <p v-if="touched.type && !enquiryType" class="text-red-600 text-xs mt-1">Please select an enquiry type</p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-slate-700">Message</label>
              <span :class="messageLength > 1000 ? 'text-red-600' : 'text-slate-400'" class="text-xs tabular-nums">
                {{ messageLength }}/1000
              </span>
            </div>
            <textarea
              v-model="message"
              @blur="touched.message = true"
              :class="{'border-red-300 focus:ring-red-500': touched.message && message.trim().length < 10 && message.length > 0, 'border-slate-200': !touched.message || message.trim().length >= 10 || message.length === 0}"
              placeholder="Describe what you need help with... (at least 10 characters)"
              rows="6"
              maxlength="1000"
              class="input resize-none"
            ></textarea>
            <p v-if="touched.message && message.trim().length > 0 && message.trim().length < 10" class="text-red-600 text-xs mt-1">
              {{ 10 - message.trim().length }} more characters needed
            </p>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ error }}
          </div>

          <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in">
            <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Request submitted successfully!
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || loading"
            class="btn-primary w-full"
          >
            <span v-if="loading" class="flex items-center gap-2">
              <svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Submitting...
            </span>
            <span v-else class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
              Submit Request
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
