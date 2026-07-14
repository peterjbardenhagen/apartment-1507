<script setup lang="ts">
import { ref } from 'vue'

const standardRate = ref(450)
const guestThreshold = ref(2)
const currency = ref('AUD')
</script>

<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-slate-900">Settings</h1>
      <p class="text-slate-500 mt-2">Configure apartment rates, thresholds, and preferences</p>
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Apartment Settings Card -->
      <div class="card-elevated p-8 border-l-4 border-l-emerald-500">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
            🏢
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900">Apartment Settings</h2>
            <p class="text-sm text-slate-500">Standard rates and configurations</p>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Standard Weekly Rate -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Standard Weekly Rate</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">$</span>
              <input
                v-model="standardRate"
                type="number"
                class="input pl-10 text-lg font-semibold"
                placeholder="0"
              >
            </div>
            <p class="text-xs text-slate-500 mt-2">Default weekly rent rate for tenants</p>
          </div>

          <!-- Currency Selection -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Currency</label>
            <select v-model="currency" class="input">
              <option>AUD</option>
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <p class="text-xs text-slate-500 mt-2">Currency used in all financial reports</p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button class="btn-primary inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>

      <!-- Guest Settings Card -->
      <div class="card-elevated p-8 border-l-4 border-l-blue-500">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center text-xl">
            👥
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-900">Guest Policy</h2>
            <p class="text-sm text-slate-500">Guest night thresholds and charges</p>
          </div>
        </div>

        <div class="space-y-6">
          <!-- Free Guest Nights -->
          <div>
            <label class="block text-sm font-semibold text-slate-700 mb-2">Free Guest Nights per Week</label>
            <input
              v-model="guestThreshold"
              type="number"
              class="input text-lg font-semibold"
              placeholder="0"
              min="0"
            >
            <p class="text-xs text-slate-500 mt-2">Guests beyond this limit incur charges</p>
          </div>

          <!-- Info Box -->
          <div class="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <p class="text-sm text-blue-700 flex items-start gap-2">
              <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
              </svg>
              <span><strong>Example:</strong> If set to 2, each tenant can have 2 free guest nights per week. Additional guests are charged at the standard rate.</span>
            </p>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-100 flex justify-end">
          <button class="btn-primary inline-flex items-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            Save Changes
          </button>
        </div>
      </div>
    </div>

    <!-- Advanced Settings -->
    <div class="card-elevated p-8 border-l-4 border-l-purple-500">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 flex items-center justify-center text-xl">
          ⚙️
        </div>
        <div>
          <h2 class="text-lg font-bold text-slate-900">Advanced Settings</h2>
          <p class="text-sm text-slate-500">Additional configuration options</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-sm font-semibold text-slate-900 mb-1">Property Address</p>
          <p class="text-sm text-slate-600">1507/477 Boundary St, Spring Hill QLD 4000</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <p class="text-sm font-semibold text-slate-900 mb-1">Data Export</p>
          <button class="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1">
            Export all data as CSV
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
