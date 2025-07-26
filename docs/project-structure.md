# Huntier React Web - Project Structure

This document outlines the current project structure after the recent refactoring and legacy code cleanup.

## Overview

This is a **Next.js 14** application with **TypeScript** support, featuring a multilingual job matching platform with AI-powered recommendations.

## Root Directory Structure

```
huntier-react-web/
├── docs/                           # Project documentation
├── public/                         # Static assets
├── src/                           # Source code (main application)
├── node_modules/                  # Dependencies
├── package.json                   # Project configuration
├── next.config.ts                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── middleware.ts                  # Next.js middleware
└── README.md                      # Project readme
```

## Source Code Structure (`src/`)

### Application Routes (`src/app/`)

```
src/app/
├── [lang]/                        # Dynamic language routing
│   ├── about/page.tsx            # About page
│   ├── jobs/                     # Job listings
│   │   ├── [id]/page.tsx        # Individual job details
│   │   └── page.tsx             # Job listing page
│   ├── onboarding/page.tsx       # User onboarding flow
│   ├── profile/page.tsx          # User profile management
│   ├── resources/page.tsx        # Career resources hub
│   ├── verify-otp/page.tsx       # OTP verification
│   ├── layout.tsx               # Language-specific layout
│   └── page.tsx                 # Home page
├── api/                          # API endpoints
│   ├── admin/                   # Admin functionality
│   │   ├── blacklist/route.ts   # User blacklist management
│   │   └── cleanup/route.ts     # System cleanup tasks
│   └── auth/                    # Authentication
│       ├── send-otp/route.ts    # Send OTP codes
│       └── verify-otp/route.ts  # Verify OTP codes
├── globals.css                   # Global styles
├── layout.tsx                    # Root layout
├── loading.tsx                   # Loading component
└── page.tsx                      # Main entry point
```

### Components (`src/components/`)

```
src/components/
├── features/                     # Feature-specific components
│   ├── jobs/                    # Job-related components
│   │   ├── enhanced-job-card.tsx
│   │   ├── job-card.tsx
│   │   ├── job-detail.tsx
│   │   ├── job-filter.tsx
│   │   ├── job-filters.tsx
│   │   ├── job-listing-container.tsx
│   │   └── job-listing.tsx
│   ├── onboarding/              # User onboarding components
│   │   ├── CandidatePreferences.tsx
│   │   ├── CompanySetupForm.tsx
│   │   ├── JobMatchPreview.tsx
│   │   ├── JobPostForm.tsx
│   │   ├── LoadingAI.tsx
│   │   ├── PersonalInfoForm.tsx
│   │   ├── ProgressStepper.tsx
│   │   ├── ResumeSummary.tsx
│   │   ├── ResumeUpload.tsx
│   │   ├── RoleSelector.tsx
│   │   └── WelcomeMessage.tsx
│   ├── profile/                 # Profile management components
│   │   ├── EditableAbout.tsx
│   │   ├── EditableCertifications.tsx
│   │   ├── EditableEducation.tsx
│   │   ├── EditableExperience.tsx
│   │   ├── EditableProjects.tsx
│   │   ├── EditableSkills.tsx
│   │   ├── PersonalInfoModal.tsx
│   │   ├── ProfilePictureUpload.tsx
│   │   └── ProfileSidebar.tsx
│   └── resources/               # Career resources components
│       ├── resource-card.tsx
│       ├── resource-filter.tsx
│       ├── resource-highlight.tsx
│       ├── resource-section.tsx
│       ├── resource-topic-badge.tsx
│       └── resources-client.tsx
├── icons/                       # Custom icons
│   └── flag-icons.tsx
├── layout/                      # Layout components
│   ├── footer.tsx
│   ├── nav-client.tsx
│   └── navbar.tsx
├── shared/                      # Reusable components
│   ├── animated-background.tsx
│   ├── company-logo.tsx
│   ├── heart-button.tsx
│   ├── language-toggle.tsx
│   ├── notification-bell.tsx
│   ├── skill-badge.tsx
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
└── ui/                         # UI component library (shadcn/ui)
    ├── accordion.tsx
    ├── alert-dialog.tsx
    ├── alert.tsx
    ├── avatar.tsx
    ├── badge.tsx
    ├── button.tsx
    ├── card.tsx
    ├── dialog.tsx
    ├── input.tsx
    ├── label.tsx
    ├── select.tsx
    ├── table.tsx
    ├── textarea.tsx
    └── ... (other UI components)
```

### Hooks (`src/hooks/`)

```
src/hooks/
├── use-mobile.tsx               # Mobile device detection
├── use-toast.ts                 # Toast notifications
├── use-translations.ts          # Translation system hook
├── useLocalStorage.ts           # Local storage management
└── useScrollDirection.ts        # Scroll direction detection
```

### Library Functions (`src/lib/`)

