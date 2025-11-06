// Lab 5 — Submission: Controller
// Uses local Model to avoid duplication with lib/
import * as Model from "./Model"

export async function listPlans() {
  return Model.getAllPlans()
}

export async function getPlan(id: string) {
  return Model.getPlanById(id)
}

export async function createPlan(data: { name: string; price: number }) {
  return Model.createPlan(data)
}

export async function updatePlan(id: string, data: { name: string; price: number }) {
  return Model.updatePlan(id, data)
}
