<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const flatmates = ref<Array<{ id: string; name: string }>>([])
const selectedFlatmate = ref('')
const enquiryType = ref('')
const message = ref('')
const submitted = ref(false)

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

const handleSubmit = () => {
  if (!selectedFlatmate.value || !enquiryType.value || !message.value.trim()) {
    alert('Please fill in all fields')
    return
  }

  // Store request data
  const request = {
    id: Date.now(),
    flatmate: selectedFlatmate.value,
    enquiryType: enquiryType.value,
    message: message.value,
    timestamp: new Date().toISOString(),
    status: 'submitted'
  }

  // Save to localStorage
  const requests = JSON.parse(localStorage.getItem('helpRequests') || '[]')
  requests.push(request)
  localStorage.setItem('helpRequests', JSON.stringify(requests))

  submitted.value = true
  selectedFlatmate.value = ''
  enquiryType.value = ''
  message.value = ''

  setTimeout(() => {
    submitted.value = false
  }, 3000)
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
            <label class="block text-sm font-bold mb-2">💬 Message</label>
            <textarea
              v-model="message"
              placeholder="Describe what you need help with..."
              rows="6"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <!-- Success Message -->
          <div v-if="submitted" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            ✅ Request submitted successfully!
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            📤 Submit Request
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
