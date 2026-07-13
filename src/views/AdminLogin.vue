<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const password = ref('')
const error = ref('')

const handleLogin = () => {
  if (password.value === 'Omnfxop09!') {
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
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white rounded-lg shadow-lg p-12 w-full max-w-md">
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold mb-2">🔒 Admin Access</h1>
        <p class="text-sm text-slate-600">Enter admin password to continue</p>
      </div>

      <div class="space-y-6">
        <div>
          <input
            v-model="password"
            type="password"
            placeholder="Enter admin password"
            @keyup="handleKeyup"
            class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          @click="handleLogin"
          class="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          🔓 Unlock Admin
        </button>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {{ error }}
        </div>

        <button
          @click="router.push('/')"
          class="w-full bg-slate-200 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-300 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  </div>
</template>
