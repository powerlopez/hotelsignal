import { getSocialPosts } from '@/lib/nocodb'
import { Heart, MessageCircle, Share2, Eye, TrendingUp } from 'lucide-react'

const platformMeta: Record<string, { label: string; color: string; bg: string; border: string; emoji: string }> = {
  instagram: { label: 'Instagram', color: 'text-pink-700',   bg: 'bg-pink-50',   border: 'border-pink-200',   emoji: '📸' },
  facebook:  { label: 'Facebook',  color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200',   emoji: '👥' },
  tiktok:    { label: 'TikTok',    color: 'text-slate-700',  bg: 'bg-slate-50',  border: 'border-slate-200',  emoji: '🎵' },
  twitter:   { label: 'Twitter/X', color: 'text-sky-700',    bg: 'bg-sky-50',    border: 'border-sky-200',    emoji: '𝕏'  },
  linkedin:  { label: 'LinkedIn',  color: 'text-blue-800',   bg: 'bg-blue-50',   border: 'border-blue-300',   emoji: '💼' },
}

const mediaTypeMeta: Record<string, { label: string; color: string }> = {
  photo:    { label: 'Foto',      color: 'bg-violet-100 text-violet-700' },
  video:    { label: 'Vídeo',     color: 'bg-red-100 text-red-700'      },
  reel:     { label: 'Reel',      color: 'bg-pink-100 text-pink-700'    },
  story:    { label: 'Story',     color: 'bg-amber-100 text-amber-700'  },
  carousel: { label: 'Carrusel',  color: 'bg-sky-100 text-sky-700'     },
}

export default async function SocialPage() {
  const postsRaw = await getSocialPosts()
  const posts = postsRaw as any[]

  const activePlatforms = [...new Set(posts.map(p => p.platform))]

  const platformStats = activePlatforms.map(platform => {
    const pp = posts.filter(p => p.platform === platform)
    const totalLikes    = pp.reduce((s, p) => s + (p.engagement_likes    ?? 0), 0)
    const totalComments = pp.reduce((s, p) => s + (p.engagement_comments ?? 0), 0)
    const totalShares   = pp.reduce((s, p) => s + (p.engagement_shares   ?? 0), 0)
    const totalReach    = pp.reduce((s, p) => s + (p.reach               ?? 0), 0)
    const avgEng = pp.length
      ? Math.round((totalLikes + totalComments + totalShares) / pp.length)
      : 0
    return { platform, count: pp.length, totalLikes, totalComments, totalShares, totalReach, avgEng }
  })

  const totalPosts = posts.length
  const totalEngagement = posts.reduce((s, p) => s + (p.engagement_likes ?? 0) + (p.engagement_comments ?? 0) + (p.engagement_shares ?? 0), 0)
  const totalReach = posts.reduce((s, p) => s + (p.reach ?? 0), 0)
  const bestPost = [...posts].sort((a, b) =>
    ((b.engagement_likes ?? 0) + (b.engagement_comments ?? 0) + (b.engagement_shares ?? 0)) -
    ((a.engagement_likes ?? 0) + (a.engagement_comments ?? 0) + (a.engagement_shares ?? 0))
  )[0]

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Social Media</h1>
        <p className="text-slate-500 mt-1">{totalPosts} posts analizados en {activePlatforms.length} plataformas</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Posts totales</p>
          <div className="text-3xl font-bold text-slate-900">{totalPosts}</div>
        </div>
        <div className="bg-pink-50 border border-pink-200 rounded-xl p-5">
          <p className="text-xs font-medium text-pink-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Heart size={13} />Engagement total</p>
          <div className="text-3xl font-bold text-pink-800">{totalEngagement.toLocaleString('es-ES')}</div>
          <div className="text-xs text-pink-600 mt-1">likes + comentarios + shares</div>
        </div>
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-5">
          <p className="text-xs font-medium text-sky-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><Eye size={13} />Alcance total</p>
          <div className="text-3xl font-bold text-sky-800">{totalReach.toLocaleString('es-ES')}</div>
          <div className="text-xs text-sky-600 mt-1">impresiones estimadas</div>
        </div>
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5">
          <p className="text-xs font-medium text-brand-700 uppercase tracking-wider mb-3 flex items-center gap-1.5"><TrendingUp size={13} />Eng. medio/post</p>
          <div className="text-3xl font-bold text-brand-800">
            {totalPosts > 0 ? Math.round(totalEngagement / totalPosts) : 0}
          </div>
        </div>
      </div>

      {/* Platform breakdown */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {platformStats.map(({ platform, count, totalLikes, totalComments, totalShares, totalReach, avgEng }) => {
          const meta = platformMeta[platform] ?? platformMeta.instagram
          return (
            <div key={platform} className={`rounded-2xl border p-6 ${meta.bg} ${meta.border}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl">{meta.emoji}</div>
                <div>
                  <h3 className={`text-base font-bold ${meta.color}`}>{meta.label}</h3>
                  <p className="text-xs text-slate-500">{count} posts analizados</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><Heart size={12} className="text-pink-500" /><span className="text-xs text-slate-500">Likes</span></div>
                  <div className="text-lg font-bold text-slate-800">{totalLikes.toLocaleString('es-ES')}</div>
                </div>
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><MessageCircle size={12} className="text-blue-500" /><span className="text-xs text-slate-500">Comentarios</span></div>
                  <div className="text-lg font-bold text-slate-800">{totalComments.toLocaleString('es-ES')}</div>
                </div>
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><Share2 size={12} className="text-green-500" /><span className="text-xs text-slate-500">Compartidos</span></div>
                  <div className="text-lg font-bold text-slate-800">{totalShares.toLocaleString('es-ES')}</div>
                </div>
                <div className="bg-white/70 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1"><Eye size={12} className="text-slate-500" /><span className="text-xs text-slate-500">Alcance</span></div>
                  <div className="text-lg font-bold text-slate-800">{totalReach.toLocaleString('es-ES')}</div>
                </div>
              </div>
              <div className="mt-3 bg-white/50 rounded-lg p-2.5">
                <p className="text-xs font-semibold text-slate-700">Engagement medio: {avgEng} por post</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Posts list */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 mb-4">Publicaciones recientes</h2>
        <div className="space-y-3">
          {posts.map((post: any) => {
            const meta = platformMeta[post.platform] ?? platformMeta.instagram
            const mt = mediaTypeMeta[post.media_type] ?? mediaTypeMeta.photo
            const eng = (post.engagement_likes ?? 0) + (post.engagement_comments ?? 0) + (post.engagement_shares ?? 0)
            const isBest = bestPost?.Id === post.Id
            return (
              <div key={post.Id} className={`bg-white rounded-xl border p-5 ${isBest ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}>
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 ${meta.bg}`}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`text-xs font-semibold ${meta.color}`}>{meta.label}</span>
                      <span className="text-xs text-slate-400">{post.post_date}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${mt.color}`}>{mt.label}</span>
                      {isBest && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">⭐ Mejor post</span>}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed line-clamp-3 mb-3">{post.content}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 flex-wrap">
                      <span className="flex items-center gap-1"><Heart size={12} className="text-pink-400" />{post.engagement_likes ?? 0}</span>
                      <span className="flex items-center gap-1"><MessageCircle size={12} className="text-blue-400" />{post.engagement_comments ?? 0}</span>
                      <span className="flex items-center gap-1"><Share2 size={12} className="text-green-400" />{post.engagement_shares ?? 0}</span>
                      {post.reach && <span className="flex items-center gap-1"><Eye size={12} className="text-slate-400" />{post.reach.toLocaleString('es-ES')}</span>}
                      <span className="ml-auto font-semibold text-slate-700">Total eng: {eng}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
