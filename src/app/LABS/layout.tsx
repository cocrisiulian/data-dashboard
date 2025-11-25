"use client"

import { LabsSidebar } from "@/components/labs/labs-sidebar"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default function LabsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <div className="flex flex-1">
        <LabsSidebar />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  )
}
