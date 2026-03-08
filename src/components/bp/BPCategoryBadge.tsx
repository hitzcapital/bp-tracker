import { classifyBP } from '../../lib/classify'
import { Badge } from '../ui/Badge'

interface BPCategoryBadgeProps {
  systolic: number
  diastolic: number
}

export function BPCategoryBadge({ systolic, diastolic }: BPCategoryBadgeProps) {
  const classification = classifyBP(systolic, diastolic)
  return <Badge label={classification.label} color={classification.color} />
}
