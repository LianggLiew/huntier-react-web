-- Extended User Profiles Migration
-- This script adds JSON fields for experience, education, skills, certifications, and projects
-- Run this on your Supabase database AFTER the basic user_profiles table exists

-- Add new JSON columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS experience jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skills jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS projects jsonb DEFAULT '[]'::jsonb;

-- Add indexes for better JSON query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_experience ON public.user_profiles USING gin(experience);
CREATE INDEX IF NOT EXISTS idx_user_profiles_education ON public.user_profiles USING gin(education);
CREATE INDEX IF NOT EXISTS idx_user_profiles_skills ON public.user_profiles USING gin(skills);
CREATE INDEX IF NOT EXISTS idx_user_profiles_certifications ON public.user_profiles USING gin(certifications);
CREATE INDEX IF NOT EXISTS idx_user_profiles_projects ON public.user_profiles USING gin(projects);

-- Example data structures (for reference):
/*
-- Experience structure:
[
  {
    "id": "uuid",
    "title": "Senior Frontend Developer",
    "company": "TechCorp Inc.",
    "startDate": "2021-01-01",
    "endDate": "2023-12-31", // null for current position
    "description": "Lead the frontend development team...",
    "location": "San Francisco, CA",
    "employmentType": "full-time" // full-time, part-time, contract, internship
  }
]

-- Education structure:
[
  {
    "id": "uuid",
    "degree": "Bachelor of Science in Computer Science",
    "institution": "Stanford University",
    "startDate": "2018-09-01",
    "endDate": "2022-05-31",
    "description": "Relevant coursework: Data Structures, Algorithms...",
    "location": "Stanford, CA",
    "gpa": "3.8" // optional
  }
]

-- Skills structure:
[
  {
    "id": "uuid",
    "name": "React",
    "category": "Frontend", // Frontend, Backend, Database, DevOps, Design, etc.
    "proficiency": 90, // 1-100 scale
    "yearsOfExperience": 5
  }
]

-- Certifications structure:
[
  {
    "id": "uuid",
    "name": "AWS Certified Developer",
    "issuer": "Amazon Web Services",
    "issueDate": "2022-03-15",
    "expiryDate": "2025-03-15", // null if no expiry
    "credentialId": "AWS-12345", // optional
    "credentialUrl": "https://aws.amazon.com/verification", // optional
    "description": "Validates technical expertise..." // optional
  }
]

-- Projects structure:
[
  {
    "id": "uuid",
    "name": "E-commerce Platform",
    "description": "Led the frontend development of a modern e-commerce platform...",
    "technologies": ["React", "Next.js", "TypeScript", "Stripe"],
    "startDate": "2022-01-01",
    "endDate": "2022-06-30", // null for ongoing
    "url": "https://example.com", // optional
    "githubUrl": "https://github.com/user/project", // optional
    "role": "Lead Frontend Developer",
    "teamSize": 5 // optional
  }
]
*/