<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
    <div class="flex-1 flex items-center justify-center p-6">
      <div class="w-full max-w-lg">
        <div class="text-center mb-10">
          <h1 class="text-4xl font-bold text-slate-800 mb-3">Apartment 1507</h1>
          <p class="text-slate-500 text-lg">Property Management Portal</p>
        </div>

        <div class="space-y-4">
          <button @click="router.push('/flatmate/request-help')" class="w-full bg-white border border-slate-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-blue-300 transition group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-blue-100 transition">
                🆘
              </div>
              <div>
                <h2 class="font-bold text-slate-800 text-lg">Request Help</h2>
                <p class="text-sm text-slate-500">Submit requests to your flatmates</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/flatmate/repair-requests')" class="w-full bg-white border border-slate-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-orange-300 transition group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-orange-100 transition">
                🔧
              </div>
              <div>
                <h2 class="font-bold text-slate-800 text-lg">Repair Requests</h2>
                <p class="text-sm text-slate-500">Track apartment maintenance issues</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/kevin-cleaning')" class="w-full bg-white border border-slate-200 rounded-xl p-5 text-left hover:shadow-lg hover:border-emerald-300 transition group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center text-2xl group-hover:bg-emerald-100 transition">
                🧹
              </div>
              <div>
                <h2 class="font-bold text-slate-800 text-lg">Cleaning Roster</h2>
                <p class="text-sm text-slate-500">View weekly cleaning tasks</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <footer class="py-6 text-center">
      <router-link to="/admin/login" class="text-xs text-slate-400 hover:text-slate-600 transition">
        Admin
      </router-link>
    </footer>
  </div>
</template>
