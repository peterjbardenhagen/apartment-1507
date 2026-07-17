import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'
import { useAuthStore } from '@/stores/auth'
import { ensureCoreTenants } from '@/services/coreTenantsBootstrap'
import { eventLogService } from '@/services/eventLogService'

import Home from './views/Home.vue'
import Login from './views/Login.vue'
import ForgotPassword from './views/ForgotPassword.vue'
import ResetPassword from './views/ResetPassword.vue'
import AdminDashboard from './views/AdminDashboard.vue'
import FlatmateDashboard from './views/FlatmateDashboard.vue'
import RequestHelp from './views/RequestHelp.vue'
import RepairRequests from './views/RepairRequests.vue'
import KevinCleaning from './views/KevinCleaning.vue'
import Tenants from './views/Tenants.vue'
import TenantForm from './views/TenantForm.vue'
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
import AdminLandlordDetails from './views/AdminLandlordDetails.vue'
import AdminMessages from './views/AdminMessages.vue'
import AdminContacts from './views/AdminContacts.vue'
import AdminEventLog from './views/AdminEventLog.vue'
import FlatmateMessages from './views/FlatmateMessages.vue'
import FlatmateContacts from './views/FlatmateContacts.vue'
import HealthServices from './views/HealthServices.vue'

const ADMIN = { role: 'admin_portal' }
const PUBLIC_AUTH_PATHS = ['/login', '/forgot-password', '/reset-password']

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/forgot-password', component: ForgotPassword },
  { path: '/reset-password', component: ResetPassword },
  { path: '/admin/login', redirect: '/login' },
  { path: '/admin/dashboard', component: AdminDashboard, meta: ADMIN },
  { path: '/admin/tenants', component: Tenants, meta: ADMIN },
  { path: '/admin/tenants/new', component: TenantForm, meta: ADMIN },
  { path: '/admin/tenants/:id', component: TenantForm, meta: ADMIN },
  { path: '/admin/messages', component: AdminMessages, meta: ADMIN },
  { path: '/admin/contacts', component: AdminContacts, meta: ADMIN },
  { path: '/admin/event-log', component: AdminEventLog, meta: ADMIN },
  { path: '/admin/landlord-details', component: AdminLandlordDetails, meta: ADMIN },
  { path: '/admin/financials', component: Financials, meta: ADMIN },
  { path: '/admin/guest-tracking', component: GuestTracking, meta: ADMIN },
  { path: '/admin/settings', component: Settings, meta: ADMIN },
  { path: '/admin/guardian', component: GuardianSystem, meta: ADMIN },
  { path: '/admin/guardian-docs', component: GuardianDocs, meta: ADMIN },
  { path: '/admin/enquiries', component: AdminEnquiries, meta: ADMIN },
  { path: '/admin/transactions', component: TransactionImport, meta: ADMIN },
  { path: '/admin/flatmate-agreements', component: FlatmateAgreementManager, meta: ADMIN },
  { path: '/admin/boarding-agreements', component: AdminBoardingAgreements, meta: ADMIN },
  { path: '/admin/utilities-evidence', component: AdminUtilitiesEvidence, meta: ADMIN },
  { path: '/admin/payment-requests', component: PaymentRequestCreator, meta: ADMIN },
  { path: '/admin/receipts', component: ReceiptCreator, meta: ADMIN },
  { path: '/flatmate/dashboard', component: FlatmateDashboard },
  { path: '/flatmate/request-help', component: RequestHelp },
  { path: '/flatmate/repair-requests', component: RepairRequests },
  { path: '/flatmate/utilities', component: FlatmateUtilities },
  { path: '/flatmate/messages', component: FlatmateMessages },
  { path: '/flatmate/contacts', component: FlatmateContacts },
  { path: '/flatmate/health-services', component: HealthServices },
  { path: '/kevin-cleaning', component: KevinCleaning }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.path === '/login' && auth.isLoggedIn) {
    next(auth.isAdminAuthenticated ? '/admin/dashboard' : '/flatmate/dashboard')
    return
  }

  if (PUBLIC_AUTH_PATHS.includes(to.path)) {
    next()
    return
  }

  if (!auth.isLoggedIn) {
    next('/login')
    return
  }

  if (to.meta.role === 'admin_portal' && !auth.isAdminAuthenticated) {
    next('/flatmate/dashboard')
    return
  }

  next()
})

const app = createApp(App)
app.use(createPinia())
app.use(router)

ensureCoreTenants()

app.config.errorHandler = (err, _instance, info) => {
  const message = err instanceof Error ? err.message : String(err)
  eventLogService.log('error', `${message} (${info})`)
  console.error(err)
}
window.addEventListener('error', (event) => {
  eventLogService.log('error', event.message)
})
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason instanceof Error ? event.reason.message : String(event.reason)
  eventLogService.log('error', `Unhandled promise rejection: ${reason}`)
})

app.mount('#app')
