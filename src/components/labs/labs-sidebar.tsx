"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/text/badge"
import { cn } from "@/lib/utils/utils"

const labs = [
  { number: 1, title: "Database Design & ERD", href: "/LABS/lab1", icon: "🗄️" },
  { number: 2, title: "System Architecture", href: "/LABS/lab2", icon: "🏗️" },
  { number: 3, title: "ORM Schema-First", href: "/LABS/lab3", icon: "📊" },
  { number: 4, title: "ORM Code-First", href: "/LABS/lab4", icon: "💻" },
  { number: 5, title: "MVC & Authentication", href: "/LABS/lab5", icon: "🔐" },
  { number: 6, title: "MVC & Dashboards", href: "/LABS/lab6", icon: "📈" },
  { number: 7, title: "CSV & Visualization", href: "/LABS/lab7", icon: "📂" },
  { number: 8, title: "API & Deployment", href: "/LABS/lab8", icon: "🚀" },
  { number: 9, title: "Hard & Soft Delete", href: "/LABS/lab9", icon: "🗑️" },
  { number: 10, title: "Service Layer & DI", href: "/LABS/lab10", icon: "⚙️" },
  { number: 11, title: "Code Review & Logging", href: "/LABS/lab11", icon: "📝" },
  { number: 12, title: "Memory Cache", href: "/LABS/lab12", icon: "⚡" },
]

export function LabsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 border-r bg-card/50 backdrop-blur-sm sticky top-0 h-screen overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <Link href="/LABS" className="block">
            <h2 className="text-xl font-bold mb-1">PPAW Labs</h2>
            <p className="text-xs text-muted-foreground">Academic Year 2025-2026</p>
          </Link>
        </div>

        {/* Lab Navigation */}
        <nav className="space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Laboratories
          </div>
          {labs.map((lab) => {
            const isActive = pathname === lab.href || pathname?.startsWith(`${lab.href}/`)
            return (
              <Link
                key={lab.number}
                href={lab.href}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-lg transition-all group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="text-2xl flex-shrink-0">{lab.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge
                      variant={isActive ? "secondary" : "outline"}
                      className="text-xs"
                    >
                      Lab {lab.number}
                    </Badge>
                  </div>
                  <div className={cn(
                    "text-sm font-medium leading-tight",
                    isActive ? "text-primary-foreground" : "text-foreground"
                  )}>
                    {lab.title}
                  </div>
                </div>
              </Link>
            )
          })}
        </nav>

        {/* Quick Links */}
        <div className="pt-4 border-t space-y-2">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Quick Links
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-sm"
          >
            <span>📊</span>
            <span>Dashboards</span>
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-sm"
          >
            <span>⬆️</span>
            <span>Upload Files</span>
          </Link>
          <Link
            href="/pricing"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-sm"
          >
            <span>💳</span>
            <span>Pricing</span>
          </Link>
        </div>
      </div>
    </aside>
  )
}
