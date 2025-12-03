# Lab 8 - Deployment Guide: Vercel + Railway

## 📋 Cerințe Laborator 8

1. **Utilizare API în Frontend** - Interfețe web CRUD pentru operațiile API Lab 7
2. **Hosting on WebServer** - Publicare aplicație accesibilă fără mediul de dezvoltare
   - Frontend: `proiect-MVC-demo.com`
   - Backend API: `proiect-api-demo.com`

---

## 🚀 Stack Deployment

- **Frontend**: Vercel (Next.js hosting)
- **Backend**: Railway (Express.js API)
- **Database**: Railway PostgreSQL

---

## ⏱️ Timp Estimat Total: ~2 ore

---

## PARTEA 1: Pregătire Deployment (30 min)

### Pas 1.1: Verificare Aplicație Local

```bash
# Test frontend build
npm run build
npm start

# Test backend
cd labs_api
npm start
```

**Verificări:**
- ✅ Frontend se deschide la `http://localhost:3000`
- ✅ Backend răspunde la `http://localhost:4000/health`
- ✅ Login/Register funcționează
- ✅ Upload fișiere CSV funcționează
- ✅ Creare dashboards și charts funcționează

### Pas 1.2: Pregătire Environment Variables

Creează fișier `.env.production` în root:

```env
# Frontend (Vercel)
NEXT_PUBLIC_API_URL=https://labs-api-production.up.railway.app

# Database
DATABASE_URL=postgresql://postgres:password@railway.app:5432/railway

# Backend secrets
JWT_SECRET=your-production-jwt-secret-key-change-this
```

⚠️ **IMPORTANT**: 
- Nu commita `.env.production` în Git!
- Folosește valori diferite de cele din development
- JWT_SECRET trebuie să fie același în frontend și backend

### Pas 1.3: Update CORS în Backend

Edit `labs_api/server.js`:

```javascript
const cors = require('cors')

const allowedOrigins = [
  'http://localhost:3000',  // Development
  'https://your-project.vercel.app',  // Vercel preview
  'https://proiect-MVC-demo.com',  // Production domain
]

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
```

---

## PARTEA 2: Database Deployment pe Railway (15 min)

### Pas 2.1: Creare Cont Railway

1. Accesează https://railway.app
2. Click **"Start a New Project"**
3. Autentifică-te cu GitHub
4. Permite acces la repository `data-dashboard`

### Pas 2.2: Adaugă PostgreSQL Service

1. Click **"New Project"** → **"Provision PostgreSQL"**
2. Railway creează automat PostgreSQL instance
3. Click pe PostgreSQL service → **"Variables"** tab
4. Copiază `DATABASE_URL` (arată ceva gen):
   ```
   postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway
   ```

### Pas 2.3: Rulează Migrations pe Production Database

```bash
# Set environment variable temporar
$env:DATABASE_URL="postgresql://postgres:password@containers-us-west-123.railway.app:5432/railway"

# Rulează migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed database cu plans (optional)
npx prisma db seed
```

**Verificare:**
```bash
# Connect la production DB
npx prisma studio
```

Ar trebui să vezi tabelele: `User`, `Plan`, `File`, `Dashboard`, `Chart`, `UsageLog`

---

## PARTEA 3: Backend Deployment pe Railway (30 min)

### Pas 3.1: Configurare Railway pentru Backend

1. În Railway dashboard, click **"New"** → **"GitHub Repo"**
2. Selectează repository `cocrisiulian/data-dashboard`
3. Railway detectează automat Node.js project

### Pas 3.2: Configurare Root Directory

⚠️ **IMPORTANT**: Aplicația backend este în subfolder `labs_api`

1. Click pe service creat → **"Settings"**
2. Scroll la **"Service Settings"**
3. **Root Directory**: `labs_api`
4. **Start Command**: `npm start`
5. **Build Command**: `npm install && npx prisma generate`

### Pas 3.3: Adaugă Environment Variables

