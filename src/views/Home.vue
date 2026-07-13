<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-50">
    <div class="flex-1">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div class="text-center mb-12 animate-fade-in">
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mb-6">
            <span class="text-3xl">🏢</span>
          </div>
          <h1 class="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Apartment 1507
          </h1>
          <p class="text-lg text-slate-500 max-w-md mx-auto">
            Your home, simplified. Submit requests, track repairs, and stay on top of things.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <button @click="router.push('/flatmate/request-help')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🆘
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Request Help</h2>
                <p class="text-sm text-slate-500">Submit requests to flatmates</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/flatmate/repair-requests')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🔧
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Repairs</h2>
                <p class="text-sm text-slate-500">Track maintenance issues</p>
              </div>
            </div>
          </button>

          <button @click="router.push('/kevin-cleaning')" class="card-hover p-6 text-left group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧹
              </div>
              <div>
                <h2 class="font-semibold text-slate-900">Cleaning</h2>
                <p class="text-sm text-slate-500">View weekly roster</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>

    <footer class="py-6 text-center border-t border-slate-200">
      <router-link to="/admin/login" class="text-xs text-slate-400 hover:text-slate-600 transition">
        Admin
      </router-link>
    </footer>
  </div>
</template>
