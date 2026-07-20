import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface LandlordDetails {
  name: string
  email: string
  phone: string
  signaturePath?: string
}

export interface ReceiptData {
  receiptNo: string
  dateIssued: string
  tenantName: string
  amount: number
  amountWords: string
  description: string
  paymentMethod: string
  bankRef?: string
  notes?: string
  landlordName: string
  propertyAddress: string
}

export const DEFAULT_PROPERTY = {
  address: '477 Boundary Street, Apartment 1507',
  unit: '1507',
  city: 'Spring Hill',
  state: 'QLD',
  postcode: '4000',
  full: '477 Boundary Street, Apartment 1507, Spring Hill, QLD 4000'
}

export const DEFAULT_LANDLORD: LandlordDetails = {
  name: 'Peter Bardenhagen',
  email: 'peter@bardenhagen.xyz',
  phone: '',
  signaturePath: '/assets/signature.png'
}

// Helper: load an image and return as base64 data URL
function loadImageAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas context unavailable')); return }
      ctx.drawImage(img, 0, 0)
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = () => reject(new Error('Failed to load image: ' + url))
    img.src = url
  })
}

// Generate a receipt number in the format Nxxxxxxxxxxxx
export function generateReceiptNo(seed?: string): string {
  const ts = seed || Date.now().toString()
  return 'N' + ts.slice(-12)
}

