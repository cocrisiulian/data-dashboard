"use client"

import { FileUploadForm } from "@/components/files/file-upload-form"
import { FileList } from "@/components/files/file-list"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { api } from "@/lib/api/client"

export default function UploadPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [files, setFiles] = useState<any[]>([])
  const [loadingFiles, setLoadingFiles] = useState(true)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      loadFiles()
    }
  }, [user])

  const loadFiles = async () => {
    try {
      setLoadingFiles(true)
      const data = await api.files.getAll()
      setFiles(data)
    } catch (error) {
      console.error("Failed to load files:", error)
    } finally {
      setLoadingFiles(false)
    }
  }

  if (isLoading) {
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Upload File</h1>
            <p className="text-muted-foreground">Upload a CSV file to create visualizations and dashboards</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <FileUploadForm onUploadSuccess={loadFiles} />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Your Uploaded Files</h2>
              {loadingFiles ? (
                <p className="text-muted-foreground">Loading files...</p>
              ) : (
                <FileList files={files} onFileDeleted={loadFiles} compact />
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
