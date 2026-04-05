import Link from 'next/link'
import { getOffers } from '@/lib/nocodb'
import { CheckCircle2, Lightbulb, AlertTriangle, Tag, ExternalLink, ArrowRight } from 'lucide-react'

export default async function OffersPage() {
  const offersRaw = await getOffers()
  const offers = offersRaw as any[]

  const current  = offers.filter(o => o.offer_type === 'current')
  const proposed = offers.filter(o => o.offer_type === 'proposed')
  const missing  = offers.filter(o => o.offer_type === 'missing')

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Ofertas y propuestas comerciales</h1>
        <p className="text-slate-500 mt-1">
          {current.length} actuales · {proposed.length} propuestas por IA · {missing.length} faltantes detectadas
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 size={16} className="text-slate-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actuales en web</span>
          </div>
          <div className="text-3xl font-bold text-slate-900">{current.length}</div>
          <p className="text-xs text-slate-500 mt-1">ofertas activas detectadas</p>
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb size={16} className="text-brand-600" />
            <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">Propuestas por IA</span>
          </div>
          <div className="text-3xl font-bold text-brand-800">{proposed.length}</div>
          <p className="text-xs text-brand-600 mt-1">oportunidades a activar</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-600" />
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Faltantes</span>
          </div>
          <div className="text-3xl font-bold text-amber-800">{missing.length}</div>
          <p className="text-xs text-amber-600 mt-1">no existen ni en web ni en OTAs</p>
        </div>
      </div>

      {/* Current offers */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-slate-100 rounded-md flex items-center justify-center">
            <CheckCircle2 size={14} className="text-slate-500" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Lo que tienes ahora</h2>
          <span className="text-xs text-slate-400 ml-1">— extraído de tu web</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {current.map((offer: any) => (
            <div key={offer.Id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Tag size={14} className="text-slate-400 flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-slate-900">{offer.title}</h3>
                </div>
                {offer.price_eur && (
                  <span className="text-sm font-bold text-slate-700 flex-shrink-0">desde €{offer.price_eur}/noche</span>
                )}
              </div>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">{offer.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-wrap">
                  {offer.valid_until && (
                    <span className="text-xs text-slate-400">Válida hasta {offer.valid_until}</span>
                  )}
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                    {offer.status === 'active' ? 'Activa' : offer.status}
                  </span>
                </div>
                {!offer.direct_booking_benefit && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                    ⚠ Sin ventaja directa
                  </span>
                )}
                {offer.url && (
                  <a href={offer.url} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1">
                    Ver <ExternalLink size={10} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proposed offers */}
      <section className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-brand-100 rounded-md flex items-center justify-center">
            <Lightbulb size={14} className="text-brand-600" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">Lo que proponemos activar</h2>
          <span className="text-xs text-slate-400 ml-1">— generado por IA basado en tus reseñas y hallazgos</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {proposed.map((offer: any) => (
            <div key={offer.Id} className="bg-gradient-to-br from-brand-50 to-white rounded-xl border border-brand-200 p-5 relative">
              <div className="absolute top-3 right-3">
                <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-semibold">IA propuesta</span>
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-2 pr-20">{offer.title}</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">{offer.description}</p>
              {offer.direct_booking_benefit && (
                <div className="bg-brand-100 rounded-lg p-2.5 mb-3">
                  <p className="text-xs font-semibold text-brand-800">
                    ✓ Ventaja exclusiva web: {offer.direct_booking_benefit}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                {offer.price_eur && (
                  <span className="text-xs text-slate-500">Precio sugerido: desde €{offer.price_eur}/noche</span>
                )}
                {offer.finding_ref && (
                  <span className="text-xs text-brand-600 flex items-center gap-1">
                    Basada en hallazgo #{offer.finding_ref.replace('f-', '')}
                    <ArrowRight size={10} />
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Missing offers */}
      {missing.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 bg-amber-100 rounded-md flex items-center justify-center">
              <AlertTriangle size={14} className="text-amber-600" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Lo que falta y debería existir</h2>
            <span className="text-xs text-slate-400 ml-1">— detectado en análisis, no existe en ningún canal</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {missing.map((offer: any) => (
              <div key={offer.Id} className="bg-amber-50 rounded-xl border border-amber-200 border-dashed p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-semibold">No existe aún</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900 mb-2">{offer.title}</h3>
                <p className="text-xs text-slate-600 mb-3 leading-relaxed">{offer.description}</p>
                {offer.direct_booking_benefit && (
                  <p className="text-xs text-amber-700">
                    💡 Ventaja potencial: {offer.direct_booking_benefit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
