export interface MessageAttachment {
  name: string
  type: string
  size: number
  dataUrl: string
}

export type ParticipantType = 'landlord' | 'tenant'

export interface MessageParticipant {
  type: ParticipantType
  id: number | 'landlord'
  name: string
}

export interface Message {
  id: number
  from: MessageParticipant
  toType: ParticipantType | 'all'
  toId: number | 'landlord' | 'all'
  toName: string
  subject: string
  body: string
  attachments: MessageAttachment[]
  createdAt: string
}

const STORAGE_KEY = 'apartmentMessages'

function loadAll(): Message[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveAll(messages: Message[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

function isSameParticipant(
  a: { type: string; id: number | string },
  b: { type: string; id: number | string }
): boolean {
  return a.type === b.type && a.id === b.id
}

export const messagesService = {
  getAll(): Message[] {
    return loadAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  // Everything a given user sent, received directly, or was included in via a broadcast to "all".
  getInboxFor(user: MessageParticipant): Message[] {
    return this.getAll().filter(m => {
      const sentByMe = isSameParticipant(m.from, user)
      const sentToMe = m.toType === 'all' || isSameParticipant({ type: m.toType, id: m.toId }, user)
      return sentByMe || sentToMe
    })
  },

  send(message: Omit<Message, 'id' | 'createdAt'>): Message {
    const full: Message = {
      ...message,
      id: Date.now(),
      createdAt: new Date().toISOString()
    }
    const all = loadAll()
    all.push(full)
    saveAll(all)
    return full
  },

  deleteMessage(id: number): void {
    saveAll(loadAll().filter(m => m.id !== id))
  }
}

export function readFileAsAttachment(file: File): Promise<MessageAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        dataUrl: reader.result as string
      })
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
