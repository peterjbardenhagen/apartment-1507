<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCurrentRosterTurn, formatRosterRange } from '@/services/cleaningRosterService'

const router = useRouter()

const repairQueueCount = computed(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('repairRequests') || '[]')
    return stored.filter((r: { status: string }) => r.status !== 'closed').length
  } catch {
    return 0
  }
})

const repairQueueLabel = computed(() =>
  repairQueueCount.value === 0 ? '0 requests' : `${repairQueueCount.value} in the queue`
)

const rosterTurn = computed(() => getCurrentRosterTurn())
const rosterLabel = computed(() => {
  const turn = rosterTurn.value
  return `${turn.name} · ${formatRosterRange(turn)}`
})

const primaryActions = [
  {
    title: 'Request Help',
    desc: 'Submit requests and collaborate with your flatmates',
    cta: 'Get started',
    path: '/flatmate/request-help',
    tile: 'bg-emerald-50 text-emerald-600',
    icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z'
  },
  {
    title: 'Track Repairs',
    desc: 'Log maintenance issues and monitor progress',
    cta: 'View repairs',
    path: '/flatmate/repair-requests',
    tile: 'bg-amber-100 text-amber-700',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    title: 'Bills Tracker',
    desc: 'Weekly costs, contributions and Brisbane benchmarks',
    cta: 'View analytics',
    path: '/flatmate/utilities',
    tile: 'bg-teal-100 text-teal-700',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  }
]

const resources = [
  {
    title: 'Flatmate Dashboard',
    desc: 'Your home hub — everything in one place',
    path: '/flatmate/dashboard',
    tile: 'bg-purple-100 text-purple-600',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
  },
  {
    title: 'Cleaning Roster',
    desc: 'Fortnightly schedule and task checklists',
    path: '/kevin-cleaning',
    tile: 'bg-emerald-100 text-emerald-600',
    icon: 'M5 13l4 4L19 7'
  }
]

const manuals = [
  {
    title: 'Apartment Instruction Manual',
    desc: 'House rules, appliances, cleaning products & care guides',
    href: '/instructions.html'
  },
  {
    title: 'Cleaning Roster Guide',
    desc: 'Fortnightly schedule, task checklists & product guide',
    href: '/cleaning-roster.html'
  }
]
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex flex-col">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div class="max-w-5xl mx-auto">
        <div class="bg-white rounded-full shadow-card px-4 sm:px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-pill">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M6 10v11h4V10h4v11h4V10"/>
              </svg>
            </div>
            <span class="font-display font-bold text-slate-900">Apartment 1507</span>
          </div>
          <router-link
            to="/admin/login"
            class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            <span class="hidden sm:inline">Admin Portal</span>
            <span class="sm:hidden">Admin</span>
          </router-link>
        </div>
      </div>
    </header>

    <div class="flex-1">
      <!-- Hero -->
      <section class="px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-10 sm:pb-14">
        <div class="max-w-5xl mx-auto text-center animate-fade-in">
          <span class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-card mb-6">
            <span class="status-dot bg-emerald-400"></span>
            1507/477 Boundary St · Spring Hill QLD 4000
          </span>
          <h1 class="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.05]">
            Your shared home,<br />
            <span class="text-emerald-700">beautifully organised.</span>
          </h1>
          <p class="mt-5 text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
            Requests, repairs, utilities and rosters for Apartment 1507 — everything in one calm, simple place.
          </p>
          <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button @click="router.push('/flatmate/dashboard')" class="btn-primary w-full sm:w-auto">
              Open Flatmate Portal
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </button>
            <a href="/instructions.html" rel="noopener" class="btn-secondary w-full sm:w-auto">
              Read the House Guide
            </a>
          </div>
        </div>
      </section>

      <!-- Primary actions -->
      <section class="px-4 sm:px-6 lg:px-8 pb-12">
        <div class="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <button
            v-for="action in primaryActions"
            :key="action.path"
            @click="router.push(action.path)"
            class="card-hover p-6 sm:p-7 text-left group"
          >
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105', action.tile]">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" :d="action.icon"/>
              </svg>
            </div>
            <div class="flex items-center gap-2 mb-1.5">
              <h2 class="font-display text-lg font-bold text-slate-900">{{ action.title }}</h2>
              <span
                v-if="action.path === '/flatmate/repair-requests'"
                :class="['badge', repairQueueCount > 0 ? 'badge-warning' : 'badge-success']"
              >
                {{ repairQueueLabel }}
              </span>
            </div>
            <p class="text-sm text-slate-500 mb-4 leading-relaxed">{{ action.desc }}</p>
            <span class="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
              {{ action.cta }}
              <svg class="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </span>
          </button>
        </div>
      </section>

      <!-- Resources + docs -->
      <section class="px-4 sm:px-6 lg:px-8 pb-16">
        <div class="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
          <!-- Resources -->
          <div class="card p-6 sm:p-7">
            <p class="form-section-title mb-4">More resources</p>
            <div class="space-y-2">
              <button
                v-for="r in resources"
                :key="r.path"
                @click="router.push(r.path)"
                class="w-full flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-emerald-50 transition group text-left"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0', r.tile]">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" :d="r.icon"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 text-sm">{{ r.title }}</p>
                    <p class="text-xs text-slate-500 truncate">
                      <span v-if="r.path === '/kevin-cleaning'">{{ rosterLabel }}</span>
                      <span v-else>{{ r.desc }}</span>
                    </p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Documentation -->
          <div class="card p-6 sm:p-7">
            <p class="form-section-title mb-4">Documentation</p>
            <div class="space-y-2">
              <a
                v-for="manual in manuals"
                :key="manual.href"
                :href="manual.href"
                rel="noopener"
                class="w-full flex items-center justify-between gap-4 p-3.5 rounded-2xl hover:bg-emerald-50 transition group"
              >
                <div class="flex items-center gap-4 min-w-0">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="font-semibold text-slate-900 text-sm">{{ manual.title }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ manual.desc }}</p>
                  </div>
                </div>
                <svg class="w-4 h-4 text-slate-300 group-hover:text-emerald-600 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Footer -->
    <footer class="border-t border-emerald-100 bg-white/60 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-sm text-slate-500">
          <span class="font-semibold text-slate-700">Apartment 1507</span> · Spring Hill, Brisbane
        </p>
        <router-link to="/admin/login" class="text-sm font-medium text-slate-500 hover:text-emerald-700 transition">
          Admin Portal →
        </router-link>
      </div>
    </footer>
  </div>
</template>
