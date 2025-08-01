# Resume Features Implementation Roadmap

## Overview

This document outlines the two-stage implementation plan for resume parsing and AI optimization features in the Huntier platform. The phased approach ensures manageable complexity, controlled costs, and validated user value at each stage.

## 📋 Executive Summary

**Goal**: Enhance user onboarding by automatically extracting resume data and providing AI-powered optimization suggestions.

**Approach**: Two-stage implementation
- **Stage 1**: Basic text extraction and profile population
- **Stage 2**: AI-powered resume optimization and suggestions

**Timeline**: 7-10 weeks total
**Budget**: $13,000-19,000 development + $0.10 per user operational

---

## 🎯 Stage 1: Basic Text Extraction & Profile Population

### Objectives
- Automatically extract user information from uploaded resumes (PDF/DOCX)
- Populate user profile forms with extracted data
- Store structured data in database for future AI processing
- Provide immediate value to users by reducing manual data entry

### Technical Implementation

#### Document Processing
- **Parser**: AWS Textract (recommended) or Azure Document Intelligence
- **Supported formats**: PDF, DOCX (max 5MB)
- **Output**: Structured JSON matching existing data interfaces

#### Database Schema Extensions

```sql
-- User profiles table
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  nationality TEXT,
  location TEXT,
  
  -- Resume metadata
  resume_file_url TEXT,
  resume_file_name TEXT,
  resume_parsed_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id)
);

-- Work experience table
CREATE TABLE user_experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  duration TEXT,
  description TEXT,
  skills TEXT[], -- Array of skills
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Skills table
CREATE TABLE user_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  skill_name TEXT NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE user_education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  degree TEXT,
  institution TEXT,
  graduation_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### API Endpoints

```typescript
// POST /api/resume/parse
interface ResumeUploadRequest {
  file: File; // Resume file (PDF/DOCX)
}

  // Updated for separated table
  interface ResumeUploadResponse {
    success: boolean;
    data: {
      resumeId: string; // New: resume UUID
      fileUrl: string;
      fileName: string;
      version: number;
      isPrimary: boolean;
    };
  }

// GET /api/user/profile/:userId
interface UserProfileResponse {
  profile: UserProfile;
  experience: Experience[];
  skills: Skill[];
  education: Education[];
}

// PUT /api/user/profile/:userId
interface ProfileUpdateRequest {
  personal_info?: Partial<PersonalInfo>;
  experience?: Experience[];
  skills?: Skill[];
  education?: Education[];
}
```

#### Frontend Integration

**Modified Components:**
- `ResumeUpload.tsx`: Add parsing API call after file upload
- `ResumeSummary.tsx`: Display extracted data with edit capabilities
- `PersonalInfoForm.tsx`: Auto-populate from parsed data

**User Flow:**
1. User uploads resume file
2. System displays processing indicator
3. Extracted data populates form fields
4. User reviews and edits extracted information
5. User continues to next onboarding step

### Cost Analysis - Stage 1

**Development Costs:**
- Backend API development: $3,000-5,000
- Database setup & migrations: $1,000-2,000
- Frontend integration: $2,000-3,000
- Testing & QA: $1,000
- **Total: $7,000-11,000**

**Operational Costs:**
- AWS Textract: ~$0.0015 per page
- File storage: ~$0.01 per file
- **Per resume: $0.01-0.05**

### Success Metrics - Stage 1
- Resume parsing accuracy: >85%
- User onboarding completion rate: +30%
- Time to complete profile: -60%
- User satisfaction with auto-population: >4/5

---

## 🚀 Stage 2: AI-Powered Resume Optimization

### Objectives
- Provide intelligent resume optimization suggestions
- Generate job-specific resume recommendations
- Implement ATS (Applicant Tracking System) scoring
- Offer premium AI-powered features

### Technical Implementation

#### Database Schema Extensions

```sql
-- Resume optimization suggestions
CREATE TABLE resume_optimizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(job_id),
  
  -- Optimization data
  optimization_type TEXT CHECK (optimization_type IN ('general', 'job_specific')),
  suggestions JSONB, -- LLM suggestions
  applied_changes JSONB, -- What user applied
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  applied_at TIMESTAMP WITH TIME ZONE
);

-- ATS scoring
CREATE TABLE ats_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
  job_id INTEGER REFERENCES jobs(job_id),
  
  overall_score INTEGER CHECK (overall_score >= 0 AND overall_score <= 100),
  keyword_match_score INTEGER,
  format_score INTEGER,
  suggestions TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### AI Integration

