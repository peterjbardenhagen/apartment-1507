import { config } from '@/config/env'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

/**
 * Get Microsoft Graph access token
 */
async function getMicrosoftToken(): Promise<string | null> {
  try {
    const response = await fetch(
      `https://login.microsoftonline.com/${config.microsoft.tenantId}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          client_id: config.microsoft.clientId,
          client_secret: config.microsoft.clientSecret,
          scope: 'https://graph.microsoft.com/.default',
          grant_type: 'client_credentials'
        })
      }
    )

    if (!response.ok) {
      console.error('Failed to get Microsoft token')
      return null
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error getting Microsoft token:', error)
    return null
  }
}

export const emailService = {
  /**
   * Send email via Microsoft Graph API (Office 365)
   * @param data Email data to send
   */
  async send(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Check if Microsoft credentials are configured
      if (!config.microsoft.clientId || !config.microsoft.clientSecret) {
        console.warn('Microsoft credentials not configured')
        // In development, just log the email
        if (import.meta.env.DEV) {
          console.log('Email would be sent to:', data.to, data)
          return { success: true, messageId: 'dev-' + Date.now() }
        }
        return {
          success: false,
          error: 'Microsoft credentials not configured'
        }
      }

      // Get access token
      const token = await getMicrosoftToken()
      if (!token) {
        return {
          success: false,
          error: 'Failed to authenticate with Microsoft'
        }
      }

      // Send email via Microsoft Graph
      const response = await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: {
            subject: data.subject,
            body: {
              contentType: 'HTML',
              content: data.html
            },
            toRecipients: [
              {
                emailAddress: {
                  address: data.to
                }
              }
            ]
          },
          saveToSentItems: true
        })
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Microsoft Graph error:', error)
        return {
          success: false,
          error: error.error?.message || 'Failed to send email'
        }
      }

      return { success: true, messageId: 'msgraph-' + Date.now() }
    } catch (error) {
      console.error('Email service error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  },

  /**
   * Send enquiry notification to admin
   */
  async sendEnquiryNotification(
    flatmate: string,
    enquiryType: string,
    message: string,
    enquiryId: number
  ): Promise<{ success: boolean; error?: string }> {
    const html = `
      <h2>New Enquiry from ${flatmate}</h2>
      <p><strong>Type:</strong> ${enquiryType}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Enquiry ID: ${enquiryId}</small></p>
      <p><small>Received: ${new Date().toLocaleString()}</small></p>
    `

    const result = await this.send({
      to: config.admin.email,
      subject: `New Enquiry: ${enquiryType} from ${flatmate}`,
      html,
      text: `New Enquiry from ${flatmate}\nType: ${enquiryType}\nMessage: ${message}`
    })

    return {
      success: result.success,
      error: result.error
    }
  },

  /**
   * Send repair request notification to admin
   */
  async sendRepairNotification(
    title: string,
    description: string,
    priority: string,
    repairId: number
  ): Promise<{ success: boolean; error?: string }> {
    const html = `
      <h2>New Repair Request: ${title}</h2>
      <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
      <p><strong>Description:</strong></p>
      <p>${description.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>Repair ID: ${repairId}</small></p>
      <p><small>Received: ${new Date().toLocaleString()}</small></p>
    `

    const result = await this.send({
      to: config.admin.email,
      subject: `New Repair Request: ${title}`,
      html,
      text: `New Repair Request\nTitle: ${title}\nPriority: ${priority}\nDescription: ${description}`
    })

    return {
      success: result.success,
      error: result.error
    }
  }
}
