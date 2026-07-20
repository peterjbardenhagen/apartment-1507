<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTenantStore } from '@/stores/tenant'
import { emailService } from '@/services/emailService'

const auth = useAuthStore()
const tenantStore = useTenantStore()

const currentTenant = ref(
  tenantStore.findByUsername(auth.currentUser?.username || '') || null
)

const tenantName = ref(currentTenant.value?.name || '')
const isSending = ref(false)
const sent = ref(false)
const error = ref('')

const hotelEmails = [
  'larrissa.niemi@artserieshotels.com.au',
  'johnson.switch@artserieshotels.com.au',
  'johnson.res@artserieshotels.com.au'
]

const emailSubject = 'Long-term resident registration - Apartment 1507'
const emailBody = computed(() => {
  const name = tenantName.value || '[Your Name]'
  return `Hi,

I'm a resident at Apartment 1507 and will be staying long term. I'd like to register on the computer in case I ever lock myself out.

I have CC'd Peter Bardenhagen on this email.

Could you let me know what the process is for getting registered? Should I bring my ID down to reception?

Thank you,
${name}
Apartment 1507`
})

const mailtoLink = computed(() => {
  const to = hotelEmails.join(',')
  const cc = 'peter@bardenhagen.xyz'
  const body = encodeURIComponent(emailBody.value)
  return `mailto:${to}?cc=${cc}&subject=${encodeURIComponent(emailSubject)}&body=${body}`
})

async function sendEmail() {
  if (!tenantName.value) {
    error.value = 'Please enter your name'
    return
  }
  isSending.value = true
  error.value = ''

  try {
    const html = emailBody.value.replace(/\n/g, '<br>')
    const result = await emailService.send({
      to: hotelEmails.join(', '),
      subject: emailSubject,
      html,
      text: emailBody.value
    })

    if (result.success) {
      sent.value = true
    } else {
      error.value = result.error || 'Failed to send'
    }
  } catch (e) {
    error.value = 'Failed to send email'
  } finally {
    isSending.value = false
  }
}

async function sendForJacob() {
  tenantName.value = 'Jacob Doyle'
  await sendEmail()
}
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div>
      <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Hotel Registration</h1>
      <p class="text-sm text-slate-500 mt-1.5">Register with the Art Series Hotel for after-hours keycard access.</p>
    </div>

    <div class="card-elevated p-6 sm:p-8">
      <h2 class="text-lg font-bold text-slate-900 mb-4">About Building Registration</h2>
      <p class="text-sm text-slate-600 mb-3">
        Apartment 1507 is part of the <strong>Art Series Hotel</strong> complex at 477 Boundary St, Spring Hill. 
        Long-term residents need to register with hotel reception so keycard access works after hours and for building amenities.
      </p>
      <div class="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <strong>📍 Hotel Reception:</strong> Ground floor, 477 Boundary Street, Spring Hill QLD 4000
      </div>
    </div>

    <div class="card-elevated p-6 sm:p-8">
      <h2 class="text-lg font-bold text-slate-900 mb-4">Send Registration Request</h2>

      <div class="space-y-4">
        <div>
          <label class="input-label">Your Name</label>
          <input v-model="tenantName" type="text" class="input" placeholder="Enter your full name" />
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4">
          <p class="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-2">Email Preview</p>
          <p class="text-xs text-slate-400 mb-1"><strong>To:</strong> {{ hotelEmails.join(', ') }}</p>
          <p class="text-xs text-slate-400 mb-1"><strong>CC:</strong> peter@bardenhagen.xyz</p>
          <p class="text-xs text-slate-400 mb-3"><strong>Subject:</strong> {{ emailSubject }}</p>
          <pre class="text-sm text-slate-700 whitespace-pre-wrap font-sans">{{ emailBody }}</pre>
        </div>

        <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{{ error }}</div>
        <div v-if="sent" class="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          ✅ Registration request sent! The hotel team will be in touch.
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button @click="sendEmail" :disabled="isSending" class="btn-primary flex-1">
            {{ isSending ? 'Sending...' : 'Send Registration Email' }}
          </button>
          <a :href="mailtoLink" class="btn-secondary text-center inline-flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
            Open in Mail App
          </a>
        </div>
      </div>
    </div>

    <div class="card-elevated p-6 sm:p-8">
      <h2 class="text-lg font-bold text-slate-900 mb-3">Quick Actions</h2>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
          <div>
            <p class="font-semibold text-slate-900">Jacob Doyle</p>
            <p class="text-sm text-slate-500">Room 3 — registering as new tenant</p>
          </div>
          <button @click="sendForJacob" :disabled="isSending || sent" class="btn-primary text-sm px-4 py-2">
            Register Jacob
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
