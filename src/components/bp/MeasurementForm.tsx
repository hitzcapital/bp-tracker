import { useState, useRef } from 'react'
import { Minus, Plus, Camera, ScanLine, Loader2 } from 'lucide-react'
import { ActivityPicker } from './ActivityPicker'
import { BPCategoryBadge } from './BPCategoryBadge'
import { Button } from '../ui/Button'
import { classifyBP } from '../../lib/classify'
import { toLocalDatetimeString } from '../../lib/date-utils'
import { extractBPFromPhoto } from '../../lib/ocr'
import type { MeasurementInput } from '../../lib/types'

interface MeasurementFormProps {
  onSubmit: (input: MeasurementInput) => Promise<void>
  loading?: boolean
  onScanError?: (message: string) => void
}

export function MeasurementForm({ onSubmit, loading = false, onScanError }: MeasurementFormProps) {
  const [systolic, setSystolic] = useState(120)
  const [diastolic, setDiastolic] = useState(80)
  const [pulse, setPulse] = useState(72)
  const [activity, setActivity] = useState('')
  const [measuredAt, setMeasuredAt] = useState(toLocalDatetimeString(new Date()))
  const [notes, setNotes] = useState('')
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const scanInputRef = useRef<HTMLInputElement>(null)

  const classification = classifyBP(systolic, diastolic)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleScanPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Show preview
    setPhoto(file)
    const reader = new FileReader()
    reader.onloadend = () => setPhotoPreview(reader.result as string)
    reader.readAsDataURL(file)

    // Run OCR
    setScanning(true)
    try {
      const result = await extractBPFromPhoto(file)
      setSystolic(result.systolic)
      setDiastolic(result.diastolic)
      if (result.pulse != null) {
        setPulse(result.pulse)
      }
    } catch (err) {
      onScanError?.((err as Error).message || 'Could not read values from photo')
    } finally {
      setScanning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit({
      systolic,
      diastolic,
      pulse,
      activity,
      measured_at: new Date(measuredAt).toISOString(),
      notes,
      photo,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Scan from Photo - Primary CTA */}
      <button
        type="button"
        onClick={() => scanInputRef.current?.click()}
        disabled={scanning}
        className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-slate-600 disabled:to-slate-600 rounded-2xl text-white font-semibold transition-all shadow-lg shadow-blue-500/20"
      >
        {scanning ? (
          <>
            <Loader2 size={22} className="animate-spin" />
            <span>Analysiere Foto...</span>
          </>
        ) : (
          <>
            <ScanLine size={22} />
            <span>Foto scannen</span>
          </>
        )}
        <input
          ref={scanInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleScanPhoto}
        />
      </button>

      {/* Photo preview */}
      {photoPreview && (
        <div className="flex justify-center">
          <img src={photoPreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-slate-700" />
        </div>
      )}

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-700" />
        <span className="text-xs text-slate-500 uppercase tracking-wider">oder manuell eingeben</span>
        <div className="flex-1 h-px bg-slate-700" />
      </div>

      {/* Live classification */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl" style={{ backgroundColor: `${classification.color}15` }}>
          <BPCategoryBadge systolic={systolic} diastolic={diastolic} />
          <span className="text-sm" style={{ color: classification.color }}>
            {classification.description}
          </span>
        </div>
      </div>

      {/* Systolic */}
      <NumberStepper
        label="Systolic"
        value={systolic}
        onChange={setSystolic}
        min={50}
        max={300}
        unit="mmHg"
        color={classification.color}
      />

      {/* Diastolic */}
      <NumberStepper
        label="Diastolic"
        value={diastolic}
        onChange={setDiastolic}
        min={20}
        max={200}
        unit="mmHg"
      />

      {/* Pulse */}
      <NumberStepper
        label="Pulse"
        value={pulse}
        onChange={setPulse}
        min={20}
        max={250}
        unit="bpm"
        color="#a855f7"
      />

      {/* Activity */}
      <ActivityPicker value={activity} onChange={setActivity} />

      {/* Date/time */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-300">Date & Time</label>
        <input
          type="datetime-local"
          value={measuredAt}
          onChange={(e) => setMeasuredAt(e.target.value)}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-300">Notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional notes..."
          rows={2}
          className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
      </div>

      {/* Attach photo (without scan) */}
      {!photoPreview && (
        <div className="space-y-2">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700 transition-colors">
            <Camera size={18} className="text-slate-400" />
            <span className="text-sm text-slate-300">Foto anhängen (ohne Scan)</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handlePhotoChange} />
          </label>
        </div>
      )}

      {/* Submit */}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Messung speichern
      </Button>
    </form>
  )
}

function NumberStepper({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  color,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  unit: string
  color?: string
}) {
  const step = (delta: number) => {
    onChange(Math.max(min, Math.min(max, value + delta)))
  }

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      <div className="flex items-center justify-between bg-slate-800 rounded-xl border border-slate-700 p-1">
        <button
          type="button"
          onClick={() => step(-1)}
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <Minus size={20} className="text-slate-300" />
        </button>
        <div className="flex items-baseline gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => {
              const v = parseInt(e.target.value)
              if (!isNaN(v) && v >= min && v <= max) onChange(v)
            }}
            className="w-20 text-center text-3xl font-bold bg-transparent text-white outline-none"
            style={color ? { color } : undefined}
          />
          <span className="text-sm text-slate-500">{unit}</span>
        </div>
        <button
          type="button"
          onClick={() => step(1)}
          className="flex items-center justify-center w-12 h-12 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <Plus size={20} className="text-slate-300" />
        </button>
      </div>
    </div>
  )
}
