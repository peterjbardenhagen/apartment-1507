import { ref, watch } from 'vue'
import { defineStore } from 'pinia'

export interface Guest {
  id: number
  name: string
  nights: number
}

export type RentCycle = 'weekly' | 'fortnightly' | 'monthly'

export interface Tenant {
  id: number
  name: string
  room: string
  rent: number
  bond: number
  leaseStart: string
  leaseEnd: string
  contact: string
  email: string
  status: string
  guests: Guest[]
  username?: string
  passwordHash?: string
  // Rent is always paid in advance. rentCycle is the ongoing cadence once any
  // upfront advance payment (advancePaidUntil) runs out.
  rentCycle?: RentCycle
  advancePaidUntil?: string
  billsIncluded?: boolean
  billsIncludedAmount?: number
}

const STORAGE_KEY = 'tenants'

const DEFAULT_TENANTS: Tenant[] = [
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
]

function loadInitial(): Tenant[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : [...DEFAULT_TENANTS]
  } catch {
    return [...DEFAULT_TENANTS]
  }
}

export const useTenantStore = defineStore('tenant', () => {
  const tenants = ref<Tenant[]>(loadInitial())

  watch(
    tenants,
    (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)),
    { deep: true }
  )

  const addTenant = (tenant: Partial<Tenant>) => {
    tenants.value.push({ guests: [], ...tenant, id: Date.now() } as Tenant)
  }

  const updateTenant = (id: number, data: Partial<Tenant>) => {
    const index = tenants.value.findIndex(t => t.id === id)
    if (index > -1) tenants.value[index] = { ...tenants.value[index], ...data }
  }

  const deleteTenant = (id: number) => {
    tenants.value = tenants.value.filter(t => t.id !== id)
  }

  const getTenant = (id: number) => tenants.value.find(t => t.id === id)

  const findByUsername = (username: string) =>
    tenants.value.find(t => t.username && t.username.toLowerCase() === username.toLowerCase())

  const addGuest = (tenantId: number, guest: Partial<Guest>) => {
    const tenant = tenants.value.find(t => t.id === tenantId)
    if (tenant) tenant.guests.push({ ...guest, id: Date.now() } as Guest)
  }

  const calculateGuestCharge = (guest: Guest) => {
    // Standard rate for >1-2 nights per week
    const weekRate = 450
    const nights = guest.nights || 0
    if (nights > 2) {
      return (nights - 2) * (weekRate / 7)
    }
    return 0
  }

  return {
    tenants,
    addTenant,
    updateTenant,
    deleteTenant,
    getTenant,
    findByUsername,
    addGuest,
    calculateGuestCharge
  }
})
