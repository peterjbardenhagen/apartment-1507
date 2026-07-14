<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const actions = [
  {
    title: 'Utilities Tracker',
    desc: 'Weekly & monthly cost analytics with Brisbane benchmarks',
    cta: 'View costs',
    path: '/flatmate/utilities',
    tile: 'bg-emerald-50 text-emerald-600',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z'
  },
  {
    title: 'Request Help',
    desc: 'Submit requests and ideas to your flatmates',
    cta: 'Send request',
    path: '/flatmate/request-help',
    tile: 'bg-teal-100 text-teal-700',
    icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
  },
  {
    title: 'Repair Requests',
    desc: 'Log maintenance issues and track their status',
    cta: 'Report issue',
    path: '/flatmate/repair-requests',
    tile: 'bg-amber-100 text-amber-700',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z'
  },
  {
    title: 'Cleaning Roster',
    desc: 'This week’s tasks and the fortnightly rotation',
    cta: 'View schedule',
    path: '/kevin-cleaning',
    tile: 'bg-purple-100 text-purple-600',
    icon: 'M5 13l4 4L19 7'
  }
]
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex flex-col">
    <!-- Top nav -->
    <header class="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6">
      <div class="max-w-5xl mx-auto">
        <div class="bg-white rounded-full shadow-card px-4 sm:px-6 py-3 flex items-center justify-between">
          <router-link to="/" class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-display font-bold text-xs shadow-pill">
              15
            </div>
            <span class="font-display font-bold text-slate-900">Apartment 1507</span>
          </router-link>
          <router-link to="/" class="text-sm font-semibold text-slate-500 hover:text-slate-900 transition">
            ← Home
          </router-link>
        </div>
      </div>
    </header>

    <div class="flex-1 px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div class="max-w-5xl mx-auto">
        <!-- Heading -->
        <div class="mb-8 sm:mb-10 animate-fade-in">
          <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Flatmate Portal
          </h1>
          <p class="mt-2 text-slate-500 max-w-xl">
            Collaborate with your flatmates, track household costs and stay organised.
          </p>
        </div>

        <!-- Action cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          <button
            v-for="a in actions"
            :key="a.path"
            @click="router.push(a.path)"
            class="card-hover p-6 sm:p-7 text-left group"
          >
            <div class="flex items-start justify-between">
              <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform group-hover:scale-105', a.tile]">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" :d="a.icon"/>
                </svg>
              </div>
              <svg class="w-4 h-4 mt-1 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </div>
            <h2 class="font-display text-lg font-bold text-slate-900 mb-1.5">{{ a.title }}</h2>
            <p class="text-sm text-slate-500 leading-relaxed mb-3">{{ a.desc }}</p>
            <span class="text-sm font-semibold text-emerald-700">{{ a.cta }} →</span>
          </button>
        </div>

        <!-- Address footer card -->
        <div class="mt-8 card p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p class="font-semibold text-slate-900 text-sm">Apartment 1507</p>
            <p class="text-sm text-slate-500">477 Boundary St, Spring Hill QLD 4000</p>
          </div>
          <a href="/instructions.html" target="_blank" rel="noopener" class="btn-secondary text-xs px-4 py-2">
            House guide ↗
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
