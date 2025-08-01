# Resume Storage Setup - Supabase Configuration

## Overview
This document provides the SQL commands needed to set up the resume storage bucket and security policies in Supabase for the resume upload MVP feature.

## Prerequisites
- Supabase project with Storage enabled
- Admin access to Supabase Dashboard or SQL Editor
- The `user_resumes` table should already be created (from the database migration)

## Storage Bucket Setup

### 1. Create the Resume Storage Bucket

Run this SQL in your Supabase SQL Editor:

```sql
-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumes', 'resumes', false);
```

### 2. Set up Row Level Security (RLS) Policies

```sql
-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can upload their own resume
CREATE POLICY "Users can upload their own resume" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can view their own resume
CREATE POLICY "Users can view their own resume" ON storage.objects
FOR SELECT USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can update their own resume
CREATE POLICY "Users can update their own resume" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy: Users can delete their own resume
CREATE POLICY "Users can delete their own resume" ON storage.objects
FOR DELETE USING (
  bucket_id = 'resumes' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## File Structure

The storage bucket will organize files as follows:

```
resumes/
  {user_id}/
    original/
      resume_timestamp.pdf
      resume_timestamp.docx
    processed/           # Future: for parsed data
      resume_text.json
      resume_data.json
    versions/            # Future: for optimized versions
      resume_v1.pdf
      resume_v2.pdf
```

## Verification

After running the setup, verify the configuration:

### 1. Check Bucket Creation
```sql
SELECT * FROM storage.buckets WHERE id = 'resumes';
```

### 2. Check RLS Policies
```sql
SELECT * FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%resume%';
```

### 3. Test Upload (Optional)
You can test the setup by:
1. Going through the onboarding flow with a resume upload
2. Checking the storage bucket in Supabase Dashboard
3. Verifying the file appears under your user ID folder

## Security Features

- **Private Bucket**: Files are not publicly accessible
- **User Isolation**: Each user can only access their own resume files
- **File Organization**: Files are organized by user ID to prevent conflicts
- **Signed URLs**: Downloads use temporary signed URLs (1-hour expiry)

## Environment Variables

Ensure these environment variables are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Troubleshooting

### Policy Issues
If users can't upload files, check:
1. RLS is enabled on `storage.objects`
2. Policies are created correctly
3. User authentication is working

### File Access Issues
If signed URLs don't work:
1. Verify the bucket exists and is private
2. Check the service role key has storage permissions
3. Ensure file paths match the expected structure

## Next Steps

This MVP setup supports:
- ✅ Resume upload during onboarding
- ✅ Resume download from profile page
- ✅ Resume replacement (overwrites existing)
- ✅ Secure file storage with user isolation

Future enhancements (already planned):
- Resume parsing integration
- Multiple resume versions
- AI-powered optimization
- ATS scoring

## Support

For issues with this setup:
1. Check Supabase Dashboard storage section
2. Review browser network tab for API errors
3. Check server logs for authentication issues
4. Verify database migration was completed successfully