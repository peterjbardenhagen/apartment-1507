<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  const result = auth.login(username.value, password.value)
  if (result) {
    router.push('/')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
      <h1 class="text-2xl font-bold mb-4 text-center">Apartment 1507 Login</h1>
      
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="username" type="text" required class="w-full border rounded px-3 py-2">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full border rounded px-3 py-2">
        </div>
        
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        
        <button type="submit" class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>
      
      <p class="text-xs text-slate-500 mt-4 text-center">
        Admin: peterb / Omnfxop09!<br>
        Kevin: kevin / tenant123
      </p>
    </div>
  </div>
</template>