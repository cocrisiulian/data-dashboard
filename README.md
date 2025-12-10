# DataInsight Dashboard

Modern web application for data visualization and analytics. Upload CSV files, create interactive charts, and build custom dashboards with a comprehensive subscription plan system.

## 🚀 Features

- **Authentication System** - JWT-based secure login/register with bcrypt password hashing
- **File Management** - Upload and manage CSV files with automatic parsing
- **Interactive Charts** - Bar, Line, Pie, Area, and Multi-series charts with Recharts
- **Custom Dashboards** - Create, organize, and share multiple dashboards
- **Plan Management** - Free, Pro, and Enterprise tiers with resource limits
- **Soft Delete** - Data recovery system with audit trail
- **Service Layer Architecture** - Clean separation with Dependency Injection
- **Code Quality Tools** - Winston logging, code review guidelines
- **Lab Exercises** - 11 complete PPAW lab implementations with live demos

## 🎓 Laboratory Work

This project includes **11 complete laboratory assignments** covering web application architecture:

1. **Database Design & ERD** - PostgreSQL schema, indexes, constraints
2. **System Architecture** - Three-tier architecture, client-server pattern
3. **ORM Schema-First** - Prisma with database introspection
4. **ORM Code-First** - Prisma migrations, version control
5. **MVC & Authentication** - Model-View-Controller, JWT tokens
6. **MVC & Dashboards** - Advanced patterns, nested resources
7. **CSV & Visualization** - File parsing, type detection, chart suggestions
8. **API & Deployment** - Frontend integration, Vercel/Railway hosting
9. **Hard & Soft Delete** - Physical vs logical deletion strategies
10. **Service Layer & DI** - Business logic separation, Awilix container
11. **Code Review & Logging** - Quality guidelines, Winston monitoring, documentation

**Access Labs:** Navigate to `/LABS` in the application for interactive demos and complete source code.

## 🛠️ Tech Stack

### Frontend

- **Next.js 15.2.4** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible components
- **Recharts** - Data visualization

### Backend

- **Express 4.21.1** - REST API server with MVC architecture
- **Prisma 6.18.0** - Type-safe ORM for PostgreSQL
- **PostgreSQL 14+** - Relational database
- **JWT (jsonwebtoken)** - Secure authentication tokens
- **bcrypt** - Password hashing with salt
- **Multer** - Multipart file upload handling
- **csv-parse** - CSV file parsing and validation
- **Awilix** - Dependency Injection container
- **Winston** - Application logging and monitoring

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL 14+
- pnpm (recommended) or npm

## ⚙️ Quick Start

For detailed installation instructions, see **[INSTALL.md](./INSTALL.md)**

### Quick Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/cocrisiulian/data-dashboard.git
   cd data-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup database**
   ```bash
   createdb datainsight_dashboard
   psql -U postgres -d datainsight_dashboard -f scripts/DB/setup-database.sql
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and JWT_SECRET
   ```

5. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

6. **Run application**
   ```bash
   # Terminal 1 - Backend
   cd labs_api && node server.js
   
   # Terminal 2 - Frontend
   npm run dev
   ```

**Access:** Frontend at `http://localhost:3000`, Backend at `http://localhost:4000`

## 📖 Full Installation Guide

For complete step-by-step instructions including troubleshooting, see **[INSTALL.md](./INSTALL.md)**

The installation guide covers:
- ✅ Detailed prerequisites with download links
- ✅ Database setup and configuration
- ✅ Environment variable configuration
- ✅ Running in development and production
- ✅ Common issues and troubleshooting
- ✅ Deployment options (Vercel, Railway, VPS)

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

All 11 PPAW laboratory exercises are fully implemented with complete source code:

### Laboratory Structure

