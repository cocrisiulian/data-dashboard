import { FileUploadForm } from "@/components/files/file-upload-form"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { getCurrentUser } from "@/lib/actions/auth"

export default async function UploadPage() {
  const user = await getCurrentUser()

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Upload File</h1>
            <p className="text-muted-foreground">Upload a CSV file to create visualizations and dashboards</p>
          </div>

          <FileUploadForm />
        </div>
      </main>
    </div>
  )
}
