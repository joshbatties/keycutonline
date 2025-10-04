-- Create Supabase Storage bucket for key photos with proper security
-- Run this in your Supabase SQL Editor

-- Create the storage bucket (private for security)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'keycutonline',
  'keycutonline',
  false, -- Private bucket for security
  10485760, -- 10MB limit per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg'] -- Only allow image files
);

-- Note: Storage policies should be created through the Supabase Dashboard UI
-- Go to Storage > keycutonline > Policies tab and create these policies:

-- Policy 1: Allow anyone to upload (including guests creating orders)
-- Name: "Anyone can upload key photos"
-- Operation: INSERT
-- Target: storage.objects
-- Policy: Allow public uploads
-- SQL: (bucket_id = 'keycutonline')

-- Policy 2: Allow signed URL access and admin access
-- Name: "Allow signed URL access and admin access"
-- Operation: SELECT
-- Target: storage.objects
-- Policy: Allow access via signed URLs and admins
-- SQL: (bucket_id = 'keycutonline')

-- Policy 3: Allow admins to manage all files
-- Name: "Admins can manage all key photos"
-- Operation: ALL
-- Target: storage.objects
-- Policy: Allow admins full access
-- SQL: (bucket_id = 'keycutonline' AND (auth.jwt() ->> 'email' LIKE '%@keycutonline.com'))

-- Alternative approach: Use RLS on storage objects similar to database tables
-- This would provide more granular control but requires more complex setup
