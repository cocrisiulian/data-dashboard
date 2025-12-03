# Lab 8 - Troubleshooting Guide

## Common Issues & Solutions

---

### 🔴 Issue 1: "Build Failed" on Vercel

**Symptom:**
- Deployment fails with error during build
- Error messages in Vercel logs

**Possible Causes:**
1. TypeScript errors in code
2. Missing environment variables
3. Package installation failures
4. Out of memory during build

**Solutions:**

```bash
# Solution 1: Test build locally first
npm run build

# If build fails locally, fix errors before pushing
npm run type-check  # Check TypeScript errors

# Solution 2: Check Vercel build logs
# Go to Vercel Dashboard → Deployments → Click failed deployment → View logs

# Solution 3: Increase Node.js memory (if needed)
# Add in package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' next build"

# Solution 4: Clear Vercel cache
# Vercel Dashboard → Settings → Clear Build Cache → Redeploy
```

---

### 🔴 Issue 2: CORS Error in Browser

**Symptom:**
```
Access to fetch at 'https://api.railway.app/api/files' from origin 
'https://your-app.vercel.app' has been blocked by CORS policy
```

**Cause:**
Backend doesn't allow requests from frontend domain.

**Solution:**

Edit `labs_api/server.js`:

```javascript
const cors = require('cors')

// Add your frontend URLs
const allowedOrigins = [
  'http://localhost:3000',                    // Development
  'https://your-project.vercel.app',          // Vercel production
  'https://your-project-git-main.vercel.app', // Vercel preview
  'https://proiect-MVC-demo.com',             // Custom domain
]

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true)
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false)
    }
    return callback(null, true)
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))
```

**After fix:**
1. Commit changes: `git add . && git commit -m "fix: CORS configuration"`
2. Push to GitHub: `git push origin main`
3. Railway will auto-redeploy
4. Test again in browser

---

### 🔴 Issue 3: Database Connection Error

**Symptom:**
```
Error: Can't reach database server at containers-us-west-123.railway.app:5432
```

**Possible Causes:**
1. Wrong DATABASE_URL
2. Railway PostgreSQL service not running
3. Network/firewall issues

**Solutions:**

```bash
# Solution 1: Verify DATABASE_URL in Railway
# Railway Dashboard → PostgreSQL service → Variables → Copy DATABASE_URL

# Solution 2: Test connection with Prisma
npx prisma studio
# If opens successfully → DB connection works

# Solution 3: Check Railway PostgreSQL service status
# Railway Dashboard → PostgreSQL service → Deployments
# Status should be "Active"

# Solution 4: Regenerate database
# Railway Dashboard → PostgreSQL service → Settings → Delete Service
# Create new PostgreSQL service → Copy new DATABASE_URL
# Update in all places (Vercel, Railway backend, local .env)
```

---

### 🔴 Issue 4: Environment Variables Not Working

**Symptom:**
- `process.env.NEXT_PUBLIC_API_URL` is `undefined`
- API calls go to wrong URL
- JWT authentication fails

**Cause:**
Environment variables not set correctly or not redeployed.

**Solutions:**

**For Vercel (Frontend):**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add variable: `NEXT_PUBLIC_API_URL` = `https://your-api.railway.app`
3. ⚠️ **Important**: Must start with `NEXT_PUBLIC_` to be exposed to browser
4. After adding → Click **"Redeploy"** (not automatic!)

**For Railway (Backend):**
1. Go to Railway Dashboard → Backend service → Variables
2. Add: `JWT_SECRET`, `DATABASE_URL`, `PORT`
3. Auto-redeploys after saving

**Verification:**
```javascript
// In browser console (Frontend)
console.log(process.env.NEXT_PUBLIC_API_URL)
// Should print: https://your-api.railway.app

// In Railway logs (Backend)
console.log('DATABASE_URL:', process.env.DATABASE_URL)
// Should print full PostgreSQL connection string
```

---

### 🔴 Issue 5: 404 Not Found After Deployment

**Symptom:**
- Pages work locally but return 404 on Vercel
- Example: `/dashboard/[id]` → 404

**Cause:**
Dynamic routes not configured properly or missing pages.

**Solutions:**

```bash
# Solution 1: Check file structure
# Dynamic routes need bracket notation: [id]
src/app/dashboard/[id]/page.tsx  ✓ Correct
src/app/dashboard/id/page.tsx    ✗ Wrong

# Solution 2: Verify next.config.mjs
# Should NOT have custom output or distDir

# Solution 3: Clear .next folder and rebuild
rm -rf .next
npm run build
npm start

# Solution 4: Check Vercel build logs
# Vercel Dashboard → Deployments → View logs
# Look for "Compiled successfully" message
```

---

### 🔴 Issue 6: "Token Invalid" or 401 Unauthorized

**Symptom:**
- Login works but subsequent API calls fail
- Error: "jwt malformed" or "invalid token"

**Cause:**
JWT_SECRET different between frontend and backend.

