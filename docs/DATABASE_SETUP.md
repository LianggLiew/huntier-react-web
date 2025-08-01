# Database Setup for Job Listing Feature

## Overview
The job listing feature uses a normalized PostgreSQL database with Supabase as the backend service.

## Database Schema
The schema consists of 3 main tables:
- `companies` - Company master data with benefits and details
- `jobs` - Job listings with salary ranges and requirements  
- `job_attributes` - Additional job metadata like skills and hiring manager info

## Setup Instructions

### 1. Database Creation
Copy and execute the SQL from `migrations/001_job_listing_schema.sql` in your Supabase SQL Editor.

This creates:
- ✅ All required tables with proper relationships
- ✅ Performance indexes for search and filtering
- ✅ Sample companies and job data for testing
- ✅ Automatic timestamp triggers

### 2. Environment Variables
Ensure these are set in your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Features Implemented
- ✅ Real-time job search across titles, descriptions, and requirements
- ✅ Advanced filtering by salary range, employment type, and company category
- ✅ Server-side pagination for performance
- ✅ Company information with logos and benefits
- ✅ Skills tagging system for better job matching
- ✅ Job detail pages with full company and job information

## API Endpoints
- `GET /api/jobs` - List jobs with filtering and pagination
- `GET /api/jobs/[id]` - Get specific job details
- `GET /api/companies` - List all companies
- `POST /api/jobs` - Create new job (admin)
- `PUT /api/jobs/[id]` - Update job (admin)  
- `DELETE /api/jobs/[id]` - Delete job (admin)

## Files Structure
```
src/
├── app/api/jobs/           # Job API routes
├── components/features/jobs/ # Job UI components
├── lib/supabase.ts        # Database utilities and JobDatabase class
├── types/job.ts           # TypeScript interfaces and data transformers
└── migrations/            # Database schema files
```

The system is production-ready with proper error handling, data validation, and performance optimization.

Current database existing table:
-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.companies (
  company_id integer NOT NULL DEFAULT nextval('companies_company_id_seq'::regclass),
  name character varying NOT NULL,
  website character varying NOT NULL,
  description text,
  address character varying,
  niche character varying,
  benefits jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  logo_url character varying,
  CONSTRAINT companies_pkey PRIMARY KEY (company_id)
);
CREATE TABLE public.job_attributes (
  job_id integer NOT NULL,
  hiring_manager character varying,
  skill_tags ARRAY,
  additional_info text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT job_attributes_pkey PRIMARY KEY (job_id),
  CONSTRAINT job_attributes_job_id_fkey FOREIGN KEY (job_id) REFERENCES public.jobs(job_id)
);
CREATE TABLE public.jobs (
  job_id integer NOT NULL DEFAULT nextval('jobs_job_id_seq'::regclass),
  title character varying NOT NULL,
  description text,
  requirements text,
  salary_min integer,
  salary_max integer,
  employment_type character varying CHECK (employment_type::text = ANY (ARRAY['full-time'::character varying, 'part-time'::character varying, 'contract'::character varying]::text[])),
  recruit_type character varying CHECK (recruit_type::text = ANY (ARRAY['campus'::character varying, 'social'::character varying]::text[])),
  posted_date timestamp with time zone DEFAULT now(),
  location character varying,
  company_id integer NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT jobs_pkey PRIMARY KEY (job_id),
  CONSTRAINT jobs_company_id_fkey FOREIGN KEY (company_id) REFERENCES public.companies(company_id)
);
CREATE TABLE public.otp_blacklist (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  blacklisted_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp without time zone,
  contact_value text NOT NULL,
  contact_type text NOT NULL,
  reason text DEFAULT '''''::text'::text,
  CONSTRAINT otp_blacklist_pkey PRIMARY KEY (id, contact_value, contact_type)
);
CREATE TABLE public.otp_codes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  code character varying NOT NULL,
  type character varying NOT NULL CHECK (type::text = ANY (ARRAY['email'::character varying, 'phone'::character varying]::text[])),
  expires_at timestamp with time zone NOT NULL,
  attempts integer DEFAULT 0,
  is_used boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  resend_count bigint DEFAULT '0'::bigint,
  contact_value text,
  contact_type text,
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id),
  CONSTRAINT otp_codes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.refresh_tokens (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  token character varying NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  device_info text,
  CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  date_of_birth date,
  nationality character varying,
  location character varying,
  avatar_url character varying,
  title character varying,
  bio text,
  onboarding_completed boolean DEFAULT false,
  profile_completion_percentage integer DEFAULT 0,
  wechat_id character varying,
  job_preferences jsonb DEFAULT '{"preferredLocations": [], "preferredIndustries": [], "remoteWorkPreference": "no_preference", "preferredCompanySizes": [], "preferredEmploymentTypes": []}'::jsonb,
  notification_preferences jsonb DEFAULT '{"sms": false, "email": true, "marketing": false, "applicationUpdates": true, "jobRecommendations": true}'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  experience jsonb DEFAULT '[]'::jsonb,
  education jsonb DEFAULT '[]'::jsonb,
  skills jsonb DEFAULT '[]'::jsonb,
  certifications jsonb DEFAULT '[]'::jsonb,
  projects jsonb DEFAULT '[]'::jsonb,
  major character varying,
  highest_degree character varying,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.user_resumes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  file_url character varying NOT NULL,
  file_name character varying NOT NULL,
  file_size integer,
  file_type character varying,
  parsed_at timestamp with time zone,
  uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  is_primary boolean DEFAULT true,
  version integer DEFAULT 1,
  CONSTRAINT user_resumes_pkey PRIMARY KEY (id),
  CONSTRAINT user_resumes_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id)
);
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying UNIQUE,
  phone character varying UNIQUE,
  is_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  last_login timestamp with time zone,
  CONSTRAINT users_pkey PRIMARY KEY (id)
);