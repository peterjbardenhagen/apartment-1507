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
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-500' }
    case 'in-progress':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' }
    case 'closed':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' }
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200', dot: 'bg-slate-500' }
  }
}

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'high': return '🔴'
    case 'medium': return '🟡'
    case 'low': return '🟢'
    default: return '⚪'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-4xl mx-auto">
        <button @click="router.push('/flatmate/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back
        </button>
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <h1 class="text-2xl font-bold">Repair Requests</h1>
              <p class="text-slate-400 text-sm">Track and manage apartment repairs</p>
            </div>
          </div>
          <button
            @click="showForm = !showForm"
            class="btn-primary text-sm"
          >
            <span v-if="showForm">Cancel</span>
            <span v-else class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              New Repair
            </span>
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-4 sm:p-6">
      <div v-if="showForm" class="card p-6 mb-6 animate-slide-up">
        <h2 class="text-lg font-bold text-slate-900 mb-5">Submit New Repair Request</h2>
        <div class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Issue Title</label>
            <input
              v-model="newRepair.title"
              type="text"
              placeholder="e.g., Leaky faucet"
              class="input"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Description</label>
            <textarea
              v-model="newRepair.description"
              placeholder="Describe the issue in detail..."
              rows="4"
              class="input resize-none"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Priority</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                v-for="priority in ['low', 'medium', 'high']"
                :key="priority"
                type="button"
                @click="newRepair.priority = priority as 'low' | 'medium' | 'high'"
                :class="[
                  newRepair.priority === priority ? 'ring-2 ring-offset-2' : 'border border-slate-200 hover:border-slate-300',
                  newRepair.priority === priority ? (priority === 'high' ? 'bg-red-50 text-red-700' : priority === 'medium' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700') : 'bg-white text-slate-600'
                ]"
                :style="newRepair.priority === priority ? { '--tw-ring-color': priority === 'high' ? '#ef4444' : priority === 'medium' ? '#f59e0b' : '#10b981' } : {}"
                class="py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
              >
                {{ priority }}
              </button>
            </div>
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="submitRepair"
              :disabled="!newRepair.title.trim() || !newRepair.description.trim()"
              class="btn-primary flex-1"
            >
              Submit Request
            </button>
            <button
              @click="showForm = false"
              class="btn-secondary flex-1"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      <div v-if="submitted" class="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2 animate-in">
        <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
        Repair request submitted!
      </div>

      <div v-if="repairs.length === 0" class="card p-12 text-center">
        <div class="text-4xl mb-3">🔧</div>
        <p class="text-slate-500">No repair requests yet</p>
      </div>

      <div v-else class="space-y-4">
        <div v-for="repair in repairs" :key="repair.id" class="card p-5 hover:border-slate-300 transition-all">
          <div class="flex justify-between items-start mb-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-bold text-slate-900">{{ repair.title }}</h3>
                <span class="text-sm">{{ getPriorityIcon(repair.priority) }}</span>
              </div>
              <p class="text-slate-600 text-sm">{{ repair.description }}</p>
            </div>
            <span :class="[getStatusColor(repair.status).bg, getStatusColor(repair.status).text, getStatusColor(repair.status).border]" class="badge border ml-3 shrink-0">
              {{ repair.status.replace('-', ' ').toUpperCase() }}
            </span>
          </div>

          <div class="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 text-sm text-slate-500">
            <span>By <strong class="text-slate-700">{{ repair.submittedBy }}</strong></span>
            <span class="text-slate-300">•</span>
            <span>{{ repair.submittedDate }}</span>
          </div>

          <div class="flex gap-2">
            <button
              v-for="status in ['open', 'in-progress', 'closed']"
              :key="status"
              @click="updateStatus(repair.id, status)"
              :class="repair.status === status ? getStatusColor(status).bg + ' ' + getStatusColor(status).text + ' ' + getStatusColor(status).border + ' ring-1' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize"
            >
              {{ status.replace('-', ' ') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
