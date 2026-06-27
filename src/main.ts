import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// Views
import Dashboard from './views/Dashboard.vue'
import Tenants from './views/Tenants.vue'
import TenantDetail from './views/TenantDetail.vue'
import Financials from './views/Financials.vue'
import GuestTracking from './views/GuestTracking.vue'
import Settings from './views/Settings.vue'
import Login from './views/Login.vue'

const routes = [
  { path: '/', component: Dashboard },
  { path: '/tenants', component: Tenants },
  { path: '/tenants/:id', component: TenantDetail, props: true },
  { path: '/financials', component: Financials },
  { path: '/guest-tracking', component: GuestTracking },
  { path: '/settings', component: Settings },
  { path: '/login', component: Login }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')