"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/controls/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/layout/dialog"
import { Label } from "@/components/ui/text/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/controls/select"
import { Pencil } from "lucide-react"
import { updateChart } from "@/lib/actions/dashboards"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import type { File, ChartType } from "@/lib/types/database"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { parseCSV, getNumericColumns, getCategoricalColumns } from "@/lib/utils/csv-parser"

export type EditableChart = {
  id: string
  title: string
  chart_type: ChartType
  chart_config: any
  file: { id: string; file_name: string; file_path: string }
}

export function EditChartDialog({
  dashboardId,
  chart,
  files = [],
}: { dashboardId: string; chart: EditableChart; files?: File[] }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(chart.title)
  const [fileId, setFileId] = useState(chart.file.id)
  const [chartType, setChartType] = useState<ChartType>(chart.chart_type)
  const [xAxis, setXAxis] = useState<string>(chart.chart_config?.xAxis || "")
  const [yAxis, setYAxis] = useState<string>(chart.chart_config?.yAxis || "")
  const [headers, setHeaders] = useState<string[]>([])
  const [numericHeaders, setNumericHeaders] = useState<string[]>([])
  const [loadingHeaders, setLoadingHeaders] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const chartConfig = { xAxis, yAxis }
      await updateChart(chart.id, dashboardId, {
        file_id: fileId,
        chart_type: chartType,
        title,
        chart_config: chartConfig,
      })
      setOpen(false)
    } catch (err: any) {
      setError(err.message || "Failed to update chart")
    } finally {
      setLoading(false)
    }
  }

  // Load headers on open and when file changes
  useEffect(() => {
    async function loadHeaders() {
      if (!fileId) {
        setHeaders([])
        setNumericHeaders([])
        return
      }
      setLoadingHeaders(true)
      try {
        const file = files.find((f) => f.id === fileId)
        if (!file) return
        const supabase = getSupabaseBrowserClient()
        const { data } = supabase.storage.from("files").getPublicUrl(file.file_path)
        const res = await fetch(data.publicUrl)
        const blob = await res.blob()
        const csvFile = new File([blob], file.file_name, { type: "text/csv" })
        const parsed = await parseCSV(csvFile)
        setHeaders(parsed.headers)
        const numeric = getNumericColumns(parsed)
        setNumericHeaders(numeric)
        // If current selections are invalid, try to fix
        if (!parsed.headers.includes(xAxis)) {
          const categorical = getCategoricalColumns(parsed)
          if (categorical.length > 0) setXAxis(categorical[0])
        }
        if (!parsed.headers.includes(yAxis)) {
          if (numeric.length > 0) setYAxis(numeric[0])
        }
      } catch (err) {
        console.error("Failed to read file headers", err)
        setHeaders([])
        setNumericHeaders([])
      } finally {
        setLoadingHeaders(false)
      }
    }
    if (open) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      loadHeaders()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId, open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Chart</DialogTitle>
            <DialogDescription>Update the configuration for this chart</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Chart Title</Label>
              <input
                id="title"
                className="border-input h-9 w-full rounded-md border bg-background px-3 py-1 text-sm outline-none"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Data Source</Label>
              <Select value={fileId} onValueChange={setFileId} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
                <SelectContent>
                  {(files || []).map((f) => (
                    <SelectItem key={f.id} value={f.id}>
                      {f.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={(v: string) => setChartType(v as ChartType)} required>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>X-Axis Column</Label>
              <Select value={xAxis} onValueChange={setXAxis} disabled={!fileId || loadingHeaders} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingHeaders ? "Loading columns..." : "Select column"} />
                </SelectTrigger>
                <SelectContent>
                  {headers.map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Y-Axis Column</Label>
              <Select value={yAxis} onValueChange={setYAxis} disabled={!fileId || loadingHeaders} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingHeaders ? "Loading columns..." : "Select numeric column"} />
                </SelectTrigger>
                <SelectContent>
                  {(numericHeaders.length > 0 ? numericHeaders : headers).map((h) => (
                    <SelectItem key={h} value={h}>
                      {h}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
