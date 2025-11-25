"use client"

import { FileList } from "@/components/files/file-list"
import { FileUploadForm } from "@/components/files/file-upload-form"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { api } from "@/lib/api/client"

export default function FilesPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user) {
      loadFiles()
    }
  }, [user, authLoading, router])

  const loadFiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.files.getAll()
      setFiles(data)
    } catch (error) {
      console.error("Failed to load files:", error)
      setError(error instanceof Error ? error.message : "Failed to load files")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNav />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Files</h1>
            <p className="text-muted-foreground">
              {user?.plan?.name || "Free"} Plan: {files.length} /{" "}
              {user?.plan?.maxFiles === -1 ? "Unlimited" : user?.plan?.maxFiles || 2} files
            </p>
          </div>

          {error && (
            <Alert>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            <FileUploadForm onFileUploaded={loadFiles} />
            <FileList files={files} onFileDeleted={loadFiles} />
          </div>
        </div>
      </main>
    </div>
  )
}
