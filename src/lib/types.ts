export interface Measurement {
  id: string
  systolic: number
  diastolic: number
  pulse: number
  activity: string
  measured_at: string
  photo_url: string | null
  notes: string | null
  created_at: string
  user_id: string
}

export interface MeasurementInput {
  systolic: number | null
  diastolic: number | null
  pulse: number | null
  activity: string
  measured_at: string
  notes: string
  photo: File | null
}

export type BPCategory =
  | 'normal'
  | 'elevated'
  | 'high1'
  | 'high2'
  | 'crisis'

export interface BPClassification {
  category: BPCategory
  label: string
  color: string
  description: string
}

export const ACTIVITIES = [
  'Resting',
  'After Waking',
  'After Exercise',
  'After Coffee',
  'After Eating',
  'Stressed',
  'Before Bed',
  'After Meditation',
  'Other',
] as const

export type Activity = (typeof ACTIVITIES)[number]

export interface DayStats {
  count: number
  avgSystolic: number
  avgDiastolic: number
  avgPulse: number
}

export interface TrendData {
  direction: 'up' | 'down' | 'stable'
  percentChange: number
}

export type DateRange = '7D' | '30D' | '90D' | '1Y' | 'ALL' | 'CUSTOM'

export type ChartTab = 'trend' | 'pulse' | 'distribution' | 'timeOfDay' | 'weekly' | 'activity'

export interface ExportOptions {
  format: 'csv' | 'pdf'
  startDate: string | null
  endDate: string | null
}
