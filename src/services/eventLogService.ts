export type EventType = 'login' | 'warning' | 'error'

export interface EventLogEntry {
  id: number
  timestamp: string
  type: EventType
  message: string
  actor?: string
}

const STORAGE_KEY = 'eventLog'
const MAX_ENTRIES = 500

function loadAll(): EventLogEntry[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(entries: EventLogEntry[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(-MAX_ENTRIES)))
}

export const eventLogService = {
  log(type: EventType, message: string, actor?: string): void {
    const entries = loadAll()
    entries.push({ id: Date.now() + Math.random(), timestamp: new Date().toISOString(), type, message, actor })
    saveAll(entries)
  },

  getAll(): EventLogEntry[] {
    return loadAll().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  },

  clear(): void {
    localStorage.removeItem(STORAGE_KEY)
  }
}
