<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Flatmate Portal</h1>
      <div class="text-sm text-slate-600">Welcome, {{ auth.user?.name }}</div>
    </div>

    <div class="space-y-4">
      <h2 class="text-lg font-bold">Your Access</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button @click="router.push('/flatmate/request-help')" class="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition">
          <div class="text-4xl mb-2">🆘</div>
          <span class="text-lg font-bold">Request Help</span>
          <p class="text-sm text-slate-600 mt-2">Submit requests to your flatmates</p>
        </button>

        <button @click="router.push('/flatmate/repair-requests')" class="bg-white rounded-lg shadow p-6 text-left hover:shadow-lg transition">
          <div class="text-4xl mb-2">🔧</div>
          <span class="text-lg font-bold">Repair Requests</span>
          <p class="text-sm text-slate-600 mt-2">Track apartment maintenance</p>
        </button>
      </div>
    </div>
  </div>
</template>