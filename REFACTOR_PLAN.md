# Project Structure Refactor Plan

## Overview
This document outlines the step-by-step plan to safely refactor the project structure based on the proposed layout in `project_structure_refactor.png`.

## Current vs Proposed Structure

### Current Structure Analysis:
```
components/
├── jobs/ (already exists - good!)
├── onboarding/ (already exists - good!)
├── profile/ (already exists - good!)
├── ui/ (keep as-is)
├── icons/ (keep as-is)
└── [various loose components]
```

### Key Changes Needed:
- Create `src/` directory and move everything inside
- Create `components/layout/` and move navbar, footer, nav-client
- Create `components/shared/` and move reusable components
- Move `components/features/` and organize existing feature folders
- Reorganize `lib/` into proposed structure
- Keep `components/ui/` as-is (already well organized)

## Safety Measures
- ✅ Create backup branch before starting
- ✅ Move files incrementally, not all at once
- ✅ Test after each major change
- ✅ Update imports systematically
- ✅ Maintain git history with `git mv`

## Refactor Steps

### Phase 1: Preparation
- [ ] **Analyze dependencies**: Map all current imports/exports
- [ ] **Create safety branch**: `git checkout -b refactor-backup`
- [ ] **Document current structure**: Create dependency map

### Phase 2: Directory Structure Setup
- [ ] **Create src directory structure**:
  ```
  src/
  ├── app/ (move from root)
  ├── components/
  │   ├── ui/ (move existing)
  │   ├── layout/
  │   ├── shared/
  │   └── features/
  │       ├── jobs/ (move existing)
  │       ├── onboarding/ (move existing)
  │       ├── profile/ (move existing)
  │       └── resources/
  ├── lib/ (move existing and reorganize)
  ├── hooks/ (move existing)
  ├── types/ (move existing)
  └── utils/ (move existing)
  ```

### Phase 3: Move Files (Incremental)
- [ ] **Step 1: Create src/ and move major directories**
  - Create `src/` directory
  - Move `app/` → `src/app/`
  - Move `lib/` → `src/lib/`
  - Move `hooks/` → `src/hooks/`
  - Move `types/` → `src/types/`
  - Move `utils/` → `src/utils/`

- [ ] **Step 2: Reorganize components**
  - Create `src/components/layout/`
  - Move `navbar.tsx`, `footer.tsx`, `nav-client.tsx` → `src/components/layout/`
  - Create `src/components/shared/`
  - Move shared components → `src/components/shared/`
  - Create `src/components/features/`
  - Move existing feature folders → `src/components/features/`

- [ ] **Step 3: Move remaining components**
  - Move `components/ui/` → `src/components/ui/`
  - Move resource-related components → `src/components/features/resources/`
  - Move any remaining loose components to appropriate locations

### Phase 4: Update References
- [ ] **Update Next.js configuration**:
  - Update `next.config.ts` if needed
  - Update `tsconfig.json` paths (add src to baseUrl)
  
- [ ] **Update import statements systematically**:
  - All `@/components/navbar` → `@/src/components/layout/navbar`
  - All `@/components/footer` → `@/src/components/layout/footer`
  - All `@/components/theme-toggle` → `@/src/components/shared/theme-toggle`
  - All `@/components/jobs/*` → `@/src/components/features/jobs/*`
  - All `@/components/onboarding/*` → `@/src/components/features/onboarding/*`
  - All `@/components/profile/*` → `@/src/components/features/profile/*`
  - All resource components → `@/src/components/features/resources/*`
  - All `@/components/ui/*` → `@/src/components/ui/*`

- [ ] **Critical files to update**:
  - `app/layout.tsx` (ThemeProvider, TooltipProvider)
  - `app/[lang]/layout.tsx` (Footer)
  - `app/[lang]/page.tsx` (Button, AnimatedBackground, Navbar)
  - All page files in `app/[lang]/*/page.tsx`

