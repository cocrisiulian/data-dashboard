-- 07-policies-dashboards.sql
-- RLS policies for `dashboards` table

DROP POLICY IF EXISTS "Users can view own dashboards" ON dashboards;
CREATE POLICY "Users can view own dashboards"
  ON dashboards FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own dashboards" ON dashboards;
CREATE POLICY "Users can insert own dashboards"
  ON dashboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own dashboards" ON dashboards;
CREATE POLICY "Users can update own dashboards"
  ON dashboards FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own dashboards" ON dashboards;
CREATE POLICY "Users can delete own dashboards"
  ON dashboards FOR DELETE
  USING (auth.uid() = user_id);
