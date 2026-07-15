<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  getFlatmateAgreements,
  createNewAgreement,
  saveFlatmateAgreement,
  addAmendment,
  type FlatmateAgreement,
  type AgreementAmendment
} from '@/services/flatmateAgreementService'

const router = useRouter()
const agreements = ref<FlatmateAgreement[]>([])
const showNewForm = ref(false)
const showAmendmentForm = ref(false)
const selectedAgreement = ref<FlatmateAgreement | null>(null)
const newFlatmateName = ref('')
const newAgreement = ref<Partial<FlatmateAgreement>>({})
const newAmendment = ref<Partial<AgreementAmendment>>({})

const amendmentTypes = [
  { value: 'rent-increase', label: 'Rent Increase' },
  { value: 'utilities-increase', label: 'Utilities Increase' },
  { value: 'conditions-change', label: 'Change of Conditions' }
]

const loadAgreements = () => {
  agreements.value = getFlatmateAgreements()
}

const startNewAgreement = () => {
  newFlatmateName.value = ''
  newAgreement.value = {}
  showNewForm.value = true
}

const submitNewAgreement = () => {
  if (!newFlatmateName.value) return

  const agreement = createNewAgreement(newFlatmateName.value)
  Object.assign(agreement, newAgreement.value)
  saveFlatmateAgreement(agreement)
  loadAgreements()
  showNewForm.value = false
  newFlatmateName.value = ''
  newAgreement.value = {}
}

const startAmendment = (agreement: FlatmateAgreement) => {
  selectedAgreement.value = agreement
  newAmendment.value = {
    type: 'rent-increase',
    agreementId: agreement.id,
    createdAt: new Date().toISOString(),
    id: Date.now().toString()
  }
  showAmendmentForm.value = true
}

const submitAmendment = () => {
  if (!selectedAgreement.value || !newAmendment.value.type || !newAmendment.value.effectiveDate) return

  const amendment = newAmendment.value as AgreementAmendment
  addAmendment(selectedAgreement.value.id, amendment)
  loadAgreements()
  showAmendmentForm.value = false
  selectedAgreement.value = null
  newAmendment.value = {}
}

const downloadAgreementPDF = (agreement: FlatmateAgreement) => {
  // Will implement PDF generation
  console.log('Download agreement PDF:', agreement)
}

loadAgreements()
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 pt-2">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-slate-900">Flatmate Agreements</h1>
        <p class="text-sm text-slate-500 mt-1.5">Create, manage and amend accommodation agreements.</p>
      </div>
      <button @click="startNewAgreement" class="btn-primary self-start sm:self-auto shrink-0">
        + New Agreement
      </button>
    </div>

    <div>
      <!-- New Agreement Form -->
      <div v-if="showNewForm" class="card-elevated p-8 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Create New Agreement</h2>
        <div class="space-y-6">
          <div>
            <label class="input-label">Flatmate Name</label>
            <input v-model="newFlatmateName" type="text" class="input" placeholder="e.g., Jacob Smith" />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="input-label">Start Date</label>
              <input v-model="newAgreement.startDate" type="date" class="input" />
            </div>
            <div>
              <label class="input-label">Weekly Rent</label>
              <input v-model.number="newAgreement.weeklyRent" type="number" class="input" placeholder="60.00" />
            </div>
          </div>

          <div>
            <label class="input-label">Bond Amount</label>
            <input v-model.number="newAgreement.bond" type="number" class="input" />
          </div>

          <div>
            <label class="input-label">Terms & Conditions</label>
            <textarea v-model="newAgreement.terms" rows="5" class="input resize-none" placeholder="Enter agreement terms..."></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t border-slate-100">
            <button @click="submitNewAgreement" class="btn-primary flex-1">Create Agreement</button>
            <button @click="showNewForm = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Agreements List -->
      <div v-if="agreements.length > 0" class="space-y-4">
        <div v-for="agreement in agreements" :key="agreement.id" class="card-elevated p-6">
          <div class="flex justify-between items-start mb-4 pb-4 border-b border-slate-200">
            <div>
              <h3 class="text-lg font-bold text-slate-900">{{ agreement.flatmateName }}</h3>
              <p class="text-sm text-slate-500">Since {{ new Date(agreement.startDate).toLocaleDateString() }}</p>
            </div>
            <span class="badge bg-purple-50 text-purple-700">{{ agreement.amendments.length }} amendments</span>
          </div>

          <div class="grid grid-cols-3 gap-4 mb-6">
            <div>
              <p class="text-xs text-slate-500 mb-1">Weekly Rent</p>
              <p class="text-2xl font-bold text-slate-900">${{ agreement.weeklyRent }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">Bond</p>
              <p class="text-2xl font-bold text-slate-900">${{ agreement.bond }}</p>
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-1">Status</p>
              <p class="text-lg font-semibold text-emerald-600">Active</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button @click="startAmendment(agreement)" class="btn-secondary flex-1">Add Amendment</button>
            <button @click="downloadAgreementPDF(agreement)" class="btn-primary flex-1">Download PDF</button>
          </div>

          <!-- Amendments -->
          <div v-if="agreement.amendments.length > 0" class="mt-6 pt-6 border-t border-slate-200">
            <p class="font-semibold text-slate-900 mb-3">Amendments</p>
            <div class="space-y-2">
              <div v-for="amendment in agreement.amendments" :key="amendment.id" class="text-sm p-3 bg-slate-50 rounded-lg">
                <div class="flex justify-between">
                  <span class="font-medium text-slate-900">{{ amendment.type }}</span>
                  <span class="text-slate-500">{{ new Date(amendment.effectiveDate).toLocaleDateString() }}</span>
                </div>
                <p class="text-slate-600 mt-1">{{ amendment.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Amendment Form -->
      <div v-if="showAmendmentForm && selectedAgreement" class="card-elevated p-8 mb-8">
        <h2 class="text-xl font-bold text-slate-900 mb-6">Add Amendment to {{ selectedAgreement.flatmateName }}'s Agreement</h2>
        <div class="space-y-6">
          <div>
            <label class="input-label">Amendment Type</label>
            <select v-model="newAmendment.type" class="input">
              <option v-for="type in amendmentTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4" v-if="newAmendment.type !== 'conditions-change'">
            <div>
              <label class="input-label">Previous Value</label>
              <input v-model.number="newAmendment.previousValue" type="number" class="input" />
            </div>
            <div>
              <label class="input-label">New Value</label>
              <input v-model.number="newAmendment.newValue" type="number" class="input" />
            </div>
          </div>

          <div>
            <label class="input-label">Effective Date</label>
            <input v-model="newAmendment.effectiveDate" type="date" class="input" />
          </div>

          <div>
            <label class="input-label">Description</label>
            <textarea v-model="newAmendment.description" rows="4" class="input resize-none" placeholder="Describe the amendment..."></textarea>
          </div>

          <div class="flex gap-3 pt-4 border-t border-slate-100">
            <button @click="submitAmendment" class="btn-primary flex-1">Submit Amendment</button>
            <button @click="showAmendmentForm = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>

      <div v-else-if="agreements.length === 0" class="card-elevated p-12 text-center">
        <p class="text-6xl mb-4">📋</p>
        <h3 class="text-lg font-bold text-slate-900 mb-2">No Agreements Yet</h3>
        <p class="text-slate-600 mb-6">Create your first flatmate agreement to get started</p>
        <button @click="startNewAgreement" class="btn-primary">Create Agreement</button>
      </div>
    </div>
  </div>
</template>
