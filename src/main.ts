import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { useAuthStore } from '@/stores/auth'

// Views
import Home from './views/Home.vue'
import LandlordLogin from './views/LandlordLogin.vue'
import FlatmateLogin from './views/FlatmateLogin.vue'
import LandlordDashboard from './views/LandlordDashboard.vue'
import FlatmateDashboard from './views/FlatmateDashboard.vue'
import KevinCleaning from './views/KevinCleaning.vue'
import Tenants from './views/Tenants.vue'
import Financials from './views/Financials.vue'
import GuestTracking from './views/GuestTracking.vue'
import Settings from './views/Settings.vue'
import AdminLogin from './views/AdminLogin.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import GuardianSystem from './views/GuardianSystem.vue'
import GuardianDocs from './views/GuardianDocs.vue'
import RequestHelp from './views/RequestHelp.vue'
import RepairRequests from './views/RepairRequests.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/landlord/login', component: LandlordLogin },
  { path: '/flatmate/login', component: FlatmateLogin },
  { path: '/landlord/dashboard', component: LandlordDashboard, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/flatmate/dashboard', component: FlatmateDashboard, meta: { requiresAuth: true, role: 'tenant' } },
  { path: '/landlord/tenants', component: Tenants, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/landlord/financials', component: Financials, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/landlord/guest-tracking', component: GuestTracking, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/landlord/settings', component: Settings, meta: { requiresAuth: true, role: 'admin' } },
  { path: '/kevin-cleaning', component: KevinCleaning, meta: { requiresAuth: true, role: 'tenant' } },
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/guardian', component: GuardianSystem, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/guardian-docs', component: GuardianDocs, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/flatmate/request-help', component: RequestHelp, meta: { requiresAuth: true, role: 'tenant' } },
  { path: '/flatmate/repair-requests', component: RepairRequests, meta: { requiresAuth: true, role: 'tenant' } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')