Each lab is available in `LABORATOR_PREDARE/LAB[1-11]/` with:
- **cod_sursa/** - Working implementation files
- **fisiere_test/** - Test data (where applicable)
- **README.md** - Lab-specific documentation

### Lab Topics

1. **LAB1 - Database Design** 
   - PostgreSQL schema design
   - Tables, indexes, constraints
   - Setup and verification scripts

2. **LAB2 - Backup & Recovery**
   - Physical backups (pg_dump)
   - Logical backups (SQL exports)
   - PowerShell automation scripts

3. **LAB3 - Prisma ORM Schema-First**
   - Schema introspection
   - Database client setup
   - CRUD operation examples

4. **LAB4 - Prisma ORM Code-First**
   - Prisma migrations workflow
   - Version control for schema
   - Migration history tracking

5. **LAB5 - MVC Pattern & Authentication**
   - Model-View-Controller architecture
   - Plans module implementation
   - JWT authentication system

6. **LAB6 - MVC Advanced & Dashboards**
   - Nested resources (Charts in Dashboards)
   - Parent-child resource routing
   - Cascade operations

7. **LAB7 - CSV Parsing & File Upload**
   - File upload with Multer
   - CSV parsing and type detection
   - Auto-suggest chart types from data

8. **LAB8 - API Integration & Deployment**
   - Frontend CRUD interfaces
   - Production deployment (Vercel, Railway)
   - Custom domain configuration

9. **LAB9 - Hard Delete & Soft Delete**
   - Physical vs logical deletion
   - Data recovery mechanisms
   - Audit trail implementation

10. **LAB10 - Service Layer & Dependency Injection**
    - Business logic separation
    - Repository pattern
    - Awilix DI container
    - Lifetime scopes (Singleton, Scoped, Transient)

11. **LAB11 - Code Review, Logging & Documentation**
    - Code review checklist and best practices
    - Winston logging integration
    - Installation and deployment documentation
    - Professional development workflows

### Accessing Labs

Navigate to `/LABS` in the application to view all laboratory implementations with:
- Interactive demos and live examples
- Complete source code with explanations
- Best practices and architecture patterns
- Step-by-step implementation guides

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
- **Password Hashing** - bcrypt with salt rounds for secure storage
- **User Isolation** - Database queries filtered by user_id
- **Plan-based Limits** - Resource quotas per subscription tier
- **SQL Injection Prevention** - Parameterized queries via Prisma ORM
- **File Upload Validation** - Type, size, and content validation
- **CORS Configuration** - Controlled cross-origin requests
- **Error Handling** - Centralized middleware with sanitized error messages
- **Logging & Monitoring** - Winston logger for security audit trail
- **Environment Variables** - Sensitive data isolated in .env files

## 📊 Application Monitoring

### Winston Logging System

The application uses Winston for comprehensive logging:

- **Log Levels:** ERROR, WARN, INFO, DEBUG, TRACE
- **Log Rotation:** Daily rotation with 14-day retention
- **Log Files:**
  - `logs/application-YYYY-MM-DD.log` - All application logs
  - `logs/error-YYYY-MM-DD.log` - Error logs only
- **Console Output:** Colorized logs in development
- **Structured Logging:** JSON metadata for analytics

### Monitoring Endpoints

- `GET /health` - Server health check
- `GET /api/stats` - Usage statistics (admin only)

See **[Lab 11](/LABS/lab11)** for complete logging implementation guide.

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

## 🏗️ Architecture Patterns

### Service Layer Architecture

The application follows a clean **three-tier architecture**:

1. **Presentation Layer** (Controllers)
   - HTTP request/response handling
   - Input validation
   - Authentication middleware
   - Error formatting

2. **Business Logic Layer** (Services)
   - Business rules and validation
   - Orchestration of repositories
   - Complex calculations
   - Transaction management

3. **Data Access Layer** (Repositories)
   - Database queries (Prisma)
   - Data mapping
   - Query optimization
   - Relationship handling

### Dependency Injection

Uses **Awilix** for IoC container:
- Constructor injection pattern
- Lifetime management (Singleton, Scoped, Transient)
- Automatic dependency resolution
- Testability through mocking

**Example:**
```javascript
// Service with injected repository
class PlanService {
  constructor(planRepository) {
    this.planRepository = planRepository;
  }
  
  async getAllPlans() {
    const plans = await this.planRepository.findAll();
    return plans.map(p => this.enrichPlanData(p));
  }
}

// Container registration
container.register({
  planRepository: asClass(PlanRepository).singleton(),
  planService: asClass(PlanService).scoped()
});
```

See **[Lab 10](/LABS/lab10)** for complete DI implementation.

## 🧪 Code Quality

### Code Review Guidelines

The project follows industry best practices:

- ✅ **Thin Controllers** - No business logic in controllers
- ✅ **Service Layer** - Business logic isolated in services
- ✅ **Repository Pattern** - Data access abstraction
- ✅ **Dependency Injection** - Loose coupling, high testability
- ✅ **Error Handling** - Consistent error responses
- ✅ **Logging** - Comprehensive activity tracking
- ✅ **Type Safety** - TypeScript + Prisma types

### Best Practices

- Controllers under 50 lines per method
- No direct database access in controllers
- Validation in middleware or services
- Environment variables for configuration
- Async/await for all I/O operations

See **[Lab 11](/LABS/lab11)** for complete code review checklist.

## 📝 License

This project is for educational purposes (PPAW course - Paradigme de Proiectare a Aplicațiilor Web).

## 📚 Documentation

- **[INSTALL.md](./INSTALL.md)** - Complete installation guide with troubleshooting
- **[Lab 1-11](/LABS)** - Interactive laboratory implementations
- **[Code Review Guide](/LABS/lab11)** - Best practices and quality guidelines
- **[API Documentation](#-api-endpoints)** - REST API reference

## 🚀 Deployment

The application can be deployed to:

- **Vercel** - Frontend (Next.js) with automatic CI/CD
- **Railway** - Full-stack with PostgreSQL database
- **VPS/Cloud** - DigitalOcean, AWS, Azure with custom setup

See **[INSTALL.md](./INSTALL.md)** for deployment guides.

## 👤 Author

**Iulian Cocris**

- GitHub: [@cocrisiulian](https://github.com/cocrisiulian)
