<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HEALTH_FACILITIES,
  HOME_ADDRESS,
  TRAVEL_MODES,
  estimateDistanceKm,
  estimateTravelMinutes,
  googleDirectionsUrl,
  googleDirectionsLink,
  uberDeepLink,
  type TravelMode,
  type HealthFacility
} from '@/services/healthServicesService'

const router = useRouter()
const mode = ref<TravelMode>('driving')
const expandedId = ref<string | null>(null)

const toggleExpanded = (id: string) => {
  expandedId.value = expandedId.value === id ? null : id
}

const facilityStats = (f: HealthFacility) => {
  if (f.lat === undefined || f.lng === undefined) return null
  const distanceKm = estimateDistanceKm(f.lat, f.lng)
  const minutes = estimateTravelMinutes(distanceKm, mode.value)
  return { distanceKm, minutes }
}

const hospitals = computed(() => HEALTH_FACILITIES.filter(f => f.category.startsWith('hospital')))
const gps = computed(() => HEALTH_FACILITIES.filter(f => f.category === 'gp'))
const homeDoctors = computed(() => HEALTH_FACILITIES.filter(f => f.category === 'home-doctor'))

const categoryLabel = (category: HealthFacility['category']) => {
  switch (category) {
    case 'hospital-public': return 'Public Hospital'
    case 'hospital-private': return 'Private Hospital'
    case 'gp': return 'GP Clinic'
    case 'home-doctor': return 'Home Doctor'
    default: return ''
  }
}

