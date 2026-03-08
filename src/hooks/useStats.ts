import { useMemo } from 'react'
import type { Measurement } from '../lib/types'
import {
  getTodayStats,
  getTrend,
  getStreak,
  getCategoryDistribution,
  getTimeOfDayAverages,
  getWeeklyAverages,
  getActivityCorrelation,
  getRollingAverage,
} from '../lib/stats'

export function useStats(measurements: Measurement[]) {
  const todayStats = useMemo(() => getTodayStats(measurements), [measurements])
  const trend = useMemo(() => getTrend(measurements), [measurements])
  const streak = useMemo(() => getStreak(measurements), [measurements])
  const categoryDistribution = useMemo(() => getCategoryDistribution(measurements), [measurements])
  const timeOfDayAverages = useMemo(() => getTimeOfDayAverages(measurements), [measurements])
  const weeklyAverages = useMemo(() => getWeeklyAverages(measurements), [measurements])
  const activityCorrelation = useMemo(() => getActivityCorrelation(measurements), [measurements])
  const rolling7 = useMemo(() => getRollingAverage(measurements, 7), [measurements])
  const rolling30 = useMemo(() => getRollingAverage(measurements, 30), [measurements])

  return {
    todayStats,
    trend,
    streak,
    categoryDistribution,
    timeOfDayAverages,
    weeklyAverages,
    activityCorrelation,
    rolling7,
    rolling30,
  }
}
