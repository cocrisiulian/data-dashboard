"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"

export default function LabsIndexPage() {
  const labs = [
    {
      number: 1,
      title: "Database Design & ERD",
      description: "Entity-Relationship Diagram and schema design for DataInsight Dashboard",
      topics: ["Requirements Analysis", "ERD", "Database Schema", "DDL"],
      color: "from-slate-500 to-slate-700",
      href: "/LABS/lab1"
    },
    {
      number: 2,
      title: "System Architecture",
      description: "Three-tier architecture with client-server pattern and RESTful API",
      topics: ["Architecture Layers", "API Design", "Data Flow", "Security"],
      color: "from-blue-500 to-indigo-700",
      href: "/LABS/lab2"
    },
    {
      number: 3,
      title: "ORM Schema-First",
      description: "Database-first design with Prisma ORM mapping PostgreSQL schema",
      topics: ["Prisma Models", "Schema Introspection", "Type Safety", "Relations"],
      color: "from-purple-500 to-pink-700",
      href: "/LABS/lab3"
    },
    {
      number: 4,
      title: "ORM Code-First",
      description: "Model-driven development with Prisma Migrate generating database schema",
      topics: ["Migration Workflow", "Code-First vs Schema-First", "Team Collaboration"],
      color: "from-green-500 to-emerald-700",
      href: "/LABS/lab4"
    },
    {
      number: 5,
      title: "MVC Pattern & Authentication",
      description: "Model-View-Controller architecture with JWT authentication",
      topics: ["Plans CRUD", "User Authentication", "REST API", "JWT Tokens"],
      color: "from-yellow-500 to-orange-700",
      href: "/LABS/lab5"
    },
    {
      number: 6,
      title: "MVC Advanced & Dashboards",
      description: "Advanced MVC patterns with dashboard management",
      topics: ["Dashboard CRUD", "Nested Resources", "Relationship Handling"],
      color: "from-red-500 to-rose-700",
      href: "/LABS/lab6"
    },
    {
      number: 7,
      title: "CSV Ingestion & Visualization",
      description: "Parse CSV files, detect data types, and prepare for visualization",
      topics: ["CSV Parser", "Type Detection", "Data Analysis", "Chart Suggestions"],
      color: "from-orange-500 to-red-700",
      href: "/LABS/lab7"
    },
    {
      number: 8,
      title: "API Integration & Deployment",
      description: "Frontend CRUD interfaces and production web hosting",
      topics: ["API Consumption", "Vercel Deployment", "Railway Hosting", "Custom Domains"],
      color: "from-teal-500 to-cyan-700",
      href: "/LABS/lab8"
    }
  ]

  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PPAW Laboratory Work
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Complete demonstration of web application architecture concepts for DataInsight Dashboard
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="outline" className="text-sm">Academic Year 2025-2026</Badge>
              <Badge variant="outline" className="text-sm">8 Laboratory Assignments</Badge>
              <Badge variant="outline" className="text-sm">Full-Stack Development</Badge>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🗄️</span>
                  Database Design
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Labs 1-4 cover database design, ERD modeling, and ORM implementation with both schema-first and code-first approaches.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🏗️</span>
                  Architecture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Labs 2, 5, 6 demonstrate three-tier architecture, MVC pattern, RESTful API design, and authentication systems.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">📊</span>
                  Data Processing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lab 7 focuses on CSV parsing, data type detection, and preparing datasets for interactive visualization.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🚀</span>
                  Deployment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Lab 8 demonstrates production deployment with Vercel (frontend), Railway (backend + database), and custom domains.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Lab Cards */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Laboratory Assignments</h2>
            <div className="grid lg:grid-cols-2 gap-6">
              {labs.map((lab) => (
                <Link key={lab.number} href={lab.href}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 group cursor-pointer border-2 hover:border-primary">
                    <CardHeader className="relative overflow-hidden">
                      <div className={`absolute inset-0 bg-gradient-to-r ${lab.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={`text-lg w-12 h-12 flex items-center justify-center bg-gradient-to-r ${lab.color}`}>
                            {lab.number}
                          </Badge>
                          <div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                              {lab.title}
                            </CardTitle>
                          </div>
                        </div>
                        <CardDescription className="text-base">
                          {lab.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="text-sm font-semibold text-muted-foreground">Topics Covered:</h4>
                        <div className="flex gap-2 flex-wrap">
                          {lab.topics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                        <div className="pt-3 flex items-center justify-between text-sm">
                          <span className="text-primary group-hover:underline">
                            View Interactive Demo →
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Technology Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>Technologies used in laboratory implementations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Frontend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start">Next.js 15</Badge>
                    <Badge variant="outline" className="w-full justify-start">React 19</Badge>
                    <Badge variant="outline" className="w-full justify-start">TypeScript</Badge>
                    <Badge variant="outline" className="w-full justify-start">Tailwind CSS</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Backend</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start">Express.js 4.21</Badge>
                    <Badge variant="outline" className="w-full justify-start">Node.js</Badge>
                    <Badge variant="outline" className="w-full justify-start">JWT Auth</Badge>
                    <Badge variant="outline" className="w-full justify-start">Multer</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Database</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start">PostgreSQL</Badge>
                    <Badge variant="outline" className="w-full justify-start">Prisma ORM 6.18</Badge>
                    <Badge variant="outline" className="w-full justify-start">Row-Level Security</Badge>
                    <Badge variant="outline" className="w-full justify-start">Migrations</Badge>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-sm text-muted-foreground">Tools</h4>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start">Git</Badge>
                    <Badge variant="outline" className="w-full justify-start">VS Code</Badge>
                    <Badge variant="outline" className="w-full justify-start">Postman</Badge>
                    <Badge variant="outline" className="w-full justify-start">Prisma Studio</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              All laboratory assignments are part of the PPAW (Paradigme de proiectare a aplicatiilor web) course
            </p>
            <p>
              DataInsight Dashboard - A comprehensive data visualization platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
