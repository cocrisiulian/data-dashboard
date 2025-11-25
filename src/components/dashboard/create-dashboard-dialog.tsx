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
import { Textarea } from "@/components/ui/controls/textarea"
import { Plus } from "lucide-react"
import { api } from "@/lib/api/client"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"

export function CreateDashboardDialog({ onDashboardCreated }: { onDashboardCreated?: () => void }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await api.dashboards.create({ name, description })
      setOpen(false)
      setName("")
      setDescription("")
      onDashboardCreated?.()
    } catch (err: any) {
      setError(err.message || "Failed to create dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Dashboard</DialogTitle>
            <DialogDescription>Create a new dashboard to organize your data visualizations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Dashboard Name</Label>
              <Input
                id="name"
                placeholder="Sales Dashboard"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Track monthly sales performance..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Dashboard"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
