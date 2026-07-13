<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-slate-800">Flatmate Portal</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button @click="router.push('/flatmate/request-help')" class="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-blue-300 transition group">
        <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-blue-100 transition">
          🆘
        </div>
        <span class="font-bold text-slate-800 block mb-1">Request Help</span>
        <p class="text-sm text-slate-500">Submit requests to your flatmates</p>
      </button>

      <button @click="router.push('/flatmate/repair-requests')" class="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-orange-300 transition group">
        <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-orange-100 transition">
          🔧
        </div>
        <span class="font-bold text-slate-800 block mb-1">Repair Requests</span>
        <p class="text-sm text-slate-500">Track apartment maintenance</p>
      </button>

      <button @click="router.push('/kevin-cleaning')" class="bg-white border border-slate-200 rounded-xl p-6 text-left hover:shadow-lg hover:border-emerald-300 transition group">
        <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-emerald-100 transition">
          🧹
        </div>
        <span class="font-bold text-slate-800 block mb-1">Cleaning Roster</span>
        <p class="text-sm text-slate-500">View weekly cleaning tasks</p>
      </button>
    </div>
  </div>
</template>
