import { getDashboards } from "@/lib/actions/dashboards"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { DashboardList } from "@/components/dashboard/dashboard-list"
import { CreateDashboardDialog } from "@/components/dashboard/create-dashboard-dialog"
import { getCurrentUser } from "@/lib/actions/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  let user = null
  let dashboards = []

  try {
    ;[dashboards, user] = await Promise.all([getDashboards(), getCurrentUser()])

    // If no user, redirect to login
    if (!user) {
      redirect("/login")
    }
  } catch (error) {
    console.error("Dashboard page error:", error)
    redirect("/login")
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
                {user?.plan?.max_dashboards === -1 ? "Unlimited" : user?.plan?.max_dashboards || 1} dashboards
              </p>
            </div>
            <CreateDashboardDialog />
          </div>

          <DashboardList dashboards={dashboards} />
        </div>
      </main>
    </div>
  )
}