// Format date as "18 July 2026"
export function formatDateLong(date: Date = new Date()): string {
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Convert number to English words (AUD)
export function numberToWords(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

  const convertBelow1000 = (n: number): string => {
    if (n === 0) return ''
    const hundreds = Math.floor(n / 100)
    const rest = n % 100
    let result = ''
    if (hundreds > 0) result += ones[hundreds] + ' hundred'
    if (rest > 0) {
      if (result) result += ' '
      if (rest < 20) result += ones[rest]
      else {
        const ten = Math.floor(rest / 10)
        const one = rest % 10
        result += tens[ten]
        if (one > 0) result += '-' + ones[one]
      }
    }
    return result
  }

  const dollars = Math.floor(num)
  const cents = Math.round((num - dollars) * 100)

  if (dollars === 0) return 'Zero dollars'

  const parts: string[] = []
  const millions = Math.floor(dollars / 1000000)
  const thousands = Math.floor((dollars % 1000000) / 1000)
  const remainder = dollars % 1000

  if (millions > 0) parts.push(convertBelow1000(millions) + ' million')
  if (thousands > 0) parts.push(convertBelow1000(thousands) + ' thousand')
  if (remainder > 0) parts.push(convertBelow1000(remainder))

  const dollarWord = dollars === 1 ? 'dollar' : 'dollars'
  let result = parts.join(' ') + ' ' + dollarWord

  if (cents > 0) {
    const centStr = cents < 20 ? ones[cents] : tens[Math.floor(cents / 10)] + (cents % 10 > 0 ? '-' + ones[cents % 10] : '')
    result += ' and ' + centStr + (cents === 1 ? ' cent' : ' cents')
  }

  return result.charAt(0).toUpperCase() + result.slice(1) + ' only'
}

// Generate a professional rental receipt PDF matching the exact format
export async function generateReceiptPDF(receipt: ReceiptData): Promise<void> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  const pw = doc.internal.pageSize.getWidth()
  const ph = doc.internal.pageSize.getHeight()
  const ml = 15
  const mr = 15
  const contentWidth = pw - ml - mr

  let y = 20

  // ---- Title ----
  doc.setFontSize(24)
  doc.setFont('Helvetica', 'bold')
  doc.text('RECEIPT', pw / 2, y, { align: 'center' })
  y += 14

  // Thin horizontal line
  doc.setDrawColor(180)
  doc.setLineWidth(0.3)
  doc.line(ml, y, pw - mr, y)
  y += 8

  // ---- Receipt Number & Date ----
  doc.setFontSize(10)
  doc.setFont('Helvetica', 'normal')
  doc.text(`Receipt No: ${receipt.receiptNo}`, ml, y)
  doc.text(`Date Issued: ${receipt.dateIssued}`, pw - mr, y, { align: 'right' })
  y += 10

  // ---- "Issued by" section ----
  doc.setFont('Helvetica', 'bold')
  doc.text('Issued by', ml, y)
  y += 6
  doc.setFont('Helvetica', 'normal')
  doc.text(receipt.landlordName, ml, y)
  y += 5
  doc.setFontSize(9)
  doc.text(receipt.propertyAddress, ml, y)
  y += 10

  // ---- "Received from" section ----
  doc.setFontSize(10)
  doc.setFont('Helvetica', 'bold')
  doc.text('Received from', ml, y)
  y += 6
  doc.setFont('Helvetica', 'normal')
  doc.text(receipt.tenantName, ml, y)
  y += 12

  // ---- Amount box ----
  doc.setFillColor(240, 245, 255)
  doc.setDrawColor(200, 215, 240)
  doc.rect(ml, y, contentWidth, 22, 'F')
  doc.rect(ml, y, contentWidth, 22, 'S')
  doc.setFontSize(11)
  doc.setFont('Helvetica', 'bold')
  doc.text('Amount received:', ml + 4, y + 8)
  doc.setFontSize(16)
  doc.text(`AUD ${formatCurrency(receipt.amount)}`, ml + 4, y + 19)
  y += 26

  // ---- Amount in words ----
  doc.setFontSize(9)
  doc.setFont('Helvetica', 'italic')
  doc.text(`Amount in words: ${receipt.amountWords}`, ml, y)
  y += 10

  // ---- Payment for ----
  doc.setFontSize(10)
  doc.setFont('Helvetica', 'bold')
  doc.text('Payment for:', ml, y)
  y += 6
  doc.setFont('Helvetica', 'normal')
  doc.text(receipt.description, ml, y, { maxWidth: contentWidth })
  y += 10

  // ---- Payment method ----
  doc.setFontSize(10)
  doc.setFont('Helvetica', 'normal')
  doc.text(`Payment method: ${receipt.paymentMethod}`, ml, y)
  y += 6

  // Transaction date
  doc.text(`Transaction date: ${receipt.dateIssued}`, ml, y)
  y += 6

  // Bank reference
  doc.setFont('Helvetica', 'bold')
  doc.text('Bank reference:', ml, y)
  y += 5
  doc.setFont('Helvetica', 'normal')
  doc.text(receipt.bankRef || '—', ml, y)
  y += 10

  // ---- Notes ----
  if (receipt.notes) {
    doc.setFont('Helvetica', 'bold')
    doc.text('Notes:', ml, y)
    y += 5
    doc.setFont('Helvetica', 'normal')
    doc.text(receipt.notes, ml, y, { maxWidth: contentWidth })
    y += 8
  }

  // ---- Footer note ----
  y += 4
  doc.setFontSize(8)
  doc.setFont('Helvetica', 'italic')
  doc.text('This receipt confirms payment of the above amount in full. Please retain for your records.', ml, y, { maxWidth: contentWidth })
  y += 14

  // ---- Light separator ----
  doc.setDrawColor(200)
  doc.setLineWidth(0.2)
  doc.line(ml, y, pw - mr, y)
  y += 8

  // ---- Signature ----
  try {
    const sigBase64 = await loadImageAsBase64(DEFAULT_LANDLORD.signaturePath!)
    const sigWidth = 50
    const sigHeight = 15
    doc.addImage(sigBase64, 'PNG', ml, y, sigWidth, sigHeight)
    y += sigHeight + 2
  } catch {
    // fallback: text signature
    doc.setFontSize(10)
    doc.setFont('Helvetica', 'italic')
    doc.text(receipt.landlordName, ml, y)
    y += 6
  }

  // ---- Landlord details ----
  doc.setFontSize(10)
  doc.setFont('Helvetica', 'bold')
  doc.text(receipt.landlordName, ml, y)
  y += 5
  doc.setFontSize(9)
  doc.setFont('Helvetica', 'normal')
  doc.text('Landlord', ml, y)
  y += 5
  doc.text(receipt.propertyAddress, ml, y)

  // ---- Save ----
  doc.save(`receipt-${receipt.receiptNo}.pdf`)
}

export function addPropertyHeader(doc: jsPDF): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setFontSize(10)
  doc.text(`1507/477 Boundary St`, pageWidth / 2, 15, { align: 'center' })
  doc.text(`Spring Hill, QLD 4000`, pageWidth / 2, 21, { align: 'center' })
  doc.setLineWidth(0.5)
  doc.line(10, 25, pageWidth - 10, 25)
}

export function addFooterWithSignature(
  doc: jsPDF,
  landlord: LandlordDetails = DEFAULT_LANDLORD,
  yPosition: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth()
  doc.setFontSize(10)
  doc.text('Landlord Signature:', 10, yPosition)
  doc.line(50, yPosition + 2, 100, yPosition + 2)
  doc.setFontSize(9)
  doc.text(landlord.name, 50, yPosition + 8)
  const today = new Date().toLocaleDateString('en-AU')
  doc.text(`Date: ${today}`, pageWidth - 60, yPosition)
}

// Convert html element to PDF via html2canvas
export function generatePDF(htmlElement: HTMLElement, filename: string): void {
  html2canvas(htmlElement, {
    scale: 2,
    logging: false,
    backgroundColor: '#ffffff'
  }).then(canvas => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })
    const imgData = canvas.toDataURL('image/png')
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)
  })
}
