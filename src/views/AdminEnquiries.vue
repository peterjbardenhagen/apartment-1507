<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

interface Enquiry {
  id: number
  flatmate: string
  enquiryType: string
  message: string
  timestamp: string
  status: 'new' | 'read' | 'resolved'
  notes?: string
}

const router = useRouter()
const enquiries = ref<Enquiry[]>([])
const filter = ref<'all' | 'new' | 'read' | 'resolved'>('all')
const selectedEnquiry = ref<Enquiry | null>(null)
const responseNotes = ref('')

const filteredEnquiries = computed(() => {
  if (filter.value === 'all') return enquiries.value
  return enquiries.value.filter(e => e.status === filter.value)
})

const unreadCount = computed(() => enquiries.value.filter(e => e.status === 'new').length)

onMounted(() => {
  loadEnquiries()
})

const loadEnquiries = () => {
  const stored = localStorage.getItem('helpEnquiries')
  if (stored) {
    enquiries.value = JSON.parse(stored).sort((a: Enquiry, b: Enquiry) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }
}

const saveEnquiries = () => {
  localStorage.setItem('helpEnquiries', JSON.stringify(enquiries.value))
}

const selectEnquiry = (enquiry: Enquiry) => {
  selectedEnquiry.value = enquiry
  if (enquiry.status === 'new') {
    enquiry.status = 'read'
    saveEnquiries()
  }
  responseNotes.value = enquiry.notes || ''
}

const updateStatus = (id: number, newStatus: 'new' | 'read' | 'resolved') => {
  const enquiry = enquiries.value.find(e => e.id === id)
  if (enquiry) {
    enquiry.status = newStatus
    saveEnquiries()
  }
}

const saveNotes = () => {
  if (selectedEnquiry.value) {
    selectedEnquiry.value.notes = responseNotes.value
    saveEnquiries()
  }
}

const deleteEnquiry = (id: number) => {
  if (confirm('Delete this enquiry permanently?')) {
    enquiries.value = enquiries.value.filter(e => e.id !== id)
    saveEnquiries()
    selectedEnquiry.value = null
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'new':
      return 'bg-red-100 text-red-800 border-red-200'
    case 'read':
      return 'bg-amber-100 text-amber-800 border-amber-200'
    case 'resolved':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200'
  }
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    'Idea for home': 'text-blue-600',
    'Cleaning issues': 'text-orange-600',
    'General complaint': 'text-red-600',
    'Request Repair': 'text-purple-600',
    'Private Matter (Confidential)': 'text-slate-600',
    'Other': 'text-gray-600'
  }
  return colors[type] || 'text-gray-600'
}
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-6xl mx-auto">
        <button @click="router.push('/admin/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm">
          Back to Admin
        </button>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-2xl font-bold">Flatmate Enquiries</h1>
            <p class="text-slate-400 mt-1 text-sm">
              Manage requests and enquiries from flatmates
              <span v-if="unreadCount" class="ml-3 bg-red-600 px-2 py-0.5 rounded-full text-xs font-bold">
                {{ unreadCount }} new
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2">
          <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="flex border-b border-slate-200">
              <button
                v-for="status in ['all', 'new', 'read', 'resolved']"
                :key="status"
                @click="filter = status as any"
                :class="{
                  'border-b-2 border-blue-600 text-blue-600': filter === status,
                  'border-b-2 border-transparent text-slate-500 hover:text-slate-700': filter !== status
                }"
                class="flex-1 py-3 px-4 font-medium transition text-sm capitalize"
              >
                {{ status }} ({{ enquiries.filter(e => status === 'all' || e.status === status).length }})
              </button>
            </div>

            <div class="divide-y divide-slate-100 max-h-96 overflow-y-auto">
              <div
                v-for="enquiry in filteredEnquiries"
                :key="enquiry.id"
                @click="selectEnquiry(enquiry)"
                :class="{
                  'bg-blue-50 border-l-4 border-blue-500': selectedEnquiry?.id === enquiry.id
                }"
                class="p-4 cursor-pointer hover:bg-slate-50 transition"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <h3 class="font-bold text-slate-900">{{ enquiry.flatmate }}</h3>
                    <p :class="getTypeColor(enquiry.enquiryType)" class="text-sm font-medium">
                      {{ enquiry.enquiryType }}
                    </p>
                  </div>
                  <span :class="getStatusColor(enquiry.status)" class="px-2 py-1 rounded-full text-xs font-semibold border">
                    {{ enquiry.status.toUpperCase() }}
                  </span>
                </div>
                <p class="text-slate-600 text-sm line-clamp-2">{{ enquiry.message }}</p>
                <p class="text-xs text-slate-400 mt-2">{{ new Date(enquiry.timestamp).toLocaleString() }}</p>
              </div>

              <div v-if="filteredEnquiries.length === 0" class="p-8 text-center text-slate-500">
                No enquiries in this category
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-1">
          <div v-if="selectedEnquiry" class="bg-white border border-slate-200 rounded-xl p-5 space-y-4 shadow-sm">
            <div>
              <h2 class="text-lg font-bold text-slate-800 mb-4">{{ selectedEnquiry.flatmate }}</h2>

              <div class="space-y-3">
                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase">Type</label>
                  <p :class="getTypeColor(selectedEnquiry.enquiryType)" class="font-semibold">
                    {{ selectedEnquiry.enquiryType }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase">Message</label>
                  <p class="text-slate-700 whitespace-pre-wrap text-sm">{{ selectedEnquiry.message }}</p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase">Submitted</label>
                  <p class="text-sm text-slate-600">{{ new Date(selectedEnquiry.timestamp).toLocaleString() }}</p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase block mb-2">Status</label>
                  <div class="flex gap-2">
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'new')"
                      :class="selectedEnquiry.status === 'new' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium border transition"
                    >
                      New
                    </button>
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'read')"
                      :class="selectedEnquiry.status === 'read' ? 'bg-amber-100 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium border transition"
                    >
                      Read
                    </button>
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'resolved')"
                      :class="selectedEnquiry.status === 'resolved' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1.5 rounded-lg text-sm font-medium border transition"
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-500 uppercase block mb-2">Notes</label>
                  <textarea
                    v-model="responseNotes"
                    placeholder="Add internal notes..."
                    rows="4"
                    class="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm transition"
                  ></textarea>
                  <button
                    @click="saveNotes"
                    class="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
                  >
                    Save Notes
                  </button>
                </div>

                <button
                  @click="deleteEnquiry(selectedEnquiry.id)"
                  class="w-full bg-red-50 text-red-700 border border-red-200 py-2 rounded-lg font-medium hover:bg-red-100 transition text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-slate-500 text-sm">
            Select an enquiry to view details
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
