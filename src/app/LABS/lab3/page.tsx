"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"

export default function Lab3Page() {
  const [selectedModel, setSelectedModel] = useState<string>("Plan")

  const prismaModels = {
    Plan: {
      code: `model Plan {
  id              String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name            String   @unique @db.VarChar(50)
  max_files       Int
  max_charts      Int
  max_dashboards  Int
  price           Decimal  @default(0) @db.Decimal(10, 2)
  created_at      DateTime @default(now()) @db.Timestamptz
  
  // Relations
  users           User[]
  
  @@map("plans")
}`,
      description: "Subscription plan with resource limits",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key" },
        { name: "name", type: "String", desc: "Plan name (unique)" },
        { name: "max_files", type: "Int", desc: "File upload limit" },
        { name: "max_charts", type: "Int", desc: "Chart creation limit" },
        { name: "max_dashboards", type: "Int", desc: "Dashboard limit" },
        { name: "price", type: "Decimal", desc: "Monthly price" },
      ],
      relations: ["users[]"]
    },
    User: {
      code: `model User {
  id         String    @id @db.Uuid
  email      String    @unique @db.VarChar(255)
  full_name  String?   @db.VarChar(255)
  plan_id    String?   @db.Uuid
  created_at DateTime  @default(now()) @db.Timestamptz
  updated_at DateTime  @default(now()) @updatedAt @db.Timestamptz
  
  // Relations
  plan       Plan?     @relation(fields: [plan_id], references: [id])
  files      File[]
  dashboards Dashboard[]
  usageLogs  UsageLog[]
  
  @@map("users")
}`,
      description: "Application user linked to authentication",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key (from auth.users)" },
        { name: "email", type: "String", desc: "Unique email address" },
        { name: "full_name", type: "String?", desc: "Optional full name" },
        { name: "plan_id", type: "UUID?", desc: "Foreign key to Plan" },
      ],
      relations: ["plan", "files[]", "dashboards[]", "usageLogs[]"]
    },
    File: {
      code: `model File {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id     String   @db.Uuid
  file_name   String   @db.VarChar(255)
  file_path   String   @db.VarChar(500)
  file_size   Int
  file_type   String   @db.VarChar(50)
  uploaded_at DateTime @default(now()) @db.Timestamptz
  
  // Relations
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  charts      Chart[]
  
  @@map("files")
}`,
      description: "Uploaded CSV files for visualization",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key" },
        { name: "user_id", type: "UUID", desc: "Foreign key to User" },
        { name: "file_name", type: "String", desc: "Original filename" },
        { name: "file_path", type: "String", desc: "Storage path" },
        { name: "file_size", type: "Int", desc: "Size in bytes" },
        { name: "file_type", type: "String", desc: "MIME type" },
      ],
      relations: ["user", "charts[]"]
    },
    Dashboard: {
      code: `model Dashboard {
  id          String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id     String   @db.Uuid
  name        String   @db.VarChar(255)
  description String?  @db.Text
  created_at  DateTime @default(now()) @db.Timestamptz
  updated_at  DateTime @default(now()) @updatedAt @db.Timestamptz
  
  // Relations
  user        User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  charts      Chart[]
  
  @@map("dashboards")
}`,
      description: "Container for organizing charts",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key" },
        { name: "user_id", type: "UUID", desc: "Foreign key to User" },
        { name: "name", type: "String", desc: "Dashboard name" },
        { name: "description", type: "String?", desc: "Optional description" },
      ],
      relations: ["user", "charts[]"]
    },
    Chart: {
      code: `model Chart {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  dashboard_id  String   @db.Uuid
  file_id       String   @db.Uuid
  chart_type    String   @db.VarChar(50)
  chart_config  Json     @db.JsonB
  title         String   @db.VarChar(255)
  created_at    DateTime @default(now()) @db.Timestamptz
  
  // Relations
  dashboard     Dashboard @relation(fields: [dashboard_id], references: [id], onDelete: Cascade)
  file          File      @relation(fields: [file_id], references: [id], onDelete: Cascade)
  
  @@map("charts")
}`,
      description: "Data visualization configuration",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key" },
        { name: "dashboard_id", type: "UUID", desc: "Foreign key to Dashboard" },
        { name: "file_id", type: "UUID", desc: "Foreign key to File" },
        { name: "chart_type", type: "String", desc: "line, bar, pie, scatter" },
        { name: "chart_config", type: "Json", desc: "Configuration object" },
        { name: "title", type: "String", desc: "Chart title" },
      ],
      relations: ["dashboard", "file"]
    },
    UsageLog: {
      code: `model UsageLog {
  id         String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  user_id    String   @db.Uuid
  action     String   @db.VarChar(100)
  details    Json?    @db.JsonB
  created_at DateTime @default(now()) @db.Timestamptz
  
  // Relations
  user       User     @relation(fields: [user_id], references: [id], onDelete: Cascade)
  
  @@map("usage_logs")
}`,
      description: "Audit log of user activities",
      fields: [
        { name: "id", type: "UUID", desc: "Primary key" },
        { name: "user_id", type: "UUID", desc: "Foreign key to User" },
        { name: "action", type: "String", desc: "Action type" },
        { name: "details", type: "Json?", desc: "Optional JSON details" },
      ],
      relations: ["user"]
    }
  }

  const schemaFeatures = [
    { title: "Snake Case Mapping", desc: "Database uses snake_case (file_type) while Prisma uses camelCase (fileType)", icon: "🐍" },
    { title: "UUID Primary Keys", desc: "All tables use PostgreSQL UUID for globally unique identifiers", icon: "🔑" },
    { title: "Cascade Deletes", desc: "Foreign keys use onDelete: Cascade to maintain referential integrity", icon: "🗑️" },
    { title: "JSONB Support", desc: "Flexible schema for chart_config and usage log details", icon: "📦" },
    { title: "Timestamps", desc: "Automatic created_at and updated_at tracking", icon: "⏰" },
    { title: "Type Safety", desc: "Prisma generates TypeScript types from schema", icon: "✅" },
  ]

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 3</Badge>
              <h1 className="text-4xl font-bold">ORM Schema-First Approach</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Database-first design with Prisma ORM mapping PostgreSQL schema to TypeScript models
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="models">Prisma Models</TabsTrigger>
              <TabsTrigger value="workflow">Schema-First Workflow</TabsTrigger>
              <TabsTrigger value="features">ORM Features</TabsTrigger>
            </TabsList>

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-6">
              {/* Model Selector */}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(prismaModels).map((modelName) => (
                  <button
                    key={modelName}
                    onClick={() => setSelectedModel(modelName)}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedModel === modelName
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    {modelName}
                  </button>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Model: {selectedModel}</CardTitle>
                  <CardDescription>
                    {prismaModels[selectedModel as keyof typeof prismaModels].description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Prisma Code */}
                    <div>
                      <h4 className="font-semibold mb-2">Prisma Schema</h4>
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                        {prismaModels[selectedModel as keyof typeof prismaModels].code}
                      </pre>
                    </div>

                    {/* Fields Table */}
                    <div>
                      <h4 className="font-semibold mb-3">Fields</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-semibold">Field Name</th>
                              <th className="text-left p-3 font-semibold">Prisma Type</th>
                              <th className="text-left p-3 font-semibold">Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prismaModels[selectedModel as keyof typeof prismaModels].fields.map((field, idx) => (
                              <tr key={idx} className="border-b hover:bg-muted/50">
                                <td className="p-3">
                                  <code className="text-sm font-mono">{field.name}</code>
                                </td>
                                <td className="p-3">
                                  <Badge variant="secondary">{field.type}</Badge>
                                </td>
                                <td className="p-3 text-sm">{field.desc}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Relations */}
                    <div>
                      <h4 className="font-semibold mb-3">Relations</h4>
                      <div className="flex gap-2 flex-wrap">
                        {prismaModels[selectedModel as keyof typeof prismaModels].relations.map((rel, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {rel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schema-First Development Process</CardTitle>
                  <CardDescription>Database schema drives ORM model generation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded">
                      <Badge className="text-lg w-10 h-10 flex items-center justify-center">1</Badge>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Design SQL Schema</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create DDL statements defining tables, columns, constraints, and indexes
                        </p>
                        <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  max_files INTEGER NOT NULL,
  ...
);`}
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 border-l-4 border-green-500 bg-green-500/5 rounded">
                      <Badge className="text-lg w-10 h-10 flex items-center justify-center">2</Badge>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Execute DDL in PostgreSQL</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Run SQL scripts to create database schema
                        </p>
                        <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`psql -U postgres -d datainsight \\
  -f scripts/DB/01-create-tables.sql`}
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 border-l-4 border-purple-500 bg-purple-500/5 rounded">
                      <Badge className="text-lg w-10 h-10 flex items-center justify-center">3</Badge>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Introspect Database</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Prisma reads existing database schema and generates Prisma schema
                        </p>
                        <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`npx prisma db pull`}
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 border-l-4 border-orange-500 bg-orange-500/5 rounded">
                      <Badge className="text-lg w-10 h-10 flex items-center justify-center">4</Badge>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Generate Prisma Client</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Create type-safe TypeScript client from schema
                        </p>
                        <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`npx prisma generate`}
                        </pre>
                      </div>
                    </div>

                    <div className="flex gap-4 items-start p-4 border-l-4 border-pink-500 bg-pink-500/5 rounded">
                      <Badge className="text-lg w-10 h-10 flex items-center justify-center">5</Badge>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2">Use in Application</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Import and use generated Prisma Client in code
                        </p>
                        <pre className="text-xs bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`import { prisma } from '@/config/prisma'

const plans = await prisma.plan.findMany()
const user = await prisma.user.create({
  data: { email, plan_id }
})`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Advantages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <div>
                          <div className="font-semibold text-sm">Database Control</div>
                          <div className="text-xs text-muted-foreground">Full control over SQL schema, indexes, constraints</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <div>
                          <div className="font-semibold text-sm">Existing Databases</div>
                          <div className="text-xs text-muted-foreground">Works with legacy or externally managed databases</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <div>
                          <div className="font-semibold text-sm">Performance Tuning</div>
                          <div className="text-xs text-muted-foreground">Direct access to PostgreSQL features</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 text-lg">✓</span>
                        <div>
                          <div className="font-semibold text-sm">Type Safety</div>
                          <div className="text-xs text-muted-foreground">Generated TypeScript types match database exactly</div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trade-offs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 text-lg">⚠</span>
                        <div>
                          <div className="font-semibold text-sm">Manual DDL</div>
                          <div className="text-xs text-muted-foreground">Must write and maintain SQL migration scripts</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 text-lg">⚠</span>
                        <div>
                          <div className="font-semibold text-sm">Schema Drift</div>
                          <div className="text-xs text-muted-foreground">Prisma schema can get out of sync with database</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 text-lg">⚠</span>
                        <div>
                          <div className="font-semibold text-sm">Extra Step</div>
                          <div className="text-xs text-muted-foreground">Need to re-introspect after schema changes</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-yellow-500 text-lg">⚠</span>
                        <div>
                          <div className="font-semibold text-sm">DB-Specific</div>
                          <div className="text-xs text-muted-foreground">Harder to switch databases later</div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {schemaFeatures.map((feature, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{feature.icon}</span>
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{feature.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Example: Querying with Prisma</CardTitle>
                  <CardDescription>Type-safe database operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Find all dashboards with charts and files</h4>
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`const dashboards = await prisma.dashboard.findMany({
  where: { user_id: userId },
  include: {
    charts: {
      include: {
        file: true
      }
    }
  },
  orderBy: { created_at: 'desc' }
})`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Create chart with validation</h4>
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`const chart = await prisma.chart.create({
  data: {
    dashboard_id: dashboardId,
    file_id: fileId,
    chart_type: 'line',
    title: 'Sales Trend',
    chart_config: {
      xAxis: 'date',
      yAxis: 'revenue'
    }
  },
  include: {
    dashboard: true,
    file: true
  }
})`}
                      </pre>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Transaction example</h4>
                      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`await prisma.$transaction(async (tx) => {
  const dashboard = await tx.dashboard.delete({
    where: { id: dashboardId }
  })
  
  await tx.usageLog.create({
    data: {
      user_id: userId,
      action: 'dashboard_delete',
      details: { dashboard_id: dashboardId }
    }
  })
})`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
