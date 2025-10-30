"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ChartType } from "@/lib/types/database"

export async function createDashboard(name: string, description?: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check user's plan limits
  const { data: userData } = await supabase.from("users").select("*, plan:plans(*)").eq("id", user.id).single()

  const { count: dashboardCount } = await supabase
    .from("dashboards")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

  const maxDashboards = userData?.plan?.max_dashboards || 1

  if (maxDashboards !== -1 && dashboardCount !== null && dashboardCount >= maxDashboards) {
    throw new Error(`You have reached your plan limit of ${maxDashboards} dashboards. Please upgrade your plan.`)
  }

  const { data, error } = await supabase
    .from("dashboards")
    .insert({
      user_id: user.id,
      name,
      description,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to create dashboard: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "dashboard_create",
    details: { dashboard_id: data.id, name },
  })

  revalidatePath("/dashboard")
  return data
}

export async function getDashboards() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("dashboards")
    .select("*, charts(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch dashboards: ${error.message}`)
  }

  return data
}

export async function getDashboard(dashboardId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data, error } = await supabase
    .from("dashboards")
    .select("*, charts(*, file:files(*))")
    .eq("id", dashboardId)
    .eq("user_id", user.id)
    .single()

  if (error) {
    throw new Error(`Failed to fetch dashboard: ${error.message}`)
  }

  return data
}

export async function deleteDashboard(dashboardId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("dashboards").delete().eq("id", dashboardId).eq("user_id", user.id)

  if (error) {
    throw new Error(`Failed to delete dashboard: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "dashboard_delete",
    details: { dashboard_id: dashboardId },
  })

  revalidatePath("/dashboard")
}

export async function addChart(
  dashboardId: string,
  fileId: string,
  chartType: ChartType,
  title: string,
  chartConfig: any,
) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Check user's plan limits
  const { data: userData } = await supabase.from("users").select("*, plan:plans(*)").eq("id", user.id).single()

  const { count: chartCount } = await supabase
    .from("charts")
    .select("*", { count: "exact", head: true })
    .eq("dashboard_id", dashboardId)

  const maxCharts = userData?.plan?.max_charts || 3

  if (maxCharts !== -1 && chartCount !== null && chartCount >= maxCharts) {
    throw new Error(`You have reached your plan limit of ${maxCharts} charts. Please upgrade your plan.`)
  }

  const { data, error } = await supabase
    .from("charts")
    .insert({
      dashboard_id: dashboardId,
      file_id: fileId,
      chart_type: chartType,
      title,
      chart_config: chartConfig,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add chart: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "chart_create",
    details: { chart_id: data.id, dashboard_id: dashboardId, chart_type: chartType },
  })

  revalidatePath(`/dashboard/${dashboardId}`)
  return data
}

export async function deleteChart(chartId: string) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { error } = await supabase.from("charts").delete().eq("id", chartId)

  if (error) {
    throw new Error(`Failed to delete chart: ${error.message}`)
  }

  // Log the action
  await supabase.from("usage_logs").insert({
    user_id: user.id,
    action: "chart_delete",
    details: { chart_id: chartId },
  })

  revalidatePath("/dashboard")
}
