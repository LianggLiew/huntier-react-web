/**
 * Test Fixtures for Job Application Data
 * =====================================
 * 
 * Reusable mock data for testing application formatters and API routes.
 * Provides various scenarios: complete data, minimal data, edge cases.
 */

import type { RawApplicationData } from '@/utils/applicationFormatters'
import type { JobApplication, ApplicationStatus } from '@/types/job-application'

/**
 * Complete application with all fields populated
 */
export const mockCompleteRawApplication: RawApplicationData = {
  id: 'app-complete-123',
  user_id: 'user-complete-456',
  job_id: 789,
  status: 'pending',
  cover_letter: 'This is a comprehensive cover letter that demonstrates the applicant\'s strong interest in the position and highlights their relevant experience in software development, project management, and team collaboration.',
  custom_resume_url: 'https://example.com/resumes/john-doe-resume.pdf',
  applied_at: '2025-01-15T10:30:00.000Z',
  updated_at: '2025-01-15T10:30:00.000Z',
  applicant_first_name: 'John',
  applicant_last_name: 'Doe',
  applicant_phone: '+1-555-123-4567',
  nationality: 'American',
  applicant_wechat_id: 'john_wechat_tech',
  jobs: {
    job_id: 789,
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    employment_type: 'Full-time',
    companies: {
      name: 'TechCorp Solutions',
      logo_url: 'https://example.com/logos/techcorp.png'
    }
  }
}

/**
 * Application using alternative job ID field (jobs.id instead of jobs.job_id)
 */
export const mockAltJobIdRawApplication: RawApplicationData = {
  ...mockCompleteRawApplication,
  id: 'app-alt-job-id-456',
  jobs: {
    id: 789, // Using 'id' instead of 'job_id'
    title: 'Frontend Developer',
    location: 'New York, NY',
    employment_type: 'Contract',
    companies: {
      name: 'Digital Agency Inc',
      logo_url: 'https://example.com/logos/digital-agency.png'
    }
  }
}

/**
 * Minimal application with only required fields
 */
export const mockMinimalRawApplication: RawApplicationData = {
  id: 'app-minimal-789',
  user_id: 'user-minimal-012',
  job_id: 999,
  status: 'pending',
  cover_letter: 'Brief but professional cover letter.',
  custom_resume_url: null,
  applied_at: '2025-01-16T14:20:00.000Z',
  updated_at: '2025-01-16T14:20:00.000Z',
  applicant_first_name: 'Jane',
  applicant_last_name: 'Smith',
  applicant_phone: '+1-555-987-6543',
  nationality: null,
  applicant_wechat_id: null,
  jobs: null
}

/**
 * Application with missing company data
 */
export const mockNoCompanyRawApplication: RawApplicationData = {
  ...mockCompleteRawApplication,
  id: 'app-no-company-321',
  jobs: {
    job_id: 555,
    title: 'Backend Developer',
    location: 'Remote',
    employment_type: 'Part-time',
    companies: null
  }
}

/**
 * Application with special characters and edge case data
 */
export const mockSpecialCharsRawApplication: RawApplicationData = {
  ...mockCompleteRawApplication,
  id: 'app-special-chars-666',
  applicant_first_name: "María José O'Connor-Smith",
  applicant_last_name: '李小明',
  applicant_phone: '+86-138-0013-8000',
  nationality: 'Chinese-American',
  applicant_wechat_id: 'wechat_user_李小明_2025',
  cover_letter: 'Cover letter with special chars: ñáéíóú, 中文字符, emoji 🚀, and symbols @#$%^&*()',
  jobs: {
    job_id: 777,
    title: 'Full-Stack Developer (React/Node.js)',
    location: 'Toronto, ON, Canada',
    employment_type: 'Full-time',
    companies: {
      name: 'Global Tech Solutions & Co.',
      logo_url: 'https://cdn.example.com/logos/special-chars-company.svg'
    }
  }
}

/**
 * Array of applications for bulk testing
 */
export const mockApplicationsArray: RawApplicationData[] = [
  mockCompleteRawApplication,
  mockMinimalRawApplication,
  mockAltJobIdRawApplication,
  mockNoCompanyRawApplication
]

/**
 * Applications with different statuses
 */
export const mockApplicationsByStatus: Record<ApplicationStatus, RawApplicationData> = {
  pending: {
    ...mockCompleteRawApplication,
    id: 'app-pending',
    status: 'pending'
  },
  reviewing: {
    ...mockCompleteRawApplication,
    id: 'app-reviewing',
    status: 'reviewing'
  },
  interviewed: {
    ...mockCompleteRawApplication,
    id: 'app-interviewed', 
    status: 'interviewed'
  },
  accepted: {
    ...mockCompleteRawApplication,
    id: 'app-accepted',
    status: 'accepted'
  },
  rejected: {
    ...mockCompleteRawApplication,
    id: 'app-rejected',
    status: 'rejected'
  }
}

/**
 * Expected formatted JobApplication for complete raw application
 */
export const expectedCompleteJobApplication: JobApplication = {
  id: 'app-complete-123',
  userId: 'user-complete-456',
  jobId: 789,
  status: 'pending',
  coverLetter: 'This is a comprehensive cover letter that demonstrates the applicant\'s strong interest in the position and highlights their relevant experience in software development, project management, and team collaboration.',
  customResumeUrl: 'https://example.com/resumes/john-doe-resume.pdf',
  appliedAt: '2025-01-15T10:30:00.000Z',
  updatedAt: '2025-01-15T10:30:00.000Z',
  applicantFirstName: 'John',
  applicantLastName: 'Doe',
  applicantPhone: '+1-555-123-4567',
  nationality: 'American',
  applicantWechatId: 'john_wechat_tech',
  job: {
    jobId: 789,
    title: 'Senior Software Engineer',
    location: 'San Francisco, CA',
    employmentType: 'Full-time',
    company: {
      name: 'TechCorp Solutions',
      logoUrl: 'https://example.com/logos/techcorp.png'
    }
  }
}

/**
 * Expected formatted JobApplication for minimal raw application
 */
export const expectedMinimalJobApplication: JobApplication = {
  id: 'app-minimal-789',
  userId: 'user-minimal-012',
  jobId: 999,
  status: 'pending',
  coverLetter: 'Brief but professional cover letter.',
  customResumeUrl: null,
  appliedAt: '2025-01-16T14:20:00.000Z',
  updatedAt: '2025-01-16T14:20:00.000Z',
  applicantFirstName: 'Jane',
  applicantLastName: 'Smith',
  applicantPhone: '+1-555-987-6543',
  nationality: null,
  applicantWechatId: null,
  job: undefined
}

/**
 * Utility function to create application with custom fields
 */
export function createMockApplication(overrides: Partial<RawApplicationData> = {}): RawApplicationData {
  return {
    ...mockCompleteRawApplication,
    ...overrides,
    // Ensure nested objects are properly merged
    jobs: overrides.jobs ? {
      ...mockCompleteRawApplication.jobs!,
      ...overrides.jobs
    } : mockCompleteRawApplication.jobs
  }
}

/**
 * Generate large dataset for performance testing
 */
export function generateLargeApplicationDataset(count: number): RawApplicationData[] {
  return Array.from({ length: count }, (_, index) =>
    createMockApplication({
      id: `app-perf-test-${index}`,
      user_id: `user-perf-test-${index}`,
      job_id: 1000 + index,
      applicant_first_name: `TestUser${index}`,
      applicant_last_name: `LastName${index}`,
      applicant_phone: `+1-555-${String(index).padStart(7, '0')}`,
    })
  )
}