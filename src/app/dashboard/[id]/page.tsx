"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { ChartGrid } from "@/components/charts/chart-grid"
import { AddChartDialog } from "@/components/dashboard/add-chart-dialog"
import { Button } from "@/components/ui/controls/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/client"
import { useAuth } from "@/contexts/AuthContext"
import { showError } from "@/lib/utils/error-handler"

export default function DashboardDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [dashboard, setDashboard] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const id = params.id as string

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && id) {
      loadDashboard()
    }
  }, [user, authLoading, id, router])

  const loadDashboard = async () => {
    try {
      setIsLoading(true)
      const [dashboardData, filesData] = await Promise.all([
        api.dashboards.getOne(id),
        api.files.getAll()
      ])
      setDashboard(dashboardData)
      setFiles(filesData)
    } catch (error) {
      showError(error, "Nu am putut încărca dashboard-ul. Te rugăm să verifici dacă există.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user || !dashboard) {
    return null
  }

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
            <AddChartDialog dashboardId={dashboard.id} files={files} onChartAdded={loadDashboard} />
          </div>

          <ChartGrid charts={dashboard.charts || []} dashboardId={dashboard.id} files={files} onChartDeleted={loadDashboard} />
        </div>
      </main>
    </div>
  )
}
