export const config = {
  // Sendgrid Configuration
  sendgrid: {
    apiKey: import.meta.env.VITE_SENDGRID_API_KEY || '',
    fromEmail: import.meta.env.VITE_SENDGRID_FROM_EMAIL || 'noreply@apartment-1507.local'
  },

  // Microsoft Configuration
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_MICROSOFT_CLIENT_SECRET || '',
    tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID || ''
  },

  // Admin Configuration
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || 'peter@bardenhagen.xyz'
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Apartment 1507',
    env: import.meta.env.VITE_APP_ENV || 'development'
  }
}

export const isDevelopment = config.app.env === 'development'
export const isProduction = config.app.env === 'production'
