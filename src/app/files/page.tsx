import { getFiles } from "@/lib/actions/files"
import { getCurrentUser } from "@/lib/actions/auth"
import { FileList } from "@/components/files/file-list"
import { FileUploadForm } from "@/components/files/file-upload-form"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"

export default async function FilesPage() {
  const [files, user] = await Promise.all([getFiles(), getCurrentUser()])

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Files</h1>
            <p className="text-muted-foreground">
              {user?.plan?.name || "Free"} Plan: {files.length} /{" "}
              {user?.plan?.max_files === -1 ? "Unlimited" : user?.plan?.max_files || 2} files
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <FileUploadForm />
            <FileList files={files} />
          </div>
        </div>
      </main>
    </div>
  )
}
