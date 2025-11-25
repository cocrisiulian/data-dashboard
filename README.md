# DataInsight Dashboard

Modern web application for data visualization and analytics. Upload CSV files, create interactive charts, and build custom dashboards with a comprehensive plan system.

## 🚀 Features

- **Authentication System** - JWT-based secure login/register
- **File Management** - Upload and manage CSV files
- **Interactive Charts** - Bar, Line, Pie, and Area charts with Recharts
- **Custom Dashboards** - Create and organize multiple dashboards
- **Plan Management** - Free, Pro, and Enterprise tiers with limits
- **Lab Exercises** - 7 complete PPAW lab implementations

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Recharts** - Data visualization

### Backend

- **Express 4.21.1** - REST API server (MVC architecture)
- **Prisma 6.18.0** - ORM for PostgreSQL
- **PostgreSQL 14+** - Relational database (local setup)
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **csv-parse** - CSV parsing

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cocrisiulian/data-dashboard.git
   cd data-dashboard
   ```
2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```
3. **Set up environment variables**

   Copy `.env.example` to `.env` and configure:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/datainsight_dashboard"
   JWT_SECRET="your-secret-key-here"
   ```
4. **Set up PostgreSQL database**

   ```bash
   # Create database
   createdb datainsight_dashboard
   
   # OR using psql
   psql -U postgres
   CREATE DATABASE datainsight_dashboard;
   \q
   ```

5. **Initialize database schema**

   Option A - Use consolidated setup script (recommended):
   ```bash
   psql -U postgres -d datainsight_dashboard -f scripts/DB/setup-database.sql
   ```

   Option B - Run individual SQL scripts:
   ```bash
   cd scripts/DB
   psql -U postgres -d datainsight_dashboard -f 00-drop-all.sql
   psql -U postgres -d datainsight_dashboard -f 01-create-tables.sql
   psql -U postgres -d datainsight_dashboard -f 02-indexes.sql
   psql -U postgres -d datainsight_dashboard -f 03-insert-plans.sql
   # Continue with scripts 04-12 and 20-25 as needed
   ```

6. **Run Prisma setup**

   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Push schema to database (creates tables if not exist)
   npx prisma db push
   
   # Optional: Seed database with default plans
   node prisma/seed.js
   ```

## 🚀 Running the Application

### Development Mode

Run both frontend and backend servers:

```bash
# Terminal 1: Backend Express API (port 4000)
cd labs_api
node server.js

# Terminal 2: Next.js Frontend (port 3000)
npm run dev
# or
pnpm dev
```

**Access Points:**
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000`
- API Health Check: `http://localhost:4000/health`

### Production Build

```bash
# Build Next.js frontend
npm run build
npm start

# Backend runs with node server.js (ensure DATABASE_URL is set)
```

## 🔧 Environment Configuration

