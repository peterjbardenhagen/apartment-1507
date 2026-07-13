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
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <div class="flex-1">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div class="text-center mb-12 animate-fade-in">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
            <span class="text-3xl">🏢</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Apartment 1507
          </h1>
          <p class="text-lg text-slate-500 max-w-md mx-auto">
            Your home, simplified. Submit requests, track repairs, and find every guide in one place.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          <button @click="router.push('/flatmate/request-help')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🆘
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Request Help</h2>
                <p class="text-sm text-slate-500">Submit requests to flatmates</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/flatmate/repair-requests')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔧
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Repairs</h2>
                <p class="text-sm text-slate-500">Track maintenance issues</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/kevin-cleaning')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧹
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Cleaning</h2>
                <p class="text-sm text-slate-500">View weekly roster</p>
              </div>
            </div>
          </button>
        </div>

        <div class="animate-fade-in">
          <h2 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4 text-center">Guides & Manuals</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              v-for="manual in manuals"
              :key="manual.href"
              :href="manual.href"
              target="_blank"
              rel="noopener"
              class="card-hover p-5 flex items-center gap-4 group"
            >
              <div class="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                {{ manual.icon }}
              </div>
              <div class="min-w-0">
                <h3 class="font-semibold text-slate-900 truncate">{{ manual.title }}</h3>
                <p class="text-sm text-slate-500 truncate">{{ manual.desc }}</p>
              </div>
              <svg class="w-4 h-4 text-slate-400 ml-auto shrink-0 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <footer class="py-6 text-center border-t border-slate-200">
      <router-link to="/admin/login" class="text-xs text-slate-400 hover:text-slate-600 transition">
        Admin
      </router-link>
    </footer>
  </div>
</template>
