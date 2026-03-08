import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { exportToCSV } from '../lib/export-csv'
import { exportToPDF } from '../lib/export-pdf'
import type { Measurement, ExportOptions } from '../lib/types'

export function useExport() {
  const { user } = useAuth()
  const [exporting, setExporting] = useState(false)

  const doExport = async (options: ExportOptions) => {
    if (!user) return
    setExporting(true)

    let query = supabase
      .from('measurements')
      .select('*')
      .eq('user_id', user.id)
      .order('measured_at', { ascending: false })

    if (options.startDate) {
      query = query.gte('measured_at', options.startDate)
    }
    if (options.endDate) {
      query = query.lte('measured_at', options.endDate)
    }

    const { data } = await query
    const measurements = (data || []) as Measurement[]

    if (options.format === 'csv') {
      exportToCSV(measurements)
    } else {
      exportToPDF(measurements)
    }

    setExporting(false)
  }

  return { doExport, exporting }
}
