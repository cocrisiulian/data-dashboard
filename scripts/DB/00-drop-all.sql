-- Drop all tables and related objects in the correct order for your schema
DROP TABLE IF EXISTS charts CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS usage_logs CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS plans CASCADE;

-- Optionally, drop functions and triggers
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
DROP FUNCTION IF EXISTS public.log_user_action CASCADE;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
