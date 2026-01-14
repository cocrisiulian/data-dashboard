# LAB 11 - Soft Delete vs Hard Delete

## 📚 Concepte Teoretice

### Ce este Soft Delete?
**Soft Delete** = Ștergerea logică - recordul rămâne în baza de date dar este marcat ca "șters" folosind un câmp special (ex: `deletedAt`).

### Ce este Hard Delete?
**Hard Delete** = Ștergerea fizică - recordul este eliminat complet din baza de date.

## 🎯 Avantaje Soft Delete

| Aspect | Soft Delete | Hard Delete |
|--------|------------|-------------|
| **Recovery** | ✅ Poate fi recuperat | ❌ Permanent pierdut |
| **Audit Trail** | ✅ Istoric complet | ❌ Date pierdute |
| **Integritate** | ✅ Referințe păstrate | ⚠️ FK constraints |
| **GDPR** | ⚠️ Date rămân în DB | ✅ Date eliminate |
| **Performance** | ⚠️ Queries mai complexe | ✅ Queries simple |
| **Storage** | ⚠️ Ocupă spațiu | ✅ Eliberează spațiu |

## 🏗️ Arhitectură Implementată

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                       │
│  (React Components - API Calls)                      │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                   API ROUTES                         │
│  /api/dashboards/:id (DELETE)                       │
│  /api/dashboards/:id/restore (POST)                 │
│  /api/dashboards/trash (GET)                        │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                CONTROLLER LAYER                      │
│  dashboardController.js                              │
│  - Validare input                                    │
│  - Autentificare/Autorizare                         │
│  - Apel service layer                               │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                SERVICE/BUSINESS LAYER                │
│  DashboardService.ts                                 │
│  - Logică business (validări, reguli)              │
│  - Orchestrare multiple operații                    │
│  - Gestionare tranzacții                           │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                REPOSITORY LAYER                      │
│  DashboardRepository.ts                              │
│  - Query-uri Prisma                                 │
│  - CRUD operations                                  │
│  - Soft delete logic                                │
└────────────────┬────────────────────────────────────┘
                 │
┌────────────────▼────────────────────────────────────┐
│                   DATABASE                           │
│  PostgreSQL + Prisma ORM                            │
│  - deletedAt: DateTime?                             │
└─────────────────────────────────────────────────────┘
```

## 📦 Schema Prisma

```prisma
model Dashboard {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  name            String
  description     String?  @db.Text
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")  // 🔑 Câmp pentru Soft Delete

  user            User     @relation(fields: [userId], references: [id])
  charts          Chart[]

  @@index([userId])
  @@index([deletedAt])  // Index pentru performanță
  @@map("dashboards")
}
```

## 💻 Cod Exemplu

### 1. Repository Layer (Data Access)

```typescript
// src/server/repositories/DashboardRepository.ts
export class DashboardRepository {
  constructor(private prisma: PrismaClient) {}

  // Găsește doar dashboards active (nu șterse)
  async findActive(userId: string) {
    return this.prisma.dashboard.findMany({
      where: { 
        userId,
        deletedAt: null  // 🔑 Excludem cele șterse
      }
    });
  }

  // Găsește dashboards șterse (Trash/Recycle Bin)
  async findDeleted(userId: string) {
    return this.prisma.dashboard.findMany({
      where: { 
        userId,
        deletedAt: { not: null }  // 🔑 Doar cele șterse
      }
    });
  }

  // Soft Delete - marchează ca șters
  async softDelete(id: string) {
    return this.prisma.dashboard.update({
      where: { id },
      data: { 
        deletedAt: new Date()  // 🔑 Setează timestamp
      }
    });
  }

  // Restore - recuperează din trash
  async restore(id: string) {
    return this.prisma.dashboard.update({
      where: { id },
      data: { 
        deletedAt: null  // 🔑 Șterge timestamp
      }
    });
  }

  // Hard Delete - șterge definitiv
  async hardDelete(id: string) {
    return this.prisma.dashboard.delete({
      where: { id }
    });
  }
}
```

### 2. Service Layer (Business Logic)

```typescript
// src/server/services/DashboardService.ts
export class DashboardService {
  constructor(private repository: DashboardRepository) {}

  async deleteDashboard(id: string, userId: string) {
    // Validare ownership
    const dashboard = await this.repository.findById(id);
    if (dashboard.userId !== userId) {
      throw new Error('Unauthorized');
    }

    // Business rule: Soft delete by default
    await this.repository.softDelete(id);

    // Log activity
    await this.logActivity(userId, 'DASHBOARD_DELETED', id);
  }

  async restoreDashboard(id: string, userId: string) {
    const dashboard = await this.repository.findById(id);
    
    // Business rule: Can only restore within 30 days
    const daysSinceDeleted = differenceInDays(
      new Date(), 
      dashboard.deletedAt
    );
    
    if (daysSinceDeleted > 30) {
      throw new Error('Dashboard expired - cannot restore');
    }

    await this.repository.restore(id);
  }

