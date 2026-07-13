<script setup lang="ts">
import { ref } from 'vue'

const standardRate = ref(450)
const guestThreshold = ref(2)
const currency = ref('AUD')
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Settings</h1>
      <p class="text-sm text-slate-500 mt-1">Configure apartment rates and thresholds.</p>
    </div>

    <div class="card max-w-lg">
      <div class="p-6 border-b border-slate-200">
        <h2 class="text-base font-bold text-slate-900">Apartment 1507 Standard Settings</h2>
      </div>
      <div class="p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Standard Weekly Rate</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">$</span>
            <input v-model="standardRate" type="number" class="input pl-8">
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Free Guest Nights</label>
          <input v-model="guestThreshold" type="number" class="input">
          <p class="text-xs text-slate-500 mt-1.5">Guests beyond this number each week incur charges</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Currency</label>
          <select v-model="currency" class="input">
            <option>AUD</option>
            <option>USD</option>
            <option>EUR</option>
          </select>
        </div>
      </div>
      <div class="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
        <button class="btn-primary">Save Settings</button>
      </div>
    </div>
  </div>
</template>
