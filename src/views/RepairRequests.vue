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
  <div class="min-h-screen bg-emerald-50">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="max-w-4xl mx-auto">
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
    <div class="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-2 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Repair Requests</h1>
          <p class="mt-2 text-slate-500">Submit and track apartment maintenance and repairs.</p>
        </div>
        <button @click="showForm = !showForm" class="btn-primary self-start sm:self-auto shrink-0">
          <span v-if="showForm">Cancel</span>
          <span v-else>+ New Request</span>
        </button>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <!-- Repair Request Form -->
      <transition name="slide-down">
        <div v-if="showForm" class="card-elevated p-8 mb-8 animate-slide-up">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-slate-900 mb-1">Submit New Repair Request</h2>
            <p class="text-sm text-slate-600">Tell us about the issue and we'll get it fixed</p>
          </div>

          <div class="space-y-6">
            <!-- Issue Title -->
            <div>
              <label class="input-label flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                </svg>
                Issue Title
              </label>
              <input
                v-model="newRepair.title"
                type="text"
                placeholder="e.g., Leaky kitchen faucet"
                class="input"
              />
            </div>

            <!-- Description -->
            <div>
              <label class="input-label flex items-center gap-2">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
                </svg>
                Description
              </label>
              <textarea
                v-model="newRepair.description"
                placeholder="Describe the issue in detail. What are you experiencing? When did it start?"
                rows="4"
                class="input resize-none"
              ></textarea>
            </div>

            <!-- Priority Selection -->
            <div>
              <label class="input-label flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Priority Level
              </label>
              <div class="grid grid-cols-3 gap-3">
                <button
                  v-for="priority in ['low', 'medium', 'high']"
                  :key="priority"
                  type="button"
                  @click="newRepair.priority = priority as 'low' | 'medium' | 'high'"
                  :class="[
                    'py-3 rounded-lg text-sm font-semibold transition-all duration-200 border-2 capitalize',
                    newRepair.priority === priority
                      ? priority === 'high'
                        ? 'bg-red-50 text-red-700 border-red-300 ring-2 ring-offset-2 ring-red-300'
                        : priority === 'medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-offset-2 ring-amber-300'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-offset-2 ring-emerald-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  ]"
                >
                  <span v-if="priority === 'high'">🔴 High</span>
                  <span v-else-if="priority === 'medium'">🟡 Medium</span>
                  <span v-else>🟢 Low</span>
                </button>
              </div>
              <p class="text-xs text-slate-500 mt-2">
                <strong>High:</strong> Safety issue • <strong>Medium:</strong> Affects daily use • <strong>Low:</strong> Minor inconvenience
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4 border-t border-slate-100">
              <button
                @click="submitRepair"
                :disabled="!newRepair.title.trim() || !newRepair.description.trim()"
                class="btn-primary flex-1"
              >
                Submit Repair Request
              </button>
              <button
                @click="showForm = false"
                class="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Success Message -->
      <transition name="fade">
        <div v-if="submitted" class="alert alert-success mb-6 animate-in">
          <svg class="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
          </svg>
          <span>Repair request submitted successfully! We'll assess and get it fixed soon.</span>
        </div>
      </transition>

      <!-- Empty State -->
      <div v-if="repairs.length === 0" class="card-elevated p-12 text-center">
        <div class="text-6xl mb-4">🔧</div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Repair Requests Yet</h3>
        <p class="text-slate-600 mb-6">When you need something fixed, you can submit a request using the button above</p>
        <button
          @click="showForm = true"
          class="btn-primary"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create First Request
        </button>
      </div>

      <!-- Repair Requests List -->
      <div v-else class="space-y-4">
        <div v-for="repair in repairs" :key="repair.id" class="card-elevated p-6 hover:shadow-lg transition-all">
          <!-- Header -->
          <div class="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h3 class="text-lg font-bold text-slate-900">{{ repair.title }}</h3>
                <span :class="[
                  'badge',
                  repair.priority === 'high' ? 'badge-danger' : repair.priority === 'medium' ? 'badge-warning' : 'badge-success'
                ]">
                  {{ getPriorityIcon(repair.priority) }}
                  {{ repair.priority.charAt(0).toUpperCase() + repair.priority.slice(1) }}
                </span>
              </div>
              <p class="text-slate-600 text-sm">{{ repair.description }}</p>
            </div>
            <span :class="[
              'badge ml-3 shrink-0',
              getStatusColor(repair.status).bg,
              getStatusColor(repair.status).text,
              getStatusColor(repair.status).border,
              'border'
            ]">
              {{ repair.status.replace('-', ' ').toUpperCase() }}
            </span>
          </div>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 mb-5 text-sm text-slate-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              <span>By <strong class="text-slate-900">{{ repair.submittedBy }}</strong></span>
            </div>
            <span class="text-slate-300">•</span>
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              <span>{{ repair.submittedDate }}</span>
            </div>
          </div>

          <!-- Status Buttons -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="status in ['open', 'in-progress', 'closed']"
              :key="status"
              @click="updateStatus(repair.id, status)"
              :class="[
                'px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize',
                repair.status === status
                  ? status === 'closed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 ring-2 ring-offset-2 ring-emerald-300'
                    : status === 'in-progress'
                    ? 'bg-amber-50 text-amber-700 border border-amber-300 ring-2 ring-offset-2 ring-amber-300'
                    : 'bg-red-50 text-red-700 border border-red-300 ring-2 ring-offset-2 ring-red-300'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              ]"
            >
              {{ status.replace('-', ' ') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
