import { format, isToday, isYesterday, subDays, startOfDay, endOfDay } from 'date-fns'
import type { DateRange } from './types'

export function formatTime(dateStr: string): string {
  return format(new Date(dateStr), 'HH:mm')
}

export function formatDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy')
}

export function formatDateTime(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d, yyyy HH:mm')
}

export function getDayLabel(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return 'Today'
  if (isYesterday(date)) return 'Yesterday'
  return format(date, 'EEEE, MMM d')
}

export function getDateRangeBounds(range: DateRange): { start: Date; end: Date } {
  const end = endOfDay(new Date())
  const daysMap: Record<string, number> = {
    '7D': 7,
    '30D': 30,
    '90D': 90,
    '1Y': 365,
  }
  const days = daysMap[range]
  if (days) {
    return { start: startOfDay(subDays(new Date(), days)), end }
  }
  return { start: new Date(0), end }
}

export function getTimePeriod(dateStr: string): string {
  const hour = new Date(dateStr).getHours()
  if (hour >= 5 && hour < 12) return 'Morning'
  if (hour >= 12 && hour < 17) return 'Afternoon'
  if (hour >= 17 && hour < 21) return 'Evening'
  return 'Night'
}

export function toLocalDatetimeString(date: Date): string {
  const offset = date.getTimezoneOffset()
  const local = new Date(date.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 16)
}
