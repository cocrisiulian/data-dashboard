import { getPlan } from "@/app/LABS/lab5/submission/Controller"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function PlanDetailsPage({ params }: Props) {
  const { id } = await params
  const plan = await getPlan(id)
  if (!plan) {
    return (
      <div className="p-6">
        <p className="text-red-600">Plan not found.</p>
        <Link className="text-blue-600 underline" href="/LABS/lab5/plans">Back</Link>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Plan — Details</h1>
      <div className="border rounded p-4">
        <div><span className="font-medium">ID:</span> {plan.id}</div>
        <div><span className="font-medium">Name:</span> {String(plan.name)}</div>
        <div><span className="font-medium">Price:</span> {plan.price}</div>
        {"max_files" in plan && (
          <div><span className="font-medium">Max files:</span> {(plan as any).max_files}</div>
        )}
        {"max_charts" in plan && (
          <div><span className="font-medium">Max charts:</span> {(plan as any).max_charts}</div>
        )}
        {"max_dashboards" in plan && (
          <div><span className="font-medium">Max dashboards:</span> {(plan as any).max_dashboards}</div>
        )}
      </div>

      <div className="space-x-4">
        <Link className="text-blue-600 underline" href={`/LABS/lab5/plans/${plan.id}/edit`}>Edit</Link>
        <Link className="text-blue-600 underline" href="/LABS/lab5/plans">Back to list</Link>
      </div>
    </div>
  )
}
