import { notFound } from 'next/navigation'
import { getFindings, getRecommendations } from '@/lib/nocodb'
import { FindingDetailClient } from './client'

export default async function FindingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [findingsRaw, recsRaw] = await Promise.all([getFindings(), getRecommendations()])
  const findings = findingsRaw as any[]
  const recs = recsRaw as any[]

  const finding = findings.find(f => String(f.Id) === id)
  if (!finding) notFound()

  const rec = recs.find(r => r.finding_ref === finding.finding_ref)

  return <FindingDetailClient finding={finding} recommendation={rec} />
}
