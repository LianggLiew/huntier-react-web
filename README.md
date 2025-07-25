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

7. **Advanced Job Browsing Experience**
   - Fixed navigation sidebar for seamless page navigation
   - Sticky job listing header with search and filtering controls
   - Floating filter panel that stays accessible while browsing
   - Real-time job filtering and search functionality
   - Responsive design with mobile-optimized filter overlays

8. **Comprehensive Profile Management System**
   - Interactive editable profile cards with real-time validation
   - Multi-section profile including personal info, experience, education, skills, projects, and certifications
   - Profile picture upload with drag-and-drop functionality
   - Form validation with visual feedback (red borders for empty required fields)
   - Structured data management for professional portfolio creation

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
- Advanced CSS positioning with Tailwind CSS
- Sticky and fixed positioning for optimal UX
- State management with React hooks for filter synchronization

### User Journey

1. **Registration & Verification**
   - Users sign up with email or phone
   - OTP verification for account security
   - Comprehensive profile creation with personal info, skills, experience, and preferences

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
│   │   ├── jobs/          # Job listing and detail pages
│   │   ├── profile/       # User profile management
│   │   └── verify-otp/    # OTP verification flow
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Base UI components
│   │   ├── navigation-sidebar.tsx  # Fixed navigation sidebar
│   │   └── toast-provider.tsx      # Toast notifications
│   ├── jobs/             # Job-related components
│   │   ├── job-listing-container.tsx  # Job listing state management
│   │   ├── job-listing.tsx           # Job listing UI components
│   │   ├── job-filters.tsx           # Filter panel component
│   │   └── job-card.tsx              # Individual job card
│   ├── profile/          # Profile management components
   │   │   ├── EditableAbout.tsx          # About section editor
   │   │   ├── EditableExperience.tsx     # Work experience manager
   │   │   ├── EditableEducation.tsx      # Education background editor
   │   │   ├── EditableSkills.tsx         # Skills with proficiency levels
   │   │   ├── EditableProjects.tsx       # Project portfolio manager
   │   │   ├── EditableCertifications.tsx # Certifications manager
   │   │   ├── PersonalInfoModal.tsx      # Personal information editor
   │   │   ├── ProfilePictureUpload.tsx   # Profile image upload
   │   │   └── ProfileSidebar.tsx         # Profile navigation
│   └── onboarding/       # Onboarding flow components
├── lib/                  # Utility libraries
├── dictionaries/         # Internationalization files
├── types/               # TypeScript type definitions
│   └── job.ts           # Job and filter type definitions
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.ts    # Local storage management
│   └── useScrollDirection.ts # Scroll direction detection
├── utils/               # Utility functions
└── public/              # Static assets
```

## Key Features in Development

- **Beta Testing Program:** Limited early access for selected users
- **AI Avatar Interviews:** Next-generation interview simulation technology
- **Global Opportunity Network:** 10,000+ curated job listings from 75+ industries across 120+ countries
- **Semantic Search Technology:** Advanced vector-based matching system
- **Free Platform:** Completely free for job seekers

## Database Schema

### Profile Data Structure
The platform uses a comprehensive database schema to store user profile information:

- **Personal Information:** Name, title, location, availability status, profile picture
- **Professional Experience:** Job history with titles, companies, periods, and detailed descriptions
- **Education Background:** Degrees, institutions, and study periods
- **Skills & Proficiency:** Technical and soft skills with proficiency levels (0-100%)
- **Project Portfolio:** Personal and professional projects with technology stacks
- **Certifications:** Professional certifications with issuing organizations and dates
- **Validation & Security:** All fields include proper validation and sanitization

## Recent UI/UX Improvements

### Navigation & Layout Enhancements
- **Fixed Navigation Sidebar:** Persistent left navigation that stays visible across all pages
- **Layered Z-Index System:** Proper stacking context to prevent UI element overlaps
- **Footer Compatibility:** Navigation sidebar positioned to avoid footer interference

### Job Listing Page Optimizations
- **Sticky Header:** Job search controls remain accessible while scrolling through listings
- **Floating Filter Panel:** Filters stay visible and accessible during job browsing
- **State Synchronization:** Real-time connection between search, filters, and job results
- **Responsive Filtering:** Smooth transitions and mobile-optimized filter overlays
- **Optimized Positioning:** Filter panel aligns perfectly with job cards for better visual flow

### Profile System Enhancements
- **Real-time Validation:** Form fields validate input in real-time with visual feedback
- **Null Field Prevention:** Red border indicators for empty required fields
- **Drag-and-Drop Uploads:** Intuitive profile picture upload with preview functionality
- **Structured Data Management:** Organized storage for experience, education, skills, projects, and certifications
- **Interactive Editing:** In-place editing with save/cancel functionality for all profile sections

### Performance & Accessibility
- **Smooth Animations:** CSS transitions for collapsible elements and panel interactions
- **Keyboard Navigation:** Full keyboard accessibility for all interactive elements
- **Screen Reader Support:** Proper ARIA labels and semantic HTML structure
- **Mobile-First Design:** Touch-friendly interfaces with appropriate spacing and sizing

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