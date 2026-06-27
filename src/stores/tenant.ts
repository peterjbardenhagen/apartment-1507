import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTenantStore = defineStore('tenant', () => {
  const tenants = ref([
    {
      id: 1,
      name: 'Kevin',
      room: 'Room 1',
      rent: 450,
      bond: 450,
      leaseStart: '2025-05-01',
      leaseEnd: '2026-04-30',
      contact: '+61 400 000 000',
      email: 'kevin@example.com',
      status: 'active',
      guests: []
    }
  ])

  const addTenant = (tenant: any) => {
    tenants.value.push({ ...tenant, id: Date.now() })
  }

  const updateTenant = (id: number, data: any) => {
    const index = tenants.value.findIndex(t => t.id === id)
    if (index > -1) tenants.value[index] = { ...tenants.value[index], ...data }
  }

  const addGuest = (tenantId: number, guest: any) => {
    const tenant = tenants.value.find(t => t.id === tenantId)
    if (tenant) tenant.guests.push({ ...guest, id: Date.now() })
  }

  const calculateGuestCharge = (guest: any) => {
    // Standard rate for >1-2 nights per week
    const weekRate = 450
    const nights = guest.nights || 0
    if (nights > 2) {
      return (nights - 2) * (weekRate / 7)
    }
    return 0
  }

  return { tenants, addTenant, updateTenant, addGuest, calculateGuestCharge }
})