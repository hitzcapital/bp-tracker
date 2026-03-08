import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from 'recharts'
import { format } from 'date-fns'
import type { Measurement } from '../../lib/types'
import { WHO_BANDS } from '../../lib/constants'

interface Props {
  measurements: Measurement[]
}

export function TrendLineChart({ measurements }: Props) {
  const data = [...measurements]
    .reverse()
    .map((m) => ({
      date: format(new Date(m.measured_at), 'MM/dd'),
      systolic: m.systolic,
      diastolic: m.diastolic,
      fullDate: format(new Date(m.measured_at), 'MMM d, HH:mm'),
    }))

  if (data.length === 0) return <EmptyChart />

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        {WHO_BANDS.map((band) => (
          <ReferenceArea
            key={band.label}
            y1={band.min}
            y2={band.max}
            fill={band.color}
            fillOpacity={1}
          />
        ))}
        <XAxis dataKey="date" stroke="#475569" fontSize={11} />
        <YAxis stroke="#475569" fontSize={11} domain={['dataMin - 10', 'dataMax + 10']} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
          labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
        />
        <Line type="monotone" dataKey="systolic" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Systolic" />
        <Line type="monotone" dataKey="diastolic" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="Diastolic" />
      </LineChart>
    </ResponsiveContainer>
  )
}

function EmptyChart() {
  return (
    <div className="flex items-center justify-center h-[280px] text-slate-500">
      Not enough data for chart
    </div>
  )
}
