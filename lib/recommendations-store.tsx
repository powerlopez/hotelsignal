'use client'

/**
 * Client-side store for recommendation status and notes.
 * Initializes from hardcoded data and persists changes to localStorage.
 * When connecting to NocoDB: replace localStorage reads/writes with API calls.
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import { recommendations as defaultRecommendations } from '@/data/hotel-data'
import type { Recommendation, RecommendationStatus } from '@/lib/types'

const STORAGE_KEY = 'hs_recommendations_v1'

interface StoreState {
  recommendations: Recommendation[]
  updateStatus: (id: string, status: RecommendationStatus) => void
  updateNotes: (id: string, notes: string) => void
  getById: (id: string) => Recommendation | undefined
}

const StoreContext = createContext<StoreState | null>(null)

export function RecommendationsProvider({ children }: { children: React.ReactNode }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(defaultRecommendations)

  // Load overrides from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const overrides: Record<string, Partial<Recommendation>> = JSON.parse(saved)
        setRecommendations(prev =>
          prev.map(r => ({ ...r, ...(overrides[r.id] ?? {}) }))
        )
      }
    } catch {
      // ignore parse errors
    }
  }, [])

  const persist = (updated: Recommendation[]) => {
    const overrides: Record<string, Partial<Recommendation>> = {}
    updated.forEach(r => {
      const orig = defaultRecommendations.find(d => d.id === r.id)
      if (orig && (r.status !== orig.status || r.notes !== orig.notes)) {
        overrides[r.id] = { status: r.status, notes: r.notes }
      }
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides))
  }

  const updateStatus = (id: string, status: RecommendationStatus) => {
    setRecommendations(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, status, updated_at: new Date().toISOString() } : r
      )
      persist(updated)
      return updated
    })
  }

  const updateNotes = (id: string, notes: string) => {
    setRecommendations(prev => {
      const updated = prev.map(r =>
        r.id === id ? { ...r, notes, updated_at: new Date().toISOString() } : r
      )
      persist(updated)
      return updated
    })
  }

  const getById = (id: string) => recommendations.find(r => r.id === id)

  return (
    <StoreContext.Provider value={{ recommendations, updateStatus, updateNotes, getById }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useRecommendations() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useRecommendations must be used inside RecommendationsProvider')
  return ctx
}
