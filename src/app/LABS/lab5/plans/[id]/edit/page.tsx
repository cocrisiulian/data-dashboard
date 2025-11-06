import { getPlan } from "@/app/LABS/lab5/submission/Controller"
import { updatePlanAction } from "../../actions"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function EditPlanPage({ params }: Props) {
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

  async function action(formData: FormData) {
    "use server"
    await updatePlanAction(id, formData)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Plan</h1>

      <form action={action} className="space-y-3 max-w-md">
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <select name="name" className="border rounded px-2 py-1 w-full" defaultValue={String(plan.name)}>
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Custom">Custom</option>
          </select>
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Price</span>
          <input name="price" type="number" step="0.01" className="border rounded px-2 py-1 w-full" defaultValue={String(plan.price)} required />
        </label>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="confirm" defaultChecked />
          <span className="text-sm">Confirm edit</span>
        </label>

        <div className="space-x-3 pt-2">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded">Save</button>
          <Link className="text-blue-600 underline" href={`/LABS/lab5/plans/${plan.id}`}>Cancel</Link>
        </div>
      </form>
    </div>
  )
}
