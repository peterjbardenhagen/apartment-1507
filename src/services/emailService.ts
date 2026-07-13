import { config } from '@/config/env'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export const emailService = {
  /**
   * Send email via Sendgrid API
   * @param data Email data to send
   */
  async send(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Check if API key is configured
      if (!config.sendgrid.apiKey) {
        console.warn('Sendgrid API key not configured')
        // In development, just log the email
        if (import.meta.env.DEV) {
          console.log('Email would be sent:', data)
          return { success: true, messageId: 'dev-' + Date.now() }
        }
        return {
          success: false,
          error: 'Sendgrid API key not configured'
        }
      }

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${config.sendgrid.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: data.to }],
              subject: data.subject
            }
          ],
          from: {
            email: config.sendgrid.fromEmail,
            name: 'Apartment 1507'
          },
          content: [
            {
              type: 'text/html',
              value: data.html
            },
            ...(data.text ? [{ type: 'text/plain', value: data.text }] : [])
          ]
        })
      })

      if (!response.ok) {
        const error = await response.json()
        return {
          success: false,
          error: error.message || 'Failed to send email'
        }
      }

      const messageId = response.headers.get('x-message-id') || 'unknown'
      return { success: true, messageId }
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
