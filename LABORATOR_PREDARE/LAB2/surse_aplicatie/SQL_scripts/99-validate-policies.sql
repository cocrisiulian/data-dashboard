-- 99-validate-policies.sql
-- Useful queries to inspect policies and verify RLS

select
  pol.oid::regprocedure as policy_identifier,
  nsp.nspname as schema_name,
  cls.relname as table_name,
  pol.polname as policy_name,
  case pol.polcmd
    when 'r' then 'SELECT'
    when 'w' then 'UPDATE'
    when 'a' then 'INSERT'
    when 'd' then 'DELETE'
    when '*' then 'ALL'
    else pol.polcmd
  end as for_command,
  pol.polroles::text as roles,
  pg_get_expr(pol.polqual, pol.polrelid) as using_expression,
  pg_get_expr(pol.polwithcheck, pol.polrelid) as with_check_expression,
  (pol.polwithcheck is not null) as has_with_check,
  (pol.polqual is not null) as has_using_expression,
  (pol.polcmd is not null) as has_polcmd
from
  pg_policy pol
  join pg_class cls on cls.oid = pol.polrelid
  join pg_namespace nsp on nsp.oid = cls.relnamespace
where
  nsp.nspname not in ('pg_catalog', 'information_schema')
order by
  nsp.nspname,
  cls.relname,
  pol.polname;
