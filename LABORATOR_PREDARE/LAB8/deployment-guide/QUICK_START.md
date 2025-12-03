# Lab 8 - Quick Start Guide

## 🎯 Obiectiv

Deploiați aplicația DataInsight Dashboard pe infrastructură cloud cu:
- **Frontend**: Vercel
- **Backend API**: Railway
- **Database**: Railway PostgreSQL

---

## ⚡ Quick Start (30 minute)

### Pas 1: Pregătire (5 min)

```bash
# Clone repository (dacă nu ai deja)
git clone https://github.com/cocrisiulian/data-dashboard.git
cd data-dashboard

# Install dependencies
npm install
cd labs_api && npm install && cd ..

# Test local
npm run build  # Frontend
cd labs_api && npm start  # Backend (in another terminal)
```

### Pas 2: Database Setup pe Railway (5 min)

1. **Creare cont**: https://railway.app → Login cu GitHub
2. **New Project** → **Provision PostgreSQL**
3. **Copy DATABASE_URL**:
   ```
   Railway Dashboard → PostgreSQL → Variables → DATABASE_URL
   ```
4. **Run migrations**:
   ```bash
   # Set temporary environment variable
   export DATABASE_URL="<paste-railway-url>"  # Linux/Mac
   $env:DATABASE_URL="<paste-railway-url>"    # Windows PowerShell
   
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Pas 3: Backend Deploy pe Railway (10 min)

1. **Railway** → **New** → **Deploy from GitHub Repo**
2. **Select** `cocrisiulian/data-dashboard`
3. **Settings**:
   - Root Directory: `labs_api`
   - Build Command: `npm install && npx prisma generate`
   - Start Command: `npm start`
4. **Variables** tab:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-secret-key-here
   PORT=4000
   NODE_ENV=production
   ```
5. **Deploy** → Wait 2-3 minutes
6. **Copy URL**: `https://labs-api-production.up.railway.app`

### Pas 4: Frontend Deploy pe Vercel (10 min)

1. **Creare cont**: https://vercel.com → Login cu GitHub
2. **Import Project** → Select `data-dashboard`
3. **Configure**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_URL=https://labs-api-production.up.railway.app
   DATABASE_URL=<same-as-railway-postgres>
   ```
5. **Deploy** → Wait 2-3 minutes
6. **Get URL**: `https://your-project.vercel.app`

### Pas 5: Update CORS (2 min)

Edit `labs_api/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'https://your-project.vercel.app',  // ADD THIS
]
```

Commit și push:
```bash
git add labs_api/server.js
git commit -m "fix: add Vercel URL to CORS"
git push origin main
```

Railway va redeploy automat!

---

## ✅ Verificare Deployment

### Test Backend:
```bash
# Health check
curl https://labs-api-production.up.railway.app/health

# Expected: {"status":"ok","timestamp":"..."}
```

### Test Frontend:
1. Deschide `https://your-project.vercel.app`
2. Register nou user
3. Login
4. Upload CSV file
5. Creare dashboard → Success! ✓

---

## 🔧 Comenzi Utile

```bash
# Vercel CLI
npm i -g vercel
vercel login
vercel --prod

# Railway CLI
npm i -g @railway/cli
railway login
railway link
railway logs

# Prisma migrations
npx prisma migrate deploy    # Production
npx prisma studio            # DB viewer
npx prisma db push           # Quick sync (dev only)
```

---

## 📊 Monitorizare

### Railway Logs:
```
Railway Dashboard → Deployments → View Logs
```

### Vercel Logs:
```
Vercel Dashboard → Deployments → Function Logs
```

### Database Inspector:
```bash
npx prisma studio
```

---

## 🐛 Probleme Comune

| Problemă | Soluție |
|----------|---------|
| CORS Error | Adaugă frontend URL în `allowedOrigins` |
| 401 Unauthorized | Verifică JWT_SECRET identic în ambele |
| Database Error | Verifică DATABASE_URL în Railway variables |
| Build Failed | Rulează `npm run build` local pentru erori |
| 404 Not Found | Verifică dynamic routes: `[id]/page.tsx` |

Vezi ghid complet: `TROUBLESHOOTING.md`

---

## 📚 Resurse

- [Deployment Guide](./DEPLOYMENT_STEP_BY_STEP.md) - Pas cu pas detaliat
- [Troubleshooting](./TROUBLESHOOTING.md) - Soluții probleme
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)

---

**Total timp deployment: ~30 minute** ⚡

**Aplicație live**: 
- Frontend: `https://your-project.vercel.app`
- Backend: `https://labs-api-production.up.railway.app`
- Database: Railway PostgreSQL (managed)
