import { supabase } from '@/lib/supabaseClient'

export interface AppSettings {
  timezone: string
  date_format: 'dd/mm/yyyy' | 'mm/dd/yyyy' | 'yyyy-mm-dd'
  time_format: '12h' | '24h'
}

export async function getSettings(): Promise<AppSettings> {
  const { data, error } = await supabase.from('app_settings').select('*').eq('id', 1).single()
  if (error) throw error
  return data as AppSettings
}

export async function saveSettings(changes: Partial<AppSettings>): Promise<void> {
  const { error } = await supabase.from('app_settings').update(changes).eq('id', 1)
  if (error) throw error
}
