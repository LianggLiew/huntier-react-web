-- Saved Jobs Table Migration
-- This table stores the many-to-many relationship between users and saved jobs

-- Create saved_jobs table
CREATE TABLE saved_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure a user can only save a job once
    UNIQUE(user_id, job_id)
);

-- Create indexes for performance
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_saved_jobs_saved_at ON saved_jobs(saved_at);
CREATE INDEX idx_saved_jobs_user_saved_at ON saved_jobs(user_id, saved_at DESC);

-- Add trigger for updating updated_at timestamp
CREATE TRIGGER update_saved_jobs_updated_at 
    BEFORE UPDATE ON saved_jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE saved_jobs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own saved jobs
CREATE POLICY "Users can view their own saved jobs" ON saved_jobs
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own saved jobs
CREATE POLICY "Users can insert their own saved jobs" ON saved_jobs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own saved jobs
CREATE POLICY "Users can delete their own saved jobs" ON saved_jobs
    FOR DELETE USING (auth.uid() = user_id);

-- Add additional columns to jobs table for saved jobs functionality
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired'));
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;

-- Create index for job status
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_expires_at ON jobs(expires_at);

-- Update existing jobs to have active status
UPDATE jobs SET status = 'active' WHERE status IS NULL;

-- Grant necessary permissions
GRANT ALL ON saved_jobs TO authenticated;

-- Create function to get saved job count for a user
CREATE OR REPLACE FUNCTION get_user_saved_jobs_count(target_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (
        SELECT COUNT(*)
        FROM saved_jobs 
        WHERE user_id = target_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if a job is saved by a user
CREATE OR REPLACE FUNCTION is_job_saved_by_user(target_user_id UUID, target_job_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM saved_jobs 
        WHERE user_id = target_user_id AND job_id = target_job_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;