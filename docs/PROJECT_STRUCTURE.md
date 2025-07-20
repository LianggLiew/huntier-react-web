# 🏗️ Huntier Job App - Project Structure & Development Guidelines

## 📁 Project File Structure

```
huntier-job-app/
├── 📱 app/                          # Next.js App Router (main application)
│   ├── 🌐 [lang]/                   # Internationalization routes (en, zh)
│   │   ├── about/page.tsx           # Static pages
│   │   ├── profile/page.tsx         # User profile management
│   │   ├── resources/page.tsx       # Job resources
│   │   ├── verify-otp/page.tsx      # Authentication pages
│   │   ├── layout.tsx               # Language-specific layout
│   │   └── page.tsx                 # Homepage
│   │
│   ├── 🔌 api/                      # Backend API routes
│   │   └── auth/                    # Authentication endpoints
│   │       ├── send-otp/route.ts    # Send OTP verification
│   │       ├── verify-otp/route.ts  # Verify OTP & create session
│   │       ├── refresh/route.ts     # Token refresh
│   │       └── logout/route.ts      # User logout
│   │
│   ├── globals.css                  # Global styles
│   ├── layout.tsx                   # Root layout
│   ├── loading.tsx                  # Global loading component
│   └── page.tsx                     # Root redirect page
│
├── 🧩 components/                   # Reusable UI components
│   ├── 🎨 ui/                       # Base UI components (shadcn/ui)
│   │   ├── button.tsx               # Button component
│   │   ├── card.tsx                 # Card layouts
│   │   ├── input.tsx                # Form inputs
│   │   ├── toast.tsx                # Notifications
│   │   └── [other-ui-components]    # All UI primitives
│   │
│   ├── 🔧 Business Components       # Feature-specific components
│   │   ├── animated-background.tsx  # Landing page animations
│   │   ├── job-card.tsx             # Job listing display
│   │   ├── navbar.tsx               # Navigation bar
│   │   ├── footer.tsx               # Site footer
│   │   ├── logout-button.tsx        # Authentication components
│   │   └── language-toggle.tsx      # Internationalization
│   │
│   └── 📋 onboarding/               # User onboarding flow
│       ├── RoleSelector.tsx         # User type selection
│       ├── ResumeUpload.tsx         # CV upload component
│       └── [other-onboarding]       # Onboarding steps
│
├── 🛠️ lib/                          # Shared utilities & configurations
│   ├── 🗃️ supabase.ts               # Database client & helpers
│   ├── 🔐 jwt.ts                    # Token management
│   ├── 🌍 dictionary.ts             # Internationalization
│   ├── 🎨 utils.ts                  # Common utilities (cn, etc.)
│   ├── 🔍 vectorSearch.ts           # Search functionality
│   └── 📧 auth-context.tsx          # Authentication state management
│
├── 🌐 dictionaries/                 # Translation files
│   ├── en.json                      # English translations
│   └── zh.json                      # Chinese translations
│
├── 🎣 hooks/                        # Custom React hooks
│   ├── use-mobile.tsx               # Mobile device detection
│   └── use-toast.ts                 # Toast notifications
│
├── 📄 types/                        # TypeScript type definitions
│   └── resume.ts                    # Resume/CV related types
│
├── 🛠️ utils/                        # Utility functions
│   └── cvParser.ts                  # CV parsing logic
│
├── 🖼️ public/                       # Static assets
│   ├── hero.png                     # Landing page images
│   ├── placeholder-logo.svg         # Logo assets
│   └── [other-assets]               # Icons, images, etc.
│
├── 📊 Database Schema               # Database documentation
│   └── supabase-schema.sql          # Database table definitions
│
├── 🧪 Testing & Documentation       # Development tools
│   ├── test-auth.js                 # API testing scripts
│   ├── test-supabase.js             # Database connection tests
│   ├── AUTHENTICATION_SETUP.md     # Setup documentation
│   └── PROJECT_STRUCTURE.md         # This file
│
└── ⚙️ Configuration Files
    ├── package.json                 # Dependencies & scripts
    ├── tsconfig.json                # TypeScript configuration
    ├── tailwind.config.js           # Styling configuration
    ├── next.config.ts               # Next.js configuration
    ├── middleware.ts                # Request middleware
    ├── .env.local.example           # Environment template
    └── .env.local                   # Environment variables (gitignored)
```

## 🎯 Folder Organization Principles

### **1. Feature-Based Organization**
```
✅ Group related files together
✅ Easy to find and modify features
✅ Scalable as app grows
```

**Example**: All authentication files are grouped:
- API routes: `app/api/auth/`
- UI components: `components/logout-button.tsx`
- Utilities: `lib/jwt.ts`, `lib/auth-context.tsx`

### **2. Separation of Concerns**
```
📱 app/          → Pages & routing
🧩 components/   → UI components
🛠️ lib/          → Business logic
🌐 dictionaries/ → Content/translations
```

### **3. Scalability Considerations**
```
🔍 Easy to locate files
🧩 Reusable components
🛠️ Shared utilities
📊 Clear data flow
```

## 📝 Naming Conventions

### **Files & Folders**
```typescript
// ✅ Good naming examples
kebab-case-files.tsx        // Multi-word files
PascalCaseComponents.tsx     // React components
camelCaseUtils.ts           // Utility functions
lowercase-folders/          // Folder names

// ❌ Avoid
snake_case_files.tsx
UPPERCASE_FILES.tsx
Mixed-Cases/folders
```

