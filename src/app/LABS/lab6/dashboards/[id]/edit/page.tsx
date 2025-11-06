import { getDashboard } from "../../../submission/Controller"
import { updateDashboardAction } from "../../actions"
import Link from "next/link"

type Props = { params: Promise<{ id: string }> }

export default async function EditDashboardPage({ params }: Props) {
  const { id } = await params
  const d = await getDashboard(id)
  if (!d) {
    return (
      <div className="p-6">
        <p className="text-red-600">Dashboard not found.</p>
        <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards">Back</Link>
      </div>
    )
  }

  async function action(formData: FormData) {
    "use server"
    await updateDashboardAction(id, formData)
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edit Dashboard</h1>

      <form action={action} className="space-y-3 max-w-md">
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <input name="name" type="text" className="border rounded px-2 py-1 w-full" defaultValue={d.name} required />
        </label>

        <label className="block">
          <span className="block text-sm font-medium">Description</span>
          <textarea name="description" className="border rounded px-2 py-1 w-full" rows={3} defaultValue={d.description || ""} />
        </label>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="confirm" defaultChecked />
          <span className="text-sm">Confirm edit</span>
        </label>

        <div className="space-x-3 pt-2">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded">Save</button>
          <Link className="text-blue-600 underline" href={`/LABS/lab6/dashboards/${d.id}`}>Cancel</Link>
        </div>
      </form>
    </div>
  )
}
