'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Layers, Database, Zap, Package, RefreshCw, Clock, Users } from 'lucide-react';

export default function Lab10Page() {
  const [activeLifetime, setActiveLifetime] = useState('singleton');

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Lab 10: Service Layer și Dependency Injection</h1>
        <p className="text-xl text-muted-foreground">
          Arhitectură multi-nivel și injecția de dependențe
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-6 h-6" />
            Prezentare Generală
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            În acest laborator vom implementa două concepte fundamentale ale arhitecturii
            software: <strong>Service Layer (Business Layer)</strong> și{' '}
            <strong>Dependency Injection (DI)</strong>.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <Alert>
              <Layers className="w-4 h-4" />
              <AlertDescription>
                <strong>Service Layer</strong> - Nivel intermediar între prezentare și date
                care conține logica de business
              </AlertDescription>
            </Alert>

            <Alert>
              <Zap className="w-4 h-4" />
              <AlertDescription>
                <strong>Dependency Injection</strong> - Pattern care gestionează dependențele
                între clase și reduce cuplajul
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Three-Tier Architecture */}
      <Card>
        <CardHeader>
          <CardTitle>Arhitectura pe 3 Niveluri</CardTitle>
          <CardDescription>
            Separarea responsabilităților pentru un cod mai mențenabil
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Architecture Diagram */}
            <div className="bg-muted p-6 rounded-lg">
              <div className="flex flex-col gap-4">
                {/* Presentation Layer */}
                <div className="bg-blue-500 text-white p-4 rounded">
                  <div className="font-bold mb-2">📱 Presentation Layer (Controllers)</div>
                  <div className="text-sm">
                    • Gestionează request/response HTTP
                    <br />
                    • Validare input, formatare output
                    <br />
                    • Status codes, error handling
                    <br />
                    <code className="text-xs">Example: PlanController.js</code>
                  </div>
                </div>

                <div className="flex justify-center">↓</div>

                {/* Business Layer */}
                <div className="bg-green-500 text-white p-4 rounded">
                  <div className="font-bold mb-2">💼 Business Layer (Services)</div>
                  <div className="text-sm">
                    • Logica de business și validări
                    <br />
                    • Calcule, reguli, transformări
                    <br />
                    • Orchestrare operații complexe
                    <br />
                    <code className="text-xs">Example: PlanService.js</code>
                  </div>
                </div>

                <div className="flex justify-center">↓</div>

                {/* Data Access Layer */}
                <div className="bg-purple-500 text-white p-4 rounded">
                  <div className="font-bold mb-2">🗄️ Data Access Layer (Repositories)</div>
                  <div className="text-sm">
                    • Operații CRUD cu baza de date
                    <br />
                    • Queries, filtrare, agregări
                    <br />
                    • Abstracție peste ORM (Prisma)
                    <br />
                    <code className="text-xs">Example: PlanRepository.js</code>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">🔧</div>
                    <div className="font-bold">Mențenabilitate</div>
                    <div className="text-sm text-muted-foreground">
                      Fiecare nivel are responsabilități clare
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">🧪</div>
                    <div className="font-bold">Testabilitate</div>
                    <div className="text-sm text-muted-foreground">
                      Nivele izolate pot fi testate independent
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <div className="text-2xl">♻️</div>
                    <div className="font-bold">Refolosibilitate</div>
                    <div className="text-sm text-muted-foreground">
                      Services pot fi refolosite în contexte diferite
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dependency Injection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Dependency Injection cu Awilix
          </CardTitle>
          <CardDescription>
            Injectarea automată a dependențelor pentru cuplaj redus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="before">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="before">❌ Fără DI</TabsTrigger>
              <TabsTrigger value="after">✅ Cu DI</TabsTrigger>
            </TabsList>

            <TabsContent value="before" className="space-y-4">
              <Alert>
                <AlertDescription>
                  <strong>Probleme:</strong> Cuplaj strâns, greu de testat, dependențe hardcodate
                </AlertDescription>
              </Alert>

              <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`// ❌ Controller cu dependențe hardcodate
class PlanController {
  constructor() {
    // Creare manuală - cuplaj strâns!
    this.planService = new PlanService();
  }
  
  async getAllPlans(req, res) {
    // Service-ul este hardcodat
    const plans = await this.planService.getAllPlans();
    res.json(plans);
  }
}

// ❌ Service cu dependențe hardcodate
class PlanService {
  constructor() {
    // Repository hardcodat
    this.planRepository = new PlanRepository();
    this.prisma = new PrismaClient(); // Direct coupling!
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="after" className="space-y-4">
              <Alert className="border-green-500">
                <AlertDescription>
                  <strong>Avantaje:</strong> Cuplaj redus, testabil, flexibil, dependencies gestionate central
                </AlertDescription>
              </Alert>

              <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`// ✅ Controller cu Dependency Injection
