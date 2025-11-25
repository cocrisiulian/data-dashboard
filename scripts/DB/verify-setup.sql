-- ============================================================
-- Database Setup Verification Script
-- ============================================================
-- Run this script to verify that the database was set up correctly
-- ============================================================

\echo '============================================================'
\echo 'VERIFYING DATABASE SETUP'
\echo '============================================================'
\echo ''

-- ============================================================
-- 1. Check all tables exist
-- ============================================================
\echo '1. Checking tables...'
SELECT 
  CASE 
    WHEN COUNT(*) = 6 THEN '✅ All 6 tables exist'
    ELSE '❌ Missing tables! Expected 6, found ' || COUNT(*)::text
  END as table_check
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('plans', 'users', 'files', 'dashboards', 'charts', 'usage_logs');

\echo ''
\echo 'Table list:'
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('plans', 'users', 'files', 'dashboards', 'charts', 'usage_logs')
ORDER BY table_name;

-- ============================================================
-- 2. Check plans data
-- ============================================================
\echo ''
\echo '2. Checking default plans...'
SELECT 
  CASE 
    WHEN COUNT(*) >= 3 THEN '✅ Default plans inserted (' || COUNT(*)::text || ' plans)'
    ELSE '❌ Missing default plans! Found ' || COUNT(*)::text
  END as plans_check
FROM plans;

\echo ''
\echo 'Plans list:'
SELECT name, max_files, max_charts, max_dashboards, price 
FROM plans 
ORDER BY price;

-- ============================================================
-- 3. Check indexes
-- ============================================================
\echo ''
\echo '3. Checking indexes...'
SELECT 
  CASE 
    WHEN COUNT(*) >= 10 THEN '✅ Indexes created (' || COUNT(*)::text || ' indexes)'
    ELSE '⚠️  Some indexes may be missing. Found ' || COUNT(*)::text
  END as index_check
FROM pg_indexes 
WHERE schemaname = 'public'
AND indexname LIKE 'idx_%';

\echo ''
\echo 'Index list:'
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;

-- ============================================================
-- 4. Check triggers
-- ============================================================
\echo ''
\echo '4. Checking triggers...'
SELECT 
  CASE 
    WHEN COUNT(*) >= 2 THEN '✅ Triggers created (' || COUNT(*)::text || ' triggers)'
    ELSE '⚠️  Some triggers may be missing. Found ' || COUNT(*)::text
  END as trigger_check
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE 'update_%_updated_at';

\echo ''
\echo 'Trigger list:'
SELECT event_object_table as table_name, trigger_name
FROM information_schema.triggers
WHERE trigger_schema = 'public'
AND trigger_name LIKE 'update_%_updated_at'
ORDER BY event_object_table;

-- ============================================================
-- 5. Check foreign keys
-- ============================================================
\echo ''
\echo '5. Checking foreign key constraints...'
SELECT 
  CASE 
    WHEN COUNT(*) >= 5 THEN '✅ Foreign keys configured (' || COUNT(*)::text || ' constraints)'
    ELSE '⚠️  Some foreign keys may be missing. Found ' || COUNT(*)::text
  END as fk_check
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
AND constraint_type = 'FOREIGN KEY';

\echo ''
\echo 'Foreign key list:'
SELECT 
  table_name,
  constraint_name
FROM information_schema.table_constraints
WHERE constraint_schema = 'public'
AND constraint_type = 'FOREIGN KEY'
ORDER BY table_name, constraint_name;

-- ============================================================
-- 6. Check functions
-- ============================================================
\echo ''
\echo '6. Checking functions...'
SELECT 
  CASE 
    WHEN COUNT(*) >= 1 THEN '✅ Functions created (' || COUNT(*)::text || ' functions)'
    ELSE '⚠️  Functions missing. Found ' || COUNT(*)::text
  END as function_check
FROM pg_proc
WHERE proname = 'update_updated_at_column';

-- ============================================================
-- Summary
-- ============================================================
\echo ''
\echo '============================================================'
\echo 'VERIFICATION COMPLETE'
\echo '============================================================'
\echo ''
\echo 'If all checks show ✅, your database is ready to use!'
\echo ''
