-- Lab 9: Migration SQL for Soft Delete Implementation
-- Add soft delete columns to users, files, and dashboards tables

-- =====================================================
-- PART 1: Add Soft Delete Columns
-- =====================================================

-- Add soft delete columns to users table
ALTER TABLE users 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Add index for performance on filtered queries
CREATE INDEX idx_users_is_deleted ON users(is_deleted);

COMMENT ON COLUMN users.is_deleted IS 'Soft delete flag - true if user is deleted';
COMMENT ON COLUMN users.deleted_at IS 'Timestamp when user was soft deleted';

-- Add soft delete columns to files table
ALTER TABLE files 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Add index for performance
CREATE INDEX idx_files_is_deleted ON files(is_deleted);

COMMENT ON COLUMN files.is_deleted IS 'Soft delete flag - true if file is deleted';
COMMENT ON COLUMN files.deleted_at IS 'Timestamp when file was soft deleted';

-- Add soft delete columns to dashboards table
ALTER TABLE dashboards 
ADD COLUMN is_deleted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN deleted_at TIMESTAMPTZ;

-- Add index for performance
CREATE INDEX idx_dashboards_is_deleted ON dashboards(is_deleted);

COMMENT ON COLUMN dashboards.is_deleted IS 'Soft delete flag - true if dashboard is deleted';
COMMENT ON COLUMN dashboards.deleted_at IS 'Timestamp when dashboard was soft deleted';

-- =====================================================
-- PART 2: Create Helper Function for Soft Delete
-- =====================================================

-- Function to soft delete a user
CREATE OR REPLACE FUNCTION soft_delete_user(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET is_deleted = true, 
      deleted_at = NOW() 
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete a file
CREATE OR REPLACE FUNCTION soft_delete_file(file_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE files 
  SET is_deleted = true, 
      deleted_at = NOW() 
  WHERE id = file_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to soft delete a dashboard
CREATE OR REPLACE FUNCTION soft_delete_dashboard(dashboard_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE dashboards 
  SET is_deleted = true, 
      deleted_at = NOW() 
  WHERE id = dashboard_id_param;
END;
$$ LANGUAGE plpgsql;

-- Function to restore soft deleted user
CREATE OR REPLACE FUNCTION restore_user(user_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE users 
  SET is_deleted = false, 
      deleted_at = NULL 
  WHERE id = user_id_param;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 3: Create Views for Active Records Only
-- =====================================================

-- View for active users (not soft deleted)
CREATE OR REPLACE VIEW active_users AS
SELECT * FROM users WHERE is_deleted = false;

-- View for active files (not soft deleted)
CREATE OR REPLACE VIEW active_files AS
SELECT * FROM files WHERE is_deleted = false;

-- View for active dashboards (not soft deleted)
CREATE OR REPLACE VIEW active_dashboards AS
SELECT * FROM dashboards WHERE is_deleted = false;

-- =====================================================
-- PART 4: Sample Queries
-- =====================================================

-- Example: Get all active users
-- SELECT * FROM users WHERE is_deleted = false;

-- Example: Get all soft deleted users
-- SELECT * FROM users WHERE is_deleted = true;

-- Example: Soft delete a user
-- UPDATE users SET is_deleted = true, deleted_at = NOW() WHERE id = 'some-uuid';

-- Example: Restore a soft deleted user
-- UPDATE users SET is_deleted = false, deleted_at = NULL WHERE id = 'some-uuid';

-- Example: Permanently delete soft deleted records older than 30 days
-- DELETE FROM users WHERE is_deleted = true AND deleted_at < NOW() - INTERVAL '30 days';

-- =====================================================
-- ROLLBACK (if needed)
-- =====================================================

-- To rollback this migration:
/*
DROP VIEW IF EXISTS active_users;
DROP VIEW IF EXISTS active_files;
DROP VIEW IF EXISTS active_dashboards;

DROP FUNCTION IF EXISTS soft_delete_user(UUID);
DROP FUNCTION IF EXISTS soft_delete_file(UUID);
DROP FUNCTION IF EXISTS soft_delete_dashboard(UUID);
DROP FUNCTION IF EXISTS restore_user(UUID);

DROP INDEX IF EXISTS idx_users_is_deleted;
DROP INDEX IF EXISTS idx_files_is_deleted;
DROP INDEX IF EXISTS idx_dashboards_is_deleted;

ALTER TABLE users DROP COLUMN IF EXISTS is_deleted, DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE files DROP COLUMN IF EXISTS is_deleted, DROP COLUMN IF EXISTS deleted_at;
ALTER TABLE dashboards DROP COLUMN IF EXISTS is_deleted, DROP COLUMN IF EXISTS deleted_at;
*/