class PlanController {
  constructor(planService) {
    // Dependența este injectată!
    this.planService = planService;
  }
  
  async getAllPlans(req, res) {
    const plans = await this.planService.getAllPlans();
    res.json(plans);
  }
}

// ✅ Service cu Dependency Injection
class PlanService {
  constructor(planRepository) {
    // Repository injectat - decuplat!
    this.planRepository = planRepository;
  }
}

// ✅ Container configurare (Awilix)
const container = createContainer();
container.register({
  planRepository: asClass(PlanRepository).singleton(),
  planService: asClass(PlanService).scoped(),
  planController: asClass(PlanController).scoped()
});`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lifetime Scopes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-6 h-6" />
            Lifetime Scopes (Scopuri de Viață)
          </CardTitle>
          <CardDescription>
            Controlul ciclului de viață al dependențelor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeLifetime} onValueChange={setActiveLifetime}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="singleton">
                <RefreshCw className="w-4 h-4 mr-2" />
                SINGLETON
              </TabsTrigger>
              <TabsTrigger value="scoped">
                <Users className="w-4 h-4 mr-2" />
                SCOPED
              </TabsTrigger>
              <TabsTrigger value="transient">
                <Zap className="w-4 h-4 mr-2" />
                TRANSIENT
              </TabsTrigger>
            </TabsList>

            <TabsContent value="singleton" className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <Badge>SINGLETON</Badge>
                  <span>O singură instanță pentru întreaga aplicație</span>
                </div>
                <p className="text-sm mb-4">
                  Container-ul creează o singură instanță care este partajată în toată aplicația.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold text-sm mb-2">✅ Când să folosești:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Database connections</li>
                      <li>Configuration objects</li>
                      <li>Logging services</li>
                      <li>Cache managers</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-sm mb-2">⚠️ Atenție:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Thread-safety în aplicații concurente</li>
                      <li>Memory leaks dacă stochezi prea multe date</li>
                      <li>State partajat între requests</li>
                    </ul>
                  </div>
                </div>

                <pre className="bg-muted p-3 rounded text-xs mt-4 overflow-x-auto">
{`container.register({
  prismaClient: asValue(new PrismaClient()).singleton(),
  planRepository: asClass(PlanRepository).singleton()
});

