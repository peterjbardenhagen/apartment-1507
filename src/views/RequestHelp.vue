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
  <div class="min-h-screen bg-emerald-50">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="max-w-2xl mx-auto">
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
    <div class="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-2 animate-fade-in">
      <div class="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
        </svg>
      </div>
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Request Help</h1>
      <p class="mt-2 text-slate-500">Collaborate with your flatmates on improvements or concerns.</p>
    </div>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div class="card-elevated p-8">
        <!-- Form Header -->
        <div class="mb-7">
          <p class="text-sm font-semibold text-slate-500 uppercase tracking-wide">New Help Request</p>
          <p class="text-sm text-slate-600 mt-1">Fill in the details below to submit your request</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-7">
          <!-- Flatmate Selection -->
          <div class="form-section">
            <label class="input-label flex items-center gap-2">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 12H9m6 0a6 6 0 11-12 0 6 6 0 0112 0z"/>
              </svg>
              Select Flatmate
            </label>
            <select
              v-model="selectedFlatmate"
              @blur="touched.flatmate = true"
              :class="[
                'input',
                touched.flatmate && !selectedFlatmate ? 'input-error' : ''
              ]"
            >
              <option value="">Choose a flatmate to contact...</option>
              <option v-for="flatmate in flatmates" :key="flatmate.id" :value="flatmate.name">
                {{ flatmate.name }}
              </option>
            </select>
            <p v-if="touched.flatmate && !selectedFlatmate" class="text-red-600 text-xs mt-2 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              Please select a flatmate
            </p>
          </div>

          <!-- Enquiry Type -->
          <div class="form-section">
            <label class="input-label flex items-center gap-2">
              <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
              </svg>
              Request Type
            </label>
            <select
              v-model="enquiryType"
              @blur="touched.type = true"
              :class="[
                'input',
                touched.type && !enquiryType ? 'input-error' : ''
              ]"
            >
              <option value="">Choose the type of request...</option>
              <option v-for="type in enquiryTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <p v-if="touched.type && !enquiryType" class="text-red-600 text-xs mt-2 flex items-center gap-1">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              Please select a request type
            </p>
          </div>

          <!-- Message -->
          <div class="form-section">
            <div class="flex items-center justify-between mb-2">
              <label class="input-label flex items-center gap-2 m-0">
                <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Your Message
              </label>
              <span :class="[
                'text-xs tabular-nums font-medium',
                messageLength > 1000 ? 'text-red-600' : messageLength > 800 ? 'text-amber-600' : 'text-slate-400'
              ]">
                {{ messageLength }}<span class="text-slate-400">/1000</span>
              </span>
            </div>
            <textarea
              v-model="message"
              @blur="touched.message = true"
              :class="[
                'input resize-none',
                touched.message && message.trim().length < 10 && message.length > 0 ? 'input-error' : ''
              ]"
              placeholder="Describe what you need help with in detail..."
              rows="5"
              maxlength="1000"
            ></textarea>
            <div class="mt-2 flex items-center justify-between">
              <p v-if="touched.message && message.trim().length > 0 && message.trim().length < 10" class="text-red-600 text-xs flex items-center gap-1">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
                </svg>
                {{ 10 - message.trim().length }} more characters required
              </p>
              <p v-else class="text-xs text-slate-500">Minimum 10 characters required</p>
            </div>
          </div>

          <!-- Error Message -->
          <transition name="fade">
            <div v-if="error" class="alert alert-error">
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
              </svg>
              <span>{{ error }}</span>
            </div>
          </transition>

          <!-- Success Message -->
          <transition name="fade">
            <div v-if="submitted" class="alert alert-success animate-in">
              <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
              </svg>
              <span>Request submitted successfully! Your flatmate will get back to you soon.</span>
            </div>
          </transition>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-6 border-t border-slate-100">
            <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="btn-primary flex-1"
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
            <button
              type="button"
              @click="router.push('/flatmate/dashboard')"
              class="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Info Box -->
      <div class="mt-6 alert-info">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
        </svg>
        <span><strong>Tip:</strong> Be clear and specific about your request. Include any relevant details that will help your flatmate understand the issue.</span>
      </div>
    </div>
  </div>
</template>
