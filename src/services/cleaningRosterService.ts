const ROSTER_START = new Date('2026-07-27T00:00:00')
const ROSTER_NAMES = ['Peter', 'Kevin', 'Kaitlin', 'Jacob']
const CYCLE_DAYS = 14
const DAY_MS = 24 * 60 * 60 * 1000

export interface RosterTurn {
  name: string
  start: Date
  end: Date
  isUpcoming: boolean
}

export function getCurrentRosterTurn(referenceDate: Date = new Date()): RosterTurn {
  const diffMs = referenceDate.getTime() - ROSTER_START.getTime()
  const isUpcoming = diffMs < 0
  const periodIndex = isUpcoming ? 0 : Math.floor(diffMs / (CYCLE_DAYS * DAY_MS))

  const start = new Date(ROSTER_START.getTime() + periodIndex * CYCLE_DAYS * DAY_MS)
  const end = new Date(start.getTime() + (CYCLE_DAYS - 1) * DAY_MS)

  return {
    name: ROSTER_NAMES[periodIndex % ROSTER_NAMES.length],
    start,
    end,
    isUpcoming
  }
}

export function formatRosterRange(turn: RosterTurn): string {
  const fmt = (d: Date) => d.toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })
  return `${fmt(turn.start)} – ${fmt(turn.end)}`
}
