# Translation System Guide

This document explains how the translation system works in the Huntier React project and provides guidelines for frontend developers.

## Overview

The project uses a unified translation system based on `dictionary.ts` and the `/src/translations` folder structure. This system supports multiple languages (currently English and Chinese) with proper fallback mechanisms.

## Architecture

### Core Components

1. **`/src/lib/dictionary.ts`** - Central translation loading logic
2. **`/src/translations/`** - Translation files organized by scope
3. **Page/Component Integration** - Different patterns for server/client components

### Translation File Structure

```
src/translations/
├── core/                    # Shared components (navbar, footer, etc.)
│   ├── en.json
│   └── zh.json
├── pages/                   # Page-specific translations
│   ├── home/
│   │   ├── en.json
│   │   └── zh.json
│   ├── jobs/
│   │   ├── en.json
│   │   └── zh.json
│   └── resources/
│       ├── en.json
│       └── zh.json
└── features/               # Feature-specific translations
    ├── profile/
    │   ├── en.json
    │   └── zh.json
    └── auth/
        ├── en.json
        └── zh.json
```

## Dictionary Functions

### `getDictionaryAsync(locale: string)`
- **Use for**: Server components and async client component loading
- **Returns**: Promise<Dictionary>
- **Loads**: Complete translations (core + pages + features)

```typescript
// Server component
export default async function HomePage({ params }) {
  const dictionary = await getDictionaryAsync(params.lang);
  return <div>{dictionary.home.title}</div>;
}
```

### `getCoreTranslations(locale: string)`
- **Use for**: Components that only need core translations (navbar, footer)
- **Returns**: Promise<CoreDictionary>
- **Loads**: Only core translations (faster)

```typescript
// Server component (Footer)
export async function Footer({ lang }) {
  const dictionary = await getCoreTranslations(lang);
  return <footer>{dictionary.footer.copyright}</footer>;
}
```

## Development Guidelines

### 1. Server Components (Recommended)

**✅ Correct Pattern:**
```typescript
// pages/example/page.tsx
import { getDictionaryAsync } from '@/lib/dictionary';

export default async function ExamplePage({ params }) {
  const dictionary = await getDictionaryAsync(params.lang);
  
  return (
    <div>
      <h1>{dictionary.example.title}</h1>
      <p>{dictionary.example.description}</p>
    </div>
  );
}
```

**❌ Incorrect:**
```typescript
// Don't use sync version in server components
const dictionary = getDictionary(params.lang); // Returns empty object!
```

### 2. Client Components

**✅ Correct Pattern:**
```typescript
'use client';
import { useState, useEffect } from 'react';
import { getDictionaryAsync } from '@/lib/dictionary';

export default function ExampleClient({ params }) {
  const [dictionary, setDictionary] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    getDictionaryAsync(params.lang)
      .then(setDictionary)
      .finally(() => setLoading(false));
  }, [params.lang]);
  
  if (loading) return <div>Loading...</div>;
  
  return <div>{dictionary.example?.title}</div>;
}
```

**❌ Incorrect:**
```typescript
// Don't use hooks in server components or sync loading in client components
const dictionary = getDictionary(lang); // Empty object initially!
```

### 3. Component Props Pattern

For components that receive translations from parent:

```typescript
// Parent (Server Component)
export default async function ParentPage({ params }) {
  const dictionary = await getDictionaryAsync(params.lang);
  return <ChildComponent lang={params.lang} dictionary={dictionary} />;
}

// Child (Client Component)
'use client';
interface ChildProps {
  lang: string;
  dictionary: any;
}

export function ChildComponent({ lang, dictionary }: ChildProps) {
  return <div>{dictionary.child?.title}</div>;
}
```

## Translation File Guidelines

### 1. File Organization

- **Core translations** (`/core/`): Navbar, footer, language toggle, navigation
- **Page translations** (`/pages/`): Page-specific content
- **Feature translations** (`/features/`): Reusable feature components

### 2. JSON Structure

