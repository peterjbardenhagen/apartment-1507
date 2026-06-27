<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const sidebarOpen = ref(true)

const navigation = [
  { name: 'Dashboard', path: '/', icon: '📊' },
  { name: 'Tenants', path: '/tenants', icon: '👥' },
  { name: 'Financials', path: '/financials', icon: '💰' },
  { name: 'Guest Tracking', path: '/guest-tracking', icon: '👥' },
  { name: 'Settings', path: '/settings', icon: '⚙️' }
]

onMounted(() => {
  auth.init()
})

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex" v-if="auth.isAuthenticated">
    <!-- Sidebar -->
    <nav :class="[sidebarOpen ? 'w-64' : 'w-20', 'bg-slate-900 text-white transition-all duration-300']">
      <div class="p-4 border-b border-slate-700">
        <h1 class="text-xl font-bold">🏢 Apartment 1507</h1>
        <p class="text-xs text-slate-400">Property Management</p>
      </div>
      
      <div class="p-4">
        <div v-for="item in navigation" :key="item.path" class="mb-2">
          <router-link 
            :to="item.path" 
            class="flex items-center p-3 rounded-lg hover:bg-slate-800 transition-colors"
            active-class="bg-green-600"
          >
            <span class="text-xl mr-3">{{ item.icon }}</span>
            <span v-if="sidebarOpen">{{ item.name }}</span>
          </router-link>
        </div>
      </div>
      
      <div class="absolute bottom-0 w-full p-4 border-t border-slate-700">
        <div class="flex items-center mb-3">
          <span class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">
            {{ auth.user?.initials }}
          </span>
          <span v-if="sidebarOpen" class="ml-3">{{ auth.user?.name }}</span>
        </div>
        <button @click="logout" v-if="sidebarOpen" class="text-sm text-slate-400 hover:text-white">
          Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="flex-1 overflow-auto">
      <header class="bg-white shadow-sm border-b p-4 flex justify-between items-center">
        <button @click="sidebarOpen = !sidebarOpen" class="p-2 hover:bg-slate-100 rounded">
          ☰
        </button>
        <h2 class="text-lg font-semibold text-slate-800">{{ $route.name }}</h2>
        <div></div>
      </header>
      <main class="p-6">
        <router-view />
      </main>
    </div>
  </div>
  
  <router-view v-else />
</template>

<style scoped>
.router-link-active {
  @apply bg-green-600;
}
</style>