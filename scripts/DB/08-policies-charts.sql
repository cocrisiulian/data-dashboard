-- 08-policies-charts.sql
-- RLS policies for `charts` table (checks that dashboard belongs to user)

DROP POLICY IF EXISTS "Users can view own charts" ON charts;
CREATE POLICY "Users can view own charts"
  ON charts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own charts" ON charts;
CREATE POLICY "Users can insert own charts"
  ON charts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own charts" ON charts;
CREATE POLICY "Users can delete own charts"
  ON charts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );
