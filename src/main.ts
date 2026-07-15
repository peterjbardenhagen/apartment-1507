import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { useAuthStore } from '@/stores/auth'

import Home from './views/Home.vue'
import AdminLogin from './views/AdminLogin.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import FlatmateDashboard from './views/FlatmateDashboard.vue'
import RequestHelp from './views/RequestHelp.vue'
import RepairRequests from './views/RepairRequests.vue'
import KevinCleaning from './views/KevinCleaning.vue'
import Tenants from './views/Tenants.vue'
import Financials from './views/Financials.vue'
import GuestTracking from './views/GuestTracking.vue'
import Settings from './views/Settings.vue'
import GuardianSystem from './views/GuardianSystem.vue'
import GuardianDocs from './views/GuardianDocs.vue'
import AdminEnquiries from './views/AdminEnquiries.vue'
import TransactionImport from './views/TransactionImport.vue'
import FlatmateUtilities from './views/FlatmateUtilities.vue'
import FlatmateAgreementManager from './views/FlatmateAgreementManager.vue'
import PaymentRequestCreator from './views/PaymentRequestCreator.vue'
import ReceiptCreator from './views/ReceiptCreator.vue'
import AdminBoardingAgreements from './views/AdminBoardingAgreements.vue'
import AdminUtilitiesEvidence from './views/AdminUtilitiesEvidence.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/admin/login', component: AdminLogin },
  { path: '/admin/dashboard', component: AdminDashboard, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/tenants', component: Tenants, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/financials', component: Financials, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/guest-tracking', component: GuestTracking, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/settings', component: Settings, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/guardian', component: GuardianSystem, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/guardian-docs', component: GuardianDocs, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/enquiries', component: AdminEnquiries, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/transactions', component: TransactionImport, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/flatmate-agreements', component: FlatmateAgreementManager, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/boarding-agreements', component: AdminBoardingAgreements, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/utilities-evidence', component: AdminUtilitiesEvidence, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/payment-requests', component: PaymentRequestCreator, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/admin/receipts', component: ReceiptCreator, meta: { requiresAuth: true, role: 'admin_portal' } },
  { path: '/flatmate/dashboard', component: FlatmateDashboard },
  { path: '/flatmate/request-help', component: RequestHelp },
  { path: '/flatmate/repair-requests', component: RepairRequests },
  { path: '/flatmate/utilities', component: FlatmateUtilities },
  { path: '/kevin-cleaning', component: KevinCleaning }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.isAdminAuthenticated) {
    next('/admin/login')
  } else {
    next()
  }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')
