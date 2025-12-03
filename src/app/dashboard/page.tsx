"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardList } from "@/components/dashboard/dashboard-list"
import { CreateDashboardDialog } from "@/components/dashboard/create-dashboard-dialog"
import { ResourceCounter } from "@/components/ui/feedback/resource-counter"
import { useAuth } from "@/contexts/AuthContext"
import { showError } from "@/lib/utils/error-handler"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/client"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboards, setDashboards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadDashboards()
    }
  }, [user, authLoading, router])

  const loadDashboards = async () => {
    try {
      setIsLoading(true)
      const data = await api.dashboards.getAll()
      setDashboards(data)
    } catch (error) {
      showError(error, "Nu am putut încărca dashboard-urile. Te rugăm să reîncarci pagina.")
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

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Dashboards</h1>
              <div className="flex items-center gap-3">
                <p className="text-muted-foreground">
                  {user?.plan?.name || "Free"} Plan
                </p>
                <span className="text-muted-foreground">•</span>
                <ResourceCounter 
                  current={dashboards.length}
                  max={user?.plan?.maxDashboards || 1}
                  label="dashboards"
                />
              </div>
            </div>
            <CreateDashboardDialog onDashboardCreated={loadDashboards} />
          </div>

          <DashboardList dashboards={dashboards} onDashboardDeleted={loadDashboards} />
        </div>
      </main>
    </div>
  )
}
