import { Sidebar } from '@/components/sidebar'
import { RecommendationsProvider } from '@/lib/recommendations-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RecommendationsProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 ml-64 min-h-screen overflow-auto">
          {children}
        </main>
      </div>
    </RecommendationsProvider>
  )
}
