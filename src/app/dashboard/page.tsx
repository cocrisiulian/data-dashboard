"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardList } from "@/components/dashboard/dashboard-list"
import { CreateDashboardDialog } from "@/components/dashboard/create-dashboard-dialog"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/client"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [dashboards, setDashboards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      setError(null)
      const data = await api.dashboards.getAll()
      setDashboards(data)
    } catch (error) {
      console.error("Failed to load dashboards:", error)
      setError(error instanceof Error ? error.message : "Failed to load dashboards")
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
              <p className="text-muted-foreground">
                {user?.plan?.name || "Free"} Plan: {dashboards.length} /{" "}
                {user?.plan?.maxDashboards === -1 ? "Unlimited" : user?.plan?.maxDashboards || 1} dashboards
              </p>
            </div>
            <CreateDashboardDialog onDashboardCreated={loadDashboards} />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <DashboardList dashboards={dashboards} onDashboardDeleted={loadDashboards} />
        </div>
      </main>
    </div>
  )
}
