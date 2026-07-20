<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { landlordService, type LandlordAccount } from '@/services/landlordService'
import {
  messagesService,
  readFileAsAttachment,
  type Message,
  type MessageParticipant,
  type MessageAttachment
} from '@/services/messagesService'
import { emailService } from '@/services/emailService'
import { formatDateTime } from '@/services/settingsService'

const auth = useAuthStore()
const tenantStore = useTenantStore()

const landlord = ref<LandlordAccount | null>(null)
const messages = ref<Message[]>([])
const unreadIds = ref<Set<number>>(new Set())
const searchQuery = ref('')
const showCompose = ref(false)
const sending = ref(false)
const sendError = ref('')
const sendSuccess = ref(false)

const recipientKey = ref('all')
const subject = ref('')
const body = ref('')
const attachments = ref<MessageAttachment[]>([])
const attachmentError = ref('')

const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024 // 4MB, localStorage-friendly

const me = computed<MessageParticipant>(() => {
  if (auth.isAdminAuthenticated) {
    return { type: 'landlord', id: 'landlord', name: landlord.value?.name || 'Landlord' }
  }
  return { type: 'tenant', id: auth.currentTenantId as number, name: auth.name }
})

interface RecipientOption {
  key: string
  label: string
  toType: 'landlord' | 'tenant' | 'all'
  toId: number | 'landlord' | 'all'
  toName: string
  email: string
}

const recipientOptions = computed<RecipientOption[]>(() => {
  const options: RecipientOption[] = [
    { key: 'all', label: 'Everyone', toType: 'all', toId: 'all', toName: 'Everyone', email: '' }
  ]

  if (me.value.type !== 'landlord' && landlord.value) {
    options.push({
      key: 'landlord',
      label: `${landlord.value.name} (Landlord)`,
      toType: 'landlord',
      toId: 'landlord',
      toName: landlord.value.name,
      email: landlord.value.email
    })
  }

  tenantStore.tenants.forEach(t => {
    if (me.value.type === 'tenant' && t.id === me.value.id) return
    options.push({
      key: `tenant-${t.id}`,
      label: t.name,
      toType: 'tenant',
      toId: t.id,
      toName: t.name,
      email: t.email
    })
  })

  return options
})

const isMine = (m: Message) => m.from.type === me.value.type && m.from.id === me.value.id

const recipientLabel = (m: Message) => {
  if (m.toType === 'all') return 'Everyone'
  return m.toName
}

const loadMessages = () => {
  const inbox = messagesService.getInboxFor(me.value)
  // Snapshot which messages were unread *before* we mark them read below, so
  // the "New" indicator still shows for this viewing even once persisted.
  inbox.forEach(m => {
    if (!isMine(m) && !messagesService.isRead(m, me.value)) {
      unreadIds.value.add(m.id)
    }
  })
  messages.value = inbox
  messagesService.markAllRead(me.value)
}

const filteredMessages = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return messages.value
  return messages.value.filter(m =>
    m.subject.toLowerCase().includes(q) ||
    m.body.toLowerCase().includes(q) ||
    m.from.name.toLowerCase().includes(q) ||
    recipientLabel(m).toLowerCase().includes(q)
  )
})

onMounted(async () => {
  landlord.value = await landlordService.getLandlord()
  loadMessages()
})

const resetCompose = () => {
  recipientKey.value = 'all'
  subject.value = ''
  body.value = ''
  attachments.value = []
  attachmentError.value = ''
  sendError.value = ''
}

const handleFiles = async (event: Event) => {
  attachmentError.value = ''
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_BYTES) {
      attachmentError.value = `"${file.name}" is too large (max 4MB per file).`
      continue
    }
    try {
      attachments.value.push(await readFileAsAttachment(file))
    } catch {
      attachmentError.value = `Couldn't read "${file.name}".`
    }
  }
  input.value = ''
}

