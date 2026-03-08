export const PAGE_SIZE = 30

export const BP_THRESHOLDS = {
  systolic: { min: 50, max: 300 },
  diastolic: { min: 20, max: 200 },
  pulse: { min: 20, max: 250 },
} as const

export const WHO_BANDS = [
  { label: 'Normal', min: 0, max: 120, color: 'rgba(34, 197, 94, 0.1)' },
  { label: 'Elevated', min: 120, max: 130, color: 'rgba(234, 179, 8, 0.1)' },
  { label: 'High Stage 1', min: 130, max: 140, color: 'rgba(249, 115, 22, 0.1)' },
  { label: 'High Stage 2', min: 140, max: 180, color: 'rgba(239, 68, 68, 0.1)' },
  { label: 'Crisis', min: 180, max: 300, color: 'rgba(220, 38, 38, 0.1)' },
] as const

export const TIME_PERIODS = [
  { key: 'morning', label: 'Morning', range: [5, 12] },
  { key: 'afternoon', label: 'Afternoon', range: [12, 17] },
  { key: 'evening', label: 'Evening', range: [17, 21] },
  { key: 'night', label: 'Night', range: [21, 5] },
] as const
