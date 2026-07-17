<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { passwordResetService } from '@/services/passwordResetService'

const router = useRouter()
const username = ref('')
const loading = ref(false)
const submitted = ref(false)

const submit = async () => {
  if (!username.value.trim()) return
  loading.value = true
  await passwordResetService.requestReset(username.value)
  loading.value = false
  submitted.value = true
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex flex-col">
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

    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm animate-fade-in">
        <div class="card p-8 sm:p-9">
          <template v-if="!submitted">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Reset your password</h1>
            <p class="text-sm text-slate-500 mb-7">
              Enter your username and we'll email you a reset link, if that account has an email on file.
            </p>

            <label class="input-label" for="forgot-username">Username</label>
            <input
              id="forgot-username"
              v-model="username"
              type="text"
              placeholder="Your username"
              autocomplete="username"
              @keyup.enter="submit"
              :disabled="loading"
              class="input"
            />

            <button
              @click="submit"
              :disabled="loading || !username.trim()"
              class="btn-primary w-full mt-6"
            >
              {{ loading ? 'Sending…' : 'Send Reset Link' }}
            </button>
          </template>

          <template v-else>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Check your email</h1>
            <p class="text-sm text-slate-500">
              If an account with that username has an email on file, we've sent a link to reset the password.
              It expires in 30 minutes.
            </p>
          </template>
        </div>

        <button
          @click="router.push('/login')"
          class="w-full text-center text-sm font-medium text-slate-500 hover:text-emerald-700 transition mt-6"
        >
          ← Back to sign in
        </button>
      </div>
    </div>
  </div>
</template>
