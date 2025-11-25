-- 25-labs-rpc.sql
-- RPC functions in public schema to perform writes/reads into labs tables
-- These allow using supabase.rpc() from the app while keeping data in labs schema.

-- Lab5: Plans
CREATE OR REPLACE FUNCTION public.labs_list_plans()
RETURNS SETOF labs.plans
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, labs
AS $$
  SELECT * FROM labs.plans ORDER BY price ASC;
$$;

CREATE OR REPLACE FUNCTION public.labs_get_plan(p_id uuid)
RETURNS labs.plans
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, labs
AS $$
  SELECT * FROM labs.plans WHERE id = p_id;
$$;

CREATE OR REPLACE FUNCTION public.labs_create_plan(p_name text, p_price numeric)
RETURNS labs.plans
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, labs
AS $$
  INSERT INTO labs.plans(name, price)
  VALUES (p_name, p_price)
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION public.labs_update_plan(p_id uuid, p_name text, p_price numeric)
RETURNS labs.plans
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, labs
AS $$
  UPDATE labs.plans
  SET name = COALESCE(p_name, name),
      price = COALESCE(p_price, price)
  WHERE id = p_id
  RETURNING *;
$$;

GRANT EXECUTE ON FUNCTION public.labs_list_plans() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_get_plan(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_create_plan(text, numeric) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_update_plan(uuid, text, numeric) TO anon, authenticated;

-- Lab6: Dashboards
CREATE OR REPLACE FUNCTION public.labs_list_dashboards(p_user_id uuid)
RETURNS SETOF labs.dashboards
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, labs
AS $$
  SELECT * FROM labs.dashboards WHERE user_id = p_user_id ORDER BY created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.labs_get_dashboard(p_id uuid, p_user_id uuid)
RETURNS labs.dashboards
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, labs
AS $$
  SELECT * FROM labs.dashboards WHERE id = p_id AND user_id = p_user_id;
$$;

CREATE OR REPLACE FUNCTION public.labs_create_dashboard(p_user_id uuid, p_name text, p_description text)
RETURNS labs.dashboards
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, labs
AS $$
  INSERT INTO labs.dashboards(user_id, name, description)
  VALUES (p_user_id, p_name, p_description)
  RETURNING *;
$$;

CREATE OR REPLACE FUNCTION public.labs_update_dashboard(p_id uuid, p_user_id uuid, p_name text, p_description text)
RETURNS labs.dashboards
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, labs
AS $$
  UPDATE labs.dashboards
  SET name = COALESCE(p_name, name),
      description = COALESCE(p_description, description),
      updated_at = now()
  WHERE id = p_id AND user_id = p_user_id
  RETURNING *;
$$;

GRANT EXECUTE ON FUNCTION public.labs_list_dashboards(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_get_dashboard(uuid, uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_create_dashboard(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.labs_update_dashboard(uuid, uuid, text, text) TO anon, authenticated;
