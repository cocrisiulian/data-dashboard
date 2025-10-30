import { getDashboard } from "@/lib/actions/dashboards"
import { getFiles } from "@/lib/actions/files"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ChartGrid } from "@/components/charts/chart-grid"
import { AddChartDialog } from "@/components/dashboard/add-chart-dialog"
import { Button } from "@/components/ui/controls/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function DashboardDetailPage({ params }: { params: { id: string } }) {
  const [dashboard, files] = await Promise.all([getDashboard(params.id), getFiles()])

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboards
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold mb-2">{dashboard.name}</h1>
              {dashboard.description && <p className="text-muted-foreground">{dashboard.description}</p>}
            </div>
            <AddChartDialog dashboardId={dashboard.id} files={files} />
          </div>

          <ChartGrid charts={dashboard.charts} />
        </div>
      </main>
    </div>
  )
}
