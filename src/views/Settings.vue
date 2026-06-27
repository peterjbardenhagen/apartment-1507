<script setup lang="ts">
import { ref } from 'vue'

const standardRate = ref(450)
const guestThreshold = ref(2)
const currency = ref('AUD')
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold">Settings</h1>
    
    <div class="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 class="text-lg font-bold">Apartment 1507 Standard Settings</h2>
      
      <div>
        <label class="block text-sm font-medium mb-1">Standard Weekly Rate</label>
        <input v-model="standardRate" type="number" class="border rounded px-3 py-2">
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Free Guest Nights (bonus)</label>
        <input v-model="guestThreshold" type="number" class="border rounded px-3 py-2">
        <p class="text-xs text-slate-500">Guests beyond this number each week incur charges</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-1">Currency</label>
        <select v-model="currency" class="border rounded px-3 py-2">
          <option>AUD</option>
          <option>USD</option>
          <option>EUR</option>
        </select>
      </div>
    </div>
    
    <button class="bg-green-600 text-white px-4 py-2 rounded">Save Settings</button>
  </div>
</template>