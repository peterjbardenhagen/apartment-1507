<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const repairs = ref<Array<{
  id: number
  title: string
  description: string
  status: 'open' | 'in-progress' | 'closed'
  submittedBy: string
  submittedDate: string
  priority: 'low' | 'medium' | 'high'
}>>([])
const newRepair = ref({ title: '', description: '', priority: 'medium' })
const showForm = ref(false)
const submitted = ref(false)

onMounted(() => {
  loadRepairs()
})

const loadRepairs = () => {
  const stored = localStorage.getItem('repairRequests')
  if (stored) {
    repairs.value = JSON.parse(stored)
  } else {
    repairs.value = [
      {
        id: 1,
        title: 'Leaky kitchen tap',
        description: 'The kitchen tap is dripping',
        status: 'in-progress',
        submittedBy: 'Kevin',
        submittedDate: '2026-07-10',
        priority: 'medium'
      },
      {
        id: 2,
        title: 'Balcony door squeaks',
        description: 'Balcony door squeaks when opening',
        status: 'open',
        submittedBy: 'Peter',
        submittedDate: '2026-07-12',
        priority: 'low'
      }
    ]
    saveRepairs()
  }
}

const saveRepairs = () => {
  localStorage.setItem('repairRequests', JSON.stringify(repairs.value))
}

const submitRepair = () => {
  if (!newRepair.value.title.trim() || !newRepair.value.description.trim()) {
    alert('Please fill in all fields')
    return
  }

  repairs.value.push({
    id: Date.now(),
    title: newRepair.value.title,
    description: newRepair.value.description,
    priority: newRepair.value.priority as 'low' | 'medium' | 'high',
    status: 'open',
    submittedBy: 'You',
    submittedDate: new Date().toISOString().split('T')[0]
  })

  saveRepairs()
  newRepair.value = { title: '', description: '', priority: 'medium' }
  showForm.value = false
  submitted.value = true

  setTimeout(() => {
    submitted.value = false
  }, 3000)
}

const updateStatus = (id: number, newStatus: 'open' | 'in-progress' | 'closed') => {
  const repair = repairs.value.find(r => r.id === id)
  if (repair) {
    repair.status = newStatus
    saveRepairs()
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800'
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'closed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'text-slate-600'
    case 'medium':
      return 'text-yellow-600'
    case 'high':
      return 'text-red-600'
    default:
      return 'text-slate-600'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="bg-slate-900 text-white p-8 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back
        </button>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">🔧 Repair Requests</h1>
            <p class="text-slate-300 mt-2">Track and manage apartment repairs</p>
          </div>
          <button
            @click="showForm = !showForm"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold transition"
          >
            ➕ New Repair
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-8">
      <!-- New Repair Form -->
      <div v-if="showForm" class="bg-white rounded-lg shadow p-8 mb-8">
        <h2 class="text-2xl font-bold mb-6">Submit New Repair Request</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-bold mb-2">Issue Title</label>
            <input
              v-model="newRepair.title"
              type="text"
              placeholder="e.g., Leaky faucet"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">Description</label>
            <textarea
              v-model="newRepair.description"
              placeholder="Describe the issue in detail..."
              rows="4"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-bold mb-2">Priority</label>
            <select
              v-model="newRepair.priority"
              class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              @click="submitRepair"
              class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
            <button
              @click="showForm = false"
              class="flex-1 bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="submitted" class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-8">
        ✅ Repair request submitted!
      </div>

      <!-- Repair List -->
      <div class="space-y-4">
        <div v-if="repairs.length === 0" class="bg-white rounded-lg shadow p-8 text-center text-slate-600">
          No repair requests yet
        </div>

        <div v-for="repair in repairs" :key="repair.id" class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold">{{ repair.title }}</h3>
              <p class="text-slate-600 mt-2">{{ repair.description }}</p>
            </div>
            <div :class="getStatusColor(repair.status)" class="px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
              {{ repair.status.replace('-', ' ').toUpperCase() }}
            </div>
          </div>

          <div class="flex justify-between items-center mb-4 pb-4 border-b">
            <div class="text-sm text-slate-600">
              <span>Submitted by <strong>{{ repair.submittedBy }}</strong> on {{ repair.submittedDate }}</span>
              <span :class="getPriorityColor(repair.priority)" class="ml-4 font-semibold">
                {{ repair.priority.toUpperCase() }} Priority
              </span>
            </div>
          </div>

          <!-- Status Buttons -->
          <div class="flex gap-2">
            <button
              @click="updateStatus(repair.id, 'open')"
              :class="{
                'bg-red-100 text-red-700 border-red-300': repair.status === 'open',
                'bg-slate-100 text-slate-700 hover:bg-slate-200': repair.status !== 'open'
              }"
              class="px-3 py-2 rounded border transition"
            >
              Open
            </button>
            <button
              @click="updateStatus(repair.id, 'in-progress')"
              :class="{
                'bg-yellow-100 text-yellow-700 border-yellow-300': repair.status === 'in-progress',
                'bg-slate-100 text-slate-700 hover:bg-slate-200': repair.status !== 'in-progress'
              }"
              class="px-3 py-2 rounded border transition"
            >
              In Progress
            </button>
            <button
              @click="updateStatus(repair.id, 'closed')"
              :class="{
                'bg-green-100 text-green-700 border-green-300': repair.status === 'closed',
                'bg-slate-100 text-slate-700 hover:bg-slate-200': repair.status !== 'closed'
              }"
              class="px-3 py-2 rounded border transition"
            >
              Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
