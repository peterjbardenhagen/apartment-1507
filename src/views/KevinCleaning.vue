<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const tasks = [
  'Vacuum common areas',
  'Clean kitchen surfaces',
  'Wipe bathroom fixtures',
  'Take out trash/recycling'
]
</script>

<template>
  <div class="min-h-screen bg-emerald-50">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-full shadow-card px-4 sm:px-6 py-3 flex items-center justify-between">
          <button @click="router.push('/flatmate/dashboard')" class="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
            Flatmate Portal
          </button>
          <a href="/cleaning-roster.html" rel="noopener" class="btn-primary text-xs px-4 py-2">
            Full roster ↗
          </a>
        </div>
      </div>
    </header>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <!-- Heading -->
      <div class="mb-8 animate-fade-in">
        <span class="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-semibold text-emerald-700 shadow-card mb-5">
          <span class="status-dot bg-emerald-400"></span>
          Fortnightly rotation
        </span>
        <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Cleaning Roster</h1>
        <p class="mt-2 text-slate-500 max-w-xl">Weekly cleaning schedule and responsibilities for Apartment 1507.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5">
        <!-- Tasks -->
        <div class="card p-6 sm:p-7 lg:col-span-3">
          <p class="form-section-title mb-5">This week's tasks</p>
          <ul class="space-y-2.5">
            <li
              v-for="task in tasks"
              :key="task"
              class="flex items-center gap-3.5 p-3.5 rounded-2xl bg-emerald-50"
            >
              <span class="w-6 h-6 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
              </span>
              <span class="text-sm font-medium text-slate-800">{{ task }}</span>
            </li>
          </ul>
          <p class="mt-5 text-xs text-slate-500">
            Complete tasks by Sunday evening to keep the apartment clean and welcoming.
          </p>
        </div>

        <!-- Agreement -->
        <div class="card p-6 sm:p-7 lg:col-span-2">
          <div class="w-11 h-11 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
          </div>
          <h2 class="font-display font-bold text-slate-900 mb-2">Boarding Agreement — Clause G</h2>
          <p class="text-sm text-slate-500 leading-relaxed mb-4">
            Cleanliness &amp; care requirements apply to all residents:
          </p>
          <ul class="space-y-2 text-sm text-slate-600 mb-5">
            <li class="flex gap-2"><span class="text-emerald-600">•</span> Keep common areas clean and hygienic</li>
            <li class="flex gap-2"><span class="text-emerald-600">•</span> Respect the weekly cleaning schedule</li>
            <li class="flex gap-2"><span class="text-emerald-600">•</span> Follow the guests &amp; visitors policy</li>
          </ul>
          <a
            href="/cleaning-roster.html"
            rel="noopener"
            class="text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition"
          >
            View full roster &amp; agreement ↗
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
