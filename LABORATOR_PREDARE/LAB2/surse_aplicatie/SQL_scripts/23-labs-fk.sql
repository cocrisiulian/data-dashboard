-- 23-labs-fk.sql
-- Add foreign keys for labs tables

-- dashboards.user_id -> auth.users(id)
ALTER TABLE labs.dashboards DROP CONSTRAINT IF EXISTS dashboards_user_fk;
ALTER TABLE labs.dashboards
  ADD CONSTRAINT dashboards_user_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
