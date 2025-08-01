# Resume OCR & LLM Integration Guide

## 📋 Overview

This guide provides a comprehensive analysis of the Huntier project structure to help integrate **PyTesseract OCR** and **Qwen 3 model** (running locally) for resume parsing and content categorization. The project already has a solid foundation for resume handling that can be extended with these AI capabilities.

## 🏗️ Current Resume Infrastructure

### Database Schema

The project uses **Supabase PostgreSQL** with the following resume-related tables:

#### `user_resumes` Table
```sql
CREATE TABLE user_resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT, -- 'pdf', 'docx', 'jpeg'
  is_primary BOOLEAN DEFAULT true,
  version INTEGER DEFAULT 1,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### `user_profiles` Table (Resume Metadata)
The main user profile table includes resume-related fields:
```sql
-- Resume metadata fields in user_profiles
resume_file_url TEXT,
resume_file_name TEXT,
resume_parsed_at TIMESTAMP WITH TIME ZONE,
resume_file_size INTEGER,
resume_file_type TEXT
```

### File Storage Architecture

**Storage Location**: Supabase Storage bucket `'resumes'`
**File Structure**:
```
resumes/
  {user_id}/
    original/
      resume_timestamp.pdf
      resume_timestamp.docx
    processed/           # ← PERFECT FOR PARSED DATA
      resume_text.json
      resume_extracted.txt
    categorized/         # ← PERFECT FOR QWEN OUTPUT
      resume_structured.json
      resume_categories.json
```

## 🔌 Existing API Endpoints

### Current Resume APIs
| Method | Endpoint | Purpose | File Location |
|--------|----------|---------|---------------|
| `POST` | `/api/resume/upload` | Upload resume files | `src/app/api/resume/upload/route.ts` |
| `GET` | `/api/resume/download` | Download resume with signed URL | `src/app/api/resume/download/route.ts` |
| `DELETE` | `/api/resume/delete` | Delete resume and metadata | `src/app/api/resume/delete/route.ts` |

### 🎯 Recommended Integration Points

#### 1. **PyTesseract OCR Endpoint** (NEW)
```typescript
// src/app/api/resume/ocr-extract/route.ts
POST /api/resume/ocr-extract
{
  resumeId: string,
  userId: string
}
```

#### 2. **Qwen 3 Categorization Endpoint** (NEW) 
```typescript
// src/app/api/resume/qwen-categorize/route.ts
POST /api/resume/qwen-categorize
{
  resumeId: string,
  extractedText: string,
  userId: string
}
```

## 📁 Frontend Components Structure

### Core Resume Components

#### 1. **ResumeUpload Component**
- **File**: `src/components/features/onboarding/ResumeUpload.tsx`
- **Purpose**: Drag-and-drop upload during onboarding
- **Features**: File validation (PDF/DOCX/JPEG), drag/drop, LinkedIn option
- **Integration Point**: Add OCR processing trigger after successful upload

#### 2. **ResumeSection Component**  
- **File**: `src/components/features/profile/ResumeSection.tsx`
- **Purpose**: Display/manage resume in profile page
- **Features**: Upload, download, delete, replace resume
- **Integration Point**: Add "Parse Resume" button and parsing status display

#### 3. **useResumeUpload Hook**
- **File**: `src/hooks/useResumeUpload.ts` 
- **Purpose**: Reusable upload logic with validation
- **Features**: File validation, upload progress, error handling
- **Integration Point**: Extend to trigger OCR+LLM pipeline after upload

## 🔧 Local AI Integration Architecture

### PyTesseract + Qwen 3 Processing Pipeline

#### Backend Processing Flow
```
1. Resume Upload → Supabase Storage
2. Trigger OCR → PyTesseract extracts text from PDF/image
3. Trigger LLM → Qwen 3 categorizes and structures data
4. Store Results → Database + JSON files
5. Update Profile → Auto-populate user profile forms
```

### Database Extensions for Local AI Features

#### New Tables for PyTesseract + Qwen Results
```sql
-- Store OCR/LLM parsing results
CREATE TABLE resume_parsing_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_id UUID REFERENCES user_resumes(id) ON DELETE CASCADE,
  
  -- PyTesseract OCR Results
  extracted_text TEXT,
  ocr_provider TEXT DEFAULT 'pytesseract',
  ocr_confidence_score DECIMAL(3,2),
  ocr_processing_time INTEGER, -- milliseconds
  
  -- Qwen 3 LLM Results  
  parsed_data JSONB, -- Structured resume data from Qwen
  llm_provider TEXT DEFAULT 'qwen-3-local',
  llm_model_version TEXT, -- e.g., 'qwen-3-7b', 'qwen-3-14b'
  llm_processing_time INTEGER, -- milliseconds
  
  -- Status & Metadata
  processing_status TEXT CHECK (processing_status IN ('pending', 'ocr_processing', 'llm_processing', 'completed', 'failed')),
  error_message TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Store Qwen-suggested profile updates
