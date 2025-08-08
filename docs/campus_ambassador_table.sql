-- Simplified Campus Ambassador Application Table
-- Stores essential information for Campus Ambassador program applications

CREATE TABLE campus_ambassador_applications (
    -- Primary key and metadata
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Application status
    application_status VARCHAR(20) DEFAULT 'submitted' CHECK (application_status IN ('submitted', 'under_review', 'approved', 'rejected', 'withdrawn')),
    
    -- Required applicant information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    university VARCHAR(200) NOT NULL,
    faculty VARCHAR(150) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    graduation_year VARCHAR(4) NOT NULL,
    
    -- Optional resume upload
    resume_filename VARCHAR(255),
    resume_file_path TEXT,
    resume_file_size INTEGER,
    resume_mime_type VARCHAR(100),
    
    -- Additional tracking fields
    language_preference VARCHAR(2) DEFAULT 'en' CHECK (language_preference IN ('en', 'zh')),
    user_agent TEXT,
    ip_address INET,
    
    -- Ensure unique student applications
    CONSTRAINT unique_student_application UNIQUE (student_id, university)
);

-- Create indexes for better query performance
CREATE INDEX idx_campus_ambassador_email ON campus_ambassador_applications(student_id);
CREATE INDEX idx_campus_ambassador_status ON campus_ambassador_applications(application_status);
CREATE INDEX idx_campus_ambassador_created_at ON campus_ambassador_applications(created_at);
CREATE INDEX idx_campus_ambassador_university ON campus_ambassador_applications(university);
CREATE INDEX idx_campus_ambassador_faculty ON campus_ambassador_applications(faculty);
CREATE INDEX idx_campus_ambassador_graduation_year ON campus_ambassador_applications(graduation_year);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campus_ambassador_updated_at 
    BEFORE UPDATE ON campus_ambassador_applications 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create view for active applications
CREATE VIEW active_campus_ambassador_applications AS
SELECT 
    id,
    first_name,
    last_name,
    university,
    faculty,
    student_id,
    graduation_year,
    application_status,
    resume_filename,
    created_at,
    updated_at
FROM campus_ambassador_applications
WHERE application_status != 'withdrawn'
ORDER BY created_at DESC;

-- Admin summary view
CREATE VIEW campus_ambassador_summary AS
SELECT 
    application_status,
    COUNT(*) as application_count,
    COUNT(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_applications,
    STRING_AGG(DISTINCT university, ', ') as universities_represented,
    STRING_AGG(DISTINCT faculty, ', ') as faculties_represented
FROM campus_ambassador_applications
GROUP BY application_status;

-- Sample queries (commented)
/*
-- Get all applications
SELECT first_name, last_name, university, faculty, graduation_year, created_at 
FROM campus_ambassador_applications 
ORDER BY created_at DESC;

-- Get applications by university
SELECT university, faculty, COUNT(*) as application_count 
FROM campus_ambassador_applications 
GROUP BY university, faculty 
ORDER BY university, application_count DESC;

-- Get applications with resumes
SELECT first_name, last_name, university, resume_filename 
FROM campus_ambassador_applications 
WHERE resume_filename IS NOT NULL;

-- Update application status
UPDATE campus_ambassador_applications 
SET application_status = 'approved' 
WHERE id = 'application-uuid-here';
*/