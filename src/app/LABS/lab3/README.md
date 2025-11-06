
# Lab 3 — ORM (Schema-First) — Solution

## 1. Database Schema (DDL)

Below is a sample schema-first SQL DDL (see also [01-create-tables.sql](vscode-file://vscode-app/c:/Users/Iulian/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-browser/workbench/workbench.html)):

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  max_files INTEGER NOT NULL,
  max_charts INTEGER NOT NULL,
  max_dashboards INTEGER NOT NULL,
  price DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  plan_id UUID REFERENCES plans(id) DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dashboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS charts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dashboard_id UUID NOT NULL REFERENCES dashboards(id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES files(id) ON DELETE CASCADE,
  chart_type VARCHAR(50) NOT NULL,
  chart_config JSONB NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

## 2. ORM Model Mapping (TypeScript Example)

Example TypeScript models (e.g., for Prisma or TypeORM):

// Plan model
export type Plan = {
  id: string;
  name: string;
  max_files: number;
  max_charts: number;
  max_dashboards: number;
  price: number;
  created_at: Date;
};

// User model
export type User = {
  id: string;
  email: string;
  full_name?: string;
  plan_id?: string;
  created_at: Date;
  updated_at: Date;
};

// File model
export type File = {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: Date;
};

// Dashboard model
export type Dashboard = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
};

// Chart model
export type Chart = {
  id: string;
  dashboard_id: string;
  file_id: string;
  chart_type: string;
  chart_config: any;
  title: string;
  created_at: Date;
};

// UsageLog model
export type UsageLog = {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  created_at: Date;
};

## 3. Example Usage (CRUD with ORM)

Example: Creating a new user (pseudo-code, e.g., with Prisma):

// Create a new user
const newUser = await prisma.user.create({
  data: {
    id: 'uuid',
    email: 'user@example.com',
    full_name: 'Test User',
    plan_id: 'plan-uuid',
  },
});

// Query dashboards for a user
const dashboards = await prisma.dashboard.findMany({
  where: { user_id: 'uuid' },
});
