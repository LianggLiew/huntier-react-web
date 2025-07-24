# Huntier Job Application Platform

## Overview

Huntier is an AI-powered job matching platform that helps professionals find their perfect career match. The platform leverages advanced artificial intelligence and machine learning technologies to connect job seekers with opportunities that align with their unique skills, experience, and career aspirations.

## What This Project Does

This is a modern, full-stack web application built with Next.js that provides:

### Core Features

1. **AI-Powered Job Matching**
   - Uses semantic vector matching technology to analyze resumes and job descriptions
   - Goes beyond traditional keyword matching to understand context and meaning
   - Achieves 94% match accuracy in connecting candidates with suitable opportunities
   - Analyzes 5,000+ skills and competencies

2. **Multi-language Support**
   - Available in English and Chinese (zh)
   - Internationalized UI with locale-based routing
   - Cultural adaptation for different markets

3. **User Authentication & Verification**
   - OTP (One-Time Password) verification system
   - Email and SMS verification support
   - Blacklist management for security
   - Rate limiting and cleanup services

4. **AI Interview Preparation**
   - Interactive AI avatars for interview practice
   - Personalized interview questions based on job requirements
   - Real-time feedback and coaching

5. **Career Resources Platform**
   - Curated collection of career guidance materials
   - Articles, videos, tools, and guides
   - Searchable and filterable resource library
   - Multilingual content support

6. **Smart Resume Analysis**
   - CV parsing and analysis capabilities
   - Skills extraction and matching
   - Resume optimization suggestions

### Technical Architecture

**Frontend:**
- **Framework:** Next.js 15 with React 19
- **Styling:** Tailwind CSS with custom animations
- **UI Components:** Radix UI primitives with shadcn/ui
- **Internationalization:** Custom dictionary system for English/Chinese
- **State Management:** React hooks and context

**Backend:**
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Custom OTP system with email/SMS
- **AI Integration:** OpenAI for semantic matching and analysis
- **Email Service:** Resend for transactional emails
- **SMS Service:** AWS SNS for SMS notifications

**Key Technologies:**
- TypeScript for type safety
- Vector search capabilities for job matching
- Rate limiting for API protection
- Automated cleanup services
- Responsive design with mobile-first approach

### User Journey

1. **Registration & Verification**
   - Users sign up with email or phone
   - OTP verification for account security
   - Profile creation with skills and preferences

2. **Job Discovery**
   - AI-powered job recommendations
   - Advanced search and filtering
   - Semantic matching based on user profile

3. **Application Process**
   - One-click applications with optimized profiles
   - AI interview preparation tools
   - Real-time application tracking

4. **Career Development**
   - Access to learning resources
   - Skill gap analysis
   - Personalized career guidance

### Platform Statistics (Beta)
- 94% AI matching accuracy
- 5,000+ skills analyzed
- 200+ beta partners
- 1,000+ beta testers
- Launch target: Q3 2025

## Project Structure

```
huntier-job-app/
├── app/                    # Next.js app router
│   ├── [lang]/            # Internationalized routes
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   └── onboarding/       # Onboarding flow components
├── lib/                  # Utility libraries
├── dictionaries/         # Internationalization files
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── public/              # Static assets
```

## Key Features in Development

- **Beta Testing Program:** Limited early access for selected users
- **AI Avatar Interviews:** Next-generation interview simulation technology
- **Global Opportunity Network:** 10,000+ curated job listings from 75+ industries across 120+ countries
- **Semantic Search Technology:** Advanced vector-based matching system
- **Free Platform:** Completely free for job seekers

## Target Audience

- **Job Seekers:** Professionals looking for career opportunities that truly match their skills and aspirations
- **Employers:** Companies seeking qualified candidates through AI-powered matching
- **Career Changers:** Individuals exploring new career paths with AI guidance
- **Recent Graduates:** New professionals entering the job market

## Mission Statement

To connect talent with opportunity through AI-driven semantic matching that considers not just skills, but values, goals, and potential using next-generation vectorized technology.

## Company Information

- **Founded:** 2020
- **Status:** Beta phase, preparing for Q3 2025 launch
- **Focus:** AI-powered job matching and career development
- **Approach:** Semantic understanding over traditional keyword matching
- **Vision:** Transforming how people find their dream jobs through advanced technology

---

*This platform represents the future of job searching, where artificial intelligence creates meaningful connections between job seekers and employers, resulting in better career matches and higher satisfaction rates.*