"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"

export default function Lab2Page() {
  const architectureLayers = [
    {
      name: "Presentation Layer",
      component: "Next.js React App",
      tech: ["React 19", "Next.js 15", "TypeScript", "Tailwind CSS"],
      responsibilities: [
        "User interface rendering",
        "Client-side routing",
        "Form handling and validation",
        "API calls to backend",
        "State management"
      ]
    },
    {
      name: "API Layer",
      component: "Express REST API",
      tech: ["Express.js 4.21", "Node.js", "JWT Auth", "Multer"],
      responsibilities: [
        "HTTP request handling",
        "Authentication & authorization",
        "Business logic execution",
        "File upload processing",
        "Response formatting"
      ]
    },
    {
      name: "Data Layer",
      component: "PostgreSQL Database",
      tech: ["PostgreSQL", "Prisma ORM 6.18", "Row-Level Security"],
      responsibilities: [
        "Data persistence",
        "Transaction management",
        "Query optimization",
        "Data integrity enforcement",
        "Audit logging"
      ]
    }
  ]

  const apiEndpoints = [
    { group: "Authentication", path: "/api/auth/*", methods: ["POST /register", "POST /login", "GET /me"] },
    { group: "Dashboards", path: "/api/dashboards/*", methods: ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"] },
    { group: "Charts", path: "/api/charts/*", methods: ["GET /", "GET /:id", "POST /", "PATCH /:id", "DELETE /:id"] },
    { group: "Files", path: "/api/files/*", methods: ["GET /", "GET /:id", "POST /upload", "DELETE /:id"] },
    { group: "Plans", path: "/api/plans/*", methods: ["GET /"] },
  ]

  const dataFlow = [
    {
      step: 1,
      title: "User Action",
      description: "User interacts with UI (e.g., upload CSV, create chart)",
      component: "React Component"
    },
    {
      step: 2,
      title: "API Request",
      description: "Axios client sends authenticated HTTP request",
      component: "API Client (src/lib/api/client.ts)"
    },
    {
      step: 3,
      title: "Route Handling",
      description: "Express router matches endpoint and applies middleware",
      component: "Express Router"
    },
    {
      step: 4,
      title: "Authentication",
      description: "JWT token validation and user identification",
      component: "Auth Middleware"
    },
    {
      step: 5,
      title: "Business Logic",
      description: "Controller processes request, validates input",
      component: "Controller"
    },
    {
      step: 6,
      title: "Database Query",
      description: "Prisma ORM executes SQL query with RLS",
      component: "Prisma Client"
    },
    {
      step: 7,
      title: "Response",
      description: "JSON data returned through middleware chain",
      component: "Express Response"
    },
    {
      step: 8,
      title: "UI Update",
      description: "React state updated, component re-renders",
      component: "React State"
    }
  ]

  const securityFeatures = [
    { feature: "JWT Authentication", description: "Stateless token-based auth with 7-day expiry", status: "Implemented" },
    { feature: "Password Hashing", description: "Bcrypt with salt rounds for secure password storage", status: "Implemented" },
    { feature: "Row-Level Security", description: "PostgreSQL RLS policies enforce data isolation", status: "Implemented" },
    { feature: "Ownership Validation", description: "Controllers verify user owns resource before CRUD", status: "Implemented" },
    { feature: "CORS Protection", description: "Cross-origin request configuration", status: "Implemented" },
    { feature: "Input Validation", description: "Request body validation in controllers", status: "Implemented" },
  ]

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 2</Badge>
              <h1 className="text-4xl font-bold">System Architecture & Database Creation</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Three-tier architecture with client-server pattern and RESTful API
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="architecture" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="architecture">Architecture</TabsTrigger>
              <TabsTrigger value="api">API Design</TabsTrigger>
              <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            {/* Architecture Tab */}
            <TabsContent value="architecture" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Three-Tier Architecture</CardTitle>
                  <CardDescription>Layered architecture with clear separation of concerns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {architectureLayers.map((layer, idx) => (
                      <div key={idx} className="relative">
                        {idx > 0 && (
                          <div className="absolute left-1/2 -top-3 transform -translate-x-1/2 text-2xl">
                            ↓
                          </div>
                        )}
                        <div className="p-6 border-2 rounded-lg bg-card">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <Badge className="mb-2">{layer.name}</Badge>
                              <h3 className="text-xl font-bold">{layer.component}</h3>
                            </div>
                            <div className="flex gap-2 flex-wrap justify-end">
                              {layer.tech.map((tech, i) => (
                                <Badge key={i} variant="secondary">{tech}</Badge>
                              ))}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2 text-sm text-muted-foreground">Responsibilities</h4>
                              <ul className="space-y-1">
                                {layer.responsibilities.map((resp, i) => (
                                  <li key={i} className="text-sm flex items-start gap-2">
                                    <span className="text-primary">•</span>
                                    <span>{resp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Pattern</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Frontend → Backend</h4>
                      <p className="text-sm text-muted-foreground">HTTP/HTTPS REST API calls with JSON payloads</p>
                      <code className="text-xs bg-background px-2 py-1 rounded mt-2 block">axios.post('/api/charts', data)</code>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Backend → Database</h4>
                      <p className="text-sm text-muted-foreground">Prisma ORM with type-safe queries</p>
                      <code className="text-xs bg-background px-2 py-1 rounded mt-2 block">prisma.chart.create()</code>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">Authentication</h4>
                      <p className="text-sm text-muted-foreground">JWT bearer tokens in Authorization header</p>
                      <code className="text-xs bg-background px-2 py-1 rounded mt-2 block">Bearer eyJhbGc...</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* API Design Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>RESTful API Endpoints</CardTitle>
                  <CardDescription>Resource-oriented URL design with standard HTTP methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {apiEndpoints.map((endpoint, idx) => (
                      <div key={idx} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-bold text-lg">{endpoint.group}</h3>
                          <code className="text-sm bg-muted px-3 py-1 rounded">{endpoint.path}</code>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {endpoint.methods.map((method, i) => {
                            const [httpMethod, path] = method.split(' ')
                            const colors: Record<string, string> = {
                              GET: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                              POST: "bg-green-500/10 text-green-700 dark:text-green-300",
                              PATCH: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-300",
                              DELETE: "bg-red-500/10 text-red-700 dark:text-red-300"
                            }
                            return (
                              <code key={i} className={`text-xs px-2 py-1 rounded font-mono ${colors[httpMethod]}`}>
                                {method}
                              </code>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`POST /api/charts
Headers:
  Authorization: Bearer <JWT_TOKEN>
  Content-Type: application/json

Body:
{
  "dashboardId": "uuid",
  "fileId": "uuid",
  "chartType": "line",
  "title": "Sales Trend",
  "chartConfig": {
    "xAxis": "date",
    "yAxis": "revenue"
  }
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Response Format</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "chart-uuid",
  "dashboardId": "dashboard-uuid",
  "fileId": "file-uuid",
  "chartType": "line",
  "title": "Sales Trend",
  "chartConfig": {...},
  "createdAt": "2024-01-15T10:30:00Z",
  "dashboard": {...},
  "file": {...}
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Data Flow Tab */}
            <TabsContent value="dataflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request-Response Cycle</CardTitle>
                  <CardDescription>End-to-end data flow from user action to UI update</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dataFlow.map((step, idx) => (
                      <div key={idx} className="relative">
                        {idx < dataFlow.length - 1 && (
                          <div className="absolute left-6 top-12 h-full w-0.5 bg-gradient-to-b from-primary to-primary/20"></div>
                        )}
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold z-10">
                            {step.step}
                          </div>
                          <div className="flex-1 pb-8">
                            <h3 className="font-bold text-lg mb-1">{step.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                            <Badge variant="outline">{step.component}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Example: Creating a Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-blue-500/10 border-l-4 border-blue-500 rounded">
                      <div className="font-semibold text-sm">Client Side</div>
                      <code className="text-xs">api.charts.create(dashboardId, chartData)</code>
                    </div>
                    <div className="text-center text-muted-foreground">↓ HTTP POST</div>
                    <div className="p-3 bg-green-500/10 border-l-4 border-green-500 rounded">
                      <div className="font-semibold text-sm">Server Side</div>
                      <code className="text-xs">chartController.createChart(req, res)</code>
                    </div>
                    <div className="text-center text-muted-foreground">↓ Prisma Query</div>
                    <div className="p-3 bg-purple-500/10 border-l-4 border-purple-500 rounded">
                      <div className="font-semibold text-sm">Database</div>
                      <code className="text-xs">INSERT INTO charts (...) VALUES (...)</code>
                    </div>
                    <div className="text-center text-muted-foreground">↑ JSON Response</div>
                    <div className="p-3 bg-orange-500/10 border-l-4 border-orange-500 rounded">
                      <div className="font-semibold text-sm">Client Update</div>
                      <code className="text-xs">setState(newChart); toast.success()</code>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Features</CardTitle>
                  <CardDescription>Multi-layer security implementation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {securityFeatures.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-20">
                          <Badge variant="secondary" className="w-full justify-center">
                            {item.status}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{item.feature}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Flow</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="space-y-3">
                      <li className="flex gap-3">
                        <Badge>1</Badge>
                        <div>
                          <div className="font-semibold text-sm">User Login</div>
                          <div className="text-xs text-muted-foreground">POST /api/auth/login with credentials</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <Badge>2</Badge>
                        <div>
                          <div className="font-semibold text-sm">Password Verification</div>
                          <div className="text-xs text-muted-foreground">Bcrypt compares hashed password</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <Badge>3</Badge>
                        <div>
                          <div className="font-semibold text-sm">JWT Generation</div>
                          <div className="text-xs text-muted-foreground">Sign token with user id, email (7d exp)</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <Badge>4</Badge>
                        <div>
                          <div className="font-semibold text-sm">Client Storage</div>
                          <div className="text-xs text-muted-foreground">Store token in localStorage</div>
                        </div>
                      </li>
                      <li className="flex gap-3">
                        <Badge>5</Badge>
                        <div>
                          <div className="font-semibold text-sm">Authenticated Requests</div>
                          <div className="text-xs text-muted-foreground">Include Bearer token in header</div>
                        </div>
                      </li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Row-Level Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-muted/50 rounded">
                        <div className="font-semibold text-sm mb-2">Policy: User Data Isolation</div>
                        <pre className="text-xs overflow-x-auto">
{`CREATE POLICY "users_select"
ON users FOR SELECT
USING (auth.uid() = id);`}
                        </pre>
                      </div>
                      <div className="p-3 bg-muted/50 rounded">
                        <div className="font-semibold text-sm mb-2">Policy: Dashboard Ownership</div>
                        <pre className="text-xs overflow-x-auto">
{`CREATE POLICY "dashboards_crud"
ON dashboards
USING (auth.uid() = user_id);`}
                        </pre>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        <strong>Note:</strong> All user data tables have RLS policies ensuring users can only access their own records.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
