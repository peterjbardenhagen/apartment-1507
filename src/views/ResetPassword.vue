<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { passwordResetService } from '@/services/passwordResetService'

const route = useRoute()
const router = useRouter()

const token = ref('')
const tokenValid = ref(false)
const accountName = ref('')
const checking = ref(true)

const password = ref('')
const confirmPassword = ref('')
const saving = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  token.value = String(route.query.token || '')
  const result = passwordResetService.validateToken(token.value)
  tokenValid.value = result.valid
  accountName.value = result.name || ''
  checking.value = false
})

const submit = async () => {
  error.value = ''
  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match.'
    return
  }

  saving.value = true
  const result = await passwordResetService.resetPassword(token.value, password.value)
  saving.value = false

  if (result.success) {
    success.value = true
    setTimeout(() => router.push('/login'), 2000)
  } else {
    error.value = result.error || 'Something went wrong.'
  }
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
          <div v-if="checking" class="text-center text-sm text-slate-500">Checking your link…</div>

          <template v-else-if="!tokenValid">
            <div class="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Link expired</h1>
            <p class="text-sm text-slate-500 mb-6">
              This reset link is invalid or has expired. Request a new one below.
            </p>
            <button @click="router.push('/forgot-password')" class="btn-primary w-full">
              Request New Link
            </button>
          </template>

          <template v-else-if="success">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Password updated</h1>
            <p class="text-sm text-slate-500">Redirecting you to sign in…</p>
          </template>

          <template v-else>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Set a new password</h1>
            <p class="text-sm text-slate-500 mb-7">for {{ accountName }}</p>

            <div class="space-y-4">
              <div>
                <label class="input-label" for="new-password">New Password</label>
                <input
                  id="new-password"
                  v-model="password"
                  type="password"
                  placeholder="At least 6 characters"
                  autocomplete="new-password"
                  :disabled="saving"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label" for="confirm-password">Confirm Password</label>
                <input
                  id="confirm-password"
                  v-model="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                  autocomplete="new-password"
                  @keyup.enter="submit"
                  :disabled="saving"
                  class="input"
                />
              </div>
            </div>

            <p v-if="error" class="mt-3 text-sm font-medium text-red-600">{{ error }}</p>

            <button @click="submit" :disabled="saving" class="btn-primary w-full mt-6">
              {{ saving ? 'Saving…' : 'Update Password' }}
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
