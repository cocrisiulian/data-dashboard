# DataInsight Dashboard - Installation Guide

Complete step-by-step installation and setup guide for DataInsight Dashboard on a fresh system.

## 📋 Prerequisites (Required Software)

Before starting, ensure you have these installed:

### 1. **Node.js** v18.x or higher
- **Download:** [https://nodejs.org](https://nodejs.org)
- **Verify installation:**
  ```bash
  node --version
  npm --version
  ```
- Required version: `v18.0.0` or higher

### 2. **PostgreSQL** v14.x or higher
- **Download:** [https://www.postgresql.org/download/](https://www.postgresql.org/download/)
- **Verify installation:**
  ```bash
  psql --version
  ```
- During installation, remember your PostgreSQL password

### 3. **Git** (for cloning repository)
- **Download:** [https://git-scm.com/](https://git-scm.com/)
- **Verify installation:**
  ```bash
  git --version
  ```

### 4. **Package Manager**
- **npm** (comes with Node.js) or **pnpm** (recommended)
- **Install pnpm** (optional but faster):
  ```bash
  npm install -g pnpm
  ```

---

## 🚀 Installation Steps

### Step 1: Clone Repository

```bash
# Clone the project
git clone https://github.com/cocrisiulian/data-dashboard.git
cd data-dashboard
```

### Step 2: Install Dependencies

```bash
# Install all npm packages (this may take a few minutes)
npm install

# OR if using pnpm
pnpm install
```

**What gets installed:**
- Frontend dependencies (Next.js, React, Tailwind)
- Backend dependencies (Express, Prisma, JWT)
- Development tools (TypeScript, ESLint)

### Step 3: Configure PostgreSQL Database

#### 3.1 Create Database

**Windows (using psql command line):**
```cmd
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE datainsight_dashboard;

# Create user (optional, for better security)
CREATE USER datainsight_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE datainsight_dashboard TO datainsight_user;

# Exit psql
\q
```

**macOS/Linux:**
```bash
# Create database
createdb datainsight_dashboard

# OR using psql
psql -U postgres -c "CREATE DATABASE datainsight_dashboard;"
```

#### 3.2 Run Database Setup Scripts

**Option A - Consolidated Setup (Recommended):**
```bash
# Navigate to scripts directory
cd scripts/DB

# Run complete setup
psql -U postgres -d datainsight_dashboard -f setup-database.sql

# Verify setup
psql -U postgres -d datainsight_dashboard -f verify-setup.sql
```

**Option B - Individual Scripts:**
```bash
cd scripts/DB

# Run scripts in order
psql -U postgres -d datainsight_dashboard -f 00-drop-all.sql
psql -U postgres -d datainsight_dashboard -f 01-create-tables.sql
psql -U postgres -d datainsight_dashboard -f 02-indexes.sql
psql -U postgres -d datainsight_dashboard -f 03-insert-plans.sql
```

**What this creates:**
- Users table (with authentication)
- Plans table (Free, Pro, Enterprise)
- Files table (uploaded CSV files)
- Dashboards table
- Charts table
- Usage logs table
- All necessary indexes and constraints

### Step 4: Configure Environment Variables

Create a `.env` file in the **root directory**:

```bash
# Copy example file
cp .env.example .env

# OR create manually
touch .env
```

**Add these variables to `.env`:**

```env
# Database Connection
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/datainsight_dashboard"

# JWT Authentication
JWT_SECRET="change-this-to-a-long-random-secret-key-in-production"
JWT_EXPIRES_IN="7d"

# Server Configuration
PORT=4000
NODE_ENV=development

# Frontend (Next.js)
NEXT_PUBLIC_API_URL="http://localhost:4000"

# File Upload
UPLOAD_DIR="./labs_api/uploads"
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=".csv,.txt"

# Logging
LOG_LEVEL=info
```

**⚠️ Important:**
- Replace `your_password` with your PostgreSQL password
- Change `JWT_SECRET` to a secure random string (use 32+ characters)
- Keep `.env` file secure - never commit to Git

### Step 5: Setup Prisma ORM

```bash
# Generate Prisma Client (creates TypeScript types)
npx prisma generate

# Push schema to database (if not using SQL scripts)
npx prisma db push

# Optional: View database in Prisma Studio
npx prisma studio
```

**Prisma Studio** will open at `http://localhost:5555` - use this to browse your database visually.

### Step 6: Seed Database (Optional)

Add initial data for testing:

```bash
# Run seed script
node prisma/seed.js
```

**What this adds:**
- Default subscription plans (Free, Pro, Enterprise)
- Sample user account for testing

### Step 7: Create Upload Directory

```bash
# Create directory for file uploads
mkdir -p labs_api/uploads
```

**For Windows:**
```cmd
mkdir labs_api\uploads
```

---

## ▶️ Running the Application

### Development Mode (Recommended for Testing)

You need **TWO terminals** running simultaneously:

#### Terminal 1 - Backend API Server
```bash
cd labs_api
node server.js
```

**Expected output:**
```
Server running on port 4000
Database connected
```

**Backend is available at:** `http://localhost:4000`

#### Terminal 2 - Frontend Next.js Server
```bash
# From project root
npm run dev

# OR with pnpm
pnpm dev
```

**Expected output:**
```
✓ Ready in 2.5s
Local: http://localhost:3000
```

**Frontend is available at:** `http://localhost:3000`

### Production Mode

```bash
# Build frontend for production
npm run build

# Start production servers
cd labs_api && node server.js &
npm start
```

---

## ✅ Verification Steps

### 1. Check Database Connection

```bash
# Test PostgreSQL is running
pg_isready

# Connect to database
psql -U postgres -d datainsight_dashboard

# List tables
\dt

# Expected output: users, plans, files, dashboards, charts, usage_logs
```

### 2. Test Backend API

**Using curl (Linux/Mac):**
```bash
# Health check
curl http://localhost:4000/health

# Get plans
curl http://localhost:4000/api/plans
```

**Using PowerShell (Windows):**
```powershell
# Health check
Invoke-WebRequest http://localhost:4000/health

# Get plans
Invoke-WebRequest http://localhost:4000/api/plans
```

**Expected response:** JSON with status or plans data

### 3. Test Frontend

Open browser and navigate to:
- **Homepage:** `http://localhost:3000`
- **Login:** `http://localhost:3000/login`
- **Register:** `http://localhost:3000/register`
- **Labs:** `http://localhost:3000/LABS`

### 4. Test Complete Flow

1. Register new account at `/register`
2. Login with credentials
3. Upload a CSV file at `/upload`
4. Create a dashboard at `/dashboard`
5. Create a chart from uploaded file

---

## 🐛 Troubleshooting

### Database Connection Errors

**Error:** `connection refused` or `database does not exist`

**Solutions:**
```bash
# Check PostgreSQL is running
# Windows (Services):
services.msc
# Look for "postgresql-x64-14" and ensure it's Running

# Mac:
brew services list
brew services start postgresql

# Linux:
sudo systemctl status postgresql
sudo systemctl start postgresql

# Verify DATABASE_URL in .env matches your setup
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
```

### Port Already in Use

**Error:** `Port 3000 is already in use`

**Solutions:**
```bash
# Find process using port
# Windows:
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9

# OR change port in package.json:
"dev": "next dev -p 3001"
```

### Prisma Client Errors

**Error:** `@prisma/client did not initialize yet`

**Solutions:**
```bash
# Regenerate Prisma Client
npx prisma generate

# If that fails, clean install
rm -rf node_modules
rm -rf .next
npm install
npx prisma generate
```

### File Upload Errors

**Error:** `ENOENT: no such file or directory, open './labs_api/uploads/...'`

**Solution:**
```bash
# Create uploads directory
mkdir -p labs_api/uploads

# Check permissions (Mac/Linux)
chmod 755 labs_api/uploads

# Verify UPLOAD_DIR in .env points to correct path
```

### JWT Authentication Errors

**Error:** `invalid signature` or `jwt malformed`

**Solutions:**
- Clear browser localStorage: `localStorage.clear()` in console
- Verify JWT_SECRET is set in `.env`
- Ensure JWT_SECRET is the same value used when token was created

### Database Migration Errors

**Error:** `Migration failed` or `schema mismatch`

**Solutions:**
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# OR manually rebuild
psql -U postgres -d datainsight_dashboard -f scripts/DB/00-drop-all.sql
psql -U postgres -d datainsight_dashboard -f scripts/DB/setup-database.sql
npx prisma generate
```

---

## 📚 Additional Resources

### Documentation
- **Prisma ORM:** [https://www.prisma.io/docs](https://www.prisma.io/docs)
- **Next.js:** [https://nextjs.org/docs](https://nextjs.org/docs)
- **PostgreSQL:** [https://www.postgresql.org/docs](https://www.postgresql.org/docs)
- **Express.js:** [https://expressjs.com/](https://expressjs.com/)

### Tools
- **Prisma Studio:** Visual database browser - `npx prisma studio`
- **Postman:** API testing - [https://www.postman.com/](https://www.postman.com/)
- **pgAdmin:** PostgreSQL GUI - [https://www.pgadmin.org/](https://www.pgadmin.org/)

### Test Credentials

After running seed script, use:
```
Email: test@datainsight.com
Password: password123
```

Or create new account at `/register`

---

## 🚀 Next Steps

1. **Explore Labs:** Navigate to `/LABS` to see all 11 laboratory implementations
2. **Upload Data:** Try uploading a CSV file at `/upload`
3. **Create Dashboard:** Build your first dashboard with charts
4. **Review Code:** Check `labs_api/` for backend MVC implementation
5. **Read Labs Documentation:** Each lab has detailed explanations in `/LABS/lab[1-11]`

---

## 📞 Support

If you encounter issues:

1. Check this troubleshooting section
2. Verify all prerequisites are installed correctly
3. Review console logs for detailed error messages
4. Ensure `.env` file is properly configured
5. Try deleting `node_modules`, `.next`, and reinstalling

---

## 📝 Notes

- **Development:** Always run both backend and frontend servers
- **Environment:** Keep `.env` file secure and never commit to repository
- **Database:** Backup database before running migration scripts
- **Ports:** Default ports are 3000 (frontend) and 4000 (backend)
- **Logs:** Check console output for detailed error information

**Happy coding! 🎉**
