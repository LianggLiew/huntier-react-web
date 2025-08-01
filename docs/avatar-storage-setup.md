# Avatar Storage Setup - Supabase Configuration

## SQL Commands to Run in Supabase

```sql
-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own avatar
CREATE POLICY "Users can upload their own avatar" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own avatar
CREATE POLICY "Users can view their own avatar" ON storage.objects
FOR SELECT USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own avatar
CREATE POLICY "Users can update their own avatar" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own avatar
CREATE POLICY "Users can delete their own avatar" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Anyone can view avatars (since they're profile pictures)
CREATE POLICY "Anyone can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');
```

## File Structure

```
avatars/
  {user_id}/
    avatar_timestamp.jpg
    avatar_timestamp.png
```

## Features

- ✅ **Auto-replacement**: Old avatars are automatically deleted when new ones are uploaded
- ✅ **Public access**: Avatars are publicly viewable (for profile pictures)
- ✅ **User isolation**: Users can only manage their own avatars
- ✅ **Format support**: JPG, PNG, GIF, WebP
- ✅ **Size limit**: 5MB maximum