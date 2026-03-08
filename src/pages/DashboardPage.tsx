import { useNavigate } from 'react-router-dom'
import { Plus, TrendingUp, TrendingDown, Minus, Flame, Activity } from 'lucide-react'
import { useMeasurements } from '../hooks/useMeasurements'
import { useStats } from '../hooks/useStats'
import { BPGauge } from '../components/bp/BPGauge'
import { BPCategoryBadge } from '../components/bp/BPCategoryBadge'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

export function DashboardPage() {
  const { measurements, loading } = useMeasurements()
  const { todayStats, trend, streak, rolling7 } = useStats(measurements)
  const navigate = useNavigate()

  if (loading && measurements.length === 0) return <Spinner size="lg" />

  const latest = measurements[0]

  // Sparkline data (last 7 days)
  const sparklineData = measurements
    .slice(0, 14)
    .reverse()
    .map((m) => ({ sys: m.systolic, dia: m.diastolic }))

  const TrendIcon =
    trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus
  const trendColor = trend.direction === 'up' ? 'text-red-400' : trend.direction === 'down' ? 'text-green-400' : 'text-slate-400'

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {!latest ? (
        <div className="text-center py-16 space-y-4">
          <Activity size={48} className="mx-auto text-slate-600" />
          <h2 className="text-xl font-semibold text-white">No readings yet</h2>
          <p className="text-slate-400">Add your first blood pressure measurement to get started.</p>
          <button
            onClick={() => navigate('/add')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
          >
            Add First Reading
          </button>
        </div>
      ) : (
        <>
          {/* Latest reading with gauge */}
          <Card className="text-center py-4">
            <p className="text-sm text-slate-400 mb-2">Latest Reading</p>
            <BPGauge systolic={latest.systolic} diastolic={latest.diastolic} />
            <div className="flex items-center justify-center gap-2 mt-2">
              <BPCategoryBadge systolic={latest.systolic} diastolic={latest.diastolic} />
              <span className="text-sm text-slate-500">
                {latest.pulse} bpm
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {format(new Date(latest.measured_at), 'MMM d, HH:mm')}
            </p>
          </Card>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {/* Today */}
            <Card className="text-center">
              <p className="text-xs text-slate-500 mb-1">Today</p>
              <p className="text-2xl font-bold text-white">{todayStats.count}</p>
              <p className="text-xs text-slate-500">readings</p>
            </Card>

            {/* Trend */}
            <Card className="text-center">
              <p className="text-xs text-slate-500 mb-1">7-Day Trend</p>
              <div className="flex items-center justify-center gap-1">
                <TrendIcon size={20} className={trendColor} />
                <span className={`text-lg font-bold ${trendColor}`}>
                  {trend.percentChange}%
                </span>
              </div>
              <p className="text-xs text-slate-500">{trend.direction}</p>
            </Card>

            {/* Streak */}
            <Card className="text-center">
              <p className="text-xs text-slate-500 mb-1">Streak</p>
              <div className="flex items-center justify-center gap-1">
                <Flame size={18} className="text-orange-400" />
                <span className="text-2xl font-bold text-white">{streak}</span>
              </div>
              <p className="text-xs text-slate-500">days</p>
            </Card>
          </div>

          {/* 7-day average */}
          {rolling7.systolic > 0 && (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">7-Day Average</p>
                  <p className="text-xl font-bold text-white">
                    {rolling7.systolic}/{rolling7.diastolic}
                    <span className="text-sm text-slate-500 ml-1">mmHg</span>
                  </p>
                </div>
                <div className="w-32 h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparklineData}>
                      <Line type="monotone" dataKey="sys" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="dia" stroke="#6366f1" strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          )}

          {/* Today's average */}
          {todayStats.count > 0 && (
            <Card>
              <p className="text-sm text-slate-400 mb-2">Today's Average</p>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-2xl font-bold text-white">{todayStats.avgSystolic}</span>
                  <span className="text-slate-500">/{todayStats.avgDiastolic}</span>
                  <span className="text-xs text-slate-600 ml-1">mmHg</span>
                </div>
                <div>
                  <span className="text-lg font-semibold text-purple-400">{todayStats.avgPulse}</span>
                  <span className="text-xs text-slate-600 ml-1">bpm</span>
                </div>
              </div>
            </Card>
          )}
        </>
      )}

      {/* FAB */}
      {latest && (
        <button
          onClick={() => navigate('/add')}
          className="fixed right-4 bottom-24 w-14 h-14 bg-blue-600 rounded-full shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 active:scale-95 transition-all z-30"
        >
          <Plus size={28} className="text-white" />
        </button>
      )}
    </div>
  )
}
