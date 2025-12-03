# Lab 9 - Ștergere Fizică și Logică

## 📋 Obiective

1. **Ștergere Fizică (Hard Delete)** - Eliminare completă din baza de date
2. **Ștergere Logică (Soft Delete)** - Marcare ca șters păstrând datele

## 🎯 Concepte Cheie

### Hard Delete (Ștergere Fizică)
- **Ce este**: `DELETE FROM table WHERE id = ?`
- **Când se folosește**: Entități fără dependențe (leaf nodes)
- **Avantaje**: Spațiu eliberat, performanță mai bună
- **Dezavantaje**: Date pierdute permanent, istoric pierdut

### Soft Delete (Ștergere Logică)
- **Ce este**: `UPDATE table SET is_deleted = true WHERE id = ?`
- **Când se folosește**: Entități critice cu dependențe
- **Avantaje**: Recuperare ușoară, istoric păstrat, audit trail
- **Dezavantaje**: Spațiu folosit, query-uri mai complexe

## 📁 Structură Fișiere

```
LABORATOR_PREDARE/LAB9/
├── cod_sursa/
│   ├── schema-updates/
│   │   ├── schema-soft-delete.prisma    # Schema actualizată cu soft delete
│   │   └── migration.sql                # SQL migration pentru soft delete
│   ├── controllers/
│   │   ├── soft-delete-example.js       # Controller pentru soft delete (Files)
│   │   └── hard-delete-example.js       # Controller pentru hard delete (Plans, Charts)
│   └── middleware/
│       └── soft-delete-middleware.js    # Middleware Prisma pentru soft delete
└── README.md
```

## 🗂️ Strategii per Entitate

### Entități cu SOFT DELETE
1. **Users** (`users`)
   - **Motiv**: Referenced în `files`, `dashboards`, `usage_logs`
   - **Columns**: `is_deleted BOOLEAN`, `deleted_at TIMESTAMPTZ`
   - **Index**: `CREATE INDEX idx_users_is_deleted ON users(is_deleted)`

2. **Files** (`files`)
   - **Motiv**: Referenced în `charts`
   - **Columns**: `is_deleted BOOLEAN`, `deleted_at TIMESTAMPTZ`
   - **Index**: `CREATE INDEX idx_files_is_deleted ON files(is_deleted)`

3. **Dashboards** (`dashboards`)
   - **Motiv**: Referenced în `charts`
   - **Columns**: `is_deleted BOOLEAN`, `deleted_at TIMESTAMPTZ`
   - **Index**: `CREATE INDEX idx_dashboards_is_deleted ON dashboards(is_deleted)`

### Entități cu HARD DELETE
1. **Plans** (`plans`)
   - **Motiv**: Poate fi șters dacă nu există useri
   - **Validare**: Check `_count.users` înainte de ștergere
   - **Operație**: `DELETE FROM plans WHERE id = ?`

2. **Charts** (`charts`)
   - **Motiv**: Leaf entity, nu este FK în alte tabele
   - **Operație**: `DELETE FROM charts WHERE id = ?`

3. **UsageLogs** (`usage_logs`)
   - **Motiv**: Audit logs care pot fi purjate
   - **Operație**: `DELETE FROM usage_logs WHERE created_at < ?`

## 💻 Implementare

### 1. Migration SQL

```sql
-- Add soft delete columns
ALTER TABLE users 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN deleted_at TIMESTAMPTZ;

CREATE INDEX idx_users_is_deleted ON users(is_deleted);

-- Similar pentru files și dashboards
```

### 2. Controller - Soft Delete

```javascript
// Soft delete file
exports.softDeleteFile = async (req, res) => {
  const { id } = req.params;
  
  const deletedFile = await prisma.file.update({
    where: { id },
    data: {
      isDeleted: true,
      deletedAt: new Date()
    }
  });
  
  res.json({ success: true, message: 'File deleted' });
};

// Get active files only
exports.getAllFiles = async (req, res) => {
  const files = await prisma.file.findMany({
    where: {
      userId: req.user.id,
      isDeleted: false  // ← Filter deleted
    }
  });
  
  res.json({ data: files });
};
```

### 3. Controller - Hard Delete

```javascript
// Hard delete plan (with validation)
exports.hardDeletePlan = async (req, res) => {
  const { id } = req.params;
  
  const plan = await prisma.plan.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } }
  });
  
  if (plan._count.users > 0) {
    return res.status(409).json({
      error: `Cannot delete. ${plan._count.users} users on this plan.`
    });
  }
  
  await prisma.plan.delete({ where: { id } });
  
  res.json({ message: 'Plan deleted permanently' });
};
```

### 4. Middleware Prisma

