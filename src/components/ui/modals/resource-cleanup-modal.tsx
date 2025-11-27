"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/controls/button"
import { Checkbox } from "@/components/ui/controls/checkbox"
import { ScrollArea } from "@/components/ui/layout/scroll-area"
import { AlertCircle, File, BarChart3, LayoutDashboard } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/feedback/alert"

interface ResourceCleanupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  cleanupData: {
    requiresSelection: boolean
    currentUsage: {
      files: number
      charts: number
      dashboards: number
    }
    newPlanLimits: {
      maxFiles: number
      maxCharts: number
      maxDashboards: number
    }
    toDelete: {
      files: number
      charts: number
      dashboards: number
    }
    resources: {
      files: Array<{ id: string; filename: string; originalName: string; size: number; createdAt: string }>
      charts: Array<{ id: string; name: string; type: string; createdAt: string }>
      dashboards: Array<{ id: string; name: string; description?: string; _count: { charts: number }; createdAt: string }>
    }
  }
  planName: string
  onConfirm: (selectedResources: {
    fileIds: string[]
    chartIds: string[]
    dashboardIds: string[]
  }) => void
  isLoading?: boolean
}

export function ResourceCleanupModal({
  open,
  onOpenChange,
  cleanupData,
  planName,
  onConfirm,
  isLoading = false,
}: ResourceCleanupModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [selectedCharts, setSelectedCharts] = useState<Set<string>>(new Set())
  const [selectedDashboards, setSelectedDashboards] = useState<Set<string>>(new Set())

  // Reset selections when modal opens
  useEffect(() => {
    if (open) {
      setSelectedFiles(new Set())
      setSelectedCharts(new Set())
      setSelectedDashboards(new Set())
    }
  }, [open])

  const toggleFile = (id: string) => {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleChart = (id: string) => {
    setSelectedCharts((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleDashboard = (id: string) => {
    setSelectedDashboards((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const canConfirm = 
    selectedFiles.size >= cleanupData.toDelete.files &&
    selectedCharts.size >= cleanupData.toDelete.charts &&
    selectedDashboards.size >= cleanupData.toDelete.dashboards

  const handleConfirm = () => {
    onConfirm({
      fileIds: Array.from(selectedFiles),
      chartIds: Array.from(selectedCharts),
      dashboardIds: Array.from(selectedDashboards),
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Selectează resursele pentru ștergere</DialogTitle>
          <DialogDescription>
            Pentru a face downgrade la planul <strong>{planName}</strong>, trebuie să ștergi resurse care depășesc limitele noului plan.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Atenție</AlertTitle>
          <AlertDescription>
            Această acțiune este permanentă. Resursele selectate vor fi șterse definitiv.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-3 gap-4 py-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{cleanupData.toDelete.files}</div>
            <div className="text-sm text-muted-foreground">fișiere de șters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{cleanupData.toDelete.charts}</div>
            <div className="text-sm text-muted-foreground">grafice de șters</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-destructive">{cleanupData.toDelete.dashboards}</div>
            <div className="text-sm text-muted-foreground">dashboard-uri de șters</div>
          </div>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-6">
            {/* Files Section */}
            {cleanupData.resources.files.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <File className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold">
                    Fișiere ({selectedFiles.size}/{cleanupData.toDelete.files} selectate)
                  </h3>
                </div>
                <div className="space-y-2">
                  {cleanupData.resources.files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => toggleFile(file.id)}
                    >
                      <Checkbox
                        checked={selectedFiles.has(file.id)}
                        onCheckedChange={() => toggleFile(file.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{file.originalName}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Charts Section */}
            {cleanupData.resources.charts.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <BarChart3 className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold">
                    Grafice ({selectedCharts.size}/{cleanupData.toDelete.charts} selectate)
                  </h3>
                </div>
                <div className="space-y-2">
                  {cleanupData.resources.charts.map((chart) => (
                    <div
                      key={chart.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => toggleChart(chart.id)}
                    >
                      <Checkbox
                        checked={selectedCharts.has(chart.id)}
                        onCheckedChange={() => toggleChart(chart.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{chart.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {chart.type} • {formatDate(chart.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Dashboards Section */}
            {cleanupData.resources.dashboards.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LayoutDashboard className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold">
                    Dashboard-uri ({selectedDashboards.size}/{cleanupData.toDelete.dashboards} selectate)
                  </h3>
                </div>
                <div className="space-y-2">
                  {cleanupData.resources.dashboards.map((dashboard) => (
                    <div
                      key={dashboard.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => toggleDashboard(dashboard.id)}
                    >
                      <Checkbox
                        checked={selectedDashboards.has(dashboard.id)}
                        onCheckedChange={() => toggleDashboard(dashboard.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{dashboard.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dashboard._count.charts} grafice • {formatDate(dashboard.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Anulează
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!canConfirm || isLoading}
          >
            {isLoading ? "Se procesează..." : "Șterge și continuă"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
