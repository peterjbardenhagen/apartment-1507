<script setup lang="ts">
import { ref, computed } from 'vue'
import { eventLogService, type EventLogEntry, type EventType } from '@/services/eventLogService'
import { formatDateTime } from '@/services/settingsService'

const entries = ref<EventLogEntry[]>(eventLogService.getAll())
const filter = ref<'all' | EventType>('all')

const filtered = computed(() => {
  if (filter.value === 'all') return entries.value
  return entries.value.filter(e => e.type === filter.value)
})

const counts = computed(() => ({
  all: entries.value.length,
  login: entries.value.filter(e => e.type === 'login').length,
  warning: entries.value.filter(e => e.type === 'warning').length,
  error: entries.value.filter(e => e.type === 'error').length
}))

const badgeClass = (type: EventType) => {
  if (type === 'login') return 'badge-info'
  if (type === 'warning') return 'badge-warning'
  return 'badge-danger'
}

const clearLog = () => {
  if (!confirm('Clear the entire event log? This cannot be undone.')) return
  eventLogService.clear()
  entries.value = []
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Event Log</h1>
        <p class="text-slate-500 mt-2">Logins, warnings and errors across the site</p>
      </div>
      <button v-if="entries.length" @click="clearLog" class="btn-secondary text-sm self-start sm:self-auto">
        Clear Log
      </button>
    </div>

    <div class="flex flex-wrap gap-2">
      <button
        v-for="f in (['all', 'login', 'warning', 'error'] as const)"
        :key="f"
        @click="filter = f"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold transition',
          filter === f ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        ]"
      >
        {{ f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's' }}
        <span class="ml-1 opacity-75">({{ counts[f] }})</span>
      </button>
    </div>

    <div v-if="filtered.length === 0" class="card-elevated p-12 text-center">
      <div class="text-4xl mb-3">📋</div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">No Events</h3>
      <p class="text-slate-600">
        {{ entries.length === 0 ? 'Nothing has been logged yet.' : 'No events match this filter.' }}
      </p>
    </div>

    <div v-else class="card-elevated overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-100 bg-slate-50 text-left text-slate-500">
            <th class="px-5 py-3 font-semibold">Type</th>
            <th class="px-5 py-3 font-semibold">Message</th>
            <th class="px-5 py-3 font-semibold">Actor</th>
            <th class="px-5 py-3 font-semibold">When</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="e in filtered" :key="e.id" class="border-b border-slate-50 last:border-0">
            <td class="px-5 py-3">
              <span :class="badgeClass(e.type)">{{ e.type }}</span>
            </td>
            <td class="px-5 py-3 text-slate-700">{{ e.message }}</td>
            <td class="px-5 py-3 text-slate-500">{{ e.actor || '—' }}</td>
            <td class="px-5 py-3 text-slate-400 whitespace-nowrap">{{ formatDateTime(e.timestamp) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
