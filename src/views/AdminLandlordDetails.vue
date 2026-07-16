<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { landlordService } from '@/services/landlordService'
import { hashPassword } from '@/services/cryptoService'

const name = ref('')
const email = ref('')
const phone = ref('')
const username = ref('')
const newPassword = ref('')
const saving = ref(false)
const saved = ref(false)
const error = ref('')

onMounted(async () => {
  const landlord = await landlordService.getLandlord()
  name.value = landlord.name
  email.value = landlord.email
  phone.value = landlord.phone
  username.value = landlord.username
})

const save = async () => {
  if (!name.value.trim() || !username.value.trim()) {
    error.value = 'Name and username are required.'
    return
  }
  saving.value = true
  error.value = ''

  const updates: Record<string, string> = {
    name: name.value.trim(),
    email: email.value.trim(),
    phone: phone.value.trim(),
    username: username.value.trim()
  }
  if (newPassword.value) {
    updates.passwordHash = await hashPassword(newPassword.value)
  }

  await landlordService.saveLandlord(updates)
  newPassword.value = ''
  saving.value = false
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="pt-2">
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Landlord Details</h1>
      <p class="text-sm text-slate-500 mt-1.5">Your contact details and login credentials.</p>
    </div>

    <div class="card-elevated p-6 sm:p-8 max-w-xl space-y-5">
      <div>
        <label class="input-label">Full Name</label>
        <input v-model="name" type="text" class="input" />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="input-label">Email</label>
          <input v-model="email" type="email" class="input" placeholder="optional" />
        </div>
        <div>
          <label class="input-label">Phone</label>
          <input v-model="phone" type="tel" class="input" placeholder="optional" />
        </div>
      </div>

      <div class="border-t border-slate-100 pt-5">
        <p class="form-section-title mb-4">Login Credentials</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Username</label>
            <input v-model="username" type="text" class="input" />
          </div>
          <div>
            <label class="input-label">New Password</label>
            <input v-model="newPassword" type="password" class="input" placeholder="Leave blank to keep current" />
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <transition name="fade">
        <p v-if="saved" class="text-sm text-emerald-600 font-medium">Saved.</p>
      </transition>

      <div class="pt-4 border-t border-slate-100 flex justify-end">
        <button @click="save" :disabled="saving" class="btn-primary">
          {{ saving ? 'Saving…' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>