Click **"Variables"** tab și adaugă:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-production-jwt-secret-key
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://your-project.vercel.app
```

**Explicație:**
- `${{Postgres.DATABASE_URL}}` → Railway referențiază automat PostgreSQL service
- `JWT_SECRET` → Copiază exact același din `.env.production`
- `CORS_ORIGIN` → Vei actualiza după ce deploiești frontend

### Pas 3.4: Deploy Backend

1. Railway va face auto-deploy după configurare
2. Așteaptă build process (~2-3 minute)
3. Click **"Deployments"** tab → Vezi logs
4. Când status devine **"Success"**, click **"View Logs"**

**Logs de succes arată:**
```
✓ Labs API (MVC) running on http://localhost:4000
✓ Health check: http://localhost:4000/health
```

### Pas 3.5: Obține Backend URL

1. Click **"Settings"** → **"Domains"**
2. Railway generează automat: `labs-api-production.up.railway.app`
3. Click **"Generate Domain"** dacă nu există
4. **Copiază URL-ul** (îl vei folosi în frontend)

### Pas 3.6: Test Backend API

```bash
# Test health endpoint
curl https://labs-api-production.up.railway.app/health

# Test register
curl -X POST https://labs-api-production.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","username":"testuser"}'

# Test login
curl -X POST https://labs-api-production.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## PARTEA 4: Frontend Deployment pe Vercel (30 min)

### Pas 4.1: Creare Cont Vercel

1. Accesează https://vercel.com
2. Click **"Sign Up"** → Autentifică-te cu GitHub
3. Permite acces la repository `data-dashboard`

### Pas 4.2: Import Project

1. Click **"Add New"** → **"Project"**
2. Selectează `cocrisiulian/data-dashboard`
3. **Framework Preset**: Next.js (detectat automat)
4. **Root Directory**: `./` (root al repo-ului)
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`

### Pas 4.3: Configurare Environment Variables

Click **"Environment Variables"** și adaugă:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_API_URL` | `https://labs-api-production.up.railway.app` |
| `DATABASE_URL` | `postgresql://postgres:password@railway.app:5432/railway` |

⚠️ **Notă**: `NEXT_PUBLIC_*` variabile sunt expuse în browser!

### Pas 4.4: Deploy Frontend

1. Click **"Deploy"**
2. Așteaptă build (~2-3 minute)
3. Status devine **"Ready"**
4. Vercel generează URL: `https://datainsight-dashboard.vercel.app`

### Pas 4.5: Test Frontend Deployed

1. Deschide URL-ul generat de Vercel
2. Test funcționalități:
   - ✅ Register nou utilizator
   - ✅ Login cu credențiale
   - ✅ Upload CSV file
   - ✅ Creare dashboard
   - ✅ Adaugă chart la dashboard

**Verificare Network Tab:**
- Requests merg către `https://labs-api-production.up.railway.app/api/*`
- Status codes: 200 (success), 401 (unauthorized)

---

## PARTEA 5: Custom Domains (20 min)

### Pas 5.1: Configurare Frontend Domain

**Opțiunea A: Folosește domeniu propriu**

1. Cumpără domeniu de la Namecheap/GoDaddy: `proiect-MVC-demo.com`
2. În Vercel → **"Settings"** → **"Domains"**
3. Click **"Add"** → Introdu `proiect-MVC-demo.com`
4. Vercel cere să adaugi DNS records:
   - **Type**: CNAME
   - **Name**: `@` (sau `www`)
   - **Value**: `cname.vercel-dns.com`
5. Adaugă în provider DNS (Namecheap/GoDaddy)
6. Așteaptă propagare (~5-60 minute)

**Opțiunea B: Folosește subdomain Vercel (GRATIS)**

- Vercel oferă: `your-project.vercel.app`
- Deja configurat automat
- SSL/HTTPS inclus

### Pas 5.2: Configurare Backend API Domain

**În Railway Dashboard:**

1. Click pe backend service → **"Settings"** → **"Domains"**
2. Click **"Generate Domain"** → Primești `*.up.railway.app`
3. **Custom Domain** (dacă ai): `proiect-api-demo.com`
   - Adaugă CNAME în DNS: `your-project.up.railway.app`

