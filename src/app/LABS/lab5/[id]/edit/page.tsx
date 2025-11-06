import { redirect } from "next/navigation"

type Props = { params: { id: string } }

export default function LegacyLab5EditRedirect({ params }: Props) {
	redirect(`/LABS/lab5/plans/${params.id}/edit`)
}

