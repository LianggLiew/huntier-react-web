-- ================================================
-- JOB APPLICATIONS TABLE MIGRATION
-- ================================================
-- 
-- This script creates the complete job_applications table with all required
-- fields for the user job application system.
-- 
-- Execute this in your Supabase SQL Editor
-- ================================================

-- Create the job_applications table
CREATE TABLE IF NOT EXISTS public.job_applications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  job_id integer NOT NULL,
  status character varying NOT NULL DEFAULT 'pending' 
    CHECK (status IN ('pending', 'reviewing', 'interviewed', 'accepted', 'rejected')),
  
  -- Application content
  cover_letter text NOT NULL,
  custom_resume_url character varying NULL,
  
  -- Applicant snapshot data (preserves info at time of application)
  applicant_first_name character varying(100) NOT NULL,
  applicant_last_name character varying(100) NOT NULL,
  applicant_phone character varying(20) NOT NULL,
  applicant_nationality character varying(100) NULL,
  applicant_wechat_id character varying(100) NULL,
  
  -- Timestamps
  applied_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  
  -- Constraints
  CONSTRAINT job_applications_pkey PRIMARY KEY (id),
  CONSTRAINT job_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT job_applications_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id) ON DELETE CASCADE,
  CONSTRAINT unique_user_job_application UNIQUE (user_id, job_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_job_applications_user_id ON public.job_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON public.job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_applied_at ON public.job_applications(applied_at DESC);

-- Create updated_at trigger function (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
CREATE TRIGGER update_job_applications_updated_at
    BEFORE UPDATE ON public.job_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own applications
CREATE POLICY "Users can view own applications" ON public.job_applications
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own applications
CREATE POLICY "Users can create own applications" ON public.job_applications
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending applications
CREATE POLICY "Users can update own pending applications" ON public.job_applications
    FOR UPDATE USING (auth.uid() = user_id AND status = 'pending');

-- Policy: Users can delete their own pending/reviewing applications
CREATE POLICY "Users can delete own applications" ON public.job_applications
    FOR DELETE USING (auth.uid() = user_id AND status IN ('pending', 'reviewing'));

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT USAGE ON SEQUENCE job_applications_id_seq TO authenticated;

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- Run these to verify the table was created correctly:

-- 1. Check table structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'job_applications' 
-- ORDER BY ordinal_position;

-- 2. Check indexes
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename = 'job_applications';

-- 3. Check constraints
-- SELECT constraint_name, constraint_type 
-- FROM information_schema.table_constraints 
-- WHERE table_name = 'job_applications';

-- ================================================
-- SAMPLE DATA (Optional - for testing)
-- ================================================
-- Uncomment and modify these inserts to test the table:

-- INSERT INTO public.job_applications (
--   user_id, 
--   job_id, 
--   cover_letter,
--   applicant_first_name,
--   applicant_last_name,
--   applicant_phone,
--   applicant_nationality,
--   applicant_wechat_id
-- ) VALUES (
--   'your-user-uuid-here',
--   1,
--   'This is a sample cover letter for testing purposes.',
--   'John',
--   'Doe',
--   '+1234567890',
--   'American',
--   'john_wechat'
-- );

-- ================================================
-- NOTES
-- ================================================
-- 1. The table includes snapshot fields (applicant_*) to preserve 
--    user data as it was when they applied
-- 2. RLS policies ensure users can only access their own applications
-- 3. The unique constraint prevents duplicate applications to the same job
-- 4. Cascade deletes ensure data consistency when users/jobs are deleted
-- 5. The updated_at trigger automatically tracks when records change