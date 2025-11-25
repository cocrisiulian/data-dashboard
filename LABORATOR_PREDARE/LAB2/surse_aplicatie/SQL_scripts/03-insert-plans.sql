-- 03-insert-plans.sql
-- Insert default plans (idempotent)

INSERT INTO plans (name, max_files, max_charts, max_dashboards, price)
VALUES
  ('Free', 2, 3, 1, 0.00),
  ('Pro', 10, 10, 3, 29.99),
  ('Custom', -1, -1, -1, 0.00)
ON CONFLICT (name) DO NOTHING;
