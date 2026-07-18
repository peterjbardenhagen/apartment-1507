export interface PaymentRequest {
  id: string
  flatmateName: string
  amount: number
  description: string
  dueDate: string
  createdAt: string
  status: 'pending' | 'paid' | 'overdue'
}

export interface Receipt {
  id: string
  receiptNo: string
  paymentRequestId?: string
  flatmateName: string
  description: string
  amount: number
  amountWords: string
  date: string
  paymentMethod: string
  bankRef: string
  notes: string
  createdAt: string
}

let receiptCounter = Date.now()

export function generateReceiptNo(): string {
  receiptCounter++
  const ts = receiptCounter.toString()
  return 'N' + ts.slice(-12)
}

export function savePaymentRequest(request: PaymentRequest): void {
  const requests = JSON.parse(localStorage.getItem('paymentRequests') || '[]')
  const existing = requests.findIndex((r: PaymentRequest) => r.id === request.id)
  if (existing >= 0) {
    requests[existing] = request
  } else {
    requests.push(request)
  }
  localStorage.setItem('paymentRequests', JSON.stringify(requests))
}

export function getPaymentRequests(): PaymentRequest[] {
  return JSON.parse(localStorage.getItem('paymentRequests') || '[]')
}

export function getPaymentRequest(id: string): PaymentRequest | null {
  const requests = getPaymentRequests()
  return requests.find((r: PaymentRequest) => r.id === id) || null
}

export function createPaymentRequest(flatmateName: string, amount: number, description: string): PaymentRequest {
  return {
    id: Date.now().toString(),
    flatmateName,
    amount,
    description,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
}

export function saveReceipt(receipt: Receipt): void {
  const receipts = JSON.parse(localStorage.getItem('receipts') || '[]')
  const existing = receipts.findIndex((r: Receipt) => r.id === receipt.id)
  if (existing >= 0) {
    receipts[existing] = receipt
  } else {
    receipts.push(receipt)
  }
  localStorage.setItem('receipts', JSON.stringify(receipts))
}

export function getReceipts(): Receipt[] {
  return JSON.parse(localStorage.getItem('receipts') || '[]')
}

export function createReceipt(flatmateName: string, amount: number, description: string): Receipt {
  return {
    id: Date.now().toString(),
    receiptNo: generateReceiptNo(),
    flatmateName,
    description,
    amount,
    amountWords: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: '',
    bankRef: '',
    notes: '',
    createdAt: new Date().toISOString()
  }
}
