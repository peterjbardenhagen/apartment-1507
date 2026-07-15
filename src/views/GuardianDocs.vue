<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Guardian Documentation</h1>
      <p class="text-sm text-slate-500 mt-1.5">Comprehensive guides and operational protocols.</p>
    </div>

    <div class="space-y-6">
      <div class="card p-6">
        <h2 class="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Reference Manuals</h2>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a href="/apartment-guardian-system.html" rel="noopener" class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition group">
            <span class="text-xl">🛡️</span>
            <span class="text-sm font-medium text-slate-700 group-hover:text-blue-700">Guardian System</span>
          </a>
          <a href="/cleaning-issues.html" rel="noopener" class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50 transition group">
            <span class="text-xl">🧽</span>
            <span class="text-sm font-medium text-slate-700 group-hover:text-orange-700">Cleaning Issues</span>
          </a>
          <router-link to="/admin/utilities-evidence" class="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition group">
            <span class="text-xl">📊</span>
            <span class="text-sm font-medium text-slate-700 group-hover:text-purple-700">Utilities Evidence</span>
          </router-link>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-bold text-slate-900 mb-3">Apartment 1507 Guardian System</h2>
        <p class="text-slate-700">
          Home Master Orchestrator: Security + AI Monitoring + Utility Accounting + Guest Night Billing
        </p>
      </div>

      <div class="card bg-blue-50 border-blue-200 p-6">
        <h2 class="text-xl font-bold text-blue-900 mb-4">Current System Issue</h2>
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="text-blue-900">Energy/Week:</span>
            <span class="font-bold">~$250 (normal: $200) <span class="text-red-600">+$50</span></span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-blue-900">Guest Nights/Month:</span>
            <span class="font-bold">~28 (contract: 4) <span class="text-red-600">24 excess</span></span>
          </div>
          <div class="flex justify-between items-center border-t border-blue-200 pt-3">
            <span class="text-blue-900 font-bold">Estimated Surcharge:</span>
            <span class="font-bold text-red-600">$400+ unpaid</span>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-200">
          <h2 class="text-lg font-bold text-slate-900">Hardware Requirements</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead class="bg-slate-50">
              <tr>
                <th class="text-left p-3 font-semibold text-slate-600">Area</th>
                <th class="text-left p-3 font-semibold text-slate-600">Device</th>
                <th class="text-left p-3 font-semibold text-slate-600">Purpose</th>
                <th class="text-left p-3 font-semibold text-slate-600">Cost</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="row in [
                { area: 'Front Door', device: 'Wired EZVIZ Doorbell Camera', purpose: 'Arrival/departure detection', cost: '$150' },
                { area: 'Lounge', device: 'Aqara FP2 mmWave', purpose: 'Occupancy detection (no camera)', cost: '$100' },
                { area: 'Bedrooms', device: 'HLK-LD2410B + ESPHome', purpose: 'Presence without video', cost: '$40 each' },
                { area: 'Master Bedroom', device: 'Zigbee Contact Sensor', purpose: 'Door access alerts', cost: '$25' },
                { area: 'Common Areas', device: 'ESP32 Sound Sensor', purpose: 'Noise threshold alerts', cost: '$35' },
                { area: 'Hub', device: 'Home Assistant Green', purpose: 'Automation engine', cost: '$130' }
              ]" :key="row.area" class="hover:bg-slate-50 transition">
                <td class="p-3 text-slate-900 font-medium">{{ row.area }}</td>
                <td class="p-3 text-slate-700">{{ row.device }}</td>
                <td class="p-3 text-slate-500">{{ row.purpose }}</td>
                <td class="p-3 text-slate-900 font-medium">{{ row.cost }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="card bg-amber-50 border-amber-200 p-6">
        <h2 class="text-xl font-bold text-amber-900 mb-5">Flatmate Billing Rules</h2>
        <div class="space-y-3 text-amber-900">
          <div>
            <strong class="block mb-2">Clause G - Guests & Overnight Stays</strong>
            <ol class="list-decimal list-inside space-y-2 ml-2 text-sm">
              <li>Included stays: 1-2 nights per week (4-8 nights per calendar month)</li>
              <li>Excess nights: $20 per night toward utilities, hot water, electricity, consumables</li>
              <li>Unsupervised guests: Additional $100 per day (requires Public Liability insurance)</li>
              <li>Unapproved extended stays: Treated as additional occupancy at market rate ($200+/week)</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Energy Investigation Plan</h2>
        <ol class="list-decimal list-inside space-y-3 text-slate-700">
          <li><strong>Baseline Measurement:</strong> 3 days with Kevin alone</li>
          <li><strong>Compare:</strong> 3 days with full occupancy</li>
          <li><strong>Isolate:</strong> Smart plugs on high-draw appliances (AC, heater, dryer)</li>
          <li><strong>Correlate:</strong> Guest nights vs. kWh using HA history</li>
          <li><strong>Evidence:</strong> Generate CSV + chart for legal/contractual reference</li>
        </ol>
      </div>

      <div class="card p-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Implementation Priority</h2>
        <div class="space-y-3">
          <div v-for="item in [
            { status: '✅', text: 'Install EZVIZ doorbell (currently installed)' },
            { status: '⬜', text: 'Add Aqara FP2 for occupancy' },
            { status: '⬜', text: 'Configure guest night ledger' },
            { status: '⬜', text: 'Set up noise sensors' },
            { status: '⬜', text: 'Deploy Shelby AI voice interface' },
            { status: '⬜', text: 'Generate first automated statement' }
          ]" :key="item.text" class="flex items-center gap-3">
            <span class="text-xl">{{ item.status }}</span>
            <span class="text-slate-700">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
