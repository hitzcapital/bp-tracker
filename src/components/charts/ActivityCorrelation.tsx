import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  data: { activity: string; avgSystolic: number; avgDiastolic: number; count: number }[]
}

export function ActivityCorrelation({ data }: Props) {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-slate-500">Not enough data</div>
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
        <XAxis type="number" stroke="#475569" fontSize={11} />
        <YAxis dataKey="activity" type="category" stroke="#475569" fontSize={11} width={80} />
        <Tooltip
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
          formatter={(value, name) => [`${value} mmHg`, name]}
        />
        <Bar dataKey="avgSystolic" fill="#3b82f6" radius={[0, 4, 4, 0]} name="Avg Systolic" />
        <Bar dataKey="avgDiastolic" fill="#8b5cf6" radius={[0, 4, 4, 0]} name="Avg Diastolic" />
      </BarChart>
    </ResponsiveContainer>
  )
}
