import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import type { Measurement } from '../../lib/types'

interface Props {
  measurements: Measurement[]
}

export function PulseChart({ measurements }: Props) {
  const data = [...measurements]
    .reverse()
    .map((m) => ({
      date: format(new Date(m.measured_at), 'MM/dd'),
      pulse: m.pulse,
      fullDate: format(new Date(m.measured_at), 'MMM d, HH:mm'),
    }))

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-slate-500">Not enough data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="date" stroke="#475569" fontSize={11} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
          labelFormatter={(_, payload) => payload[0]?.payload?.fullDate || ''}
        />
        <Area type="monotone" dataKey="pulse" stroke="#a855f7" strokeWidth={2} fill="url(#pulseGradient)" name="Pulse" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
