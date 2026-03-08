import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import type { BPCategory } from '../../lib/types'

interface Props {
  data: { category: BPCategory; label: string; count: number; color: string }[]
}

export function CategoryDistribution({ data }: Props) {
  if (data.length === 0) {
    return <div className="flex items-center justify-center h-[280px] text-slate-500">Not enough data</div>
  }

  const total = data.reduce((s, d) => s + d.count, 0)

  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width="50%" height={240}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="label"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
          >
            {data.map((d) => (
              <Cell key={d.category} fill={d.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.category} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-slate-300">{d.label}</span>
            <span className="text-xs text-slate-500">{Math.round((d.count / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