  async permanentlyDelete(id: string, userId: string) {
    // Business rule: Must be soft-deleted first
    const dashboard = await this.repository.findById(id);
    if (!dashboard.deletedAt) {
      throw new Error('Must soft-delete before permanent deletion');
    }

    await this.repository.hardDelete(id);
  }
}
```

### 3. Controller Layer (API Handler)

```javascript
// labs_api/controllers/dashboardController.js
exports.deleteDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Soft delete prin service
    await dashboardService.deleteDashboard(id, req.user.id);

    res.json({ 
      message: 'Dashboard moved to trash',
      restorable: true,
      expiresIn: '30 days'
    });
  } catch (error) {
    next(error);
  }
};

exports.restoreDashboard = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    await dashboardService.restoreDashboard(id, req.user.id);

    res.json({ 
      message: 'Dashboard restored successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.getTrash = async (req, res, next) => {
  try {
    const deletedDashboards = await dashboardService.getDeleted(req.user.id);
    
    res.json(deletedDashboards);
  } catch (error) {
    next(error);
  }
};
```

### 4. API Routes

```javascript
// labs_api/routes/dashboards.js
router.delete('/:id', auth, dashboardController.deleteDashboard);
router.post('/:id/restore', auth, dashboardController.restoreDashboard);
router.get('/trash', auth, dashboardController.getTrash);
router.delete('/:id/permanent', auth, dashboardController.permanentlyDelete);
```

## 🔄 Flow Diagram

### Soft Delete Flow
```
User clicks "Delete" 
    ↓
API: DELETE /api/dashboards/:id
    ↓
Controller: Validare + Autorizare
    ↓
Service: Business Logic
    ↓
Repository: UPDATE deletedAt = NOW()
    ↓
Database: Record marcat ca șters
    ↓
Response: { message: "Moved to trash" }
```

### Restore Flow
```
User clicks "Restore" 
    ↓
API: POST /api/dashboards/:id/restore
    ↓
Controller: Validare timestamp (< 30 days)
    ↓
Service: Check business rules
    ↓
Repository: UPDATE deletedAt = NULL
    ↓
Database: Record reactivat
    ↓
Response: { message: "Restored" }
```

## 📊 Queries Importante

### Găsește doar active
```typescript
// ❌ Greșit - include și cele șterse
await prisma.dashboard.findMany({ where: { userId } });

// ✅ Corect - exclude șterse
await prisma.dashboard.findMany({ 
  where: { 
    userId,
    deletedAt: null 
  } 
});
```

### Performance cu Index
```sql
-- Creat automat de Prisma
CREATE INDEX "dashboards_deleted_at_idx" ON "dashboards"("deleted_at");

-- Queries rapide pentru:
-- 1. Active dashboards (deletedAt IS NULL)
-- 2. Deleted dashboards (deletedAt IS NOT NULL)
```

## 🧪 Teste

```typescript
describe('Soft Delete', () => {
  it('should mark dashboard as deleted', async () => {
    await service.deleteDashboard(id, userId);
    
    const dashboard = await repo.findById(id);
    expect(dashboard.deletedAt).not.toBeNull();
  });

  it('should not appear in active list', async () => {
    await service.deleteDashboard(id, userId);
    
    const active = await repo.findActive(userId);
    expect(active).not.toContainEqual({ id });
  });

  it('should appear in trash', async () => {
    await service.deleteDashboard(id, userId);
    
    const trash = await repo.findDeleted(userId);
    expect(trash).toContainEqual(expect.objectContaining({ id }));
  });

  it('should restore successfully', async () => {
    await service.deleteDashboard(id, userId);
    await service.restoreDashboard(id, userId);
    
    const dashboard = await repo.findById(id);
    expect(dashboard.deletedAt).toBeNull();
  });
});
```

## 🎓 Best Practices

### ✅ DO
- Folosește soft delete pentru date importante (dashboards, files)
- Adaugă index pe `deletedAt` pentru performanță
- Implementează auto-cleanup după X zile
- Logghează operațiile de delete/restore
- Oferă UI pentru Trash/Recycle Bin

### ❌ DON'T
- Nu folosi soft delete pentru cache sau date temporare
- Nu uita să filtrezi `deletedAt: null` în queries
- Nu permiteți restore după expirare (GDPR)
- Nu soft-delete date sensibile (passwords, tokens)

## 🔐 GDPR Compliance

```typescript
// Auto-cleanup după 30 zile
async function cleanupExpired() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  // Hard delete toate recordurile soft-deleted > 30 zile
  await prisma.dashboard.deleteMany({
    where: {
      deletedAt: {
        lt: thirtyDaysAgo
      }
    }
  });
}

// Rulează zilnic prin cron job
```

## 🎯 Implementare Completă

Acest LAB demonstrează:
- ✅ Repository Pattern pentru data access
- ✅ Service Layer pentru business logic
- ✅ Controller pentru API handling
- ✅ Soft Delete cu recovery
- ✅ Hard Delete permanent
- ✅ GDPR compliance
- ✅ Performance optimization (indexes)
