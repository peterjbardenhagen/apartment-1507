<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-slate-100">
    <div class="bg-slate-900 text-white p-8 shadow-lg">
      <div class="max-w-6xl mx-auto">
        <div class="flex justify-between items-center mb-2">
          <h1 class="text-3xl font-bold">🔐 Admin Dashboard</h1>
          <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold transition">
            🚪 Exit Admin
          </button>
        </div>
        <p class="text-slate-300">Apartment 1507 · Guardian & System Settings</p>
      </div>
    </div>

    <div class="max-w-6xl mx-auto p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Guardian System -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="router.push('/admin/guardian')">
          <div class="text-4xl mb-4">🛡️</div>
          <h2 class="text-xl font-bold mb-2">Guardian System</h2>
          <p class="text-slate-600 text-sm">Security protocols, access control, and sensor monitoring</p>
          <div class="mt-4 text-blue-600 font-semibold">View Details →</div>
        </div>

        <!-- Guardian Documentation -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="router.push('/admin/guardian-docs')">
          <div class="text-4xl mb-4">📖</div>
          <h2 class="text-xl font-bold mb-2">Guardian Documentation</h2>
          <p class="text-slate-600 text-sm">Comprehensive guides and protocols for the Guardian system</p>
          <div class="mt-4 text-blue-600 font-semibold">View Details →</div>
        </div>

        <!-- Flatmate Enquiries -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="router.push('/admin/enquiries')">
          <div class="text-4xl mb-4">📨</div>
          <h2 class="text-xl font-bold mb-2">Flatmate Enquiries</h2>
          <p class="text-slate-600 text-sm">Manage requests and help submissions from flatmates</p>
          <div class="mt-4 text-blue-600 font-semibold">View Details →</div>
        </div>

        <!-- Cleaning Issues Resolution -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="router.push('/admin/cleaning-issues')">
          <div class="text-4xl mb-4">🧹</div>
          <h2 class="text-xl font-bold mb-2">Cleaning Issues</h2>
          <p class="text-slate-600 text-sm">Track and manage reported cleaning issues and resolutions</p>
          <div class="mt-4 text-blue-600 font-semibold">View Details →</div>
        </div>

        <!-- System Settings -->
        <div class="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer" @click="router.push('/landlord/settings')">
          <div class="text-4xl mb-4">⚙️</div>
          <h2 class="text-xl font-bold mb-2">System Settings</h2>
          <p class="text-slate-600 text-sm">Configure apartment systems and access controls</p>
          <div class="mt-4 text-blue-600 font-semibold">View Details →</div>
        </div>
      </div>
    </div>
  </div>
</template>
