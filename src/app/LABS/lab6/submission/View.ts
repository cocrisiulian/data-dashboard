// Lab 6 — Submission: View (Dashboard)
// Reused MVC approach from Lab5

import type { Dashboard } from "@/lib/types/database"

export function formatDate(value: string) {
  try {
    return new Date(value).toLocaleString()
  } catch {
    return value
  }
}

export function dashboardCard(d: Pick<Dashboard, "id" | "name" | "description" | "created_at">) {
  return {
    id: d.id,
    title: d.name,
    subtitle: d.description || "",
    meta: `Created: ${formatDate(d.created_at)}`,
  }
}

export function indexView(dashboards: Dashboard[]) {
  return dashboards.map((d) => dashboardCard(d))
}

export function detailsView(d: Dashboard | null) {
  if (!d) return { notFound: true }
  return {
    id: d.id,
    name: d.name,
    description: d.description,
    created_at: formatDate(d.created_at),
    updated_at: formatDate(d.updated_at),
  }
}
