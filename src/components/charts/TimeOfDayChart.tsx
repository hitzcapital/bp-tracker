import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { period: string; systolic: number; diastolic: number; count: number }[]
}

export function TimeOfDayChart({ data }: Props) {
  const hasData = data.some((d) => d.count > 0)
  if (!hasData) {
    return <div className="flex items-center justify-center h-[280px] text-slate-500">Not enough data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="period" stroke="#475569" fontSize={11} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
        />
        <Bar dataKey="systolic" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Systolic" />
        <Bar dataKey="diastolic" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Diastolic" />
      </BarChart>
    </ResponsiveContainer>
  )
}
