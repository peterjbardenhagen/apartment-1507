<script setup lang="ts">
// Kevin's Cleaning - No password protection required
// Only accessible to logged-in flatmates
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">🧹 Kevin's Cleaning Area</h1>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-2">Weekly Tasks</h2>
      <ul class="list-disc pl-5 space-y-1 text-slate-700">
        <li>Vacuum common areas</li>
        <li>Clean kitchen surfaces</li>
        <li>Wipe bathroom fixtures</li>
        <li>Take out trash/recycling</li>
      </ul>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <h2 class="text-lg font-bold mb-2">Boarding Agreement - Clause G</h2>
      <p class="text-sm text-slate-600">
        Cleanliness & Care requirements apply. 
        Guests/Visitors policy documented in agreement.
      </p>
    </div>
    
    <button @click="$router.push('/flatmate')" class="text-sm text-blue-600 hover:underline">
      ← Back to Flatmate Portal
    </button>
  </div>
</template>