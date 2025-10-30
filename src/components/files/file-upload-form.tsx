"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/controls/button"
import { Input } from "@/components/ui/controls/input"
import { Label } from "@/components/ui/text/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Upload, FileText } from "lucide-react"
import { uploadFile } from "@/lib/actions/files"
import { useRouter } from "next/navigation"

export function FileUploadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile)
        setError("")
      } else {
        setError("Please upload a CSV file")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile)
        setError("")
      } else {
        setError("Please upload a CSV file")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Please select a file")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("file", file)
      const uploadedFile = await uploadFile(formData)
      setFile(null)
      onSuccess?.()
      router.push(`/files/${uploadedFile.id}`)
    } catch (err: any) {
      setError(err.message || "Failed to upload file")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Data File</CardTitle>
        <CardDescription>Upload a CSV file to create visualizations</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-border"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Drag and drop your CSV file here</p>
                <p className="text-xs text-muted-foreground">or click to browse</p>
              </div>
              <Input id="file" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
              <Label htmlFor="file" className="cursor-pointer">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Browse Files</span>
                </Button>
              </Label>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => setFile(null)}>
                Remove
              </Button>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!file || loading}>
            {loading ? "Uploading..." : "Upload File"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
