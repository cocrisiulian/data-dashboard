# LAB 8 - API Integration & Web Deployment

## 📋 Obiective Laborator

1. **Utilizare API în Frontend** - Implementare interfețe web complete pentru operațiile CRUD API din Lab 7
2. **Hosting on WebServer** - Publicarea aplicației web pentru acces fără mediul de dezvoltare

## 🎯 Cerințe

Conform `lab8.pdf`:
- Creați interfețe web (front-end) în care să utilizați operațiile CRUD API implementate în laboratorul 7
- Realizați pașii de publicare a unei aplicații web
- Utilizați numele de host:
  - Frontend MVC → `proiect-MVC-demo.com`
  - Backend WebAPI → `proiect-api-demo.com`

## 🛠️ Stack Tehnologic

- **Frontend Hosting**: Vercel (Next.js optimized)
- **Backend Hosting**: Railway (Express.js + Node.js)
- **Database**: Railway PostgreSQL (managed)
- **CI/CD**: Auto-deploy from GitHub

## 📁 Structură Fișiere

```
LABORATOR_PREDARE/LAB8/
├── cod_sursa/
│   ├── deployment/
│   │   ├── vercel.json                      # Vercel config
│   │   ├── railway.json                     # Railway config
│   │   ├── .env.production.example          # Environment variables template
│   │   ├── package.json.railway             # Backend package.json
│   │   ├── deploy-frontend.sh               # Bash script pentru Vercel
│   │   ├── deploy-backend.sh                # Bash script pentru Railway
│   │   ├── deploy-frontend.ps1              # PowerShell script pentru Vercel
│   │   └── deploy-backend.ps1               # PowerShell script pentru Railway
│   └── frontend-enhancements/
│       ├── api-integration-example.tsx      # Exemple API consumption
│       └── complete-crud-example.tsx        # CRUD complet (Files, Charts, Dashboards)
├── deployment-guide/
│   ├── DEPLOYMENT_STEP_BY_STEP.md           # Ghid pas cu pas deployment
│   ├── TROUBLESHOOTING.md                   # Soluții probleme comune
│   ├── QUICK_START.md                       # Quick start 30 minute
│   └── DEPLOYMENT_CHECKLIST.md              # Checklist complet
└── README.md                                 # Acest fișier
```

## 🚀 Quick Start

### Opțiunea 1: Ghid Rapid (30 min)

Vezi [QUICK_START.md](./deployment-guide/QUICK_START.md) pentru deployment rapid.

### Opțiunea 2: Ghid Detaliat (2 ore)

Vezi [DEPLOYMENT_STEP_BY_STEP.md](./deployment-guide/DEPLOYMENT_STEP_BY_STEP.md) pentru pași detaliați cu screenshots.

## 📝 Pași Deployment Sumarizați

### 1. Pregătire (5 min)

```bash
# Test local
npm run build
cd labs_api && npm start

# Verify all features work
```

### 2. Database (Railway PostgreSQL) - 5 min

1. Create Railway account → New Project → Provision PostgreSQL
2. Copy `DATABASE_URL`
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 3. Backend (Railway) - 10 min

1. Railway → Deploy from GitHub → Select `labs_api` folder
2. Configure environment variables:
   - `DATABASE_URL=${{Postgres.DATABASE_URL}}`
   - `JWT_SECRET=your-secret-key`
   - `PORT=4000`
   - `NODE_ENV=production`
3. Deploy → Get URL: `https://labs-api-production.up.railway.app`

### 4. Frontend (Vercel) - 10 min

1. Vercel → Import Project → Select repository
2. Configure environment:
   - `NEXT_PUBLIC_API_URL=https://labs-api-production.up.railway.app`
3. Deploy → Get URL: `https://your-project.vercel.app`

### 5. Update CORS (2 min)

Edit `labs_api/server.js`:
```javascript
const allowedOrigins = [
  'https://your-project.vercel.app',
  'http://localhost:3000'
]
```

Commit + push → Auto redeploy!

## ✅ Verificare

### Test Backend:
```bash
curl https://labs-api-production.up.railway.app/health
# Expected: {"status":"ok","timestamp":"..."}
```

### Test Frontend:
1. Open `https://your-project.vercel.app`
2. Register → Login → Upload CSV → Create Dashboard → Success! ✓

## 📊 Features Implementate

### Interfețe CRUD (Lab 7 API)

