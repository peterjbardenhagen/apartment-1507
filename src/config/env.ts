export const config = {
  // Microsoft Graph/Office 365 Configuration
  microsoft: {
    clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID || '',
    clientSecret: import.meta.env.VITE_MICROSOFT_CLIENT_SECRET || '',
    tenantId: import.meta.env.VITE_MICROSOFT_TENANT_ID || ''
  },

  // Admin Configuration (where enquiries are sent)
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
