<script setup lang="ts">
const summaryCards = [
  { label: 'Normalised total/month', value: '$548.36' },
  { label: 'Raw total/month', value: '$634.60' },
  { label: '2 people each/week', value: '$63.27' },
  { label: '3 people each/week', value: '$42.18' }
]

const summaryRows = [
  { utility: 'Electricity', cost: '$276.37', basis: 'Actual uploaded invoices' },
  { utility: 'Hot Water + Gas/Cooktop', cost: '$81.55', basis: 'Normalised; excludes one catch-up anomaly' },
  { utility: 'Water + Sewerage', cost: '$93.44', basis: 'Urban Utilities quarterly bills' },
  { utility: 'Broadband', cost: '$97.00', basis: 'Current recurring amount from screenshot' },
  { utility: 'Total Normalised', cost: '$548.36', basis: 'Recommended operating baseline', total: true },
  { utility: 'Total Raw Historical', cost: '$634.60', basis: 'Includes abnormal hot-water catch-up' }
]

const scenarioRows = [
  { occupants: '1', perMonth: '$548.36', perWeek: '$126.54', recommended: '$145.00/week' },
  { occupants: '2', perMonth: '$274.18', perWeek: '$63.27', recommended: '$75.00/week' },
  { occupants: '3', perMonth: '$182.79', perWeek: '$42.18', recommended: '$50.00/week' },
  { occupants: '4', perMonth: '$137.09', perWeek: '$31.64', recommended: '$40.00/week' }
]

const waterRows = [
  { period: '28 May 2025 – 04 Sep 2025', days: 100, usage: '$35.57', service: '$68.64', sewerage: '$192.89', total: '$297.10', monthly: '$90.43', invoice: 'Urban-Utilities-11291051-2.pdf' },
  { period: '05 Sep 2025 – 13 Nov 2025', days: 70, usage: '$22.48', service: '$48.58', sewerage: '$137.27', total: '$208.33', monthly: '$90.59', invoice: 'Urban-Utilities-11291051-3.pdf' },
  { period: '14 Nov 2025 – 05 Mar 2026', days: 112, usage: '$62.96', service: '$77.72', sewerage: '$219.63', total: '$360.31', monthly: '$97.92', invoice: 'Urban-Utilities-11291051-4.pdf' }
]

const hotWaterRows = [
  { period: '23 Jun 2025 – 28 Sep 2025', days: 98, total: '$103.85', monthly: '$32.25', status: 'normal', invoice: 'A-3463672A-origin-statement-2025-10-16.pdf' },
  { period: '29 Sep 2025 – 30 Nov 2025', days: 63, total: '$1,137.77', monthly: '$549.70', status: 'catch-up anomaly', invoice: 'A-3463672A-origin-statement-2025-11-30.pdf', anomaly: true },
  { period: '01 Dec 2025 – 31 Dec 2025', days: 31, total: '$75.50', monthly: '$74.13', status: 'normal', invoice: 'A-3463672A-origin-statement-2026-01-04.pdf' },
  { period: '01 Jan 2026 – 28 Jan 2026', days: 28, total: '$82.65', monthly: '$89.84', status: 'normal', invoice: 'A-3463672A-origin-statement-2026-02-01.pdf' },
  { period: '29 Jan 2026 – 25 Feb 2026', days: 28, total: '$99.62', monthly: '$108.29', status: 'normal', invoice: 'A-3463672A-origin-statement-2026-03-01.pdf' },
  { period: '26 Feb 2026 – 30 Mar 2026', days: 33, total: '$117.50', monthly: '$108.38', status: 'normal', invoice: 'A-3463672A-origin-statement-2026-04-01.pdf' },
  { period: '31 Mar 2026 – 27 Apr 2026', days: 28, total: '$69.08', monthly: '$75.09', status: 'normal', invoice: 'A-3463672A-origin-statement-2026-04-29.pdf' },
  { period: '28 Apr 2026 – 30 May 2026', days: 33, total: '$199.35', monthly: '$183.87', status: 'high usage', invoice: 'A-3463672A-origin-statement-2026-06-01.pdf' }
]

const electricityRows = [
  { period: '21 Jun 2025 – 08 Oct 2025', days: 110, total: '$968.21', monthly: '$267.91', invoice: 'A-7C20BD60-origin-statement-2025-11-09.pdf' },
  { period: '09 Oct 2025 – 11 Nov 2025', days: 34, total: '$395.32', monthly: '$353.90', invoice: 'A-7C20BD60-origin-statement-2025-11-12.pdf' },
  { period: '12 Nov 2025 – 08 Dec 2025', days: 27, total: '$282.13', monthly: '$318.05', invoice: 'A-7C20BD60-origin-statement-2025-12-09.pdf' },
  { period: '09 Dec 2025 – 08 Jan 2026', days: 31, total: '$330.91', monthly: '$324.91', invoice: 'A-7C20BD60-origin-statement-2026-01-12.pdf' },
  { period: '02 Apr 2026 – 10 May 2026', days: 39, total: '$315.63', monthly: '$246.33', invoice: 'A-7C20BD60-origin-statement-2026-05-11.pdf' },
  { period: '11 May 2026 – 04 Jun 2026', days: 25, total: '$123.02', monthly: '$149.78', invoice: 'A-7C20BD60-origin-statement-2026-06-07.pdf' }
]

