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
        <h1 class="text-2xl font-bold">Guardian System Documentation</h1>
        <p class="text-slate-400 mt-1 text-sm">Comprehensive guides and operational protocols</p>
      </div>
    </div>

    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-3">Apartment 1507 Guardian System</h2>
        <p class="text-slate-700">
          Home Master Orchestrator: Security + AI Monitoring + Utility Accounting + Guest Night Billing
        </p>
      </div>

      <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h2 class="text-xl font-bold text-blue-900 mb-4">Current System Issue</h2>
        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-blue-900">Energy/Week:</span>
            <span class="font-bold">~$250 (normal: $200) <span class="text-red-600">+$50</span></span>
          </div>
          <div class="flex justify-between">
            <span class="text-blue-900">Guest Nights/Month:</span>
            <span class="font-bold">~28 (contract: 4) <span class="text-red-600">24 excess</span></span>
          </div>
          <div class="flex justify-between border-t border-blue-200 pt-3">
            <span class="text-blue-900 font-bold">Estimated Surcharge:</span>
            <span class="font-bold text-red-600">$400+ unpaid</span>
          </div>
        </div>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-5">Hardware Requirements</h2>
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
            <tbody>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Front Door</td>
                <td class="p-3 text-slate-700">Wired EZVIZ Doorbell Camera</td>
                <td class="p-3 text-slate-500">Arrival/departure detection</td>
                <td class="p-3 text-slate-800 font-medium">$150</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Lounge</td>
                <td class="p-3 text-slate-700">Aqara FP2 mmWave</td>
                <td class="p-3 text-slate-500">Occupancy detection (no camera)</td>
                <td class="p-3 text-slate-800 font-medium">$100</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Bedrooms</td>
                <td class="p-3 text-slate-700">HLK-LD2410B + ESPHome</td>
                <td class="p-3 text-slate-500">Presence without video</td>
                <td class="p-3 text-slate-800 font-medium">$40 each</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Master Bedroom</td>
                <td class="p-3 text-slate-700">Zigbee Contact Sensor</td>
                <td class="p-3 text-slate-500">Door access alerts</td>
                <td class="p-3 text-slate-800 font-medium">$25</td>
              </tr>
              <tr class="border-b border-slate-100">
                <td class="p-3 text-slate-800">Common Areas</td>
                <td class="p-3 text-slate-700">ESP32 Sound Sensor</td>
                <td class="p-3 text-slate-500">Noise threshold alerts</td>
                <td class="p-3 text-slate-800 font-medium">$35</td>
              </tr>
              <tr>
                <td class="p-3 text-slate-800">Hub</td>
                <td class="p-3 text-slate-700">Home Assistant Green</td>
                <td class="p-3 text-slate-500">Automation engine</td>
                <td class="p-3 text-slate-800 font-medium">$130</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-amber-50 border border-amber-200 rounded-xl p-6">
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

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Energy Investigation Plan</h2>
        <ol class="list-decimal list-inside space-y-3 text-slate-700">
          <li><strong>Baseline Measurement:</strong> 3 days with Kevin alone</li>
          <li><strong>Compare:</strong> 3 days with full occupancy</li>
          <li><strong>Isolate:</strong> Smart plugs on high-draw appliances (AC, heater, dryer)</li>
          <li><strong>Correlate:</strong> Guest nights vs. kWh using HA history</li>
          <li><strong>Evidence:</strong> Generate CSV + chart for legal/contractual reference</li>
        </ol>
      </div>

      <div class="bg-white border border-slate-200 rounded-xl p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Implementation Priority</h2>
        <div class="space-y-3">
          <div class="flex items-center gap-3">
            <span class="text-xl">✅</span>
            <span class="text-slate-700">Install EZVIZ doorbell (currently installed)</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⬜</span>
            <span class="text-slate-700">Add Aqara FP2 for occupancy</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⬜</span>
            <span class="text-slate-700">Configure guest night ledger</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⬜</span>
            <span class="text-slate-700">Set up noise sensors</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⬜</span>
            <span class="text-slate-700">Deploy Shelby AI voice interface</span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xl">⬜</span>
            <span class="text-slate-700">Generate first automated statement</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
