-- 24-labs-views.sql
-- Public views over labs schema to allow SELECT via PostgREST (public schema)

CREATE OR REPLACE VIEW public.labs_plans AS
SELECT id, name, max_files, max_charts, max_dashboards, price, created_at
FROM labs.plans;

CREATE OR REPLACE VIEW public.labs_dashboards AS
SELECT id, user_id, name, description, created_at, updated_at
FROM labs.dashboards;

GRANT SELECT ON public.labs_plans TO anon, authenticated;
GRANT SELECT ON public.labs_dashboards TO anon, authenticated;
