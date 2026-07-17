import { hashPassword } from './cryptoService'
import { landlordService } from './landlordService'
import { useTenantStore } from '@/stores/tenant'
import { emailService } from './emailService'

interface ResetToken {
  token: string
  role: 'landlord' | 'tenant'
  tenantId: number | null
  name: string
  expiresAt: number
}

const STORAGE_KEY = 'passwordResetTokens'
const TOKEN_TTL_MS = 30 * 60 * 1000 // 30 minutes

function loadTokens(): ResetToken[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    const tokens: ResetToken[] = stored ? JSON.parse(stored) : []
    return tokens.filter(t => t.expiresAt > Date.now())
  } catch {
    return []
  }
}

function saveTokens(tokens: ResetToken[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens))
}

export interface RequestResetResult {
  // Always true from the caller's perspective — we don't reveal whether an
  // account exists. `emailed` is only used internally/for the dev console.
  emailed: boolean
}

export const passwordResetService = {
  async requestReset(username: string): Promise<RequestResetResult> {
    const clean = username.trim()
    if (!clean) return { emailed: false }

    const tokens = loadTokens().filter(t => t.name.toLowerCase() !== clean.toLowerCase())

    const landlord = await landlordService.getLandlord()
    if (clean.toLowerCase() === landlord.username.toLowerCase()) {
      if (!landlord.email) return { emailed: false }
      const token = crypto.randomUUID()
      tokens.push({ token, role: 'landlord', tenantId: null, name: landlord.username, expiresAt: Date.now() + TOKEN_TTL_MS })
      saveTokens(tokens)
      await this._sendResetEmail(landlord.email, landlord.name, token)
      return { emailed: true }
    }

    const tenantStore = useTenantStore()
    const tenant = tenantStore.findByUsername(clean)
    if (tenant) {
      if (!tenant.email) return { emailed: false }
      const token = crypto.randomUUID()
      tokens.push({ token, role: 'tenant', tenantId: tenant.id, name: tenant.username!, expiresAt: Date.now() + TOKEN_TTL_MS })
      saveTokens(tokens)
      await this._sendResetEmail(tenant.email, tenant.name, token)
      return { emailed: true }
    }

    return { emailed: false }
  },

  async _sendResetEmail(email: string, name: string, token: string): Promise<void> {
    const resetUrl = `${window.location.origin}/reset-password?token=${token}`
    await emailService.send({
      to: email,
      subject: 'Reset your Apartment 1507 password',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${name},</p>
        <p>Click the link below to set a new password. This link expires in 30 minutes.</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you didn't request this, you can ignore this email.</p>
      `,
      text: `Reset your password: ${resetUrl} (expires in 30 minutes)`
    })
  },

  validateToken(token: string): { valid: boolean; name?: string } {
    const record = loadTokens().find(t => t.token === token)
    return record ? { valid: true, name: record.name } : { valid: false }
  },

  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    const tokens = loadTokens()
    const record = tokens.find(t => t.token === token)
    if (!record) {
      return { success: false, error: 'This reset link is invalid or has expired.' }
    }

    const passwordHash = await hashPassword(newPassword)

    if (record.role === 'landlord') {
      await landlordService.saveLandlord({ passwordHash })
    } else {
      const tenantStore = useTenantStore()
      if (record.tenantId !== null) {
        tenantStore.updateTenant(record.tenantId, { passwordHash })
      }
    }

    saveTokens(tokens.filter(t => t.token !== token))
    return { success: true }
  }
}
