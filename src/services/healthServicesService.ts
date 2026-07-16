export interface HealthFacility {
  id: string
  name: string
  category: 'hospital-public' | 'hospital-private' | 'gp' | 'home-doctor'
  address?: string
  lat?: number
  lng?: number
  phone?: string
  email?: string
  website?: string
  hours?: string[]
  notes?: string
}

// Home reference point: 1507/477 Boundary St, Spring Hill QLD 4000
export const HOME_ADDRESS = '1507/477 Boundary St, Spring Hill QLD 4000'
export const HOME_COORDS = { lat: -27.4636, lng: 153.0233 }

export const HEALTH_FACILITIES: HealthFacility[] = [
  {
    id: 'rbwh',
    name: 'Royal Brisbane & Women\'s Hospital (RBWH)',
    category: 'hospital-public',
    address: 'Butterfield St, Herston QLD 4029',
    lat: -27.4489,
    lng: 153.0281,
    phone: '(07) 3646 8111',
    website: 'https://metronorth.health.qld.gov.au/rbwh',
    notes: 'Public hospital with 24/7 Emergency Department. For life-threatening emergencies always call 000.'
  },
  {
    id: 'st-andrews',
    name: "St Andrew's War Memorial Hospital",
    category: 'hospital-private',
    address: '457 Wickham Terrace, Spring Hill QLD 4000',
    lat: -27.4642,
    lng: 153.0244,
    phone: '(07) 3834 4111',
    website: 'https://www.stvincentsprivatebrisbane.com.au',
    notes: 'Private hospital on the Boundary St / Wickham Terrace side of Spring Hill, a short walk from the apartment.'
  },
  {
    id: 'millennium',
    name: 'Millennium Medical Group',
    category: 'gp',
    address: 'Ground Floor, Morris Towers, 149 Wickham Terrace, Spring Hill QLD 4000',
    lat: -27.4658,
    lng: 153.0248,
    phone: '(07) 3832 5555',
    email: 'reception@millenniummedical.com.au',
    website: 'https://www.hotdoc.com.au/medical-centres/spring-hill-QLD-4000/millennium-medical-group/doctors',
    hours: ['Mon–Fri: 7:00am–2:00pm', 'Closed weekends'],
    notes: 'Dr John Whitchurch recommended. Usually easy to get a same-day appointment if you call early.'
  },
  {
    id: 'turbot-street',
    name: 'Turbot Street Medical Centre',
    category: 'gp',
    address: 'Level 1, Spring Hill Market Place, 375 Turbot Street, Spring Hill QLD 4000',
    lat: -27.4661,
    lng: 153.0212,
    phone: '(07) 3839 0128',
    email: 'info@turbotstmc.com.au',
    hours: ['Mon–Fri: 7:45am–6:00pm', 'Weekends: 8:45am–12:30pm'],
    notes: 'Above Woolworths. Sometimes has same-day appointments, open weekends too.'
  },
  {
    id: 'our-gp-complex',
    name: 'Our GP Complex Spring Hill',
    category: 'gp',
    address: 'Shop 1, 525 Boundary Street, Spring Hill QLD 4000',
    lat: -27.4614,
    lng: 153.0227,
    phone: '(07) 3001 6900',
    email: 'springhill@ourgpcomplex.com.au',
    hours: [
      'Mon–Tue: 8:00am–5:00pm',
      'Wed–Fri: 8:00am–10:00pm',
      'Sat: 8:30am–5:00pm',
      'Sun: 9:00am–1:00pm'
    ],
    notes: "Closest to home, opposite St Andrew's Hospital. Great clinic, but same-day appointments can be hard to get."
  },
  {
    id: '13sick',
    name: '13SICK Home Doctor',
    category: 'home-doctor',
    phone: '13 74 25',
    website: 'https://13sick.com.au',
    notes: 'Comes to you after hours (usually from 6:00pm). Generally bulk-billed with a Medicare card. No fixed clinic address.'
  }
]

export type TravelMode = 'driving' | 'walking' | 'cycling' | 'scooter' | 'uber'

export const TRAVEL_MODES: { key: TravelMode; label: string; icon: string; googleMode: 'd' | 'w' | 'b' }[] = [
  { key: 'driving', label: 'Driving', icon: '🚗', googleMode: 'd' },
  { key: 'walking', label: 'Walking', icon: '🚶', googleMode: 'w' },
  { key: 'cycling', label: 'Cycling', icon: '🚴', googleMode: 'b' },
  { key: 'scooter', label: 'Scooter', icon: '🛴', googleMode: 'b' },
  { key: 'uber', label: 'Uber', icon: '🚕', googleMode: 'd' }
]

// Average effective speeds (km/h) used only for the quick on-page estimate.
// The embedded map link uses Google's own routing for the authoritative figure.
const AVERAGE_SPEED_KMH: Record<TravelMode, number> = {
  driving: 28,
  walking: 5,
  cycling: 16,
  scooter: 18,
  uber: 28
}

// Straight-line (haversine) distance in km, then nudged up to roughly
// approximate real street routing rather than "as the crow flies".
export function estimateDistanceKm(lat: number, lng: number): number {
  const R = 6371
  const dLat = ((lat - HOME_COORDS.lat) * Math.PI) / 180
  const dLng = ((lng - HOME_COORDS.lng) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((HOME_COORDS.lat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  const straightLineKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return straightLineKm * 1.3
}

export function estimateTravelMinutes(distanceKm: number, mode: TravelMode): number {
  const minutes = (distanceKm / AVERAGE_SPEED_KMH[mode]) * 60
  const extra = mode === 'uber' ? 5 : 0 // rough pickup wait
  return Math.max(1, Math.round(minutes + extra))
}

export function googleDirectionsUrl(destinationAddress: string, mode: TravelMode): string {
  const googleMode = TRAVEL_MODES.find(m => m.key === mode)?.googleMode || 'd'
  const origin = encodeURIComponent(HOME_ADDRESS)
  const destination = encodeURIComponent(destinationAddress)
  return `https://www.google.com/maps?saddr=${origin}&daddr=${destination}&dirflg=${googleMode}&output=embed`
}

export function googleDirectionsLink(destinationAddress: string, mode: TravelMode): string {
  const googleMode = TRAVEL_MODES.find(m => m.key === mode)?.googleMode || 'd'
  const origin = encodeURIComponent(HOME_ADDRESS)
  const destination = encodeURIComponent(destinationAddress)
  return `https://www.google.com/maps?saddr=${origin}&daddr=${destination}&dirflg=${googleMode}`
}

export function uberDeepLink(destinationAddress: string, lat?: number, lng?: number): string {
  const params = new URLSearchParams({
    action: 'setPickup',
    'pickup[formatted_address]': HOME_ADDRESS,
    'dropoff[formatted_address]': destinationAddress
  })
  if (lat !== undefined && lng !== undefined) {
    params.set('dropoff[latitude]', String(lat))
    params.set('dropoff[longitude]', String(lng))
  }
  return `https://m.uber.com/ul/?${params.toString()}`
}
