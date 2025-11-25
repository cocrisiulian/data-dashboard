"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"

export default function Lab4Page() {
  const [selectedStep, setSelectedStep] = useState(1)

  const migrationSteps = [
    {
      step: 1,
      title: "Define Prisma Schema",
      description: "Create prisma/schema.prisma with models",
      code: `// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Plan {
  id             String   @id @default(uuid())
  name           String   @unique
  max_files      Int
  max_charts     Int
  max_dashboards Int
  price          Decimal  @default(0)
  created_at     DateTime @default(now())
  
  users          User[]
  
  @@map("plans")
}

model User {
  id         String    @id
  email      String    @unique
  full_name  String?
  plan_id    String?
  created_at DateTime  @default(now())
  updated_at DateTime  @updatedAt
  
  plan       Plan?     @relation(fields: [plan_id], references: [id])
  files      File[]
  dashboards Dashboard[]
  
  @@map("users")
}`
    },
    {
      step: 2,
      title: "Create Migration",
      description: "Generate SQL migration from Prisma schema",
      code: `# Terminal command
npx prisma migrate dev --name init

# Prisma analyzes schema and generates:
# prisma/migrations/20240115_init/migration.sql

-- CreateTable
CREATE TABLE "plans" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(50) NOT NULL,
    "max_files" INTEGER NOT NULL,
    "max_charts" INTEGER NOT NULL,
    "max_dashboards" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "plans_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "plans_name_key" ON "plans"("name");`
    },
    {
      step: 3,
      title: "Apply Migration",
      description: "Prisma executes migration against database",
      code: `# Migration is automatically applied during 'migrate dev'
# Or manually apply with:
npx prisma migrate deploy

# Prisma:
# 1. Connects to DATABASE_URL
# 2. Checks _prisma_migrations table
# 3. Runs pending migrations in order
# 4. Records migration in tracking table

# Output:
✓ Migration 20240115_init applied (12ms)
Database schema is up to date!`
    },
    {
      step: 4,
      title: "Generate Client",
      description: "Create type-safe Prisma Client",
      code: `# Generate TypeScript client
npx prisma generate

# Creates:
# node_modules/.prisma/client/index.d.ts

export type Plan = {
  id: string
  name: string
  max_files: number
  max_charts: number
  max_dashboards: number
  price: Decimal
  created_at: Date
}

export class PrismaClient {
  plan: {
    create(args: { data: Prisma.PlanCreateInput }): Promise<Plan>
    findMany(args?: { where?: Prisma.PlanWhereInput }): Promise<Plan[]>
    // ... all CRUD operations
  }
}`
    },
    {
      step: 5,
      title: "Use in Application",
      description: "Import and use Prisma Client",
      code: `// config/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// controllers/planController.ts
import { prisma } from '../config/prisma'

export const getAllPlans = async (req, res) => {
  const plans = await prisma.plan.findMany({
    orderBy: { price: 'asc' }
  })
  res.json(plans)
}`
    }
  ]

  const comparisonTable = [
    { aspect: "Starting Point", schema: "SQL DDL", code: "Prisma schema" },
    { aspect: "Migration Creation", schema: "Manual SQL scripts", code: "Auto-generated from schema" },
    { aspect: "Schema Changes", schema: "Write SQL, then introspect", code: "Edit schema, then migrate" },
    { aspect: "Type Generation", schema: "After introspection", code: "After migration" },
    { aspect: "Database Control", schema: "Full (raw SQL)", code: "Limited (Prisma DSL)" },
    { aspect: "Learning Curve", schema: "Need SQL knowledge", code: "Easier (Prisma syntax)" },
    { aspect: "Existing DB", schema: "Perfect fit", code: "Need to model it first" },
    { aspect: "New Projects", schema: "More setup", code: "Faster start" },
  ]

  const codeFirstBenefits = [
    { icon: "⚡", title: "Faster Development", desc: "No manual SQL - Prisma generates migrations automatically" },
    { icon: "🔄", title: "Single Source of Truth", desc: "Prisma schema is the authoritative definition" },
    { icon: "🛡️", title: "Type Safety", desc: "TypeScript types always match database schema" },
    { icon: "📝", title: "Migration History", desc: "All schema changes tracked in version-controlled files" },
    { icon: "🔀", title: "Easy Rollback", desc: "Revert migrations with prisma migrate resolve" },
    { icon: "🌐", title: "Database Agnostic", desc: "Switch between PostgreSQL, MySQL, SQLite easily" },
  ]

  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-green-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 4</Badge>
              <h1 className="text-4xl font-bold">ORM Code-First Approach</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Model-driven development with Prisma Migrate generating database schema from code
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="workflow" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="workflow">Migration Workflow</TabsTrigger>
              <TabsTrigger value="comparison">Schema-First vs Code-First</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
            </TabsList>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-6">
              {/* Step Navigation */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {migrationSteps.map((item) => (
                  <button
                    key={item.step}
                    onClick={() => setSelectedStep(item.step)}
                    className={`flex-shrink-0 px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedStep === item.step
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary hover:bg-secondary/80"
                    }`}
                  >
                    Step {item.step}
                  </button>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className="text-lg w-12 h-12 flex items-center justify-center">
                      {selectedStep}
                    </Badge>
                    <div>
                      <CardTitle>{migrationSteps[selectedStep - 1].title}</CardTitle>
                      <CardDescription>{migrationSteps[selectedStep - 1].description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
                    {migrationSteps[selectedStep - 1].code}
                  </pre>
                </CardContent>
              </Card>

              {/* Visual Flow */}
              <Card>
                <CardHeader>
                  <CardTitle>Code-First Development Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="p-4 bg-purple-500/10 border-2 border-purple-500 rounded-lg">
                      <div className="text-3xl mb-2">📝</div>
                      <h4 className="font-semibold text-sm">Define Models</h4>
                      <p className="text-xs text-muted-foreground">Write Prisma schema</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">→</span>
                    </div>
                    <div className="p-4 bg-blue-500/10 border-2 border-blue-500 rounded-lg">
                      <div className="text-3xl mb-2">🔄</div>
                      <h4 className="font-semibold text-sm">Generate SQL</h4>
                      <p className="text-xs text-muted-foreground">prisma migrate dev</p>
                    </div>
                    <div className="flex items-center justify-center">
                      <span className="text-2xl text-muted-foreground">→</span>
                    </div>
                    <div className="p-4 bg-green-500/10 border-2 border-green-500 rounded-lg">
                      <div className="text-3xl mb-2">✅</div>
                      <h4 className="font-semibold text-sm">Use Client</h4>
                      <p className="text-xs text-muted-foreground">Type-safe queries</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Migration Commands */}
              <Card>
                <CardHeader>
                  <CardTitle>Common Prisma Commands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <code className="text-sm font-mono">npx prisma migrate dev --name &lt;name&gt;</code>
                      <p className="text-xs text-muted-foreground mt-1">Create and apply migration in development</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="text-sm font-mono">npx prisma migrate deploy</code>
                      <p className="text-xs text-muted-foreground mt-1">Apply pending migrations in production</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="text-sm font-mono">npx prisma migrate reset</code>
                      <p className="text-xs text-muted-foreground mt-1">Drop database, apply all migrations, run seed</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="text-sm font-mono">npx prisma generate</code>
                      <p className="text-xs text-muted-foreground mt-1">Generate Prisma Client from schema</p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <code className="text-sm font-mono">npx prisma studio</code>
                      <p className="text-xs text-muted-foreground mt-1">Open visual database browser</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Comparison Tab */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schema-First vs Code-First Comparison</CardTitle>
                  <CardDescription>Understanding the differences between approaches</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Aspect</th>
                          <th className="text-left p-3 font-semibold bg-blue-500/5">Schema-First (Lab 3)</th>
                          <th className="text-left p-3 font-semibold bg-green-500/5">Code-First (Lab 4)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {comparisonTable.map((row, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/30">
                            <td className="p-3 font-medium">{row.aspect}</td>
                            <td className="p-3 bg-blue-500/5">
                              <code className="text-xs">{row.schema}</code>
                            </td>
                            <td className="p-3 bg-green-500/5">
                              <code className="text-xs">{row.code}</code>
                            </td>
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
                      <span className="text-blue-500">📊</span>
                      Schema-First (Lab 3)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 rounded">
                        <div className="font-semibold text-sm mb-1">✓ Best For</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Existing databases</li>
                          <li>• DBA-controlled schemas</li>
                          <li>• Complex SQL features</li>
                          <li>• Multi-app databases</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-red-500/10 rounded">
                        <div className="font-semibold text-sm mb-1">✗ Challenges</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Manual SQL maintenance</li>
                          <li>• Schema drift risk</li>
                          <li>• Slower iterations</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-green-500">💻</span>
                      Code-First (Lab 4)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-500/10 rounded">
                        <div className="font-semibold text-sm mb-1">✓ Best For</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• New projects</li>
                          <li>• Rapid development</li>
                          <li>• App-owned databases</li>
                          <li>• Team collaboration</li>
                        </ul>
                      </div>
                      <div className="p-3 bg-red-500/10 rounded">
                        <div className="font-semibold text-sm mb-1">✗ Challenges</div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>• Less DB control</li>
                          <li>• Learning Prisma DSL</li>
                          <li>• Migration conflicts</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Example: Adding a New Field</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Schema-First</h4>
                      <ol className="text-xs space-y-2">
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">1</Badge>
                          <span>Write SQL: ALTER TABLE users ADD COLUMN avatar TEXT;</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">2</Badge>
                          <span>Execute SQL against database</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">3</Badge>
                          <span>Run: npx prisma db pull</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">4</Badge>
                          <span>Run: npx prisma generate</span>
                        </li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Code-First</h4>
                      <ol className="text-xs space-y-2">
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">1</Badge>
                          <span>Edit schema.prisma: avatar String?</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs">2</Badge>
                          <span>Run: npx prisma migrate dev --name add_avatar</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs opacity-30">3</Badge>
                          <span className="text-muted-foreground">(Prisma auto-generates & applies SQL)</span>
                        </li>
                        <li className="flex gap-2">
                          <Badge className="w-6 h-6 flex items-center justify-center text-xs opacity-30">4</Badge>
                          <span className="text-muted-foreground">(Prisma auto-updates client)</span>
                        </li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Benefits Tab */}
            <TabsContent value="benefits" className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {codeFirstBenefits.map((benefit, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{benefit.icon}</span>
                        {benefit.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Migration Files Structure</CardTitle>
                  <CardDescription>Version-controlled database history</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
{`prisma/
├── schema.prisma              # Single source of truth
└── migrations/
    ├── migration_lock.toml    # Database provider lock
    ├── 20240115_init/
    │   └── migration.sql      # Initial schema
    ├── 20240116_add_avatar/
    │   └── migration.sql      # Add avatar field
    └── 20240117_add_indexes/
        └── migration.sql      # Performance indexes

# Each migration:
# - Has timestamp prefix for ordering
# - Contains SQL statements
# - Tracked in _prisma_migrations table
# - Version controlled with git`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Team Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 border-l-4 border-green-500 bg-green-500/5 rounded">
                      <h4 className="font-semibold mb-2">Developer A adds field</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground">
                        <li>1. Edits schema.prisma → adds `bio String?`</li>
                        <li>2. Runs `prisma migrate dev --name add_bio`</li>
                        <li>3. Commits schema + migration to git</li>
                        <li>4. Pushes to remote</li>
                      </ol>
                    </div>

                    <div className="p-4 border-l-4 border-blue-500 bg-blue-500/5 rounded">
                      <h4 className="font-semibold mb-2">Developer B pulls changes</h4>
                      <ol className="text-sm space-y-1 text-muted-foreground">
                        <li>1. Pulls from git → gets schema + migration</li>
                        <li>2. Runs `prisma migrate dev` (no name needed)</li>
                        <li>3. Prisma applies pending migration automatically</li>
                        <li>4. Database now has `bio` field, types updated</li>
                      </ol>
                    </div>

                    <Badge variant="outline" className="mt-4">
                      ✓ No manual coordination needed - migrations are declarative and reproducible
                    </Badge>
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
