<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const error = ref('')

const login = () => {
  if (auth.login(username.value, password.value, 'tenant')) {
    router.push('/flatmate/dashboard')
  } else {
    error.value = 'Invalid credentials'
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
      <h2 class="text-2xl font-bold mb-6 text-center">Flatmate Login</h2>
      
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Username</label>
          <input v-model="username" type="text" required class="w-full px-3 py-2 border rounded-lg" placeholder="kevin">
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input v-model="password" type="password" required class="w-full px-3 py-2 border rounded-lg" placeholder="••••••">
        </div>
        
        <p v-if="error" class="text-red-600 text-sm">{{ error }}</p>
        
        <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Login</button>
      </form>
      
      <router-link to="/" class="block text-center mt-4 text-sm text-slate-500">← Back to home</router-link>
    </div>
  </div>
</template>