CREATE TABLE profile_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parsing_result_id UUID REFERENCES resume_parsing_results(id),
  
  section_type TEXT, -- 'experience', 'education', 'skills', 'personal_info'
  suggested_data JSONB,
  confidence_score DECIMAL(3,2),
  is_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Recommended File Structure for PyTesseract + Qwen Integration

```
src/
├── app/api/resume/
│   ├── ocr-extract/route.ts           # ← PyTesseract OCR endpoint
│   ├── qwen-categorize/route.ts       # ← Qwen 3 categorization endpoint
│   ├── process-pipeline/route.ts      # ← Combined OCR→LLM pipeline
│   └── suggestions/route.ts           # ← Get/apply profile suggestions
├── components/features/resume/
│   ├── ResumeParser.tsx              # ← OCR+LLM progress & results
│   ├── QwenSuggestions.tsx           # ← Qwen suggestions UI
│   ├── ParsingStatus.tsx             # ← Processing status indicator
│   └── ProcessingQueue.tsx           # ← Queue status for local processing
├── hooks/
│   ├── useResumeParser.ts            # ← PyTesseract+Qwen processing hook
│   ├── useQwenSuggestions.ts         # ← Profile suggestions hook
│   └── useLocalProcessing.ts         # ← Local AI processing status
├── lib/
│   ├── ocr/
│   │   └── pytesseract-client.ts     # ← PyTesseract API client
│   ├── llm/
│   │   └── qwen-client.ts            # ← Qwen 3 local API client
│   ├── resume-parser.ts              # ← Main parsing orchestrator
│   └── local-ai-queue.ts             # ← Processing queue management
└── types/
    ├── pytesseract.ts                # ← PyTesseract-related types
    ├── qwen.ts                       # ← Qwen 3-related types
    └── resume-parsing.ts             # ← Combined parsing types
```

## 🔄 PyTesseract + Qwen Integration Strategy

### Phase 1: PyTesseract OCR Integration
1. **Set up PyTesseract service** on local laptop (Python server)
2. **Create OCR API endpoint** that calls your local PyTesseract service
3. **Handle various file formats**: PDF → images → OCR, direct image OCR
4. **Store extracted text** in `resume_parsing_results` table

### Phase 2: Qwen 3 LLM Integration  
1. **Set up Qwen 3 model** on local laptop (inference server)
2. **Create categorization endpoint** that calls local Qwen API
3. **Design prompts** for resume data extraction and structuring
4. **Store structured data** and suggestions in database

### Phase 3: Pipeline Integration
1. **Create combined pipeline** (Upload → OCR → LLM → Profile)
2. **Add queue management** for local processing
3. **Implement retry logic** for local service failures
4. **Add processing status** tracking and UI

## 📊 Data Flow & Types for Local AI

### PyTesseract OCR Types
```typescript
// src/types/pytesseract.ts
export interface PyTesseractOCRRequest {
  filePath: string
  fileType: 'pdf' | 'jpeg' | 'png' | 'docx'
  userId: string
  resumeId: string
}

export interface PyTesseractOCRResponse {
  success: boolean
  extractedText: string
  confidence: number
  processingTime: number
  error?: string
  metadata?: {
    pageCount: number
    language: string
    imageResolution?: string
  }
}
```

### Qwen 3 Model Types
```typescript
// src/types/qwen.ts
export interface QwenCategorizationRequest {
  extractedText: string
  userId: string
  resumeId: string
  modelVersion: 'qwen-3-7b' | 'qwen-3-14b' | 'qwen-3-32b'
}

export interface QwenCategorizationResponse {
  success: boolean
  structuredData: {
    personalInfo: {
      name?: string
      email?: string
      phone?: string
      location?: string
      linkedIn?: string
    }
    workExperience: Array<{
      title: string
      company: string
      startDate: string
      endDate?: string
      location?: string
      description: string
      technologies?: string[]
    }>
    education: Array<{
      degree: string
      institution: string
      graduationYear: string
      location?: string
      gpa?: string
      relevantCourses?: string[]
    }>
    skills: Array<{
      name: string
      category: 'technical' | 'soft' | 'language' | 'other'
      proficiency?: 'beginner' | 'intermediate' | 'advanced' | 'expert'
      yearsOfExperience?: number
    }>
    certifications?: Array<{
      name: string
      issuer: string
      issueDate: string
      expiryDate?: string
      credentialId?: string
    }>
    projects?: Array<{
      name: string
      description: string
      technologies: string[]
      startDate: string
      endDate?: string
      url?: string
      role?: string
    }>
  }
  confidence: number
  processingTime: number
  modelUsed: string
  error?: string
}
```

## 🛡️ Local AI Considerations

### Local Processing Benefits
- **Cost-effective**: No per-request API charges
- **Privacy**: Data stays on local infrastructure
- **Customization**: Can fine-tune Qwen model for resumes
- **Speed**: No network latency for large files

