# 🧭 Onboarding System Instructions for Copilot

## 📁 Directory Structure

Create the following folder structure inside your `app` directory:

/app
/[lang]
/onboarding
/job-seeker
page.tsx
/recruiter
page.tsx


Create a components folder:

/components
/onboarding
WelcomeMessage.tsx
RoleSelector.tsx
ResumeUpload.tsx
ResumeSummary.tsx
JobMatchPreview.tsx
CompanySetupForm.tsx
JobPostForm.tsx
CandidatePreferences.tsx


---

## 👤 Job Seeker Flow (`/[lang]/onboarding/job-seeker/page.tsx`)

### 1. `WelcomeMessage.tsx`
- Shows a friendly greeting:
  > "👋 Welcome! I’m your AI career assistant. Let’s build your future together."
- Include a `Get Started` button

### 2. `RoleSelector.tsx`
- Dropdown to select desired roles
- Auto-suggest via OpenAI if available

### 3. `ResumeUpload.tsx`
- Drag-and-drop area to upload `.pdf` or `.docx`
- Option to paste LinkedIn profile link

### 4. `ResumeSummary.tsx`
- Show extracted data (Name, Experience, Skills)
- Make fields editable

### 5. `JobMatchPreview.tsx`
- Display AI job suggestions with match % (e.g., 82% fit)
- Include CTA: `View Profile`

---

## 💼 Recruiter Flow (`/[lang]/onboarding/recruiter/page.tsx`)

### 1. `WelcomeMessage.tsx` (reuse)
- Greeting:  
  > "👋 Welcome! Let’s find your next top hire — faster and smarter."

### 2. `CompanySetupForm.tsx`
- Fields: Company Name, Industry, Logo Upload

### 3. `JobPostForm.tsx`
- Fields: Job Title, Description, Location, Skills
- Add "AI Suggest" button for auto-filled templates

### 4. `CandidatePreferences.tsx`
- Fields: Experience, Languages, Timezone, Skills
- Show "Top Matches Preview" if possible

---

## ✅ Component Behavior Tips

- Use `react-hook-form` + `zod` for validation
- Animate transitions using `framer-motion`
- Style with `Tailwind CSS`
- Store local step progress in state (`useState` or `zustand`)

---

## 🧪 Optional Enhancements

- Add a `ProgressStepper.tsx` component to show current step
- Include a `Skip` button for optional fields
- Create a `LoadingAI.tsx` animation component while parsing CV or generating matches

---

## 📦 Shared Utility Suggestions

- `utils/cvParser.ts`: to handle PDF/DOCX parsing
- `lib/openai.ts`: API calls for job title suggestions or LLM-based tasks
- `lib/vectorSearch.ts`: handle vector-based job matching

---

Let me know if you want Copilot prompt comments added to the top of each file like:

```tsx
// Copilot: This component renders a drag-and-drop upload for resumes (.pdf/.docx)
