
# Lab 4 — ORM (Code-First) — Solution

## 1. ORM Model Classes (TypeScript Example)

Below are example code-first ORM models (e.g., for Prisma, TypeORM, or Sequelize):

// Plan model
export class Plan {
  id: string;
  name: string;
  max_files: number;
  max_charts: number;
  max_dashboards: number;
  price: number;
  created_at: Date;
}

// User model
export class User {
  id: string;
  email: string;
  full_name?: string;
  plan_id?: string;
  created_at: Date;
  updated_at: Date;
}

// File model
export class File {
  id: string;
  user_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  uploaded_at: Date;
}

// Dashboard model
export class Dashboard {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: Date;
  updated_at: Date;
}

// Chart model
export class Chart {
  id: string;
  dashboard_id: string;
  file_id: string;
  chart_type: string;
  chart_config: any;
  title: string;
  created_at: Date;
}

// UsageLog model
export class UsageLog {
  id: string;
  user_id: string;
  action: string;
  details?: any;
  created_at: Date;
}

## 2. Migration Example (Prisma style)

Example migration SQL generated from the above models:

CREATE TABLE plans (
  id UUID PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  max_files INTEGER NOT NULL,
  max_charts INTEGER NOT NULL,
  max_dashboards INTEGER NOT NULL,
  price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255),
  plan_id UUID REFERENCES plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE files (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  file_name VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE dashboards (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE charts (
  id UUID PRIMARY KEY,
  dashboard_id UUID REFERENCES dashboards(id),
  file_id UUID REFERENCES files(id),
  chart_type VARCHAR(50) NOT NULL,
  chart_config JSONB NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE usage_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

## 3. Seeding Example (TypeScript)

// Example: Seed a plan and a user
await prisma.plan.create({
  data: {
    id: 'plan-uuid',
    name: 'Free',
    max_files: 5,
    max_charts: 10,
    max_dashboards: 2,
    price: 0,
  },
});

await prisma.user.create({
  data: {
    id: 'user-uuid',
    email: 'user@example.com',
    full_name: 'Test User',
    plan_id: 'plan-uuid',
  },
});

## 4. Migration & Usage Steps

* Define model classes in your ORM (see above).
* Run the ORM migration tool to generate the DB schema.
* Use the ORM's seed feature or scripts to populate initial data.
* Use the models in your application code for CRUD operations.
