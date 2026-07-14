<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Hero Section -->
    <div class="max-w-5xl mx-auto mb-12 animate-fade-in">
      <div class="text-center mb-10">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 mb-6 shadow-lg">
          <span class="text-4xl">👥</span>
        </div>
        <h1 class="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-4">
          Flatmate Portal
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Collaborate with your flatmates, track household tasks, and stay organized
        </p>
      </div>

      <!-- Feature Pills -->
      <div class="flex flex-wrap justify-center gap-3">
        <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
          <span class="text-lg">📊</span>
          <span class="text-sm font-medium text-slate-700">Cost Tracking</span>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
          <span class="text-lg">🔧</span>
          <span class="text-sm font-medium text-slate-700">Maintenance</span>
        </div>
        <div class="flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm border border-slate-200">
          <span class="text-lg">💬</span>
          <span class="text-sm font-medium text-slate-700">Communication</span>
        </div>
      </div>
    </div>

    <!-- Primary Actions Grid -->
    <div class="max-w-5xl mx-auto mb-12">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Utilities Tracker -->
        <button
          @click="router.push('/flatmate/utilities')"
          class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
            💡
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Utilities Tracker</h2>
          <p class="text-slate-600 mb-4">Weekly & monthly cost analytics</p>
          <div class="inline-flex items-center gap-1 text-emerald-600 font-semibold text-sm">
            View costs <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <!-- Request Help -->
        <button
          @click="router.push('/flatmate/request-help')"
          class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
            🆘
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Request Help</h2>
          <p class="text-slate-600 mb-4">Submit requests to your flatmates</p>
          <div class="inline-flex items-center gap-1 text-blue-600 font-semibold text-sm">
            Send request <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <!-- Repair Requests -->
        <button
          @click="router.push('/flatmate/repair-requests')"
          class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
            🔧
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Repair Requests</h2>
          <p class="text-slate-600 mb-4">Track apartment maintenance</p>
          <div class="inline-flex items-center gap-1 text-orange-600 font-semibold text-sm">
            Report issue <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>

        <!-- Cleaning Roster -->
        <button
          @click="router.push('/kevin-cleaning')"
          class="card-elevated p-8 text-left group hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
            🧹
          </div>
          <h2 class="text-xl font-bold text-slate-900 mb-2">Cleaning Roster</h2>
          <p class="text-slate-600 mb-4">View weekly cleaning tasks</p>
          <div class="inline-flex items-center gap-1 text-purple-600 font-semibold text-sm">
            View schedule <svg class="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Footer Section -->
    <div class="max-w-5xl mx-auto">
      <div class="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p class="font-semibold text-slate-900">Apartment 1507</p>
            <p class="text-sm text-slate-500">Spring Hill, Brisbane QLD 4000</p>
          </div>
          <button
            @click="router.push('/')"
            class="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition self-start sm:self-auto"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
