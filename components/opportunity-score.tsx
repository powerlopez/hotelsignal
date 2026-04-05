'use client'

interface ScoreGaugeProps {
  score: number
  size?: number
}

function getScoreColor(score: number): string {
  if (score < 40) return '#ef4444' // red-500
  if (score < 65) return '#f59e0b' // amber-500
  if (score < 80) return '#0d9488' // teal-600
  return '#16a34a' // green-600
}

function getScoreLabel(score: number): string {
  if (score < 40) return 'Crítico'
  if (score < 55) return 'Bajo'
  if (score < 70) return 'Moderado'
  if (score < 85) return 'Bueno'
  return 'Excelente'
}

export function OpportunityScore({ score, size = 160 }: ScoreGaugeProps) {
  const radius = size * 0.36
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (circumference * score) / 100
  const color = getScoreColor(score)
  const label = getScoreLabel(score)

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={size * 0.075}
        />
        {/* Score arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={size * 0.075}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          className="score-circle"
          style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
        />
        {/* Score number */}
        <text
          x={cx}
          y={cy - size * 0.04}
          textAnchor="middle"
          fontSize={size * 0.22}
          fontWeight="700"
          fill="#0f172a"
          fontFamily="Inter, system-ui, sans-serif"
        >
          {score}
        </text>
        {/* /100 */}
        <text
          x={cx}
          y={cy + size * 0.1}
          textAnchor="middle"
          fontSize={size * 0.09}
          fill="#94a3b8"
          fontFamily="Inter, system-ui, sans-serif"
        >
          / 100
        </text>
      </svg>
      <span
        className="text-sm font-semibold px-3 py-1 rounded-full"
        style={{ color, backgroundColor: color + '18' }}
      >
        {label}
      </span>
    </div>
  )
}

interface ScoreBreakdownProps {
  breakdown: {
    commercial_coherence: number
    review_utilization: number
    offer_quality: number
  }
}

export function ScoreBreakdown({ breakdown }: ScoreBreakdownProps) {
  const items = [
    { label: 'Coherencia comercial', value: breakdown.commercial_coherence, desc: 'Alineación entre oferta, web y propuesta de valor' },
    { label: 'Aprovechamiento de reseñas', value: breakdown.review_utilization, desc: 'Uso de insights de reseñas en la estrategia comercial' },
    { label: 'Calidad de oferta', value: breakdown.offer_quality, desc: 'Completitud y atractivo de la página de ofertas' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {items.map(item => (
        <div key={item.label}>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${item.value}%`,
                backgroundColor: getScoreColor(item.value),
              }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
        </div>
      ))}
    </div>
  )
}
