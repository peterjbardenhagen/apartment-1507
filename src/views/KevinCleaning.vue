<script setup lang="ts">
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
        🧹
      </div>
      <div>
        <h1 class="text-2xl font-bold text-slate-900">Cleaning Roster</h1>
        <p class="text-sm text-slate-500">Weekly cleaning tasks and responsibilities.</p>
      </div>
    </div>

    <div class="card p-6">
      <h2 class="text-base font-bold text-slate-900 mb-4">Weekly Tasks</h2>
      <ul class="space-y-3">
        <li v-for="task in ['Vacuum common areas', 'Clean kitchen surfaces', 'Wipe bathroom fixtures', 'Take out trash/recycling']" :key="task" class="flex items-center gap-3 text-slate-700">
          <span class="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>
          {{ task }}
        </li>
      </ul>
    </div>

    <div class="card p-6">
      <h2 class="text-base font-bold text-slate-900 mb-2">Boarding Agreement - Clause G</h2>
      <p class="text-sm text-slate-600">
        Cleanliness & Care requirements apply. Guests/Visitors policy documented in agreement.
      </p>
    </div>

    <button @click="$router.push('/flatmate/dashboard')" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
      Back to Flatmate Portal
    </button>
  </div>
</template>