| Operație | Endpoint | Frontend Page |
|----------|----------|---------------|
| Upload CSV | `POST /api/files/upload` | `/upload` |
| List Files | `GET /api/files` | `/files` |
| Delete File | `DELETE /api/files/:id` | `/files` |
| Create Chart | `POST /api/charts` | `/dashboard/[id]` |
| List Dashboards | `GET /api/dashboards` | `/dashboard` |
| Create Dashboard | `POST /api/dashboards` | `/dashboard` |
| Delete Dashboard | `DELETE /api/dashboards/:id` | `/dashboard` |

### Hosting Features

✅ **Frontend (Vercel)**:
- Next.js 15 deployment
- Auto HTTPS/SSL
- Global CDN
- Environment variables management
- Custom domain support

✅ **Backend (Railway)**:
- Express.js deployment
- PostgreSQL database included
- Auto-deploy from Git
- Environment variables
- Custom domain support

## 🐛 Troubleshooting

Vezi ghidul complet: [TROUBLESHOOTING.md](./deployment-guide/TROUBLESHOOTING.md)

Probleme comune:
- **CORS Error**: Adaugă frontend URL în `allowedOrigins`
- **401 Unauthorized**: Verifică JWT_SECRET identic
- **Database Error**: Verifică DATABASE_URL în Railway
- **Build Failed**: Rulează `npm run build` local

## 📚 Resurse

### Documentație Deployment
- [DEPLOYMENT_STEP_BY_STEP.md](./deployment-guide/DEPLOYMENT_STEP_BY_STEP.md) - Ghid complet cu screenshots
- [QUICK_START.md](./deployment-guide/QUICK_START.md) - Deployment rapid 30 min
- [DEPLOYMENT_CHECKLIST.md](./deployment-guide/DEPLOYMENT_CHECKLIST.md) - Checklist verificare
- [TROUBLESHOOTING.md](./deployment-guide/TROUBLESHOOTING.md) - Soluții probleme

### Exemple Cod
- [api-integration-example.tsx](./cod_sursa/frontend-enhancements/api-integration-example.tsx) - Upload file cu API
- [complete-crud-example.tsx](./cod_sursa/frontend-enhancements/complete-crud-example.tsx) - CRUD complet

### Scripts Deployment
- [deploy-frontend.sh](./cod_sursa/deployment/deploy-frontend.sh) - Bash script Vercel
- [deploy-backend.sh](./cod_sursa/deployment/deploy-backend.sh) - Bash script Railway
- [deploy-frontend.ps1](./cod_sursa/deployment/deploy-frontend.ps1) - PowerShell Vercel
- [deploy-backend.ps1](./cod_sursa/deployment/deploy-backend.ps1) - PowerShell Railway

### External Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

## 📄 Livrabile

### Document Word (cerut în PDF laborator)

Structură recomandată:

1. **Introducere**
   - Obiective lab
   - Stack tehnologic ales

2. **Interfețe Frontend CRUD**
   - Screenshots pagini `/files`, `/dashboard`
   - Explicații consumare API
   - Code snippets

3. **Deployment Backend**
   - Screenshots Railway dashboard
   - Pași configurare PostgreSQL
   - Environment variables
   - Test endpoints

4. **Deployment Frontend**
   - Screenshots Vercel dashboard
   - Build logs
   - Environment variables
   - Preview deployment

5. **Custom Domains**
   - DNS configuration
   - CNAME records
   - SSL certificates

6. **Testing**
   - Complete user flow
   - Network tab screenshots
   - Performance metrics

7. **Concluzii**
   - Link-uri aplicație live
   - Lecții învățate
   - Provocări

## 🎓 Grading Criteria

| Criteriu | Punctaj |
|----------|---------|
| Interfețe CRUD funcționale | 40% |
| Backend deployed corect | 20% |
| Frontend deployed corect | 20% |
| Documentație completă | 15% |
| Custom domains (bonus) | 5% |

**Total**: 100%

## 📞 Support

- Check `TROUBLESHOOTING.md` first
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://vercel.com/discord
- Stack Overflow: tags `vercel`, `railway`, `next.js`

## 🔗 Links Utile

**Live Application** (după deployment):
- Frontend: `https://your-project.vercel.app`
- Backend API: `https://labs-api-production.up.railway.app`
- Database: Railway PostgreSQL (private)

**Lab Pages**:
- Lab 8 Interactive: `/LABS/lab8`
- All Labs: `/LABS`

---

**Deployment Time**: ~30-120 minutes (depending on experience)

**Difficulty**: ⭐⭐⭐ (Medium)

**Prerequisites**: Labs 1-7 completed
