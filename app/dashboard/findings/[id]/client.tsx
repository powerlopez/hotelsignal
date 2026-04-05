'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft, CheckCircle2, Clock, TrendingUp, XCircle,
  Quote, Lightbulb, BarChart3, StickyNote,
} from 'lucide-react'
import { ImpactBadge } from '@/components/impact-badge'
import { CategoryIcon } from '@/components/category-icon'
import { StatusSelect } from '@/components/status-badge'
import type { Category, ImpactLevel, RecommendationStatus } from '@/lib/types'

const statusConfig: Record<string, { label: string; Icon: React.ElementType; color: string }> = {
  pending:     { label: 'Pendiente',   Icon: Clock,         color: 'text-slate-500' },
  in_progress: { label: 'En progreso', Icon: TrendingUp,    color: 'text-blue-600'  },
  done:        { label: 'Completada',  Icon: CheckCircle2,  color: 'text-green-600' },
  dismissed:   { label: 'Descartada', Icon: XCircle,        color: 'text-slate-400' },
}

async function patchRec(id: number, fields: Record<string, unknown>) {
  await fetch(`/api/recommendations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fields),
  })
}

export function FindingDetailClient({ finding, recommendation }: { finding: any; recommendation: any }) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [status, setStatus] = useState<RecommendationStatus>(recommendation?.status ?? 'pending')
  const [notes, setNotes] = useState<string>(recommendation?.notes ?? '')
  const [notesSaved, setNotesSaved] = useState(false)

  const handleStatusChange = (s: RecommendationStatus) => {
    setStatus(s)
    if (recommendation?.Id) startTransition(() => patchRec(recommendation.Id, { status: s }))
  }

  const handleSaveNotes = () => {
    if (recommendation?.Id) patchRec(recommendation.Id, { notes })
    setNotesSaved(true)
    setTimeout(() => setNotesSaved(false), 2000)
  }

  const statusInfo = statusConfig[status] ?? statusConfig.pending
  const StatusIcon = statusInfo.Icon
  const actionSteps = (recommendation?.action_detail ?? '').split('\n').filter(Boolean)
  const evidenceParts = (finding.evidence ?? '').split('·').map((s: string) => s.trim()).filter(Boolean)

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6 font-medium transition-colors">
        <ArrowLeft size={16} /> Volver a recomendaciones
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-7 mb-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <CategoryIcon category={finding.category as Category} showLabel />
          <ImpactBadge level={finding.impact_level as ImpactLevel} />
          <span className="ml-auto flex items-center gap-1.5 text-sm font-medium">
            <StatusIcon size={15} className={statusInfo.color} />
            <span className={statusInfo.color}>{statusInfo.label}</span>
          </span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-3">{finding.title}</h1>
        <p className="text-slate-600 leading-relaxed">{finding.description}</p>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Evidence */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-amber-50 rounded-lg flex items-center justify-center">
              <Quote size={14} className="text-amber-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Evidencia del hallazgo</h2>
          </div>
          <p className="text-xs text-slate-500 mb-4 italic">{finding.impact_rationale}</p>
          <div className="space-y-3">
            {evidenceParts.map((part: string, i: number) => (
              <blockquote key={i} className="border-l-2 border-amber-300 pl-4 py-2 bg-amber-50/50 rounded-r-lg">
                <p className="text-sm text-slate-700 italic">{part}</p>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Impact */}
        <div className="bg-gradient-to-b from-brand-50 to-white rounded-2xl border border-brand-100 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-brand-100 rounded-lg flex items-center justify-center">
              <BarChart3 size={14} className="text-brand-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Impacto estimado</h2>
          </div>
          <div className="text-3xl font-bold text-brand-700 mb-1">
            +{recommendation?.estimated_bookings_min ?? 0}–{recommendation?.estimated_bookings_max ?? 0}
          </div>
          <p className="text-xs text-slate-500 mb-4">reservas directas/mes</p>
          <div className="bg-white rounded-xl border border-brand-100 p-3 mb-4">
            <p className="text-xs font-semibold text-brand-700">{recommendation?.estimated_impact}</p>
          </div>
          <div className="text-xs text-slate-500">
            <div className="flex justify-between mb-1"><span>Prioridad</span><span className="font-semibold text-slate-700">P{recommendation?.priority ?? 1}/5</span></div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${i < (recommendation?.priority ?? 0) ? 'bg-brand-500' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action steps */}
      {actionSteps.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center">
              <Lightbulb size={14} className="text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Plan de acción recomendado</h2>
          </div>
          <ol className="space-y-3">
            {actionSteps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-brand-100 text-brand-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <p className="text-sm text-slate-700 leading-relaxed pt-0.5">{step.replace(/^\d+\.\s*/, '')}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Status + Notes */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Estado de la acción</h2>
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-2">
            {(['pending', 'in_progress', 'done'] as const).map((s, i) => {
              const conf = statusConfig[s]
              const Icon = conf.Icon
              const isActive = status === s
              const stepOrder = ['pending', 'in_progress', 'done']
              const isDone = stepOrder.indexOf(s) <= stepOrder.indexOf(status)
              return (
                <div key={s} className="flex items-center gap-2">
                  {i > 0 && <div className={`h-0.5 w-6 flex-shrink-0 ${isDone ? 'bg-brand-400' : 'bg-slate-200'}`} />}
                  <button onClick={() => handleStatusChange(s)}
                    className={`flex flex-col items-center gap-1 flex-shrink-0 transition-opacity ${isActive ? 'opacity-100' : 'opacity-50 hover:opacity-75'}`}>
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${isActive ? 'border-brand-500 bg-brand-50' : isDone ? 'border-brand-300 bg-brand-50' : 'border-slate-200 bg-white'}`}>
                      <Icon size={16} className={isActive ? 'text-brand-600' : isDone ? 'text-brand-400' : 'text-slate-400'} />
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${isActive ? 'text-brand-700' : 'text-slate-400'}`}>{conf.label}</span>
                  </button>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Cambiar estado:</span>
            <StatusSelect status={status} onChange={handleStatusChange} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-slate-50 rounded-lg flex items-center justify-center">
              <StickyNote size={14} className="text-slate-500" />
            </div>
            <h2 className="text-sm font-semibold text-slate-900">Notas internas</h2>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Añade notas sobre el seguimiento, personas responsables, bloqueos..."
            rows={4}
            className="w-full text-sm text-slate-700 border border-slate-200 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 placeholder:text-slate-300" />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-400">Solo visible en este backoffice</p>
            <button onClick={handleSaveNotes}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-all ${notesSaved ? 'bg-green-50 text-green-700' : 'bg-brand-600 hover:bg-brand-700 text-white'}`}>
              {notesSaved ? '✓ Guardado' : 'Guardar nota'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
