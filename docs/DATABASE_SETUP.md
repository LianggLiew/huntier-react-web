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