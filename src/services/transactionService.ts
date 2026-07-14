// Transaction categorization service for Frollo exports

export interface Transaction {
  date: string
  amount: number
  merchant: string
  description: string
  reference: string
  type: 'debit' | 'credit' | 'transfer'
  account?: string
  category?: string
  subcategory?: string
}

export interface CategorizedTransaction extends Transaction {
  category: string
  subcategory: string
  confidence: 'high' | 'medium' | 'low'
}

// Queensland water providers
const QLD_WATER_PROVIDERS = [
  // Brisbane
  'Brisbane City Council',
  'Brisbane Water',
  'Queensland Urban Utilities',
  'QUU',
  // Gold Coast
  'Gold Coast Water',
  'Gold Coast City Council',
  // Sunshine Coast
  'Sunshine Coast Council',
  'Sunshine Coast Water',
  // Townsville
  'Townsville Water',
  'Townsville City Council',
  // Mackay
  'Mackay Water',
  'Mackay Regional Council',
  // Rockhampton
  'Rockhampton Regional Council',
  // Cairns
  'Cairns Regional Council',
  // Toowoomba
  'Toowoomba Regional Council',
  // Generic water terms
  'Water',
  'Waterworks',
]

// Utility providers
const UTILITY_MATCHERS = {
  'Origin Energy': ['origin energy', 'origin power', 'originenergy', 'origin elec'],
  'Origin Broadband': ['origin broadband', 'originbb', 'origin internet'],
  'Water Services': QLD_WATER_PROVIDERS.map(p => p.toLowerCase()),
}

// Tenant payment keywords
const TENANT_KEYWORDS = {
  rent: ['rent', 'rental', 'property rent', 'weekly rent', 'fortnightly rent', 'monthly rent'],
  bond: ['bond', 'security deposit', 'bond deposit', 'security bond'],
  guest: ['guest', 'guest charge', 'airbnb', 'booking'],
  utility_contribution: ['utility', 'electricity contribution', 'water contribution'],
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim()
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  const normalized = normalizeText(text)
  return keywords.some(keyword => normalized.includes(keyword))
}

function isTenantPayment(transaction: Transaction, tenantNames: string[]): { matched: boolean; type: string } {
  const lowerMerchant = normalizeText(transaction.merchant)
  const lowerDesc = normalizeText(transaction.description)
  const lowerRef = normalizeText(transaction.reference)
  const combinedText = `${lowerMerchant} ${lowerDesc} ${lowerRef}`

  // Check if from tenant
  const fromTenant = tenantNames.some(name => lowerMerchant.includes(normalizeText(name)))

  if (fromTenant) {
    if (matchesKeywords(combinedText, TENANT_KEYWORDS.rent)) {
      return { matched: true, type: 'rent' }
    }
    if (matchesKeywords(combinedText, TENANT_KEYWORDS.bond)) {
      return { matched: true, type: 'bond' }
    }
    if (matchesKeywords(combinedText, TENANT_KEYWORDS.guest)) {
      return { matched: true, type: 'guest' }
    }
    if (matchesKeywords(combinedText, TENANT_KEYWORDS.utility_contribution)) {
      return { matched: true, type: 'utility_contribution' }
    }
    return { matched: true, type: 'tenant_payment' }
  }

  // Check description/reference for rent/bond keywords
  if (matchesKeywords(combinedText, TENANT_KEYWORDS.rent)) {
    return { matched: true, type: 'rent' }
  }
  if (matchesKeywords(combinedText, TENANT_KEYWORDS.bond)) {
    return { matched: true, type: 'bond' }
  }

  return { matched: false, type: '' }
}

