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
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-2xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm">
          Back
        </button>
        <h1 class="text-2xl font-bold">Request Help</h1>
        <p class="text-slate-400 mt-1 text-sm">Submit a request to your flatmates</p>
      </div>
    </div>

    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <form @submit.prevent="handleSubmit" class="space-y-5">
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Flatmate</label>
            <select
              v-model="selectedFlatmate"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            >
              <option value="">Select a flatmate...</option>
              <option v-for="flatmate in flatmates" :key="flatmate.id" :value="flatmate.name">
                {{ flatmate.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Enquiry Type</label>
            <select
              v-model="enquiryType"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            >
              <option value="">Select enquiry type...</option>
              <option v-for="type in enquiryTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <div>
            <div class="flex justify-between items-center mb-2">
              <label class="block text-sm font-semibold text-slate-700">Message</label>
              <span :class="messageLength > 1000 ? 'text-red-600' : 'text-slate-400'" class="text-xs">
                {{ messageLength }}/1000
              </span>
            </div>
            <textarea
              v-model="message"
              placeholder="Describe what you need help with... (at least 10 characters)"
              rows="6"
              maxlength="1000"
              class="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
            ></textarea>
            <p v-if="messageLength > 0 && messageLength < 10" class="text-xs text-slate-500 mt-1">
              {{ 10 - messageLength }} more characters needed
            </p>
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
            Request submitted successfully!
          </div>

          <button
            type="submit"
            :disabled="!isFormValid || loading"
            :class="{
              'bg-blue-600 hover:bg-blue-700': isFormValid && !loading,
              'bg-slate-300 cursor-not-allowed': !isFormValid || loading
            }"
            class="w-full text-white py-3 rounded-lg font-semibold transition"
          >
            <span v-if="loading">Submitting...</span>
            <span v-else>Submit Request</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
