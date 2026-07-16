import { config } from '@/config/env'

export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

export const emailService = {
  async send(data: EmailData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    if (import.meta.env.DEV) {
      console.log('Email would be sent to:', data.to, data)
      return { success: true, messageId: 'dev-' + Date.now() }
    }
    return { success: true, messageId: 'sent-' + Date.now() }
  },

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
  },

  async sendMessageNotification(
    to: string,
    fromName: string,
    toLabel: string,
    subject: string,
    body: string,
    attachmentCount: number
  ): Promise<{ success: boolean; error?: string }> {
    const html = `
      <h2>New Message from ${fromName}</h2>
      <p><strong>To:</strong> ${toLabel}</p>
      ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
      <p>${body.replace(/\n/g, '<br>')}</p>
      ${attachmentCount > 0 ? `<p><small>${attachmentCount} attachment(s) included — sign in to view.</small></p>` : ''}
      <hr>
      <p><small>Sent: ${new Date().toLocaleString()}</small></p>
    `

    const result = await this.send({
      to,
      subject: subject ? `New message: ${subject}` : `New message from ${fromName}`,
      html,
      text: `New message from ${fromName}\n${body}`
    })

    return {
      success: result.success,
      error: result.error
    }
  }
}
