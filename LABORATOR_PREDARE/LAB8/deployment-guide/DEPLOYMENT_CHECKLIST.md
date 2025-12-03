# Lab 8 - Checklist Deployment

## 📋 Pre-Deployment Checklist

### Local Development
- [ ] Aplicația rulează local fără erori
- [ ] `npm run build` reușește (frontend)
- [ ] `npm start` funcționează (backend)
- [ ] Database connection locală OK
- [ ] Toate features funcționează:
  - [ ] Login/Register
  - [ ] Upload CSV
  - [ ] Create Dashboard
  - [ ] Add Charts
  - [ ] Delete resources

### Code Quality
- [ ] No console errors în browser
- [ ] No TypeScript errors
- [ ] Environment variables documentate
- [ ] `.gitignore` conține `.env*`
- [ ] Sensitive data NU e în Git

### Dependencies
- [ ] `package.json` actualizat
- [ ] `package-lock.json` commitat
- [ ] Prisma schema syncat cu DB
- [ ] Migrations create și testate

---

## 🗄️ Database Deployment (Railway PostgreSQL)

### Setup
- [ ] Cont Railway creat
- [ ] PostgreSQL service provisionat
- [ ] DATABASE_URL copiat

### Migrations
- [ ] `npx prisma migrate deploy` rulat
- [ ] Toate tabelele create (verify cu Prisma Studio)
- [ ] Seed data inserat (plans)
- [ ] Connection string testat

### Verification
- [ ] Prisma Studio se conectează
- [ ] Queries funcționează
- [ ] RLS policies active (dacă folosești)

---

## 🔧 Backend Deployment (Railway)

### Configuration
- [ ] Repository linked la Railway
- [ ] Root directory: `labs_api`
- [ ] Build command: `npm install && npx prisma generate`
- [ ] Start command: `npm start`

### Environment Variables
- [ ] `DATABASE_URL` = `${{Postgres.DATABASE_URL}}`
- [ ] `JWT_SECRET` = (same as frontend)
- [ ] `PORT` = `4000`
- [ ] `NODE_ENV` = `production`
- [ ] `CORS_ORIGIN` = (frontend URLs)

### Deployment
- [ ] Build successful (no errors)
- [ ] Logs show "Server running on port 4000"
- [ ] Logs show "Prisma connected to database"
- [ ] No error messages in logs

### Testing
- [ ] `/health` endpoint responds
- [ ] `POST /api/auth/register` works
- [ ] `POST /api/auth/login` returns token
- [ ] Protected routes require auth
- [ ] Database queries work

### Domain
- [ ] Railway domain generated: `*.up.railway.app`
- [ ] Custom domain added (optional): `proiect-api-demo.com`
- [ ] SSL certificate active (automatic)

---

## 🎨 Frontend Deployment (Vercel)

