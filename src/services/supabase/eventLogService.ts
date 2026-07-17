import { supabase } from '@/lib/supabaseClient'

export type EventType = 'login' | 'warning' | 'error'

export interface EventLogEntry {
  id: number
  type: EventType
  message: string
  actor: string | null
  created_at: string
}

export async function logEvent(type: EventType, message: string, actor?: string): Promise<void> {
  // Best-effort: a logging failure should never block the action being logged.
  const { error } = await supabase.from('event_log').insert({ type, message, actor: actor || null })
  if (error) console.error('event_log insert failed', error)
}

export async function getAll(): Promise<EventLogEntry[]> {
  const { data, error } = await supabase
    .from('event_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error
  return data as EventLogEntry[]
}

export async function clear(): Promise<void> {
  const { error } = await supabase.from('event_log').delete().neq('id', 0)
  if (error) throw error
}
