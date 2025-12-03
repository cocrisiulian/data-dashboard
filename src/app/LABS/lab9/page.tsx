"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { Trash2, Archive, RotateCcw, AlertTriangle, CheckCircle, Database, Code, GitBranch } from "lucide-react"

export default function Lab9Page() {
  const [selectedEntity, setSelectedEntity] = useState<"user" | "file" | "plan" | "chart">("file")

  const deletionComparison = [
    {
      aspect: "Database Operation",
      hardDelete: "DELETE FROM table WHERE id = ?",
      softDelete: "UPDATE table SET is_deleted = true WHERE id = ?"
    },
    {
      aspect: "Data Retention",
      hardDelete: "Data permanently removed",
      softDelete: "Data marked as deleted but retained"
    },
    {
      aspect: "Recovery",
      hardDelete: "Impossible (unless backup exists)",
      softDelete: "Easy restoration with UPDATE"
    },
    {
      aspect: "Foreign Keys",
      hardDelete: "Cascade delete or constraint error",
      softDelete: "References preserved"
    },
    {
      aspect: "Performance",
      hardDelete: "Better (less data to query)",
      softDelete: "Requires WHERE is_deleted = false"
    },
    {
      aspect: "Audit Trail",
      hardDelete: "History lost",
      softDelete: "Complete history preserved"
    },
    {
      aspect: "Storage",
      hardDelete: "Space freed immediately",
      softDelete: "Space used until cleanup"
    },
    {
      aspect: "Use Case",
      hardDelete: "Leaf entities, cleanup tasks",
      softDelete: "Critical data, referenced entities"
    }
  ]

  const entityStrategies = {
    user: {
      type: "Soft Delete",
      reason: "Users are referenced in files, dashboards, usage_logs. Deleting would lose all historical data.",
      implementation: "isDeleted + deletedAt columns",
      icon: "👤",
      color: "blue"
    },
    file: {
      type: "Soft Delete",
      reason: "Files are referenced in charts. Soft delete preserves chart history and allows recovery.",
      implementation: "isDeleted + deletedAt columns",
      icon: "📁",
      color: "green"
    },
    plan: {
      type: "Hard Delete (with validation)",
      reason: "Plans can be deleted if no users exist. Requires validation before deletion.",
      implementation: "Check user count, then DELETE",
      icon: "💳",
      color: "purple"
    },
    chart: {
      type: "Hard Delete",
      reason: "Charts are leaf entities with no dependencies. Safe to delete permanently.",
      implementation: "Direct DELETE operation",
      icon: "📊",
      color: "orange"
    }
  }

  const softDeleteFlow = [
    { step: 1, action: "User clicks Delete", result: "DELETE request sent to API" },
    { step: 2, action: "Controller receives request", result: "Verify ownership and permissions" },
    { step: 3, action: "Execute soft delete", result: "UPDATE SET is_deleted=true, deleted_at=NOW()" },
    { step: 4, action: "Return success", result: "User sees 'Deleted' confirmation" },
    { step: 5, action: "Future queries", result: "WHERE is_deleted=false filters out deleted records" }
  ]

  const hardDeleteFlow = [
    { step: 1, action: "User clicks Delete", result: "DELETE request sent to API" },
    { step: 2, action: "Controller receives request", result: "Verify ownership and permissions" },
    { step: 3, action: "Check dependencies", result: "Validate no FK constraints violated" },
    { step: 4, action: "Execute hard delete", result: "DELETE FROM table WHERE id=?" },
    { step: 5, action: "Return success", result: "Data permanently removed from database" }
  ]

  const codeExamples = {
    softDelete: {
      schema: `model File {
  id          String    @id @default(uuid())
  fileName    String
  userId      String
  uploadedAt  DateTime  @default(now())
  
  // ✨ Soft Delete Columns
  isDeleted   Boolean   @default(false)
  deletedAt   DateTime?
  
  @@index([isDeleted])
}`,
      controller: `// Soft Delete Implementation
exports.softDeleteFile = async (req, res) => {
  const { id } = req.params;
  
  // Update instead of delete
  const deletedFile = await prisma.file.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  });
  
  res.json({ 
    success: true, 
    message: 'File deleted' 
  });
};`,
      query: `// Get all active files (exclude soft deleted)
const files = await prisma.file.findMany({
  where: {
    userId: currentUser.id,
    isDeleted: false  // ← Filter deleted records
  }
});`,
      restore: `// Restore soft deleted file
exports.restoreFile = async (req, res) => {
  const { id } = req.params;
  
  await prisma.file.update({
    where: { id },
    data: {
      isDeleted: false,
      deletedAt: null
    }
  });
  
  res.json({ message: 'File restored' });
};`
    },
    hardDelete: {
      schema: `model Plan {
  id            String   @id @default(uuid())
  name          String   @unique
  maxFiles      Int
  price         Decimal
  
  users         User[]
  
  // NO soft delete columns
  // Uses hard delete with validation
}`,
      controller: `// Hard Delete with Validation
exports.hardDeletePlan = async (req, res) => {
  const { id } = req.params;
  
  // Check if any users exist on this plan
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } }
  });
  
  if (plan._count.users > 0) {
    return res.status(409).json({
      error: \`Cannot delete. \${plan._count.users} users on this plan.\`
    });
  }
  
  // Permanently delete
  await prisma.plan.delete({ where: { id } });
  
  res.json({ message: 'Plan deleted permanently' });
};`,
      query: `// Get all plans (no soft delete filter needed)
const plans = await prisma.plan.findMany({
  orderBy: { price: 'asc' }
});`,
      cascade: `// Hard delete chart (leaf entity)
exports.hardDeleteChart = async (req, res) => {
  const { id } = req.params;
  
  // No validation needed - charts are leaf entities
  await prisma.chart.delete({ where: { id } });
  
  res.json({ message: 'Chart deleted permanently' });
};`
    }
  }

  const bestPractices = [
    {
      title: "Use Soft Delete for Critical Entities",
      description: "Users, financial records, audit data should always use soft delete",
      icon: <Archive className="w-5 h-5 text-blue-500" />
    },
    {
      title: "Add Indexes on isDeleted",
      description: "Index the is_deleted column for query performance",
      icon: <Database className="w-5 h-5 text-green-500" />
    },
    {
      title: "Filter All Queries",
      description: "Always add WHERE is_deleted = false to GET queries",
      icon: <Code className="w-5 h-5 text-purple-500" />
    },
    {
      title: "Implement Restore Functionality",
      description: "Provide UI for users to restore accidentally deleted items",
      icon: <RotateCcw className="w-5 h-5 text-orange-500" />
    },
    {
      title: "Schedule Cleanup Jobs",
      description: "Periodically hard delete soft-deleted records older than X days",
      icon: <Trash2 className="w-5 h-5 text-red-500" />
    },
    {
      title: "Validate Hard Deletes",
      description: "Check foreign key constraints before hard deleting",
      icon: <AlertTriangle className="w-5 h-5 text-yellow-500" />
    }
  ]

  const migrationSteps = [
    {
      step: 1,
      title: "Add Columns to Schema",
      code: "ALTER TABLE users ADD COLUMN is_deleted BOOLEAN DEFAULT false;\nALTER TABLE users ADD COLUMN deleted_at TIMESTAMPTZ;",
      description: "Add soft delete columns to tables"
    },
    {
      step: 2,
      title: "Create Indexes",
      code: "CREATE INDEX idx_users_is_deleted ON users(is_deleted);",
      description: "Add indexes for query performance"
    },
    {
      step: 3,
      title: "Update Controllers",
      code: "// Before\nawait prisma.user.delete({ where: { id } });\n\n// After\nawait prisma.user.update({\n  where: { id },\n  data: { isDeleted: true, deletedAt: new Date() }\n});",
      description: "Convert DELETE to UPDATE operations"
    },
    {
      step: 4,
      title: "Update Queries",
      code: "// Add filter to all queries\nwhere: {\n  userId: currentUser.id,\n  isDeleted: false  // ← Add this\n}",
      description: "Filter out soft-deleted records"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 9</Badge>
              <h1 className="text-4xl font-bold">Ștergere Fizică și Logică</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Hard Delete vs Soft Delete - Strategii de ștergere a datelor în aplicații web
            </p>
          </div>

          {/* Objectives */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-500" />
                Obiective Laborator
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Trash2 className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold">1. Ștergere Fizică (Hard Delete)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Implementare ștergere completă din baza de date pentru entități fără dependențe
                </p>
              </div>
              <div className="p-4 border-l-4 border-purple-500 bg-purple-500/5 rounded">
                <div className="flex items-center gap-2 mb-2">
                  <Archive className="w-5 h-5 text-purple-500" />
                  <h3 className="font-bold">2. Ștergere Logică (Soft Delete)</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Marcare entități ca șterse păstrând istoricul și posibilitatea de recuperare
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs defaultValue="comparison" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="comparison">Comparație</TabsTrigger>
              <TabsTrigger value="strategies">Strategii</TabsTrigger>
              <TabsTrigger value="implementation">Implementare</TabsTrigger>
              <TabsTrigger value="code">Cod</TabsTrigger>
              <TabsTrigger value="migration">Migrare</TabsTrigger>
            </TabsList>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hard Delete vs Soft Delete</CardTitle>
                  <CardDescription>Comparație detaliată între cele două tipuri de ștergere</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-bold">Aspect</th>
                          <th className="text-left p-3 font-bold text-red-600">Hard Delete</th>
                          <th className="text-left p-3 font-bold text-blue-600">Soft Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deletionComparison.map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="p-3 font-semibold">{row.aspect}</td>
                            <td className="p-3 text-muted-foreground">{row.hardDelete}</td>
                            <td className="p-3 text-muted-foreground">{row.softDelete}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      Hard Delete Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hardDeleteFlow.map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <Badge className="w-8 h-8 flex items-center justify-center shrink-0">{item.step}</Badge>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{item.action}</div>
                          <div className="text-xs text-muted-foreground">{item.result}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-blue-500" />
                      Soft Delete Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {softDeleteFlow.map((item) => (
                      <div key={item.step} className="flex gap-3">
                        <Badge variant="outline" className="w-8 h-8 flex items-center justify-center shrink-0">{item.step}</Badge>
                        <div className="flex-1">
                          <div className="font-semibold text-sm">{item.action}</div>
                          <div className="text-xs text-muted-foreground">{item.result}</div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Strategies Tab */}
            <TabsContent value="strategies" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Strategii de Ștergere per Entitate</CardTitle>
                  <CardDescription>Fiecare entitate folosește strategia potrivită bazată pe dependențe</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(entityStrategies).map(([key, strategy]) => (
                    <div
                      key={key}
                      className={`p-4 border-l-4 border-${strategy.color}-500 bg-${strategy.color}-500/5 rounded cursor-pointer transition-all ${
                        selectedEntity === key ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedEntity(key as any)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{strategy.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold capitalize">{key}</h3>
                            <Badge variant={strategy.type.includes("Hard") ? "destructive" : "default"}>
                              {strategy.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{strategy.reason}</p>
                          <div className="text-xs font-mono bg-background p-2 rounded">
                            {strategy.implementation}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Regulă generală:</strong> Folosește Soft Delete pentru entități care sunt folosite ca FK în alte tabele.
                  Folosește Hard Delete pentru entități fără dependențe (leaf nodes).
                </AlertDescription>
              </Alert>
            </TabsContent>

            {/* Implementation Tab */}
            <TabsContent value="implementation" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Archive className="w-5 h-5 text-blue-500" />
                      Soft Delete Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                      {codeExamples.softDelete.schema}
                    </pre>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>isDeleted: Boolean flag</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>deletedAt: Timestamp when deleted</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Index for query performance</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trash2 className="w-5 h-5 text-red-500" />
                      Hard Delete Schema
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                      {codeExamples.hardDelete.schema}
                    </pre>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>No soft delete columns needed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>Direct DELETE operations</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                        <span>Requires validation before delete</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Best Practices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {bestPractices.map((practice, idx) => (
                      <div key={idx} className="flex gap-3 p-3 border rounded">
                        {practice.icon}
                        <div>
                          <div className="font-semibold text-sm">{practice.title}</div>
                          <div className="text-xs text-muted-foreground">{practice.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Code Tab */}
            <TabsContent value="code" className="space-y-6">
              <Tabs defaultValue="soft" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="soft">Soft Delete</TabsTrigger>
                  <TabsTrigger value="hard">Hard Delete</TabsTrigger>
                </TabsList>

                <TabsContent value="soft" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Controller - Soft Delete</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.softDelete.controller}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Query - Filter Deleted Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.softDelete.query}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Restore Functionality</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.softDelete.restore}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="hard" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Controller - Hard Delete with Validation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.hardDelete.controller}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Query - No Filters Needed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.hardDelete.query}
                      </pre>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Cascade Delete - Leaf Entity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto">
                        {codeExamples.hardDelete.cascade}
                      </pre>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Migration Tab */}
            <TabsContent value="migration" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pași Migrare către Soft Delete</CardTitle>
                  <CardDescription>Cum să implementezi soft delete într-o aplicație existentă</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {migrationSteps.map((step) => (
                    <div key={step.step} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge className="w-10 h-10 flex items-center justify-center text-lg">{step.step}</Badge>
                        <div>
                          <h3 className="font-bold">{step.title}</h3>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                      <pre className="text-xs bg-slate-950 text-slate-50 p-4 rounded overflow-x-auto ml-13">
                        {step.code}
                      </pre>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Alert>
                <Database className="h-4 w-4" />
                <AlertDescription>
                  <strong>Atenție:</strong> După migrare, testează toate query-urile pentru a asigura că filtrează corect
                  înregistrările șterse. Verifică și relațiile între entități.
                </AlertDescription>
              </Alert>
            </TabsContent>
          </Tabs>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Resurse și Documentație</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <a
                  href="https://www.becomebetterprogrammer.com/soft-delete-vs-hard-delete/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="font-semibold mb-2">📚 Soft vs Hard Delete Guide</div>
                  <div className="text-xs text-muted-foreground">Comprehensive comparison and best practices</div>
                </a>
                <a
                  href="https://www.martyfriedel.com/blog/deleting-data-soft-hard-or-audit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="font-semibold mb-2">🔍 Audit Trail Considerations</div>
                  <div className="text-xs text-muted-foreground">How deletion affects audit logs</div>
                </a>
                <a
                  href="https://abstraction.blog/2015/06/28/soft-vs-hard-delete"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border rounded hover:bg-muted/50 transition-colors"
                >
                  <div className="font-semibold mb-2">💡 Implementation Patterns</div>
                  <div className="text-xs text-muted-foreground">Real-world implementation examples</div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
