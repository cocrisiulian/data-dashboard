-- 09-policies-usage_logs.sql
-- RLS policies for `usage_logs` table

DROP POLICY IF EXISTS "Users can view own logs" ON usage_logs;
CREATE POLICY "Users can view own logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own logs" ON usage_logs;
CREATE POLICY "Users can insert own logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