```javascript
// Auto-filter soft deleted records
prisma.$use(async (params, next) => {
  if (params.model === 'User' && params.action === 'findMany') {
    if (!params.args.where) params.args.where = {};
    params.args.where.isDeleted = false;
  }
  
  return next(params);
});
```

## 🔧 Operații Disponibile

### Soft Delete Operations

| Operație | Endpoint | Descriere |
|----------|----------|-----------|
| Soft Delete | `DELETE /api/files/:id` | Marchează ca șters |
| Get Active | `GET /api/files` | Returnează doar active |
| Get Deleted | `GET /api/files/trash` | Returnează șterse |
| Restore | `POST /api/files/:id/restore` | Restaurează fișier |
| Permanent Delete | `DELETE /api/files/:id/permanent` | Șterge definitiv |
| Cleanup | `DELETE /api/files/cleanup` | Șterge > 30 zile |

### Hard Delete Operations

| Operație | Endpoint | Descriere |
|----------|----------|-----------|
| Get All | `GET /api/plans` | Returnează toate planurile |
| Hard Delete | `DELETE /api/plans/:id` | Șterge cu validare |
| Force Delete | `DELETE /api/plans/:id/force` | Șterge forțat (CASCADE) |

## 📊 Comparație Performanță

| Aspect | Hard Delete | Soft Delete |
|--------|-------------|-------------|
| Query Speed | Faster (less data) | Slower (more data) |
| Storage | Freed immediately | Used until cleanup |
| Recovery | Impossible | Easy (UPDATE) |
| Audit Trail | Lost | Preserved |
| FK Constraints | Can cause errors | No issues |

## ✅ Best Practices

1. **Always index `is_deleted`** pentru performanță
2. **Filter all queries** cu `WHERE is_deleted = false`
3. **Implement restore** pentru user recovery
4. **Schedule cleanup jobs** pentru purjare periodică
5. **Validate hard deletes** pentru FK constraints
6. **Use transactions** pentru operații complexe
7. **Log all deletions** pentru audit

## 🧪 Testing

### Test Soft Delete
```javascript
// Delete file
await prisma.file.update({
  where: { id: fileId },
  data: { isDeleted: true, deletedAt: new Date() }
});

// Verify not in active list
const activeFiles = await prisma.file.findMany({
  where: { isDeleted: false }
});
assert(!activeFiles.find(f => f.id === fileId));

// Verify in deleted list
const deletedFiles = await prisma.file.findMany({
  where: { isDeleted: true }
});
assert(deletedFiles.find(f => f.id === fileId));

// Restore
await prisma.file.update({
  where: { id: fileId },
  data: { isDeleted: false, deletedAt: null }
});
```

### Test Hard Delete
```javascript
// Create plan without users
const plan = await prisma.plan.create({
  data: { name: 'Test', maxFiles: 10, maxCharts: 10, maxDashboards: 5 }
});

// Should delete successfully
await prisma.plan.delete({ where: { id: plan.id } });

// Verify deletion
const foundPlan = await prisma.plan.findUnique({ where: { id: plan.id } });
assert(foundPlan === null);
```

## 📚 Resurse

1. [Soft Delete vs Hard Delete - Become Better Programmer](https://www.becomebetterprogrammer.com/soft-delete-vs-hard-delete/)
2. [Deleting Data: Soft, Hard, or Audit - Marty Friedel](https://www.martyfriedel.com/blog/deleting-data-soft-hard-or-audit)
3. [Soft vs Hard Delete - Abstraction Blog](https://abstraction.blog/2015/06/28/soft-vs-hard-delete)

## 🎓 Deliverables

1. ✅ Schema updates cu `is_deleted` și `deleted_at`
2. ✅ Migration SQL pentru soft delete columns
3. ✅ Controller cu soft delete (Files, Users, Dashboards)
4. ✅ Controller cu hard delete (Plans, Charts)
5. ✅ Middleware Prisma pentru auto-filtering
6. ✅ Restore functionality
7. ✅ Cleanup job pentru date vechi
8. ✅ Documentation și README

## 🚀 Rulare Locală

```bash
# 1. Start dev server
npm run dev

# 2. Navigate to Lab 9
http://localhost:3000/LABS/lab9

# 3. View interactive guide
# - Comparație Hard vs Soft Delete
# - Strategii per entitate
# - Code examples
# - Migration steps
```

## 📝 Word Document Checklist

Pentru prezentarea laboratorului:

- [ ] Screenshot comparație tabel Hard vs Soft
- [ ] Diagrame flow pentru ambele tipuri
- [ ] Code snippets pentru controllers
- [ ] Schema before/after migration
- [ ] Explicații pentru fiecare entitate
- [ ] Best practices implement
- [ ] Testing scenarios
- [ ] Concluzii și learning outcomes
