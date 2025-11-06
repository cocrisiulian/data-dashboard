"use server"

import { revalidatePath } from "next/cache"
import { createDashboard, updateDashboard } from "../submission/Controller"

export async function createDashboardAction(formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "").trim() || null
  const confirm = formData.get("confirm")

  if (!name) throw new Error("Name is required")
  if (!confirm) throw new Error("Please confirm create")

  await createDashboard({ name, description })
  revalidatePath("/LABS/lab6/dashboards")
}

export async function updateDashboardAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "").trim() || null
  const confirm = formData.get("confirm")

  if (!id) throw new Error("Missing id")
  if (!name) throw new Error("Name is required")
  if (!confirm) throw new Error("Please confirm edit")

  await updateDashboard(id, { name, description })
  revalidatePath(`/LABS/lab6/dashboards/${id}`)
  revalidatePath(`/LABS/lab6/dashboards/${id}/edit`)
  revalidatePath("/LABS/lab6/dashboards")
}
