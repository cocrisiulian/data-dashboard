// Lab 6 — Submission: Model (Dashboard entity on Supabase)
// Reused MVC approach from Lab5

import { getSupabaseServerClient } from "@/lib/supabase/server"
import type { Dashboard } from "@/lib/types/database"

export async function getAllDashboards(): Promise<Dashboard[]> {
  const base = await getSupabaseServerClient()
  const {
    data: { user },
    error: userError,
  } = await base.auth.getUser()
  if (userError) throw new Error(`Auth error: ${userError.message}`)
  if (!user) throw new Error("Unauthorized")

  // Use RPC to read from labs schema via public
  const { data, error } = await base.rpc("labs_list_dashboards", { p_user_id: user.id })

  if (error) throw new Error(`Failed to fetch dashboards: ${error.message}`)
  return data as Dashboard[]
}

export async function getDashboardById(id: string): Promise<Dashboard | null> {
  const base = await getSupabaseServerClient()
  const {
    data: { user },
  } = await base.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await base
    .rpc("labs_get_dashboard", { p_id: id, p_user_id: user.id })

  if (error) throw new Error(`Failed to fetch dashboard: ${error.message}`)
  return (data as unknown as Dashboard) || null
}

export async function createDashboard({
  name,
  description,
}: {
  name: string
  description?: string | null
}): Promise<Dashboard> {
  const base = await getSupabaseServerClient()
  const {
    data: { user },
  } = await base.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await base
    .rpc("labs_create_dashboard", { p_user_id: user.id, p_name: name, p_description: description ?? null })

  if (error) throw new Error(`Failed to create dashboard: ${error.message}`)
  return data as unknown as Dashboard
}

export async function updateDashboard(
  id: string,
  { name, description }: { name: string; description?: string | null }
): Promise<Dashboard> {
  const base = await getSupabaseServerClient()
  const {
    data: { user },
  } = await base.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data, error } = await base
    .rpc("labs_update_dashboard", { p_id: id, p_user_id: user.id, p_name: name, p_description: description ?? null })

  if (error) throw new Error(`Failed to update dashboard: ${error.message}`)
  return data as unknown as Dashboard
}
