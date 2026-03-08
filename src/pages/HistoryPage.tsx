import { useMemo, useCallback, useRef, useEffect, useState } from 'react'
import { Search, Filter } from 'lucide-react'
import { useMeasurements } from '../hooks/useMeasurements'
import { BPCard } from '../components/bp/BPCard'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../context/ToastContext'
import { getDayLabel } from '../lib/date-utils'
import { classifyBP } from '../lib/classify'
import type { BPCategory, Measurement } from '../lib/types'

export function HistoryPage() {
  const { measurements, loading, hasMore, loadMore, deleteMeasurement } = useMeasurements()
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<BPCategory | ''>('')
  const [showFilters, setShowFilters] = useState(false)
  const observerRef = useRef<HTMLDivElement>(null)

  // Infinite scroll
  useEffect(() => {
    if (!observerRef.current || !hasMore) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(observerRef.current)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  const filtered = useMemo(() => {
    let result = measurements
    if (categoryFilter) {
      result = result.filter((m) => classifyBP(m.systolic, m.diastolic).category === categoryFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (m) =>
          m.activity?.toLowerCase().includes(q) ||
          m.notes?.toLowerCase().includes(q) ||
          `${m.systolic}/${m.diastolic}`.includes(q)
      )
    }
    return result
  }, [measurements, categoryFilter, search])

  // Group by day
  const grouped = useMemo(() => {
    const groups: { label: string; items: Measurement[] }[] = []
    let currentLabel = ''
    for (const m of filtered) {
      const label = getDayLabel(m.measured_at)
      if (label !== currentLabel) {
        currentLabel = label
        groups.push({ label, items: [] })
      }
      groups[groups.length - 1].items.push(m)
    }
    return groups
  }, [filtered])

  const handleDelete = useCallback(
    async (id: string) => {
      const { error } = await deleteMeasurement(id)
      if (error) {
        showToast('Failed to delete', 'error')
      } else {
        showToast('Measurement deleted', 'info')
      }
    },
    [deleteMeasurement, showToast]
  )

  const categories: { key: BPCategory | ''; label: string }[] = [
    { key: '', label: 'All' },
    { key: 'normal', label: 'Normal' },
    { key: 'elevated', label: 'Elevated' },
    { key: 'high1', label: 'Stage 1' },
    { key: 'high2', label: 'Stage 2' },
    { key: 'crisis', label: 'Crisis' },
  ]

  return (
    <div className="max-w-lg mx-auto px-4 py-4 space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search measurements..."
            className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-xl border transition-colors ${showFilters ? 'bg-blue-600 border-blue-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'}`}
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                categoryFilter === cat.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {loading && measurements.length === 0 ? (
        <Spinner />
      ) : grouped.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500">No measurements yet</p>
          <p className="text-sm text-slate-600 mt-1">Tap the + button to add your first reading</p>
        </div>
      ) : (
        grouped.map((group) => (
          <div key={group.label} className="space-y-2">
            <h3 className="text-sm font-medium text-slate-400 px-1">{group.label}</h3>
            {group.items.map((m) => (
              <BPCard key={m.id} measurement={m} onDelete={handleDelete} />
            ))}
          </div>
        ))
      )}

      {hasMore && <div ref={observerRef}>{loading && <Spinner size="sm" />}</div>}
    </div>
  )
}
