# 🏗️ Arhitectura Aplicației DataInsight Dashboard

## 📋 Cuprins

1. [Flow General](#flow-general)
2. [Structura Directoarelor](#structura-directoarelor)
3. [Layered Architecture (MVC)](#layered-architecture-mvc)
4. [Request Flow Example](#request-flow-example)
5. [Dependency Injection](#dependency-injection)
6. [Mapping: Labs → Production Code](#mapping-labs--production-code)

---

## 🔄 Flow General

```
┌──────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  src/app/dashboard/, src/app/files/, src/components/             │
└──────────────────────────────────────────────────────────────────┘
                                ↓
                    fetch('/api/files')
                    fetch('/api/charts')
                    fetch('/api/dashboards')
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    NEXT.JS API ROUTES                           │
│  src/app/api/files/route.ts                                     │
│  src/app/api/charts/route.ts                                    │
│  src/app/api/dashboards/route.ts                                │
│  src/app/api/plans/route.ts                                     │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    CONTROLLERS (HTTP Layer)                     │
│  src/server/controllers/FileController.ts                       │
│  src/server/controllers/ChartController.ts                      │
│  src/server/controllers/DashboardController.ts                  │
│  src/server/controllers/PlanController.ts                       │
│                                                                 │
│  Responsabilități:                                              │
│  • HTTP request/response handling                               │
│  • Request validation (basic)                                   │
│  • Status codes (200, 404, 400, 500)                            │
│  • Response formatting                                          │
│  • NO business logic                                            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SERVICES (Business Layer)                    │
│  src/server/services/FileService.ts                             │
│  src/server/services/ChartService.ts                            │
│  src/server/services/DashboardService.ts                        │
│  src/server/services/PlanService.ts                             │
│                                                                 │
│  Responsabilități:                                              │
│  • Business logic și validări                                   │
│  • Cache management (node-cache)                                │
│  • Plan limit checks (max_files, max_charts)                    │
│  • Ownership validation                                         │
│  • Calcule și transformări                                      │
│  • Orchestrare între repositories                               │
│  • DTO transformations (snake_case)                             │
│  • Cache invalidation pe CREATE/UPDATE/DELETE                   │
└─────────────────────────────────────────────────────────────────┘
                    ↓                          ↓
          ┌─────────────────┐      ┌─────────────────┐
          │  MEMORY CACHE   │      │   REPOSITORIES  │
          │  (node-cache)   │      │  (Data Access)  │
          │                 │      │                 │
          │  • Get cached   │      │  • Prisma ORM   │
          │  • Set cache    │      │  • CRUD ops     │
          │  • Invalidate   │      │  • Queries      │
          └─────────────────┘      └─────────────────┘
                                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                  REPOSITORIES (Data Access Layer)               │
│  src/server/repositories/FileRepository.ts                      │
│  src/server/repositories/ChartRepository.ts                     │
│  src/server/repositories/DashboardRepository.ts                 │
│  src/server/repositories/PlanRepository.ts                      │
│  src/server/repositories/UserRepository.ts                      │
│                                                                 │
│  Responsabilități:                                              │
│  • CRUD operations                                              │
│  • Database queries (Prisma)                                    │
│  • Data mapping                                                 │
│  • NO business logic                                            │
└─────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                     PRISMA ORM + PostgreSQL                     │
│  prisma/schema.prisma                                           │
│                                                                 │
│  Models: User, Plan, File, Dashboard, Chart                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 Structura Directoarelor

### ✅ Cod Production (Folosit în Aplicație)

```
src/
├── app/                          # Next.js 15 App Router
│   ├── api/                      # ⭐ API Routes (Backend Entry Point)
│   │   ├── files/route.ts        # GET, POST /api/files
│   │   ├── charts/route.ts       # GET, POST /api/charts
│   │   ├── dashboards/route.ts   # GET, POST /api/dashboards
│   │   └── plans/route.ts        # GET, POST /api/plans
│   ├── dashboard/page.tsx        # Frontend - Dashboard UI
│   ├── files/page.tsx            # Frontend - Files UI
│   └── upload/page.tsx           # Frontend - Upload UI
│
├── server/                       # ⭐ Backend MVC Architecture
│   ├── controllers/              # HTTP Layer
│   │   ├── PlanController.ts
│   │   ├── FileController.ts
│   │   ├── ChartController.ts
│   │   └── DashboardController.ts
│   │
│   ├── services/                 # Business Logic Layer
│   │   ├── PlanService.ts
│   │   ├── FileService.ts
│   │   ├── ChartService.ts
│   │   └── DashboardService.ts
│   │
│   ├── repositories/             # Data Access Layer
│   │   ├── PlanRepository.ts
│   │   ├── FileRepository.ts
│   │   ├── ChartRepository.ts
│   │   ├── DashboardRepository.ts
│   │   └── UserRepository.ts
│   │
│   └── infrastructure/           # Cross-cutting Concerns
│       ├── container.ts          # Awilix DI Container
│       └── cache/                # Memory Cache System
│           ├── ICache.ts         # Cache interface
│           ├── MemoryCacheService.ts  # node-cache implementation
│           └── index.ts          # Exports
│
├── components/                   # React Components
│   ├── dashboard/
│   ├── files/
│   └── charts/
│
└── lib/                          # Utilities
    ├── api/client.ts             # Frontend API client
    └── utils/
```

### 📚 Cod Demonstrativ (Pentru Laboratoare)

```
LABORATOR_PREDARE/               # ⚠️ DOAR pentru predare, NU folosit în app
├── LAB5/cod_sursa/
│   └── planController.js        # Exemplu - referă src/server/controllers/
├── LAB6/cod_sursa/
│   └── chartController.js       # Exemplu - referă src/server/controllers/
├── LAB10/cod_sursa/
│   ├── controllers/PlanController.js
│   ├── services/PlanService.js
│   ├── repositories/PlanRepository.js
│   └── infrastructure/container.js

labs_api/                        # ⚠️ Express standalone server (pentru labs)
├── server.js                    # Express app (NOT Next.js)
├── controllers/                 # Duplicate pentru demonstrație Express
└── routes/                      # Express routes (NOT Next.js API routes)
```

---

## 🏛️ Layered Architecture (MVC)

### Layer 1: **API Routes** (Next.js Entry Point)

**Locație:** `src/app/api/*/route.ts`

```typescript
// src/app/api/files/route.ts
import { fileController } from '@/server/controllers/FileController';

export async function GET(request: NextRequest) {
  const userId = getUserFromToken(request); // Auth middleware
  const response = await fileController.getAllFiles(userId);
  return toNextResponse(response);
}
```

**Responsabilități:**

- Primește HTTP requests de la frontend
- Extrage parametri (query, body, params)
- Apelează Controller
- Returnează Next.js Response

---

### Layer 2: **Controllers** (HTTP Handling)

**Locație:** `src/server/controllers/`

```typescript
// src/server/controllers/FileController.ts
export class FileController {
  constructor(private fileService: FileService) {}

  async getAllFiles(userId: string): Promise<ApiResponse> {
    try {
      const files = await this.fileService.getAllFiles(userId);
      return { success: true, data: files };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

**Responsabilități:**

- HTTP logic (status codes, error handling)
- Request/Response formatting
- Delegare către Service Layer
- **NO business logic**

---

### Layer 3: **Services** (Business Logic)

**Locație:** `src/server/services/`

```typescript
// src/server/services/FileService.ts
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private userRepository: UserRepository
  ) {}

  async getAllFiles(userId: string): Promise<FileDTO[]> {
    const files = await this.fileRepository.findAllByUserId(userId);
  
    // Business logic: Transform la snake_case
    return files.map(file => this.toDTO(file));
  }

  async uploadFile(userId: string, fileData: any): Promise<FileDTO> {
    // Business validation: Check plan limits
    const hasReachedLimit = await this.userRepository.hasReachedFileLimit(userId);
    if (hasReachedLimit) {
      throw new Error('File limit reached');
    }

    return await this.fileRepository.create({...});
  }
}
```

**Responsabilități:**

- **Business logic** (plan limits, validări)
- **Cache management** (get, set, invalidate)
- DTO transformations (camelCase → snake_case)
- Orchestrare între multiple repositories
- Business events logging
- **NO database queries direct**

**Example with Cache:**

```typescript
// src/server/services/FileService.ts
export class FileService {
  constructor(
    private fileRepository: FileRepository,
    private cacheManager: ICache
  ) {}

  async getAllFiles(userId: string): Promise<FileDTO[]> {
    // Try cache first
    const cacheKey = `files-user-${userId}`;
    const cached = this.cacheManager.get<FileDTO[]>(cacheKey);
    if (cached) return cached;
  
    // Cache miss - query database
    const files = await this.fileRepository.findAllByUserId(userId);
    const dtos = files.map(file => this.toDTO(file));
  
    // Store in cache for 1 hour
    this.cacheManager.set(cacheKey, dtos);
    return dtos;
  }

  async uploadFile(userId: string, fileData: any): Promise<FileDTO> {
    const file = await this.fileRepository.create({...});
  
    // Invalidate cache after mutation
    this.cacheManager.removeByPattern('file');
  
    return this.toDTO(file);
  }
}
```

---

### Layer 4: **Repositories** (Data Access)

**Locație:** `src/server/repositories/`

```typescript
// src/server/repositories/FileRepository.ts
export class FileRepository {
  constructor(private prisma: PrismaClient) {}

  async findAllByUserId(userId: string): Promise<File[]> {
    return await this.prisma.file.findMany({
      where: { userId },
      orderBy: { uploadedAt: 'desc' }
    });
  }

  async create(fileData: {...}): Promise<File> {
    return await this.prisma.file.create({ data: fileData });
  }
}
```

**Responsabilități:**

- CRUD operations (Prisma queries)
- Database abstraction
- **NO business logic**

---

## 🔍 Request Flow Example

### Exemplu: User uploadă un fișier

```
1. Frontend Click "Upload"
   ↓
   fetch('/api/files', { method: 'POST', body: formData })

2. Next.js API Route (src/app/api/files/route.ts)
   ↓
   POST(request) → extract userId from JWT
   ↓
   fileController.uploadFile(userId, fileData)

3. FileController (src/server/controllers/FileController.ts)
   ↓
   Validează request structure
   ↓
   fileService.uploadFile(userId, fileData)

4. FileService (src/server/services/FileService.ts)
   ↓
   Business logic:
   - Check: userRepository.hasReachedFileLimit(userId)
   - If limit reached → throw Error
   - Transform data (camelCase → snake_case)
   ↓
   fileRepository.create({...})

5. FileRepository (src/server/repositories/FileRepository.ts)
   ↓
   prisma.file.create({ data: {...} })

6. Prisma ORM
   ↓
   INSERT INTO files (...) VALUES (...)

7. Response bubbles back:
   Repository → Service → Controller → API Route → Frontend
   ↓
   { success: true, data: { id: '...', file_name: '...' } }
```

---

## 💉 Dependency Injection

**Locație:** `src/server/infrastructure/container.ts`

```typescript
import { createContainer, asClass } from 'awilix';
import { MemoryCacheService } from './cache/MemoryCacheService';

const container = createContainer();

container.register({
  // Infrastructure (SINGLETON)
  cacheManager: asClass(MemoryCacheService).singleton(),
  
  // Repositories (SINGLETON - stateless)
  fileRepository: asClass(FileRepository).singleton(),
  userRepository: asClass(UserRepository).singleton(),
  planRepository: asClass(PlanRepository).singleton(),
  chartRepository: asClass(ChartRepository).singleton(),
  dashboardRepository: asClass(DashboardRepository).singleton(),
  
  // Services (SINGLETON - with cache injection)
  fileService: asClass(FileService).singleton(),
  planService: asClass(PlanService).singleton(),
  chartService: asClass(ChartService).singleton(),
  dashboardService: asClass(DashboardService).singleton(),
  
  // Controllers (SCOPED - per request)
  fileController: asClass(FileController).scoped()
});

export const resolveDependency = <T>(name: string): T => {
  return container.resolve<T>(name);
};
```

**Beneficii:**

- Loose coupling (easy testing cu mocks)
- Centralized configuration
- Automatic dependency resolution

---

## 🗺️ Mapping: Labs → Production Code

| Lab             | Fișier Lab                                                          | Locație Production                           | Folosit în         |
| --------------- | -------------------------------------------------------------------- | --------------------------------------------- | ------------------- |
| **LAB5**  | `LABORATOR_PREDARE/LAB5/cod_sursa/planController.js`               | `src/server/controllers/PlanController.ts`  | `/api/plans`      |
| **LAB5**  | `LABORATOR_PREDARE/LAB5/cod_sursa/plan-model.prisma`               | `prisma/schema.prisma` (Plan model)         | Prisma Client       |
| **LAB6**  | `LABORATOR_PREDARE/LAB6/cod_sursa/chartController.js`              | `src/server/controllers/ChartController.ts` | `/api/charts`     |
| **LAB7**  | `LABORATOR_PREDARE/LAB7/cod_sursa/fileController.js`               | `src/server/controllers/FileController.ts`  | `/api/files`      |
| **LAB10** | `LABORATOR_PREDARE/LAB10/cod_sursa/controllers/PlanController.js`  | `src/server/controllers/PlanController.ts`  | `/api/plans`      |
| **LAB10** | `LABORATOR_PREDARE/LAB10/cod_sursa/services/PlanService.js`        | `src/server/services/PlanService.ts`        | Plan business logic |
| **LAB10** | `LABORATOR_PREDARE/LAB10/cod_sursa/repositories/PlanRepository.js` | `src/server/repositories/PlanRepository.ts` | Plan data access    |
| **LAB10** | `LABORATOR_PREDARE/LAB10/cod_sursa/infrastructure/container.js`    | `src/server/infrastructure/container.ts`    | DI Container        |
| **LAB12** | Lab12 implementation (code in production)                            | `src/server/infrastructure/cache/`          | Memory Cache System |

### ⚠️ IMPORTANT: Diferența între `labs_api/` și `src/server/`

| Aspect                   | `labs_api/`                                   | `src/server/`                                 |
| ------------------------ | ----------------------------------------------- | ----------------------------------------------- |
| **Framework**      | Express.js                                      | Next.js 15 App Router                           |
| **Scop**           | Demonstrație pentru labs                       | **Production backend**                    |
| **Folosit de**     | Standalone server (`node labs_api/server.js`) | Next.js app (integrated)                        |
| **API Routes**     | Express routes (`/api/plans`)                 | Next.js routes (`src/app/api/plans/route.ts`) |
| **Când rulează** | Manual cu `npm run dev:api`                   | Automat cu `npm run dev`                      |
| **Status**         | 🟡 Demo/Teaching                                | 🟢**Production Active**                   |

---

## ✅ Flow Clar - Rezumat

```
Frontend (React)
  → fetch('/api/files')
    → src/app/api/files/route.ts (Next.js API Route)
      → src/server/controllers/FileController.ts (HTTP handling)
        → src/server/services/FileService.ts (Business logic)
          → src/server/repositories/FileRepository.ts (Database)
            → Prisma ORM
              → PostgreSQL
```

**Fiecare layer are responsabilități clare:**

- **API Routes**: HTTP entry point
- **Controllers**: Request/Response formatting
- **Services**: Business logic + validations
- **Repositories**: Database operations
- **Prisma**: ORM pentru PostgreSQL

**Nu există amestec:**

- Frontend nu accesează direct labs_api/
- Frontend folosește DOAR `/api/*` routes
- Toate `/api/*` routes folosesc `src/server/` MVC
- `labs_api/` e standalone pentru demonstrație

---

## 📚 Documentație Suplimentară

- **Next.js API Routes**: [Next.js Docs](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Dependency Injection**: [Awilix Docs](https://github.com/jeffijoe/awilix)
- **Repository Pattern**: [Martin Fowler](https://martinfowler.com/eaaCatalog/repository.html)
- **Service Layer Pattern**: [Martin Fowler](https://martinfowler.com/eaaCatalog/serviceLayer.html)
