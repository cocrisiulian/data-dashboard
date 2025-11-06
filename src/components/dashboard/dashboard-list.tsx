"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { LayoutDashboard, Trash2, BarChart3 } from "lucide-react"
import { deleteDashboard } from "@/lib/actions/dashboards"
import { useState } from "react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/feedback/alert-dialog"
import { toast } from "@/hooks/use-toast"

type DashboardWithCharts = {
  id: string
  name: string
  description: string | null
  created_at: string
  charts: { count: number }[]
}

export function DashboardList({ dashboards }: { dashboards: DashboardWithCharts[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (dashboardId: string) => {
    setDeleting(dashboardId)
    try {
      await deleteDashboard(dashboardId)
      toast({ title: "Dashboard deleted", description: "The dashboard was removed successfully." })
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.message || "Please try again.", variant: "destructive" })
    } finally {
      setDeleting(null)
    }
  }

  if (dashboards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <LayoutDashboard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No dashboards created yet</p>
          <p className="text-sm text-muted-foreground">Create your first dashboard to start visualizing data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dashboards.map((dashboard) => (
        <Card key={dashboard.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate">{dashboard.name}</CardTitle>
                <CardDescription className="line-clamp-2">{dashboard.description || "No description"}</CardDescription>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" disabled={deleting === dashboard.id}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete dashboard?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. All charts inside this dashboard will be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(dashboard.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BarChart3 className="h-4 w-4" />
                <span>{dashboard.charts[0]?.count || 0} charts</span>
              </div>
              <Link href={`/dashboard/${dashboard.id}`}>
                <Button size="sm">View</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