### **Components**
```typescript
// ✅ Component naming
export function JobCard() {}           // PascalCase
export function NavClient() {}         // Descriptive names
export function LogoutButton() {}      // Action + Element

// ✅ File structure
components/
├── ui/button.tsx              // Base UI components
├── job-card.tsx               // Feature components  
└── onboarding/                // Feature grouping
    └── RoleSelector.tsx
```

### **API Routes**
```typescript
// ✅ RESTful API structure
app/api/
├── auth/
│   ├── send-otp/route.ts      // POST /api/auth/send-otp
│   ├── verify-otp/route.ts    // POST /api/auth/verify-otp
│   └── refresh/route.ts       // POST /api/auth/refresh
│
└── jobs/
    ├── route.ts               // GET/POST /api/jobs
    └── [id]/route.ts          // GET/PUT/DELETE /api/jobs/:id
```

### **Database & Types**
```typescript
// ✅ Database naming
interface User {               // PascalCase interfaces
  id: string                   // camelCase properties
  created_at: string          // snake_case for DB columns (Supabase convention)
}

// ✅ Database helpers
export const dbHelpers = {
  findUser,                   // camelCase function names
  createUser,
  verifyOTP
}
```

## 🔄 Development Workflow

### **1. Adding New Features**
```bash
# 1. Plan the feature
mkdir components/new-feature
touch components/new-feature/NewComponent.tsx

# 2. Create types if needed
touch types/new-feature.ts

# 3. Add API routes if needed
mkdir app/api/new-feature
touch app/api/new-feature/route.ts

# 4. Add utilities if needed
touch lib/new-feature-utils.ts

# 5. Update documentation
# Update this file with new structure
```

### **2. Code Organization Rules**

#### **Components**
```typescript
// ✅ Component file structure
'use client'  // Client directive if needed

import { ... } from 'react'
import { ... } from 'next/...'
import { ... } from '@/components/ui/...'  // UI components
import { ... } from '@/lib/...'            // Utilities
import { ... } from '@/types/...'          // Types

// Types/interfaces
interface ComponentProps { ... }

// Main component
export function ComponentName({ ...props }: ComponentProps) {
  // State and logic
  
  return (
    // JSX
  )
}

// Default export if needed
export default ComponentName
```

#### **API Routes**
```typescript
// ✅ API route file structure
import { NextRequest, NextResponse } from 'next/server'
import { ... } from '@/lib/...'  // Utilities
import { z } from 'zod'          // Validation

// Input validation schema
const requestSchema = z.object({ ... })

// Main handler
export async function POST(request: NextRequest) {
  try {
    // Validation
    // Business logic
    // Response
  } catch (error) {
    // Error handling
  }
}

// Other HTTP methods
export async function GET() { ... }
```

#### **Utilities**
```typescript
// ✅ Utility file structure
/**
 * Utility description
 * Purpose and usage explanation
 */

import { ... } from 'external-libs'

// Types/interfaces
export interface UtilityType { ... }

// Main utilities object or functions
export const utilityName = {
  method1() { ... },
  method2() { ... }
}

// Or individual exports
export function utilityFunction() { ... }
```

### **3. Import Organization**
```typescript
// ✅ Import order
// 1. React & Next.js
import React from 'react'
import { NextRequest } from 'next/server'

// 2. External libraries
import { z } from 'zod'
import jwt from 'jsonwebtoken'

// 3. Internal components (UI first)
import { Button } from '@/components/ui/button'
import { JobCard } from '@/components/job-card'

// 4. Internal utilities & types
import { dbHelpers } from '@/lib/supabase'
import { jwtUtils } from '@/lib/jwt'
import type { User } from '@/types/user'
```

## 🛡️ Code Quality Standards

### **TypeScript Usage**
```typescript
// ✅ Always use TypeScript
export interface Props {
  title: string
  count?: number  // Optional properties
}

// ✅ Proper typing
const users: User[] = await dbHelpers.findUsers()

// ❌ Avoid 'any'
const data: any = await fetch()  // Bad
```

### **Error Handling**
```typescript
// ✅ Proper error handling
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.error('Specific error context:', error)
  return null  // or appropriate fallback
}
```

### **Comments & Documentation**
```typescript
/**
 * Function/component description
 * @param param1 - Description of parameter
 * @returns Description of return value
 */
export function utilityFunction(param1: string): boolean {
  // Implementation comments for complex logic
  return true
}
```

## 🌟 Benefits of This Structure

### **For Team Development**
1. **🔍 Predictable**: Developers know where to find files
2. **🧩 Modular**: Easy to work on features independently  
3. **🔄 Scalable**: Structure grows with the application
4. **🛠️ Maintainable**: Clear separation of concerns
5. **📚 Documented**: Each part has clear purpose

### **For Code Quality**
1. **🎯 Consistency**: Same patterns everywhere
2. **🔒 Type Safety**: Full TypeScript coverage
3. **♻️ Reusability**: Shared components and utilities
4. **🧪 Testability**: Clear separation makes testing easier

### **For Future Features**
1. **⚡ Fast Development**: Clear patterns to follow
2. **🔗 Easy Integration**: New features fit existing structure
3. **📊 Clear Data Flow**: Authentication → API → Database
4. **🌐 Internationalization Ready**: Built-in i18n support

This structure ensures your team can develop efficiently and maintainably as the project scales!