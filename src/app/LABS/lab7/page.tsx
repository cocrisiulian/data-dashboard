"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Badge } from "@/components/ui/text/badge"
import { Button } from "@/components/ui/controls/button"
import { Label } from "@/components/ui/text/label"
import { Alert, AlertDescription } from "@/components/ui/feedback/alert"
import { parseCSV, getNumericColumns, getCategoricalColumns } from "@/lib/utils/csv-parser"

type ParsedData = {
  headers: string[]
  rows: Record<string, any>[]
}

export default function Lab7Page() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [parsedData, setParsedData] = useState<ParsedData | null>(null)
  const [error, setError] = useState<string>("")
  const [delimiter, setDelimiter] = useState<"," | ";" | "\t">("auto" as any)
  const [numericCols, setNumericCols] = useState<string[]>([])
  const [categoricalCols, setCategoricalCols] = useState<string[]>([])
  const [previewRows, setPreviewRows] = useState(10)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError("Please select a CSV file")
        return
      }
      setSelectedFile(file)
      setError("")
      setParsedData(null)
    }
  }

  const handleParse = async () => {
    if (!selectedFile) {
      setError("No file selected")
      return
    }

    setError("")
    try {
      const data = await parseCSV(selectedFile)
      setParsedData(data)
      
      // Detect column types
      const numeric = getNumericColumns(data)
      const categorical = getCategoricalColumns(data)
      
      setNumericCols(numeric)
      setCategoricalCols(categorical)
    } catch (err: any) {
      setError(err.message || "Failed to parse CSV")
    }
  }

  const loadSampleFile = async (filename: string) => {
    try {
      const response = await fetch(`/api/models_csv/${filename}`)
      const text = await response.text()
      
      // Create a File object from the text
      const blob = new Blob([text], { type: 'text/csv' })
      const file = new File([blob], filename, { type: 'text/csv' })
      
      setSelectedFile(file)
      setError("")
      
      // Auto-parse
      const data = await parseCSV(file)
      setParsedData(data)
      
      const numeric = getNumericColumns(data)
      const categorical = getCategoricalColumns(data)
      
      setNumericCols(numeric)
      setCategoricalCols(categorical)
    } catch (err: any) {
      setError(`Failed to load sample: ${err.message}`)
    }
  }

  const sampleFiles = [
    { name: "test-data-bar.csv", desc: "Bar chart data (Product, Sales)" },
    { name: "test-data-timeseries.csv", desc: "Time series data (Date, Value)" },
    { name: "test-data-multiseries.csv", desc: "Multi-series data" },
  ]

  const csvFeatures = [
    { title: "Delimiter Detection", desc: "Auto-detect comma, semicolon, or tab separators", status: "Implemented" },
    { title: "Header Normalization", desc: "Trim whitespace and remove quotes from headers", status: "Implemented" },
    { title: "Type Inference", desc: "Automatically detect numeric vs categorical columns", status: "Implemented" },
    { title: "Data Validation", desc: "Check for empty files and malformed rows", status: "Implemented" },
    { title: "Large File Support", desc: "Stream parsing for files > 10MB", status: "Planned" },
    { title: "Excel Support", desc: "Parse .xlsx files using XLSX library", status: "Planned" },
  ]

  return (
    <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-slate-900 dark:to-orange-950">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">Lab 7</Badge>
              <h1 className="text-4xl font-bold">CSV Ingestion & Visualization</h1>
            </div>
            <p className="text-lg text-muted-foreground">
              Parse CSV files, detect data types, and prepare data for visualization
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="parser" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="parser">CSV Parser</TabsTrigger>
              <TabsTrigger value="api">API & Postman</TabsTrigger>
              <TabsTrigger value="analysis">Data Analysis</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>

            {/* Parser Tab */}
            <TabsContent value="parser" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* File Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle>Upload CSV File</CardTitle>
                    <CardDescription>Select a CSV file to parse and analyze</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Choose File</Label>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".csv"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-md file:border-0
                          file:text-sm file:font-semibold
                          file:bg-primary file:text-primary-foreground
                          hover:file:bg-primary/90
                          cursor-pointer"
                      />
                    </div>

                    {selectedFile && (
                      <div className="p-3 bg-muted rounded-md">
                        <div className="text-sm font-semibold">{selectedFile.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(selectedFile.size / 1024).toFixed(2)} KB
                        </div>
                      </div>
                    )}

                    <Button onClick={handleParse} disabled={!selectedFile} className="w-full">
                      Parse CSV
                    </Button>

                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                {/* Sample Files */}
                <Card>
                  <CardHeader>
                    <CardTitle>Load Sample Files</CardTitle>
                    <CardDescription>Try parsing with our sample datasets</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sampleFiles.map((sample) => (
                        <button
                          key={sample.name}
                          onClick={() => loadSampleFile(sample.name)}
                          className="w-full p-3 text-left border rounded-lg hover:bg-accent transition-colors"
                        >
                          <div className="font-semibold text-sm">{sample.name}</div>
                          <div className="text-xs text-muted-foreground">{sample.desc}</div>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Parsed Data Preview */}
              {parsedData && (
                <Card>
                  <CardHeader>
                    <CardTitle>Parsed Data Preview</CardTitle>
                    <CardDescription>
                      Showing {Math.min(previewRows, parsedData.rows.length)} of {parsedData.rows.length} rows
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Row Count Selector */}
                      <div className="flex items-center gap-4">
                        <Label>Preview Rows:</Label>
                        <select
                          value={previewRows}
                          onChange={(e) => setPreviewRows(Number(e.target.value))}
                          className="px-3 py-2 border rounded-md"
                        >
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>
                      </div>

                      {/* Data Table */}
                      <div className="overflow-x-auto border rounded-lg">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="p-3 text-left font-semibold">#</th>
                              {parsedData.headers.map((header, idx) => (
                                <th key={idx} className="p-3 text-left font-semibold">
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {parsedData.rows.slice(0, previewRows).map((row, rowIdx) => (
                              <tr key={rowIdx} className="border-b hover:bg-muted/30">
                                <td className="p-3 text-muted-foreground">{rowIdx + 1}</td>
                                {parsedData.headers.map((header, colIdx) => (
                                  <td key={colIdx} className="p-3">
                                    {typeof row[header] === 'number' ? (
                                      <Badge variant="secondary">{row[header]}</Badge>
                                    ) : (
                                      row[header]
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* API & Postman Tab */}
            <TabsContent value="api" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    RESTful API Testing cu Postman
                  </CardTitle>
                  <CardDescription>
                    Testarea endpoint-urilor API folosind Postman pentru operații CRUD
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-500">
                    <AlertDescription>
                      <strong>Postman</strong> este un client API care facilitează testarea, documentarea și dezvoltarea API-urilor RESTful.
                      <br />
                      <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mt-2 inline-block">
                        Download Postman →
                      </a>
                    </AlertDescription>
                  </Alert>

                  {/* Exercițiu 1: GET Operations */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">📋 Exercițiu 1: Operațiile GET și GET(id)</h3>
                    
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <p className="font-semibold">Obiectiv:</p>
                      <p className="text-sm">Implementați și testați endpoint-urile pentru afișarea tuturor entităților și detalii despre o entitate specifică.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">GET /api/plans</CardTitle>
                          <CardDescription>Listează toate planurile</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Request în Postman:</Label>
                            <div className="bg-slate-950 text-slate-50 p-3 rounded text-xs space-y-2">
                              <div><span className="text-green-400">Method:</span> GET</div>
                              <div><span className="text-green-400">URL:</span> http://localhost:4000/api/plans</div>
                              <div><span className="text-green-400">Headers:</span> None required</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Response (200 OK):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`[
  {
    "id": 1,
    "name": "Free",
    "price": 0,
    "maxFiles": 5,
    "maxDashboards": 2,
    "maxCharts": 10
  },
  {
    "id": 2,
    "name": "Pro",
    "price": 19.99,
    "maxFiles": 50,
    "maxDashboards": 10,
    "maxCharts": 100
  }
]`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">GET /api/plans/:id</CardTitle>
                          <CardDescription>Detalii plan specific</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Request în Postman:</Label>
                            <div className="bg-slate-950 text-slate-50 p-3 rounded text-xs space-y-2">
                              <div><span className="text-green-400">Method:</span> GET</div>
                              <div><span className="text-green-400">URL:</span> http://localhost:4000/api/plans/1</div>
                              <div><span className="text-green-400">Params:</span> id = 1</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Response (200 OK):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "id": 1,
  "name": "Free",
  "price": 0,
  "maxFiles": 5,
  "maxDashboards": 2,
  "maxCharts": 10,
  "users": [
    {
      "id": 1,
      "email": "user@example.com",
      "createdAt": "2025-01-15"
    }
  ]
}`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Exercițiu 2: Model Mapping */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">🔄 Exercițiu 2: Model Mapping (DTO Pattern)</h3>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Data Transfer Objects (DTOs)</CardTitle>
                        <CardDescription>Separarea modelelor pentru database și API responses</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label className="text-xs font-bold mb-2 block">❌ Database Model (Prisma)</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`// prisma/schema.prisma
model Plan {
  id             Int      @id @default(autoincrement())
  name           String   @unique
  price          Decimal  @db.Decimal(10,2)
  maxFiles       Int?
  maxDashboards  Int?
  maxCharts      Int?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  users User[]
}`}
                            </pre>
                          </div>

                          <div>
                            <Label className="text-xs font-bold mb-2 block">✅ API Response Model (DTO)</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`// DTO for API response
interface PlanDTO {
  id: number;
  name: string;
  price: number;
  limits: {
    files: number;
    dashboards: number;
    charts: number;
  };
  userCount: number;
  isPopular: boolean;
}

// Mapper function
function toPlanDTO(plan) {
  return {
    id: plan.id,
    name: plan.name,
    price: Number(plan.price),
    limits: {
      files: plan.maxFiles,
      dashboards: plan.maxDashboards,
      charts: plan.maxCharts
    },
    userCount: plan._count?.users || 0,
    isPopular: plan.name === 'Pro'
  };
}`}
                            </pre>
                          </div>
                        </div>

                        <Alert>
                          <AlertDescription>
                            <strong>Beneficii DTO:</strong> Controlul exact asupra datelor expuse în API, adăugare câmpuri calculate,
                            ascundere detalii interne database, versioning API independent de schema DB
                          </AlertDescription>
                        </Alert>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Exercițiu 3: POST și PUT */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">✏️ Exercițiu 3: Operațiile POST și PUT</h3>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">POST /api/plans</CardTitle>
                          <CardDescription>Creare plan nou</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Request în Postman:</Label>
                            <div className="bg-slate-950 text-slate-50 p-3 rounded text-xs space-y-2">
                              <div><span className="text-green-400">Method:</span> POST</div>
                              <div><span className="text-green-400">URL:</span> http://localhost:4000/api/plans</div>
                              <div><span className="text-green-400">Headers:</span></div>
                              <div className="ml-4">Content-Type: application/json</div>
                              <div className="ml-4">Authorization: Bearer {'{token}'}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Body (JSON - Tab "Body" → "raw" → "JSON"):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "name": "Enterprise",
  "price": 99.99,
  "maxFiles": 500,
  "maxDashboards": 50,
  "maxCharts": 1000
}`}
                            </pre>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Response (201 Created):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "id": 3,
  "name": "Enterprise",
  "price": 99.99,
  "maxFiles": 500,
  "maxDashboards": 50,
  "maxCharts": 1000,
  "createdAt": "2025-12-10T10:30:00Z"
}`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">PUT /api/plans/:id</CardTitle>
                          <CardDescription>Actualizare plan existent</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Request în Postman:</Label>
                            <div className="bg-slate-950 text-slate-50 p-3 rounded text-xs space-y-2">
                              <div><span className="text-green-400">Method:</span> PUT</div>
                              <div><span className="text-green-400">URL:</span> http://localhost:4000/api/plans/3</div>
                              <div><span className="text-green-400">Headers:</span></div>
                              <div className="ml-4">Content-Type: application/json</div>
                              <div className="ml-4">Authorization: Bearer {'{token}'}</div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Body (JSON):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "price": 89.99,
  "maxFiles": 1000
}`}
                            </pre>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-bold">Response (200 OK):</Label>
                            <pre className="bg-slate-950 text-slate-50 p-3 rounded text-xs overflow-x-auto">
{`{
  "id": 3,
  "name": "Enterprise",
  "price": 89.99,
  "maxFiles": 1000,
  "maxDashboards": 50,
  "maxCharts": 1000,
  "updatedAt": "2025-12-10T11:00:00Z"
}`}
                            </pre>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Postman Collection Guide */}
                  <Card>
                    <CardHeader>
                      <CardTitle>📁 Ghid Postman: Crearea unei Colecții</CardTitle>
                      <CardDescription>Organizarea endpoint-urilor în Postman Collections</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ol className="space-y-3 text-sm">
                        <li className="flex gap-3">
                          <Badge variant="outline" className="shrink-0">1</Badge>
                          <div>
                            <strong>Creați o Collection nouă:</strong> Click pe "New" → "Collection" → Nume: "DataInsight API"
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <Badge variant="outline" className="shrink-0">2</Badge>
                          <div>
                            <strong>Adăugați Environment Variables:</strong> Click pe "Environments" → "Create Environment"
                            <pre className="bg-slate-950 text-slate-50 p-2 rounded text-xs mt-2">
{`Variable: baseUrl
Initial Value: http://localhost:4000
Current Value: http://localhost:4000`}
                            </pre>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <Badge variant="outline" className="shrink-0">3</Badge>
                          <div>
                            <strong>Creați Requests:</strong> În collection, click "Add Request" → Configurați:
                            <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                              <li>URL: {'{{baseUrl}}'}/api/plans</li>
                              <li>Method: GET, POST, PUT, DELETE</li>
                              <li>Headers: Content-Type, Authorization</li>
                              <li>Body: JSON pentru POST/PUT</li>
                            </ul>
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <Badge variant="outline" className="shrink-0">4</Badge>
                          <div>
                            <strong>Salvați Responses:</strong> Click "Save Response" → "Save as Example" pentru documentație
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <Badge variant="outline" className="shrink-0">5</Badge>
                          <div>
                            <strong>Export Collection:</strong> Click "..." pe collection → "Export" → Format: Collection v2.1
                          </div>
                        </li>
                      </ol>

                      <Alert className="bg-green-50 dark:bg-green-950 border-green-500">
                        <AlertDescription>
                          <strong>Pro Tip:</strong> Folosiți Postman Tests (tab "Tests") pentru automatizarea validărilor:
                          <pre className="bg-slate-950 text-slate-50 p-2 rounded text-xs mt-2">
{`pm.test("Status code is 200", function () {
  pm.response.to.have.status(200);
});

pm.test("Response has plans array", function () {
  pm.expect(pm.response.json()).to.be.an('array');
});`}
                          </pre>
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>

                  {/* Error Responses */}
                  <Card>
                    <CardHeader>
                      <CardTitle>⚠️ Error Responses - HTTP Status Codes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="font-bold text-red-600 dark:text-red-400">Client Errors (4xx)</div>
                          <div className="space-y-2">
                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
                              <div className="font-semibold">400 Bad Request</div>
                              <div className="text-xs text-muted-foreground">Invalid JSON sau missing required fields</div>
                              <pre className="text-xs mt-1">{'{"error": "Name is required"}'}</pre>
                            </div>
                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
                              <div className="font-semibold">401 Unauthorized</div>
                              <div className="text-xs text-muted-foreground">Missing sau invalid JWT token</div>
                              <pre className="text-xs mt-1">{'{"error": "Authentication required"}'}</pre>
                            </div>
                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
                              <div className="font-semibold">404 Not Found</div>
                              <div className="text-xs text-muted-foreground">Resource cu ID-ul specificat nu există</div>
                              <pre className="text-xs mt-1">{'{"error": "Plan not found"}'}</pre>
                            </div>
                            <div className="bg-red-50 dark:bg-red-950 p-2 rounded">
                              <div className="font-semibold">409 Conflict</div>
                              <div className="text-xs text-muted-foreground">Duplicate entry (ex: plan name exists)</div>
                              <pre className="text-xs mt-1">{'{"error": "Plan name already exists"}'}</pre>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="font-bold text-orange-600 dark:text-orange-400">Server Errors (5xx)</div>
                          <div className="space-y-2">
                            <div className="bg-orange-50 dark:bg-orange-950 p-2 rounded">
                              <div className="font-semibold">500 Internal Server Error</div>
                              <div className="text-xs text-muted-foreground">Uncaught exception în server</div>
                              <pre className="text-xs mt-1">{'{"error": "Internal server error"}'}</pre>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-950 p-2 rounded">
                              <div className="font-semibold">503 Service Unavailable</div>
                              <div className="text-xs text-muted-foreground">Database connection failed</div>
                              <pre className="text-xs mt-1">{'{"error": "Database unavailable"}'}</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analysis Tab */}
            <TabsContent value="analysis" className="space-y-6">
              {parsedData ? (
                <>
                  <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Dataset Stats</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Rows:</span>
                          <Badge variant="secondary">{parsedData.rows.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Columns:</span>
                          <Badge variant="secondary">{parsedData.headers.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Numeric Cols:</span>
                          <Badge variant="secondary">{numericCols.length}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Categorical Cols:</span>
                          <Badge variant="secondary">{categoricalCols.length}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Numeric Columns</CardTitle>
                        <CardDescription>Detected numeric data types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {numericCols.length > 0 ? (
                            numericCols.map((col) => (
                              <div key={col} className="flex items-center gap-2 p-2 bg-blue-500/10 rounded">
                                <Badge variant="outline" className="font-mono text-xs">{col}</Badge>
                                <span className="text-xs text-muted-foreground">Number</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No numeric columns detected</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Categorical Columns</CardTitle>
                        <CardDescription>Detected text/string data types</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {categoricalCols.length > 0 ? (
                            categoricalCols.map((col) => (
                              <div key={col} className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                                <Badge variant="outline" className="font-mono text-xs">{col}</Badge>
                                <span className="text-xs text-muted-foreground">String</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No categorical columns detected</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Suggested Chart Types</CardTitle>
                      <CardDescription>Based on detected column types</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        {numericCols.length >= 2 && (
                          <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-500/5">
                            <h4 className="font-bold mb-2">📈 Line Chart</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Plot numeric trends over time or sequence
                            </p>
                            <div className="text-xs">
                              <div><strong>X-Axis:</strong> {numericCols[0] || categoricalCols[0]}</div>
                              <div><strong>Y-Axis:</strong> {numericCols[1] || numericCols[0]}</div>
                            </div>
                          </div>
                        )}

                        {categoricalCols.length >= 1 && numericCols.length >= 1 && (
                          <div className="p-4 border-2 border-green-500 rounded-lg bg-green-500/5">
                            <h4 className="font-bold mb-2">📊 Bar Chart</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Compare values across categories
                            </p>
                            <div className="text-xs">
                              <div><strong>X-Axis:</strong> {categoricalCols[0]}</div>
                              <div><strong>Y-Axis:</strong> {numericCols[0]}</div>
                            </div>
                          </div>
                        )}

                        {numericCols.length >= 2 && (
                          <div className="p-4 border-2 border-purple-500 rounded-lg bg-purple-500/5">
                            <h4 className="font-bold mb-2">🔵 Scatter Plot</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Show correlation between two numeric variables
                            </p>
                            <div className="text-xs">
                              <div><strong>X-Axis:</strong> {numericCols[0]}</div>
                              <div><strong>Y-Axis:</strong> {numericCols[1]}</div>
                            </div>
                          </div>
                        )}

                        {numericCols.length >= 1 && (
                          <div className="p-4 border-2 border-orange-500 rounded-lg bg-orange-500/5">
                            <h4 className="font-bold mb-2">🥧 Pie Chart</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Show proportional distribution
                            </p>
                            <div className="text-xs">
                              <div><strong>Labels:</strong> {categoricalCols[0] || "Row Index"}</div>
                              <div><strong>Values:</strong> {numericCols[0]}</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="py-16 text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold mb-2">No Data Loaded</h3>
                    <p className="text-muted-foreground">
                      Upload or select a sample CSV file to see analysis
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>CSV Parser Features</CardTitle>
                  <CardDescription>Implementation status and roadmap</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {csvFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0 w-24">
                          <Badge variant={feature.status === "Implemented" ? "default" : "secondary"}>
                            {feature.status}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{feature.title}</h4>
                          <p className="text-sm text-muted-foreground">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Parser Implementation</CardTitle>
                  <CardDescription>Source code from src/lib/utils/csv-parser.ts</CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`export async function parseCSV(file: File): Promise<ParsedData> {
  const text = await file.text()
  const lines = text.split("\\n").filter((line) => line.trim())

  if (lines.length === 0) {
    throw new Error("File is empty")
  }

  // Parse headers (first line)
  const headers = lines[0]
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, ""))

  const rows: Record<string, any>[] = []

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i]
      .split(",")
      .map((v) => v.trim().replace(/^"|"$/g, ""))
    
    const row: Record<string, any> = {}

    headers.forEach((header, index) => {
      const value = values[index] || ""
      // Type inference: numeric vs string
      row[header] = isNaN(Number(value)) ? value : Number(value)
    })

    rows.push(row)
  }

  return { headers, rows }
}

export function getNumericColumns(data: ParsedData): string[] {
  if (data.rows.length === 0) return []
  const firstRow = data.rows[0]
  return data.headers.filter((header) => 
    typeof firstRow[header] === "number"
  )
}

export function getCategoricalColumns(data: ParsedData): string[] {
  if (data.rows.length === 0) return []
  const firstRow = data.rows[0]
  return data.headers.filter((header) => 
    typeof firstRow[header] === "string"
  )
}`}
                  </pre>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
{`import { parseCSV, getNumericColumns } from '@/lib/utils/csv-parser'

// Parse CSV file
const data = await parseCSV(file)

// Get column types
const numericCols = getNumericColumns(data)
const categoricalCols = getCategoricalColumns(data)

// Use for chart creation
const chartConfig = {
  xAxis: categoricalCols[0] || numericCols[0],
  yAxis: numericCols[0],
  chartType: 'bar'
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Future Enhancements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Automatic delimiter detection (comma, semicolon, tab)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Handle quoted values with embedded commas</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Date/time column detection and parsing</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Missing value handling (null, empty, N/A)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Statistical summaries (min, max, mean, median)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>Excel file support (.xlsx, .xls)</span>
                      </li>
                    </ul>
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
