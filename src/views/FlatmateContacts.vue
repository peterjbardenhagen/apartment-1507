<script setup lang="ts">
import { useRouter } from 'vue-router'
import ContactsPanel from '@/components/ContactsPanel.vue'

const router = useRouter()
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
      <div class="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </div>
      <h1 class="font-display text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">Contacts</h1>
      <p class="mt-2 text-slate-500 max-w-xl">Everyone's contact details in one place.</p>
    </div>

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <ContactsPanel />
    </div>
  </div>
</template>
