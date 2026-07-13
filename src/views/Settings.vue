<script setup lang="ts">
import { ref } from 'vue'

const standardRate = ref(450)
const guestThreshold = ref(2)
const currency = ref('AUD')
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Settings</h1>

    <div class="bg-white border border-slate-200 rounded-xl p-6 max-w-lg">
      <h2 class="text-lg font-bold text-slate-800 mb-5">Apartment 1507 Standard Settings</h2>

      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Standard Weekly Rate</label>
          <input v-model="standardRate" type="number" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Free Guest Nights (bonus)</label>
          <input v-model="guestThreshold" type="number" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
          <p class="text-xs text-slate-500 mt-1">Guests beyond this number each week incur charges</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
          <select v-model="currency" class="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition">
            <option>AUD</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
    </div>

    <button class="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">Save Settings</button>
  </div>
</template>
