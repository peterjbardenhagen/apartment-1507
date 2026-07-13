export const config = {
  admin: {
    email: import.meta.env.VITE_ADMIN_EMAIL || 'peter@bardenhagen.xyz'
  },

  app: {
    name: import.meta.env.VITE_APP_NAME || 'Apartment 1507',
    env: import.meta.env.VITE_APP_ENV || 'development'
  }
}

export const isDevelopment = config.app.env === 'development'
export const isProduction = config.app.env === 'production'
