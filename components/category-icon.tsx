import { Tag, Star, Globe, Compass, PenLine } from 'lucide-react'
import type { Category } from '@/lib/types'

const map: Record<Category, { Icon: React.ElementType; label: string; color: string; bg: string }> = {
  offers: { Icon: Tag, label: 'Ofertas', color: 'text-violet-600', bg: 'bg-violet-50' },
  reviews: { Icon: Star, label: 'Reseñas', color: 'text-amber-600', bg: 'bg-amber-50' },
  web: { Icon: Globe, label: 'Web', color: 'text-sky-600', bg: 'bg-sky-50' },
  experience: { Icon: Compass, label: 'Experiencia', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  copy: { Icon: PenLine, label: 'Copy', color: 'text-rose-600', bg: 'bg-rose-50' },
}

interface Props {
  category: Category
  size?: number
  showLabel?: boolean
}

export function CategoryIcon({ category, size = 16, showLabel = false }: Props) {
  const { Icon, label, color, bg } = map[category]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${color} ${bg}`}>
      <Icon size={size - 2} />
      {showLabel && label}
    </span>
  )
}

export function categoryLabel(category: Category): string {
  return map[category].label
}
