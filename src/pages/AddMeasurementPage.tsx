import { useNavigate } from 'react-router-dom'
import { MeasurementForm } from '../components/bp/MeasurementForm'
import { useMeasurements } from '../hooks/useMeasurements'
import { useToast } from '../context/ToastContext'
import { useState } from 'react'
import type { MeasurementInput } from '../lib/types'

export function AddMeasurementPage() {
  const { addMeasurement } = useMeasurements()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (input: MeasurementInput) => {
    setSaving(true)
    const { error } = await addMeasurement(input)
    setSaving(false)
    if (error) {
      showToast(error.message, 'error')
    } else {
      showToast('Messung gespeichert!', 'success')
      navigate('/')
    }
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <h2 className="text-xl font-bold text-white mb-6">Neue Messung</h2>
      <MeasurementForm
        onSubmit={handleSubmit}
        loading={saving}
        onScanError={(msg) => showToast(msg, 'error')}
      />
    </div>
  )
}
