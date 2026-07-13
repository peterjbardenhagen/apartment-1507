<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <div class="bg-slate-900 text-white p-6 shadow-lg">
      <div class="max-w-6xl mx-auto">
        <button @click="router.push('/admin/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2 text-sm">
          Back to Admin
        </button>
        <h1 class="text-2xl font-bold">Apartment Guardian System</h1>
        <p class="text-slate-400 mt-1 text-sm">Home monitoring and security protocols for Apartment 1507</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <div class="flex gap-4 mb-6 pb-6 border-b border-slate-100">
          <div class="text-3xl">🛡️</div>
          <div>
            <h2 class="text-xl font-bold text-slate-800">Security & Access</h2>
            <p class="text-slate-500 text-sm">Monitoring systems and entry protocols</p>
          </div>
        </div>

        <h3 class="font-bold text-slate-800 mb-3">Access Control</h3>
        <ul class="space-y-2 mb-6 text-slate-700">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            Building fob required for entry (Level 15)
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            Apartment door code: residents only
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            Doorbell camera active (DoorBird)
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
            Guest sign-in via building concierge
          </li>
        </ul>

        <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <strong class="block text-amber-800 mb-1">Visitor Policy</strong>
          <p class="text-amber-700 text-sm">Give 24 hours notice for overnight guests. Maximum 3 nights per month. Register at concierge.</p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <div class="flex gap-4 mb-6 pb-6 border-b border-slate-100">
          <div class="text-3xl">📡</div>
          <div>
            <h2 class="text-xl font-bold text-slate-800">Sensor Network</h2>
            <p class="text-slate-500 text-sm">Automated monitoring system</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div class="text-2xl mb-2">🚪</div>
            <strong class="block text-sm text-slate-800">Door Sensors</strong>
            <p class="text-xs text-slate-500 mt-1">Front door, balcony door</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div class="text-2xl mb-2">💧</div>
            <strong class="block text-sm text-slate-800">Leak Detection</strong>
            <p class="text-xs text-slate-500 mt-1">Bathroom, kitchen, balcony</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div class="text-2xl mb-2">🌡️</div>
            <strong class="block text-sm text-slate-800">Temperature</strong>
            <p class="text-xs text-slate-500 mt-1">Living areas</p>
          </div>
          <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
            <div class="text-2xl mb-2">💨</div>
            <strong class="block text-sm text-slate-800">Air Quality</strong>
            <p class="text-xs text-slate-500 mt-1">CO₂, humidity</p>
          </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <strong class="block text-red-800 mb-1">Critical Alert Thresholds</strong>
          <p class="text-red-700 text-sm">
            Water leak detected → SMS all residents within 60 seconds<br>
            Door open > 30 minutes → Notify primary tenant<br>
            CO₂ > 1000ppm → Ventilation alert
          </p>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <div class="flex gap-4 mb-6 pb-6 border-b border-slate-100">
          <div class="text-3xl">📊</div>
          <div>
            <h2 class="text-xl font-bold text-slate-800">System Status</h2>
            <p class="text-slate-500 text-sm">Current monitoring states</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="text-left p-3 font-semibold text-slate-600">Sensor</th>
                <th class="text-left p-3 font-semibold text-slate-600">Status</th>
                <th class="text-left p-3 font-semibold text-slate-600">Last Check</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Front Door</td>
                <td class="p-3 text-emerald-600 font-semibold">ARMED</td>
                <td class="p-3 text-slate-500">Just now</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Balcony Door</td>
                <td class="p-3 text-emerald-600 font-semibold">ARMED</td>
                <td class="p-3 text-slate-500">Just now</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-800">Water Sensors</td>
                <td class="p-3 text-emerald-600 font-semibold">DRY</td>
                <td class="p-3 text-slate-500">Just now</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
