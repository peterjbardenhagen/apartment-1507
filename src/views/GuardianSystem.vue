<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="bg-slate-900 text-white p-8 shadow-lg">
      <div class="max-w-6xl mx-auto">
        <button @click="router.push('/admin/dashboard')" class="mb-4 text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Admin
        </button>
        <h1 class="text-3xl font-bold">🏢 Apartment Guardian System</h1>
        <p class="text-slate-300 mt-2">Home monitoring and security protocols for Apartment 1507</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-8 space-y-6">
      <!-- Security & Access -->
      <div class="bg-white rounded-lg shadow p-8">
        <div class="flex gap-4 mb-6 pb-6 border-b">
          <div class="text-4xl">🛡️</div>
          <div>
            <h2 class="text-2xl font-bold">Security & Access</h2>
            <p class="text-slate-600">Monitoring systems and entry protocols</p>
          </div>
        </div>

        <h3 class="font-bold text-lg mb-3">Access Control</h3>
        <ul class="space-y-2 mb-6 text-slate-700">
          <li>🔑 Building fob required for entry (Level 15)</li>
          <li>🔐 Apartment door code: residents only</li>
          <li>📱 Doorbell camera active (DoorBird)</li>
          <li>📋 Guest sign-in via building concierge</li>
        </ul>

        <div class="bg-amber-50 border-l-4 border-amber-500 p-4">
          <strong class="block text-amber-800 mb-2">👥 Visitor Policy</strong>
          <p class="text-amber-700">Give 24 hours notice for overnight guests. Maximum 3 nights per month. Register at concierge.</p>
        </div>
      </div>

      <!-- Sensor Network -->
      <div class="bg-white rounded-lg shadow p-8">
        <div class="flex gap-4 mb-6 pb-6 border-b">
          <div class="text-4xl">📡</div>
          <div>
            <h2 class="text-2xl font-bold">Sensor Network</h2>
            <p class="text-slate-600">Automated monitoring system</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div class="bg-slate-50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">🚪</div>
            <strong class="block">Door Sensors</strong>
            <p class="text-sm text-slate-600">Front door, balcony door</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">💧</div>
            <strong class="block">Leak Detection</strong>
            <p class="text-sm text-slate-600">Bathroom, kitchen, balcony</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">🌡️</div>
            <strong class="block">Temperature</strong>
            <p class="text-sm text-slate-600">Living areas</p>
          </div>
          <div class="bg-slate-50 rounded-lg p-4 text-center">
            <div class="text-4xl mb-2">💨</div>
            <strong class="block">Air Quality</strong>
            <p class="text-sm text-slate-600">CO₂, humidity</p>
          </div>
        </div>

        <div class="bg-red-50 border-l-4 border-red-500 p-4">
          <strong class="block text-red-800 mb-2">🚨 Critical Alert Thresholds</strong>
          <p class="text-red-700 text-sm">
            Water leak detected → SMS all residents within 60 seconds<br>
            Door open > 30 minutes → Notify primary tenant<br>
            CO₂ > 1000ppm → Ventilation alert
          </p>
        </div>
      </div>

      <!-- System Status -->
      <div class="bg-white rounded-lg shadow p-8">
        <div class="flex gap-4 mb-6 pb-6 border-b">
          <div class="text-4xl">📊</div>
          <div>
            <h2 class="text-2xl font-bold">System Status</h2>
            <p class="text-slate-600">Current monitoring states</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-100">
              <tr>
                <th class="text-left p-3 font-bold">Sensor</th>
                <th class="text-left p-3 font-bold">Status</th>
                <th class="text-left p-3 font-bold">Last Check</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b">
                <td class="p-3">Front Door</td>
                <td class="p-3 text-green-600 font-semibold">🟢 ARMED</td>
                <td class="p-3 text-slate-600">Just now</td>
              </tr>
              <tr class="border-b">
                <td class="p-3">Balcony Door</td>
                <td class="p-3 text-green-600 font-semibold">🟢 ARMED</td>
                <td class="p-3 text-slate-600">Just now</td>
              </tr>
              <tr>
                <td class="p-3">Water Sensors</td>
                <td class="p-3 text-green-600 font-semibold">🟢 DRY</td>
                <td class="p-3 text-slate-600">Just now</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
