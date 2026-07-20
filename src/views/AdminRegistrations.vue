<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getRegistrations, markRegistrationStatus, type Registration } from '@/services/registrationsService'

const router = useRouter()

const registrations = ref<Registration[]>([])
const loading = ref(true)
const error = ref('')
const actioningId = ref<number | null>(null)

const pending = computed(() => registrations.value.filter(r => r.status === 'pending'))
const resolved = computed(() => registrations.value.filter(r => r.status !== 'pending'))

const load = async () => {
  loading.value = true
  error.value = ''
  try {
    registrations.value = await getRegistrations()
  } catch (e) {
    const message = (e as Error)?.message || ''
    error.value = message.includes('Failed to fetch') || message.includes('Timed out')
      ? 'Could not reach Supabase — check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.'
      : message || 'Could not load registrations.'
  }
  loading.value = false
}

onMounted(load)

const addAsTenant = (r: Registration) => {
  router.push({
    path: '/admin/tenants/new',
    query: {
      registrationId: String(r.id),
      name: r.first_name,
      email: r.email,
      username: r.username || '',
      contact: r.phone || ''
    }
  })
}

const dismiss = async (r: Registration) => {
  if (!confirm(`Dismiss the registration request from ${r.first_name}?`)) return
  actioningId.value = r.id
  try {
    await markRegistrationStatus(r.id, 'rejected')
    await load()
  } catch (e) {
    error.value = (e as Error)?.message || 'Could not update the request.'
  }
  actioningId.value = null
}

const formatDate = (iso: string) => new Date(iso).toLocaleString('en-AU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Registrations</h1>
      <p class="text-sm text-slate-500 mt-1.5">Requests submitted via the public "Request access" page.</p>
    </div>

    <div v-if="error" class="alert-error">
      <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
      </svg>
      <span>{{ error }}</span>
    </div>

    <div v-if="loading" class="card-elevated p-12 text-center text-slate-500">
      Loading…
    </div>

    <template v-else>
      <div v-if="pending.length === 0 && resolved.length === 0 && !error" class="card-elevated p-12 text-center">
        <div class="text-4xl mb-3">📥</div>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Requests Yet</h3>
        <p class="text-slate-600">Nobody has submitted a registration request.</p>
      </div>

      <div v-if="pending.length" class="space-y-3">
        <p class="form-section-title">Pending ({{ pending.length }})</p>
        <div v-for="r in pending" :key="r.id" class="card-elevated p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="flex-1 min-w-0">
            <p class="font-semibold text-slate-900">{{ r.first_name }}</p>
            <p class="text-sm text-slate-500 truncate">{{ r.email }}</p>
            <p class="text-xs text-slate-400 mt-1">
              <span v-if="r.username">Wants username "{{ r.username }}" · </span>
              <span v-if="r.phone">{{ r.phone }} · </span>
              {{ formatDate(r.created_at) }}
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="dismiss(r)" :disabled="actioningId === r.id" class="btn-secondary text-sm px-4 py-2">
              Dismiss
            </button>
            <button @click="addAsTenant(r)" class="btn-primary text-sm px-4 py-2">
              Add as Tenant →
            </button>
          </div>
        </div>
      </div>

      <div v-if="resolved.length" class="space-y-3">
        <p class="form-section-title">Resolved ({{ resolved.length }})</p>
        <div v-for="r in resolved" :key="r.id" class="card p-4 sm:p-5 flex items-center justify-between gap-4 opacity-70">
          <div class="min-w-0">
            <p class="font-medium text-slate-700">{{ r.first_name }}</p>
            <p class="text-xs text-slate-400 truncate">{{ r.email }}</p>
          </div>
          <span :class="r.status === 'converted' ? 'badge-success' : 'badge-neutral'">{{ r.status }}</span>
        </div>
      </div>
    </template>
  </div>
</template>
