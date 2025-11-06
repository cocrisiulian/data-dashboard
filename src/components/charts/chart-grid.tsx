"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/controls/button"
import { Trash2, BarChart3 } from "lucide-react"
import { deleteChart } from "@/lib/actions/dashboards"
import { useState, useEffect } from "react"
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
import { parseCSV } from "@/lib/utils/csv-parser"
import { getFileUrl } from "@/lib/actions/files"

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

export function ChartGrid({ charts }: { charts: ChartWithFile[] }) {
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (chartId: string) => {
    if (!confirm("Are you sure you want to delete this chart?")) return

    setDeleting(chartId)
    try {
      await deleteChart(chartId)
    } catch (error: any) {
      alert(error.message)
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
        <ChartCard key={chart.id} chart={chart} onDelete={handleDelete} deleting={deleting === chart.id} />
      ))}
    </div>
  )
}

function ChartCard({
  chart,
  onDelete,
  deleting,
}: { chart: ChartWithFile; onDelete: (id: string) => void; deleting: boolean }) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const url = await getFileUrl(chart.file.file_path)
        const response = await fetch(url)
        const blob = await response.blob()
        const file = new File([blob], chart.file.file_name, { type: "text/csv" })
        const parsed = await parseCSV(file)
        setData(parsed.rows)
      } catch (error) {
        console.error("Failed to load chart data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [chart.file.file_path, chart.file.file_name])

  // Defensive: check for valid config and data
  const xAxis = chart.chart_config?.xAxis;
  const yAxis = chart.chart_config?.yAxis;
  const isConfigValid = xAxis && yAxis && Array.isArray(data) && data.length > 0;

  let chartElement: React.ReactElement | null = null;
  if (isConfigValid) {
    switch (chart.chart_type) {
      case "bar":
        chartElement = (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxis} fill="#8884d8" />
          </BarChart>
        );
        break;
      case "line":
        chartElement = (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </LineChart>
        );
        break;
      case "area":
        chartElement = (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey={yAxis} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        );
        break;
      case "pie":
        chartElement = (
          <PieChart>
            <Pie
              data={data}
              dataKey={yAxis}
              nameKey={xAxis}
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
          <Button variant="ghost" size="sm" onClick={() => onDelete(chart.id)} disabled={deleting}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <p className="text-muted-foreground">Loading chart...</p>
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