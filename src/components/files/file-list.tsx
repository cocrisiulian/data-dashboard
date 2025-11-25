"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { FileText, Trash2, Eye } from "lucide-react"
import { api } from "@/lib/api/client"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/feedback/alert-dialog"
import { toast } from "@/hooks/use-toast"
import type { File } from "@/lib/types/database"
import Link from "next/link"

export function FileList({ files, onFileDeleted, compact = false }: { files: File[]; onFileDeleted?: () => void; compact?: boolean }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (fileId: string) => {
    setDeleting(fileId)
    try {
      await api.files.delete(fileId)
      toast({ title: "File deleted", description: "The file was removed successfully." })
      onFileDeleted?.()
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.message || "Please try again.", variant: "destructive" })
    } finally {
      setDeleting(null)
    }
  }

  if (files.length === 0) {
    return compact ? (
      <div className="text-center py-8">
        <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No files uploaded yet</p>
      </div>
    ) : (
      <Card>
        <CardContent className="py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No files uploaded yet</p>
        </CardContent>
      </Card>
    )
  }

  const fileListContent = (
    <div className="space-y-2">
      {files.map((file) => (
        <div key={file.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{file.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.file_size / 1024).toFixed(2)} KB • {new Date(file.uploaded_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/files/${file.id}`}>
                <Eye className="h-4 w-4" />
              </Link>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" disabled={deleting === file.id}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete file?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. The file will be permanently removed from storage.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDelete(file.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  )

  if (compact) {
    return fileListContent
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Files</CardTitle>
      </CardHeader>
      <CardContent>
        {fileListContent}
      </CardContent>
    </Card>
  )
}
