<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTenantStore } from '@/stores/tenant'
import { hashPassword } from '@/services/cryptoService'

const route = useRoute()
const router = useRouter()
const tenantStore = useTenantStore()

const isEdit = computed(() => route.params.id !== undefined && route.params.id !== 'new')
const tenantId = computed(() => Number(route.params.id))

const form = ref({
  name: '',
  room: '',
  rent: 0,
  bond: 0,
  leaseStart: '',
  leaseEnd: '',
  contact: '',
  email: '',
  status: 'active',
  username: ''
})

const newPassword = ref('')
const error = ref('')
const saving = ref(false)

onMounted(() => {
  if (isEdit.value) {
    const tenant = tenantStore.getTenant(tenantId.value)
    if (tenant) {
      form.value = {
        name: tenant.name,
        room: tenant.room,
        rent: tenant.rent,
        bond: tenant.bond,
        leaseStart: tenant.leaseStart,
        leaseEnd: tenant.leaseEnd,
        contact: tenant.contact,
        email: tenant.email,
        status: tenant.status,
        username: tenant.username || ''
      }
    }
  }
})

const save = async () => {
  if (!form.value.name.trim()) {
    error.value = 'Name is required.'
    return
  }

  if (form.value.username) {
    const existing = tenantStore.findByUsername(form.value.username)
    if (existing && existing.id !== tenantId.value) {
      error.value = 'That username is already taken by another tenant.'
      return
    }
  }

  saving.value = true
  error.value = ''

  const data: Record<string, any> = { ...form.value }
  if (newPassword.value) {
    data.passwordHash = await hashPassword(newPassword.value)
  }

  if (isEdit.value) {
    tenantStore.updateTenant(tenantId.value, data)
  } else {
    tenantStore.addTenant({ ...data, guests: [] })
  }

  saving.value = false
  router.push('/admin/tenants')
}

const remove = () => {
  if (confirm(`Remove ${form.value.name} from tenants?`)) {
    tenantStore.deleteTenant(tenantId.value)
    router.push('/admin/tenants')
  }
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex items-center gap-3 pt-2">
      <button @click="router.push('/admin/tenants')" class="p-2 -ml-2 rounded-xl hover:bg-white transition text-slate-500">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">{{ isEdit ? 'Edit Tenant' : 'Add Tenant' }}</h1>
        <p class="text-sm text-slate-500 mt-1">Tenancy, contact, and optional login details.</p>
      </div>
    </div>

    <div class="card-elevated p-6 sm:p-8 max-w-2xl space-y-6">
      <!-- Tenancy details -->
      <div>
        <p class="form-section-title mb-4">Tenancy</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Name</label>
            <input v-model="form.name" type="text" class="input" placeholder="e.g. Jacob Smith" />
          </div>
          <div>
            <label class="input-label">Room</label>
            <input v-model="form.room" type="text" class="input" placeholder="e.g. Room 2" />
          </div>
          <div>
            <label class="input-label">Weekly Rent</label>
            <input v-model.number="form.rent" type="number" class="input" />
          </div>
          <div>
            <label class="input-label">Bond</label>
            <input v-model.number="form.bond" type="number" class="input" />
          </div>
          <div>
            <label class="input-label">Lease Start</label>
            <input v-model="form.leaseStart" type="date" class="input" />
          </div>
          <div>
            <label class="input-label">Lease End</label>
            <input v-model="form.leaseEnd" type="date" class="input" />
          </div>
          <div>
            <label class="input-label">Status</label>
            <select v-model="form.status" class="input">
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Contact details -->
      <div class="border-t border-slate-100 pt-6">
        <p class="form-section-title mb-4">Contact Details <span class="text-slate-400 font-normal normal-case">(optional)</span></p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Email</label>
            <input v-model="form.email" type="email" class="input" placeholder="tenant@example.com" />
          </div>
          <div>
            <label class="input-label">Phone</label>
            <input v-model="form.contact" type="tel" class="input" placeholder="+61 400 000 000" />
          </div>
        </div>
      </div>

      <!-- Login details -->
      <div class="border-t border-slate-100 pt-6">
        <p class="form-section-title mb-4">Login Access <span class="text-slate-400 font-normal normal-case">(optional)</span></p>
        <p class="text-xs text-slate-500 mb-4">Give this tenant a username and password so they can sign in to the site.</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="input-label">Username</label>
            <input v-model="form.username" type="text" class="input" placeholder="e.g. jacob" />
          </div>
          <div>
            <label class="input-label">Password</label>
            <input v-model="newPassword" type="password" class="input" :placeholder="isEdit ? 'Leave blank to keep current' : 'Set a password'" />
          </div>
        </div>
      </div>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100">
        <button @click="save" :disabled="saving" class="btn-primary flex-1">
          {{ saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add Tenant' }}
        </button>
        <button @click="router.push('/admin/tenants')" class="btn-secondary">Cancel</button>
        <button v-if="isEdit" @click="remove" class="btn-danger sm:ml-auto">Remove Tenant</button>
      </div>
    </div>
  </div>
</template>
