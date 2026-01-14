"use client"

import Link from "next/link"
import { Button } from "@/components/ui/controls/button"
import { BarChart3, Upload, LayoutDashboard, CreditCard, LogOut, BookOpen, User, Shield, Trash2, Users, Settings, Activity } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/navigation/dropdown-menu"

export function DashboardNav() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  return (
    <header className="border-b border-border">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="text-xl font-semibold">DataInsight</span>
          </Link>
          <nav className="flex items-center divide-x divide-border">
            <Link href="/dashboard" className="pr-2">
              <Button variant="ghost" size="sm">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboards
              </Button>
            </Link>
            <Link href="/upload" className="px-2">
              <Button variant="ghost" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </Link>
            <Link href="/pricing" className="px-2">
              <Button variant="ghost" size="sm">
                <CreditCard className="h-4 w-4 mr-2" />
                Pricing
              </Button>
            </Link>
            <Link href="/trash" className="px-2">
              <Button variant="ghost" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Trash
              </Button>
            </Link>
            <Link href="/LABS" className="px-2">
              <Button variant="ghost" size="sm">
                <BookOpen className="h-4 w-4 mr-2" />
                Labs
              </Button>
            </Link>
            {user?.isAdmin && (
              <div className="px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Admin
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-2 shadow-xl">
                    <DropdownMenuLabel className="font-semibold">Admin Panel</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/analytics" className="cursor-pointer">
                        <Shield className="h-4 w-4 mr-2" />
                        Analytics
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/users" className="cursor-pointer">
                        <Users className="h-4 w-4 mr-2" />
                        User Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/plans" className="cursor-pointer">
                        <Settings className="h-4 w-4 mr-2" />
                        Plan Management
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/logs" className="cursor-pointer">
                        <Activity className="h-4 w-4 mr-2" />
                        Activity Logs
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            <Link href="/profile" className="pl-2">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4 divide-x divide-border">
          {user && (
            <div className="text-sm pr-4">
              <p className="font-medium">{user.fullName} -- {user.email}</p>
              <p className="text-xs text-muted-foreground">{user.plan?.name || "Free"} Plan</p>
            </div>
          )}
          <div className="pl-4">
            <Button variant="ghost" size="sm" onClick={handleLogout} className="border border-border/50 hover:border-border">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
