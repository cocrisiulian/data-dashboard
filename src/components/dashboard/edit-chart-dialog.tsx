"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Input } from "@/components/ui/controls/input"
import { Label } from "@/components/ui/text/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/controls/select"
import { Pencil } from "lucide-react"
import { api } from "@/lib/api/client"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import type { ChartType } from "@/lib/types/database"

export type EditableChart = {
  id: string
  title: string
  chartType: ChartType
  chartConfig: any
  fileId: string
}

export function EditChartDialog({
  chart,
  onChartUpdated,
}: { chart: EditableChart; onChartUpdated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(chart.title)
  const [chartType, setChartType] = useState<ChartType>(chart.chartType)
  const [fileColumns, setFileColumns] = useState<string[]>([])
  const [xAxis, setXAxis] = useState(chart.chartConfig?.xAxis || "")
  const [yAxis, setYAxis] = useState(chart.chartConfig?.yAxis || "")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Load CSV columns when dialog opens
  useEffect(() => {
    if (open && chart.fileId) {
      loadFileColumns()
    }
  }, [open, chart.fileId])

  const loadFileColumns = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('No authentication token')
        return
      }

      const response = await fetch(`http://localhost:4000/api/files/${chart.fileId}/data`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch file data')
      }
      
      const jsonData = await response.json()
      if (jsonData.headers && jsonData.headers.length > 0) {
        setFileColumns(jsonData.headers)
        
        // Set defaults if not already set
        if (!xAxis && jsonData.headers.length > 0) setXAxis(jsonData.headers[0])
        if (!yAxis && jsonData.headers.length > 1) setYAxis(jsonData.headers[1])
      }
    } catch (err) {
      console.error('Failed to load file columns:', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await api.charts.update(chart.id, {
        chart_type: chartType,
        title,
        chart_config: {
          xAxis,
          yAxis,
        },
      })
      setOpen(false)
      if (onChartUpdated) {
        onChartUpdated()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to update chart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Chart</DialogTitle>
            <DialogDescription>Update chart settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">Chart Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Chart Type</Label>
              <Select value={chartType} onValueChange={(v: string) => setChartType(v as ChartType)} required>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={5}>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {fileColumns.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label>X-Axis Column</Label>
                  <Select value={xAxis} onValueChange={setXAxis} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select X-Axis column" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {fileColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Y-Axis Column</Label>
                  <Select value={yAxis} onValueChange={setYAxis} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Y-Axis column" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5}>
                      {fileColumns.map((col) => (
                        <SelectItem key={col} value={col}>
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
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
