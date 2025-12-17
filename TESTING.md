# Testing Documentation

## ✅ Test Status: All 39 tests passing!

## Overview
Acest proiect folosește **Vitest** pentru unit testing cu coverage complet pentru arhitectura MVC.

## Test Results
```
✓ PlanRepository   (9 tests)  - Data Access Layer
✓ FileRepository   (10 tests) - Data Access Layer  
✓ PlanService      (10 tests) - Business Logic Layer
✓ PlanController   (10 tests) - HTTP Handling Layer

Total: 39 passing tests
```

## Structura de teste

```
src/
├── __tests__/
│   ├── setup.ts              # Global test setup
│   ├── mocks/
│   │   └── prisma.mock.ts    # Prisma Client mock
│   └── fixtures/
│       └── data.ts           # Mock data pentru toate entitățile
├── server/
│   ├── repositories/__tests__/
│   │   ├── PlanRepository.test.ts
│   │   ├── FileRepository.test.ts
│   │   └── ...
│   ├── services/__tests__/
│   │   ├── PlanService.test.ts
│   │   └── ...
│   └── controllers/__tests__/
│       ├── PlanController.test.ts
│       └── ...
```

## Comenzi disponibile

```bash
# Rulează toate testele
npm test

# Watch mode (rulează la fiecare modificare)
npm run test:watch

# Generează raport de coverage
npm run test:coverage

# UI mode (interfață vizuală)
npm run test:ui
```

## Instalare dependințe

```bash
npm install -D vitest @vitest/ui @vitest/coverage-v8
```

## Cum funcționează testele

### 1. Repository Layer Tests
Testează **data access layer** cu Prisma mock:

```typescript
import { mockPrismaClient, resetPrismaMocks } from '@/__tests__/mocks/prisma.mock';
import { mockPlans } from '@/__tests__/fixtures/data';

describe('PlanRepository', () => {
  beforeEach(() => {
    resetPrismaMocks();
    planRepository = new PlanRepository(mockPrismaClient);
  });

  it('should find all plans', async () => {
    mockPrismaClient.plan.findMany.mockResolvedValue([mockPlans.free]);
    const result = await planRepository.findAll();
    expect(result).toEqual([mockPlans.free]);
  });
});
```

**Testează:**
- CRUD operations (findAll, findById, create, update, delete)
- Queries complexe (findPopularPlans, countUsersByPlanId)
- Edge cases (null returns, empty arrays)

### 2. Service Layer Tests
Testează **business logic** cu Repositories mock:

```typescript
describe('PlanService', () => {
  let mockPlanRepository: PlanRepository;

  beforeEach(() => {
    mockPlanRepository = {
      findAll: vi.fn(),
      findById: vi.fn(),
      // ... alte metode
    } as any;
    
    planService = new PlanService(mockPlanRepository, mockUserRepository);
  });

  it('should throw error when plan has active users', async () => {
    mockPlanRepository.countUsersByPlanId.mockResolvedValue(10);
    
    await expect(planService.deletePlan('plan-id')).rejects.toThrow(
      'Cannot delete plan with active users'
    );
  });
});
```

**Testează:**
- Business rules (validări, limite)
- Data enrichment (valueScore, canDelete)
- Error handling
- Logică de calcul

### 3. Controller Layer Tests
Testează **HTTP handling** cu Services mock:

```typescript
describe('PlanController', () => {
  let mockPlanService: PlanService;

  beforeEach(() => {
    mockPlanService = {
      getAllPlans: vi.fn(),
      getPlanById: vi.fn(),
      // ... alte metode
    } as any;
    
    planController = new PlanController(mockPlanService);
  });

  it('should return success response with all plans', async () => {
    mockPlanService.getAllPlans.mockResolvedValue([mockPlans.free]);
    
    const response = await planController.getAllPlans();
    
    expect(response.success).toBe(true);
    expect(response.data).toEqual([mockPlans.free]);
  });
});
```

**Testează:**
- ApiResponse structure (success, data, message, error)
- Error handling și transformare
- Validări de input
- HTTP status logic

## Mock Strategy

### Prisma Mock
```typescript
export const mockPrismaClient = {
  plan: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  // ... alte modele
} as unknown as PrismaClient;

export function resetPrismaMocks() {
  vi.clearAllMocks();
}
```

### Test Fixtures
```typescript
export const mockPlans = {
  free: {
    id: 'plan-free',
    name: 'Free',
    price: 0,
    maxFiles: 5,
    // ...
  },
  pro: { /* ... */ },
  enterprise: { /* ... */ },
};
```

## Best Practices

1. **Test Isolation**: Folosește `beforeEach` pentru reset
2. **Mock Everything**: Fiecare layer mock-uiește layer-ul de dedesubt
3. **AAA Pattern**: Arrange → Act → Assert
4. **Edge Cases**: Testează și scenarii de eroare
5. **Descriptive Names**: Nume clare pentru ce testează

## Coverage Goals

- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 80%+
- **Lines**: 80%+

Verifică coverage cu:
```bash
npm run test:coverage
```

## Exemple de teste

### Repository Test Example
```typescript
it('should return empty array when no plans exist', async () => {
  mockPrismaClient.plan.findMany.mockResolvedValue([]);
  
  const result = await planRepository.findAll();
  
  expect(result).toEqual([]);
  expect(mockPrismaClient.plan.findMany).toHaveBeenCalledOnce();
});
```

### Service Test Example
```typescript
it('should calculate value score correctly', async () => {
  mockPlanRepository.findAll.mockResolvedValue([mockPlans.pro]);
  
  const result = await planService.getAllPlans();
  
  expect(result[0].valueScore).toBeGreaterThan(0);
});
```

### Controller Test Example
```typescript
it('should return error response when service throws', async () => {
  mockPlanService.getAllPlans.mockRejectedValue(new Error('DB error'));
  
  const response = await planController.getAllPlans();
  
  expect(response.success).toBe(false);
  expect(response.error).toBe('DB error');
});
```

## Debugging Tests

### Run specific test file
```bash
npm test PlanRepository.test
```

### Run with verbose output
```bash
npm test -- --reporter=verbose
```

### Watch specific file
```bash
npm run test:watch -- PlanService
```

## CI/CD Integration

Adaugă în GitHub Actions:
```yaml
- name: Run tests
  run: npm test -- --coverage

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/coverage-final.json
```
