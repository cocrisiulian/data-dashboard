-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE charts ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for files table
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for dashboards table
CREATE POLICY "Users can view own dashboards"
  ON dashboards FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dashboards"
  ON dashboards FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dashboards"
  ON dashboards FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dashboards"
  ON dashboards FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for charts table
CREATE POLICY "Users can view own charts"
  ON charts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own charts"
  ON charts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own charts"
  ON charts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM dashboards
      WHERE dashboards.id = charts.dashboard_id
      AND dashboards.user_id = auth.uid()
    )
  );

-- RLS Policies for usage_logs table
CREATE POLICY "Users can view own logs"
  ON usage_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own logs"
  ON usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Plans table is public read-only
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans"
  ON plans FOR SELECT
  TO authenticated
  USING (true);
