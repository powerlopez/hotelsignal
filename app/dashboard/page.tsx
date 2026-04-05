import Link from 'next/link'
import { ArrowRight, TrendingUp, CheckCircle2, Clock, AlertCircle, Lightbulb } from 'lucide-react'
import { getHotel, getLatestCycle, getFindings, getRecommendations } from '@/lib/nocodb'
import { OpportunityScore, ScoreBreakdown } from '@/components/opportunity-score'
import { ImpactBadge } from '@/components/impact-badge'
import { CategoryIcon } from '@/components/category-icon'
import { StatusBadge } from '@/components/status-badge'
import type { ImpactLevel, Category, RecommendationStatus } from '@/lib/types'

export default async function DashboardPage() {
  const [hotelRaw, cycleRaw, findingsRaw, recsRaw] = await Promise.all([
    getHotel(), getLatestCycle(), getFindings(), getRecommendations(),
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = hotelRaw as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cycle = cycleRaw as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findings = findingsRaw as any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recs = recsRaw as any[]

  const pending    = recs.filter(r => r.status === 'pending').length
  const inProgress = recs.filter(r => r.status === 'in_progress').length
  const done       = recs.filter(r => r.status === 'done').length

  const highRecs = recs.filter(r => r.priority >= 4 && r.status !== 'done' && r.status !== 'dismissed')
  const totalMinB = highRecs.reduce((s: number, r: any) => s + (r.estimated_bookings_min ?? 0), 0)
  const totalMaxB = highRecs.reduce((s: number, r: any) => s + (r.estimated_bookings_max ?? 0), 0)
  const adr = hotel?.adr_eur ?? 95
  const nights = hotel?.avg_stay_nights ?? 5
  const commission = hotel?.ota_commission_pct ?? 18
  const commMin = Math.round(totalMinB * adr * nights * (commission / 100))
  const commMax = Math.round(totalMaxB * adr * nights * (commission / 100))

  const topFindings = findings.filter(f => f.impact_level === 'high').slice(0, 3)

  const scoreBreakdown = {
    commercial_coherence: hotel?.score_commercial_coherence ?? 0,
    review_utilization:   hotel?.score_review_utilization ?? 0,
    offer_quality:        hotel?.score_offer_quality ?? 0,
  }

  const cycleDate = cycle?.triggered_at
    ? new Date(cycle.triggered_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '—'

  const nonDismissed = recs.filter(r => r.status !== 'dismissed').length

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="text-sm text-slate-500 mb-1">Análisis del {cycleDate}</p>
        <h1 className="text-2xl font-bold text-slate-900">Resumen comercial</h1>
        <p className="text-slate-500 mt-1">
          {cycle?.findings_count ?? 0} hallazgos detectados · {pending + inProgress} acciones pendientes
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard label="Hallazgos detectados" value={cycle?.findings_count ?? 0} icon={<AlertCircle size={18} className="text-slate-500" />} sub="este ciclo" />
        <StatCard label="Pendientes" value={pending} icon={<Clock size={18} className="text-amber-500" />} sub="por implementar" highlight="amber" />
        <StatCard label="En progreso" value={inProgress} icon={<TrendingUp size={18} className="text-blue-500" />} sub="en ejecución" highlight="blue" />
        <StatCard label="Completadas" value={done} icon={<CheckCircle2 size={18} className="text-green-500" />} sub="este ciclo" highlight="green" />
      </div>

      {/* Score + breakdown + economic impact */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-center justify-center gap-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Opportunity Score</h2>
          <OpportunityScore score={hotel?.opportunity_score ?? 0} size={160} />
          <p className="text-xs text-slate-400 text-center">
            Implementa las {highRecs.length} acciones prioritarias para subir a{' '}
            <span className="font-semibold text-brand-600">
              {Math.min(100, (hotel?.opportunity_score ?? 0) + 19)}/100
            </span>
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">Desglose del score</h2>
          <ScoreBreakdown breakdown={scoreBreakdown} />
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-base">💰</span>
            </div>
            <h2 className="text-sm font-semibold text-amber-800">Oportunidad económica</h2>
          </div>
          <p className="text-xs text-amber-700 mb-4">
            Si implementas las {highRecs.length} recomendaciones prioritarias pendientes:
          </p>
          <div className="mb-4">
            <div className="text-2xl font-bold text-amber-900">+{totalMinB}–{totalMaxB}</div>
            <div className="text-xs text-amber-700">reservas directas adicionales/mes</div>
          </div>
          <div className="bg-white/60 rounded-xl p-3 mb-3">
            <div className="text-lg font-bold text-amber-900">
              €{commMin.toLocaleString('es-ES')} – €{commMax.toLocaleString('es-ES')}/mes
            </div>
            <div className="text-xs text-amber-700">ahorro estimado en comisiones OTA</div>
          </div>
          <p className="text-xs text-amber-600/70">ADR €{adr} · estancia media {nights}n · comisión OTA {commission}%</p>
          <p className="text-xs text-amber-600/60 mt-2 italic">* Estimación basada en buenas prácticas del sector.</p>
        </div>
      </div>

      {/* Top priority findings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-brand-600" />
            <h2 className="text-base font-semibold text-slate-900">Oportunidades prioritarias</h2>
          </div>
          <Link href="/dashboard/recommendations" className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center gap-1">
            Ver todas <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {topFindings.map((finding: any) => {
            const rec = recs.find((r: any) => r.finding_ref === finding.finding_ref)
            return (
              <Link
                key={finding.Id}
                href={`/dashboard/findings/${finding.Id}`}
                className="bg-white rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-sm p-5 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <CategoryIcon category={finding.category as Category} showLabel />
                      <ImpactBadge level={finding.impact_level as ImpactLevel} />
                      {rec && <StatusBadge status={rec.status as RecommendationStatus} />}
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900 mb-1 group-hover:text-brand-700">{finding.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{finding.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    {rec && (
                      <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-1 rounded-lg whitespace-nowrap">
                        {rec.estimated_impact}
                      </span>
                    )}
                    <ArrowRight size={16} className="text-slate-300 group-hover:text-brand-500 transition-colors mt-1" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">Progreso de implementación</h2>
          <span className="text-sm text-slate-500">{done} de {nonDismissed} completadas</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full"
            style={{ width: `${nonDismissed > 0 ? Math.round((done / nonDismissed) * 100) : 0}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-brand-500" />Completadas: {done}</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-blue-400" />En progreso: {inProgress}</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-2 h-2 rounded-full bg-slate-300" />Pendientes: {pending}</span>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon, sub, highlight }: {
  label: string; value: number; icon: React.ReactNode; sub?: string; highlight?: 'amber' | 'blue' | 'green'
}) {
  const cls = { amber: 'border-amber-200 bg-amber-50', blue: 'border-blue-200 bg-blue-50', green: 'border-green-200 bg-green-50' }
  return (
    <div className={`rounded-xl border p-5 ${highlight ? cls[highlight] : 'bg-white border-slate-200'}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold text-slate-900">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}
