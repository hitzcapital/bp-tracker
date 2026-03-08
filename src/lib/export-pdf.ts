import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { format } from 'date-fns'
import { classifyBP, getCategoryColor } from './classify'
import { getCategoryDistribution } from './stats'
import type { Measurement } from './types'

export function exportToPDF(measurements: Measurement[]): void {
  const doc = new jsPDF()

  // Title
  doc.setFontSize(20)
  doc.setTextColor(30, 41, 59)
  doc.text('Blood Pressure Report', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generated: ${format(new Date(), 'MMM d, yyyy HH:mm')}`, 14, 30)
  doc.text(`Total measurements: ${measurements.length}`, 14, 36)

  // Summary stats
  if (measurements.length > 0) {
    const avgSys = Math.round(measurements.reduce((s, m) => s + m.systolic, 0) / measurements.length)
    const avgDia = Math.round(measurements.reduce((s, m) => s + m.diastolic, 0) / measurements.length)
    const avgPulse = Math.round(measurements.reduce((s, m) => s + m.pulse, 0) / measurements.length)

    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text('Averages', 14, 48)
    doc.setFontSize(10)
    doc.text(`Systolic: ${avgSys} mmHg  |  Diastolic: ${avgDia} mmHg  |  Pulse: ${avgPulse} bpm`, 14, 55)

    // Category distribution
    const dist = getCategoryDistribution(measurements)
    doc.text('Category Distribution:', 14, 65)
    let y = 72
    for (const d of dist) {
      const pct = Math.round((d.count / measurements.length) * 100)
      doc.text(`${d.label}: ${d.count} (${pct}%)`, 20, y)
      y += 6
    }

    // Data table
    const tableData = measurements.map((m) => {
      const d = new Date(m.measured_at)
      const c = classifyBP(m.systolic, m.diastolic)
      return [
        format(d, 'MM/dd/yy'),
        format(d, 'HH:mm'),
        m.systolic.toString(),
        m.diastolic.toString(),
        m.pulse.toString(),
        c.label,
        m.activity || '-',
      ]
    })

    autoTable(doc, {
      startY: y + 5,
      head: [['Date', 'Time', 'Sys', 'Dia', 'Pulse', 'Category', 'Activity']],
      body: tableData,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          const m = measurements[data.row.index]
          if (m) {
            const color = getCategoryColor(classifyBP(m.systolic, m.diastolic).category)
            const rgb = hexToRgb(color)
            if (rgb) {
              data.cell.styles.textColor = [rgb.r, rgb.g, rgb.b]
            }
          }
        }
      },
    })
  }

  doc.save(`blood-pressure-${format(new Date(), 'yyyy-MM-dd')}.pdf`)
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
    : null
}
