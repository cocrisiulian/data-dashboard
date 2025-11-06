// Lab 5 — Submission: Model
// Single source of truth for Lab 5 Model (Supabase accessor)

import { getSupabaseServerClient, getSupabaseServiceRoleClient } from "@/lib/supabase/server"
import type { Plan } from "@/lib/types/database"

// NOTE: Hosted Supabase PostgREST typically only exposes the public schema.
// We expose labs tables via public views and write via RPC functions.

export async function getAllPlans(): Promise<Plan[]> {
	const supabase = await getSupabaseServerClient()
	const { data, error } = await supabase
		.from("labs_plans")
		.select("id, name, max_files, max_charts, max_dashboards, price, created_at")
		.order("price", { ascending: true })

	if (error) throw new Error(`Failed to fetch plans: ${error.message}`)
	return data as Plan[]
}

export async function getPlanById(id: string): Promise<Plan | null> {
	const supabase = await getSupabaseServerClient()
	const { data, error } = await supabase
		.from("labs_plans")
		.select("id, name, max_files, max_charts, max_dashboards, price, created_at")
		.eq("id", id)
		.maybeSingle()

	if (error) throw new Error(`Failed to fetch plan: ${error.message}`)
	return (data as Plan) || null
}

export async function createPlan({
	name,
	price,
}: {
	name: Plan["name"] | string
	price: number
}): Promise<Plan> {
	// Use RPC to write into labs.plans from public schema
	const base = await getSupabaseServiceRoleClient().catch(() => getSupabaseServerClient())
	const { data, error } = await base.rpc("labs_create_plan", { p_name: name as string, p_price: price })

	if (error) {
		const msg = error.message || "Unknown error"
		if (msg.toLowerCase().includes("row-level security")) {
			throw new Error(
				"Failed to create plan: RLS blocked the insert. Either set SUPABASE_SERVICE_ROLE_KEY in env for server-side writes or relax policies for INSERT on labs.plans."
			)
		}
		throw new Error(`Failed to create plan: ${msg}`)
	}
	return data as unknown as Plan
}

export async function updatePlan(
	id: string,
	{ name, price }: { name: Plan["name"] | string; price: number }
): Promise<Plan> {
	const base = await getSupabaseServiceRoleClient().catch(() => getSupabaseServerClient())
	const { data, error } = await base.rpc("labs_update_plan", { p_id: id, p_name: name as string, p_price: price })

	if (error) {
		const msg = error.message || "Unknown error"
		if (msg.toLowerCase().includes("row-level security")) {
			throw new Error(
				"Failed to update plan: RLS blocked the update. Either set SUPABASE_SERVICE_ROLE_KEY in env for server-side writes or relax policies for UPDATE on labs.plans."
			)
		}
		throw new Error(`Failed to update plan: ${msg}`)
	}
	return data as unknown as Plan
}

