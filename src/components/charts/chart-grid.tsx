"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
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
import { Trash2, BarChart3 } from "lucide-react"
import { api } from "@/lib/api/client"
import { useState, useEffect } from "react"
import { parseCSV } from "@/lib/utils/csv-parser"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { File } from "@/lib/types/database"
import { EditChartDialog } from "@/components/dashboard/edit-chart-dialog"

type ChartWithFile = {
  id: string
  title: string
  chart_type: string
  chart_config: any
  file: {
    id: string
    file_name: string
    file_path: string
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function ChartGrid({ charts, dashboardId, files, onChartDeleted }: { charts: ChartWithFile[]; dashboardId: string; files: File[]; onChartDeleted?: () => void }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (chartId: string) => {
    setDeleting(chartId)
    try {
      await api.charts.delete(chartId)
      toast({ title: "Chart deleted", description: "The chart was removed successfully." })
      if (onChartDeleted) {
        onChartDeleted()
      }
    } catch (error: any) {
      toast({ title: "Failed to delete", description: error.response?.data?.message || error.message || "Please try again." , variant: "destructive" })
    } finally {
      setDeleting(null)
    }
  }

  if (charts.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No charts added yet</p>
          <p className="text-sm text-muted-foreground">Add your first chart to visualize your data</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {charts.map((chart) => (
        <ChartCard 
          key={chart.id} 
          chart={chart} 
          onDelete={handleDelete} 
          deleting={deleting === chart.id} 
          dashboardId={dashboardId} 
          files={files}
          onChartUpdated={onChartDeleted}
        />
      ))}
    </div>
  )
}

function ChartCard({
  chart,
  onDelete,
  deleting,
  dashboardId,
  files,
  onChartUpdated,
}: { 
  chart: ChartWithFile; 
  onDelete: (id: string) => void; 
  deleting: boolean; 
  dashboardId: string; 
  files: File[];
  onChartUpdated?: () => void;
}) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [fileError, setFileError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setFileError(null)
        
        // Use the new /api/files/:id/data endpoint
        const token = localStorage.getItem('token')
        if (!token) {
          setFileError("Authentication required")
          setData([])
          setLoading(false)
          return
        }

        const response = await fetch(`http://localhost:4000/api/files/${chart.file.id}/data`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const jsonData = await response.json()
          if (jsonData.rows && jsonData.rows.length > 0) {
            setData(jsonData.rows)
          } else {
            setFileError("Empty file")
            setData([])
          }
        } else if (response.status === 404) {
          setFileError(`File not found`)
          setData([])
        } else if (response.status === 401) {
          setFileError("Unauthorized - please login again")
          setData([])
        } else {
          setFileError(`Failed to load file (${response.status})`)
          setData([])
        }
      } catch (error) {
        console.error("Failed to load chart data:", error)
        setFileError("Error loading file")
        setData([])
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [chart.file.id])

  // Defensive: check for valid config and data
  const xAxis = chart.chart_config?.xAxis as string | undefined
  const yAxis = chart.chart_config?.yAxis as string | undefined
  const headers = data && data.length > 0 ? Object.keys(data[0]) : []
  const resolveKey = (key?: string) => {
    if (!key) return undefined
    const exact = headers.find((h) => h === key)
    if (exact) return exact
    const ci = headers.find((h) => h.toLowerCase().trim() === key.toLowerCase().trim())
    return ci
  }
  const rx = resolveKey(xAxis)
  const ry = resolveKey(yAxis)
  const isConfigValid = !!rx && !!ry && Array.isArray(data) && data.length > 0

  let chartElement: React.ReactElement | null = null;
  if (isConfigValid) {
    switch (chart.chart_type) {
      case "bar":
        chartElement = (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={rx} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={ry} fill="#8884d8" />
          </BarChart>
        );
        break;
      case "line":
        chartElement = (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={rx} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={ry} stroke="#8884d8" />
          </LineChart>
        );
        break;
      case "area":
        chartElement = (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={rx} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={ry} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
        break;
      case "pie":
        chartElement = (
          <PieChart>
            <Pie
              data={data}
              dataKey={ry}
              nameKey={rx}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );
        break;
      default:
        chartElement = null;
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{chart.title}</CardTitle>
          <div className="flex items-center gap-1">
            <EditChartDialog 
              chart={{
                id: chart.id,
                title: chart.title,
                chartType: chart.chart_type as any,
                chartConfig: chart.chart_config,
                fileId: chart.file.id
              }} 
              onChartUpdated={onChartUpdated}
            />
            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" disabled={deleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete chart?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. The chart will be permanently removed from this dashboard.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(chart.id)}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
          </div>
        ) : fileError ? (
          <div className="h-64 flex items-center justify-center flex-col gap-2">
            <p className="text-destructive">{fileError}</p>
            <p className="text-sm text-muted-foreground">The source file may have been deleted</p>
          </div>
        ) : !isConfigValid ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-destructive">Invalid chart configuration or no data.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartElement as React.ReactElement}
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}