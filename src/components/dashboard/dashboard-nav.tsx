import Link from "next/link"
import { Button } from "@/components/ui/controls/button"
import { BarChart3, Upload, LayoutDashboard, CreditCard, LogOut } from "lucide-react"
import { signOut, getCurrentUser } from "@/lib/actions/auth"

export async function DashboardNav() {
  const user = await getCurrentUser()

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-xl font-semibold">DataInsight</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboards
              </Button>
            </Link>
            <Link href="/upload">
              <Button variant="ghost" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Pricing
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {user && (
            <div className="text-sm">
              <p className="font-medium">{user.full_name || user.email}</p>
              <p className="text-xs text-muted-foreground">{user.plan?.name || "Free"} Plan</p>
            </div>
          )}
          <form action={signOut}>
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}
