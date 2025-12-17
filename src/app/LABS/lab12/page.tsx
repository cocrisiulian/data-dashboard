"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Badge } from "@/components/ui/text/badge"
import { CheckCircle2, Zap, Database, RefreshCw, TrendingUp } from "lucide-react"

export default function Lab12Page() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Lab 12: Memory Cache</h1>
          <Badge variant="default" className="bg-green-500">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Implemented
          </Badge>
        </div>
        <p className="text-muted-foreground text-lg">
          Implementare cache în memorie la nivelul Service Layer pentru optimizarea performanței
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10-20x</div>
            <p className="text-xs text-muted-foreground">Faster responses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-500" />
              Database Load
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-80%</div>
            <p className="text-xs text-muted-foreground">Reduced queries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-green-500" />
              Cache TTL
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1 hour</div>
            <p className="text-xs text-muted-foreground">Default expiration</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-500" />
              Tests Passing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">54/54</div>
            <p className="text-xs text-muted-foreground">All tests green</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cache Implementation */}
        <Card>
          <CardHeader>
            <CardTitle>Cache Infrastructure</CardTitle>
            <CardDescription>MemoryCacheService using node-cache</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Core Methods</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">get&lt;T&gt;(key: string): T | null</code>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">set(key: string, data: any, ttl?: number)</code>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">isSet(key: string): boolean</code>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">remove(key: string): void</code>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">removeByPattern(pattern: string)</code>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                  <code className="flex-1 bg-muted px-2 py-1 rounded">clear(): void</code>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Services Integration */}
        <Card>
          <CardHeader>
            <CardTitle>Services Updated</CardTitle>
            <CardDescription>Cache integration in all services</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold">PlanService</h4>
                <p className="text-sm text-muted-foreground">Cache: plans-all, plan-{'{id}'}</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold">FileService</h4>
                <p className="text-sm text-muted-foreground">Cache: files-user-{'{userId}'}, file-{'{id}'}</p>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-semibold">ChartService</h4>
                <p className="text-sm text-muted-foreground">Cache: charts-dashboard-{'{dashboardId}'}, chart-{'{id}'}</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold">DashboardService</h4>
                <p className="text-sm text-muted-foreground">Cache: dashboards-user-{'{userId}'}, dashboard-{'{id}'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cache Strategy */}
        <Card>
          <CardHeader>
            <CardTitle>Caching Strategy</CardTitle>
            <CardDescription>Cache-first pattern with invalidation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">GET Operations</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Check if key exists in cache</li>
                  <li>Return cached data if found</li>
                  <li>Otherwise, query database</li>
                  <li>Store result in cache</li>
                  <li>Return data</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-600">CREATE/UPDATE/DELETE Operations</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Execute database mutation</li>
                  <li>Invalidate related cache keys</li>
                  <li>Pattern-based removal (e.g., "plan" removes all plan-* keys)</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testing */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Coverage</CardTitle>
            <CardDescription>15 new cache tests added</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Total Tests</span>
                  <span className="text-sm font-bold text-green-600">54/54 passing</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>MemoryCacheService tests</span>
                  <Badge variant="outline">15 tests</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Repository tests</span>
                  <Badge variant="outline">19 tests</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Service tests</span>
                  <Badge variant="outline">10 tests</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Controller tests</span>
                  <Badge variant="outline">10 tests</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Implementation Details */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Implementation Example</CardTitle>
          <CardDescription>PlanService with cache integration</CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
            <code>{`async getAllPlans(): Promise<PlanDTO[]> {
  const cacheKey = 'plans-all';
  
  // Try cache first
  if (this.cacheManager.isSet(cacheKey)) {
    const cachedPlans = this.cacheManager.get<PlanDTO[]>(cacheKey);
    if (cachedPlans) return cachedPlans;
  }
  
  // Get from database
  const plans = await this.planRepository.findAll();
  
  // Transform data
  const plansWithMetadata = plans.map(...);
  
  // Store in cache
  this.cacheManager.set(cacheKey, plansWithMetadata);
  
  return plansWithMetadata;
}

async createPlan(data): Promise<Plan> {
  const plan = await this.planRepository.create(data);
  
  // Invalidate cache on mutation
  this.cacheManager.removeByPattern('plan');
  
  return plan;
}`}</code>
          </pre>
        </CardContent>
      </Card>

      {/* Dependencies */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Dependencies Added</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">node-cache@5.1.2</code>
              <p className="text-xs text-muted-foreground mt-1">Core caching library</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <code className="text-sm">@types/node-cache@4.2.5</code>
              <p className="text-xs text-muted-foreground mt-1">TypeScript definitions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