const categoryBadgeClass = (category: HealthFacility['category']) => {
  switch (category) {
    case 'hospital-public': return 'badge-danger'
    case 'hospital-private': return 'badge-info'
    case 'gp': return 'badge-success'
    case 'home-doctor': return 'badge-warning'
    default: return 'badge-neutral'
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
      <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 8v6M22 11h-6M4 10a4 4 0 118 0v1h.5a2.5 2.5 0 010 5H15v3l-3 2-3-2v-3H7.5a2.5 2.5 0 010-5H8v-1z"/>
        </svg>
      </div>
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Medical &amp; Health Services</h1>
      <p class="mt-2 text-slate-500 max-w-xl">
        Hospitals, GP clinics and home-doctor options near {{ HOME_ADDRESS }}.
      </p>
      <div class="mt-4 alert-warning">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.72-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.743 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-.25-6.25a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0v-3.5z" clip-rule="evenodd"/>
        </svg>
        <span><strong>Emergency?</strong> Always call <strong>000</strong> first. This page is for general medical needs only.</span>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <!-- Travel mode selector -->
      <div class="card p-4 sm:p-5">
        <p class="form-section-title mb-3">Travel method</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="m in TRAVEL_MODES"
            :key="m.key"
            @click="mode = m.key"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border',
              mode === m.key
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-pill'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            ]"
          >
            <span>{{ m.icon }}</span>
            {{ m.label }}
          </button>
        </div>
        <p class="text-xs text-slate-400 mt-3">
          Distances and times below are estimates from {{ HOME_ADDRESS }}. Open "Directions" on any listing for real-time routing.
        </p>
      </div>

      <!-- Hospitals -->
      <div>
        <p class="form-section-title mb-3">Hospitals</p>
        <div class="space-y-3">
          <div v-for="f in hospitals" :key="f.id" class="card-elevated overflow-hidden">
            <button @click="toggleExpanded(f.id)" class="w-full text-left p-5 sm:p-6">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 class="font-bold text-slate-900">{{ f.name }}</h3>
                    <span :class="categoryBadgeClass(f.category)">{{ categoryLabel(f.category) }}</span>
                  </div>
                  <p class="text-sm text-slate-500">{{ f.address }}</p>
                </div>
                <div v-if="facilityStats(f)" class="text-right shrink-0">
                  <p class="text-sm font-bold text-slate-900">{{ facilityStats(f)!.distanceKm.toFixed(1) }} km</p>
                  <p class="text-xs text-slate-500">~{{ facilityStats(f)!.minutes }} min</p>
                </div>
              </div>
              <p v-if="f.notes" class="text-sm text-slate-600 mt-3">{{ f.notes }}</p>
              <div class="flex flex-wrap gap-4 mt-3 text-sm">
                <a v-if="f.phone" :href="`tel:${f.phone}`" class="text-emerald-700 hover:text-emerald-800 font-medium">📞 {{ f.phone }}</a>
                <a v-if="f.website" :href="f.website" target="_blank" rel="noopener" class="text-emerald-700 hover:text-emerald-800 font-medium">🌐 Website ↗</a>
              </div>
            </button>

            <transition name="fade">
              <div v-if="expandedId === f.id && f.address" class="border-t border-slate-100 p-4 sm:p-5 bg-slate-50">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Directions ({{ TRAVEL_MODES.find(m => m.key === mode)?.label }})</p>
                  <a :href="googleDirectionsLink(f.address, mode)" target="_blank" rel="noopener" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    Open in Google Maps ↗
                  </a>
                </div>
                <iframe
                  :src="googleDirectionsUrl(f.address, mode)"
                  class="w-full h-72 rounded-xl border border-slate-200"
                  loading="lazy"
                ></iframe>
                <a
                  v-if="mode === 'uber'"
                  :href="uberDeepLink(f.address, f.lat, f.lng)"
                  target="_blank"
                  rel="noopener"
                  class="btn-primary w-full mt-3 justify-center"
                >
                  Request Uber to {{ f.name }}
                </a>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- GP Clinics -->
      <div>
        <p class="form-section-title mb-3">GP Clinics</p>
        <div class="space-y-3">
          <div v-for="f in gps" :key="f.id" class="card-elevated overflow-hidden">
            <button @click="toggleExpanded(f.id)" class="w-full text-left p-5 sm:p-6">
              <div class="flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap mb-1.5">
                    <h3 class="font-bold text-slate-900">{{ f.name }}</h3>
                    <span :class="categoryBadgeClass(f.category)">{{ categoryLabel(f.category) }}</span>
                  </div>
                  <p class="text-sm text-slate-500">{{ f.address }}</p>
                </div>
                <div v-if="facilityStats(f)" class="text-right shrink-0">
                  <p class="text-sm font-bold text-slate-900">{{ facilityStats(f)!.distanceKm.toFixed(1) }} km</p>
                  <p class="text-xs text-slate-500">~{{ facilityStats(f)!.minutes }} min</p>
                </div>
              </div>
              <p v-if="f.notes" class="text-sm text-slate-600 mt-3">{{ f.notes }}</p>
              <ul v-if="f.hours" class="text-xs text-slate-500 mt-2 space-y-0.5">
                <li v-for="h in f.hours" :key="h">{{ h }}</li>
              </ul>
              <div class="flex flex-wrap gap-4 mt-3 text-sm">
                <a v-if="f.phone" :href="`tel:${f.phone}`" class="text-emerald-700 hover:text-emerald-800 font-medium">📞 {{ f.phone }}</a>
                <a v-if="f.email" :href="`mailto:${f.email}`" class="text-emerald-700 hover:text-emerald-800 font-medium">✉️ {{ f.email }}</a>
                <a v-if="f.website" :href="f.website" target="_blank" rel="noopener" class="text-emerald-700 hover:text-emerald-800 font-medium">🌐 Book online ↗</a>
              </div>
            </button>

            <transition name="fade">
              <div v-if="expandedId === f.id && f.address" class="border-t border-slate-100 p-4 sm:p-5 bg-slate-50">
                <div class="flex items-center justify-between mb-3">
                  <p class="text-xs font-semibold text-slate-500 uppercase tracking-wide">Directions ({{ TRAVEL_MODES.find(m => m.key === mode)?.label }})</p>
                  <a :href="googleDirectionsLink(f.address, mode)" target="_blank" rel="noopener" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    Open in Google Maps ↗
                  </a>
                </div>
                <iframe
                  :src="googleDirectionsUrl(f.address, mode)"
                  class="w-full h-72 rounded-xl border border-slate-200"
                  loading="lazy"
                ></iframe>
                <a
                  v-if="mode === 'uber'"
                  :href="uberDeepLink(f.address, f.lat, f.lng)"
                  target="_blank"
                  rel="noopener"
                  class="btn-primary w-full mt-3 justify-center"
                >
                  Request Uber to {{ f.name }}
                </a>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Home Doctor -->
      <div>
        <p class="form-section-title mb-3">After-Hours Home Doctor</p>
        <div v-for="f in homeDoctors" :key="f.id" class="card-elevated p-5 sm:p-6">
          <div class="flex items-center gap-2 flex-wrap mb-1.5">
            <h3 class="font-bold text-slate-900">{{ f.name }}</h3>
            <span :class="categoryBadgeClass(f.category)">{{ categoryLabel(f.category) }}</span>
          </div>
          <p v-if="f.notes" class="text-sm text-slate-600 mt-2">{{ f.notes }}</p>
          <div class="flex flex-wrap gap-4 mt-3 text-sm">
            <a v-if="f.phone" :href="`tel:${f.phone}`" class="text-emerald-700 hover:text-emerald-800 font-medium">📞 {{ f.phone }}</a>
            <a v-if="f.website" :href="f.website" target="_blank" rel="noopener" class="text-emerald-700 hover:text-emerald-800 font-medium">🌐 Website ↗</a>
          </div>
        </div>
      </div>

      <!-- Cost note -->
      <div class="card p-5 sm:p-6">
        <p class="text-sm text-slate-600">
          <strong>Note:</strong> there aren't many bulk-billing GPs left around Spring Hill. Most clinics charge roughly
          $80–$100 up front, then Medicare rebates part of it back into your account within a day or two.
        </p>
      </div>
    </div>
  </div>
</template>
