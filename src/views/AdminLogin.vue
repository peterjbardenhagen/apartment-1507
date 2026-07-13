<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')
const error = ref('')
const showPassword = ref(false)

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
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
    <div class="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-slate-800 mb-2">Admin Access</h1>
        <p class="text-sm text-slate-500">Enter password to continue</p>
      </div>

      <div class="space-y-5">
        <div>
          <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            placeholder="Enter admin password"
            @keyup="handleKeyup"
            class="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
          />
        </div>

        <button
          @click="handleLogin"
          class="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 active:scale-[0.98] transition"
        >
          Unlock Admin
        </button>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm text-center">
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
