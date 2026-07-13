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

const handleSubmit = async () => {
  error.value = ''

  // Validation
  if (!selectedFlatmate.value || !enquiryType.value || !message.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }

  if (message.value.trim().length < 10) {
    error.value = 'Message must be at least 10 characters'
    return
  }

  if (message.value.trim().length > 1000) {
    error.value = 'Message must be less than 1000 characters'
    return
  }

  loading.value = true

  try {
    // Create enquiry
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

    // Save to localStorage
    const enquiries = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    enquiries.push(enquiry)
    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    // Send email notification to admin
    await emailService.sendEnquiryNotification(
      selectedFlatmate.value,
      enquiryType.value,
      message.value,
      enquiryId
    )

    // Reset form
    submitted.value = true
    selectedFlatmate.value = ''
    enquiryType.value = ''
    message.value = ''

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
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="bg-slate-900 text-white p-8 shadow-lg">
      <div class="max-w-2xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back
        </button>
        <h1 class="text-3xl font-bold">🆘 Request Help with Something</h1>
        <p class="text-slate-300 mt-2">Submit a request to your flatmates</p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-8">
      <div class="bg-white rounded-lg shadow p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Flatmate Dropdown -->
          <div>
            <label class="block text-sm font-bold mb-2">👤 Flatmate</label>
            <select
              v-model="selectedFlatmate"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a flatmate...</option>
              <option v-for="flatmate in flatmates" :key="flatmate.id" :value="flatmate.name">
                {{ flatmate.name }}
              </option>
            </select>
          </div>

          <!-- Enquiry Type Dropdown -->
          <div>
            <label class="block text-sm font-bold mb-2">📋 Enquiry Type</label>
            <select
              v-model="enquiryType"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select enquiry type...</option>
              <option v-for="type in enquiryTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Message -->
          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-bold">💬 Message</label>
              <span :class="messageLength > 1000 ? 'text-red-600' : 'text-slate-600'" class="text-sm">
                {{ messageLength }}/1000
              </span>
            </div>
            <textarea
              v-model="message"
              placeholder="Describe what you need help with... (at least 10 characters)"
              rows="6"
              maxlength="1000"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
            <p v-if="messageLength < 10" class="text-xs text-slate-500 mt-1">
              {{ 10 - messageLength }} more characters needed
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            ❌ {{ error }}
          </div>

          <!-- Success Message -->
          <div v-if="submitted" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Request submitted successfully! We'll get back to you soon.
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid || loading"
            :class="{
              'bg-blue-600 hover:bg-blue-700': isFormValid && !loading,
              'bg-slate-400 cursor-not-allowed': !isFormValid || loading
            }"
            class="w-full text-white py-3 rounded-lg font-semibold transition"
          >
            <span v-if="loading" class="inline-flex items-center gap-2">
              ⏳ Submitting...
            </span>
            <span v-else>
              📤 Submit Request
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
