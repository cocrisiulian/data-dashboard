# Admin Analytics Dashboard

## 🔐 Admin Access

### Default Credentials

- **Email:** `admin@datainsight.com`
- **Password:** `Admin123!`

### Custom Admin Configuration

Set environment variables in `.env.local`:

```bash
ADMIN_EMAIL=your-admin@email.com
ADMIN_PASSWORD=YourSecurePassword123
```

Then run seed script:

```bash
node prisma/seed.js
```

---

## ✨ Features

### 📊 KPI Cards

- **Total Users**: Registered users count
- **Total Dashboards**: Created dashboards
- **Total Files**: Uploaded CSV files
- **Total Charts**: Generated visualizations

### 📈 Analytics Charts

1. **User Growth (Last 30 Days)** - Line chart showing daily registrations
2. **Dashboards by Plan** - Bar chart of dashboard distribution across plans
3. **Chart Types Distribution** - Pie chart of chart type usage
4. **Activity Timeline (Last 7 Days)** - Area chart of system activity (INFO/WARN/ERROR)

### 👥 User Statistics

- **Recent Users Table** - Last 10 registered users with activity counts
- **Top Active Users Table** - Users ranked by activity score
  - Score calculation: `Dashboards × 3 + Charts × 2 + Files × 1`

### 🔄 Real-time Activity Logs

- Auto-refreshes every 5 seconds
- Shows last 10 activity logs with user info
- Color-coded by level (INFO/WARN/ERROR)
- Manual refresh button available

---

## 🚀 Access Routes

### Admin Analytics Dashboard

```
http://localhost:3000/admin/analytics
```

### API Endpoints

All endpoints are protected and require admin authentication:

- `GET /api/admin/analytics/kpis`
- `GET /api/admin/analytics/user-growth?days=30`
- `GET /api/admin/analytics/dashboards-by-plan`
- `GET /api/admin/analytics/chart-types`
- `GET /api/admin/analytics/top-users?limit=10`
- `GET /api/admin/analytics/recent-users?limit=10`
- `GET /api/admin/analytics/activity-timeline?days=7`
- `GET /api/admin/logs?limit=10&level=INFO`

---

## 🛡️ Security

### Middleware Protection

- Route: `middleware.ts` (root level)
- JWT verification using `jose` library
- Admin check via `isAdmin` flag in JWT payload
- Unauthorized users redirected to `/admin/unauthorized`

### JWT Payload

```typescript
{
  id: string;
  email: string;
  isAdmin: boolean;
}
```

### Unauthorized Page

Custom page with two actions:

- **Go to Home** - Navigate to `/`
- **Login** - Navigate to `/login`

---

## 🗄️ Database Schema

### User Model Extension

```prisma
model User {
  // ... existing fields
  isAdmin Boolean @default(false) @map("is_admin")
  activityLogs ActivityLog[]
}
```

### ActivityLog Model

```prisma
model ActivityLog {
  id        String   @id @default(uuid())
  userId    String?  @map("user_id")
  action    String
  entity    String
  entityId  String?  @map("entity_id")
  metadata  Json?
  level     String   @default("INFO")
  createdAt DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
  
  @@index([userId])
  @@index([createdAt])
  @@index([level])
}
```

---

## 🧪 Testing

### 1. Access Without Authentication

```
Navigate to: http://localhost:3000/admin/analytics
Expected: Redirect to /admin/unauthorized
```

### 2. Access as Regular User

```
1. Login with non-admin account
2. Navigate to: http://localhost:3000/admin/analytics
Expected: Redirect to /admin/unauthorized
```

### 3. Access as Admin

```
1. Login with admin credentials
2. Navigate to: http://localhost:3000/admin/analytics
Expected: Full dashboard access
```

### 4. Test Manual Refresh

```
1. Click "Refresh Statistics" button
2. Verify all KPIs and charts update
3. Confirm tables reload
```

---

## 📦 Dependencies

### New Packages Installed

```json
{
  "bcryptjs": "^2.4.3",
  "jose": "^5.2.0",
  "recharts": "latest",
  "date-fns": "4.1.0"
}
```

---

## 🏗️ Architecture

### Backend Services

```
repositories/
  ├─ AdminStatsRepository.ts    # Prisma queries
  └─ ActivityLogRepository.ts   # Log CRUD operations

services/
  ├─ AdminStatsService.ts       # Business logic
  └─ ActivityLogService.ts      # Log management

infrastructure/
  ├─ logger.ts                  # Database logging
  └─ container.ts               # DI configuration
```

### Frontend Components

```
components/dashboard/
  ├─ AdminStatsCard.tsx         # KPI cards
  ├─ AdminChartsGrid.tsx        # 4 analytics charts
  ├─ RecentUsersTable.tsx       # Recent users
  ├─ TopUsersTable.tsx          # Top active users
  └─ ActivityLogsFeed.tsx       # Real-time logs
```

### API Routes

```
app/api/admin/
  ├─ analytics/
  │  ├─ kpis/route.ts
  │  ├─ user-growth/route.ts
  │  ├─ dashboards-by-plan/route.ts
  │  ├─ chart-types/route.ts
  │  ├─ top-users/route.ts
  │  ├─ recent-users/route.ts
  │  └─ activity-timeline/route.ts
  └─ logs/route.ts
```

---

## 🎯 Usage Guide

### Step 1: Login as Admin

```
1. Navigate to http://localhost:3000/login
2. Enter email: admin@datainsight.com
3. Enter password: Admin123!
4. Click Login
```

### Step 2: Access Admin Dashboard

```
1. Navigate to http://localhost:3000/admin/analytics
2. View KPI statistics at the top
3. Scroll to see charts, tables, and activity logs
```

### Step 3: Refresh Statistics

```
1. Click "Refresh Statistics" button in header
2. All data will be reloaded (except logs which auto-refresh)
```

### Step 4: Monitor Activity

```
1. Activity logs auto-update every 5 seconds
2. Watch for new user logins, file uploads, dashboard creations
3. Use manual refresh for immediate update
```

---

## 🚨 Troubleshooting

### Issue: Cannot access admin dashboard

**Solution:**

1. Verify you're logged in with admin account
2. Check browser console for JWT errors
3. Clear cookies and re-login

### Issue: Activity logs not updating

**Solution:**

1. Check browser console for fetch errors
2. Verify API route `/api/admin/logs` is accessible
3. Refresh page manually

### Issue: Charts not rendering

**Solution:**

1. Verify Recharts is installed: `npm list recharts`
2. Check browser console for errors
3. Ensure API endpoints return valid data

### Issue: Admin user doesn't exist

**Solution:**

```bash
# Re-run seed script
node prisma/seed.js
```

---

## 📝 Migration Info

### Migration ID

```
20260113144117_add_admin_and_activity_logs
```

### Rollback (if needed)

```bash
# Revert migration
npx prisma migrate resolve --rolled-back 20260113144117_add_admin_and_activity_logs

# Remove is_admin column and ActivityLog table manually
# Then create new migration
```

---

## 🔮 Future Enhancements

- [ ] Export analytics to PDF/CSV
- [ ] Date range picker for custom time periods
- [ ] Email notifications for critical errors
- [ ] User management interface (promote/demote admin)
- [ ] Advanced filtering in activity logs
- [ ] Dashboard widgets customization
- [ ] Multiple admin roles (super admin, moderator)
- [ ] Audit trail export

---

**Created:** January 13, 2026
**Status:** ✅ Production Ready
**Version:** 1.0.0
