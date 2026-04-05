import { getReviews } from '@/lib/nocodb'
import { Star, TrendingUp, MessageSquare, ThumbsUp } from 'lucide-react'

const platformMeta: Record<string, { label: string; color: string; bg: string; emoji: string }> = {
  google:      { label: 'Google',      color: 'text-blue-700',   bg: 'bg-blue-50',   emoji: '🔵' },
  booking:     { label: 'Booking',     color: 'text-blue-600',   bg: 'bg-sky-50',    emoji: '🏨' },
  tripadvisor: { label: 'TripAdvisor', color: 'text-green-700',  bg: 'bg-green-50',  emoji: '🦉' },
  expedia:     { label: 'Expedia',     color: 'text-yellow-700', bg: 'bg-yellow-50', emoji: '✈️' },
  holidaycheck:{ label: 'HolidayCheck',color: 'text-orange-700', bg: 'bg-orange-50', emoji: '☀️' },
}

const sentimentMeta = {
  positive: { label: 'Positiva', color: 'text-green-700', bg: 'bg-green-50',  dot: 'bg-green-500' },
  neutral:  { label: 'Neutral',  color: 'text-amber-700', bg: 'bg-amber-50',  dot: 'bg-amber-500' },
  negative: { label: 'Negativa', color: 'text-red-700',   bg: 'bg-red-50',    dot: 'bg-red-500'   },
}

export default async function ReviewsPage() {
  const reviewsRaw = await getReviews()
  const reviews = reviewsRaw as any[]

  // Stats
  const avgRating = reviews.length
    ? Math.round((reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / reviews.length) * 10) / 10
    : 0

  const positive = reviews.filter(r => r.sentiment === 'positive').length
  const neutral  = reviews.filter(r => r.sentiment === 'neutral').length
  const negative = reviews.filter(r => r.sentiment === 'negative').length

  // By platform
  const platforms = ['google', 'booking', 'tripadvisor']
  const byPlatform = platforms.map(p => {
    const pr = reviews.filter(r => r.platform === p)
    const avg = pr.length ? Math.round((pr.reduce((s, r) => s + (r.rating ?? 0), 0) / pr.length) * 10) / 10 : null
    return { platform: p, count: pr.length, avg }
  })

  // Topic frequency
  const topicCount: Record<string, number> = {}
  reviews.forEach(r => {
    if (r.topics) {
      r.topics.split(',').forEach((t: string) => {
        const k = t.trim()
        if (k) topicCount[k] = (topicCount[k] ?? 0) + 1
      })
    }
  })
  const topTopics = Object.entries(topicCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  const maxTopic = topTopics[0]?.[1] ?? 1

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Reseñas</h1>
        <p className="text-slate-500 mt-1">{reviews.length} reseñas analizadas de {platforms.filter(p => reviews.some(r => r.platform === p)).length} plataformas</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Rating medio</p>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-slate-900">{avgRating}</span>
            <span className="text-slate-400 text-sm mb-1">/10</span>
          </div>
          <div className="flex gap-0.5 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className={i < Math.round(avgRating / 2) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'} />
            ))}
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5">
          <p className="text-xs font-medium text-green-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><ThumbsUp size={13} /> Positivas</p>
          <div className="text-3xl font-bold text-green-800">{positive}</div>
          <div className="text-xs text-green-600 mt-1">{reviews.length > 0 ? Math.round(positive / reviews.length * 100) : 0}% del total</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-xs font-medium text-amber-700 uppercase tracking-wider mb-3">Neutras</p>
          <div className="text-3xl font-bold text-amber-800">{neutral}</div>
          <div className="text-xs text-amber-600 mt-1">{reviews.length > 0 ? Math.round(neutral / reviews.length * 100) : 0}% del total</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <p className="text-xs font-medium text-red-700 uppercase tracking-wider mb-3">Negativas</p>
          <div className="text-3xl font-bold text-red-800">{negative}</div>
          <div className="text-xs text-red-600 mt-1">{reviews.length > 0 ? Math.round(negative / reviews.length * 100) : 0}% del total</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* By platform */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Por plataforma</h2>
          <div className="space-y-4">
            {byPlatform.map(({ platform, count, avg }) => {
              const meta = platformMeta[platform]
              return (
                <div key={platform} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${meta.bg}`}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-slate-700">{meta.label}</span>
                      <span className="text-sm font-bold text-slate-900">{avg ?? '—'}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${avg ? (avg / 10) * 100 : 0}%` }} />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{count} reseñas</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Topic frequency */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-900 mb-4">Temas más mencionados</h2>
          <div className="space-y-2.5">
            {topTopics.map(([topic, count]) => (
              <div key={topic} className="flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600 w-24 capitalize">{topic}</span>
                <div className="flex-1 h-5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-brand-500 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${Math.max((count / maxTopic) * 100, 8)}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-700 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-4">Frecuencia de mención en las {reviews.length} reseñas analizadas</p>
        </div>
      </div>

      {/* Review list */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Últimas reseñas</h2>
        <div className="space-y-3">
          {reviews.map((review: any) => {
            const meta = platformMeta[review.platform] ?? platformMeta.google
            const sentiment = sentimentMeta[review.sentiment as keyof typeof sentimentMeta] ?? sentimentMeta.neutral
            const topics = review.topics ? review.topics.split(',').map((t: string) => t.trim()).filter(Boolean) : []
            return (
              <div key={review.Id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${meta.bg}`}>
                      {meta.emoji}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-800">{review.author}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sentiment.bg} ${sentiment.color}`}>
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${sentiment.dot} mr-1`} />
                          {sentiment.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-medium ${meta.color}`}>{meta.label}</span>
                        <span className="text-slate-300">·</span>
                        <span className="text-xs text-slate-400">{review.review_date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-lg font-bold text-slate-900">{review.rating}</span>
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                  </div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">{review.text}</p>
                {topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {topics.map((t: string) => (
                      <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
