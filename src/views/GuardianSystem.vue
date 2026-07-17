<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Guardian System</h1>
      <p class="text-sm text-slate-500 mt-1.5">Home monitoring and security protocols for Apartment 1507.</p>
    </div>

    <div class="space-y-6">
      <div class="card p-6">
        <div class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div class="text-3xl">🛡️</div>
          <div>
            <h2 class="text-xl font-bold text-slate-900">Security & Access</h2>
            <p class="text-slate-500 text-sm">Monitoring systems and entry protocols</p>
          </div>
        </div>

        <h3 class="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Access Control</h3>
        <ul class="space-y-3 mb-6 text-slate-700">
          <li class="flex items-center gap-3">
            <span class="w-2 h-2 bg-slate-400 rounded-full shrink-0"></span>
            Building fob required for entry (Level 15)
          </li>
          <li class="flex items-center gap-3">
            <span class="w-2 h-2 bg-slate-400 rounded-full shrink-0"></span>
            Apartment door code: residents only
          </li>
          <li class="flex items-center gap-3">
            <span class="w-2 h-2 bg-slate-400 rounded-full shrink-0"></span>
            Doorbell camera active (DoorBird)
          </li>
          <li class="flex items-center gap-3">
            <span class="w-2 h-2 bg-slate-400 rounded-full shrink-0"></span>
            Guest sign-in via building concierge
          </li>
        </ul>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <strong class="block text-amber-900 mb-1">Visitor Policy</strong>
          <p class="text-amber-700 text-sm">Give 24 hours notice for overnight guests. Maximum 3 nights per month. Register at concierge.</p>
        </div>
      </div>

      <div class="card p-6">
        <div class="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <div class="text-3xl">📡</div>
          <div>
            <h2 class="text-xl font-bold text-slate-900">Sensor Network</h2>
            <p class="text-slate-500 text-sm">Automated monitoring system</p>
          </div>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div v-for="sensor in [
            { icon: '🚪', name: 'Door Sensors', desc: 'Front door, balcony door' },
            { icon: '💧', name: 'Leak Detection', desc: 'Bathroom, kitchen, balcony' },
            { icon: '🌡️', name: 'Temperature', desc: 'Living areas' },
            { icon: '💨', name: 'Air Quality', desc: 'CO₂, humidity' }
          ]" :key="sensor.name" class="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
            <div class="text-2xl mb-2">{{ sensor.icon }}</div>
            <strong class="block text-sm text-slate-900 mb-1">{{ sensor.name }}</strong>
            <p class="text-xs text-slate-500">{{ sensor.desc }}</p>
          </div>
        </div>

        <div class="bg-red-50 border border-red-200 rounded-xl p-4">
          <strong class="block text-red-900 mb-2">Critical Alert Thresholds</strong>
          <p class="text-red-700 text-sm">
            Water leak detected → SMS all residents within 60 seconds<br>
            Door open > 30 minutes → Notify primary tenant<br>
            CO₂ > 1000ppm → Ventilation alert
          </p>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <div class="flex items-center gap-3">
            <div class="text-2xl">📊</div>
            <div>
              <h2 class="text-lg font-bold text-slate-900">System Status</h2>
              <p class="text-slate-500 text-sm">Current monitoring states</p>
            </div>
          </div>
        </div>
        <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50">
            <tr>
              <th class="p-4 text-left text-sm font-semibold text-slate-600">Sensor</th>
              <th class="p-4 text-left text-sm font-semibold text-slate-600">Status</th>
              <th class="p-4 text-left text-sm font-semibold text-slate-600">Last Check</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr class="hover:bg-slate-50 transition">
              <td class="p-4 text-slate-900">Front Door</td>
              <td class="p-4"><span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">ARMED</span></td>
              <td class="p-4 text-slate-500 text-sm">Just now</td>
            </tr>
            <tr class="hover:bg-slate-50 transition">
              <td class="p-4 text-slate-900">Balcony Door</td>
              <td class="p-4"><span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">ARMED</span></td>
              <td class="p-4 text-slate-500 text-sm">Just now</td>
            </tr>
            <tr class="hover:bg-slate-50 transition">
              <td class="p-4 text-slate-900">Water Sensors</td>
              <td class="p-4"><span class="badge bg-emerald-50 text-emerald-700 border border-emerald-200">DRY</span></td>
              <td class="p-4 text-slate-500 text-sm">Just now</td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
  </div>
</template>
