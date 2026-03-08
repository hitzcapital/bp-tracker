import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { week: string; systolic: number; diastolic: number }[]
}

export function WeeklyAverage({ data }: Props) {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-slate-500">Not enough data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis dataKey="week" stroke="#475569" fontSize={11} />
        <YAxis stroke="#475569" fontSize={11} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
        />
        <Bar dataKey="systolic" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Systolic Avg" />
        <Bar dataKey="diastolic" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Diastolic Avg" />
      </BarChart>
    </ResponsiveContainer>
  )
}
