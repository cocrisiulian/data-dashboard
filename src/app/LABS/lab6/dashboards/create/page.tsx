import { createDashboardAction } from "../actions"
import Link from "next/link"

export default function CreateDashboardPage() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Dashboard</h1>

      <form action={createDashboardAction} className="space-y-3 max-w-md">
        {/* Text input */}
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <input name="name" type="text" className="border rounded px-2 py-1 w-full" required />
        </label>

        {/* Textarea */}
        <label className="block">
          <span className="block text-sm font-medium">Description</span>
          <textarea name="description" className="border rounded px-2 py-1 w-full" rows={3} />
        </label>

        {/* Checkbox */}
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="confirm" required />
          <span className="text-sm">Confirm create</span>
        </label>

        <div className="space-x-3 pt-2">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded">Save</button>
          <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