### Local Processing Challenges
- **Resource management**: CPU/GPU usage monitoring
- **Queue management**: Handle multiple requests
- **Error handling**: Local service availability
- **Performance**: Processing time for large files

### Recommended Local Setup
```python
# Example local AI service structure
# local-ai-service/
# ├── ocr_service.py          # PyTesseract OCR server
# ├── qwen_service.py         # Qwen 3 inference server
# ├── main.py                 # Combined API server
# ├── requirements.txt        # Python dependencies
# └── config.py               # Configuration
```

## 🔗 Integration with Existing Profile System

### Profile Auto-Population Flow
1. **Extract data** using PyTesseract + Qwen
2. **Map to existing types** in `src/types/user.ts`:
   - `ProfileExperience[]` ← Work experience from Qwen
   - `ProfileEducation[]` ← Education from Qwen  
   - `ProfileSkill[]` ← Skills from Qwen
   - `ProfileCertification[]` ← Certifications from Qwen
   - `ProfileProject[]` ← Projects from Qwen

### Existing Profile Forms Integration
- `src/components/features/profile/EditableExperience.tsx`
- `src/components/features/profile/EditableEducation.tsx` 
- `src/components/features/profile/EditableSkills.tsx`
- `src/components/features/profile/EditableCertifications.tsx`
- `src/components/features/profile/EditableProjects.tsx`

**Integration Strategy**: Pre-populate these forms with Qwen-parsed data, allowing users to review and edit before saving.

## 📋 Implementation Checklist

### Local AI Service Setup
- [ ] Set up PyTesseract on local laptop with PDF support
- [ ] Deploy Qwen 3 model locally (recommend 7B or 14B version)
- [ ] Create Python API server for OCR + LLM services
- [ ] Test connectivity between Next.js app and local services
- [ ] Set up proper error handling and timeouts

### Backend API Development
- [ ] Create OCR extraction endpoint calling local PyTesseract
- [ ] Create Qwen categorization endpoint calling local model
- [ ] Implement combined processing pipeline
- [ ] Add database migrations for new tables
- [ ] Implement queue management for local processing
- [ ] Add comprehensive error handling and logging

### Frontend Integration
- [ ] Create parsing status components with progress indicators
- [ ] Create Qwen suggestion review UI
- [ ] Extend ResumeUpload component to trigger AI pipeline
- [ ] Add processing queue status display
- [ ] Integrate with existing profile forms for auto-population
- [ ] Add retry mechanisms for failed processing

### Testing & Validation
- [ ] Test with various resume formats (PDF, DOCX, images)
- [ ] Validate PyTesseract text extraction quality
- [ ] Test Qwen categorization accuracy with sample resumes
- [ ] Performance testing with large files
- [ ] Test error scenarios (local service down, timeouts)
- [ ] Validate profile auto-population accuracy

## 💡 Local Processing Optimization Tips

### PyTesseract Optimization
- **Preprocessing**: Image enhancement before OCR
- **Language packs**: Install relevant language packs
- **DPI settings**: Optimize for resume documents
- **PDF handling**: Convert PDF pages to high-quality images

### Qwen 3 Model Optimization
- **Model size**: Balance between accuracy and speed (7B vs 14B vs 32B)
- **Prompt engineering**: Optimize prompts for resume parsing
- **Context length**: Manage long resume text input
- **Batching**: Process multiple sections simultaneously

### Performance Monitoring
```typescript
// Example local service monitoring
interface LocalServiceStatus {
  ocrService: {
    available: boolean
    responseTime: number
    queueLength: number
  }
  qwenService: {
    available: boolean
    responseTime: number
    modelLoaded: boolean
    memoryUsage: number
  }
}
```

## 🎯 Quick Start Guide for Local Integration

1. **Review existing resume components**:
   - `src/app/api/resume/upload/route.ts` - Current upload flow
   - `src/components/features/onboarding/ResumeUpload.tsx` - UI integration point

2. **Set up local AI services**:
   - Install PyTesseract with PDF support
   - Deploy Qwen 3 model (start with 7B version)
   - Create API server endpoints

3. **Create integration endpoints**:
   - Start with OCR extraction endpoint
   - Add Qwen categorization endpoint
   - Test with sample resume files

4. **Integrate with frontend**:
   - Add processing status indicators
   - Show parsing results to users
   - Enable profile auto-population

5. **Test and iterate**:
   - Validate parsing accuracy
   - Optimize processing performance
   - Refine user experience

The existing codebase provides an excellent foundation for PyTesseract + Qwen integration. The modular architecture and comprehensive type system make it straightforward to add local AI processing capabilities.

**Key Integration Points:**
- Extend upload flow to trigger local AI processing
- Store results in existing database structure
- Auto-populate existing profile forms
- Maintain user control over suggested data

Good luck with your PyTesseract + Qwen 3 integration!