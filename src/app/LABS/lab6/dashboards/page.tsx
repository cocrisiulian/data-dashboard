import { listDashboards } from "../submission/Controller"
import { indexView } from "../submission/View"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function DashboardsIndexPage() {
  const dashboards = await listDashboards()
  const cards = indexView(dashboards)

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboards — Index</h1>
        <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards/create">
          Create Dashboard
        </Link>
      </div>

      <ul className="grid gap-3">
        {cards.map((c) => (
          <li key={c.id} className="border rounded p-4 flex items-center justify-between">
            <div>
              <div className="font-medium">{c.title}</div>
              {c.subtitle && <div className="text-sm text-gray-500">{c.subtitle}</div>}
              {c.meta && <div className="text-xs text-gray-400">{c.meta}</div>}
            </div>
            <div className="space-x-3">
              <Link className="text-blue-600 underline" href={`/LABS/lab6/dashboards/${c.id}`}>
                Details
              </Link>
              <Link className="text-blue-600 underline" href={`/LABS/lab6/dashboards/${c.id}/edit`}>
                Edit
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
