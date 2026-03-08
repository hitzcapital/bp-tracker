import { isToday, subDays, isAfter } from 'date-fns'
import { classifyBP } from './classify'
import { getTimePeriod } from './date-utils'
import type { Measurement, DayStats, TrendData, BPCategory } from './types'

export function getTodayStats(measurements: Measurement[]): DayStats {
  const today = measurements.filter((m) => isToday(new Date(m.measured_at)))
  if (today.length === 0) return { count: 0, avgSystolic: 0, avgDiastolic: 0, avgPulse: 0 }
  return {
    count: today.length,
    avgSystolic: Math.round(today.reduce((s, m) => s + m.systolic, 0) / today.length),
    avgDiastolic: Math.round(today.reduce((s, m) => s + m.diastolic, 0) / today.length),
    avgPulse: Math.round(today.reduce((s, m) => s + m.pulse, 0) / today.length),
  }
}

export function getTrend(measurements: Measurement[]): TrendData {
  const now = new Date()
  const recent = measurements.filter((m) => isAfter(new Date(m.measured_at), subDays(now, 7)))
  const prior = measurements.filter((m) => {
    const d = new Date(m.measured_at)
    return isAfter(d, subDays(now, 14)) && !isAfter(d, subDays(now, 7))
  })
  if (recent.length === 0 || prior.length === 0) return { direction: 'stable', percentChange: 0 }
  const recentAvg = recent.reduce((s, m) => s + m.systolic, 0) / recent.length
  const priorAvg = prior.reduce((s, m) => s + m.systolic, 0) / prior.length
  const change = ((recentAvg - priorAvg) / priorAvg) * 100
  return {
    direction: Math.abs(change) < 2 ? 'stable' : change > 0 ? 'up' : 'down',
    percentChange: Math.round(Math.abs(change)),
  }
}

export function getStreak(measurements: Measurement[]): number {
  if (measurements.length === 0) return 0
  let streak = 0
  const today = new Date()
  for (let i = 0; i <= 365; i++) {
    const day = subDays(today, i)
    const hasEntry = measurements.some((m) => {
      const md = new Date(m.measured_at)
      return (
        md.getFullYear() === day.getFullYear() &&
        md.getMonth() === day.getMonth() &&
        md.getDate() === day.getDate()
      )
    })
    if (hasEntry) streak++
    else break
  }
  return streak
}

export function getCategoryDistribution(
  measurements: Measurement[]
): { category: BPCategory; label: string; count: number; color: string }[] {
  const dist: Record<string, { count: number; label: string; color: string }> = {}
  for (const m of measurements) {
    const c = classifyBP(m.systolic, m.diastolic)
    if (!dist[c.category]) dist[c.category] = { count: 0, label: c.label, color: c.color }
    dist[c.category].count++
  }
  return Object.entries(dist).map(([category, data]) => ({
    category: category as BPCategory,
    ...data,
  }))
}

export function getTimeOfDayAverages(
  measurements: Measurement[]
): { period: string; systolic: number; diastolic: number; count: number }[] {
  const groups: Record<string, { sys: number[]; dia: number[] }> = {
    Morning: { sys: [], dia: [] },
    Afternoon: { sys: [], dia: [] },
    Evening: { sys: [], dia: [] },
    Night: { sys: [], dia: [] },
  }
  for (const m of measurements) {
    const period = getTimePeriod(m.measured_at)
    groups[period].sys.push(m.systolic)
    groups[period].dia.push(m.diastolic)
  }
  return Object.entries(groups).map(([period, data]) => ({
    period,
    systolic: data.sys.length ? Math.round(data.sys.reduce((a, b) => a + b, 0) / data.sys.length) : 0,
    diastolic: data.dia.length ? Math.round(data.dia.reduce((a, b) => a + b, 0) / data.dia.length) : 0,
    count: data.sys.length,
  }))
}

export function getWeeklyAverages(
  measurements: Measurement[]
): { week: string; systolic: number; diastolic: number }[] {
  const weeks: Record<string, { sys: number[]; dia: number[] }> = {}
  for (const m of measurements) {
    const d = new Date(m.measured_at)
    const weekStart = subDays(d, d.getDay())
    const key = `${weekStart.getMonth() + 1}/${weekStart.getDate()}`
    if (!weeks[key]) weeks[key] = { sys: [], dia: [] }
    weeks[key].sys.push(m.systolic)
    weeks[key].dia.push(m.diastolic)
  }
  return Object.entries(weeks)
    .map(([week, data]) => ({
      week,
      systolic: Math.round(data.sys.reduce((a, b) => a + b, 0) / data.sys.length),
      diastolic: Math.round(data.dia.reduce((a, b) => a + b, 0) / data.dia.length),
    }))
    .slice(-12)
}

export function getActivityCorrelation(
  measurements: Measurement[]
): { activity: string; avgSystolic: number; avgDiastolic: number; count: number }[] {
  const groups: Record<string, { sys: number[]; dia: number[] }> = {}
  for (const m of measurements) {
    if (!m.activity) continue
    if (!groups[m.activity]) groups[m.activity] = { sys: [], dia: [] }
    groups[m.activity].sys.push(m.systolic)
    groups[m.activity].dia.push(m.diastolic)
  }
  return Object.entries(groups)
    .map(([activity, data]) => ({
      activity,
      avgSystolic: Math.round(data.sys.reduce((a, b) => a + b, 0) / data.sys.length),
      avgDiastolic: Math.round(data.dia.reduce((a, b) => a + b, 0) / data.dia.length),
      count: data.sys.length,
    }))
    .sort((a, b) => b.count - a.count)
}

export function getRollingAverage(measurements: Measurement[], days: number): { systolic: number; diastolic: number } {
  const cutoff = subDays(new Date(), days)
  const recent = measurements.filter((m) => isAfter(new Date(m.measured_at), cutoff))
  if (recent.length === 0) return { systolic: 0, diastolic: 0 }
  return {
    systolic: Math.round(recent.reduce((s, m) => s + m.systolic, 0) / recent.length),
    diastolic: Math.round(recent.reduce((s, m) => s + m.diastolic, 0) / recent.length),
  }
}
