'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/layout/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/layout/tabs';
import { Badge } from '@/components/ui/text/badge';
import { Alert, AlertDescription } from '@/components/ui/feedback/alert';
import { 
  CheckCircle2, 
  XCircle, 
  FileSearch, 
  FileText, 
  Terminal,
  Code,
  AlertTriangle,
  Info,
  Bug,
  Zap,
  Package,
  Server,
  Database,
  Settings
} from 'lucide-react';

export default function Lab11Page() {
  const [activeTab, setActiveTab] = useState('review');

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Lab 11: Code Review, Logging & Documentation</h1>
        <p className="text-xl text-muted-foreground">
          Professional development practices: code quality, monitoring, and deployment documentation
        </p>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-6 h-6" />
            Obiective Laborator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Alert>
              <FileSearch className="w-4 h-4" />
              <AlertDescription>
                <strong>Code Review</strong> - Verificare calitate cod, best practices, și standardizare
              </AlertDescription>
            </Alert>

            <Alert>
              <FileText className="w-4 h-4" />
              <AlertDescription>
                <strong>Logging System</strong> - Monitorizare aplicație cu Winston/Pino pentru debugging
              </AlertDescription>
            </Alert>

            <Alert>
              <Terminal className="w-4 h-4" />
              <AlertDescription>
                <strong>Documentation</strong> - Ghid instalare și configurare pentru deployment
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Conținut Laborator</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="review">
                <FileSearch className="w-4 h-4 mr-2" />
                Code Review
              </TabsTrigger>
              <TabsTrigger value="logging">
                <FileText className="w-4 h-4 mr-2" />
                Logging
              </TabsTrigger>
              <TabsTrigger value="docs">
                <Terminal className="w-4 h-4 mr-2" />
                Documentation
              </TabsTrigger>
            </TabsList>

            {/* CODE REVIEW TAB */}
            <TabsContent value="review" className="space-y-6">
              {/* Code Review Process */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    Procesul de Code Review
                  </CardTitle>
                  <CardDescription>
                    Etape și metodologie pentru verificarea calității codului
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border-l-4 border-blue-500">
                      <div className="font-bold mb-2">📋 Etapa 1: Prezentare Funcționalități</div>
                      <p className="text-sm mb-2">Demonstrație live a implementării curente:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Dashboard management (create, read, update, delete)</li>
                        <li>File upload și CSV parsing cu type detection</li>
                        <li>Chart visualization (Bar, Line, Pie, Multi-series)</li>
                        <li>User authentication cu JWT tokens</li>
                        <li>Plan subscription system</li>
                        <li>Soft delete implementation pentru recovery</li>
                        <li>Service Layer cu Dependency Injection</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border-l-4 border-green-500">
                      <div className="font-bold mb-2">📤 Etapa 2: Postare Cod</div>
                      <p className="text-sm mb-2">Submisie cod pe Google Classroom:</p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Git repository link (GitHub/GitLab) - <strong>PREFERAT</strong></li>
                        <li>Sau arhivă .zip cu cod complet (fără node_modules, .next)</li>
                        <li>Include README.md cu instrucțiuni setup</li>
                        <li>Include .env.example cu variabile necesare</li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950 p-4 rounded-lg border-l-4 border-purple-500">
                      <div className="font-bold mb-2">🔍 Etapa 3: Verificare de Către Cadrul Didactic</div>
                      <p className="text-sm mb-2">Review bazat pe criteriile de mai jos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Code Review Checklist */}
              <Card>
                <CardHeader>
                  <CardTitle>✅ Checklist Code Review</CardTitle>
                  <CardDescription>
                    Criterii de evaluare pentru controllers și business logic
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="controllers">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="controllers">Controllers</TabsTrigger>
                      <TabsTrigger value="general">General Code Quality</TabsTrigger>
                    </TabsList>

                    <TabsContent value="controllers" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                          <div>
                            <div className="font-bold text-red-600 dark:text-red-400">
                              ❌ Business Logic în Controllers
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Controllers NU trebuie să conțină logică de business complexă
                            </p>
                            <pre className="bg-muted p-3 rounded text-xs mt-2 overflow-x-auto">
{`// ❌ GREȘIT - Business logic în controller
async createPlan(req, res) {
  const { name, price, maxDashboards } = req.body;
  
  // Validare complexă în controller - BAD!
  if (!name || name.length < 3) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  
  // Calculare preț în controller - BAD!
  const discount = price > 50 ? 0.1 : 0;
  const finalPrice = price * (1 - discount);
  
  // Direct database access - BAD!
  const plan = await prisma.plan.create({
    data: { name, price: finalPrice, maxDashboards }
  });
  
  res.json(plan);
}`}
                            </pre>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                          <div>
                            <div className="font-bold text-green-600 dark:text-green-400">
                              ✅ Controllers Thin - Delegation la Services
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Controllers trebuie să fie responsabili DOAR de HTTP handling
                            </p>
                            <pre className="bg-muted p-3 rounded text-xs mt-2 overflow-x-auto">
{`// ✅ CORECT - Thin controller cu delegation
class PlanController {
  constructor(planService) {
    this.planService = planService;
  }
  
  async createPlan(req, res) {
    try {
      // Doar delegare la service layer
      const plan = await this.planService.createPlan(req.body);
      res.status(201).json(plan);
    } catch (error) {
      // Doar error handling HTTP
      if (error.message.includes('validation')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

// Business logic în PlanService
class PlanService {
  validatePlanData(data) { /* validare */ }
  calculatePricing(price) { /* calcule */ }
  async createPlan(data) { /* orchestration */ }
}`}
                            </pre>
                          </div>
                        </div>

                        <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded">
                          <div className="font-bold mb-2 flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Lucruri de Evitat în Controllers (10 Things to Avoid)
                          </div>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            <li><strong>Business Logic</strong> - Mutați în services</li>
                            <li><strong>Direct Database Calls</strong> - Folosiți repositories</li>
                            <li><strong>Complex Validation</strong> - Folosiți validation middleware sau services</li>
                            <li><strong>Data Transformation</strong> - Mutați în services sau mappers</li>
                            <li><strong>Hardcoded Values</strong> - Folosiți configuration files</li>
                            <li><strong>Fat Controllers</strong> - Păstrați controllers sub 50 linii/metodă</li>
                            <li><strong>Exception Swallowing</strong> - Log și propagați errors corect</li>
                            <li><strong>Mixing Concerns</strong> - Un controller = o responsabilitate</li>
                            <li><strong>Direct Dependencies</strong> - Folosiți Dependency Injection</li>
                            <li><strong>No Async/Await</strong> - Toate operațiile I/O trebuie async</li>
                          </ul>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="general" className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Code className="w-4 h-4" />
                              Code Organization
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Foldere organizate (controllers/, services/, repositories/)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Naming conventions consistente (camelCase, PascalCase)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Un fișier = o clasă/componentă principală</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Separation of concerns (prezentare / logic / date)</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Bug className="w-4 h-4" />
                              Error Handling
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Try-catch blocks în toate metodele async</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Logging errors cu stack trace</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>HTTP status codes corecte (400, 404, 500)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Error messages user-friendly (nu expun stack traces)</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Database Access
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Repository pattern pentru encapsulation</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Prisma ORM pentru type safety</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Include related data când e necesar (relations)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Evitare N+1 queries (folosiți include)</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <Settings className="w-4 h-4" />
                              Best Practices
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="text-sm space-y-2">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Environment variables pentru configurări (.env)</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Validare input la toate endpoint-urile</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Authentication middleware pentru rute protejate</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span>Comentarii doar pentru logică complexă</span>
                              </li>
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* LOGGING TAB */}
            <TabsContent value="logging" className="space-y-6">
              {/* Why Logging */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    De Ce Avem Nevoie de Logging?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-bold">🐛 Debugging Production Issues</div>
                      <p className="text-sm text-muted-foreground">
                        Console.log nu funcționează în production - logs persistente salvează timpul
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold">📊 Monitoring Performance</div>
                      <p className="text-sm text-muted-foreground">
                        Timp execuție queries, API calls, operații critice
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold">🔒 Security Auditing</div>
                      <p className="text-sm text-muted-foreground">
                        Track failed logins, unauthorized access attempts, data changes
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold">📈 Business Analytics</div>
                      <p className="text-sm text-muted-foreground">
                        User behavior, feature usage, conversion tracking
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Winston Setup */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    Winston Logger Setup (Node.js)
                  </CardTitle>
                  <CardDescription>
                    Echivalent NLog pentru aplicații Express/Next.js
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="font-bold mb-2">📦 Etapa 1: Instalare Winston</div>
                      <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm">
{`npm install winston winston-daily-rotate-file`}
                      </pre>
                    </div>

                    <div>
                      <div className="font-bold mb-2">⚙️ Etapa 2: Configurare Logger</div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Creați <code className="bg-muted px-1 rounded">config/logger.js</code>:
                      </p>
                      <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');

// Custom format pentru logs
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...metadata }) => {
    let msg = \`\${timestamp} [\${level.toUpperCase()}]: \${message}\`;
    
    // Add metadata if exists
    if (Object.keys(metadata).length > 0) {
      msg += \` \${JSON.stringify(metadata)}\`;
    }
    
    // Add stack trace for errors
    if (stack) {
      msg += \`\\n\${stack}\`;
    }
    
    return msg;
  })
);

// Transport pentru fișiere cu rotație zilnică
const fileRotateTransport = new DailyRotateFile({
  filename: path.join('logs', 'application-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: logFormat
});

// Transport pentru erori separate
const errorFileTransport = new DailyRotateFile({
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  maxSize: '20m',
  maxFiles: '30d',
  format: logFormat
});

// Creare logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [
    fileRotateTransport,
    errorFileTransport,
    
    // Console pentru development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        logFormat
      )
    })
  ]
});

module.exports = logger;`}
                      </pre>
                    </div>

                    <div>
                      <div className="font-bold mb-2">🎯 Etapa 3: Utilizare în Controllers</div>
                      <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`const logger = require('../config/logger');

class PlanController {
  constructor(planService) {
    this.planService = planService;
  }
  
  async getAllPlans(req, res) {
    try {
      logger.info('Fetching all plans', { 
        userId: req.user?.id,
        endpoint: '/api/plans'
      });
      
      const plans = await this.planService.getAllPlans();
      
      logger.info('Successfully fetched plans', { 
        count: plans.length,
        userId: req.user?.id
      });
      
      res.json(plans);
    } catch (error) {
      logger.error('Failed to fetch plans', {
        error: error.message,
        stack: error.stack,
        userId: req.user?.id,
        endpoint: '/api/plans'
      });
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async createPlan(req, res) {
    try {
      const planData = req.body;
      
      logger.info('Creating new plan', {
        planName: planData.name,
        userId: req.user?.id
      });
      
      const plan = await this.planService.createPlan(planData);
      
      logger.info('Plan created successfully', {
        planId: plan.id,
        planName: plan.name,
        userId: req.user?.id
      });
      
      res.status(201).json(plan);
    } catch (error) {
      if (error.message.includes('already exists')) {
        logger.warn('Plan creation failed - duplicate name', {
          planName: req.body.name,
          userId: req.user?.id
        });
        return res.status(409).json({ error: error.message });
      }
      
      logger.error('Failed to create plan', {
        error: error.message,
        stack: error.stack,
        planData: req.body,
        userId: req.user?.id
      });
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
  
  async deletePlan(req, res) {
    const { id } = req.params;
    
    try {
      logger.info('Deleting plan', {
        planId: id,
        userId: req.user?.id
      });
      
      await this.planService.deletePlan(id);
      
      logger.info('Plan deleted successfully', {
        planId: id,
        userId: req.user?.id
      });
      
      res.status(204).send();
    } catch (error) {
      logger.error('Failed to delete plan', {
        error: error.message,
        planId: id,
        userId: req.user?.id
      });
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}`}
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Log Levels */}
              <Card>
                <CardHeader>
                  <CardTitle>📊 Log Levels și Când să le Folosești</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="bg-red-50 dark:bg-red-950 p-3 rounded border-l-4 border-red-500">
                      <div className="font-bold text-red-600 dark:text-red-400">ERROR</div>
                      <p className="text-sm mt-1">
                        Erori critice care împiedică funcționarea - database connection failed, external API down
                      </p>
                      <code className="text-xs">logger.error('Database connection failed', error)</code>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded border-l-4 border-yellow-500">
                      <div className="font-bold text-yellow-600 dark:text-yellow-400">WARN</div>
                      <p className="text-sm mt-1">
                        Situații neobișnuite dar recuperabile - failed login attempts, deprecated API usage
                      </p>
                      <code className="text-xs">logger.warn('Failed login attempt', {'{'} username {'}'})</code>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded border-l-4 border-blue-500">
                      <div className="font-bold text-blue-600 dark:text-blue-400">INFO</div>
                      <p className="text-sm mt-1">
                        Operații importante de business - user created, plan purchased, dashboard exported
                      </p>
                      <code className="text-xs">logger.info('User registered', {'{'} userId, email {'}'})</code>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-950 p-3 rounded border-l-4 border-purple-500">
                      <div className="font-bold text-purple-600 dark:text-purple-400">DEBUG</div>
                      <p className="text-sm mt-1">
                        Informații detaliate pentru debugging - query parameters, intermediate results
                      </p>
                      <code className="text-xs">logger.debug('Query params', {'{'} filter, sort, page {'}'})</code>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded border-l-4 border-gray-500">
                      <div className="font-bold text-gray-600 dark:text-gray-400">TRACE</div>
                      <p className="text-sm mt-1">
                        Cel mai detaliat nivel - toate operațiile, folosit pentru investigații profunde
                      </p>
                      <code className="text-xs">logger.trace('Entering function', {'{'} args {'}'})</code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Log Examples */}
              <Card>
                <CardHeader>
                  <CardTitle>📝 Exemple Complete de Logging</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="crud">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="crud">CRUD Operations</TabsTrigger>
                      <TabsTrigger value="auth">Authentication</TabsTrigger>
                      <TabsTrigger value="perf">Performance</TabsTrigger>
                    </TabsList>

                    <TabsContent value="crud" className="space-y-2">
                      <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`// Dashboard CRUD logging
async createDashboard(req, res) {
  const startTime = Date.now();
  
  try {
    logger.info('Creating dashboard', {
      userId: req.user.id,
      dashboardName: req.body.name
    });
    
    const dashboard = await this.dashboardService.create(req.body);
    
    const duration = Date.now() - startTime;
    logger.info('Dashboard created successfully', {
      dashboardId: dashboard.id,
      userId: req.user.id,
      duration: \`\${duration}ms\`
    });
    
    res.status(201).json(dashboard);
  } catch (error) {
    logger.error('Dashboard creation failed', {
      error: error.message,
      stack: error.stack,
      userId: req.user.id,
      requestBody: req.body
    });
    res.status(500).json({ error: 'Failed to create dashboard' });
  }
}`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="auth" className="space-y-2">
                      <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`// Authentication logging
async login(req, res) {
  const { email, password } = req.body;
  
  try {
    logger.info('Login attempt', {
      email,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    
    const user = await this.authService.login(email, password);
    
    logger.info('Login successful', {
      userId: user.id,
      email: user.email,
      ip: req.ip
    });
    
    res.json({ token: user.token });
  } catch (error) {
    logger.warn('Login failed', {
      email,
      reason: error.message,
      ip: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.status(401).json({ error: 'Invalid credentials' });
  }
}`}
                      </pre>
                    </TabsContent>

                    <TabsContent value="perf" className="space-y-2">
                      <pre className="bg-muted p-4 rounded text-xs overflow-x-auto">
{`// Performance monitoring
async getAnalytics(req, res) {
  const timers = {
    start: Date.now(),
    dbQuery: 0,
    processing: 0
  };
  
  try {
    logger.debug('Fetching analytics', {
      userId: req.user.id,
      filters: req.query
    });
    
    // Database query
    const dbStart = Date.now();
    const data = await this.analyticsService.getData(req.query);
    timers.dbQuery = Date.now() - dbStart;
    
    // Data processing
    const processStart = Date.now();
    const processed = this.analyticsService.process(data);
    timers.processing = Date.now() - processStart;
    
    const totalDuration = Date.now() - timers.start;
    
    logger.info('Analytics fetched successfully', {
      userId: req.user.id,
      recordCount: processed.length,
      timings: {
        total: \`\${totalDuration}ms\`,
        database: \`\${timers.dbQuery}ms\`,
        processing: \`\${timers.processing}ms\`
      }
    });
    
    // Alert for slow queries
    if (totalDuration > 1000) {
      logger.warn('Slow analytics query detected', {
        duration: \`\${totalDuration}ms\`,
        filters: req.query,
        userId: req.user.id
      });
    }
    
    res.json(processed);
  } catch (error) {
    logger.error('Analytics fetch failed', {
      error: error.message,
      stack: error.stack,
      timings: timers,
      userId: req.user.id
    });
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
}`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* DOCUMENTATION TAB */}
            <TabsContent value="docs" className="space-y-6">
              {/* Installation Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Documentație Instalare Aplicație
                  </CardTitle>
                  <CardDescription>
                    Pași completi pentru setup și deployment pe un calculator nou
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-500">
                    <Info className="w-4 h-4" />
                    <AlertDescription>
                      Această documentație trebuie inclusă ca <code>INSTALL.md</code> în repository
                    </AlertDescription>
                  </Alert>

                  <div className="bg-muted p-6 rounded-lg space-y-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3">📋 DataInsight Dashboard - Installation Guide</h3>
                      <p className="text-sm text-muted-foreground">
                        Ghid complet de instalare și configurare pentru aplicația DataInsight Dashboard
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="font-bold mb-2">🔧 Prerequisites (Cerințe Preliminare)</div>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li><strong>Node.js</strong> v18.x sau superior (<a href="https://nodejs.org" className="text-blue-500 underline">Download</a>)</li>
                          <li><strong>PostgreSQL</strong> v14.x sau superior (<a href="https://www.postgresql.org/download/" className="text-blue-500 underline">Download</a>)</li>
                          <li><strong>Git</strong> pentru clonare repository (<a href="https://git-scm.com/" className="text-blue-500 underline">Download</a>)</li>
                          <li><strong>npm</strong> sau <strong>yarn</strong> package manager (vine cu Node.js)</li>
                        </ul>
                      </div>

                      <div>
                        <div className="font-bold mb-2">📥 Step 1: Clonare Repository</div>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm mt-2">
{`git clone https://github.com/username/datainsight-dashboard.git
cd datainsight-dashboard`}
                        </pre>
                      </div>

                      <div>
                        <div className="font-bold mb-2">📦 Step 2: Instalare Dependencies</div>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm mt-2">
{`# Frontend dependencies
npm install

# Backend dependencies (dacă există folder separat)
cd labs_api
npm install
cd ..`}
                        </pre>
                      </div>

                      <div>
                        <div className="font-bold mb-2">🗄️ Step 3: Configurare Database</div>
                        <div className="space-y-2 text-sm">
                          <p><strong>3.1</strong> Creați database PostgreSQL:</p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded">
{`# Conectați-vă la PostgreSQL
psql -U postgres

# Creați database
CREATE DATABASE datainsight;

# Creați user (opțional)
CREATE USER datainsight_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE datainsight TO datainsight_user;

# Exit psql
\\q`}
                          </pre>

                          <p className="mt-3"><strong>3.2</strong> Rulați schema setup (dacă există):</p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded">
{`psql -U postgres -d datainsight -f scripts/DB/setup-database.sql`}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold mb-2">⚙️ Step 4: Configurare Environment Variables</div>
                        <div className="space-y-2 text-sm">
                          <p>Creați fișier <code>.env</code> în root:</p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded overflow-x-auto">
{`# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/datainsight"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend (Next.js)
NEXT_PUBLIC_API_URL="http://localhost:3001/api"

# Logging
LOG_LEVEL=info

# Upload
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=10485760`}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold mb-2">🔄 Step 5: Rulare Prisma Migrations</div>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm mt-2">
{`# Generate Prisma Client
npx prisma generate

# Run migrations (dacă există)
npx prisma migrate deploy

# Seed database cu date inițiale (opțional)
npm run seed`}
                        </pre>
                      </div>

                      <div>
                        <div className="font-bold mb-2">▶️ Step 6: Pornire Aplicație</div>
                        <div className="space-y-2 text-sm">
                          <p><strong>Development Mode:</strong></p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded">
{`# Terminal 1 - Backend API
cd labs_api
npm run dev

# Terminal 2 - Frontend (Next.js)
npm run dev`}
                          </pre>

                          <p className="mt-3"><strong>Production Mode:</strong></p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded">
{`# Build frontend
npm run build

# Start production servers
cd labs_api && npm start &
npm start`}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold mb-2">🌐 Step 7: Verificare Instalare</div>
                        <div className="space-y-2 text-sm">
                          <p>Accesați în browser:</p>
                          <ul className="list-disc list-inside space-y-1">
                            <li><strong>Frontend:</strong> <code>http://localhost:3000</code></li>
                            <li><strong>Backend API:</strong> <code>http://localhost:3001/api</code></li>
                            <li><strong>Prisma Studio:</strong> <code>npx prisma studio</code> (port 5555)</li>
                          </ul>

                          <p className="mt-3">Test endpoints:</p>
                          <pre className="bg-slate-950 text-slate-50 p-3 rounded">
{`# Test API health
curl http://localhost:3001/api/health

# Test database connection
curl http://localhost:3001/api/plans`}
                          </pre>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold mb-2">🐛 Troubleshooting</div>
                        <div className="space-y-2 text-sm">
                          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded">
                            <p className="font-bold">Database connection error:</p>
                            <ul className="list-disc list-inside mt-1">
                              <li>Verificați că PostgreSQL rulează: <code>pg_isready</code></li>
                              <li>Verificați DATABASE_URL în .env</li>
                              <li>Verificați firewall pentru port 5432</li>
                            </ul>
                          </div>

                          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded">
                            <p className="font-bold">Port already in use:</p>
                            <ul className="list-disc list-inside mt-1">
                              <li>Găsiți procesul: <code>lsof -i :3000</code> (Mac/Linux) sau <code>netstat -ano | findstr :3000</code> (Windows)</li>
                              <li>Închideți procesul sau schimbați port în .env</li>
                            </ul>
                          </div>

                          <div className="bg-yellow-50 dark:bg-yellow-950 p-3 rounded">
                            <p className="font-bold">Prisma errors:</p>
                            <ul className="list-disc list-inside mt-1">
                              <li>Regenerați client: <code>npx prisma generate</code></li>
                              <li>Reset database: <code>npx prisma migrate reset</code></li>
                              <li>Verificați schema.prisma pentru erori syntax</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="font-bold mb-2">📚 Resurse Adiționale</div>
                        <ul className="text-sm space-y-1 list-disc list-inside">
                          <li><strong>Prisma Docs:</strong> <a href="https://www.prisma.io/docs" className="text-blue-500 underline">prisma.io/docs</a></li>
                          <li><strong>Next.js Docs:</strong> <a href="https://nextjs.org/docs" className="text-blue-500 underline">nextjs.org/docs</a></li>
                          <li><strong>PostgreSQL Docs:</strong> <a href="https://www.postgresql.org/docs" className="text-blue-500 underline">postgresql.org/docs</a></li>
                        </ul>
                      </div>

                      <div>
                        <div className="font-bold mb-2">👤 Credențiale Test</div>
                        <p className="text-sm">După seed, puteți folosi:</p>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm mt-2">
{`Email: admin@datainsight.com
Password: admin123

Sau creați cont nou la /register`}
                        </pre>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Deployment Guides */}
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Ghiduri Deployment Production</CardTitle>
                  <CardDescription>
                    Opțiuni pentru hosting aplicație în production
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="vercel">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="vercel">Vercel</TabsTrigger>
                      <TabsTrigger value="railway">Railway</TabsTrigger>
                      <TabsTrigger value="vps">VPS/Cloud</TabsTrigger>
                    </TabsList>

                    <TabsContent value="vercel" className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p className="font-bold">Vercel Deployment (Recomandat pentru Next.js):</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Push cod pe GitHub/GitLab</li>
                          <li>Conectați-vă la <a href="https://vercel.com" className="text-blue-500 underline">vercel.com</a></li>
                          <li>Import repository</li>
                          <li>Configurați environment variables în Vercel dashboard</li>
                          <li>Deploy automat la fiecare push pe main</li>
                        </ol>
                        <Alert className="mt-3">
                          <Server className="w-4 h-4" />
                          <AlertDescription>
                            <strong>Notă:</strong> Backend API trebuie hostat separat (Railway, Heroku, sau VPS)
                          </AlertDescription>
                        </Alert>
                      </div>
                    </TabsContent>

                    <TabsContent value="railway" className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p className="font-bold">Railway Deployment (Full-stack cu DB):</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Creați cont pe <a href="https://railway.app" className="text-blue-500 underline">railway.app</a></li>
                          <li>New Project → Deploy from GitHub</li>
                          <li>Add PostgreSQL database (Railway Marketplace)</li>
                          <li>Configurați environment variables automat</li>
                          <li>Railway detectează și build-uiește automat</li>
                        </ol>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm mt-2">
{`# railway.json (opțional)
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}`}
                        </pre>
                      </div>
                    </TabsContent>

                    <TabsContent value="vps" className="space-y-3">
                      <div className="text-sm space-y-2">
                        <p className="font-bold">VPS/Cloud Deployment (DigitalOcean, AWS, Azure):</p>
                        <pre className="bg-slate-950 text-slate-50 p-3 rounded text-sm">
{`# Install dependencies
sudo apt update
sudo apt install nodejs npm postgresql nginx

# Clone repository
git clone https://github.com/username/datainsight-dashboard.git
cd datainsight-dashboard

# Setup database
sudo -u postgres createdb datainsight
psql -d datainsight -f scripts/DB/setup-database.sql

# Configure .env
cp .env.example .env
nano .env  # Edit with production values

# Install and build
npm install
npm run build

# PM2 for process management
npm install -g pm2
pm2 start npm --name "datainsight-api" -- run start:api
pm2 start npm --name "datainsight-web" -- run start

# Nginx reverse proxy
sudo nano /etc/nginx/sites-available/datainsight
# Configure proxy_pass to localhost:3000 and localhost:3001

sudo ln -s /etc/nginx/sites-available/datainsight /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# SSL Certificate
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com`}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card>
        <CardHeader>
          <CardTitle>📋 Cerințe și Livrabile Lab 11</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="font-bold mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Ce Trebuie Livrat:
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">1</Badge>
                  <span>
                    <strong>Code Review Complete:</strong> Verificare și corectare cod conform
                    checklist-ului, eliminare business logic din controllers
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">2</Badge>
                  <span>
                    <strong>Logging System:</strong> Winston logger integrat în minimum 2 controllers
                    cu loguri pentru operații CRUD (INFO, WARN, ERROR)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">3</Badge>
                  <span>
                    <strong>INSTALL.md:</strong> Documentație completă cu pași instalare, prerequisites,
                    configurare database, environment variables
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">4</Badge>
                  <span>
                    <strong>README.md actualizat:</strong> Descriere proiect, features, tech stack,
                    link la INSTALL.md
                  </span>
                </li>
              </ul>
            </div>

            <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-500">
              <Info className="w-4 h-4" />
              <AlertDescription>
                <strong>Reminder:</strong> Verificați că aplicația pornește corect după documentația
                din INSTALL.md pe un sistem curat (testați pe altă mașină sau în VM)
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
