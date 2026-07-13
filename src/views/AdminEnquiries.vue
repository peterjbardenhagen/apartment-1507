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
      return 'bg-red-100 text-red-800'
    case 'read':
      return 'bg-yellow-100 text-yellow-800'
    case 'resolved':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-slate-100 text-slate-800'
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
  <div class="min-h-screen bg-slate-100">
    <div class="bg-slate-900 text-white p-8 shadow-lg">
      <div class="max-w-6xl mx-auto">
        <button @click="router.push('/admin/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Admin
        </button>
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">📨 Flatmate Enquiries</h1>
            <p class="text-slate-300 mt-2">
              Manage requests and enquiries from flatmates
              <span v-if="unreadCount" class="ml-4 bg-red-600 px-3 py-1 rounded-full text-sm font-bold">
                {{ unreadCount }} new
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto p-8">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Enquiries List -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow">
            <!-- Filter Tabs -->
            <div class="flex border-b">
              <button
                v-for="status in ['all', 'new', 'read', 'resolved']"
                :key="status"
                @click="filter = status as any"
                :class="{
                  'border-b-2 border-blue-600 text-blue-600': filter === status,
                  'border-b-2 border-transparent text-slate-600 hover:text-slate-900': filter !== status
                }"
                class="flex-1 py-4 px-4 font-semibold transition capitalize"
              >
                {{ status }} ({{ enquiries.filter(e => status === 'all' || e.status === status).length }})
              </button>
            </div>

            <!-- Enquiries -->
            <div class="divide-y max-h-96 overflow-y-auto">
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
                    <p :class="getTypeColor(enquiry.enquiryType)" class="text-sm font-semibold">
                      {{ enquiry.enquiryType }}
                    </p>
                  </div>
                  <div :class="getStatusColor(enquiry.status)" class="px-2 py-1 rounded text-xs font-semibold">
                    {{ enquiry.status.toUpperCase() }}
                  </div>
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

        <!-- Enquiry Details -->
        <div class="lg:col-span-1">
          <div v-if="selectedEnquiry" class="bg-white rounded-lg shadow p-6 space-y-4">
            <div>
              <h2 class="text-xl font-bold mb-4">{{ selectedEnquiry.flatmate }}</h2>

              <div class="space-y-3">
                <div>
                  <label class="text-xs font-semibold text-slate-600 uppercase">Type</label>
                  <p :class="getTypeColor(selectedEnquiry.enquiryType)" class="font-semibold">
                    {{ selectedEnquiry.enquiryType }}
                  </p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-600 uppercase">Message</label>
                  <p class="text-slate-700 whitespace-pre-wrap">{{ selectedEnquiry.message }}</p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-600 uppercase">Submitted</label>
                  <p class="text-sm text-slate-600">{{ new Date(selectedEnquiry.timestamp).toLocaleString() }}</p>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-600 uppercase block mb-2">Status</label>
                  <div class="flex gap-2">
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'new')"
                      :class="selectedEnquiry.status === 'new' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1 rounded text-sm font-semibold border transition"
                    >
                      New
                    </button>
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'read')"
                      :class="selectedEnquiry.status === 'read' ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1 rounded text-sm font-semibold border transition"
                    >
                      Read
                    </button>
                    <button
                      @click="updateStatus(selectedEnquiry.id, 'resolved')"
                      :class="selectedEnquiry.status === 'resolved' ? 'bg-green-100 text-green-700 border-green-300' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                      class="flex-1 px-2 py-1 rounded text-sm font-semibold border transition"
                    >
                      Resolved
                    </button>
                  </div>
                </div>

                <div>
                  <label class="text-xs font-semibold text-slate-600 uppercase block mb-2">Notes</label>
                  <textarea
                    v-model="responseNotes"
                    placeholder="Add internal notes..."
                    rows="4"
                    class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  ></textarea>
                  <button
                    @click="saveNotes"
                    class="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  >
                    Save Notes
                  </button>
                </div>

                <button
                  @click="deleteEnquiry(selectedEnquiry.id)"
                  class="w-full bg-red-100 text-red-700 py-2 rounded-lg font-semibold hover:bg-red-200 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>

          <div v-else class="bg-slate-50 rounded-lg p-6 text-center text-slate-500">
            Select an enquiry to view details
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
