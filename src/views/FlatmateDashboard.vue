<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="text-2xl font-bold text-slate-900">Flatmate Portal</h1>
      <p class="text-sm text-slate-500 mt-1">Submit requests, track repairs, and stay on top of household tasks.</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <button @click="router.push('/flatmate/utilities')" class="card-hover p-6 text-left group">
        <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          💡
        </div>
        <span class="font-semibold text-slate-900 block mb-1">Utilities Tracker</span>
        <p class="text-sm text-slate-500">Weekly & monthly cost analytics</p>
      </button>

      <button @click="router.push('/flatmate/request-help')" class="card-hover p-6 text-left group">
        <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          🆘
        </div>
        <span class="font-semibold text-slate-900 block mb-1">Request Help</span>
        <p class="text-sm text-slate-500">Submit requests to your flatmates</p>
      </button>

      <button @click="router.push('/flatmate/repair-requests')" class="card-hover p-6 text-left group">
        <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          🔧
        </div>
        <span class="font-semibold text-slate-900 block mb-1">Repair Requests</span>
        <p class="text-sm text-slate-500">Track apartment maintenance</p>
      </button>

      <button @click="router.push('/kevin-cleaning')" class="card-hover p-6 text-left group">
        <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
          🧹
        </div>
        <span class="font-semibold text-slate-900 block mb-1">Cleaning Roster</span>
        <p class="text-sm text-slate-500">View weekly cleaning tasks</p>
      </button>
    </div>
  </div>
</template>