const benchmarkRows = [
  { scenario: '1 Occupant', occupants: '1 person', elec: '$21–$32', water: '$3–$6', gas: '$1–$4', internet: '$20–$25', total: '$45–$67', perPerson: '$45–$67' },
  { scenario: '2 Occupants (Total)', occupants: '2 people', elec: '$32–$51', water: '$6–$9', gas: '$2–$5', internet: '$20–$25', total: '$60–$90', perPerson: '$30–$45 each' },
  { scenario: '3 Occupants (Total)', occupants: '3 people', elec: '$44–$74', water: '$8–$14', gas: '$3–$7', internet: '$20–$25', total: '$75–$120', perPerson: '$25–$40 each' }
]
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <span class="badge-info mb-3 inline-flex">Prepared 16 Jun 2026 · Invoices included</span>
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Utilities Evidence Pack</h1>
      <p class="text-sm text-slate-500 mt-1.5 max-w-2xl">
        Normalised utilities evidence for 1507/477 Boundary St. Separates Urban Utilities water usage from fixed
        water/sewerage charges, compares raw vs normalised hot-water costs, and provides defensible flatmate
        contribution figures. Incl. GST amounts only.
      </p>
    </div>

    <!-- Summary metric cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="c in summaryCards" :key="c.label" class="card-metric">
        <p class="card-metric-header">{{ c.label }}</p>
        <p class="card-metric-value text-slate-900">{{ c.value }}</p>
      </div>
    </div>

    <!-- Executive summary -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Executive Summary</h2>
      <div class="alert-success mb-5">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
        </svg>
        <span>
          Recommended flatmate wording: <strong>"Bills contribution: $50/week per person, reviewed quarterly against
          actual invoices."</strong> Reasonable for a 3-person household, conservative for 2 people given the uploaded
          utility history.
        </span>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Utility</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Cost / Month</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Basis</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in summaryRows"
              :key="row.utility"
              :class="['border-b border-slate-100', row.total ? 'bg-emerald-50 font-semibold' : '']"
            >
              <td class="py-2.5 px-3 text-slate-900">{{ row.utility }}</td>
              <td class="py-2.5 px-3 text-slate-900">{{ row.cost }}</td>
              <td class="py-2.5 px-3 text-slate-500">{{ row.basis }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Flatmate scenarios -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Flatmate Scenarios</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Occupants Sharing Bills</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Actual / Person / Month</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Actual / Person / Week</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Simple Recommended Charge</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in scenarioRows" :key="row.occupants" class="border-b border-slate-100">
              <td class="py-2.5 px-3 text-slate-900 font-medium">{{ row.occupants }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.perMonth }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.perWeek }}</td>
              <td class="py-2.5 px-3 text-emerald-700 font-semibold">{{ row.recommended }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Water split -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Urban Utilities / Water Split</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Period</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Days</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Usage</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Service</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Sewerage</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Total</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Monthly Equiv.</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in waterRows" :key="row.invoice" class="border-b border-slate-100">
              <td class="py-2.5 px-3 text-slate-900">{{ row.period }}</td>
              <td class="py-2.5 px-3 text-slate-500">{{ row.days }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.usage }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.service }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.sewerage }}</td>
              <td class="py-2.5 px-3 text-slate-900 font-medium">{{ row.total }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.monthly }}</td>
              <td class="py-2.5 px-3 text-slate-400 text-xs">{{ row.invoice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-500 mt-3">
        Urban Utilities total includes water usage, water service charge and sewerage service charge — much of this is
        fixed/semi-fixed rather than occupant-usage driven.
      </p>
    </div>

    <!-- Hot water normalisation -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Hot Water + Gas/Cooktop Normalisation</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Period</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Days</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Total Incl GST</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Monthly Equiv.</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Status</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in hotWaterRows"
              :key="row.invoice"
              :class="['border-b border-slate-100', row.anomaly ? 'bg-red-50' : '']"
            >
              <td class="py-2.5 px-3 text-slate-900">{{ row.period }}</td>
              <td class="py-2.5 px-3 text-slate-500">{{ row.days }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.total }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.monthly }}</td>
              <td class="py-2.5 px-3">
                <span :class="row.anomaly ? 'badge-danger' : 'badge-neutral'">{{ row.status }}</span>
              </td>
              <td class="py-2.5 px-3 text-slate-400 text-xs">{{ row.invoice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="text-xs text-slate-500 mt-3">
        The Sep–Nov 2025 bill is marked as an anomaly because it contains a very large catch-up charge compared with
        the rest of the pattern.
      </p>
    </div>

    <!-- Electricity detail -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Electricity Detail</h2>
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Period</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Days</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Total Incl GST</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Monthly Equiv.</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Invoice</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in electricityRows" :key="row.invoice" class="border-b border-slate-100">
              <td class="py-2.5 px-3 text-slate-900">{{ row.period }}</td>
              <td class="py-2.5 px-3 text-slate-500">{{ row.days }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.total }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.monthly }}</td>
              <td class="py-2.5 px-3 text-slate-400 text-xs">{{ row.invoice }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Benchmark note -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Benchmark Note</h2>
      <div class="alert-info">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
        </svg>
        <span>
          Parent benchmark supplied: 2 people at Albany Creek pay about <strong>$145/month electricity</strong> and
          <strong>$20/month gas</strong>. The Spring Hill apartment is materially higher, likely due to embedded
          network pricing, apartment service charges, air-con use, and hot-water/gas catch-up behaviour.
        </span>
      </div>
    </div>

    <!-- Brisbane averages -->
    <div class="card p-6">
      <h2 class="text-lg font-bold text-slate-900 mb-2">Utility Cost Analysis vs Brisbane Averages</h2>
      <p class="text-sm text-slate-500 mb-4">Expected weekly utilities cost — 1507/477 Boundary Street</p>
      <div class="overflow-x-auto mb-6">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-slate-200">
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Scenario</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Occupants</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Electricity</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Water Usage</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Gas</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Internet</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Total / Week</th>
              <th class="text-left py-2.5 px-3 font-semibold text-slate-600">Per Person / Week</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in benchmarkRows" :key="row.scenario" class="border-b border-slate-100">
              <td class="py-2.5 px-3 text-slate-900 font-medium">{{ row.scenario }}</td>
              <td class="py-2.5 px-3 text-slate-500">{{ row.occupants }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.elec }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.water }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.gas }}</td>
              <td class="py-2.5 px-3 text-slate-700">{{ row.internet }}</td>
              <td class="py-2.5 px-3 text-slate-900 font-medium">{{ row.total }}</td>
              <td class="py-2.5 px-3 text-emerald-700 font-semibold">{{ row.perPerson }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h3 class="font-semibold text-slate-900 mb-2">What to Expect at This Apartment (179m², 3 adults)</h3>
      <p class="text-sm text-slate-600 mb-3">
        For a sub-penthouse with ducted air conditioning, washer/dryer, dishwasher, large fridge, and lift building:
      </p>
      <ul class="space-y-1.5 text-sm text-slate-700 mb-6">
        <li><strong>Electricity:</strong> $50–$65/week</li>
        <li><strong>Water:</strong> $10–$15/week</li>
        <li><strong>Gas:</strong> $4–$6/week</li>
        <li><strong>Internet:</strong> $22–$25/week</li>
        <li><strong>Total apartment cost:</strong> $86–$111/week</li>
        <li><strong>Split three ways:</strong> $29–$37 per person per week</li>
      </ul>

      <h3 class="font-semibold text-slate-900 mb-2">Compared to Current Charge</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p class="text-xs text-slate-500 uppercase tracking-wide">Rent</p>
          <p class="text-lg font-bold text-slate-900">$390/week</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p class="text-xs text-slate-500 uppercase tracking-wide">Utilities</p>
          <p class="text-lg font-bold text-slate-900">$60/week</p>
        </div>
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <p class="text-xs text-slate-500 uppercase tracking-wide">Total (2 housemates)</p>
          <p class="text-lg font-bold text-slate-900">$450/week</p>
        </div>
      </div>
      <p class="text-sm text-slate-600">
        Utilities collected: <strong>$120/week</strong> (2 × $60) · Expected utilities bill:
        <strong>$86–$111/week</strong> · Difference:
        <span class="text-emerald-600 font-semibold">+$9 to +$34/week surplus</span>
      </p>

      <h3 class="font-semibold text-slate-900 mt-6 mb-2">Assessment</h3>
      <p class="text-sm text-slate-600">
        $60/week is towards the upper end but justifiable if it includes consumables, regular air conditioning use, or
        absorbs bill spikes. Without consumables, a fair contribution would be $40–$50/week per person.
      </p>
    </div>

    <!-- Data sources -->
    <div class="card p-6 text-sm text-slate-500">
      <p class="font-semibold text-slate-700 mb-1">Data Sources</p>
      <p>
        All figures sourced from Obsidian vault: <code class="text-xs bg-slate-100 px-1.5 py-0.5 rounded">Home/Flatmate Management/Cost Audit.md</code>.
        Invoice PDFs stored in vault.
      </p>
      <p class="mt-3 text-xs text-slate-400">
        Pack contents: index.html, invoice folders, and data/utilities-normalised-data.json · Last updated 18 Jun 2026.
      </p>
    </div>
  </div>
</template>
