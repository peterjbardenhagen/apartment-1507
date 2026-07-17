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
  readBy: string[]
}

const STORAGE_KEY = 'apartmentMessages'

function loadAll(): Message[] {
  try {
    const raw: any[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    // Backfill readBy for messages saved before read-tracking existed.
    return raw.map(m => ({ readBy: [], ...m }))
  } catch {
    return []
  }
}

function saveAll(messages: Message[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
}

function participantKey(p: { type: string; id: number | string }): string {
  return `${p.type}:${p.id}`
}

function isSameParticipant(
  a: { type: string; id: number | string },
  b: { type: string; id: number | string }
): boolean {
  return participantKey(a) === participantKey(b)
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

  send(message: Omit<Message, 'id' | 'createdAt' | 'readBy'>): Message {
    const full: Message = {
      ...message,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      readBy: []
    }
    const all = loadAll()
    all.push(full)
    saveAll(all)
    return full
  },

  deleteMessage(id: number): void {
    saveAll(loadAll().filter(m => m.id !== id))
  },

  isRead(message: Message, user: MessageParticipant): boolean {
    return message.readBy.includes(participantKey(user))
  },

  // Marks every message in this user's inbox that they didn't send as read.
  markAllRead(user: MessageParticipant): void {
    const key = participantKey(user)
    const all = loadAll()
    let changed = false
    all.forEach(m => {
      const sentByMe = isSameParticipant(m.from, user)
      const sentToMe = m.toType === 'all' || isSameParticipant({ type: m.toType, id: m.toId }, user)
      if (!sentByMe && sentToMe && !m.readBy.includes(key)) {
        m.readBy.push(key)
        changed = true
      }
    })
    if (changed) saveAll(all)
  },

  getUnreadCount(user: MessageParticipant): number {
    const key = participantKey(user)
    return this.getInboxFor(user).filter(m => !isSameParticipant(m.from, user) && !m.readBy.includes(key)).length
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
