
# Lab 1 — Proiectare Aplicatie — Solution

## 1. Requirements & Analysis

* The application is a dashboard for data visualization and file management, with user authentication, plans, dashboards, charts, and usage logging.
* Functional requirements: user registration/login, file upload, dashboard and chart creation, plan management, and usage tracking.
* Non-functional: security (RLS), scalability, modularity, and auditability.

## 2. Main Entities & Relationships (ERD)

* **plans** : Subscription plans (limits, price)
* **users** : Registered users (linked to Supabase auth)
* **files** : Uploaded files (owned by users)
* **dashboards** : User dashboards
* **charts** : Visualizations linked to dashboards and files
* **usage_logs** : Audit/user activity logs

**Relationships:**

* users.plan_id → plans.id (many-to-one)
* files.user_id → users.id (many-to-one)
* dashboards.user_id → users.id (many-to-one)
* charts.dashboard_id → dashboards.id (many-to-one)
* charts.file_id → files.id (many-to-one)
* usage_logs.user_id → users.id (many-to-one)

## 3. Database Schema (DDL)

* -- plans
  CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  max_files INTEGER NOT NULL,
  max_charts INTEGER NOT NULL,
  max_dashboards INTEGER NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
* -- users
  CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  plan_id UUID REFERENCES plans(id) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
* -- files
  CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
* -- dashboards
  CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
* -- charts
  CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  chart_type VARCHAR(50) NOT NULL,
  chart_config JSONB NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
* -- usage_logs
  CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

## 4. Design Notes & Assumptions

* All tables use UUIDs for primary keys for security and scalability.
* The `users` table extends Supabase Auth users, allowing for custom fields and plan linkage.
* RLS (Row-Level Security) is enabled and policies are defined per table (see [04-enable-rls.sql](vscode-file://vscode-app/c:/Users/Iulian/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html) and `scripts/DB/05-09-policies-*.sql`).
* Indexes are created for foreign keys and timestamps for performance.
* The schema is modular and idempotent (safe to re-run).