Create `.env` file in root directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/datainsight_dashboard"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# API Configuration
API_URL="http://localhost:4000"
NEXT_PUBLIC_API_URL="http://localhost:4000"

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR="./labs_api/uploads"
```

## 📁 Project Structure

```
├── src/
│   ├── app/                    # Next.js pages and API routes
│   │   ├── dashboard/          # Dashboard pages
│   │   ├── files/              # File management
│   │   ├── LABS/               # Lab exercises (Lab 1-7)
│   │   ├── login/              # Authentication
│   │   ├── pricing/            # Plan management
│   │   └── api/                # Next.js API routes
│   ├── components/             # React components
│   │   ├── charts/             # Chart components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── files/              # File components
│   │   └── ui/                 # Reusable UI components
│   ├── contexts/               # React contexts (AuthContext)
│   ├── hooks/                  # Custom hooks
│   └── lib/                    # Utilities and types
│       ├── api/                # API client
│       ├── types/              # TypeScript types
│       └── utils/              # Helper functions
├── labs_api/                   # Express backend (MVC)
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth & error handling
│   ├── config/                 # Configuration
│   └── uploads/                # Uploaded files
├── prisma/                     # Prisma ORM
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Migration history
└── scripts/DB/                 # SQL scripts (tables, RLS, policies)
```

## 🎓 Labs Implementation

All 7 PPAW laboratory exercises are fully implemented with complete source code:

### Laboratory Structure

Each lab is available in `LABORATOR_PREDARE/LAB[1-7]/` with:
- **cod_sursa/** - Working implementation files
- **fisiere_test/** - Test data (LAB7 only)

### Lab Topics

1. **LAB1 - Database Design** 
   - PostgreSQL schema design
   - Tables, indexes, constraints
   - Setup and verification scripts

2. **LAB2 - Backup & Recovery**
   - Physical backups (pg_dump)
   - Logical backups (SQL exports)
   - PowerShell automation scripts

3. **LAB3 - Prisma ORM**
   - Schema definition
   - Database client setup
   - CRUD operation examples

4. **LAB4 - Database Migrations**
   - Prisma migrations
   - Version control for schema
   - Migration history

5. **LAB5 - MVC Pattern**
   - Model-View-Controller architecture
   - Plans module implementation
   - RESTful API design

6. **LAB6 - Nested Resources**
   - Charts in Dashboards relationship
   - Parent-child resource routing
   - Cascade operations

7. **LAB7 - CSV Parsing & File Upload**
   - File upload with Multer
   - CSV parsing and validation
   - Auto-detect chart types from data

### Accessing Labs

Navigate to `/LABS` in the application to view all laboratory implementations with live examples.

## 🔐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/upgrade-plan` - Upgrade user plan

### Files

- `GET /api/files` - List user files
- `POST /api/files` - Upload file
- `GET /api/files/:id` - Get file details
- `GET /api/files/:id/preview` - Preview file data
- `DELETE /api/files/:id` - Delete file

### Charts

- `GET /api/charts` - List charts
- `POST /api/charts` - Create chart
- `GET /api/charts/:id` - Get chart
- `PATCH /api/charts/:id` - Update chart
- `DELETE /api/charts/:id` - Delete chart

### Dashboards

- `GET /api/dashboards` - List dashboards
- `POST /api/dashboards` - Create dashboard
- `GET /api/dashboards/:id` - Get dashboard
- `PATCH /api/dashboards/:id` - Update dashboard
- `DELETE /api/dashboards/:id` - Delete dashboard
- `GET /api/dashboards/:id/charts` - List dashboard charts
- `POST /api/dashboards/:id/charts` - Add chart to dashboard
- `DELETE /api/dashboards/:id/charts/:chartId` - Remove chart from dashboard

### Plans

- `GET /api/plans` - List available plans

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth with Bearer tokens
- **Password Hashing** - bcrypt with salt rounds
- **User Isolation** - Database queries filtered by user_id
- **Plan-based Limits** - Resource quotas per subscription tier
- **SQL Injection Prevention** - Parameterized queries via Prisma
- **File Upload Validation** - Type and size restrictions
- **CORS Configuration** - Controlled cross-origin requests
- **Error Handling** - Centralized middleware with safe error messages

## 🗄️ Database Architecture

### Core Tables

- **users** - User accounts with authentication credentials
  - `id`, `email`, `password_hash`, `full_name`, `plan_id`
  
- **plans** - Subscription tiers (Free, Pro, Enterprise)
  - `id`, `name`, `max_files`, `max_dashboards`, `max_charts`
  
- **files** - Uploaded CSV files with metadata
  - `id`, `user_id`, `filename`, `file_path`, `file_size`
  
- **charts** - Chart configurations
  - `id`, `user_id`, `dashboard_id`, `file_id`, `type`, `config`
  
- **dashboards** - Dashboard containers
  - `id`, `user_id`, `name`, `description`
  
- **usage_logs** - Activity tracking and analytics
  - `id`, `user_id`, `action`, `resource_type`, `timestamp`

### Setup Scripts

All database setup scripts are in `scripts/DB/`:
- `setup-database.sql` - Consolidated setup (recommended)
- `verify-setup.sql` - Validation queries
- Individual scripts: `00-drop-all.sql` through `03-insert-plans.sql`

## 📝 License

This project is for educational purposes (PPAW course).

## 👤 Author

**Iulian Cocris**

- GitHub: [@cocrisiulian](https://github.com/cocrisiulian)
