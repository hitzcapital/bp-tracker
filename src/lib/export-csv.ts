import { format } from 'date-fns'
import { classifyBP } from './classify'
import type { Measurement } from './types'

export function exportToCSV(measurements: Measurement[]): void {
  const headers = ['Date', 'Time', 'Systolic', 'Diastolic', 'Pulse', 'Category', 'Activity', 'Notes']
  const rows = measurements.map((m) => {
    const d = new Date(m.measured_at)
    const classification = classifyBP(m.systolic, m.diastolic)
    return [
      format(d, 'yyyy-MM-dd'),
      format(d, 'HH:mm'),
      m.systolic.toString(),
      m.diastolic.toString(),
      m.pulse.toString(),
      classification.label,
      m.activity || '',
      (m.notes || '').replace(/"/g, '""'),
    ]
  })

  const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${c}"`).join(','))].join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `blood-pressure-${format(new Date(), 'yyyy-MM-dd')}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
