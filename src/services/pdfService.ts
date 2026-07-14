import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface LandlordDetails {
  name: string
  email: string
  phone: string
  signature: string
}

export interface PropertyDetails {
  address: string
  city: string
  state: string
  postcode: string
  unit: string
}

export const DEFAULT_PROPERTY: PropertyDetails = {
  address: '477 Boundary St',
  unit: '1507',
  city: 'Spring Hill',
  state: 'QLD',
  postcode: '4000'
}

export const DEFAULT_LANDLORD: LandlordDetails = {
  name: 'Peter Bardenhagen',
  email: 'peter@bardenhagen.xyz',
  phone: '',
  signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAC6wAAAMcCAIAAABhUF4jAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TRS2VDhYRcchQnSyIijhKFYtgobQVWnUwufQLmjQkKS6OgmvBwY/FqoOLs64OroIg+AHi6uKk6CIl/i8ptIjx4Lgf7+497t4BQqPCVLNrAlA1y0jF4mIyVVIRvCRIRxAB/XhDVyW8o1ScKSgQxNR9m8NF7pGXtSS8tEQBWWIy4ZhXqKDqHlGZH1xS+3Nm1xj3yreLkJBWExXhLGLbU6hflFh7J8WrzQZjE7uOWkIxZrEFxEKYXDRyCKf9K5lSpxqjn5rEpF/n5hSBpqRTjXrHZWmyGOI0eMfXPCjxMb7TxQKnZmVZXFZcZ0lZpYSO7G1B05jn6F5pB2wVQGFgQGRUdB+iBXnADp8bqeB42qQsOQBX7PYtCrZGhTzQrA3KhEhWZCp9Q9rN0XqiX4UXJRLqKJXyRFqoKSL7m0f0TkPhkChpbg5gA0aW6X0AK0j9hSWvwGjI8Q8Q/JHfBaRH76eKdZlL1ZX6tJvXwlN0vWpKN1gYl2RCu/9J3VwLu'
}

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
    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(filename)
  })
}

export function addPropertyHeader(doc: jsPDF, property: PropertyDetails = DEFAULT_PROPERTY): void {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Property details at top
  doc.setFontSize(10)
  doc.text(`${property.unit}/${property.address}`, pageWidth / 2, 15, { align: 'center' })
  doc.text(`${property.city}, ${property.state} ${property.postcode}`, pageWidth / 2, 21, { align: 'center' })

  // Horizontal line
  doc.setLineWidth(0.5)
  doc.line(10, 25, pageWidth - 10, 25)
}

export function addFooterWithSignature(
  doc: jsPDF,
  landlord: LandlordDetails = DEFAULT_LANDLORD,
  yPosition: number
): void {
  const pageWidth = doc.internal.pageSize.getWidth()

  // Signature line
  doc.setFontSize(10)
  doc.text('Landlord Signature:', 10, yPosition)
  doc.line(50, yPosition + 2, 100, yPosition + 2)

  // Name
  doc.setFontSize(9)
  doc.text(landlord.name, 50, yPosition + 8)

  // Date
  const today = new Date().toLocaleDateString('en-AU')
  doc.text(`Date: ${today}`, pageWidth - 60, yPosition)
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function formatDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })
}
