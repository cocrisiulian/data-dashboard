-- 10-policies-plans.sql
-- RLS policies for `plans` table (idempotent)

DROP POLICY IF EXISTS "Public can view plans" ON plans;
CREATE POLICY "Public can view plans"
  ON plans FOR SELECT
  USING (true);

-- Dev-friendly policies to allow creating and editing plans from the app UI
-- If you prefer stricter control, remove these and use the service-role key on the server instead.

DROP POLICY IF EXISTS "Anyone can insert plans (dev)" ON plans;
CREATE POLICY "Anyone can insert plans (dev)"
  ON plans FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update plans (dev)" ON plans;
CREATE POLICY "Anyone can update plans (dev)"
  ON plans FOR UPDATE
  USING (true)
  WITH CHECK (true);
