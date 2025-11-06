import { listPlans } from "../submission/Controller"
import { planCard } from "../submission/View"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PlansIndexPage() {
  const plans = await listPlans()

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Plans — Index</h1>
        <Link className="text-blue-600 underline" href="/LABS/lab5/plans/create">
          Create Plan
        </Link>
      </div>

      <ul className="grid gap-3">
        {plans.map((p: any) => {
          const card = planCard({ id: p.id, name: p.name, price: p.price })
          return (
            <li key={p.id} className="border rounded p-4 flex items-center justify-between">
              <div>
                <div className="font-medium">{card.title}</div>
                <div className="text-sm text-gray-500">Price: {card.price}</div>
              </div>
              <div className="space-x-3">
                <Link className="text-blue-600 underline" href={`/LABS/lab5/plans/${p.id}`}>
                  Details
                </Link>
                <Link className="text-blue-600 underline" href={`/LABS/lab5/plans/${p.id}/edit`}>
                  Edit
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
