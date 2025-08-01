-- User Profiles Migration
-- This script creates the user_profiles table to support extended user information
-- Run this on your Supabase database

CREATE TABLE public.user_profiles (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
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
  resume_file_url character varying,
  resume_file_name character varying,
  resume_parsed_at timestamp with time zone,
  resume_file_size integer,
  resume_file_type character varying(10),
  wechat_id character varying,
  job_preferences jsonb DEFAULT '{
    "preferredLocations": [],
    "preferredEmploymentTypes": [],
    "preferredCompanySizes": [],
    "preferredIndustries": [],
    "remoteWorkPreference": "no_preference"
  }'::jsonb,
  notification_preferences jsonb DEFAULT '{
    "email": true,
    "sms": false,
    "jobRecommendations": true,
    "applicationUpdates": true,
    "marketing": false
  }'::jsonb,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_profiles_pkey PRIMARY KEY (id),
  CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE,
  CONSTRAINT user_profiles_user_id_unique UNIQUE (user_id)
);

-- Create index for faster lookups
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Create a trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON public.user_profiles 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add Row Level Security (RLS) policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own profile
CREATE POLICY "Users can view their own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
ON public.user_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy for users to delete their own profile
CREATE POLICY "Users can delete their own profile"
ON public.user_profiles FOR DELETE
USING (auth.uid() = user_id);