**✅ Good Structure:**
```json
{
  "title": "Welcome to Huntier",
  "subtitle": "Find your dream job with AI",
  "buttons": {
    "signUp": "Sign Up",
    "learnMore": "Learn More"
  },
  "features": {
    "aiMatching": "AI-Powered Matching",
    "jobSearch": "Smart Job Search"
  }
}
```

**❌ Avoid Flat Structure:**
```json
{
  "welcomeTitle": "Welcome to Huntier",
  "welcomeSubtitle": "Find your dream job with AI",
  "signUpButton": "Sign Up",
  "learnMoreButton": "Learn More"
}
```

### 3. Key Naming Conventions

- Use **camelCase** for keys
- Group related translations in objects
- Use descriptive names: `buttons.submit` not `btn1`

## Usage Patterns

### Accessing Translations

```typescript
// ✅ Correct - with optional chaining
{dictionary.home?.title}
{dictionary.buttons?.submit}

// ✅ Correct - with fallback
{dictionary.home?.title || 'Default Title'}

// ❌ Incorrect - will crash if undefined
{dictionary.home.title}
```

### Dynamic Content

```typescript
// Using placeholders
{dictionary.welcome?.message?.replace('{name}', userName)}

// Conditional content
{dictionary.nav?.[isAuthenticated ? 'logout' : 'login']}
```

## Common Patterns

### 1. Loading States

```typescript
// Server components - no loading state needed
export default async function Page({ params }) {
  const dictionary = await getDictionaryAsync(params.lang);
  // Dictionary is guaranteed to be loaded
}

// Client components - always handle loading
if (loading) return <LoadingSpinner />;
```

### 2. Error Handling

```typescript
useEffect(() => {
  getDictionaryAsync(lang)
    .then(setDictionary)
    .catch(error => {
      console.error('Translation loading failed:', error);
      setDictionary({}); // Fallback to empty object
    })
    .finally(() => setLoading(false));
}, [lang]);
```

### 3. TypeScript Integration

```typescript
interface Dictionary {
  home: {
    title: string;
    subtitle: string;
  };
  buttons: {
    submit: string;
    cancel: string;
  };
}

// Use typed dictionary for better DX
const dictionary: Dictionary = await getDictionaryAsync(lang);
```

## Best Practices

### ✅ Do's

1. **Always use async loading** (`getDictionaryAsync` or `getCoreTranslations`)
2. **Use optional chaining** (`dictionary.home?.title`)
3. **Handle loading states** in client components
4. **Organize translations logically** by feature/page
5. **Use server components** when possible for better performance
6. **Provide fallbacks** for missing translations

### ❌ Don'ts

1. **Don't use sync `getDictionary()`** - it returns empty objects
2. **Don't access nested properties without optional chaining**
3. **Don't hardcode strings** - use translation files
4. **Don't create duplicate translation files**
5. **Don't mix translation systems**
6. **Don't forget loading states** in client components

## Troubleshooting

### Common Issues

1. **"Cannot read properties of undefined"**
   - **Cause**: Accessing translations before they load
   - **Fix**: Use optional chaining or check loading state

2. **Empty translations appearing**
   - **Cause**: Using sync `getDictionary()` 
   - **Fix**: Switch to `getDictionaryAsync()`

3. **Component not re-rendering on language change**
   - **Cause**: Not watching language parameter
   - **Fix**: Add language to useEffect dependencies

### Debug Steps

1. Check if translation files exist in correct locations
2. Verify file paths match the expected structure
3. Ensure proper async/await usage
4. Check browser console for loading errors
5. Verify language parameter is being passed correctly

## Migration Guide

If you're updating existing components:

1. **Server Components**: Replace `getDictionary()` with `await getDictionaryAsync()`
2. **Client Components**: Add state and useEffect for async loading
3. **Add optional chaining**: `dictionary.key` → `dictionary.key?`
4. **Add loading states**: Check `loading` before rendering content

This unified system ensures consistent translation handling across the entire application while providing excellent developer experience and performance.