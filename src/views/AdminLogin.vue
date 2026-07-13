<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (password.value === '2595') {
    auth.setAdminPassword(password.value)
    router.push('/admin/dashboard')
    error.value = ''
  } else {
    error.value = 'Incorrect password'
    password.value = ''
  }
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50">
    <div class="w-full max-w-sm px-4">
      <div class="text-center mb-8 animate-fade-in">
        <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mb-4">
          <span class="text-2xl">🏢</span>
        </div>
        <h1 class="text-2xl font-bold text-slate-900">Admin Access</h1>
        <p class="text-sm text-slate-500 mt-1">Enter password to continue</p>
      </div>

      <div class="card p-6 space-y-5">
        <div>
          <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="Enter admin password"
            @keyup="handleKeyup"
            class="input"
          />
        </div>

        <button
          @click="handleLogin"
          class="btn-primary w-full"
        >
          Unlock Admin
        </button>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2 animate-in">
          <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ error }}
        </div>

        <button
          @click="router.push('/')"
          class="w-full text-slate-500 hover:text-slate-700 py-2 text-sm font-medium transition"
        >
          Back to home
        </button>
      </div>
    </div>
  </div>
</template>