const removeAttachment = (index: number) => {
  attachments.value.splice(index, 1)
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const sendMessage = async () => {
  if (!body.value.trim()) return
  sending.value = true
  sendError.value = ''
  sendSuccess.value = false

  const option = recipientOptions.value.find(o => o.key === recipientKey.value)
  if (!option) {
    sendError.value = 'Choose a recipient.'
    sending.value = false
    return
  }

  const sent = messagesService.send({
    from: me.value,
    toType: option.toType,
    toId: option.toId,
    toName: option.toName,
    subject: subject.value.trim(),
    body: body.value.trim(),
    attachments: attachments.value
  })

  // Email whoever is being messaged, if they have an email on file.
  const recipients: { email: string; label: string }[] = []
  if (option.toType === 'all') {
    if (me.value.type !== 'landlord' && landlord.value?.email) {
      recipients.push({ email: landlord.value.email, label: 'Everyone' })
    }
    tenantStore.tenants.forEach(t => {
      if (me.value.type === 'tenant' && t.id === me.value.id) return
      if (t.email) recipients.push({ email: t.email, label: 'Everyone' })
    })
  } else if (option.email) {
    recipients.push({ email: option.email, label: option.toName })
  }

  await Promise.all(
    recipients.map(r =>
      emailService.sendMessageNotification(
        r.email,
        me.value.name,
        r.label,
        sent.subject,
        sent.body,
        sent.attachments.length
      )
    )
  )

  loadMessages()
  sendSuccess.value = true
  resetCompose()
  sending.value = false
  showCompose.value = false
  setTimeout(() => { sendSuccess.value = false }, 3000)
}

const formatDate = (iso: string) => formatDateTime(iso)
</script>

<template>
  <div class="space-y-6">
    <!-- Compose toggle -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p class="text-sm text-slate-500">{{ messages.length }} message{{ messages.length === 1 ? '' : 's' }}</p>
      <button @click="showCompose = !showCompose" class="btn-primary self-start sm:self-auto">
        {{ showCompose ? 'Cancel' : '+ New Message' }}
      </button>
    </div>

    <!-- Search -->
    <div v-if="messages.length > 0" class="relative">
      <svg class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"/>
      </svg>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search messages…"
        class="input pl-10"
      />
    </div>

    <transition name="fade">
      <div v-if="sendSuccess" class="alert-success">
        <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
        </svg>
        <span>Message sent.</span>
      </div>
    </transition>

    <!-- Compose form -->
    <div v-if="showCompose" class="card-elevated p-6 sm:p-7 space-y-5">
      <div>
        <label class="input-label">To</label>
        <select v-model="recipientKey" class="input">
          <option v-for="o in recipientOptions" :key="o.key" :value="o.key">{{ o.label }}</option>
        </select>
      </div>

      <div>
        <label class="input-label">Subject (optional)</label>
        <input v-model="subject" type="text" class="input" placeholder="e.g. Rent increase notice" />
      </div>

      <div>
        <label class="input-label">Message</label>
        <textarea v-model="body" rows="5" class="input resize-none" placeholder="Write your message..."></textarea>
      </div>

      <div>
        <label class="input-label">Attachments (optional)</label>
        <input type="file" multiple @change="handleFiles" class="block w-full text-sm text-slate-600" />
        <p v-if="attachmentError" class="text-xs text-red-600 mt-1.5">{{ attachmentError }}</p>
        <ul v-if="attachments.length" class="mt-3 space-y-2">
          <li
            v-for="(a, i) in attachments"
            :key="i"
            class="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-50 text-sm"
          >
            <span class="truncate text-slate-700">{{ a.name }} <span class="text-slate-400">({{ formatBytes(a.size) }})</span></span>
            <button @click="removeAttachment(i)" class="text-red-500 hover:text-red-700 text-xs font-semibold shrink-0">Remove</button>
          </li>
        </ul>
      </div>

      <p v-if="sendError" class="text-sm text-red-600">{{ sendError }}</p>

      <div class="flex gap-3 pt-2 border-t border-slate-100">
        <button @click="sendMessage" :disabled="sending || !body.trim()" class="btn-primary flex-1">
          {{ sending ? 'Sending…' : 'Send Message' }}
        </button>
        <button @click="showCompose = false" class="btn-secondary">Cancel</button>
      </div>
    </div>

    <!-- Inbox -->
    <div v-if="messages.length === 0" class="card-elevated p-12 text-center">
      <div class="text-4xl mb-3">✉️</div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">No Messages Yet</h3>
      <p class="text-slate-600">Start a conversation with your flatmates or landlord</p>
    </div>

    <div v-else-if="filteredMessages.length === 0" class="card-elevated p-12 text-center">
      <div class="text-4xl mb-3">🔍</div>
      <h3 class="text-lg font-bold text-slate-900 mb-2">No Matches</h3>
      <p class="text-slate-600">No messages match "{{ searchQuery }}"</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="m in filteredMessages"
        :key="m.id"
        :class="['card-elevated p-5 sm:p-6', isMine(m) ? 'border-l-4 border-l-emerald-500' : 'border-l-4 border-l-purple-500']"
      >
        <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-slate-900">
              {{ m.from.name }}
              <span class="text-slate-400 font-normal">→</span>
              {{ recipientLabel(m) }}
            </p>
            <p v-if="m.subject" class="text-sm font-medium text-slate-700 mt-0.5">{{ m.subject }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span v-if="unreadIds.has(m.id)" class="badge-danger">New</span>
            <span v-if="isMine(m)" class="badge-success">Sent</span>
            <span v-else class="badge-info">Received</span>
          </div>
        </div>
        <p class="text-sm text-slate-600 whitespace-pre-wrap">{{ m.body }}</p>

        <div v-if="m.attachments.length" class="flex flex-wrap gap-2 mt-3">
          <a
            v-for="(a, i) in m.attachments"
            :key="i"
            :href="a.dataUrl"
            :download="a.name"
            class="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full transition"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            {{ a.name }}
          </a>
        </div>

        <p class="text-xs text-slate-400 mt-3">{{ formatDate(m.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>
