import { ACTIVITIES } from '../../lib/types'

interface ActivityPickerProps {
  value: string
  onChange: (activity: string) => void
}

export function ActivityPicker({ value, onChange }: ActivityPickerProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">Activity</label>
      <div className="flex flex-wrap gap-2">
        {ACTIVITIES.map((activity) => (
          <button
            key={activity}
            type="button"
            onClick={() => onChange(activity === value ? '' : activity)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              value === activity
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
            }`}
          >
            {activity}
          </button>
        ))}
      </div>
    </div>
  )
}