### Phase 5: Validation
- [ ] **Test each moved component** individually
- [ ] **Run development server** and verify all pages load
- [ ] **Run tests** (if test suite exists)
- [ ] **Check for TypeScript errors**
- [ ] **Verify build process** works correctly

### Phase 6: Cleanup
- [ ] **Remove empty directories**
- [ ] **Update documentation** (README, etc.)
- [ ] **Create index.ts files** for clean imports if needed

## File Movement Mapping

### Layout Components (to `src/components/layout/`)
```
navbar.tsx → src/components/layout/navbar.tsx
footer.tsx → src/components/layout/footer.tsx
nav-client.tsx → src/components/layout/nav-client.tsx
```

### Shared Components (to `src/components/shared/`)
```
theme-toggle.tsx → src/components/shared/theme-toggle.tsx
language-toggle.tsx → src/components/shared/language-toggle.tsx
notification-bell.tsx → src/components/shared/notification-bell.tsx
theme-provider.tsx → src/components/shared/theme-provider.tsx
animated-background.tsx → src/components/shared/animated-background.tsx
company-logo.tsx → src/components/shared/company-logo.tsx
heart-button.tsx → src/components/shared/heart-button.tsx
skill-badge.tsx → src/components/shared/skill-badge.tsx
```

### Feature Components (already organized, just move to features/)
```
components/jobs/ → src/components/features/jobs/
components/onboarding/ → src/components/features/onboarding/
components/profile/ → src/components/features/profile/
```

### Resources Components (to `src/components/features/resources/`)
```
resource-card.tsx → src/components/features/resources/resource-card.tsx
resource-filter.tsx → src/components/features/resources/resource-filter.tsx
resource-highlight.tsx → src/components/features/resources/resource-highlight.tsx
resource-section.tsx → src/components/features/resources/resource-section.tsx
resource-topic-badge.tsx → src/components/features/resources/resource-topic-badge.tsx
resources-client.tsx → src/components/features/resources/resources-client.tsx
```

### Keep as-is (just move location)
```
components/ui/ → src/components/ui/
components/icons/ → src/components/icons/
```

## Testing Checklist
After each phase:
- [ ] Development server starts without errors
- [ ] All pages render correctly
- [ ] No broken imports or missing modules
- [ ] TypeScript compiles successfully
- [ ] All features work as expected

## Rollback Plan
If issues arise:
1. `git checkout main` to return to original state
2. Analyze what went wrong
3. Fix issues on refactor branch
4. Resume refactoring process

## Notes
- Use `git mv` command to preserve file history
- Test incrementally, don't move everything at once
- Update imports immediately after moving files
- Keep original structure intact until refactor is complete and tested

## Current Import Dependencies Analysis

### Files importing from @/components/:
- `app/layout.tsx` → theme-provider, ui/tooltip
- `app/[lang]/layout.tsx` → footer
- `app/[lang]/page.tsx` → ui/button, animated-background, navbar
- `app/[lang]/jobs/page.tsx` → ui/navigation-sidebar, jobs/*
- `app/[lang]/about/page.tsx` → ui/*, navbar
- `app/[lang]/onboarding/page.tsx` → ui/*, onboarding/*
- `app/[lang]/profile/page.tsx` → ui/*, profile/*
- `app/[lang]/verify-otp/page.tsx` → ui/*, animated-background
- `components/*.tsx` → Heavy usage of ui/* throughout
- `components/navbar.tsx` → Multiple shared components (theme-toggle, language-toggle, etc.)

### Critical Dependencies to Update:
1. **Layout Components**: navbar, footer, nav-client (used in multiple pages)
2. **Shared Components**: theme-toggle, language-toggle, notification-bell, animated-background
3. **Feature Components**: jobs/*, onboarding/*, profile/*
4. **UI Components**: All ui/* imports (most frequent)

---
**Status**: Phase 1 Complete - Ready for Phase 2
**Started**: 2025-07-26
**Phase 1 Completed**: 2025-07-26