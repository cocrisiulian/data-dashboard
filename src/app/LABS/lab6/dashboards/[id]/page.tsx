import { getDashboard } from "../../submission/Controller"
import { detailsView } from "../../submission/View"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function DashboardDetailsPage({ params }: Props) {
  const { id } = await params
  const d = await getDashboard(id)
  const view = detailsView(d)
  if ((view as any).notFound) {
    return (
      <div className="p-6">
        <p className="text-red-600">Dashboard not found.</p>
        <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards">Back</Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard — Details</h1>
      <div className="border rounded p-4">
        <div><span className="font-medium">ID:</span> {view.id}</div>
        <div><span className="font-medium">Name:</span> {view.name}</div>
        <div><span className="font-medium">Description:</span> {String(view.description || "").trim() || "-"}</div>
        <div><span className="font-medium">Created:</span> {view.created_at}</div>
        <div><span className="font-medium">Updated:</span> {view.updated_at}</div>
      </div>
      <div className="space-x-4">
        <Link className="text-blue-600 underline" href={`/LABS/lab6/dashboards/${view.id}/edit`}>Edit</Link>
        <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards">Back to list</Link>
      </div>
    </div>
  )
}
