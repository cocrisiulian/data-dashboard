-- 06-policies-files.sql
-- RLS policies for `files` table

DROP POLICY IF EXISTS "Users can view own files" ON files;
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own files" ON files;
CREATE POLICY "Users can insert own files"
  ON files FOR INSERT
  WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own files" ON files;
CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  USING ((SELECT auth.uid()) = user_id);

-- Admin full access policy (optional)
DROP POLICY IF EXISTS "files_admin_full_access" ON files;
CREATE POLICY "files_admin_full_access" ON files
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'user_role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'user_role') = 'admin');
