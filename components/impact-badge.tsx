import type { ImpactLevel } from '@/lib/types'

const map: Record<ImpactLevel, { label: string; classes: string; dot: string }> = {
  high: {
    label: 'Impacto alto',
    classes: 'bg-red-50 text-red-700 border border-red-200',
    dot: 'bg-red-500',
  },
  medium: {
    label: 'Impacto medio',
    classes: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-500',
  },
  low: {
    label: 'Impacto bajo',
    classes: 'bg-slate-50 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  },
}

export function ImpactBadge({ level }: { level: ImpactLevel }) {
  const { label, classes, dot } = map[level]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  )
}
