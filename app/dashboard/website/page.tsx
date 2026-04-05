import { getWebAnalysis, getHotel } from '@/lib/nocodb'
import { Search, FileText, Smartphone, Wrench, Globe2, CheckCircle2, AlertTriangle, XCircle, AlertCircle, ChevronRight } from 'lucide-react'

type Severity = 'good' | 'warning' | 'error' | 'critical'
type Category = 'seo' | 'copy' | 'ux' | 'technical' | 'translations'

const categoryMeta: Record<Category, { label: string; Icon: React.ElementType; color: string; bg: string; border: string }> = {
  seo:          { label: 'SEO',           Icon: Search,    color: 'text-violet-700', bg: 'bg-violet-50',  border: 'border-violet-200' },
  copy:         { label: 'Copy & Textos', Icon: FileText,  color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200'   },
  ux:           { label: 'UX & Mobile',   Icon: Smartphone,color: 'text-teal-700',   bg: 'bg-teal-50',    border: 'border-teal-200'   },
  technical:    { label: 'Técnico',       Icon: Wrench,    color: 'text-slate-700',  bg: 'bg-slate-50',   border: 'border-slate-200'  },
  translations: { label: 'Traducciones',  Icon: Globe2,    color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200'  },
}

const severityMeta: Record<Severity, { label: string; Icon: React.ElementType; color: string; bg: string; border: string; dot: string }> = {
  good:     { label: 'Correcto',  Icon: CheckCircle2,  color: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', dot: 'bg-green-500'  },
  warning:  { label: 'Mejorable',Icon: AlertTriangle,  color: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200', dot: 'bg-amber-500'  },
  error:    { label: 'Error',     Icon: XCircle,       color: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',   dot: 'bg-red-500'    },
  critical: { label: 'Crítico',  Icon: AlertCircle,   color: 'text-red-900',   bg: 'bg-red-100',   border: 'border-red-400',   dot: 'bg-red-700'    },
}

const severityOrder: Severity[] = ['critical', 'error', 'warning', 'good']

function categoryScore(items: any[], cat: Category) {
  const catItems = items.filter(i => i.category === cat)
  if (!catItems.length) return null
  const scored = catItems.filter(i => typeof i.score === 'number')
  if (!scored.length) return null
  return Math.round(scored.reduce((s: number, i: any) => s + i.score, 0) / scored.length)
}

function scoreColor(score: number) {
  if (score >= 75) return 'text-green-700'
  if (score >= 50) return 'text-amber-700'
  return 'text-red-700'
}

function scoreBarColor(score: number) {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-amber-400'
  return 'bg-red-500'
}

export default async function WebsitePage() {
  const [itemsRaw, hotelRaw] = await Promise.all([getWebAnalysis(), getHotel()])
  const items = itemsRaw as any[]
  const hotel = hotelRaw as any

  const categories = Object.keys(categoryMeta) as Category[]

  const criticalCount = items.filter(i => i.severity === 'critical').length
  const errorCount    = items.filter(i => i.severity === 'error').length
  const warningCount  = items.filter(i => i.severity === 'warning').length
  const goodCount     = items.filter(i => i.severity === 'good').length

  // Overall score: average of all scored items
  const allScored = items.filter(i => typeof i.score === 'number' && i.severity !== 'good')
  const globalScore = allScored.length
    ? Math.round(allScored.reduce((s: number, i: any) => s + i.score, 0) / allScored.length)
    : 0

  // Group issues by category then severity, skip 'good' in the detail list (show them separately)
  const issuesByCat = (cat: Category) =>
    items
      .filter(i => i.category === cat)
      .sort((a: any, b: any) => {
        const ao = severityOrder.indexOf(a.severity)
        const bo = severityOrder.indexOf(b.severity)
        return ao - bo
      })

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Análisis web</h1>
        <p className="text-slate-500 mt-1">
          {items.length} puntos analizados en {hotel?.website_url ?? 'la web del hotel'}
        </p>
      </div>

      {/* Global summary row */}
      <div className="grid grid-cols-5 gap-4 mb-8">
        {/* Overall score */}
        <div className="col-span-1 bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Score global</p>
          <div className={`text-4xl font-black ${scoreColor(globalScore)}`}>{globalScore}</div>
          <p className="text-xs text-slate-400 mt-1">/100</p>
        </div>
        {/* Severity summary */}
        <div className="col-span-4 grid grid-cols-4 gap-3">
          {([
            { key: 'critical', count: criticalCount, label: 'Críticos',  Icon: AlertCircle,  bg: 'bg-red-100  border-red-300',   text: 'text-red-800'  },
            { key: 'error',    count: errorCount,    label: 'Errores',   Icon: XCircle,      bg: 'bg-red-50   border-red-200',   text: 'text-red-700'  },
            { key: 'warning',  count: warningCount,  label: 'Mejorables',Icon: AlertTriangle,bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700'},
            { key: 'good',     count: goodCount,     label: 'Correctos', Icon: CheckCircle2, bg: 'bg-green-50 border-green-200', text: 'text-green-700'},
          ] as const).map(({ key, count, label, Icon, bg, text }) => (
            <div key={key} className={`rounded-xl border p-4 ${bg}`}>
              <div className="flex items-center gap-1.5 mb-2">
                <Icon size={14} className={text} />
                <span className={`text-xs font-semibold ${text}`}>{label}</span>
              </div>
              <div className={`text-3xl font-bold ${text}`}>{count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category scores */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {categories.map(cat => {
          const meta = categoryMeta[cat]
          const score = categoryScore(items, cat)
          const Icon = meta.Icon
          const catIssues = items.filter(i => i.category === cat && i.severity !== 'good')
          return (
            <div key={cat} className={`rounded-xl border p-4 ${meta.bg} ${meta.border}`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon size={14} className={meta.color} />
                <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
              </div>
              {score !== null ? (
                <>
                  <div className={`text-2xl font-bold mb-2 ${scoreColor(score)}`}>{score}<span className="text-sm font-normal text-slate-400">/100</span></div>
                  <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${scoreBarColor(score)}`} style={{ width: `${score}%` }} />
                  </div>
                </>
              ) : (
                <div className="text-xl font-bold text-slate-400">—</div>
              )}
              <p className="text-xs text-slate-500 mt-2">{catIssues.length} issue{catIssues.length !== 1 ? 's' : ''}</p>
            </div>
          )
        })}
      </div>

      {/* Issues by category */}
      <div className="space-y-8">
        {categories.map(cat => {
          const meta = categoryMeta[cat]
          const catItems = issuesByCat(cat)
          const Icon = meta.Icon
          if (!catItems.length) return null
          return (
            <section key={cat}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${meta.bg} border ${meta.border}`}>
                  <Icon size={14} className={meta.color} />
                </div>
                <h2 className="text-base font-semibold text-slate-900">{meta.label}</h2>
                <span className="text-xs text-slate-400">{catItems.length} elementos</span>
              </div>
              <div className="space-y-3">
                {catItems.map((item: any) => {
                  const sev = severityMeta[item.severity as Severity] ?? severityMeta.warning
                  const SevIcon = sev.Icon
                  return (
                    <div key={item.Id} className={`bg-white rounded-xl border p-5 ${item.severity === 'critical' ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${sev.bg} border ${sev.border}`}>
                          <SevIcon size={15} className={sev.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sev.bg} ${sev.color} border ${sev.border}`}>
                              {sev.label}
                            </span>
                            <span className="text-xs text-slate-400 font-mono">{item.element}</span>
                            {typeof item.score === 'number' && item.severity !== 'good' && (
                              <span className={`ml-auto text-xs font-bold ${scoreColor(item.score)}`}>{item.score}/100</span>
                            )}
                          </div>
                          <h3 className="text-sm font-semibold text-slate-900 mb-1">{item.title}</h3>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3">{item.description}</p>

                          {(item.current_value || item.suggested_value) && (
                            <div className="grid grid-cols-2 gap-3 mb-3">
                              {item.current_value && (
                                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                                  <p className="text-xs font-semibold text-red-700 mb-1">Actual</p>
                                  <p className="text-xs text-red-800 font-mono leading-relaxed">{item.current_value}</p>
                                </div>
                              )}
                              {item.suggested_value && (
                                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                                  <p className="text-xs font-semibold text-green-700 mb-1">Sugerido</p>
                                  <p className="text-xs text-green-800 font-mono leading-relaxed">{item.suggested_value}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {item.recommendation && item.severity !== 'good' && (
                            <div className="flex items-start gap-2 bg-brand-50 rounded-lg p-3 border border-brand-100">
                              <ChevronRight size={12} className="text-brand-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-brand-800 leading-relaxed">{item.recommendation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      {/* Footer notice */}
      <div className="mt-8 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          El análisis web es generado automáticamente por IA en cada ciclo de auditoría. Los scores se calculan sobre
          criterios de SEO técnico, calidad de copy, usabilidad mobile y estándares de conversión para hoteles independientes.
        </p>
      </div>
    </div>
  )
}