**Solutions:**

```bash
# Solution 1: Verify JWT_SECRET matches
# Backend (Railway): JWT_SECRET=abc123xyz
# Frontend (Vercel): JWT_SECRET=abc123xyz  (must be EXACT same)

# Solution 2: Check token storage
# In browser console:
localStorage.getItem('auth_token')
// Should return a long string starting with "eyJ..."

# Solution 3: Debug token in backend
# Add to labs_api/middleware/auth.js:
console.log('Received token:', token)
console.log('JWT_SECRET:', process.env.JWT_SECRET)

# Solution 4: Regenerate token
# Clear localStorage in browser:
localStorage.clear()
# Login again to get fresh token
```

---

### 🔴 Issue 7: File Upload Fails (413 Payload Too Large)

**Symptom:**
```
413 Payload Too Large
```

**Cause:**
File size exceeds server limit.

**Solutions:**

Edit `labs_api/server.js`:

```javascript
// Increase body parser limits
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))

// In multer config (routes/files.js)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },
  fileFilter: fileFilter
})
```

**Railway Volume Configuration:**
```bash
# Railway Dashboard → Backend service → Settings → Volumes
# Add volume: /app/uploads
# This persists uploaded files across deployments
```

---

### 🔴 Issue 8: Custom Domain Not Working

**Symptom:**
- Domain doesn't resolve to site
- Shows "DNS_PROBE_FINISHED_NXDOMAIN"

**Cause:**
DNS records not configured correctly.

**Solutions:**

**For Vercel Frontend:**
```
1. Domain registrar (Namecheap/GoDaddy):
   Type: CNAME
   Name: @ (or www)
   Value: cname.vercel-dns.com
   TTL: Automatic

2. Wait 5-60 minutes for DNS propagation

3. Verify with:
   nslookup proiect-MVC-demo.com
   # Should return Vercel IP addresses
```

**For Railway Backend:**
```
1. Railway Dashboard → Backend service → Settings → Domains
2. Click "Add Custom Domain"
3. Enter: proiect-api-demo.com
4. Railway shows CNAME target

5. Add in domain registrar:
   Type: CNAME
   Name: @ (or api)
   Value: <your-project>.up.railway.app
   TTL: Automatic
```

---

### 🔴 Issue 9: Prisma Migrations Fail on Railway

**Symptom:**
```
Error: Migration failed to apply
```

**Cause:**
Migration conflicts or database schema mismatch.

**Solutions:**

```bash
# Solution 1: Reset database (⚠️ Deletes all data!)
# Railway Dashboard → PostgreSQL → Settings → Reset Database

# Solution 2: Deploy migrations manually
$env:DATABASE_URL="<railway-postgres-url>"
npx prisma migrate deploy
npx prisma generate

# Solution 3: Use db push (for development only)
npx prisma db push --accept-data-loss

# Solution 4: Check migration files
# prisma/migrations/ folder should be committed to Git
git add prisma/migrations
git commit -m "add migrations"
git push origin main
```

---

### 🔴 Issue 10: Slow Performance on Free Tier

**Symptom:**
- First request takes 10-30 seconds
- Subsequent requests fast

**Cause:**
Railway/Vercel free tier "cold starts" - services sleep after inactivity.

**Solutions:**

```bash
# Solution 1: Keep service warm with cron job
# Use cron-job.org or GitHub Actions to ping every 5 minutes:
# GET https://your-api.railway.app/health

# Solution 2: Upgrade to paid tier
# Railway: $5/month removes cold starts
# Vercel: Pro plan $20/month

# Solution 3: Optimize cold start time
# - Reduce dependencies in package.json
# - Use Prisma binary targets
# - Minimize serverless function size
```

---

## 📊 Health Check Endpoints

**Backend Health Check:**
```bash
curl https://your-api.railway.app/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2025-12-03T10:30:00.000Z",
  "environment": "production"
}
```

**Database Connection Check:**
```bash
# In Railway logs, should see:
✓ Prisma connected to database
✓ Server running on port 4000
```

---

## 🛠️ Debugging Tools

### Browser DevTools
```javascript
// Network tab → Check API requests
// Console → Check for JavaScript errors
// Application → localStorage/cookies → Verify auth token
```

### Railway Logs
```bash
# Railway Dashboard → Deployments → View Logs
# Filter: "error" or "warning"
# Check for database connection errors
```

### Vercel Logs
```bash
# Vercel Dashboard → Deployments → Function Logs
# Real-time logs during deployment
# Runtime logs for serverless functions
```

### Prisma Studio
```bash
# Connect to production database
npx prisma studio
# Visual interface to inspect data
```

---

## 📞 Support Resources

- **Vercel Discord**: https://vercel.com/discord
- **Railway Discord**: https://discord.gg/railway
- **Stack Overflow**: Tag `vercel`, `railway`, `next.js`
- **GitHub Issues**: Check repository issues

---

**Need more help?** Check deployment logs first - 90% of issues show error messages in logs!
