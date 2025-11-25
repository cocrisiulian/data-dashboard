-- 20-labs-schema.sql
-- Create dedicated schema for labs

CREATE SCHEMA IF NOT EXISTS labs AUTHORIZATION postgres;

-- Allow roles to access the schema (minimum for selects/inserts via RLS)
GRANT USAGE ON SCHEMA labs TO anon, authenticated, service_role;
