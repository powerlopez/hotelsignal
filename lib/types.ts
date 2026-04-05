export type ImpactLevel = 'high' | 'medium' | 'low'
export type Category = 'offers' | 'reviews' | 'web' | 'experience' | 'copy'
export type RecommendationStatus = 'pending' | 'in_progress' | 'done' | 'dismissed'

export interface Hotel {
  id: string
  name: string
  city: string
  province: string
  country: string
  stars: number
  segment: string
  category: string
  website_url: string
  offers_page_url: string
  opportunity_score: number
  score_breakdown: {
    commercial_coherence: number
    review_utilization: number
    offer_quality: number
  }
  // Economic context for impact calculation
  adr_eur: number
  avg_stay_nights: number
  ota_commission_pct: number
}

export interface Review {
  id: string
  platform: 'google' | 'booking' | 'tripadvisor'
  author: string
  rating: number // 1-10 normalized
  date: string
  text: string
}

export interface Finding {
  id: string
  category: Category
  title: string
  description: string
  evidence: string
  impact_level: ImpactLevel
  impact_rationale: string
  created_at: string
  cycle_id: string
}

export interface Recommendation {
  id: string
  finding_id: string
  title: string
  action_detail: string
  priority: number // 1-5, 5=highest
  estimated_impact: string
  estimated_bookings_min: number
  estimated_bookings_max: number
  category: Category
  status: RecommendationStatus
  notes?: string
  updated_at: string
}

export interface AnalysisCycle {
  id: string
  triggered_at: string
  status: 'completed' | 'running' | 'failed'
  findings_count: number
  recommendations_count: number
  days_ago: number
}
