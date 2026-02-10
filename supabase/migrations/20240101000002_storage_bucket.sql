-- Noty Storage Setup
-- Run this in Supabase SQL Editor AFTER creating the 'avatars' bucket in Storage UI

-- ============================================
-- STORAGE POLICIES FOR AVATARS BUCKET
-- ============================================

-- Note: First create the 'avatars' bucket in Supabase Dashboard:
-- 1. Go to Storage
-- 2. Click "New bucket"
-- 3. Name it "avatars"
-- 4. Toggle "Public bucket" ON
-- 5. Click "Create bucket"

-- Then run these policies:

-- Allow authenticated users to upload avatars
create policy "Users can upload avatars" on storage.objects
  for insert with check (
    bucket_id = 'avatars' and
    auth.role() = 'authenticated'
  );

-- Allow public read access to avatars
create policy "Public avatar access" on storage.objects
  for select using (bucket_id = 'avatars');

-- Allow users to update their own avatars
create policy "Users can update own avatars" on storage.objects
  for update using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to delete their own avatars
create policy "Users can delete own avatars" on storage.objects
  for delete using (
    bucket_id = 'avatars' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
