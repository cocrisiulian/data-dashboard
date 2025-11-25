"use client"

import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/layout/table"
import { Button } from "@/components/ui/controls/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { api } from "@/lib/api/client"

export default function FilePreviewPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isLoading: authLoading } = useAuth()
  const [fileData, setFileData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const id = params.id as string

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
      return
    }

    if (user && id) {
      loadFilePreview()
    }
  }, [user, authLoading, id, router])

  const loadFilePreview = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await api.files.getPreview(id)
      setFileData(data)
    } catch (error) {
      console.error("Failed to load file preview:", error)
      setError(error instanceof Error ? error.message : "Failed to load file preview")
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
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/files">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Files
              </Link>
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fileData && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div>
                    <CardTitle>{fileData.file.file_name}</CardTitle>
                    <CardDescription>
                      {(fileData.file.file_size / 1024).toFixed(2)} KB • Uploaded {new Date(fileData.file.uploaded_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing first 20 rows of {fileData.totalRows} total rows
                    </p>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            {fileData.headers.map((header: string) => (
                              <TableHead key={header} className="font-semibold">
                                {header}
                              </TableHead>
                            ))}
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fileData.rows.map((row: any, index: number) => (
                            <TableRow key={index}>
                              {fileData.headers.map((header: string) => (
                                <TableCell key={header}>{row[header]}</TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
