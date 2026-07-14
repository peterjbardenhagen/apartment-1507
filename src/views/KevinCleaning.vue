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
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-green-50 -mx-4 sm:-mx-6 lg:-mx-8 -my-4 sm:-my-6 lg:-my-8 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
    <!-- Header -->
    <div class="max-w-4xl mx-auto mb-12 animate-fade-in">
      <div class="flex items-center justify-between mb-8">
        <button
          @click="router.push('/flatmate/dashboard')"
          class="text-slate-600 hover:text-slate-900 flex items-center gap-2 font-medium transition"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to Flatmate Portal
        </button>
        <a
          href="/cleaning-roster.html"
          target="_blank"
          rel="noopener"
          class="btn-primary text-sm inline-flex items-center gap-2"
        >
          <span>📋</span>
          Open Full Roster
        </a>
      </div>

      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 mb-6 shadow-lg">
          <span class="text-4xl">🧹</span>
        </div>
        <h1 class="text-5xl sm:text-6xl font-bold text-slate-900 tracking-tight mb-4">
          Cleaning Roster
        </h1>
        <p class="text-xl text-slate-600 max-w-2xl mx-auto">
          Weekly cleaning schedule and responsibilities for Apartment 1507
        </p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-4xl mx-auto mb-8">
      <!-- This Week's Tasks -->
      <div class="card-elevated p-8 mb-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-50 to-green-100 text-green-600 flex items-center justify-center text-2xl">
            ✓
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-900">This Week's Tasks</h2>
            <p class="text-sm text-slate-500 mt-0.5">Your cleaning responsibilities</p>
          </div>
        </div>

        <ul class="space-y-4">
          <li
            v-for="task in tasks"
            :key="task"
            class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition"
          >
            <div class="flex-shrink-0">
              <div class="flex items-center justify-center h-6 w-6 rounded-full bg-green-100">
                <svg class="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <span class="text-slate-700 font-medium">{{ task }}</span>
          </li>
        </ul>

        <div class="mt-6 pt-6 border-t border-slate-100">
          <p class="text-sm text-slate-600 flex items-start gap-2">
            <span class="text-lg mt-0.5">💡</span>
            <span><strong>Tip:</strong> Complete these tasks by Sunday evening to keep our apartment clean and welcoming</span>
          </p>
        </div>
      </div>

      <!-- Boarding Agreement Section -->
      <div class="card-elevated p-8 border-l-4 border-l-blue-500">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-2xl shrink-0">
            📋
          </div>
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">Boarding Agreement — Clause G</h2>
            <p class="text-slate-600 mb-4">
              Cleanliness & Care requirements apply to all residents. This includes:
            </p>
            <ul class="space-y-2 text-sm text-slate-600">
              <li class="flex items-center gap-2">
                <span class="text-blue-600">•</span>
                Maintaining common areas in a clean and hygienic state
              </li>
              <li class="flex items-center gap-2">
                <span class="text-blue-600">•</span>
                Respecting the weekly cleaning schedule
              </li>
              <li class="flex items-center gap-2">
                <span class="text-blue-600">•</span>
                Guests/Visitors policy as documented in the full cleaning roster
              </li>
            </ul>
            <a
              href="/cleaning-roster.html"
              target="_blank"
              rel="noopener"
              class="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition"
            >
              View full cleaning roster & agreement
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