function isUtilityBill(transaction: Transaction): { matched: boolean; provider: string } {
  const lowerMerchant = normalizeText(transaction.merchant)
  const lowerDesc = normalizeText(transaction.description)
  const combinedText = `${lowerMerchant} ${lowerDesc}`

  // Check Origin Energy
  if (matchesKeywords(combinedText, UTILITY_MATCHERS['Origin Energy'])) {
    return { matched: true, provider: 'Origin Energy' }
  }

  // Check Origin Broadband
  if (matchesKeywords(combinedText, UTILITY_MATCHERS['Origin Broadband'])) {
    return { matched: true, provider: 'Origin Broadband' }
  }

  // Check Water Services
  if (matchesKeywords(combinedText, UTILITY_MATCHERS['Water Services'])) {
    return { matched: true, provider: 'Water Services' }
  }

  return { matched: false, provider: '' }
}

export function categorizeTransaction(
  transaction: Transaction,
  tenantNames: string[]
): CategorizedTransaction {
  const tenantMatch = isTenantPayment(transaction, tenantNames)
  if (tenantMatch.matched) {
    return {
      ...transaction,
      category: 'Tenant Payment',
      subcategory: tenantMatch.type,
      confidence: tenantMatch.type === 'rent' || tenantMatch.type === 'bond' ? 'high' : 'medium',
    }
  }

  const utilityMatch = isUtilityBill(transaction)
  if (utilityMatch.matched) {
    return {
      ...transaction,
      category: 'Utility Bill',
      subcategory: utilityMatch.provider,
      confidence: 'high',
    }
  }

  return {
    ...transaction,
    category: 'Other',
    subcategory: 'Uncategorized',
    confidence: 'low',
  }
}

export function categorizeTransactions(
  transactions: Transaction[],
  tenantNames: string[]
): CategorizedTransaction[] {
  return transactions.map(tx => categorizeTransaction(tx, tenantNames))
}

export function parseCSV(csvContent: string): Transaction[] {
  const lines = csvContent.trim().split('\n')
  if (lines.length < 2) return []

  const header = lines[0].split(',').map(h => normalizeText(h))
  const transactions: Transaction[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim())
    
    if (values.length < 3) continue

    // Map columns (flexible mapping)
    const dateIdx = header.findIndex(h => h.includes('date'))
    const amountIdx = header.findIndex(h => h.includes('amount'))
    const merchantIdx = header.findIndex(h => h.includes('merchant') || h.includes('description'))
    const descIdx = header.findIndex(h => h.includes('desc') && !h.includes('merchant'))
    const refIdx = header.findIndex(h => h.includes('reference') || h.includes('reference'))
    const typeIdx = header.findIndex(h => h.includes('type'))

    transactions.push({
      date: dateIdx >= 0 ? values[dateIdx] : '',
      amount: amountIdx >= 0 ? parseFloat(values[amountIdx]) : 0,
      merchant: merchantIdx >= 0 ? values[merchantIdx] : '',
      description: descIdx >= 0 ? values[descIdx] : (merchantIdx >= 0 ? values[merchantIdx] : ''),
      reference: refIdx >= 0 ? values[refIdx] : '',
      type: (typeIdx >= 0 ? values[typeIdx].toLowerCase() : 'debit') as 'debit' | 'credit' | 'transfer',
    })
  }

  return transactions
}

export function getTransactionSummary(transactions: CategorizedTransaction[]) {
  const summary = {
    total: transactions.length,
    byCategory: {} as Record<string, number>,
    byProvider: {} as Record<string, number>,
    totalUtilityCosts: 0,
    totalTenantPayments: 0,
  }

  transactions.forEach(tx => {
    if (tx.category === 'Utility Bill') {
      summary.totalUtilityCosts += Math.abs(tx.amount)
      summary.byProvider[tx.subcategory] = (summary.byProvider[tx.subcategory] || 0) + 1
    } else if (tx.category === 'Tenant Payment') {
      summary.totalTenantPayments += Math.abs(tx.amount)
    }

    summary.byCategory[tx.category] = (summary.byCategory[tx.category] || 0) + 1
  })

  return summary
}

export const transactionService = {
  parseCSV,
  categorizeTransaction,
  categorizeTransactions,
  getTransactionSummary,
}