```
src/lib/
├── blacklist-management.ts      # User blacklist functionality
├── blacklist.ts                 # Blacklist utilities
├── cleanup-service.ts           # System cleanup services
├── dictionary.ts                # Static translation dictionary
├── email.ts                     # Email services
├── openai.ts                    # OpenAI integration
├── otp-final.ts                 # OTP verification system (active)
├── otp-middleware.ts            # OTP middleware
├── rate-limiter.ts              # API rate limiting
├── resources-data.ts            # Career resources data
├── sms.ts                       # SMS services
├── supabase.ts                  # Supabase client configuration
├── translation-manager.ts       # Translation management
├── utils.ts                     # General utilities
└── vectorSearch.ts              # Vector search functionality
```

### Translations (`src/translations/`)

**Modular translation system organized by scope:**

```
src/translations/
├── core/                        # Core application translations
│   ├── en.json
│   ├── zh.json
│   └── index.ts
├── features/                    # Feature-specific translations
│   ├── auth/
│   │   ├── en.json
│   │   └── zh.json
│   └── profile/
│       ├── en.json
│       └── zh.json
└── pages/                       # Page-specific translations
    ├── home/
    │   ├── en.json
    │   └── zh.json
    ├── jobs/
    │   ├── en.json
    │   └── zh.json
    └── resources/
        ├── en.json
        └── zh.json
```

### Test Files (`src/__tests__/`)

```
src/__tests__/
├── api/
│   ├── admin/                   # Admin API tests
│   └── auth/                    # Authentication tests
│       ├── test-email-otp-flow.js
│       ├── test-final-otp.js
│       ├── test-otp-system.js
│       ├── test-updated-otp.js
│       └── test-working-otp.js
├── features/                    # Feature component tests
│   ├── jobs/
│   ├── onboarding/
│   ├── profile/
│   └── resources/
├── lib/                         # Library function tests
│   ├── test-api-only.js
│   ├── test-enhanced-system.js
│   ├── test-full-integration.js
│   ├── test-resend-api.js
│   ├── test-services.js
│   ├── test-user-creation.js
│   └── test-verified-domain.js
└── utils/                       # Utility tests
```

### Types (`src/types/`)

```
src/types/
├── job.ts                       # Job-related type definitions
└── resume.ts                    # Resume-related type definitions
```

### Utilities (`src/utils/`)

```
src/utils/
└── cvParser.ts                  # CV/Resume parsing utilities
```

## Key Features & Architecture

### 1. **Internationalization (i18n)**
- **Dynamic routing**: `[lang]` parameter supports English (`en`) and Chinese (`zh`)
- **Modular translations**: Organized by core, features, and pages
- **Translation manager**: Centralized translation loading and caching

### 2. **Authentication System**
- **Passwordless authentication**: OTP-based via email/SMS
- **Rate limiting**: Protection against abuse
- **Blacklist management**: Admin tools for user management

### 3. **Job Matching Platform**
- **AI-powered matching**: OpenAI integration for job recommendations
- **Vector search**: Advanced job search capabilities
- **Comprehensive filtering**: Location, salary, skills, etc.

### 4. **User Profile Management**
- **Editable sections**: Experience, education, skills, projects
- **Resume upload**: CV parsing and analysis
- **Profile completion**: Progress tracking

### 5. **Career Resources Hub**
- **Multilingual content**: Localized career guidance
- **Content types**: Articles, videos, tools, guides
- **Search & filtering**: Topic-based resource discovery

### 6. **Admin Features**
- **User management**: Blacklist and cleanup tools
- **System maintenance**: Automated cleanup services

## Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Authentication**: Custom OTP system
- **AI Integration**: OpenAI API
- **Email Service**: Resend
- **Animations**: Framer Motion


### Project Refactoring
- ✅ Migrated from root-level components to `src/` structure
- ✅ Implemented modular translation system
- ✅ Reorganized file structure for better maintainability

## Development Guidelines

### File Naming Conventions
- **Components**: PascalCase (e.g., `JobCard.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useTranslations.ts`)
- **Utilities**: camelCase (e.g., `cvParser.ts`)
- **API routes**: `route.ts` in feature folders

### Import Organization
- External libraries first
- Internal components second
- Relative imports last
- Use absolute imports with `@/` alias

### Translation Usage
- Use modular translation system via `useTranslations` hook
- Organize translations by feature/page scope
- Fallback to English if translation missing

## Getting Started

1. **Install dependencies**: `npm install`
2. **Set up environment**: Copy `.env.example` to `.env.local`
3. **Configure Supabase**: Add database credentials
4. **Configure external services**: OpenAI, Resend, etc.
5. **Run development server**: `npm run dev`

## Contributing

When adding new features:
1. Follow the established folder structure
2. Add appropriate translations for multilingual support
3. Include tests for new functionality
4. Update this documentation if structure changes

---

*Last updated: July 2025*
*Project maintained by the Huntier development team*