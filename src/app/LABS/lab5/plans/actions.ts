"use server"

import { revalidatePath } from "next/cache"
import { createPlan, updatePlan } from "@/app/LABS/lab5/submission/Controller"

export async function createPlanAction(formData: FormData) {
  const name = String(formData.get("name") || "")
  const price = Number(formData.get("price") || 0)

  if (!name) throw new Error("Name is required")
  if (Number.isNaN(price)) throw new Error("Price must be a number")

  await createPlan({ name, price })
  revalidatePath("/LABS/lab5/plans")
}

export async function updatePlanAction(id: string, formData: FormData) {
  const name = String(formData.get("name") || "")
  const price = Number(formData.get("price") || 0)

  if (!id) throw new Error("Missing id")
  if (!name) throw new Error("Name is required")
  if (Number.isNaN(price)) throw new Error("Price must be a number")

  await updatePlan(id, { name, price })
  revalidatePath(`/LABS/lab5/plans/${id}`)
  revalidatePath(`/LABS/lab5/plans/${id}/edit`)
  revalidatePath("/LABS/lab5/plans")
}
