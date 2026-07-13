<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-100">
    <div class="bg-white rounded-lg shadow-lg p-12 w-full max-w-md text-center">
      <h1 class="text-3xl font-bold mb-8">🏢 Apartment 1507</h1>

      <div class="space-y-6">
        <!-- Landlord Portal -->
        <div class="space-y-2">
          <button @click="router.push('/landlord/login')" class="w-full bg-green-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-green-700 transition">
            🏠 Landlord Portal
          </button>
          <p class="text-sm text-slate-600">Manage tenants, financials, documents</p>
        </div>

        <!-- Admin Portal -->
        <div class="space-y-2">
          <button @click="router.push('/admin/login')" class="w-full bg-slate-800 text-white py-4 rounded-lg text-lg font-semibold hover:bg-slate-900 transition">
            🔐 Admin Portal
          </button>
          <p class="text-sm text-slate-600">Guardian system, cleaning issues, settings</p>
        </div>

        <!-- Flatmate Portal -->
        <div class="space-y-2">
          <button @click="router.push('/flatmate/login')" class="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            👥 Request Help with Something
          </button>
          <p class="text-sm text-slate-600">Submit requests and repair issues</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Responsive full-width on mobile */
@media (max-width: 640px) {
  .max-w-md {
    max-width: 100%;
    margin: 0 1rem;
  }
}
</style>