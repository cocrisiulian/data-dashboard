import { createPlanAction } from "../actions"
import Link from "next/link"

export default function CreatePlanPage() {
  // Form requires: text input, select list, checkbox (per lab requirements)
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Create Plan</h1>

      <form action={createPlanAction} className="space-y-3 max-w-md">
        {/* Select (listă de selecție) */}
        <label className="block">
          <span className="block text-sm font-medium">Name</span>
          <select name="name" className="border rounded px-2 py-1 w-full">
            <option value="Free">Free</option>
            <option value="Pro">Pro</option>
            <option value="Custom">Custom</option>
          </select>
        </label>

        {/* Text input (numeric) */}
        <label className="block">
          <span className="block text-sm font-medium">Price</span>
          <input name="price" type="number" step="0.01" className="border rounded px-2 py-1 w-full" required />
        </label>

        {/* Checkbox (cerință lab) */}
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="confirm" required />
          <span className="text-sm">Confirm create</span>
        </label>

        <div className="space-x-3 pt-2">
          <button type="submit" className="px-3 py-1.5 bg-blue-600 text-white rounded">Save</button>
          <Link className="text-blue-600 underline" href="/LABS/lab5/plans">Cancel</Link>
        </div>
      </form>
    </div>
  )
}
