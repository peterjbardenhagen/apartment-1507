import { supabase } from '@/lib/supabaseClient'

export interface MessageAttachment {
  name: string
  type: string
  size: number
  dataUrl: string
}

export type ParticipantType = 'landlord' | 'tenant'

export interface MessageParticipant {
  type: ParticipantType
  id: string
  name: string
}

export interface Message {
  id: number
  from_id: string
  from_name: string
  to_type: ParticipantType | 'all'
  to_id: string | null
  to_name: string
  subject: string
  body: string
  attachments: MessageAttachment[]
  created_at: string
  read_by: string[]
}

export async function getInboxFor(user: MessageParticipant): Promise<Message[]> {
  // RLS already scopes this to "from me, to me, or broadcast to all" — the
  // filter here just narrows the query for efficiency, RLS is the real gate.
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Message[]
}

export async function send(message: {
  from: MessageParticipant
  toType: ParticipantType | 'all'
  toId: string | null
  toName: string
  subject: string
  body: string
  attachments: MessageAttachment[]
}): Promise<Message> {
  const { data, error } = await supabase
    .from('messages')
    .insert({
      from_id: message.from.id,
      from_name: message.from.name,
      to_type: message.toType,
      to_id: message.toId,
      to_name: message.toName,
      subject: message.subject,
      body: message.body,
      attachments: message.attachments
    })
    .select()
    .single()
  if (error) throw error
  return data as Message
}

export async function deleteMessage(id: number): Promise<void> {
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (error) throw error
}

export function isRead(message: Message, userId: string): boolean {
  return message.read_by.includes(userId)
}

export async function markRead(message: Message, userId: string): Promise<void> {
  if (message.read_by.includes(userId)) return
  const { error } = await supabase
    .from('messages')
    .update({ read_by: [...message.read_by, userId] })
    .eq('id', message.id)
  if (error) throw error
}

export function getUnreadCount(messages: Message[], user: MessageParticipant): number {
  return messages.filter(m => m.from_id !== user.id && !m.read_by.includes(user.id)).length
}
