import { redirect } from "next/navigation"

type Props = { params: { id: string } }

export default function LegacyLab5DetailsRedirect({ params }: Props) {
	redirect(`/LABS/lab5/plans/${params.id}`)
}

