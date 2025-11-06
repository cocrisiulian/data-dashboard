
# Lab 2 — Arhitecturi & Creare Baza De Date — Solution

## 1. Architecture Overview

* The application uses a client-server architecture:
  * **Frontend (Client):** Next.js React app for UI, user interaction, and API calls.
  * **Backend (Serverless/API):** Supabase for authentication, database, storage, and RLS policies.
  * **Database:** PostgreSQL (managed by Supabase), with modular schema and RLS.
* Components communicate via RESTful APIs and direct DB queries (via Supabase client libraries).

## 2. Component Diagram (Textual)

* **Client (Next.js)**
  * Handles UI, user auth, file upload, dashboard/chart management.
  * Communicates with Supabase via JS SDK.
* **Supabase Backend**
  * Auth: manages users, sessions.
  * DB: stores all entities (plans, users, files, dashboards, charts, logs).
  * Storage: file storage for uploads.
  * RLS: enforces security at row level.

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

* Modular, idempotent schema (safe to re-run).
* RLS enabled for all user data tables.
* Indexes for performance (see [01-create-tables.sql](vscode-file://vscode-app/c:/Users/Iulian/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)).
* All business logic is handled in the app or via Supabase functions/triggers.
