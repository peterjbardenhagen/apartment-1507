import tenantAgreementsData from '@/data/tenantAgreements.json'

export interface FlatmateAgreement {
  id: string
  flatmateName: string
  startDate: string
  endDate: string | null
  weeklyRent: number
  bond: number
  utilities: {
    electricity?: number
    water?: number
    broadband?: number
  }
  terms: string
  createdAt: string
  amendments: AgreementAmendment[]
}

export interface AgreementAmendment {
  id: string
  agreementId: string
  type: 'rent-increase' | 'utilities-increase' | 'conditions-change'
  description: string
  previousValue?: number
  newValue?: number
  effectiveDate: string
  createdAt: string
}

export function saveFlatmateAgreement(agreement: FlatmateAgreement): void {
  const agreements = JSON.parse(localStorage.getItem('flatmateAgreements') || '[]')
  const existing = agreements.findIndex((a: FlatmateAgreement) => a.id === agreement.id)
  if (existing >= 0) {
    agreements[existing] = agreement
  } else {
    agreements.push(agreement)
  }
  localStorage.setItem('flatmateAgreements', JSON.stringify(agreements))
}

export function getFlatmateAgreements(): FlatmateAgreement[] {
  return JSON.parse(localStorage.getItem('flatmateAgreements') || '[]')
}

export function getFlatmateAgreement(id: string): FlatmateAgreement | null {
  const agreements = getFlatmateAgreements()
  return agreements.find((a: FlatmateAgreement) => a.id === id) || null
}

export function addAmendment(agreementId: string, amendment: AgreementAmendment): void {
  const agreement = getFlatmateAgreement(agreementId)
  if (agreement) {
    agreement.amendments.push(amendment)
    saveFlatmateAgreement(agreement)
  }
}

export function createNewAgreement(flatmateName: string): FlatmateAgreement {
  return {
    id: Date.now().toString(),
    flatmateName,
    startDate: new Date().toISOString().split('T')[0],
    endDate: null,
    weeklyRent: 0,
    bond: 0,
    utilities: {},
    terms: '',
    createdAt: new Date().toISOString(),
    amendments: []
  }
}

const SEED_FLAG = 'flatmateAgreementsSeeded'

// Backfills this page's own storage from the real boarding-agreement records
// (src/data/tenantAgreements.json, the same source Admin > Boarding Files
// reads) so it doesn't show an empty "No Agreements Yet" state on top of
// real tenancies. Only runs once, and only if nothing's been created yet.
export function ensureSeededFromRealData(): void {
  if (localStorage.getItem(SEED_FLAG)) return
  localStorage.setItem(SEED_FLAG, '1')
  if (getFlatmateAgreements().length > 0) return

  tenantAgreementsData.agreements
    .filter(a => a.tenantName !== 'Peter Bardenhagen')
    .forEach(a => {
      saveFlatmateAgreement({
        id: a.id,
        flatmateName: a.tenantName,
        startDate: a.startDate,
        endDate: null,
        weeklyRent: a.weeklyRent,
        bond: a.bond,
        utilities: {},
        terms: a.notes || '',
        createdAt: a.startDate,
        amendments: (a.amendments || []).map(am => ({
          id: am.id,
          agreementId: a.id,
          type: (am.type === 'other' ? 'conditions-change' : am.type) as AgreementAmendment['type'],
          description: am.description,
          effectiveDate: am.effectiveDate,
          createdAt: am.createdDate
        }))
      })
    })
}
