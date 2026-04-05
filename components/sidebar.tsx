'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ListChecks, Star, Globe, BarChart3,
  Instagram, Settings, History, Zap, ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/dashboard/recommendations', label: 'Recomendaciones', Icon: ListChecks },
  { href: '/dashboard/reviews', label: 'Reseñas', Icon: Star },
  { href: '/dashboard/offers', label: 'Ofertas', Icon: Globe },
  { href: '/dashboard/social', label: 'Social Media', Icon: Instagram },
  { href: '/dashboard/metrics', label: 'Métricas', Icon: BarChart3 },
  { href: '/dashboard/history', label: 'Historial', Icon: History, disabled: true },
  { href: '/dashboard/settings', label: 'Configuración', Icon: Settings, disabled: true },
]

interface SidebarProps {
  hotel: {
    name: string
    city: string
    province: string
    stars: number
    website_url: string
  }
  lastCycle?: {
    findings_count: number
    triggered_at: string
  }
}

export function Sidebar({ hotel, lastCycle }: SidebarProps) {
  const pathname = usePathname()

  const daysAgo = lastCycle
    ? Math.floor((Date.now() - new Date(lastCycle.triggered_at).getTime()) / 86400000)
    : null

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 flex flex-col z-10">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight">HotelSignal</span>
        </div>
      </div>

      {/* Hotel info */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-sm">🏨</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{hotel.name}</p>
            <div className="flex items-center gap-0.5 mt-0.5">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <span key={i} className="text-amber-400 text-xs">★</span>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{hotel.city}, {hotel.province}</p>
          </div>
        </div>
        <a
          href={hotel.website_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center gap-1 text-xs text-brand-600 hover:text-brand-700 font-medium"
        >
          Ver web del hotel <ExternalLink size={11} />
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, Icon, exact, disabled }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href)
          if (disabled) return (
            <div key={href} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed">
              <Icon size={17} />
              <span className="text-sm font-medium">{label}</span>
              <span className="ml-auto text-xs bg-slate-100 px-1.5 py-0.5 rounded">Pronto</span>
            </div>
          )
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )}
            >
              <Icon size={17} className={isActive ? 'text-brand-600' : ''} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Cycle info */}
      <div className="px-4 py-4 border-t border-slate-100">
        {lastCycle && (
          <div className="bg-slate-50 rounded-xl p-3 mb-3">
            <p className="text-xs text-slate-500 mb-0.5">Último análisis</p>
            <p className="text-xs font-semibold text-slate-700">
              {daysAgo === 0 ? 'hoy' : `hace ${daysAgo} días`} · {lastCycle.findings_count} hallazgos
            </p>
          </div>
        )}
        <button
          className="w-full flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors"
          onClick={() => alert('En producción esto lanzará un nuevo ciclo de análisis vía n8n.')}
        >
          <Zap size={15} />
          Nuevo análisis
        </button>
      </div>

      <div className="px-5 py-3 border-t border-slate-100">
        <p className="text-xs text-slate-400">by <span className="font-semibold text-slate-500">EstudioTech</span></p>
      </div>
    </aside>
  )
}
