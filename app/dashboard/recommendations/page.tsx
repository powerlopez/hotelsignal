import { getFindings, getRecommendations } from '@/lib/nocodb'
import { RecommendationsClient } from './client'

export default async function RecommendationsPage() {
  const [findingsRaw, recsRaw] = await Promise.all([getFindings(), getRecommendations()])
  return <RecommendationsClient findings={findingsRaw as any[]} recommendations={recsRaw as any[]} />
}
