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
import { Plus } from "lucide-react"
import { api } from "@/lib/api/client"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import type { File, ChartType } from "@/lib/types/database"

export function AddChartDialog({ dashboardId, files, onChartAdded }: { dashboardId: string; files: File[]; onChartAdded?: () => void }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [fileId, setFileId] = useState("")
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [fileColumns, setFileColumns] = useState<string[]>([])
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setTitle("")
      setFileId("")
      setChartType("bar")
      setError("")
      setFileColumns([])
      setXAxis("")
      setYAxis("")
    }
  }, [open])

  // Load file columns when a file is selected
  useEffect(() => {
    async function loadFileColumns() {
      if (!fileId) {
        setFileColumns([])
        setXAxis("")
        setYAxis("")
        return
      }

      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.error('No authentication token')
          setFileColumns([])
          return
        }

        const response = await fetch(`http://localhost:4000/api/files/${fileId}/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          setFileColumns([])
          return
        }

        const jsonData = await response.json()
        if (jsonData.headers && jsonData.headers.length > 0) {
          setFileColumns(jsonData.headers)
          // Auto-select first two columns
          if (jsonData.headers.length >= 2) {
            setXAxis(jsonData.headers[0])
            setYAxis(jsonData.headers[1])
          } else if (jsonData.headers.length === 1) {
            setXAxis(jsonData.headers[0])
          }
        }
      } catch (err) {
        console.error("Failed to load file columns:", err)
        setFileColumns([])
      }
    }

    loadFileColumns()
  }, [fileId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const chartConfig = {
        xAxis: xAxis,
        yAxis: yAxis
      }
      
      await api.charts.create({
        dashboard_id: dashboardId,
        file_id: fileId,
        chart_type: chartType,
        title,
        chart_config: chartConfig
      })
      
      setOpen(false)
      setTitle("")
      setFileId("")
      setChartType("bar")
      setXAxis("")
      setYAxis("")
      
      if (onChartAdded) {
        onChartAdded()
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to add chart")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Chart
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Chart</DialogTitle>
            <DialogDescription>Create a new chart from your uploaded data</DialogDescription>
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
                placeholder="Monthly Sales"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file">Data Source</Label>
              <Select value={fileId} onValueChange={setFileId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a file" />
                </SelectTrigger>
                <SelectContent>
                  {files.map((file) => (
                    <SelectItem key={file.id} value={file.id}>
                      {file.file_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {fileId && fileColumns.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="xAxis">X-Axis Column</Label>
                  <Select value={xAxis} onValueChange={setXAxis} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select X-axis column" />
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
                  <Label htmlFor="yAxis">Y-Axis Column</Label>
                  <Select value={yAxis} onValueChange={setYAxis} required>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Y-axis column" />
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
            
            {fileId && fileColumns.length === 0 && (
              <div className="text-sm text-muted-foreground">
                Loading columns from selected file...
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: string) => setChartType(value as ChartType)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="area">Area Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || files.length === 0 || !fileId || Boolean(fileId && (!xAxis || !yAxis))}>
              {loading ? "Adding..." : "Add Chart"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
