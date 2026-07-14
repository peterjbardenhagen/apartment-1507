export interface TenantAgreement {
  id: string
  tenantName: string
  startDate: string
  status: 'active' | 'inactive'
  weeklyRent: number
  bond: number
  utilitiesContribution?: number
  notes?: string
  documentName?: string
  documentUrl?: string
  amendments?: Amendment[]
}

export interface Amendment {
  id: string
  type: 'rent-increase' | 'utilities-increase' | 'conditions-change' | 'other'
  description: string
  effectiveDate: string
  createdDate: string
  details?: Record<string, any>
}

// Tenant agreements storage
const AGREEMENTS_KEY = 'tenantAgreementsWithDocs'

export const agreementStorageService = {
  // Get all agreements
  getAllAgreements(): TenantAgreement[] {
    try {
      const stored = localStorage.getItem(AGREEMENTS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  },

  // Get specific agreement
  getAgreement(tenantName: string): TenantAgreement | null {
    const agreements = this.getAllAgreements()
    return agreements.find(a => a.tenantName === tenantName) || null
  },

  // Save agreement
  saveAgreement(agreement: TenantAgreement): void {
    const agreements = this.getAllAgreements()
    const index = agreements.findIndex(a => a.id === agreement.id)

    if (index >= 0) {
      agreements[index] = agreement
    } else {
      agreements.push(agreement)
    }

    localStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements))
  },

  // Add amendment to agreement
  addAmendment(tenantName: string, amendment: Amendment): boolean {
    const agreements = this.getAllAgreements()
    const agreement = agreements.find(a => a.tenantName === tenantName)

    if (agreement) {
      if (!agreement.amendments) {
        agreement.amendments = []
      }
      agreement.amendments.push(amendment)
      localStorage.setItem(AGREEMENTS_KEY, JSON.stringify(agreements))
      return true
    }
    return false
  },

  // Delete agreement
  deleteAgreement(id: string): void {
    const agreements = this.getAllAgreements()
    const filtered = agreements.filter(a => a.id !== id)
    localStorage.setItem(AGREEMENTS_KEY, JSON.stringify(filtered))
  },

  // Get utilities summary
  getUtilitiesSummary() {
    const agreements = this.getAllAgreements()
    const activeAgreements = agreements.filter(a => a.status === 'active')

    const total = activeAgreements.reduce((sum, a) => sum + (a.utilitiesContribution || 0), 0)

    return {
      total,
      byTenant: activeAgreements
        .filter(a => a.utilitiesContribution)
        .map(a => ({
          name: a.tenantName,
          amount: a.utilitiesContribution || 0
        }))
    }
  }
}
