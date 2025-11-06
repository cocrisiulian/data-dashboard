-- 22-labs-rls.sql
-- Enable RLS and define policies for labs schema tables

-- Plans: public read, permissive writes for local/demo (adjust later if needed)
ALTER TABLE labs.plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view lab plans" ON labs.plans;
CREATE POLICY "Public can view lab plans"
  ON labs.plans FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Dev insert lab plans" ON labs.plans;
CREATE POLICY "Dev insert lab plans"
  ON labs.plans FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Dev update lab plans" ON labs.plans;
CREATE POLICY "Dev update lab plans"
  ON labs.plans FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Privileges (policies control rows, privileges control operation rights)
GRANT SELECT, INSERT, UPDATE ON labs.plans TO anon, authenticated;

-- Dashboards: user-scoped CRUD
ALTER TABLE labs.dashboards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own lab dashboards" ON labs.dashboards;
CREATE POLICY "Users view own lab dashboards"
  ON labs.dashboards FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users insert own lab dashboards" ON labs.dashboards;
CREATE POLICY "Users insert own lab dashboards"
  ON labs.dashboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users update own lab dashboards" ON labs.dashboards;
CREATE POLICY "Users update own lab dashboards"
  ON labs.dashboards FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users delete own lab dashboards" ON labs.dashboards;
CREATE POLICY "Users delete own lab dashboards"
  ON labs.dashboards FOR DELETE
  USING (auth.uid() = user_id);

-- Privileges for dashboards (authenticated users operate on their own rows via RLS)
GRANT SELECT, INSERT, UPDATE, DELETE ON labs.dashboards TO authenticated;