### Pas 5.3: Update CORS cu Noile Domenii

Edit `labs_api/server.js`:

```javascript
const allowedOrigins = [
  'https://datainsight-dashboard.vercel.app',
  'https://proiect-MVC-demo.com',
  'http://localhost:3000'
]
```

Commit + push → Railway va redeploy automat.

### Pas 5.4: Update Frontend API URL

În Vercel → **"Settings"** → **"Environment Variables"**:

```
NEXT_PUBLIC_API_URL=https://proiect-api-demo.com
```

Click **"Redeploy"** → Frontend va folosi noul URL.

---

## ✅ Checklist Final

### Frontend (Vercel)
- [ ] Build reușit fără erori
- [ ] URL accessible: `https://proiect-MVC-demo.com`
- [ ] SSL certificate valid (HTTPS)
- [ ] Environment variables configurate corect
- [ ] Login/Register funcționează
- [ ] Upload CSV funcționează
- [ ] Dashboards și charts funcționează

### Backend (Railway)
- [ ] API deployment reușit
- [ ] Health endpoint răspunde: `/health`
- [ ] Database connection funcționează
- [ ] CORS permite requests de la frontend
- [ ] Environment variables configurate
- [ ] Logs nu arată erori critice

### Database (Railway PostgreSQL)
- [ ] Toate tabelele create (User, Plan, File, Dashboard, Chart)
- [ ] Migrations rulate cu succes
- [ ] Seed data pentru plans existent
- [ ] Connection string valid

---

## 🎯 Livrabile Lab 8

### Document Word (cerut în PDF laborator)

Creează `LAB8_Deployment_Documentation.docx` cu:

1. **Introducere**
   - Obiectivele laboratorului
   - Stack tehnologic ales (Vercel + Railway)

2. **Secțiunea 1: Interfețe Frontend CRUD**
   - Screenshots cu pagini `/files`, `/dashboard`
   - Explicații cum se consumă API-ul
   - Code snippets pentru API calls

3. **Secțiunea 2: Deployment Backend (Railway)**
   - Screenshots Railway dashboard
   - Pași configurare PostgreSQL
   - Environment variables setup
   - Test API cu Postman/curl

4. **Secțiunea 3: Deployment Frontend (Vercel)**
   - Screenshots Vercel dashboard
   - Build logs
   - Environment variables
   - Preview deployment URL

5. **Secțiunea 4: Custom Domains**
   - DNS configuration screenshots
   - CNAME records
   - SSL certificate verification

6. **Secțiunea 5: Testing Aplicație Deployed**
   - Complete user flow: Register → Login → Upload → Create Chart
   - Network tab screenshots
   - Performance metrics

7. **Concluzii**
   - Link-uri aplicație live
   - Lecții învățate
   - Provocări întâmpinate

---

## 🐛 Troubleshooting

### Problema: Build Failed pe Vercel

**Soluție:**
```bash
# Test local
npm run build

# Verifică erori în output
# Fix și commit changes
git add .
git commit -m "fix: build errors"
git push origin main
```

### Problema: CORS Error în Browser

**Soluție:**
- Verifică `allowedOrigins` în `labs_api/server.js`
- Include exact URL-ul Vercel (cu `https://`)
- Redeploy backend după modificare

### Problema: Database Connection Failed

**Soluție:**
- Verifică `DATABASE_URL` în Railway variables
- Test connection: `npx prisma studio`
- Regenerate connection string dacă expirat

### Problema: Environment Variables nu sunt Loaded

**Soluție:**
- Vercel: Trebuie redeploy după adăugare env vars
- Railway: Auto-redeploy, dar verifică logs
- `NEXT_PUBLIC_*` trebuie să înceapă cu prefix

---

## 📚 Resurse Adiționale

- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [Railway Deployment Docs](https://docs.railway.app/deploy/deployments)
- [Prisma Production Deployment](https://www.prisma.io/docs/guides/deployment/deployment-guides)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

---

**Succes la deployment! 🚀**
