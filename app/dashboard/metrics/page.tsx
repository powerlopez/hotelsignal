import { getMetrics, getHotel } from '@/lib/nocodb'
import { TrendingUp, TrendingDown, Minus, DollarSign, Users, BarChart3, AlertCircle } from 'lucide-react'

export default async function MetricsPage() {
  const [metricsRaw, hotelRaw] = await Promise.all([getMetrics(), getHotel()])
  const metrics = metricsRaw as any[]
  const hotel   = hotelRaw as any

  const byType = (type: string) => metrics.filter(m => m.metric_type === type)

  const occupancy     = byType('occupancy').sort((a, b) => a.period_from > b.period_from ? 1 : -1)
  const directBookings = byType('direct_bookings').sort((a, b) => a.period_from > b.period_from ? 1 : -1)
  const otaBookings   = byType('ota_bookings').sort((a, b) => a.period_from > b.period_from ? 1 : -1)
  const adrMetrics    = byType('adr').sort((a, b) => a.period_from > b.period_from ? 1 : -1)

  const latestOcc  = occupancy[occupancy.length - 1]?.value ?? 0
  const prevOcc    = occupancy[occupancy.length - 2]?.value ?? 0
  const latestADR  = adrMetrics[adrMetrics.length - 1]?.value ?? hotel?.adr_eur ?? 95
  const prevADR    = adrMetrics[adrMetrics.length - 2]?.value ?? 0

  // Direct vs OTA ratio (latest month)
  const latestDirect = directBookings[directBookings.length - 1]?.value ?? 0
  const latestOTA    = otaBookings[otaBookings.length - 1]?.value ?? 0
  const totalB       = latestDirect + latestOTA
  const directPct    = totalB > 0 ? Math.round((latestDirect / totalB) * 100) : 0
  const otaPct       = totalB > 0 ? 100 - directPct : 0

  // Commission cost
  const otaCommissionPct = hotel?.ota_commission_pct ?? 18
  const avgBookingValue  = (hotel?.adr_eur ?? 95) * (hotel?.avg_stay_nights ?? 5)
  const monthlyCommCost  = Math.round(latestOTA * avgBookingValue * (otaCommissionPct / 100))

  const trend = (current: number, prev: number) => {
    if (!prev) return null
    const diff = current - prev
    const pct = Math.round((diff / prev) * 100)
    return { diff, pct }
  }

  const occTrend = trend(latestOcc, prevOcc)
  const adrTrend = trend(latestADR, prevADR)

  const maxOcc = Math.max(...occupancy.map(o => o.value ?? 0), 1)

  const monthLabel = (period: string) => {
    if (!period) return '—'
    const d = new Date(period)
    return d.toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Métricas del hotel</h1>
        <p className="text-slate-500 mt-1">Datos compartidos por el hotel · Fuente: introducción manual</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KpiCard
          label="Ocupación actual"
          value={`${latestOcc}%`}
          trend={occTrend}
          unit="vs mes anterior"
          icon={<Users size={18} className="text-brand-500" />}
          highlight="brand"
        />
        <KpiCard
          label="ADR actual"
          value={`€${latestADR}`}
          trend={adrTrend}
          unit="precio medio/noche"
          icon={<DollarSign size={18} className="text-green-500" />}
          highlight="green"
        />
        <KpiCard
          label="Reservas directas"
          value={`${directPct}%`}
          sub={`${latestDirect} reservas este mes`}
          icon={<TrendingUp size={18} className="text-blue-500" />}
          highlight="blue"
        />
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Coste OTA/mes</span>
            <AlertCircle size={18} className="text-red-400" />
          </div>
          <div className="text-2xl font-bold text-red-800">€{monthlyCommCost.toLocaleString('es-ES')}</div>
          <div className="text-xs text-red-600 mt-1">
            {latestOTA} res. × €{avgBookingValue} × {otaCommissionPct}%
          </div>
          <div className="text-xs text-red-500 mt-2 font-medium">dinero pagado en comisiones</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Occupancy chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 size={16} className="text-brand-600" />
            <h2 className="text-sm font-semibold text-slate-900">Ocupación — últimos 6 meses</h2>
          </div>
          {occupancy.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="space-y-3">
              {occupancy.map((m: any) => (
                <div key={m.Id} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-12 flex-shrink-0">{monthLabel(m.period_from)}</span>
                  <div className="flex-1 h-6 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-2 transition-all"
                      style={{
                        width: `${(m.value / maxOcc) * 100}%`,
                        backgroundColor: m.value >= 70 ? '#0d9488' : m.value >= 50 ? '#f59e0b' : '#94a3b8',
                      }}
                    >
                      <span className="text-xs font-bold text-white">{m.value}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Direct vs OTA */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={16} className="text-blue-600" />
            <h2 className="text-sm font-semibold text-slate-900">Directo vs OTA — últimos 3 meses</h2>
          </div>
          {directBookings.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Sin datos</p>
          ) : (
            <div className="space-y-4">
              {directBookings.slice(-3).map((dm: any, idx: number) => {
                const om = otaBookings.slice(-3)[idx]
                const d = dm?.value ?? 0
                const o = om?.value ?? 0
                const total = d + o
                const dPct = total > 0 ? Math.round((d / total) * 100) : 0
                return (
                  <div key={dm.Id}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                      <span>{monthLabel(dm.period_from)}</span>
                      <span>{d} directas · {o} OTA · <strong>{dPct}% directo</strong></span>
                    </div>
                    <div className="h-5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-brand-500 flex items-center justify-center" style={{ width: `${dPct}%` }}>
                        {dPct > 15 && <span className="text-xs font-bold text-white">{dPct}%</span>}
                      </div>
                      <div className="h-full bg-orange-400 flex items-center justify-center flex-1">
                        <span className="text-xs font-bold text-white">{100 - dPct}%</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-1 text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-brand-500" />Directa</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-orange-400" />OTA (comisión {otaCommissionPct}%)</span>
                    </div>
                  </div>
                )
              })}
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 mt-2">
                <p className="text-xs font-semibold text-orange-800">
                  💡 Por cada 1% más de reservas directas = ~€{Math.round((totalB * 0.01) * avgBookingValue * (otaCommissionPct / 100))} menos en comisiones/mes
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ADR trend */}
      {adrMetrics.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center gap-2 mb-5">
            <DollarSign size={16} className="text-green-600" />
            <h2 className="text-sm font-semibold text-slate-900">ADR (precio medio/noche) — últimos 3 meses</h2>
          </div>
          <div className="flex items-end gap-6">
            {adrMetrics.slice(-3).map((m: any) => (
              <div key={m.Id} className="flex flex-col items-center gap-2">
                <span className="text-lg font-bold text-slate-900">€{m.value}</span>
                <div
                  className="w-16 bg-green-400 rounded-t-lg"
                  style={{ height: `${Math.max((m.value / 120) * 80, 16)}px` }}
                />
                <span className="text-xs text-slate-500">{monthLabel(m.period_from)}</span>
              </div>
            ))}
            <div className="ml-4 text-xs text-slate-500">
              <p>Ticket medio reserva:</p>
              <p className="font-semibold text-slate-700">€{avgBookingValue}</p>
              <p className="mt-1">({hotel?.avg_stay_nights ?? 5} noches × ADR)</p>
            </div>
          </div>
        </div>
      )}

      {/* Data notice */}
      <div className="mt-6 bg-slate-50 rounded-xl border border-slate-200 p-4 flex items-start gap-3">
        <AlertCircle size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-500 leading-relaxed">
          Los datos de métricas son introducidos manualmente por el hotel. Para integración directa con PMS o Channel Manager,
          contacta con EstudioTech para activar la conexión automática.
        </p>
      </div>
    </div>
  )
}

function KpiCard({ label, value, trend, sub, unit, icon, highlight }: {
  label: string; value: string; trend?: { diff: number; pct: number } | null
  sub?: string; unit?: string; icon: React.ReactNode
  highlight: 'brand' | 'green' | 'blue'
}) {
  const colors = {
    brand: 'bg-brand-50 border-brand-200',
    green: 'bg-green-50 border-green-200',
    blue:  'bg-blue-50 border-blue-200',
  }
  return (
    <div className={`rounded-xl border p-5 ${colors[highlight]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${trend.diff > 0 ? 'text-green-600' : trend.diff < 0 ? 'text-red-600' : 'text-slate-500'}`}>
          {trend.diff > 0 ? <TrendingUp size={12} /> : trend.diff < 0 ? <TrendingDown size={12} /> : <Minus size={12} />}
          {trend.diff > 0 ? '+' : ''}{trend.pct}% {unit}
        </div>
      )}
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  )
}
