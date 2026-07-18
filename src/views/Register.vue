<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const firstName = ref('')
const email = ref('')
const username = ref('')
const phone = ref('')
const loading = ref(false)
const submitted = ref(false)
const error = ref('')

const submit = async () => {
  if (!firstName.value.trim() || !email.value.trim()) return
  loading.value = true
  error.value = ''

  try {
    // Submit registration to landlord via Supabase
    const { supabase } = await import('@/services/supabaseClient')
    const { error: insertError } = await supabase
      .from('registrations')
      .insert({
        first_name: firstName.value.trim(),
        email: email.value.trim().toLowerCase(),
        username: username.value.trim().toLowerCase() || null,
        phone: phone.value.trim() || null,
        status: 'pending'
      })

    if (insertError) throw insertError

    submitted.value = true
  } catch (e) {
    error.value = (e as Error)?.message || 'Registration failed. Please try again.'
  }
  loading.value = false
}

const handleKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !loading.value && firstName.value && email.value) {
    submit()
  }
}
</script>

<template>
  <div class="min-h-screen bg-emerald-50 flex flex-col">
    <!-- Top bar -->
    <header class="px-4 sm:px-6 pt-4 sm:pt-6">
      <div class="max-w-5xl mx-auto flex items-center justify-center">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-pill">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 21h18M3 10h18M3 7l9-4 9 4M6 10v11h4V10h4v11h4V10"/>
            </svg>
          </div>
          <span class="font-display font-bold text-slate-900">Apartment 1507</span>
        </div>
      </div>
    </header>

    <!-- Card -->
    <div class="flex-1 flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-sm animate-fade-in">
        <div class="card p-8 sm:p-9">
          <template v-if="!submitted">
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
              </svg>
            </div>

            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Request access</h1>
            <p class="text-sm text-slate-500 mb-7">
              Fill in your details below and your landlord will set up your account.
            </p>

            <div class="space-y-4">
              <div>
                <label class="input-label" for="reg-firstname">First name <span class="text-red-500">*</span></label>
                <input
                  id="reg-firstname"
                  v-model="firstName"
                  type="text"
                  placeholder="Your first name"
                  autocomplete="given-name"
                  @keyup="handleKeyup"
                  :disabled="loading"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label" for="reg-email">Email <span class="text-red-500">*</span></label>
                <input
                  id="reg-email"
                  v-model="email"
                  type="email"
                  placeholder="your@email.com"
                  autocomplete="email"
                  @keyup="handleKeyup"
                  :disabled="loading"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label" for="reg-username">Desired username</label>
                <input
                  id="reg-username"
                  v-model="username"
                  type="text"
                  placeholder="e.g. your first name"
                  autocomplete="username"
                  @keyup="handleKeyup"
                  :disabled="loading"
                  class="input"
                />
              </div>
              <div>
                <label class="input-label" for="reg-phone">Phone (optional)</label>
                <input
                  id="reg-phone"
                  v-model="phone"
                  type="tel"
                  placeholder="e.g. 0400 000 000"
                  autocomplete="tel"
                  @keyup="handleKeyup"
                  :disabled="loading"
                  class="input"
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
              @click="submit"
              :disabled="loading || !firstName.trim() || !email.trim()"
              class="btn-primary w-full mt-6"
            >
              <svg v-if="loading" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
              <span>{{ loading ? 'Submitting…' : 'Submit request' }}</span>
            </button>
          </template>

          <template v-else>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h1 class="font-display text-2xl font-bold text-slate-900 mb-1">Request sent</h1>
            <p class="text-sm text-slate-500">
              Your registration request has been sent to the landlord. You'll receive your login details once
              your account has been set up.
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
