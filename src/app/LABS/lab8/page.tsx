"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"
import { ExternalLink, Github, Database, Globe, Zap, Shield, Clock, DollarSign } from "lucide-react"

export default function Lab8Page() {
  const objectives = [
    {
      title: "Utilizare API în Frontend",
      icon: "🔌",
      description: "Implementare interfețe web complete pentru operațiile CRUD API",
      points: [
        "File management (upload, list, delete CSV files)",
        "Chart creation from CSV data",
        "Dashboard integration with real-time data",
        "Error handling și loading states"
      ]
    },
    {
      title: "Hosting on WebServer",
      icon: "🚀",
      description: "Publicarea aplicației web pe servere de producție",
      points: [
        "Frontend deployment pe Vercel",
        "Backend API deployment pe Railway",
        "PostgreSQL database hosted pe Railway",
        "Custom domain configuration"
      ]
    }
  ]

  const deploymentStack = [
    {
      name: "Vercel",
      role: "Frontend Hosting",
      icon: <Globe className="h-5 w-5" />,
      features: ["Next.js optimized", "Auto HTTPS/SSL", "Global CDN", "Zero config"],
      url: "https://vercel.com",
      color: "from-black to-slate-700"
    },
    {
      name: "Railway",
      role: "Backend API + Database",
      icon: <Zap className="h-5 w-5" />,
      features: ["PostgreSQL included", "Auto deploy from Git", "Environment variables", "Free tier"],
      url: "https://railway.app",
      color: "from-purple-500 to-pink-600"
    },
    {
      name: "PostgreSQL",
      role: "Production Database",
      icon: <Database className="h-5 w-5" />,
      features: ["Managed by Railway", "Auto backups", "Connection pooling", "SSL encryption"],
      url: "https://www.postgresql.org",
      color: "from-blue-500 to-cyan-600"
    }
  ]

  const apiEndpoints = [
    { method: "POST", path: "/api/files/upload", description: "Upload CSV file", frontend: "/upload" },
    { method: "GET", path: "/api/files", description: "List all user files", frontend: "/files" },
    { method: "DELETE", path: "/api/files/:id", description: "Delete specific file", frontend: "/files" },
    { method: "POST", path: "/api/charts", description: "Create chart from CSV", frontend: "/dashboard/[id]" },
    { method: "GET", path: "/api/dashboards", description: "List dashboards", frontend: "/dashboard" },
  ]

  const deploymentSteps = [
    {
      phase: "Preparation",
      duration: "30 min",
      tasks: [
        "Create production environment variables",
        "Test local build (npm run build)",
        "Prepare Prisma migrations",
        "Setup GitHub repository (if not done)"
      ]
    },
    {
      phase: "Database Deployment",
      duration: "15 min",
      tasks: [
        "Create Railway account",
        "New Project → Add PostgreSQL service",
        "Copy DATABASE_URL from Railway",
        "Run Prisma migrations on production DB"
      ]
    },
    {
      phase: "Backend Deployment",
      duration: "30 min",
      tasks: [
        "Railway → Deploy from GitHub (labs_api folder)",
        "Configure environment variables (JWT_SECRET, DATABASE_URL)",
        "Deploy and verify logs",
        "Test API endpoints with Postman/curl"
      ]
    },
    {
      phase: "Frontend Deployment",
      duration: "30 min",
      tasks: [
        "Create Vercel account",
        "Import GitHub repository",
        "Configure NEXT_PUBLIC_API_URL to Railway URL",
        "Deploy and test application"
      ]
    },
    {
      phase: "Custom Domains",
      duration: "20 min",
      tasks: [
        "Configure proiect-MVC-demo.com → Vercel",
        "Configure proiect-api-demo.com → Railway",
        "Update CORS settings in backend",
        "Verify SSL certificates"
      ]
    }
  ]

  const architectureLayers = [
    { layer: "Client (Browser)", tech: "React 19 + Next.js 15", color: "bg-blue-500/10" },
    { layer: "CDN + Edge", tech: "Vercel Edge Network", color: "bg-green-500/10" },
    { layer: "API Server", tech: "Express.js on Railway", color: "bg-purple-500/10" },
    { layer: "ORM Layer", tech: "Prisma Client", color: "bg-orange-500/10" },
    { layer: "Database", tech: "PostgreSQL on Railway", color: "bg-red-500/10" },
  ]

  const comparisonFeatures = [
    { feature: "Deployment Speed", vercel: "~2 min", railway: "~3 min", vps: "~30 min" },
    { feature: "SSL Certificate", vercel: "Auto", railway: "Auto", vps: "Manual (Let's Encrypt)" },
    { feature: "Scaling", vercel: "Automatic", railway: "Automatic", vps: "Manual" },
    { feature: "Cost (Starter)", vercel: "$0/month", railway: "$5/month", vps: "$5-20/month" },
    { feature: "Maintenance", vercel: "Zero", railway: "Minimal", vps: "High" },
  ]

  return (
    <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-slate-900 dark:to-teal-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="text-lg px-4 py-1">Laboratory 8</Badge>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              API Integration & Web Deployment
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete frontend CRUD interfaces and production deployment on cloud infrastructure
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="secondary">Frontend-Backend Integration</Badge>
              <Badge variant="secondary">Cloud Deployment</Badge>
              <Badge variant="secondary">Production Ready</Badge>
            </div>
          </div>

          {/* Objectives */}
          <div className="grid md:grid-cols-2 gap-6">
            {objectives.map((obj, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-3xl">{obj.icon}</span>
                    {obj.title}
                  </CardTitle>
                  <CardDescription>{obj.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {obj.points.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Badge variant="secondary" className="mt-0.5">✓</Badge>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Deployment Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack - Production Deployment</CardTitle>
              <CardDescription>Vercel (Frontend) + Railway (Backend + Database)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {deploymentStack.map((stack, idx) => (
                  <div key={idx} className="relative group">
                    <div className={`absolute inset-0 bg-gradient-to-br ${stack.color} opacity-5 group-hover:opacity-10 transition-opacity rounded-lg`}></div>
                    <div className="relative p-6 border-2 rounded-lg hover:border-primary transition-all">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${stack.color} text-white`}>
                          {stack.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{stack.name}</h3>
                          <p className="text-xs text-muted-foreground">{stack.role}</p>
                        </div>
                      </div>
                      <ul className="space-y-1.5 mb-4">
                        {stack.features.map((feature, i) => (
                          <li key={i} className="text-sm flex items-center gap-2">
                            <span className="text-green-500">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <a 
                        href={stack.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline flex items-center gap-1"
                      >
                        Learn more <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Architecture Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Production Architecture</CardTitle>
              <CardDescription>Request flow from browser to database</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {architectureLayers.map((layer, idx) => (
                  <div key={idx}>
                    <div className={`p-4 rounded-lg ${layer.color} border-2 border-transparent hover:border-primary transition-all`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-bold">{layer.layer}</div>
                          <div className="text-sm text-muted-foreground">{layer.tech}</div>
                        </div>
                        {idx < architectureLayers.length - 1 && (
                          <span className="text-muted-foreground">↓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded">
                <h4 className="font-bold mb-2">🔄 Request Flow Example</h4>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>User uploads CSV file via <code className="bg-muted px-1 rounded">/upload</code> page</li>
                  <li>Next.js sends POST request to Railway API: <code className="bg-muted px-1 rounded">https://api.railway.app/api/files/upload</code></li>
                  <li>Express middleware validates JWT token</li>
                  <li>Multer processes file upload to Railway volumes</li>
                  <li>Prisma creates File record in PostgreSQL</li>
                  <li>Response sent back through Vercel Edge → Browser</li>
                </ol>
              </div>
            </CardContent>
          </Card>

          {/* API Endpoints with Frontend Integration */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints ↔ Frontend Pages</CardTitle>
              <CardDescription>CRUD operations integration (Lab 7 API consumed by Lab 8 UI)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiEndpoints.map((endpoint, idx) => {
                  const colors: Record<string, string> = {
                    GET: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                    POST: "bg-green-500/10 text-green-700 dark:text-green-300",
                    DELETE: "bg-red-500/10 text-red-700 dark:text-red-300"
                  }
                  return (
                    <div key={idx} className="grid md:grid-cols-3 gap-4 p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Badge className={`font-mono text-xs px-3 ${colors[endpoint.method]}`}>
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm">{endpoint.path}</code>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {endpoint.description}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Frontend:</span>
                        <code className="text-xs bg-muted px-2 py-1 rounded">{endpoint.frontend}</code>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Deployment Guide</CardTitle>
              <CardDescription>Complete workflow from local to production</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {deploymentSteps.map((step, idx) => (
                  <div key={idx} className="relative pl-8 pb-8 border-l-2 border-muted last:border-l-0 last:pb-0">
                    <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-lg">{step.phase}</h4>
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {step.duration}
                        </Badge>
                      </div>
                      <ul className="space-y-2">
                        {step.tasks.map((task, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">→</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Deployment Options Comparison</CardTitle>
              <CardDescription>Vercel + Railway vs Traditional VPS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Feature</th>
                      <th className="text-left p-3">Vercel</th>
                      <th className="text-left p-3">Railway</th>
                      <th className="text-left p-3">VPS (DigitalOcean)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonFeatures.map((item, idx) => (
                      <tr key={idx} className="border-b hover:bg-accent/50">
                        <td className="p-3 font-medium">{item.feature}</td>
                        <td className="p-3">
                          <Badge variant="secondary">{item.vercel}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{item.railway}</Badge>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline">{item.vps}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/5 border-l-4 border-green-500 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <h4 className="font-bold text-sm">Best for Security</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">All options provide SSL. Vercel & Railway auto-manage certificates.</p>
                </div>
                
                <div className="p-4 bg-blue-500/5 border-l-4 border-blue-500 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-600" />
                    <h4 className="font-bold text-sm">Best for Speed</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Vercel wins with global CDN. Railway has good performance. VPS depends on location.</p>
                </div>
                
                <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <h4 className="font-bold text-sm">Best for Cost</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">Vercel free tier generous. Railway $5/month includes DB. VPS needs more management.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demos */}
          <Card>
            <CardHeader>
              <CardTitle>Live Application Demos</CardTitle>
              <CardDescription>Test deployed application features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link href="/files">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                        <Database className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold">File Management</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload CSV files, view list, delete - Full CRUD with API Lab 7
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Test Feature</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>

                <Link href="/dashboard">
                  <div className="p-6 border-2 rounded-lg hover:border-primary hover:bg-accent/50 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-3 bg-green-500/10 rounded-lg group-hover:bg-green-500/20 transition-colors">
                        <Globe className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold">Dashboard Integration</h3>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create charts from CSV, add to dashboards - Real-time API calls
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>Test Feature</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Key Learnings */}
          <Card>
            <CardHeader>
              <CardTitle>Key Concepts & Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-bold">Frontend-Backend Integration</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Environment variables pentru API URL (<code>NEXT_PUBLIC_API_URL</code>)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Error handling cu try-catch și user feedback</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Loading states pentru UX mai bună</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>JWT token management (localStorage/cookies)</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold">Production Deployment</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Separate .env pentru development și production</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>Database migrations cu Prisma în production</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>CORS configuration pentru cross-origin requests</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Badge variant="secondary" className="mt-0.5">✓</Badge>
                      <span>SSL/HTTPS automatic cu Vercel și Railway</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <a 
                  href="https://vercel.com/docs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Vercel Documentation</div>
                    <div className="text-xs text-muted-foreground">Next.js deployment guide</div>
                  </div>
                </a>

                <a 
                  href="https://docs.railway.app" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Railway Documentation</div>
                    <div className="text-xs text-muted-foreground">Deploy Express + PostgreSQL</div>
                  </div>
                </a>

                <a 
                  href="https://www.prisma.io/docs/guides/deployment" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">Prisma Deployment</div>
                    <div className="text-xs text-muted-foreground">Production database migrations</div>
                  </div>
                </a>

                <Link 
                  href="https://github.com/cocrisiulian/data-dashboard"
                  className="flex items-center gap-3 p-4 border rounded-lg hover:border-primary hover:bg-accent/50 transition-all"
                >
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-semibold">GitHub Repository</div>
                    <div className="text-xs text-muted-foreground">Source code & deployment configs</div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
