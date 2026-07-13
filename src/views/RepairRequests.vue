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
      return 'bg-red-100 text-red-800 border-red-200'
    case 'in-progress':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'closed':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'low':
      return 'text-slate-500'
    case 'medium':
      return 'text-amber-600'
    case 'high':
      return 'text-red-600'
    default:
      return 'text-slate-500'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm">
          Back
        </button>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Repair Requests</h1>
            <p class="text-slate-400 mt-1 text-sm">Track and manage apartment repairs</p>
          </div>
          <button
            @click="showForm = !showForm"
            class="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition text-sm"
          >
            New Repair
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-6">
      <div v-if="showForm" class="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
        <h2 class="text-lg font-bold text-slate-800 mb-4">Submit New Repair Request</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Issue Title</label>
            <input
              v-model="newRepair.title"
              type="text"
              placeholder="e.g., Leaky faucet"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              v-model="newRepair.description"
              placeholder="Describe the issue in detail..."
              rows="4"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <select
              v-model="newRepair.priority"
              class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="flex gap-3">
            <button
              @click="submitRepair"
              class="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Submit Request
            </button>
            <button
              @click="showForm = false"
              class="flex-1 bg-slate-200 text-slate-700 py-2 rounded-lg font-medium hover:bg-slate-300 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm">
        Repair request submitted!
      </div>

      <div class="space-y-4">
        <div v-if="repairs.length === 0" class="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
          No repair requests yet
        </div>

        <div v-for="repair in repairs" :key="repair.id" class="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <div class="flex justify-between items-start mb-3">
            <div>
              <h3 class="font-bold text-slate-800">{{ repair.title }}</h3>
              <p class="text-slate-600 text-sm mt-1">{{ repair.description }}</p>
            </div>
            <span :class="getStatusColor(repair.status)" class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap border">
              {{ repair.status.replace('-', ' ').toUpperCase() }}
            </span>
          </div>

          <div class="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
            <div class="text-sm text-slate-500">
              <span>By <strong class="text-slate-700">{{ repair.submittedBy }}</strong> on {{ repair.submittedDate }}</span>
              <span :class="getPriorityColor(repair.priority)" class="ml-3 font-medium">
                {{ repair.priority.toUpperCase() }} Priority
              </span>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              @click="updateStatus(repair.id, 'open')"
              :class="repair.status === 'open' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3 py-1.5 rounded-lg border text-sm font-medium transition"
            >
              Open
            </button>
            <button
              @click="updateStatus(repair.id, 'in-progress')"
              :class="repair.status === 'in-progress' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3 py-1.5 rounded-lg border text-sm font-medium transition"
            >
              In Progress
            </button>
            <button
              @click="updateStatus(repair.id, 'closed')"
              :class="repair.status === 'closed' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
              class="px-3 py-1.5 rounded-lg border text-sm font-medium transition"
            >
              Closed
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
