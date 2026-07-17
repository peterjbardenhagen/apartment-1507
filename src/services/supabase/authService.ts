import { supabase } from '@/lib/supabaseClient'

export interface LoginResult {
  success: boolean
  error?: string
}

// Login takes a username (not an email) to match the app's existing UX, so
// it first resolves the username to whatever email that account's Supabase
// Auth user was created with — see get_login_email() in supabase/schema.sql.
export async function loginWithUsername(username: string, password: string): Promise<LoginResult> {
  const clean = username.trim()
  if (!clean || !password) {
    return { success: false, error: 'Enter your username and password.' }
  }

  const { data: email, error: lookupError } = await supabase.rpc('get_login_email', { p_username: clean })
  if (lookupError || !email) {
    return { success: false, error: 'No account found with that username.' }
  }

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    return { success: false, error: 'Incorrect password.' }
  }

  return { success: true }
}

export async function logout(): Promise<void> {
  await supabase.auth.signOut()
}

export async function getCurrentProfile() {
  const { data: sessionData } = await supabase.auth.getSession()
  const user = sessionData.session?.user
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return profile || null
}
