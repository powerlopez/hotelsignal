import { Sidebar } from '@/components/sidebar'
import { getHotel, getLatestCycle } from '@/lib/nocodb'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [hotelRaw, cycleRaw] = await Promise.all([getHotel(), getLatestCycle()])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hotel = hotelRaw as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cycle = cycleRaw as any

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        hotel={{
          name: hotel?.name ?? 'Hotel',
          city: hotel?.city ?? '',
          province: hotel?.province ?? '',
          stars: hotel?.stars ?? 4,
          website_url: hotel?.website_url ?? '#',
        }}
        lastCycle={cycle ? { findings_count: cycle.findings_count, triggered_at: cycle.triggered_at } : undefined}
      />
      <main className="flex-1 ml-64 min-h-screen overflow-auto">{children}</main>
    </div>
  )
}
