export interface AppSettings {
  timezone: string
  dateFormat: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
  timeFormat: '12h' | '24h'
}

const STORAGE_KEY = 'appSettings'

const DEFAULTS: AppSettings = {
  timezone: 'Australia/Brisbane',
  dateFormat: 'dd/mm/yyyy',
  timeFormat: '12h'
}

export const TIMEZONES = [
  { value: 'Australia/Brisbane', label: 'Brisbane (AEST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEST/AEDT)' },
  { value: 'Australia/Melbourne', label: 'Melbourne (AEST/AEDT)' },
  { value: 'Australia/Adelaide', label: 'Adelaide (ACST/ACDT)' },
  { value: 'Australia/Darwin', label: 'Darwin (ACST)' },
  { value: 'Australia/Perth', label: 'Perth (AWST)' },
  { value: 'Australia/Hobart', label: 'Hobart (AEST/AEDT)' },
  { value: 'UTC', label: 'UTC' }
]

export const DATE_FORMATS: { value: AppSettings['dateFormat']; label: string }[] = [
  { value: 'dd/mm/yyyy', label: 'DD/MM/YYYY (Australian)' },
  { value: 'mm/dd/yyyy', label: 'MM/DD/YYYY (US)' },
  { value: 'yyyy-mm-dd', label: 'YYYY-MM-DD (ISO)' }
]

function load(): AppSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export const settingsService = {
  get(): AppSettings {
    return load()
  },
  save(settings: Partial<AppSettings>): AppSettings {
    const updated = { ...load(), ...settings }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  }
}

function partsOf(iso: string, timezone: string, options: Intl.DateTimeFormatOptions) {
  // en-US gives plain "AM"/"PM" (no periods) and plain digit day/month/year parts.
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: timezone, ...options }).formatToParts(new Date(iso))
  return (type: string) => parts.find(p => p.type === type)?.value || ''
}

export function formatDate(iso: string, settings: AppSettings = load()): string {
  const get = partsOf(iso, settings.timezone, { day: '2-digit', month: '2-digit', year: 'numeric' })
  const day = get('day')
  const month = get('month')
  const year = get('year')
  if (settings.dateFormat === 'mm/dd/yyyy') return `${month}/${day}/${year}`
  if (settings.dateFormat === 'yyyy-mm-dd') return `${year}-${month}-${day}`
  return `${day}/${month}/${year}`
}

export function formatTime(iso: string, settings: AppSettings = load()): string {
  const hour12 = settings.timeFormat === '12h'
  const get = partsOf(iso, settings.timezone, { hour: 'numeric', minute: '2-digit', hour12 })
  if (hour12) return `${get('hour')}:${get('minute')}${get('dayPeriod').toLowerCase()}`
  return `${get('hour')}:${get('minute')}`
}

export function formatDateTime(iso: string): string {
  const settings = load()
  return `${formatDate(iso, settings)}, ${formatTime(iso, settings)}`
}
