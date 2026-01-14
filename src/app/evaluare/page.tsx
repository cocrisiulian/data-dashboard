"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"
import { CheckCircle2, Code, Database, Layers, Server, Shield, BookOpen } from "lucide-react"
import Link from "next/link"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"

export default function EvaluarePage() {
  const criteria = [
    {
      id: "oficiu",
      title: "1. Oficiu",
      maxPoints: "1.0p",
      icon: CheckCircle2,
      color: "text-green-600",
      description: "Punctaj automat acordat pentru prezentarea aplicației.",
      details: [
        "Proiect complet funcțional",
        "Aplicație web modernă cu Next.js 15",
        "54 unit tests passing",
        "12 laboratoare implementate"
      ]
    },
    {
      id: "admin",
      title: "2. Secțiune Admin (CRUD)",
      maxPoints: "2.0p",
      icon: Shield,
      color: "text-blue-600",
      description: "Operații CRUD complete pe minimum 2 entități cu relații (FK).",
      details: [
        {
          entity: "Plans",
          operations: [
            "CREATE: POST /api/plans - Creare plan nou",
            "READ: GET /api/plans, GET /api/plans/:id",
            "UPDATE: PUT /api/plans/:id - Modificare plan",
            "DELETE: DELETE /api/plans/:id - Ștergere fizică (hard delete)"
          ],
          fk: "User.plan_id → Plan.id",
          files: [
            "/src/server/controllers/PlanController.ts",
            "/src/server/services/PlanService.ts",
            "/src/server/repositories/PlanRepository.ts"
          ]
        },
        {
          entity: "Files",
          operations: [
            "CREATE: POST /api/files - Upload fișier CSV",
            "READ: GET /api/files, GET /api/files/:id",
            "DELETE: DELETE /api/files/:id - Ștergere logică (soft delete: is_deleted, deleted_at)"
          ],
          fk: "File.user_id → User.id",
          files: [
            "/src/server/controllers/FileController.ts",
            "/src/server/services/FileService.ts",
            "/src/server/repositories/FileRepository.ts"
          ]
        },
        {
          entity: "Bonus: Charts & Dashboards",
          operations: [
            "Charts: CRUD complet cu FK către Dashboard și File",
            "Dashboards: CRUD complet cu FK către User"
          ]
        }
      ],
      demoLinks: [
        { label: "Plans API", href: "/api/plans" },
        { label: "Files Management", href: "/files" },
        { label: "Dashboards", href: "/dashboard" }
      ]
    },
    {
      id: "user",
      title: "3. Secțiune Utilizator",
      maxPoints: "1.0p",
      icon: Layers,
      color: "text-purple-600",
      description: "Afișare planuri și funcționalitate principală a aplicației.",
      details: [
        {
          section: "Afișare Planuri",
          items: [
            "UI: /pricing - Pricing page cu toate planurile (Free, Pro, Enterprise)",
            "API: GET /api/plans - Lista cu limite și features",
            "Display: Card-uri cu pricing, features list, CTA buttons"
          ]
        },
        {
          section: "Funcționalitate Principală: Dashboard Builder",
          items: [
            "Upload CSV: /upload - Import date cu Multer + CSV parsing",
            "Create Dashboard: Creare dashboard personalizat",
            "Add Charts: Bar, Line, Pie, Area charts cu Recharts",
            "Visualize Data: Grid layout interactiv",
            "Plan Limits Enforcement:",
            "• Free: 5 files, 2 dashboards, 10 charts",
            "• Pro: 50 files, 10 dashboards, 100 charts",
            "• Enterprise: unlimited"
          ]
        }
      ],
      demoLinks: [
        { label: "Pricing Page", href: "/pricing" },
        { label: "Upload CSV", href: "/upload" },
        { label: "My Dashboards", href: "/dashboard" }
      ]
    },
    {
      id: "orm",
      title: "4. Utilizare ORM",
      maxPoints: "1.0p",
      icon: Database,
      color: "text-orange-600",
      description: "Prisma ORM pentru PostgreSQL cu migrations și relations.",
      details: [
        {
          type: "Schema-First (LAB3)",
          items: [
            "prisma/schema.prisma - 5 modele (User, Plan, File, Dashboard, Chart)",
            "Database introspection din PostgreSQL existent"
          ]
        },
        {
          type: "Code-First Migrations (LAB4)",
          items: [
            "prisma/migrations/ - Migration history tracking",
            "Version control pentru schema changes"
          ]
        },
        {
          type: "Relations & Advanced Queries",
          items: [
            "User ↔ Plan (many-to-one)",
            "User → File[], Dashboard[] (one-to-many)",
            "Dashboard → Chart[] (one-to-many)",
            "File → Chart[] (one-to-many)",
            "Include, where, orderBy, pagination"
          ]
        }
      ],
      codeExample: `// PlanRepository.ts
async findAll(): Promise<Plan[]> {
  return prisma.plan.findMany({
    orderBy: { price: 'asc' },
    include: {
      _count: { select: { users: true } }
    }
  });
}`
    },
    {
      id: "services",
      title: "5. Utilizarea Nivelului Services",
      maxPoints: "1.0p",
      icon: Server,
      color: "text-cyan-600",
      description: "Service Layer pentru business logic separation (LAB10).",
      details: [
        {
          service: "PlanService",
          responsibilities: [
            "Business logic pentru planuri",
            "Enrichment cu canDelete, valueScore",
            "Plan comparison și recommendations"
          ]
        },
        {
          service: "FileService",
          responsibilities: [
            "Upload validation",
            "Plan limits check",
            "CSV parsing integration",
            "Soft delete logic"
          ]
        },
        {
          service: "ChartService",
          responsibilities: [
            "Chart creation cu limit enforcement",
            "Ownership validation",
            "Type validation (bar, line, pie, area)"
          ]
        },
        {
          service: "DashboardService",
          responsibilities: [
            "Dashboard management",
            "Cascade delete pentru charts",
            "Access control"
          ]
        }
      ],
      architecture: [
        "Controllers: HTTP request/response handling",
        "Services: Business logic, orchestration",
        "Repositories: Database access, CRUD"
      ]
    },
    {
      id: "business",
      title: "6. Logică Business Specifică",
      maxPoints: "2.0p",
      icon: Code,
      color: "text-indigo-600",
      description: "Business logic complexă implementată în Service Layer.",
      examples: [
        {
          title: "1. Plan Limits Enforcement",
          description: "Verificare limite plan la upload",
          code: `// FileService.uploadFile()
const user = await this.userRepository.findByIdWithPlan(userId);
const fileCount = await this.fileRepository.countByUserId(userId);

if (user.plan?.max_files && fileCount >= user.plan.max_files) {
  throw new Error(\`File limit reached for \${user.plan.name} plan\`);
}`
        },
        {
          title: "2. Plan Value Score Calculation",
          description: "Calcul metric business pentru planuri",
          code: `// PlanService.getAllPlans()
const enrichedPlans = plans.map(plan => ({
  ...plan,
  valueScore: this.calculateValueScore(plan),
  canDelete: plan._count.users === 0,
  recommendedFor: plan.name === 'Pro' ? 'Most Popular' : undefined
}));`
        },
        {
          title: "3. CSV Auto-Analysis (LAB7)",
          description: "Detectare tipuri coloane și sugestii grafice",
          code: `// FileService - detectColumnTypes()
// Analyze: Numeric + Date = Line chart
// Categorical + Numeric = Bar chart
// Business intelligence logic`
        },
        {
          title: "4. Cache Invalidation Strategy (LAB12)",
          description: "Invalidare cache la mutații",
          code: `// ChartService.createChart()
const chart = await this.chartRepository.create(chartData);

// Invalidate related caches
this.cacheManager.removeByPattern(\`chart-dashboard-\${dashboardId}\`);
this.cacheManager.removeByPattern(\`chart-\${userId}\`);`
        },
        {
          title: "5. Soft Delete with Relationship Check",
          description: "Verificare dependențe înainte de delete",
          code: `// FileService.deleteFile()
const file = await this.fileRepository.findWithCharts(fileId);

if (file.charts && file.charts.length > 0) {
  throw new Error('Cannot delete file with associated charts');
}

await this.fileRepository.softDelete(fileId);`
        }
      ]
    },
    {
      id: "complexity",
      title: "7. Complexitatea Implementării",
      maxPoints: "1.0p",
      icon: Layers,
      color: "text-pink-600",
      description: "Cache, Loguri, Dependency Injection, Ștergere Logică.",
      features: [
        {
          name: "Memory Cache (LAB12)",
          icon: "⚡",
          details: [
            "MemoryCacheService cu node-cache",
            "TTL: 3600s (1 hour)",
            "Pattern-based invalidation",
            "Integrat în toate services",
            "Performance: 10-20x faster reads"
          ],
          files: ["/src/server/infrastructure/cache/"]
        },
        {
          name: "Winston Logging (LAB11)",
          icon: "📝",
          details: [
            "Log levels: INFO, WARN, ERROR",
            "File rotation (error.log, combined.log)",
            "Loguri în controllers pentru fiecare operație",
            "Business events logging în services"
          ],
          files: ["/src/server/infrastructure/logger.ts"]
        },
        {
          name: "Dependency Injection (LAB10)",
          icon: "💉",
          details: [
            "Awilix DI Container",
            "Constructor injection în toate clasele",
            "Lifetime scopes: SINGLETON, SCOPED",
            "Testability: Easy mocking"
          ],
          files: ["/src/server/infrastructure/container.ts"]
        },
        {
          name: "Soft Delete (LAB9)",
          icon: "🗑️",
          details: [
            "Coloane: is_deleted, deleted_at",
            "Prisma middleware pentru auto-exclude",
            "Files și Users cu soft delete",
            "Plans și Charts cu hard delete"
          ],
          files: ["/prisma/migrations/"]
        }
      ],
      bonus: [
        "Unit Testing: Vitest cu 54 teste passing",
        "TypeScript: Full type safety",
        "Next.js 15: App Router + RSC",
        "Modular Architecture: 7 layers"
      ]
    },
    {
      id: "docs",
      title: "8. Documentație",
      maxPoints: "1.0p",
      icon: BookOpen,
      color: "text-teal-600",
      description: "Documentație completă: Proiectare, Implementare, Utilizare.",
      sections: [
        {
          title: "Proiectare",
          items: [
            "Paradigme utilizate și justificare",
            "Arhitectura aplicației (7 layers)",
            "Diagrame de flow",
            "Design patterns (MVC, Repository, Service Layer, DI)"
          ],
          file: "ARCHITECTURE.md"
        },
        {
          title: "Implementare",
          items: [
            "Business Layer explicat detaliat",
            "Librării suplimentare și scopul lor",
            "Secțiuni de cod deosebite",
            "Exemple concrete din fiecare service"
          ],
          files: ["ARCHITECTURE.md", "README.md"]
        },
        {
          title: "Utilizare",
          items: [
            "Pași instalare programator (local dev)",
            "Pași instalare beneficiar (production)",
            "Mod de utilizare aplicație",
            "Troubleshooting guide"
          ],
          file: "INSTALL.md"
        }
      ],
      files: [
        { name: "README.md", desc: "Overview complet aplicație" },
        { name: "ARCHITECTURE.md", desc: "Arhitectură detaliată" },
        { name: "INSTALL.md", desc: "Ghid instalare pas cu pas" },
        { name: "TESTING.md", desc: "Testing strategy" },
        { name: "DIAGRAMS.md", desc: "Diagrame arhitectură" }
      ]
    }
  ]

  const maxTotalPoints = criteria.reduce((sum, c) => sum + parseFloat(c.maxPoints), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Grila de Evaluare PPAW</h1>
              <p className="text-muted-foreground text-lg">
                Paradigme de Proiectare a Aplicațiilor Web - 2025/2026
              </p>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold text-slate-600">{maxTotalPoints}p</div>
              <div className="text-sm text-muted-foreground">punctaj maxim</div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Pondere Aplicație</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">70%</div>
                <p className="text-xs text-muted-foreground">din nota finală</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Criterii Evaluare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">puncte de verificat</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Laboratoare</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">implementate + Live demos</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Criteria Grid */}
        <div className="grid gap-6 mb-8">
          {criteria.map((criterion) => (
            <Card key={criterion.id} className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-white dark:bg-slate-800 shadow-sm">
                      <criterion.icon className={`w-6 h-6 ${criterion.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl mb-2">{criterion.title}</CardTitle>
                      <CardDescription>{criterion.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="text-lg px-4 py-1">
                      {criterion.maxPoints}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                {/* Details based on criterion type */}
                {criterion.id === 'admin' && (
                  <div className="space-y-6">
                    {(criterion.details as any[]).map((detail: any, idx) => (
                      <div key={idx} className="border-l-4 border-blue-500 pl-4">
                        <h4 className="font-bold mb-2">Entitate: {detail.entity}</h4>
                        {detail.operations && (
                          <ul className="space-y-1 text-sm mb-2">
                            {detail.operations.map((op: string, i: number) => (
                              <li key={i} className="text-muted-foreground">• {op}</li>
                            ))}
                          </ul>
                        )}
                        {detail.fk && (
                          <div className="mt-2 p-2 bg-slate-100 dark:bg-slate-800 rounded text-sm">
                            <strong>FK:</strong> <code>{detail.fk}</code>
                          </div>
                        )}
                        {detail.files && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {detail.files.map((file: string, i: number) => (
                              <Badge key={i} variant="outline" className="font-mono text-xs">
                                {file}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    {criterion.demoLinks && (
                      <div className="flex gap-2 mt-4">
                        {criterion.demoLinks.map((link: any) => (
                          <Link key={link.href} href={link.href}>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              🔗 {link.label}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {criterion.id === 'user' && (
                  <div className="space-y-4">
                    {(criterion.details as any[]).map((section: any, idx) => (
                      <div key={idx} className="border-l-4 border-purple-500 pl-4">
                        <h4 className="font-bold mb-2">{section.section}</h4>
                        <ul className="space-y-1 text-sm">
                          {section.items.map((item: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {criterion.demoLinks && (
                      <div className="flex gap-2 mt-4">
                        {criterion.demoLinks.map((link: any) => (
                          <Link key={link.href} href={link.href}>
                            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                              🔗 {link.label}
                            </Badge>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {criterion.id === 'orm' && (
                  <div className="space-y-4">
                    {(criterion.details as any[]).map((detail: any, idx) => (
                      <div key={idx} className="border-l-4 border-orange-500 pl-4">
                        <h4 className="font-bold mb-2">{detail.type}</h4>
                        <ul className="space-y-1 text-sm">
                          {detail.items.map((item: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    {criterion.codeExample && (
                      <div className="mt-4">
                        <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                          {criterion.codeExample}
                        </pre>
                      </div>
                    )}
                  </div>
                )}

                {criterion.id === 'services' && (
                  <div className="space-y-4">
                    {(criterion.details as any[]).map((service: any, idx) => (
                      <div key={idx} className="border-l-4 border-cyan-500 pl-4">
                        <h4 className="font-bold mb-2">{service.service}</h4>
                        <ul className="space-y-1 text-sm">
                          {service.responsibilities.map((resp: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {resp}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="mt-4 p-4 bg-slate-100 dark:bg-slate-800 rounded">
                      <h4 className="font-bold mb-2">Arhitectură:</h4>
                      <ul className="space-y-1 text-sm">
                        {(criterion.architecture as string[]).map((item: string, i: number) => (
                          <li key={i} className="text-muted-foreground">→ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {criterion.id === 'business' && (
                  <Tabs defaultValue="example-0" className="w-full">
                    <TabsList className="grid w-full grid-cols-5">
                      {(criterion.examples as any[]).slice(0, 5).map((ex: any, idx) => (
                        <TabsTrigger key={idx} value={`example-${idx}`}>
                          Exemplu {idx + 1}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {(criterion.examples as any[]).map((example: any, idx) => (
                      <TabsContent key={idx} value={`example-${idx}`} className="space-y-4">
                        <div className="border-l-4 border-indigo-500 pl-4">
                          <h4 className="font-bold text-lg mb-1">{example.title}</h4>
                          <p className="text-sm text-muted-foreground mb-3">{example.description}</p>
                          <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg overflow-x-auto text-xs">
                            {example.code}
                          </pre>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                )}

                {criterion.id === 'complexity' && (
                  <div className="space-y-6">
                    {(criterion.features as any[]).map((feature: any, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-white dark:bg-slate-800">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-2xl">{feature.icon}</span>
                          <h4 className="font-bold text-lg">{feature.name}</h4>
                        </div>
                        <ul className="space-y-1 text-sm mb-3">
                          {feature.details.map((detail: string, i: number) => (
                            <li key={i} className="text-muted-foreground">✓ {detail}</li>
                          ))}
                        </ul>
                        <div className="flex flex-wrap gap-2">
                          {feature.files.map((file: string, i: number) => (
                            <Badge key={i} variant="outline" className="font-mono text-xs">
                              {file}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg">
                      <h4 className="font-bold mb-2">Bonus Features:</h4>
                      <ul className="space-y-1 text-sm">
                        {(criterion.bonus as string[]).map((item: string, i: number) => (
                          <li key={i} className="text-muted-foreground">✓ {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {criterion.id === 'docs' && (
                  <div className="space-y-4">
                    {(criterion.sections as any[]).map((section: any, idx) => (
                      <div key={idx} className="border-l-4 border-teal-500 pl-4">
                        <h4 className="font-bold mb-2">{section.title}</h4>
                        <ul className="space-y-1 text-sm mb-2">
                          {section.items.map((item: string, i: number) => (
                            <li key={i} className="text-muted-foreground">• {item}</li>
                          ))}
                        </ul>
                        {section.file && (
                          <Badge variant="outline" className="font-mono text-xs">
                            📄 {section.file}
                          </Badge>
                        )}
                        {section.files && section.files.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {section.files.map((f: string) => (
                              <Badge key={f} variant="outline" className="font-mono text-xs">
                                📄 {f}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                    <div className="mt-4">
                      <h4 className="font-bold mb-2">Fișiere Documentație:</h4>
                      <div className="grid md:grid-cols-2 gap-2">
                        {(criterion.files as any[]).map((file: any) => (
                          <div key={file.name} className="p-3 border rounded bg-white dark:bg-slate-800">
                            <div className="font-mono text-sm font-bold">{file.name}</div>
                            <div className="text-xs text-muted-foreground">{file.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {criterion.id === 'oficiu' && Array.isArray(criterion.details) && (
                  <ul className="space-y-2 text-sm">
                    {(criterion.details as string[]).map((detail: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Scoring Info */}
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-slate-200">
          <CardHeader>
            <CardTitle className="text-2xl">Formula de Calcul</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                <span>Aplicație Practică:</span>
                <span className="font-bold">punctaj × 70%</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white dark:bg-slate-800 rounded-lg">
                <span>Teme:</span>
                <span className="font-bold">punctaj × 30%</span>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
              <div className="flex justify-between items-center p-6 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <span className="text-xl font-bold">PUNCTAJ MAXIM:</span>
                <span className="text-4xl font-bold text-slate-600">{maxTotalPoints}p</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Pagină de evaluare generată pentru prezentare PPAW 2025-2026</p>
          <p className="mt-2">
            <Link href="/LABS" className="text-primary hover:underline">
              ← Înapoi la Laboratoare
            </Link>
            {" | "}
            <Link href="/" className="text-primary hover:underline">
              Pagina Principală
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
