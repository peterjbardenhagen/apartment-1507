<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const manuals = [
  {
    title: 'Apartment Instruction Manual',
    desc: 'House rules, appliances, cleaning products & care guides',
    href: '/instructions.html',
    icon: '📘'
  },
  {
    title: 'Cleaning Roster',
    desc: 'Fortnightly schedule, task checklists & product guide',
    href: '/cleaning-roster.html',
    icon: '🧹'
  }
]

const features = [
  { icon: '💬', label: 'Easy Communication' },
  { icon: '🔧', label: 'Maintenance Tracking' },
  { icon: '📊', label: 'Shared Analytics' },
  { icon: '🤝', label: 'Collaborative Tools' }
]
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-slate-50 to-emerald-50">
    <div class="flex-1">
      <!-- Hero Section -->
      <div class="relative overflow-hidden pt-12 sm:pt-20">
        <div class="absolute inset-0 opacity-5">
          <div class="absolute top-20 right-1/3 w-72 h-72 bg-emerald-500 rounded-full filter blur-3xl"></div>
          <div class="absolute bottom-20 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        </div>

        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <!-- Main Hero -->
          <div class="text-center mb-16 animate-fade-in">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 mb-8 shadow-lg">
              <span class="text-4xl">🏢</span>
            </div>
            <h1 class="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Apartment 1507
            </h1>
            <p class="text-xl text-slate-600 max-w-2xl mx-auto mb-2">
              Your shared home, perfectly organized
            </p>
            <p class="text-slate-500">477 Boundary St, Spring Hill QLD 4000</p>
          </div>

          <!-- Feature Pills -->
          <div class="flex flex-wrap justify-center gap-3 mb-16">
            <div v-for="feature in features" :key="feature.label" class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
              <span class="text-lg">{{ feature.icon }}</span>
              <span class="text-sm font-medium text-slate-700">{{ feature.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Primary Actions -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <button
            @click="router.push('/flatmate/request-help')"
            class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              🆘
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Request Help</h2>
            <p class="text-slate-600 mb-4">Submit requests and collaborate with your flatmates</p>
            <div class="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
              Get started <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>

          <button
            @click="router.push('/flatmate/repair-requests')"
            class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              🔧
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Track Repairs</h2>
            <p class="text-slate-600 mb-4">Log maintenance issues and monitor progress</p>
            <div class="inline-flex items-center gap-1 text-orange-600 font-semibold text-sm">
              View repairs <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>

          <button
            @click="router.push('/flatmate/utilities')"
            class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
          >
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
              💡
            </div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Utilities Tracker</h2>
            <p class="text-slate-600 mb-4">View weekly costs and compare to benchmarks</p>
            <div class="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
              Analytics <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </button>
        </div>
      </div>

      <!-- Additional Actions -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div class="mb-8">
          <h3 class="text-lg font-bold text-slate-900 mb-5">More Resources</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              @click="router.push('/flatmate/dashboard')"
              class="card-hover p-6 flex items-center justify-between group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  📱
                </div>
                <div class="text-left">
                  <h4 class="font-semibold text-slate-900">Dashboard</h4>
                  <p class="text-sm text-slate-500">Your home hub</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>

            <button
              @click="router.push('/kevin-cleaning')"
              class="card-hover p-6 flex items-center justify-between group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  🧹
                </div>
                <div class="text-left">
                  <h4 class="font-semibold text-slate-900">Cleaning Roster</h4>
                  <p class="text-sm text-slate-500">Weekly schedule</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Documentation -->
        <div>
          <h3 class="text-lg font-bold text-slate-900 mb-5">Documentation</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              v-for="manual in manuals"
              :key="manual.href"
              :href="manual.href"
              target="_blank"
              rel="noopener"
              class="card-hover p-6 flex items-center justify-between group"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                  {{ manual.icon }}
                </div>
                <div class="text-left">
                  <h4 class="font-semibold text-slate-900">{{ manual.title }}</h4>
                  <p class="text-sm text-slate-500">{{ manual.desc }}</p>
                </div>
              </div>
              <svg class="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="py-8 border-t border-slate-200 bg-white/50 backdrop-blur-sm">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-center sm:text-left">
            <p class="font-semibold text-slate-900">Apartment 1507</p>
            <p class="text-sm text-slate-500">Spring Hill, Brisbane QLD 4000</p>
          </div>
          <router-link
            to="/admin/login"
            class="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
            Admin Portal
          </router-link>
        </div>
      </div>
    </footer>
  </div>
</template>
