import { classifyBP } from '../../lib/classify'

interface BPGaugeProps {
  systolic: number
  diastolic: number
}

export function BPGauge({ systolic, diastolic }: BPGaugeProps) {
  const classification = classifyBP(systolic, diastolic)

  // Map systolic to angle (0-180 degrees for semicircle)
  const minVal = 70
  const maxVal = 200
  const clamped = Math.max(minVal, Math.min(maxVal, systolic))
  const angle = ((clamped - minVal) / (maxVal - minVal)) * 180

  const radius = 80
  const cx = 100
  const cy = 95

  // Create arc path
  const startX = cx - radius
  const startY = cy
  const endAngle = (angle * Math.PI) / 180
  const endX = cx - radius * Math.cos(endAngle)
  const endY = cy - radius * Math.sin(endAngle)
  const largeArc = angle > 90 ? 1 : 0

  // Background arc segments with category colors
  const segments = [
    { start: 0, end: 38.5, color: '#22c55e' },    // Normal (70-120)
    { start: 38.5, end: 46.2, color: '#eab308' },  // Elevated (120-130)
    { start: 46.2, end: 53.8, color: '#f97316' },  // High 1 (130-140)
    { start: 53.8, end: 84.6, color: '#ef4444' },  // High 2 (140-180)
    { start: 84.6, end: 100, color: '#dc2626' },    // Crisis (180-200)
  ]

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 120" className="w-56 h-auto">
        {/* Background segments */}
        {segments.map((seg, i) => {
          const sAngle = (seg.start / 100) * Math.PI
          const eAngle = (seg.end / 100) * Math.PI
          const sX = cx - radius * Math.cos(sAngle)
          const sY = cy - radius * Math.sin(sAngle)
          const eX = cx - radius * Math.cos(eAngle)
          const eY = cy - radius * Math.sin(eAngle)
          const large = eAngle - sAngle > Math.PI / 2 ? 1 : 0
          return (
            <path
              key={i}
              d={`M ${sX} ${sY} A ${radius} ${radius} 0 ${large} 0 ${eX} ${eY}`}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeLinecap="round"
              opacity="0.3"
            />
          )
        })}

        {/* Active arc */}
        <path
          d={`M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArc} 0 ${endX} ${endY}`}
          fill="none"
          stroke={classification.color}
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Needle dot */}
        <circle cx={endX} cy={endY} r="6" fill={classification.color} />

        {/* Reading text */}
        <text x={cx} y={cy - 15} textAnchor="middle" className="text-3xl font-bold" fill="white" fontSize="28">
          {systolic}
        </text>
        <text x={cx} y={cy + 5} textAnchor="middle" fill="#94a3b8" fontSize="14">
          /{diastolic}
        </text>
        <text x={cx} y={cy + 20} textAnchor="middle" fill="#64748b" fontSize="10">
          mmHg
        </text>
      </svg>
    </div>
  )
}
