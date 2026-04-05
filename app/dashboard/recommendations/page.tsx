'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { findings } from '@/data/hotel-data'
import { useRecommendations } from '@/lib/recommendations-store'
import { ImpactBadge } from '@/components/impact-badge'
import { CategoryIcon, categoryLabel } from '@/components/category-icon'
import { StatusBadge, StatusSelect } from '@/components/status-badge'
import type { Category, ImpactLevel, RecommendationStatus } from '@/lib/types'

const ALL = 'all'

export default function RecommendationsPage() {
  const { recommendations, updateStatus } = useRecommendations()
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>(ALL)
  const [impactFilter, setImpactFilter] = useState<ImpactLevel | 'all'>(ALL)
  const [statusFilter, setStatusFilter] = useState<RecommendationStatus | 'all'>(ALL)
  const [search, setSearch] = useState('')

  const filtered = recommendations.filter(rec => {
    const finding = findings.find(f => f.id === rec.finding_id)
    if (!finding) return false

    if (categoryFilter !== ALL && finding.category !== categoryFilter) return false
    if (impactFilter !== ALL && finding.impact_level !== impactFilter) return false
    if (statusFilter !== ALL && rec.status !== statusFilter) return false
    if (search && !rec.title.toLowerCase().includes(search.toLowerCase()) &&
        !finding.title.toLowerCase().includes(search.toLowerCase())) return false

    return true
  })

  // Sort: priority desc, then by status (pending first)
  const sorted = [...filtered].sort((a, b) => {
    const statusOrder: Record<RecommendationStatus, number> = { pending: 0, in_progress: 1, done: 2, dismissed: 3 }
    if (statusOrder[a.status] !== statusOrder[b.status]) return statusOrder[a.status] - statusOrder[b.status]
    return b.priority - a.priority
  })

  const counts = {
    pending: recommendations.filter(r => r.status === 'pending').length,
    in_progress: recommendations.filter(r => r.status === 'in_progress').length,
    done: recommendations.filter(r => r.status === 'done').length,
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Recomendaciones</h1>
        <p className="text-slate-500 mt-1">
          {recommendations.length} acciones detectadas · {counts.pending} pendientes · {counts.done} completadas
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Filter size={15} />
            <span className="font-medium">Filtrar por:</span>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'offers', 'reviews', 'web', 'experience', 'copy'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'Todo' : categoryLabel(cat)}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Impact filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'high', 'medium', 'low'] as const).map(level => (
              <button
                key={level}
                onClick={() => setImpactFilter(level)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  impactFilter === level
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {level === 'all' ? 'Todos' : level === 'high' ? 'Alta' : level === 'medium' ? 'Media' : 'Baja'}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-slate-200" />

          {/* Status filter */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'pending', 'in_progress', 'done', 'dismissed'] as const).map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s === 'all' ? 'Todos los estados' :
                 s === 'pending' ? 'Pendientes' :
                 s === 'in_progress' ? 'En progreso' :
                 s === 'done' ? 'Completadas' : 'Descartadas'}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="ml-auto relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 w-48"
            />
          </div>
        </div>
      </div>

      {/* Count */}
      <p className="text-sm text-slate-500 mb-4">
        Mostrando {sorted.length} de {recommendations.length} recomendaciones
      </p>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <p className="text-lg mb-1">Sin resultados</p>
            <p className="text-sm">Prueba a cambiar los filtros</p>
          </div>
        ) : (
          sorted.map(rec => {
            const finding = findings.find(f => f.id === rec.finding_id)!
            return (
              <div
                key={rec.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all p-5"
              >
                <div className="flex items-start gap-4">
                  {/* Priority indicator */}
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 mt-0.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        rec.priority >= 5
                          ? 'bg-red-100 text-red-700'
                          : rec.priority >= 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      P{rec.priority}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CategoryIcon category={finding.category} showLabel />
                      <ImpactBadge level={finding.impact_level} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">
                      {finding.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                      {finding.description}
                    </p>

                    {/* Evidence excerpt */}
                    <blockquote className="border-l-2 border-brand-200 pl-3 text-xs text-slate-500 italic line-clamp-2 mb-3">
                      {finding.evidence.split('·')[0].trim()}
                    </blockquote>

                    <div className="flex items-center gap-3 flex-wrap">
                      <StatusSelect
                        status={rec.status}
                        onChange={s => updateStatus(rec.id, s)}
                      />
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-lg">
                        {rec.estimated_impact}
                      </span>
                    </div>
                  </div>

                  {/* Right: status + link */}
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <StatusBadge status={rec.status} />
                    <Link
                      href={`/dashboard/findings/${finding.id}`}
                      className="flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Ver detalle
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
