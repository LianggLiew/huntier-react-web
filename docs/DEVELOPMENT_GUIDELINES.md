# 👥 Team Development Guidelines

## 🚀 Quick Start for New Developers

### **1. Environment Setup**
```bash
# Clone and setup
git clone [repository-url]
cd huntier-job-app
npm install

# Environment setup
cp .env.local.example .env.local
# Fill in your API keys (ask team lead for values)

# Start development
npm run dev
```

### **2. Before Making Changes**
```bash
# Always pull latest changes
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name
```

### **3. Development Workflow**
```bash
# Make your changes following the structure guidelines
# Test your changes locally
npm run dev

# Commit your changes
git add .
git commit -m "feat: add user profile management"
git push origin feature/your-feature-name

# Create pull request
```

## 📋 Development Standards

### **Code Review Checklist**
Before submitting a PR, ensure:

#### **✅ Structure & Organization**
- [ ] Files are in correct folders according to PROJECT_STRUCTURE.md
- [ ] Naming conventions are followed (kebab-case files, PascalCase components)
- [ ] Related files are grouped together (feature-based organization)

#### **✅ Code Quality**
- [ ] TypeScript is used throughout (no `any` types)
- [ ] Proper error handling with try/catch blocks
- [ ] Functions and components have JSDoc comments
- [ ] Imports are organized (React → External → Internal)

#### **✅ Authentication & Security**
- [ ] All API routes validate input with Zod schemas
- [ ] Sensitive operations use `supabaseAdmin` client
- [ ] JWT tokens are handled securely
- [ ] No secrets exposed in frontend code

#### **✅ Testing**
- [ ] Changes tested locally with `npm run dev`
- [ ] Authentication flow tested if auth-related changes
- [ ] Error cases are handled gracefully

## 🛠️ Common Development Tasks

### **Adding a New Page**
```bash
# 1. Create page file
touch app/[lang]/new-page/page.tsx

# 2. Add to navigation (if needed)
# Edit components/navbar.tsx

# 3. Add translations (if needed)
# Edit dictionaries/en.json and dictionaries/zh.json

# 4. Test in both languages
# http://localhost:3000/en/new-page
# http://localhost:3000/zh/new-page
```

### **Adding a New API Endpoint**
```typescript
// 1. Create API route file
// app/api/new-endpoint/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { dbHelpers } from '@/lib/supabase'

// Input validation
const schema = z.object({
  field: z.string().min(1, 'Field is required')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { field } = schema.parse(body)
    
    // Your logic here
    const result = await dbHelpers.someOperation(field)
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('API error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### **Adding a New Component**
```typescript
// 1. Create component file
// components/feature-name.tsx

'use client'  // Only if using client-side features

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FeatureNameProps {
  title: string
  onAction?: () => void
}

/**
 * FeatureName component description
 * @param title - The title to display
 * @param onAction - Optional callback for actions
 */
export function FeatureName({ title, onAction }: FeatureNameProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleAction = async () => {
    setIsLoading(true)
    try {
      await onAction?.()
    } catch (error) {
      console.error('Action failed:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <Button onClick={handleAction} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Action'}
      </Button>
    </Card>
  )
}
```

### **Adding Database Operations**
```typescript
// 1. Add to lib/supabase.ts in dbHelpers object

/**
 * Description of what this function does
 * @param param - Parameter description
 * @returns What it returns
 */
async newOperation(param: string): Promise<ResultType | null> {
  const { data, error } = await supabaseAdmin
    .from('table_name')
    .select('*')
    .eq('column', param)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error in newOperation:', error)
    return null
  }
  
  return data
}
```

## 🎯 Feature Development Process

### **1. Planning Phase**
- [ ] Understand the requirement clearly
- [ ] Identify which files need changes
- [ ] Plan the database schema changes (if any)
- [ ] Design the API endpoints needed
- [ ] Plan the UI components required

### **2. Implementation Phase**
- [ ] Start with database changes (schema, helpers)
- [ ] Implement API endpoints with proper validation
- [ ] Create/update UI components
- [ ] Add proper error handling
- [ ] Test the complete flow

### **3. Testing Phase**
- [ ] Test happy path (everything works)
- [ ] Test error cases (invalid input, network errors)
- [ ] Test authentication requirements
- [ ] Test in both languages (en/zh)
- [ ] Test responsive design (mobile/desktop)

### **4. Documentation Phase**
- [ ] Update PROJECT_STRUCTURE.md if structure changed
- [ ] Add JSDoc comments to new functions
- [ ] Update API documentation if needed
- [ ] Add setup instructions if environment changes

## 🔒 Security Guidelines

### **Frontend Security**
```typescript
// ✅ Good practices
- Store sensitive tokens in httpOnly cookies
- Use localStorage only for non-sensitive data
- Validate all user inputs
- Handle errors gracefully without exposing internals

// ❌ Avoid
- Storing sensitive data in localStorage
- Exposing API keys in frontend code
- Trusting user input without validation
```

### **Backend Security**
```typescript
// ✅ Good practices
- Always validate input with Zod schemas
- Use supabaseAdmin for database operations
- Implement proper rate limiting
- Log errors without exposing sensitive data

// ❌ Avoid
- Direct database queries without validation
- Exposing detailed error messages to frontend
- Missing authentication checks
```

## 📊 Performance Guidelines

### **Component Performance**
```typescript
// ✅ Optimize heavy components
import { memo, useMemo, useCallback } from 'react'

const HeavyComponent = memo(function HeavyComponent({ data }: Props) {
  const processedData = useMemo(() => {
    return expensiveOperation(data)
  }, [data])
  
  const handleClick = useCallback(() => {
    // Handler logic
  }, [])
  
  return <div>{/* Rendered content */}</div>
})
```

### **API Performance**
```typescript
// ✅ Efficient database queries
- Use specific SELECT fields instead of SELECT *
- Add database indexes for frequent queries
- Implement pagination for large data sets
- Cache frequently accessed data
```

## 🌐 Internationalization (i18n)

### **Adding New Translations**
```json
// 1. Add to dictionaries/en.json
{
  "newFeature": {
    "title": "Feature Title",
    "description": "Feature description"
  }
}

// 2. Add to dictionaries/zh.json
{
  "newFeature": {
    "title": "功能标题",
    "description": "功能描述"
  }
}
```

### **Using Translations in Components**
```typescript
// For pages (server components)
import { getDictionary } from '@/lib/dictionary'

export default function Page({ params: { lang } }: { params: { lang: string } }) {
  const dictionary = getDictionary(lang)
  
  return (
    <div>
      <h1>{dictionary.newFeature.title}</h1>
      <p>{dictionary.newFeature.description}</p>
    </div>
  )
}

// For client components - pass translations as props
```

## 🚨 Common Pitfalls to Avoid

### **1. File Organization**
```bash
❌ Don't put everything in one folder
❌ Don't mix UI components with business logic
❌ Don't create deeply nested folder structures
✅ Follow the established folder structure
✅ Group related files together
✅ Keep components focused and reusable
```

### **2. Authentication**
```typescript
❌ Don't skip input validation in API routes
❌ Don't expose sensitive data in frontend
❌ Don't forget to handle token expiration
✅ Always validate inputs with Zod
✅ Use proper error handling
✅ Implement proper session management
```

### **3. Database Operations**
```typescript
❌ Don't use supabase client for admin operations
❌ Don't skip error handling in database calls
❌ Don't expose detailed database errors to frontend
✅ Use supabaseAdmin for server-side operations
✅ Handle all error cases gracefully
✅ Return user-friendly error messages
```

This structure and these guidelines ensure consistent, maintainable, and scalable development across your team!