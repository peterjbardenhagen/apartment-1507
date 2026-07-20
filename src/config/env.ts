export const config = {
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || 'peter@bardenhagen.xyz'
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'Apartment 1507',
    env: import.meta.env.VITE_APP_ENV || 'development'
  },

  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || ''
  }
}

export const isDevelopment = config.app.env === 'development'
export const isProduction = config.app.env === 'production'