**LLM Provider**: OpenAI GPT-4 or Anthropic Claude
**Use Cases:**
- General resume improvement suggestions
- Job-specific optimization recommendations
- Keyword optimization for ATS systems
- Content enhancement and formatting tips

#### API Endpoints

```typescript
// POST /api/resume/optimize
interface OptimizationRequest {
  user_id: string;
  job_id?: number; // Optional for job-specific optimization
  optimization_type: 'general' | 'job_specific';
}

interface OptimizationResponse {
  success: boolean;
  suggestions: {
    section: string; // 'experience', 'skills', 'summary', etc.
    type: 'add' | 'modify' | 'remove' | 'reorder';
    current_content: string;
    suggested_content: string;
    reason: string;
    impact_score: number; // 1-10
  }[];
  ats_score?: {
    overall: number;
    keyword_match: number;
    format: number;
    improvements: string[];
  };
}

// POST /api/resume/ats-score
interface ATSScoreRequest {
  user_id: string;
  job_id: number;
}

interface ATSScoreResponse {
  score: number; // 0-100
  breakdown: {
    keyword_match: number;
    format_score: number;
    experience_relevance: number;
    skills_match: number;
  };
  suggestions: string[];
  missing_keywords: string[];
}
```

#### New Frontend Components

**ResumeOptimizer.tsx**
- Display optimization suggestions
- Allow users to apply/reject suggestions
- Show before/after comparisons

**ATSScoreCard.tsx**
- Display ATS compatibility score
- Show improvement recommendations
- Highlight missing keywords

**OptimizedResumePreview.tsx**
- Preview optimized resume
- Export functionality
- Version comparison

### Cost Analysis - Stage 2

**Development Costs:**
- LLM integration & prompt engineering: $3,000-4,000
- UI components for suggestions: $2,000-3,000
- Testing & refinement: $1,000
- **Total: $6,000-8,000**

**Operational Costs:**
- OpenAI GPT-4: ~$0.03-0.06 per optimization
- Claude: ~$0.02-0.04 per optimization
- **Per optimization: $0.03-0.08**

### Success Metrics - Stage 2
- User engagement with suggestions: >60%
- Applied suggestions rate: >40%
- Resume improvement score: +25%
- Premium feature conversion: >15%

---

## 📈 Implementation Timeline

### Phase 1: Foundation (Week 1-6)
- **Week 1-2**: Database schema setup and migrations
- **Week 3-4**: Backend API development (text extraction)
- **Week 5-6**: Frontend integration and testing

### Phase 2: AI Enhancement (Week 7-10)
- **Week 7-8**: LLM integration and prompt development
- **Week 9**: UI components for optimization features
- **Week 10**: End-to-end testing and deployment

## 🔧 Technical Stack

### Current Stack Integration
- **Frontend**: React, TypeScript, Next.js
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **File Storage**: Supabase Storage or AWS S3

### New Dependencies
- **Document Processing**: AWS Textract SDK
- **AI Integration**: OpenAI SDK or Anthropic SDK
- **File Handling**: Multer for file uploads

## 💰 Business Model Integration

### Free Tier
- Basic resume upload and extraction
- Limited to 1 resume per month
- Basic profile population

### Premium Tier ($9.99/month)
- Unlimited resume uploads
- AI-powered optimization suggestions
- ATS scoring and job-specific recommendations
- Advanced resume templates
- Export functionality

## 🛡️ Security & Privacy Considerations

### Data Protection
- Encrypt resume files at rest
- Implement secure file upload validation
- GDPR compliance for EU users
- User consent for AI processing

### File Processing
- Virus scanning for uploaded files
- File type validation and sanitization
- Automatic file cleanup after processing
- Rate limiting for API endpoints

## 📊 Monitoring & Analytics

### Stage 1 Metrics
- File upload success rate
- Parsing accuracy by document type
- User completion rates
- Error tracking and resolution

### Stage 2 Metrics
- LLM response quality
- User acceptance of suggestions
- Feature usage patterns
- Cost per optimization

## 🚀 Future Enhancements (Post-Stage 2)

### Advanced Features
- Multi-language resume support
- Industry-specific optimization
- Resume version management
- Integration with job application tracking
- AI-powered cover letter generation

### Integration Opportunities
- LinkedIn profile sync
- Job board API integrations
- Calendar integration for interviews
- Email templates for follow-ups

---

## 📞 Questions & Support

For questions about this implementation plan, contact:
- **Technical Lead**: [Name]
- **Product Manager**: [Name]
- **Project Channel**: #resume-features-dev

## 📝 Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-28 | Claude Code | Initial roadmap creation |

---

*This document will be updated as implementation progresses and requirements evolve.*