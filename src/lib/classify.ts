import type { BPClassification } from './types'

export function classifyBP(systolic: number, diastolic: number): BPClassification {
  if (systolic >= 180 || diastolic >= 120) {
    return {
      category: 'crisis',
      label: 'Hypertensive Crisis',
      color: '#dc2626',
      description: 'Seek emergency medical help immediately!',
    }
  }
  if (systolic >= 140 || diastolic >= 90) {
    return {
      category: 'high2',
      label: 'High Blood Pressure Stage 2',
      color: '#ef4444',
      description: 'Medical consultation recommended',
    }
  }
  if (systolic >= 130 || diastolic >= 80) {
    return {
      category: 'high1',
      label: 'High Blood Pressure Stage 1',
      color: '#f97316',
      description: 'Lifestyle changes recommended',
    }
  }
  if (systolic >= 120 && diastolic < 80) {
    return {
      category: 'elevated',
      label: 'Elevated',
      color: '#eab308',
      description: 'Monitor regularly',
    }
  }
  return {
    category: 'normal',
    label: 'Normal',
    color: '#22c55e',
    description: 'All good!',
  }
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    normal: '#22c55e',
    elevated: '#eab308',
    high1: '#f97316',
    high2: '#ef4444',
    crisis: '#dc2626',
  }
  return colors[category] || '#94a3b8'
}
