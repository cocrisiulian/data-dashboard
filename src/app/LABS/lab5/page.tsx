import Link from "next/link"

export default function Lab5Home() {
	return (
		<div className="p-6 space-y-4">
			<h1 className="text-2xl font-semibold">Lab 5 — MVC Demo</h1>
			<p>Alege una dintre paginile de mai jos:</p>
			<ul className="list-disc pl-6 space-y-1">
				<li>
					<Link className="text-blue-600 underline" href="/LABS/lab5/plans">Index (Plans)</Link>
				</li>
				<li>
					<Link className="text-blue-600 underline" href="/LABS/lab5/plans/create">Create Plan</Link>
				</li>
			</ul>
		</div>
	)
}

