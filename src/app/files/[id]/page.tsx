import { getFilePreview } from "@/lib/actions/files"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/layout/table"
import { Button } from "@/components/ui/controls/button"
import { ArrowLeft, FileText } from "lucide-react"
import Link from "next/link"

export default async function FilePreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { file, headers, rows, totalRows } = await getFilePreview(id)

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

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div>
                  <CardTitle>{file.file_name}</CardTitle>
                  <CardDescription>
                    {(file.file_size / 1024).toFixed(2)} KB • Uploaded {new Date(file.uploaded_at).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">Showing first 20 rows of {totalRows} total rows</p>
                </div>

                <div className="border border-border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHead key={header} className="font-semibold">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rows.map((row: any, index: number) => (
                          <TableRow key={index}>
                            {headers.map((header) => (
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
        </div>
      </main>
    </div>
  )
}
