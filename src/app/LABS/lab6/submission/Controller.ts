// Lab 6 — Submission: Controller (Dashboard)
// Reused MVC approach from Lab5
// @ts-ignore: local submission module resolution
import * as Model from "./Model"

export async function listDashboards() {
  return Model.getAllDashboards()
}

export async function getDashboard(id: string) {
  return Model.getDashboardById(id)
}

export async function createDashboard(data: { name: string; description?: string | null }) {
  return Model.createDashboard(data)
}

export async function updateDashboard(id: string, data: { name: string; description?: string | null }) {
  return Model.updateDashboard(id, data)
}
