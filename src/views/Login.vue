<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (!username.value || !password.value) return
  loading.value = true
  error.value = ''

  const result = await auth.login(username.value, password.value)

  if (result.success) {
    router.push(auth.isAdminAuthenticated ? '/admin/dashboard' : '/flatmate/dashboard')
  } else {
    error.value = result.error || 'Login failed.'
    password.value = ''
  }
  loading.value = false
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !loading.value && username.value && password.value) {
    handleLogin()
  }
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex flex-col">
    <!-- Top bar -->
    <header class="px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="max-w-5xl mx-auto flex items-center justify-center">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-display font-bold text-xs shadow-pill">
            15
          </div>
          <span class="font-display font-bold text-slate-900">Apartment 1507</span>
        </div>
      </div>
    </header>

    <!-- Card -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm animate-fade-in">
        <div class="card p-8 sm:p-9">
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>

          <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Sign in</h1>
          <p class="text-sm text-slate-500 mb-7">
            1507/477 Boundary St, Spring Hill. Tenants and landlord sign in here.
          </p>

          <div class="space-y-4">
            <div>
              <label class="input-label" for="login-username">Username</label>
              <input
                id="login-username"
                v-model="username"
                type="text"
                placeholder="e.g. kevin"
                autocomplete="username"
                @keyup="handleKeyup"
                :disabled="loading"
                class="input"
              />
            </div>
            <div>
              <label class="input-label" for="login-password">Password</label>
              <input
                id="login-password"
                v-model="password"
                type="password"
                placeholder="Enter your password"
                autocomplete="current-password"
                @keyup="handleKeyup"
                :disabled="loading"
                :class="['input', error ? 'input-error' : '']"
              />
            </div>
          </div>

          <transition name="fade">
            <p v-if="error" class="mt-3 text-sm font-medium text-red-600 flex items-center gap-2">
              <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
              {{ error }}
            </p>
          </transition>

          <button
            @click="handleLogin"
            :disabled="loading || !username || !password"
            class="btn-primary w-full mt-6"
          >
            <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span>{{ loading ? 'Signing in…' : 'Sign in' }}</span>
          </button>

          <button
            @click="router.push('/forgot-password')"
            class="w-full text-center text-sm font-medium text-slate-500 hover:text-emerald-700 transition mt-4"
          >
            Forgot your password?
          </button>
        </div>

        <p class="text-center text-xs text-slate-400 mt-6">
          Don't have login details? Ask your landlord.
        </p>
      </div>
    </div>
  </div>
</template>
