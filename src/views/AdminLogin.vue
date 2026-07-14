<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  setTimeout(() => {
    if (password.value === '2595') {
      auth.setAdminPassword(password.value)
      router.push('/admin/dashboard')
      error.value = ''
    } else {
      error.value = 'Incorrect password'
      password.value = ''
    }
    loading.value = false
  }, 600)
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !loading.value) {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full filter blur-3xl animate-pulse"></div>
      <div class="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full filter blur-3xl animate-pulse" style="animation-delay: 2s;"></div>
    </div>

    <div class="w-full max-w-sm px-4 relative z-10">
      <!-- Logo & Header -->
      <div class="text-center mb-12 animate-fade-in">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white mb-6 shadow-xl shadow-emerald-500/25">
          <span class="text-3xl">🔐</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">Admin Portal</h1>
        <p class="text-slate-400">Apartment 1507 Management</p>
      </div>

      <!-- Login Card -->
      <div class="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
        <!-- Property Info -->
        <div class="text-center text-sm text-slate-300 pb-4 border-b border-white/5">
          <p class="font-medium text-white">1507/477 Boundary St</p>
          <p>Spring Hill, QLD 4000</p>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-semibold text-slate-200 mb-3">Admin Password</label>
          <div class="relative">
            <input
              v-model="password"
              type="password"
              placeholder="Enter your password"
              @keyup="handleKeyup"
              :disabled="loading"
              class="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div v-if="!error" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Error Message -->
        <transition name="fade">
          <div v-if="error" class="bg-red-500/10 border border-red-500/20 text-red-300 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
            <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
            </svg>
            <span>{{ error }}</span>
          </div>
        </transition>

        <!-- Login Button -->
        <button
          @click="handleLogin"
          :disabled="loading || !password"
          class="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25"
        >
          <span v-if="loading">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </span>
          <span v-else>
            <svg class="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
            Unlock Portal
          </span>
        </button>

        <!-- Divider -->
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-slate-900 text-slate-400">or</span>
          </div>
        </div>

        <!-- Back Button -->
        <button
          @click="router.push('/')"
          class="w-full px-4 py-2.5 text-slate-300 hover:text-white border border-white/10 hover:border-white/20 rounded-xl transition-all font-medium"
        >
          Return Home
        </button>
      </div>

      <!-- Footer Info -->
      <div class="text-center mt-6 text-xs text-slate-500">
        <p>Secure access required</p>
      </div>
    </div>
  </div>
</template>
