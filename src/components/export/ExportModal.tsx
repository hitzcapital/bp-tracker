import { useState } from 'react'
import { FileText, Table } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { useExport } from '../../hooks/useExport'
import type { ExportOptions } from '../../lib/types'

interface ExportModalProps {
  open: boolean
  onClose: () => void
}

export function ExportModal({ open, onClose }: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const { doExport, exporting } = useExport()

  const handleExport = async () => {
    const options: ExportOptions = {
      format,
      startDate: startDate || null,
      endDate: endDate || null,
    }
    await doExport(options)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title="Export Data">
      <div className="space-y-4">
        {/* Format selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-300">Format</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormat('csv')}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                format === 'csv'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <Table size={18} />
              <div className="text-left">
                <p className="text-sm font-medium">CSV</p>
                <p className="text-xs text-slate-500">Spreadsheet</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${
                format === 'pdf'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
              }`}
            >
              <FileText size={18} />
              <div className="text-left">
                <p className="text-sm font-medium">PDF</p>
                <p className="text-xs text-slate-500">Report</p>
              </div>
            </button>
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-sm text-slate-400">From</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="space-y-1">
            <label className="block text-sm text-slate-400">To</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <p className="text-xs text-slate-500">Leave dates empty to export all data.</p>

        <Button onClick={handleExport} loading={exporting} className="w-full" size="lg">
          Export {format.toUpperCase()}
        </Button>
      </div>
    </Modal>
  )
}
