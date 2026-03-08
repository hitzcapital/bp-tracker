import { useState } from 'react'
import { Trash2, Clock, MessageSquare, Camera, ChevronDown, ChevronUp } from 'lucide-react'
import { BPCategoryBadge } from './BPCategoryBadge'
import { Card } from '../ui/Card'
import { formatTime } from '../../lib/date-utils'
import type { Measurement } from '../../lib/types'

interface BPCardProps {
  measurement: Measurement
  onDelete: (id: string) => void
}

export function BPCard({ measurement, onDelete }: BPCardProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="relative">
      <div className="flex items-center justify-between" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-white">{measurement.systolic}</span>
              <span className="text-slate-500">/</span>
              <span className="text-2xl font-bold text-white">{measurement.diastolic}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-slate-400">{measurement.pulse} bpm</span>
              <BPCategoryBadge systolic={measurement.systolic} diastolic={measurement.diastolic} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="flex items-center gap-1 text-sm text-slate-400">
              <Clock size={14} />
              {formatTime(measurement.measured_at)}
            </div>
            {measurement.activity && (
              <span className="text-xs text-slate-500">{measurement.activity}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {measurement.photo_url && <Camera size={14} className="text-slate-500" />}
            {measurement.notes && <MessageSquare size={14} className="text-slate-500" />}
            {expanded ? (
              <ChevronUp size={16} className="text-slate-500" />
            ) : (
              <ChevronDown size={16} className="text-slate-500" />
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-slate-700/50 space-y-2">
          {measurement.notes && (
            <p className="text-sm text-slate-400">{measurement.notes}</p>
          )}
          {measurement.photo_url && (
            <img
              src={measurement.photo_url}
              alt="Measurement photo"
              className="w-full max-w-[200px] rounded-lg"
            />
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(measurement.id)
            }}
            className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300 transition-colors"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </Card>
  )
}
