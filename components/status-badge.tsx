'use client'

import type { RecommendationStatus } from '@/lib/types'

const map: Record<RecommendationStatus, { label: string; classes: string }> = {
  pending: {
    label: 'Pendiente',
    classes: 'bg-slate-100 text-slate-600',
  },
  in_progress: {
    label: 'En progreso',
    classes: 'bg-blue-50 text-blue-700',
  },
  done: {
    label: 'Completada',
    classes: 'bg-green-50 text-green-700',
  },
  dismissed: {
    label: 'Descartada',
    classes: 'bg-slate-50 text-slate-400',
  },
}

export function StatusBadge({ status }: { status: RecommendationStatus }) {
  const { label, classes } = map[status]
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${classes}`}>
      {label}
    </span>
  )
}

interface StatusSelectProps {
  status: RecommendationStatus
  onChange: (status: RecommendationStatus) => void
}

export function StatusSelect({ status, onChange }: StatusSelectProps) {
  return (
    <select
      value={status}
      onChange={e => onChange(e.target.value as RecommendationStatus)}
      className="text-xs font-medium rounded-md px-2 py-1.5 border border-slate-200 bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <option value="pending">Pendiente</option>
      <option value="in_progress">En progreso</option>
      <option value="done">Completada</option>
      <option value="dismissed">Descartada</option>
    </select>
  )
}
