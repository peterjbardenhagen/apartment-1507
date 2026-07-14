export interface FlatmateContribution {
  name: string
  weeklyAmount: number
  percentage: number
  color: string
}

export interface WeeklyMetrics {
  week: string
  date: Date
  energyCost: number
  broadbandCost: number
  waterCost: number
  totalCost: number
}

export interface ServiceBenchmark {
  service: string
  brisbaneAverage: number
  minRange: number
  maxRange: number
  unit: string
}

export interface CostAllocation {
  flatmate: string
  weeklyShare: number
  monthlyShare: number
  isOverBudget: boolean
  variance: number
}

export const FLATMATE_CONTRIBUTIONS: FlatmateContribution[] = [
  { name: 'Kevin & Kaitlin', weeklyAmount: 90, percentage: 42.857, color: 'bg-blue-500' },
  { name: 'Jacob', weeklyAmount: 60, percentage: 28.571, color: 'bg-purple-500' },
  { name: 'Peter', weeklyAmount: 60, percentage: 28.571, color: 'bg-amber-500' }
]

export const BRISBANE_BENCHMARKS: ServiceBenchmark[] = [
  { service: 'Electricity', brisbaneAverage: 65, minRange: 50, maxRange: 85, unit: '$/week' },
  { service: 'Water', brisbaneAverage: 35, minRange: 25, maxRange: 50, unit: '$/week' },
  { service: 'Broadband', brisbaneAverage: 40, minRange: 35, maxRange: 50, unit: '$/week' }
]

const TOTAL_BUDGET = 210 // $210/week

export function parseTransactionsForAnalytics(transactions: any[]): WeeklyMetrics[] {
  const weeklyData: Map<string, WeeklyMetrics> = new Map()

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date || transaction.timestamp)
    const weekKey = getWeekKey(date)

    if (!weeklyData.has(weekKey)) {
      weeklyData.set(weekKey, {
        week: weekKey,
        date: getWeekStart(date),
        energyCost: 0,
        broadbandCost: 0,
        waterCost: 0,
        totalCost: 0
      })
    }

    const weekMetrics = weeklyData.get(weekKey)!
    const amount = Math.abs(transaction.amount || 0)

    if (transaction.category === 'Electricity' || transaction.merchant?.toLowerCase().includes('origin energy')) {
      weekMetrics.energyCost += amount
    } else if (transaction.category === 'Broadband' || transaction.merchant?.toLowerCase().includes('origin broadband')) {
      weekMetrics.broadbandCost += amount
    } else if (transaction.category === 'Water' || transaction.merchant?.toLowerCase().includes('water')) {
      weekMetrics.waterCost += amount
    }

    weekMetrics.totalCost = weekMetrics.energyCost + weekMetrics.broadbandCost + weekMetrics.waterCost
  })

  return Array.from(weeklyData.values())
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(-12) // Last 12 weeks
}

export function calculateCostAllocations(weeklyMetrics: WeeklyMetrics[]): CostAllocation[] {
  const avgWeeklyCost = weeklyMetrics.length > 0
    ? weeklyMetrics.reduce((sum, w) => sum + w.totalCost, 0) / weeklyMetrics.length
    : 0

  const allocations: CostAllocation[] = []

  FLATMATE_CONTRIBUTIONS.forEach((flatmate) => {
    const weeklyShare = avgWeeklyCost * (flatmate.percentage / 100)
    const monthlyShare = weeklyShare * 4.33
    const variance = flatmate.weeklyAmount - weeklyShare

    allocations.push({
      flatmate: flatmate.name,
      weeklyShare: parseFloat(weeklyShare.toFixed(2)),
      monthlyShare: parseFloat(monthlyShare.toFixed(2)),
      isOverBudget: weeklyShare > flatmate.weeklyAmount,
      variance: parseFloat(variance.toFixed(2))
    })
  })

  return allocations
}

export function getMonthlyTotals(weeklyMetrics: WeeklyMetrics[]): {
  month: string
  energyCost: number
  broadbandCost: number
  waterCost: number
  totalCost: number
  daysInMonth: number
}[] {
  const monthlyData: Map<string, any> = new Map()

  weeklyMetrics.forEach((week) => {
    const monthKey = week.date.toLocaleDateString('en-AU', { year: 'numeric', month: 'short' })

    if (!monthlyData.has(monthKey)) {
      monthlyData.set(monthKey, {
        month: monthKey,
        energyCost: 0,
        broadbandCost: 0,
        waterCost: 0,
        totalCost: 0,
        weeks: 0
      })
    }

    const monthMetrics = monthlyData.get(monthKey)
    monthMetrics.energyCost += week.energyCost
    monthMetrics.broadbandCost += week.broadbandCost
    monthMetrics.waterCost += week.waterCost
    monthMetrics.totalCost += week.totalCost
    monthMetrics.weeks += 1
  })

  return Array.from(monthlyData.values())
    .map(m => ({
      ...m,
      daysInMonth: Math.round(m.weeks * 7),
      energyCost: parseFloat(m.energyCost.toFixed(2)),
      broadbandCost: parseFloat(m.broadbandCost.toFixed(2)),
      waterCost: parseFloat(m.waterCost.toFixed(2)),
      totalCost: parseFloat(m.totalCost.toFixed(2))
    }))
}

export function compareToBenchmark(metrics: WeeklyMetrics[], benchmark: ServiceBenchmark) {
  const serviceName = benchmark.service.toLowerCase()
  let serviceCosts: number[] = []

  metrics.forEach((week) => {
    if (serviceName === 'electricity') {
      serviceCosts.push(week.energyCost)
    } else if (serviceName === 'water') {
      serviceCosts.push(week.waterCost)
    } else if (serviceName === 'broadband') {
      serviceCosts.push(week.broadbandCost)
    }
  })

  const avgCost = serviceCosts.length > 0
    ? serviceCosts.reduce((a, b) => a + b, 0) / serviceCosts.length
    : 0

  const variance = avgCost - benchmark.brisbaneAverage
  const status = avgCost > benchmark.maxRange ? 'high' : avgCost < benchmark.minRange ? 'low' : 'normal'

  return {
    service: benchmark.service,
    actualCost: parseFloat(avgCost.toFixed(2)),
    benchmarkCost: benchmark.brisbaneAverage,
    variance: parseFloat(variance.toFixed(2)),
    variancePercent: parseFloat(((variance / benchmark.brisbaneAverage) * 100).toFixed(1)),
    status,
    isBelowRange: avgCost < benchmark.minRange,
    isAboveRange: avgCost > benchmark.maxRange
  }
}

function getWeekKey(date: Date): string {
  const weekStart = getWeekStart(date)
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekEnd.getDate() + 6)
  return weekStart.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' }) +
         ' - ' +
         weekEnd.toLocaleDateString('en-AU', { month: 'short', day: 'numeric' })
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  return new Date(d.setDate(diff))
}

export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`
}

export function getVarianceColor(variance: number): string {
  if (variance > 10) return 'text-red-600 bg-red-50'
  if (variance > 0) return 'text-amber-600 bg-amber-50'
  if (variance < -10) return 'text-emerald-600 bg-emerald-50'
  return 'text-slate-600 bg-slate-50'
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case 'high': return '⬆️'
    case 'low': return '⬇️'
    default: return '✓'
  }
}
