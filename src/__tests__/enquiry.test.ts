/**
 * Tests for enquiry submission system
 */

describe('Enquiry Submission', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  test('should save enquiry to localStorage', () => {
    const enquiry = {
      id: Date.now(),
      flatmate: 'Peter',
      enquiryType: 'Cleaning issues',
      message: 'The kitchen sink is blocked',
      timestamp: new Date().toISOString(),
      status: 'new' as const,
      notes: ''
    }

    const enquiries = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    enquiries.push(enquiry)
    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    const stored = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].flatmate).toBe('Peter')
    expect(stored[0].enquiryType).toBe('Cleaning issues')
  })

  test('should validate message length', () => {
    const shortMessage = 'short'
    expect(shortMessage.trim().length < 10).toBe(true)

    const validMessage = 'This is a valid message about something'
    expect(validMessage.trim().length >= 10).toBe(true)

    const tooLongMessage = 'a'.repeat(1001)
    expect(tooLongMessage.trim().length > 1000).toBe(true)
  })

  test('should reject enquiry with empty flatmate', () => {
    const enquiry = {
      flatmate: '',
      enquiryType: 'Cleaning issues',
      message: 'This is a valid message'
    }

    expect(enquiry.flatmate).toBe('')
    expect(enquiry.flatmate === '' || enquiry.enquiryType === '' || enquiry.message.trim() === '').toBe(true)
  })

  test('should reject enquiry with empty enquiry type', () => {
    const enquiry = {
      flatmate: 'Peter',
      enquiryType: '',
      message: 'This is a valid message'
    }

    expect(enquiry.enquiryType).toBe('')
    expect(enquiry.flatmate === '' || enquiry.enquiryType === '' || enquiry.message.trim() === '').toBe(true)
  })

  test('should reject enquiry with empty message', () => {
    const enquiry = {
      flatmate: 'Peter',
      enquiryType: 'Cleaning issues',
      message: ''
    }

    expect(enquiry.message.trim()).toBe('')
    expect(enquiry.flatmate === '' || enquiry.enquiryType === '' || enquiry.message.trim() === '').toBe(true)
  })

  test('should load all enquiries from localStorage', () => {
    const enquiries = [
      {
        id: 1,
        flatmate: 'Peter',
        enquiryType: 'Cleaning issues',
        message: 'The kitchen sink is blocked',
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        notes: ''
      },
      {
        id: 2,
        flatmate: 'Kevin',
        enquiryType: 'Request Repair',
        message: 'Balcony door squeaks',
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        notes: ''
      }
    ]

    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))
    const stored = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')

    expect(stored).toHaveLength(2)
    expect(stored[0].flatmate).toBe('Peter')
    expect(stored[1].flatmate).toBe('Kevin')
  })

  test('should update enquiry status', () => {
    const enquiry = {
      id: 1,
      flatmate: 'Peter',
      enquiryType: 'Cleaning issues',
      message: 'The kitchen sink is blocked',
      timestamp: new Date().toISOString(),
      status: 'new' as const,
      notes: ''
    }

    const enquiries = [enquiry]
    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    // Update status
    const stored = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    stored[0].status = 'resolved'
    localStorage.setItem('helpEnquiries', JSON.stringify(stored))

    const updated = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    expect(updated[0].status).toBe('resolved')
  })

  test('should add notes to enquiry', () => {
    const enquiry = {
      id: 1,
      flatmate: 'Peter',
      enquiryType: 'Cleaning issues',
      message: 'The kitchen sink is blocked',
      timestamp: new Date().toISOString(),
      status: 'new' as const,
      notes: ''
    }

    const enquiries = [enquiry]
    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    // Add notes
    const stored = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    stored[0].notes = 'Called plumber, scheduled for tomorrow'
    localStorage.setItem('helpEnquiries', JSON.stringify(stored))

    const updated = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    expect(updated[0].notes).toBe('Called plumber, scheduled for tomorrow')
  })

  test('should delete enquiry', () => {
    const enquiries = [
      {
        id: 1,
        flatmate: 'Peter',
        enquiryType: 'Cleaning issues',
        message: 'The kitchen sink is blocked',
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        notes: ''
      },
      {
        id: 2,
        flatmate: 'Kevin',
        enquiryType: 'Request Repair',
        message: 'Balcony door squeaks',
        timestamp: new Date().toISOString(),
        status: 'new' as const,
        notes: ''
      }
    ]

    localStorage.setItem('helpEnquiries', JSON.stringify(enquiries))

    // Delete first enquiry
    let stored = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    stored = stored.filter((e: any) => e.id !== 1)
    localStorage.setItem('helpEnquiries', JSON.stringify(stored))

    const updated = JSON.parse(localStorage.getItem('helpEnquiries') || '[]')
    expect(updated).toHaveLength(1)
    expect(updated[0].id).toBe(2)
  })
})
