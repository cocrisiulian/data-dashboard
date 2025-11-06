// Lab 5 — Submission: View
// Single source of truth for Lab 5 View helpers

import type { Plan } from "@/lib/types/database"

export function formatPrice(value: number) {
  return `$${Number(value).toFixed(2)}`
}

export function planCard(plan: Pick<Plan, "id" | "name" | "price"> & Partial<Plan>) {
  return {
    id: plan.id,
    title: String(plan.name),
    subtitle: `Max: files=${"max_files" in plan ? (plan as any).max_files : "-"}, charts=${"max_charts" in plan ? (plan as any).max_charts : "-"}, dashboards=${"max_dashboards" in plan ? (plan as any).max_dashboards : "-"}`,
    price: formatPrice(plan.price),
  }
}

export function indexView(plans: Plan[]) {
  return plans.map((p) => planCard(p))
}

export function detailsView(plan: Plan | null) {
  if (!plan) return { notFound: true }
  return {
    id: plan.id,
    name: String(plan.name),
    price: formatPrice(plan.price),
    max_files: (plan as any).max_files,
    max_charts: (plan as any).max_charts,
    max_dashboards: (plan as any).max_dashboards,
    created_at: plan.created_at,
  }
}