### Configuration
- [ ] Repository imported în Vercel
- [ ] Framework: Next.js (detected)
- [ ] Root directory: `./`
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`

### Environment Variables
- [ ] `NEXT_PUBLIC_API_URL` = Railway backend URL
- [ ] `DATABASE_URL` = (same as backend)
- [ ] All `NEXT_PUBLIC_*` vars set

### Deployment
- [ ] Build successful
- [ ] Preview deployment works
- [ ] Production deployment successful
- [ ] No build warnings

### Testing
- [ ] Homepage loads
- [ ] Login page accessible
- [ ] Register funcționează
- [ ] Upload file funcționează
- [ ] Dashboard create/view works
- [ ] Charts display correctly
- [ ] API calls go to correct backend URL

### Domain
- [ ] Vercel domain: `*.vercel.app`
- [ ] Custom domain added (optional): `proiect-MVC-demo.com`
- [ ] DNS configured (CNAME)
- [ ] SSL certificate active

---

## 🔗 Integration Testing

### CORS Configuration
- [ ] Backend allows frontend origin
- [ ] Credentials: true enabled
- [ ] Preflight requests work (OPTIONS)
- [ ] No CORS errors în browser console

### Authentication Flow
- [ ] Register creates user in DB
- [ ] Login returns valid JWT token
- [ ] Token saved in localStorage
- [ ] Protected routes use token
- [ ] Token expiration handled

### API Integration
- [ ] All CRUD operations work:
  - [ ] GET requests successful
  - [ ] POST creates resources
  - [ ] PATCH updates data
  - [ ] DELETE removes items
- [ ] Error messages display correctly
- [ ] Loading states show during requests

### File Upload
- [ ] CSV upload works
- [ ] File size limits enforced
- [ ] File type validation works
- [ ] Uploaded files persist
- [ ] Files accessible after restart

---

## 🌐 Custom Domains (Optional)

### DNS Configuration
- [ ] Domain purchased (Namecheap/GoDaddy)
- [ ] CNAME records added:
  - [ ] Frontend: `@ → cname.vercel-dns.com`
  - [ ] Backend: `api → *.up.railway.app`
- [ ] DNS propagation complete (check: `nslookup`)

### Platform Configuration
- [ ] Domain added în Vercel dashboard
- [ ] Domain added în Railway dashboard
- [ ] SSL certificates issued (automatic)
- [ ] HTTPS redirects configured

### Update References
- [ ] CORS updated cu custom domain
- [ ] Frontend API URL updated
- [ ] Hard-coded URLs replaced
- [ ] Redeploy după changes

---

## 📄 Documentation

### Code Documentation
- [ ] README updated cu deployment info
- [ ] Environment variables documented
- [ ] API endpoints documented
- [ ] Setup instructions complete

### Lab Documentation (Word)
- [ ] Introducere scrisă
- [ ] Screenshots deployment process
- [ ] Pași deployment explicați
- [ ] Troubleshooting section
- [ ] Link-uri aplicație live
- [ ] Concluzii și lecții

### Screenshots Needed
- [ ] Railway dashboard (PostgreSQL)
- [ ] Railway backend deployment
- [ ] Railway environment variables
- [ ] Vercel build logs
- [ ] Vercel environment variables
- [ ] DNS configuration
- [ ] Working application (login/dashboard)
- [ ] Network tab showing API calls

---

## 🧪 Performance & Security

### Performance
- [ ] Page load < 3 seconds
- [ ] API response time < 500ms
- [ ] Images optimized
- [ ] Bundle size reasonable
- [ ] No memory leaks

### Security
- [ ] Passwords hashed (bcrypt)
- [ ] JWT tokens secure
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] No sensitive data in logs
- [ ] Environment variables în platformă (not Git)
- [ ] SQL injection protected (Prisma)

---

## 🎯 Final Verification

### Functional Testing
- [ ] Complete user journey works:
  1. [ ] Register new account
  2. [ ] Login with credentials
  3. [ ] Upload CSV file
  4. [ ] Create dashboard
  5. [ ] Add chart to dashboard
  6. [ ] View dashboard with chart
  7. [ ] Edit chart
  8. [ ] Delete chart
  9. [ ] Logout

### Cross-Browser Testing
- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works (if Mac available)

### Mobile Testing
- [ ] Responsive design works
- [ ] Touch interactions OK
- [ ] Mobile viewport correct

### Error Scenarios
- [ ] Invalid login shows error
- [ ] Network error handled gracefully
- [ ] 404 pages work
- [ ] 500 errors logged
- [ ] User feedback clear

---

## 📊 Monitoring & Logs

### Railway (Backend)
- [ ] Deployment logs checked
- [ ] Runtime logs monitored
- [ ] Error alerts configured (optional)
- [ ] Health check endpoint active

### Vercel (Frontend)
- [ ] Build logs reviewed
- [ ] Function logs available
- [ ] Analytics enabled (optional)
- [ ] Error tracking (Sentry - optional)

---

## ✅ Submission Checklist

### Lab Requirements Met
- [ ] ✅ Interfețe web CRUD pentru API Lab 7
- [ ] ✅ Aplicație hosted și accesibilă fără dev environment
- [ ] ✅ Frontend la: `proiect-MVC-demo.com` (sau Vercel URL)
- [ ] ✅ Backend API la: `proiect-api-demo.com` (sau Railway URL)

### Deliverables
- [ ] Document Word cu pași deployment
- [ ] Screenshots deployment process
- [ ] Link-uri aplicație live
- [ ] Code committed în Git
- [ ] Deployment configs în repo

---

## 🎓 Grading Criteria

| Criteriu | Puncte | Status |
|----------|--------|--------|
| Interfețe CRUD funcționale | 40% | [ ] |
| Backend deployed corect | 20% | [ ] |
| Frontend deployed corect | 20% | [ ] |
| Documentație completă | 15% | [ ] |
| Custom domains (bonus) | 5% | [ ] |

---

**Total Progress**: _____ / 100%

**Ready to submit**: [ ] YES / [ ] NO

---

## 📞 Need Help?

- Check `TROUBLESHOOTING.md`
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://vercel.com/discord
- Stack Overflow tags: `vercel`, `railway`, `next.js`
