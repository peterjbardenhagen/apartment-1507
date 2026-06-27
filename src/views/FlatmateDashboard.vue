<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const goKevinCleaning = () => router.push('/kevin-cleaning')
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold">Flatmate Portal</h1>
      <div class="text-sm text-slate-600">Welcome, {{ auth.user?.name }}</div>
    </div>
    
    <div class="space-y-4">
      <h2 class="text-lg font-bold">Your Access</h2>
      
      <button @click="goKevinCleaning" class="w-full bg-white rounded-lg shadow p-4 text-left hover:shadow-md">
        <span class="text-xl mr-3">🧹</span>
        Kevin's Cleaning
      </button>
    </div>
  </div>
</template>