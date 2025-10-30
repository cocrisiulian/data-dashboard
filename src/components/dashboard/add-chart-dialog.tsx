"use client"

import type React from "react"

import { useState } from "react"
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
import { addChart } from "@/lib/actions/dashboards"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import type { File, ChartType } from "@/lib/types/database"

export function AddChartDialog({ dashboardId, files }: { dashboardId: string; files: File[] }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [fileId, setFileId] = useState("")
  const [chartType, setChartType] = useState<ChartType>("bar")
  const [xAxis, setXAxis] = useState("")
  const [yAxis, setYAxis] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const chartConfig = {
        xAxis,
        yAxis,
      }
      await addChart(dashboardId, fileId, chartType, title, chartConfig)
      setOpen(false)
      setTitle("")
      setFileId("")
      setXAxis("")
      setYAxis("")
    } catch (err: any) {
      setError(err.message || "Failed to add chart")
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
            <div className="space-y-2">
              <Label htmlFor="chartType">Chart Type</Label>
              <Select value={chartType} onValueChange={(value: string) => setChartType(value as ChartType)} required>
                <SelectTrigger>
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
              <Label htmlFor="xAxis">X-Axis Column</Label>
              <Input id="xAxis" placeholder="month" value={xAxis} onChange={(e) => setXAxis(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="yAxis">Y-Axis Column</Label>
              <Input id="yAxis" placeholder="sales" value={yAxis} onChange={(e) => setYAxis(e.target.value)} required />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || files.length === 0}>
              {loading ? "Adding..." : "Add Chart"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
