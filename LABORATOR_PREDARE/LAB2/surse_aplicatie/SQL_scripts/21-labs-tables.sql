-- 21-labs-tables.sql
-- Tables used for lab exercises (isolated from the main app)

-- Lab5: Plans
CREATE TABLE IF NOT EXISTS labs.plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  max_files int DEFAULT 0,
  max_charts int DEFAULT 0,
  max_dashboards int DEFAULT 0,
  price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Lab6: Dashboards (scoped by user)
CREATE TABLE IF NOT EXISTS labs.dashboards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Optional index for listing by user (Lab6)
CREATE INDEX IF NOT EXISTS idx_labs_dashboards_user ON labs.dashboards(user_id, created_at DESC);
