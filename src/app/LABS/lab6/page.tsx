"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"
import Link from "next/link"
import { LayoutDashboard, Plus, List, GitBranch } from "lucide-react"

export default function Lab6Page() {
  const advancedConcepts = [
    {
      title: "Nested Resources",
      icon: "🪆",
      description: "Dashboard → Charts relationship",
      features: ["One-to-many associations", "Cascade operations", "Foreign key constraints"],
      color: "from-rose-500 to-rose-700"
    },
    {
      title: "Advanced Routing",
      icon: "🛣️",
      description: "RESTful nested endpoint patterns",
      features: ["/dashboards/:id/charts", "Dynamic route params", "Query string filters"],
      color: "from-pink-500 to-pink-700"
    },
    {
      title: "State Management",
      icon: "🔄",
      description: "Complex data synchronization",
      features: ["Parent-child state sync", "Optimistic updates", "Cache invalidation"],
      color: "from-red-500 to-red-700"
    }
  ]

  const dashboardEndpoints = [
    { method: "GET", path: "/api/dashboards", desc: "List all dashboards", scope: "Parent resource" },
    { method: "POST", path: "/api/dashboards", desc: "Create new dashboard", scope: "Parent resource" },
    { method: "GET", path: "/api/dashboards/:id", desc: "Get dashboard details", scope: "Single parent" },
    { method: "GET", path: "/api/dashboards/:id/charts", desc: "Get charts in dashboard", scope: "Nested children" },
    { method: "POST", path: "/api/dashboards/:id/charts", desc: "Add chart to dashboard", scope: "Nested children" },
    { method: "DELETE", path: "/api/dashboards/:id", desc: "Delete dashboard (cascade)", scope: "Parent + children" },
  ]

  const relationshipPatterns = [
    {
      pattern: "One-to-Many",
      example: "1 Dashboard → N Charts",
      implementation: "dashboard_id foreign key in charts table"
    },
    {
      pattern: "Cascade Delete",
      example: "Delete dashboard → Delete all charts",
      implementation: "ON DELETE CASCADE constraint"
    },
    {
      pattern: "Lazy Loading",
      example: "Load charts only when dashboard is opened",
      implementation: "Separate API call for /dashboards/:id/charts"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-slate-900 dark:to-rose-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 6</Badge>
              <h1 className="text-4xl font-bold">Advanced MVC & Nested Resources</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Complex relationships with Dashboards and Charts management
            </p>
          </div>

          {/* Advanced Concepts */}
          <div className="grid md:grid-cols-3 gap-6">
            {advancedConcepts.map((concept, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{concept.icon}</span>
                    {concept.title}
                  </CardTitle>
                  <CardDescription>{concept.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm text-muted-foreground">Features:</h4>
                    {concept.features.map((feature, i) => (
                      <div key={i} className="text-sm p-2 bg-muted/50 rounded flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5 text-xs">✓</Badge>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* API Endpoints */}
          <Card>
            <CardHeader>
              <CardTitle>Nested RESTful Endpoints</CardTitle>
              <CardDescription>Parent-child resource management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {dashboardEndpoints.map((endpoint, idx) => {
                  const colors: Record<string, string> = {
                    GET: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                    POST: "bg-green-500/10 text-green-700 dark:text-green-300",
                    PATCH: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
                    DELETE: "bg-red-500/10 text-red-700 dark:text-red-300"
                  }
                  return (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <Badge className={`font-mono text-xs px-3 ${colors[endpoint.method]}`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono flex-1">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground">{endpoint.desc}</span>
                        <Badge variant="outline" className="text-xs">{endpoint.scope}</Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Relationship Patterns */}
          <Card>
            <CardHeader>
              <CardTitle>Database Relationship Patterns</CardTitle>
              <CardDescription>Understanding parent-child associations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {relationshipPatterns.map((rel, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-accent/30">
                    <div className="flex items-center gap-2 mb-3">
                      <GitBranch className="h-5 w-5 text-rose-600" />
                      <h4 className="font-bold">{rel.pattern}</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Example:</span>
                        <p className="font-mono text-xs bg-muted p-2 rounded mt-1">{rel.example}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Implementation:</span>
                        <p className="text-xs bg-muted p-2 rounded mt-1">{rel.implementation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demos */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demonstrations</CardTitle>
              <CardDescription>Test advanced MVC patterns with live dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/dashboard">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-rose-500/10 rounded-lg group-hover:bg-rose-500/20 transition-colors">
                        <List className="h-6 w-6 text-rose-600" />
                      </div>
                      <h3 className="text-xl font-bold">View All Dashboards</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse dashboards and their nested charts with GET endpoints
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Open Demo</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                        <Plus className="h-6 w-6 text-pink-600" />
                      </div>
                      <h3 className="text-xl font-bold">Explore Dashboards</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and manage dashboards with nested charts
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Open Demo</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Implementation Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Implementation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-rose-500 bg-rose-500/5 rounded">
                  <h4 className="font-bold mb-2">📁 Nested Structure</h4>
                  <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`labs_api/
├── models/
│   ├── Dashboard (parent)
│   └── Chart (child with dashboard_id FK)
├── controllers/
│   ├── dashboardController.js
│   └── chartController.js
├── routes/
│   ├── dashboards.js (parent routes)
│   └── charts.js (nested routes)
└── server.js

src/app/LABS/lab6/
├── dashboards/
│   ├── page.tsx (List view)
│   ├── create/
│   │   └── page.tsx (Create form)
│   └── [id]/
│       └── page.tsx (Details + nested charts)`}
                  </pre>
                </div>

                <div className="p-4 border-l-4 border-pink-500 bg-pink-500/5 rounded">
                  <h4 className="font-bold mb-2">🔄 Nested Request Flow</h4>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-background rounded">
                      <span className="font-semibold">1. Parent Request:</span> GET /api/dashboards/123
                      <div className="ml-4 mt-1 text-muted-foreground">→ Returns dashboard metadata</div>
                    </div>
                    <div className="p-2 bg-background rounded">
                      <span className="font-semibold">2. Child Request:</span> GET /api/dashboards/123/charts
                      <div className="ml-4 mt-1 text-muted-foreground">→ Returns all charts where dashboard_id = 123</div>
                    </div>
                    <div className="p-2 bg-background rounded">
                      <span className="font-semibold">3. Nested Create:</span> POST /api/dashboards/123/charts
                      <div className="ml-4 mt-1 text-muted-foreground">→ Automatically sets dashboard_id = 123</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-red-500 bg-red-500/5 rounded">
                  <h4 className="font-bold mb-2">💡 Advanced Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Cascade delete: Removing dashboard deletes all associated charts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Foreign key validation: Charts must reference existing dashboards</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Eager vs lazy loading: Optimized queries with Prisma include/select</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Transaction support: Atomic operations for complex updates</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}