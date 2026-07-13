<script setup lang="ts">
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Cleaning Roster</h1>

    <div class="bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-4">Weekly Tasks</h2>
      <ul class="space-y-3">
        <li class="flex items-center gap-3 text-slate-700">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Vacuum common areas
        </li>
        <li class="flex items-center gap-3 text-slate-700">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Clean kitchen surfaces
        </li>
        <li class="flex items-center gap-3 text-slate-700">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Wipe bathroom fixtures
        </li>
        <li class="flex items-center gap-3 text-slate-700">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Take out trash/recycling
        </li>
      </ul>
    </div>

    <div class="bg-white border border-slate-200 rounded-xl p-6">
      <h2 class="text-lg font-bold text-slate-800 mb-2">Boarding Agreement - Clause G</h2>
      <p class="text-sm text-slate-600">
        Cleanliness & Care requirements apply. Guests/Visitors policy documented in agreement.
      </p>
    </div>

    <button @click="$router.push('/flatmate/dashboard')" class="text-sm text-blue-600 hover:text-blue-700 font-medium transition">
      Back to Flatmate Portal
    </button>
  </div>
</template>
