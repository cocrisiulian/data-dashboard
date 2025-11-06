import Link from "next/link"

export default function Lab6Home() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Lab 6 — MVC Demo (Dashboards)</h1>
      <p>Alege una dintre paginile de mai jos:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards">Index (Dashboards)</Link>
        </li>
        <li>
          <Link className="text-blue-600 underline" href="/LABS/lab6/dashboards/create">Create Dashboard</Link>
        </li>
      </ul>
    </div>
  )
}
