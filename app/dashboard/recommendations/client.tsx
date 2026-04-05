'use client'

import { useState, useOptimistic, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { ImpactBadge } from '@/components/impact-badge'
import { CategoryIcon, categoryLabel } from '@/components/category-icon'
import { StatusBadge, StatusSelect } from '@/components/status-badge'
import type { Category, ImpactLevel, RecommendationStatus } from '@/lib/types'

const ALL = 'all'

async function patchStatus(id: number, status: string) {
  await fetch(`/api/recommendations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export function RecommendationsClient({
  findings,
  recommendations: initialRecs,
}: {
  findings: any[]
  recommendations: any[]
}) {
  const [recs, setRecs] = useState(initialRecs)
  const [, startTransition] = useTransition()
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>(ALL)
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | 'all'>(ALL)
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>(ALL)
  const [search, setSearch] = useState('')

  const handleStatusChange = (recId: number, status: RecommendationStatus) => {
    // Optimistic update
    setRecs(prev => prev.map(r => r.Id === recId ? { ...r, status } : r))
    startTransition(() => { patchStatus(recId, status) })
  }

  const filtered = recs.filter(rec => {
    const finding = findings.find(f => f.finding_ref === rec.finding_ref)
    if (!finding) return false
    if (categoryFilter !== ALL && finding.category !== categoryFilter) return false
    if (impactFilter !== ALL && finding.impact_level !== impactFilter) return false
    if (statusFilter !== ALL && rec.status !== statusFilter) return false
    if (search && !rec.title?.toLowerCase().includes(search.toLowerCase()) &&
        !finding.title?.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    const order: Record<string, number> = { pending: 0, in_progress: 1, done: 2, dismissed: 3 }
    if ((order[a.status] ?? 0) !== (order[b.status] ?? 0)) return (order[a.status] ?? 0) - (order[b.status] ?? 0)
    return (b.priority ?? 0) - (a.priority ?? 0)
  })

  const counts = {
    pending: recs.filter(r => r.status === 'pending').length,
    in_progress: recs.filter(r => r.status === 'in_progress').length,
    done: recs.filter(r => r.status === 'done').length,
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Recomendaciones</h1>
        <p className="text-slate-500 mt-1">
          {recs.length} acciones detectadas · {counts.pending} pendientes · {counts.done} completadas
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter size={15} />
            <span className="font-medium">Filtrar:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'offers', 'reviews', 'web', 'experience', 'copy'] as const).map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${categoryFilter === cat ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {cat === 'all' ? 'Todo' : categoryLabel(cat)}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'high', 'medium', 'low'] as const).map(level => (
              <button key={level} onClick={() => setImpactFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${impactFilter === level ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {level === 'all' ? 'Todos' : level === 'high' ? 'Alta' : level === 'medium' ? 'Media' : 'Baja'}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'pending', 'in_progress', 'done', 'dismissed'] as const).map(s => (
              <button key={s} onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {s === 'all' ? 'Todos' : s === 'pending' ? 'Pendientes' : s === 'in_progress' ? 'En progreso' : s === 'done' ? 'Completadas' : 'Descartadas'}
              </button>
            ))}
          </div>
          <div className="ml-auto relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-48" />
          </div>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4">Mostrando {sorted.length} de {recs.length} recomendaciones</p>

      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400"><p>Sin resultados — prueba a cambiar los filtros</p></div>
        ) : sorted.map(rec => {
          const finding = findings.find(f => f.finding_ref === rec.finding_ref)
          if (!finding) return null
          return (
            <div key={rec.Id} className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5">
              <div className="flex items-start gap-4">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5 ${rec.priority >= 5 ? 'bg-red-100 text-red-700' : rec.priority >= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                  P{rec.priority}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <CategoryIcon category={finding.category as Category} showLabel />
                    <ImpactBadge level={finding.impact_level as ImpactLevel} />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{finding.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mb-3">{finding.description}</p>
                  <blockquote className="border-l-2 border-brand-200 pl-3 text-xs text-slate-500 italic line-clamp-2 mb-3">
                    {(finding.evidence ?? '').split('·')[0].trim()}
                  </blockquote>
                  <div className="flex items-center gap-3 flex-wrap">
                    <StatusSelect status={rec.status as RecommendationStatus} onChange={s => handleStatusChange(rec.Id, s)} />
                    <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">{rec.estimated_impact}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <StatusBadge status={rec.status as RecommendationStatus} />
                  <Link href={`/dashboard/findings/${finding.Id}`} className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium">
                    Ver detalle <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
