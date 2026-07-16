import { hashPassword } from './cryptoService'

export interface LandlordAccount {
  name: string
  email: string
  phone: string
  username: string
  passwordHash: string
}

const STORAGE_KEY = 'landlordAccount'

const DEFAULTS: LandlordAccount = {
  name: 'Peter Bardenhagen',
  email: 'peter@bardenhagen.xyz',
  phone: '',
  username: 'peter',
  passwordHash: '' // seeded lazily below since hashing is async
}

let seedPromise: Promise<void> | null = null

async function seedIfMissing(): Promise<void> {
  if (localStorage.getItem(STORAGE_KEY)) return
  const seeded: LandlordAccount = { ...DEFAULTS, passwordHash: await hashPassword('2595') }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
}

async function ensureSeeded(): Promise<void> {
  if (!seedPromise) seedPromise = seedIfMissing()
  return seedPromise
}

export const landlordService = {
  async getLandlord(): Promise<LandlordAccount> {
    await ensureSeeded()
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : { ...DEFAULTS }
  },

  async saveLandlord(details: Partial<LandlordAccount>): Promise<LandlordAccount> {
    const current = await this.getLandlord()
    const updated = { ...current, ...details }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  }
}
