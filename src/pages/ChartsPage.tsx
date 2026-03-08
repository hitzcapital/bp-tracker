import { useState, useEffect } from 'react'
import { useMeasurements } from '../hooks/useMeasurements'
import { useStats } from '../hooks/useStats'
import { TrendLineChart } from '../components/charts/TrendLineChart'
import { PulseChart } from '../components/charts/PulseChart'
import { CategoryDistribution } from '../components/charts/CategoryDistribution'
import { TimeOfDayChart } from '../components/charts/TimeOfDayChart'
import { WeeklyAverage } from '../components/charts/WeeklyAverage'
import { ActivityCorrelation } from '../components/charts/ActivityCorrelation'
import { Card } from '../components/ui/Card'
import { Spinner } from '../components/ui/Spinner'
import { getDateRangeBounds } from '../lib/date-utils'
import { isAfter } from 'date-fns'
import type { DateRange, ChartTab, Measurement } from '../lib/types'

const dateRanges: { key: DateRange; label: string }[] = [
  { key: '7D', label: '7D' },
  { key: '30D', label: '30D' },
  { key: '90D', label: '90D' },
  { key: '1Y', label: '1Y' },
  { key: 'ALL', label: 'All' },
]

const tabs: { key: ChartTab; label: string }[] = [
  { key: 'trend', label: 'Trend' },
  { key: 'pulse', label: 'Pulse' },
  { key: 'distribution', label: 'Distribution' },
  { key: 'timeOfDay', label: 'Time of Day' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'activity', label: 'Activity' },
]

export function ChartsPage() {
  const { measurements, loading, getAllMeasurements } = useMeasurements()
  const [allMeasurements, setAllMeasurements] = useState<Measurement[]>([])
  const [range, setRange] = useState<DateRange>('30D')
  const [tab, setTab] = useState<ChartTab>('trend')

  useEffect(() => {
    getAllMeasurements().then(setAllMeasurements)
  }, [measurements])  // eslint-disable-line react-hooks/exhaustive-deps

  const filteredData = range === 'ALL'
    ? allMeasurements
    : (() => {
        const bounds = getDateRangeBounds(range)
        return allMeasurements.filter((m) => isAfter(new Date(m.measured_at), bounds.start))
      })()

  const stats = useStats(filteredData)

  if (loading && measurements.length === 0) return <Spinner size="lg" />

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      {/* Date range selector */}
      <div className="flex gap-1 bg-slate-800 rounded-xl p-1">
        {dateRanges.map((r) => (
          <button
            key={r.key}
            onClick={() => setRange(r.key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${
              range === r.key ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 no-scrollbar">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Card className="p-2">
        {tab === 'trend' && <TrendLineChart measurements={filteredData} />}
        {tab === 'pulse' && <PulseChart measurements={filteredData} />}
        {tab === 'distribution' && <CategoryDistribution data={stats.categoryDistribution} />}
        {tab === 'timeOfDay' && <TimeOfDayChart data={stats.timeOfDayAverages} />}
        {tab === 'weekly' && <WeeklyAverage data={stats.weeklyAverages} />}
        {tab === 'activity' && <ActivityCorrelation data={stats.activityCorrelation} />}
      </Card>

      {/* Summary */}
      <Card>
        <p className="text-sm text-slate-400 mb-2">Period Summary</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-slate-500">Readings</p>
            <p className="text-lg font-bold text-white">{filteredData.length}</p>
          </div>
          {filteredData.length > 0 && (
            <>
              <div>
                <p className="text-xs text-slate-500">Avg Systolic</p>
                <p className="text-lg font-bold text-blue-400">
                  {Math.round(filteredData.reduce((s, m) => s + m.systolic, 0) / filteredData.length)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg Diastolic</p>
                <p className="text-lg font-bold text-purple-400">
                  {Math.round(filteredData.reduce((s, m) => s + m.diastolic, 0) / filteredData.length)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Avg Pulse</p>
                <p className="text-lg font-bold text-violet-400">
                  {Math.round(filteredData.reduce((s, m) => s + m.pulse, 0) / filteredData.length)}
                </p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
