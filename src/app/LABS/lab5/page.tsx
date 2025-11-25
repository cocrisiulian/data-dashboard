"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"
import { Button } from "@/components/ui/controls/button"
import Link from "next/link"
import { Database, Plus, List, Code } from "lucide-react"

export default function Lab5Page() {
  const mvcConcepts = [
    {
      title: "Model",
      icon: "🗄️",
      description: "Data layer representing business entities",
      examples: ["Plan.js (Prisma model)", "User.js", "File.js"],
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "View",
      icon: "👁️",
      description: "Presentation layer with React components",
      examples: ["Plans list page", "Create plan form", "Plan details"],
      color: "from-green-500 to-green-700"
    },
    {
      title: "Controller",
      icon: "⚙️",
      description: "Business logic handling requests",
      examples: ["planController.js", "getAllPlans()", "createPlan()"],
      color: "from-purple-500 to-purple-700"
    }
  ]

  const apiEndpoints = [
    { method: "GET", path: "/api/plans", desc: "Retrieve all subscription plans", demo: "/LABS/lab5/plans" },
    { method: "GET", path: "/api/plans/:id", desc: "Get specific plan details", demo: "/LABS/lab5/plans" },
    { method: "POST", path: "/api/plans", desc: "Create new subscription plan", demo: "/LABS/lab5/plans/create" },
    { method: "PATCH", path: "/api/plans/:id", desc: "Update existing plan", demo: "/LABS/lab5/plans" },
    { method: "DELETE", path: "/api/plans/:id", desc: "Delete a plan", demo: "/LABS/lab5/plans" },
  ]

  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-slate-900 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 5</Badge>
              <h1 className="text-4xl font-bold">MVC Pattern & Plans CRUD</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Model-View-Controller architecture with subscription plans management
            </p>
          </div>

          {/* MVC Concepts */}
          <div className="grid md:grid-cols-3 gap-6">
            {mvcConcepts.map((concept, idx) => (
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
                    <h4 className="font-semibold text-sm text-muted-foreground">Examples:</h4>
                    {concept.examples.map((example, i) => (
                      <div key={i} className="text-sm p-2 bg-muted/50 rounded">
                        <code>{example}</code>
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
              <CardTitle>REST API Endpoints</CardTitle>
              <CardDescription>Full CRUD operations for subscription plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, idx) => {
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
                        <code className="text-sm font-mono">{endpoint.path}</code>
                        <span className="text-sm text-muted-foreground">{endpoint.desc}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demos */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demonstrations</CardTitle>
              <CardDescription>Test MVC pattern implementation with live examples</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/pricing">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <List className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold">View All Plans</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Browse subscription plans with GET /api/plans endpoint
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Open Demo</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>

                <Link href="/pricing">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                        <Plus className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold">View Pricing Plans</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Explore subscription tiers and pricing options
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

          {/* Implementation Details */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Architecture</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded">
                  <h4 className="font-bold mb-2">📁 File Structure</h4>
                  <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`labs_api/
├── models/
│   └── Plan (Prisma schema)
├── controllers/
│   └── planController.js
├── routes/
│   └── plans.js
└── server.js

src/app/LABS/lab5/
├── plans/
│   ├── page.tsx (View - List)
│   └── create/
│       └── page.tsx (View - Form)`}
                  </pre>
                </div>

                <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded">
                  <h4 className="font-bold mb-2">🔄 Request Flow</h4>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    <div className="p-2 bg-background rounded text-center">
                      <div className="font-semibold">Client</div>
                      <div className="text-muted-foreground">React Form</div>
                    </div>
                    <div className="flex items-center justify-center">→</div>
                    <div className="p-2 bg-background rounded text-center">
                      <div className="font-semibold">Route</div>
                      <div className="text-muted-foreground">/api/plans</div>
                    </div>
                    <div className="flex items-center justify-center">→</div>
                    <div className="p-2 bg-background rounded text-center">
                      <div className="font-semibold">Controller</div>
                      <div className="text-muted-foreground">Business Logic</div>
                    </div>
                    <div className="flex items-center justify-center">→</div>
                    <div className="p-2 bg-background rounded text-center">
                      <div className="font-semibold">Model</div>
                      <div className="text-muted-foreground">Prisma Query</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border-l-4 border-purple-500 bg-purple-500/5 rounded">
                  <h4 className="font-bold mb-2">💡 Key Features</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Separation of concerns (Model, View, Controller)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>RESTful API design with standard HTTP methods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Prisma ORM for type-safe database operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Error handling and validation in controllers</span>
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

