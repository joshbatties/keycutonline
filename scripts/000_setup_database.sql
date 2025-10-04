-- Master script to set up KeyCut Online database
-- Run this script to set up or fix the database structure

-- This script runs all migration scripts in order:
-- 1. Fix existing tables (if they exist)
-- 2. Create saved addresses table (if missing)
-- 3. Enable RLS and create policies
-- 4. Create admin functions and views

\i scripts/006_fix_existing_tables.sql
\i scripts/005_create_saved_addresses.sql
\i scripts/004_enable_rls.sql
\i scripts/003_create_admin_functions.sql

-- Verify the setup is complete
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created/updated: orders, bookings, saved_addresses';
  RAISE NOTICE 'RLS policies enabled for all tables';
  RAISE NOTICE 'Admin functions and views created';
END $$;
