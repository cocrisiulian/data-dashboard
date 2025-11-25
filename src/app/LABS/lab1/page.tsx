"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"

export default function Lab1Page() {
  const [selectedTable, setSelectedTable] = useState<string>("plans")

  const tables = {
    plans: {
      name: "plans",
      description: "Subscription plans with resource limits and pricing",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique plan identifier" },
        { name: "name", type: "VARCHAR(50)", constraint: "NOT NULL UNIQUE", description: "Plan name (Free, Pro, Enterprise)" },
        { name: "max_files", type: "INTEGER", constraint: "NOT NULL", description: "Maximum number of files allowed" },
        { name: "max_charts", type: "INTEGER", constraint: "NOT NULL", description: "Maximum number of charts allowed" },
        { name: "max_dashboards", type: "INTEGER", constraint: "NOT NULL", description: "Maximum number of dashboards allowed" },
        { name: "price", type: "DECIMAL(10,2)", constraint: "DEFAULT 0", description: "Monthly subscription price" },
        { name: "created_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Creation timestamp" },
      ]
    },
    users: {
      name: "users",
      description: "Registered users linked to Supabase Auth",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY REFERENCES auth.users", description: "User ID from Supabase Auth" },
        { name: "email", type: "VARCHAR(255)", constraint: "NOT NULL UNIQUE", description: "User email address" },
        { name: "full_name", type: "VARCHAR(255)", constraint: "NULL", description: "User's full name (optional)" },
        { name: "plan_id", type: "UUID", constraint: "REFERENCES plans(id)", description: "Foreign key to subscription plan" },
        { name: "created_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Account creation timestamp" },
        { name: "updated_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Last update timestamp" },
      ]
    },
    files: {
      name: "files",
      description: "Uploaded CSV files owned by users",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique file identifier" },
        { name: "user_id", type: "UUID", constraint: "NOT NULL REFERENCES users(id)", description: "File owner" },
        { name: "file_name", type: "VARCHAR(255)", constraint: "NOT NULL", description: "Original filename" },
        { name: "file_path", type: "VARCHAR(500)", constraint: "NOT NULL", description: "Storage path" },
        { name: "file_size", type: "INTEGER", constraint: "NOT NULL", description: "File size in bytes" },
        { name: "file_type", type: "VARCHAR(50)", constraint: "NOT NULL", description: "MIME type (e.g., text/csv)" },
        { name: "uploaded_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Upload timestamp" },
      ]
    },
    dashboards: {
      name: "dashboards",
      description: "User-created dashboards for chart organization",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique dashboard identifier" },
        { name: "user_id", type: "UUID", constraint: "NOT NULL REFERENCES users(id)", description: "Dashboard owner" },
        { name: "name", type: "VARCHAR(255)", constraint: "NOT NULL", description: "Dashboard name" },
        { name: "description", type: "TEXT", constraint: "NULL", description: "Optional description" },
        { name: "created_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Creation timestamp" },
        { name: "updated_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Last update timestamp" },
      ]
    },
    charts: {
      name: "charts",
      description: "Data visualizations linked to dashboards and files",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique chart identifier" },
        { name: "dashboard_id", type: "UUID", constraint: "NOT NULL REFERENCES dashboards(id)", description: "Parent dashboard" },
        { name: "file_id", type: "UUID", constraint: "NOT NULL REFERENCES files(id)", description: "Data source file" },
        { name: "chart_type", type: "VARCHAR(50)", constraint: "NOT NULL", description: "Chart type (line, bar, pie, scatter)" },
        { name: "chart_config", type: "JSONB", constraint: "NOT NULL", description: "Chart configuration (axes, colors, etc.)" },
        { name: "title", type: "VARCHAR(255)", constraint: "NOT NULL", description: "Chart title" },
        { name: "created_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Creation timestamp" },
      ]
    },
    usage_logs: {
      name: "usage_logs",
      description: "Audit log of user activities",
      columns: [
        { name: "id", type: "UUID", constraint: "PRIMARY KEY", description: "Unique log entry identifier" },
        { name: "user_id", type: "UUID", constraint: "NOT NULL REFERENCES users(id)", description: "User who performed action" },
        { name: "action", type: "VARCHAR(100)", constraint: "NOT NULL", description: "Action type (e.g., file_upload, chart_create)" },
        { name: "details", type: "JSONB", constraint: "NULL", description: "Additional action details" },
        { name: "created_at", type: "TIMESTAMPTZ", constraint: "DEFAULT NOW()", description: "Action timestamp" },
      ]
    }
  }

  const relationships = [
    { from: "users", to: "plans", type: "many-to-one", key: "users.plan_id → plans.id" },
    { from: "files", to: "users", type: "many-to-one", key: "files.user_id → users.id" },
    { from: "dashboards", to: "users", type: "many-to-one", key: "dashboards.user_id → users.id" },
    { from: "charts", to: "dashboards", type: "many-to-one", key: "charts.dashboard_id → dashboards.id" },
    { from: "charts", to: "files", type: "many-to-one", key: "charts.file_id → files.id" },
    { from: "usage_logs", to: "users", type: "many-to-one", key: "usage_logs.user_id → users.id" },
  ]

  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 1</Badge>
              <h1 className="text-4xl font-bold">Database Design & ERD</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Entity-Relationship Diagram and schema design for DataInsight Dashboard application
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="erd" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="erd">ERD & Relationships</TabsTrigger>
              <TabsTrigger value="schema">Database Schema</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            {/* ERD Tab */}
            <TabsContent value="erd" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Entity-Relationship Diagram</CardTitle>
                  <CardDescription>Visual representation of database entities and their relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Entities Grid */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {Object.values(tables).map((table) => (
                        <div
                          key={table.name}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedTable === table.name
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50"
                          }`}
                          onClick={() => setSelectedTable(table.name)}
                        >
                          <h3 className="font-bold text-lg mb-2">{table.name}</h3>
                          <p className="text-sm text-muted-foreground">{table.description}</p>
                          <div className="mt-3 flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {table.columns.length} columns
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Relationships */}
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Relationships</h3>
                      <div className="space-y-2">
                        {relationships.map((rel, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <Badge variant="outline">{rel.from}</Badge>
                            <span className="text-sm text-muted-foreground">{rel.type}</span>
                            <Badge variant="outline">{rel.to}</Badge>
                            <code className="ml-auto text-xs bg-background px-2 py-1 rounded">{rel.key}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schema Tab */}
            <TabsContent value="schema" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Database Schema - {tables[selectedTable as keyof typeof tables].name}</CardTitle>
                  <CardDescription>{tables[selectedTable as keyof typeof tables].description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3 font-semibold">Column</th>
                          <th className="text-left p-3 font-semibold">Type</th>
                          <th className="text-left p-3 font-semibold">Constraints</th>
                          <th className="text-left p-3 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tables[selectedTable as keyof typeof tables].columns.map((col, idx) => (
                          <tr key={idx} className="border-b hover:bg-muted/50">
                            <td className="p-3">
                              <code className="text-sm font-mono">{col.name}</code>
                            </td>
                            <td className="p-3">
                              <Badge variant="secondary">{col.type}</Badge>
                            </td>
                            <td className="p-3">
                              <code className="text-xs text-muted-foreground">{col.constraint}</code>
                            </td>
                            <td className="p-3 text-sm">{col.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* DDL Preview */}
                  <div className="mt-6">
                    <h4 className="font-semibold mb-2">DDL Statement</h4>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-sm">
{`CREATE TABLE IF NOT EXISTS ${tables[selectedTable as keyof typeof tables].name} (
${tables[selectedTable as keyof typeof tables].columns.map(col => 
  `  ${col.name} ${col.type} ${col.constraint}`
).join(',\n')}
);`}
                    </pre>
                  </div>
                </CardContent>
              </Card>

              {/* Table Selector */}
              <div className="flex gap-2 flex-wrap">
                {Object.keys(tables).map((tableName) => (
                  <Button
                    key={tableName}
                    variant={selectedTable === tableName ? "default" : "outline"}
                    onClick={() => setSelectedTable(tableName)}
                  >
                    {tableName}
                  </Button>
                ))}
              </div>
            </TabsContent>

            {/* Requirements Tab */}
            <TabsContent value="requirements" className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Functional Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>User registration and authentication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>CSV file upload and storage</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>Dashboard creation and management</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>Chart visualization with multiple types</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>Subscription plan management with limits</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge className="mt-0.5">✓</Badge>
                        <span>User activity logging and audit trails</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Non-Functional Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">S</Badge>
                        <div>
                          <div className="font-semibold">Security</div>
                          <div className="text-sm text-muted-foreground">Row-Level Security (RLS) policies</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">S</Badge>
                        <div>
                          <div className="font-semibold">Scalability</div>
                          <div className="text-sm text-muted-foreground">UUID-based primary keys</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">M</Badge>
                        <div>
                          <div className="font-semibold">Modularity</div>
                          <div className="text-sm text-muted-foreground">Normalized schema with clear separation</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">A</Badge>
                        <div>
                          <div className="font-semibold">Auditability</div>
                          <div className="text-sm text-muted-foreground">Comprehensive usage logging</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="secondary" className="mt-0.5">P</Badge>
                        <div>
                          <div className="font-semibold">Performance</div>
                          <div className="text-sm text-muted-foreground">Indexed foreign keys and timestamps</div>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Design Principles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">🔐 Security First</h4>
                      <p className="text-sm text-muted-foreground">
                        All tables use RLS policies to ensure users can only access their own data
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">🎯 Idempotent</h4>
                      <p className="text-sm text-muted-foreground">
                        Schema can be safely re-run without errors using IF NOT EXISTS
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">📊 JSONB for Flexibility</h4>
                      <p className="text-sm text-muted-foreground">
                        Chart configurations and log details use JSONB for schema flexibility
                      </p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold mb-2">🔗 Referential Integrity</h4>
                      <p className="text-sm text-muted-foreground">
                        CASCADE deletes ensure data consistency when parent records are removed
                      </p>
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

function Button({ children, variant = "default", onClick, className = "" }: { children: React.ReactNode, variant?: "default" | "outline", onClick?: () => void, className?: string }) {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors"
  const variants: Record<"default" | "outline", string> = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </button>
  )
}