// Ambele resolve-uri returnează ACEEAȘI instanță
const repo1 = container.resolve('planRepository');
const repo2 = container.resolve('planRepository');
console.log(repo1 === repo2); // true`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="scoped" className="space-y-4">
              <div className="bg-green-50 dark:bg-green-950 p-4 rounded">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <Badge>SCOPED</Badge>
                  <span>O instanță per scope (de obicei per request HTTP)</span>
                </div>
                <p className="text-sm mb-4">
                  Fiecare scope (request) primește propria instanță, dar în cadrul aceluiași scope
                  instanța este partajată.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold text-sm mb-2">✅ Când să folosești:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Services (business logic)</li>
                      <li>Controllers</li>
                      <li>Request-specific data</li>
                      <li>Transaction coordinators</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-sm mb-2">💡 Avantaje:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Izolează state-ul între requests</li>
                      <li>Performanță mai bună decât TRANSIENT</li>
                      <li>Previne race conditions</li>
                    </ul>
                  </div>
                </div>

                <pre className="bg-muted p-3 rounded text-xs mt-4 overflow-x-auto">
{`container.register({
  planService: asClass(PlanService).scoped(),
  planController: asClass(PlanController).scoped()
});

// Middleware: creează scope per request
app.use((req, res, next) => {
  req.scope = container.createScope();
  next();
});

// În aceeași request - aceeași instanță
const service1 = req.scope.resolve('planService');
const service2 = req.scope.resolve('planService');
console.log(service1 === service2); // true

// Request diferit - instanță diferită`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="transient" className="space-y-4">
              <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded">
                <div className="font-bold mb-2 flex items-center gap-2">
                  <Badge>TRANSIENT</Badge>
                  <span>O instanță nouă la fiecare resolve</span>
                </div>
                <p className="text-sm mb-4">
                  Container-ul creează o instanță nouă de fiecare dată când dependența este
                  cerută.
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold text-sm mb-2">✅ Când să folosești:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Lightweight objects</li>
                      <li>Objects cu state mutable</li>
                      <li>Short-lived operations</li>
                      <li>Când vrei izolare completă</li>
                    </ul>
                  </div>

                  <div>
                    <div className="font-bold text-sm mb-2">⚠️ Atenție:</div>
                    <ul className="text-sm space-y-1 list-disc list-inside">
                      <li>Overhead de creare instanțe</li>
                      <li>Memory usage crescut</li>
                      <li>GC pressure</li>
                      <li>Evită pentru obiecte heavy</li>
                    </ul>
                  </div>
                </div>

                <pre className="bg-muted p-3 rounded text-xs mt-4 overflow-x-auto">
{`container.register({
  requestId: asClass(RequestIdGenerator).transient(),
  fileProcessor: asClass(FileProcessor).transient()
});

// Fiecare resolve returnează instanță DIFERITĂ
const gen1 = container.resolve('requestId');
const gen2 = container.resolve('requestId');
console.log(gen1 === gen2); // false

// Exemplu performanță (10k iterations):
// SINGLETON:  ~2ms
// SCOPED:     ~15ms (cu 100 scopes)
// TRANSIENT:  ~45ms`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Exemple de Cod Complete</CardTitle>
          <CardDescription>
            Implementare completă Service Layer + DI cu Awilix
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="service">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="service">Service</TabsTrigger>
              <TabsTrigger value="repository">Repository</TabsTrigger>
              <TabsTrigger value="controller">Controller</TabsTrigger>
              <TabsTrigger value="container">Container</TabsTrigger>
            </TabsList>

            <TabsContent value="service" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>PlanService.js</strong> - Business logic layer
              </div>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
{`class PlanService {
  constructor(planRepository) {
    this.planRepository = planRepository;
  }

  async getAllPlans() {
    const plans = await this.planRepository.findAll();
    
    // Business logic: Add computed fields
    return plans.map(plan => ({
      ...plan,
      valueScore: this.calculateValueScore(plan),
      recommendedPrice: this.calculateRecommendedPrice(plan)
    }));
  }

  async createPlan(planData) {
    // Business validation
    this.validatePlanData(planData);
    
    // Check for duplicates
    const existing = await this.planRepository.findByName(planData.name);
    if (existing) {
      throw new Error('Plan with this name already exists');
    }
    
    return await this.planRepository.create(planData);
  }

  validatePlanData(data) {
    if (!data.name || data.name.length < 3) {
      throw new Error('Plan name must be at least 3 characters');
    }
    
    if (data.price < 0) {
      throw new Error('Price cannot be negative');
    }
    
    if (data.maxFiles && data.maxFiles < 1) {
      throw new Error('maxFiles must be at least 1');
    }
  }

  calculateValueScore(plan) {
    // Business logic: Calculate value for money
    const fileValue = (plan.maxFiles || 10) / 10;
    const dashboardValue = (plan.maxDashboards || 5) / 5;
    const priceValue = 100 / (plan.price || 1);
    
    return ((fileValue + dashboardValue + priceValue) / 3).toFixed(2);
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="repository" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>PlanRepository.js</strong> - Data access layer
              </div>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
{`class PlanRepository {
  constructor(prismaClient = null) {
    this.prisma = prismaClient || require('../../config/prisma');
  }

  async findAll() {
    return await this.prisma.plan.findMany({
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { price: 'asc' }
    });
  }

  async findById(planId) {
    return await this.prisma.plan.findUnique({
      where: { id: planId },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        }
      }
    });
  }

  async findByName(name) {
    return await this.prisma.plan.findUnique({
      where: { name: name }
    });
  }

  async create(planData) {
    return await this.prisma.plan.create({
      data: planData
    });
  }

  async update(planId, updateData) {
    return await this.prisma.plan.update({
      where: { id: planId },
      data: updateData
    });
  }

  async delete(planId) {
    return await this.prisma.plan.delete({
      where: { id: planId }
    });
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="controller" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>PlanController.js</strong> - Presentation layer cu DI
              </div>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
{`class PlanController {
  constructor(planService) {
    // Dependency injection - service injectat!
    this.planService = planService;
  }

  async getAllPlans(req, res) {
    try {
      const plans = await this.planService.getAllPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ 
        error: 'Failed to fetch plans',
        message: error.message 
      });
    }
  }

  async createPlan(req, res) {
    try {
      const newPlan = await this.planService.createPlan(req.body);
      res.status(201).json(newPlan);
    } catch (error) {
      if (error.message.includes('already exists')) {
        return res.status(409).json({ error: error.message });
      }
      
      if (error.message.includes('must be')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to create plan' });
    }
  }

  async deletePlan(req, res) {
    try {
      await this.planService.deletePlan(req.params.id);
      res.status(204).send();
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({ error: error.message });
      }
      
      if (error.message.includes('Cannot delete')) {
        return res.status(400).json({ error: error.message });
      }
      
      res.status(500).json({ error: 'Failed to delete plan' });
    }
  }
}`}
              </pre>
            </TabsContent>

            <TabsContent value="container" className="space-y-2">
              <div className="text-sm text-muted-foreground mb-2">
                <strong>container.js</strong> - Awilix DI container configuration
              </div>
              <pre className="bg-muted p-4 rounded overflow-x-auto text-xs">
{`const { createContainer, asClass, asValue } = require('awilix');
const { PrismaClient } = require('@prisma/client');

function createDIContainer() {
  const container = createContainer();
  
  // Database client - SINGLETON (shared across app)
  const prismaClient = new PrismaClient();
  
  container.register({
    // Infrastructure
    prismaClient: asValue(prismaClient).singleton(),
    
    // Repositories - SINGLETON (no state, can be shared)
    planRepository: asClass(PlanRepository).singleton(),
    userRepository: asClass(UserRepository).singleton(),
    fileRepository: asClass(FileRepository).singleton(),
    
    // Services - SCOPED (one per request)
    planService: asClass(PlanService).scoped(),
    userService: asClass(UserService).scoped(),
    fileService: asClass(FileService).scoped(),
    
    // Controllers - SCOPED (one per request)
    planController: asClass(PlanController).scoped(),
    userController: asClass(UserController).scoped(),
    fileController: asClass(FileController).scoped()
  });
  
  return container;
}

// Express middleware pentru scoped dependencies
function createScopePerRequest(container) {
  return (req, res, next) => {
    req.scope = container.createScope();
    
    res.on('finish', () => {
      req.scope.dispose();
    });
    
    next();
  };
}

// Usage în Express app
const container = createDIContainer();
app.use(createScopePerRequest(container));

// Routing cu DI
app.get('/api/plans', (req, res) => {
  const controller = req.scope.resolve('planController');
  controller.getAllPlans(req, res);
});`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Benefits Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Beneficiile Arhitecturii cu Service Layer + DI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Without Service Layer */}
            <div className="space-y-2">
              <div className="font-bold text-red-600 dark:text-red-400">
                ❌ Fără Service Layer
              </div>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Logica de business în controllers (fat controllers)</li>
                <li>Duplicare cod între controllers</li>
                <li>Greu de testat business logic izolat</li>
                <li>Controllers strâns cuplați cu database</li>
                <li>Dificil de refolosit logica în alte contexte</li>
                <li>Mixing of concerns (HTTP + business + data)</li>
              </ul>
            </div>

            {/* With Service Layer */}
            <div className="space-y-2">
              <div className="font-bold text-green-600 dark:text-green-400">
                ✅ Cu Service Layer + DI
              </div>
              <ul className="text-sm space-y-2 list-disc list-inside text-muted-foreground">
                <li>Business logic centralizată în services</li>
                <li>Controllers thin - doar HTTP handling</li>
                <li>Testare ușoară cu mock dependencies</li>
                <li>Refolosire services în API, CLI, background jobs</li>
                <li>Separation of concerns clară</li>
                <li>Flexibilitate în schimbarea implementărilor</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Testing Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>Testare cu Dependency Injection</CardTitle>
          <CardDescription>
            DI face testarea mult mai ușoară prin mock dependencies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded overflow-x-auto text-sm">
{`// Testing cu DI - injectăm mock repository
const mockRepository = {
  findAll: jest.fn().mockResolvedValue([
    { id: 1, name: 'Free', price: 0 },
    { id: 2, name: 'Pro', price: 19.99 }
  ]),
  findById: jest.fn(),
  create: jest.fn()
};

// Service cu mock dependency injectat
const planService = new PlanService(mockRepository);

// Test izolat - nu accesează database-ul real!
test('getAllPlans should add computed fields', async () => {
  const plans = await planService.getAllPlans();
  
  expect(plans).toHaveLength(2);
  expect(plans[0]).toHaveProperty('valueScore');
  expect(plans[0]).toHaveProperty('recommendedPrice');
  expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
});

// Test business validation
test('createPlan should validate plan name', async () => {
  await expect(
    planService.createPlan({ name: 'ab', price: 10 })
  ).rejects.toThrow('Plan name must be at least 3 characters');
  
  // Repository nu a fost apelat - validarea a eșuat înainte
  expect(mockRepository.create).not.toHaveBeenCalled();
});`}
          </pre>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader>
          <CardTitle>Cerințe și Livrabile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-bold mb-2">📋 Cerințe Implementate:</div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">✅</Badge>
                  <span>
                    <strong>Service Layer:</strong> PlanService, UserService, FileService cu
                    business logic separată
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">✅</Badge>
                  <span>
                    <strong>Repository Pattern:</strong> PlanRepository, UserRepository,
                    FileRepository pentru data access
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">✅</Badge>
                  <span>
                    <strong>Dependency Injection:</strong> Awilix container cu constructor
                    injection
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">✅</Badge>
                  <span>
                    <strong>Lifetime Scopes:</strong> SINGLETON, SCOPED, TRANSIENT demonstate și
                    documentate
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">✅</Badge>
                  <span>
                    <strong>Express Integration:</strong> Middleware pentru scoped dependencies
                    per request
                  </span>
                </li>
              </ul>
            </div>

            <div>
              <div className="font-bold mb-2">📁 Fișiere Cod Sursă:</div>
              <div className="grid md:grid-cols-2 gap-2 text-sm font-mono">
                <div>services/PlanService.js</div>
                <div>services/UserService.js</div>
                <div>repositories/PlanRepository.js</div>
                <div>repositories/UserRepository.js</div>
                <div>controllers/PlanController.js</div>
                <div>routes/plans-with-di.js</div>
                <div>infrastructure/container.js</div>
                <div>infrastructure/app.js</div>
                <div>infrastructure/lifetime-demo.js</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Resurse și Documentație</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-bold mb-2">📚 Awilix Documentation</div>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  <a
                    href="https://github.com/jeffijoe/awilix"
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    Awilix GitHub
                  </a>
                </li>
                <li>Lifetime management patterns</li>
                <li>Express.js integration guide</li>
              </ul>
            </div>

            <div>
              <div className="font-bold mb-2">🎯 Design Patterns</div>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>Dependency Injection Pattern</li>
                <li>Repository Pattern</li>
                <li>Service Layer Pattern</li>
                <li>Inversion of Control (IoC)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Lab 10 implementează arhitectura multi-nivel cu Service Layer și Dependency Injection
        </p>
        <p>Folosind Awilix pentru IoC container și Prisma pentru data access</p>
      </div>
    </div>
  );
}
