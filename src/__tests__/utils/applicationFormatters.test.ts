/**
 * Unit Tests for Application Formatters
 * ====================================
 * 
 * Comprehensive tests for the applicationFormatters.ts utility functions.
 * Tests cover normal cases, edge cases, error scenarios, and performance.
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  formatJobApplication,
  formatJobApplications,
  validatePersonalInfoFields,
  APPLICATION_SELECT_FIELDS,
  APPLICATION_SELECT_FIELDS_ALT,
  type RawApplicationData
} from '@/utils/applicationFormatters'
import type { JobApplication, ApplicationStatus } from '@/types/job-application'

describe('applicationFormatters', () => {
  // Test fixtures
  const mockRawApplication: RawApplicationData = {
    id: 'app-123',
    user_id: 'user-456',
    job_id: 789,
    status: 'pending',
    cover_letter: 'This is a test cover letter with sufficient content.',
    custom_resume_url: 'https://example.com/resume.pdf',
    applied_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    applicant_first_name: 'John',
    applicant_last_name: 'Doe',
    applicant_phone: '+1-555-123-4567',
    nationality: 'American',
    applicant_wechat_id: 'john_wechat_123',
    jobs: {
      job_id: 789,
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      employment_type: 'Full-time',
      companies: {
        name: 'Tech Corp',
        logo_url: 'https://example.com/logo.png'
      }
    }
  }

  const mockRawApplicationAltJobId: RawApplicationData = {
    ...mockRawApplication,
    jobs: {
      id: 789, // Using 'id' instead of 'job_id'
      title: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      employment_type: 'Full-time',
      companies: {
        name: 'Tech Corp',
        logo_url: 'https://example.com/logo.png'
      }
    }
  }

  const mockRawApplicationMinimal: RawApplicationData = {
    id: 'app-minimal',
    user_id: 'user-minimal',
    job_id: 999,
    status: 'pending',
    cover_letter: 'Minimal cover letter.',
    custom_resume_url: null,
    applied_at: '2025-01-15T10:30:00Z',
    updated_at: '2025-01-15T10:30:00Z',
    applicant_first_name: 'Jane',
    applicant_last_name: 'Smith',
    applicant_phone: '+1-555-987-6543',
    nationality: null,
    applicant_wechat_id: null,
    jobs: null
  }

  describe('formatJobApplication', () => {
    it('should format a complete application correctly', () => {
      const result = formatJobApplication(mockRawApplication)

      expect(result).toEqual({
        id: 'app-123',
        userId: 'user-456',
        jobId: 789,
        status: 'pending',
        coverLetter: 'This is a test cover letter with sufficient content.',
        customResumeUrl: 'https://example.com/resume.pdf',
        appliedAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
        applicantFirstName: 'John',
        applicantLastName: 'Doe',
        applicantPhone: '+1-555-123-4567',
        nationality: 'American',
        applicantWechatId: 'john_wechat_123',
        job: {
          jobId: 789,
          title: 'Senior Software Engineer',
          location: 'San Francisco, CA',
          employmentType: 'Full-time',
          company: {
            name: 'Tech Corp',
            logoUrl: 'https://example.com/logo.png'
          }
        }
      })
    })

    it('should handle alternative job ID field (jobs.id)', () => {
      const result = formatJobApplication(mockRawApplicationAltJobId)

      expect(result.job?.jobId).toBe(789)
      expect(result.job?.title).toBe('Senior Software Engineer')
    })

    it('should handle minimal application with null values', () => {
      const result = formatJobApplication(mockRawApplicationMinimal)

      expect(result).toEqual({
        id: 'app-minimal',
        userId: 'user-minimal',
        jobId: 999,
        status: 'pending',
        coverLetter: 'Minimal cover letter.',
        customResumeUrl: null,
        appliedAt: '2025-01-15T10:30:00Z',
        updatedAt: '2025-01-15T10:30:00Z',
        applicantFirstName: 'Jane',
        applicantLastName: 'Smith',
        applicantPhone: '+1-555-987-6543',
        nationality: null,
        applicantWechatId: null,
        job: undefined
      })
    })

    it('should handle missing company data', () => {
      const appWithoutCompany: RawApplicationData = {
        ...mockRawApplication,
        jobs: {
          job_id: 789,
          title: 'Software Engineer',
          location: 'Remote',
          employment_type: 'Contract',
          companies: null
        }
      }

      const result = formatJobApplication(appWithoutCompany)

      expect(result.job?.company).toEqual({
        name: 'Unknown Company',
        logoUrl: undefined
      })
    })

    it('should handle all application statuses', () => {
      const statuses: ApplicationStatus[] = ['pending', 'reviewing', 'interviewed', 'accepted', 'rejected']
      
      statuses.forEach(status => {
        const app = { ...mockRawApplication, status }
        const result = formatJobApplication(app)
        expect(result.status).toBe(status)
      })
    })

    it('should preserve all field types correctly', () => {
      const result = formatJobApplication(mockRawApplication)

      expect(typeof result.id).toBe('string')
      expect(typeof result.userId).toBe('string')
      expect(typeof result.jobId).toBe('number')
      expect(typeof result.status).toBe('string')
      expect(typeof result.coverLetter).toBe('string')
      expect(typeof result.appliedAt).toBe('string')
      expect(typeof result.updatedAt).toBe('string')
      expect(typeof result.applicantFirstName).toBe('string')
      expect(typeof result.applicantLastName).toBe('string')
      expect(typeof result.applicantPhone).toBe('string')
    })
  })

  describe('formatJobApplications', () => {
    it('should format an array of applications', () => {
      const rawApplications = [mockRawApplication, mockRawApplicationMinimal]
      const results = formatJobApplications(rawApplications)

      expect(results).toHaveLength(2)
      expect(results[0].id).toBe('app-123')
      expect(results[1].id).toBe('app-minimal')
    })

    it('should handle empty array', () => {
      const results = formatJobApplications([])
      expect(results).toEqual([])
    })

    it('should maintain order of applications', () => {
      const rawApplications = [
        { ...mockRawApplication, id: 'first' },
        { ...mockRawApplication, id: 'second' },
        { ...mockRawApplication, id: 'third' }
      ]
      
      const results = formatJobApplications(rawApplications)
      
      expect(results[0].id).toBe('first')
      expect(results[1].id).toBe('second')
      expect(results[2].id).toBe('third')
    })
  })

  describe('validatePersonalInfoFields', () => {
    let validApplication: JobApplication

    beforeEach(() => {
      validApplication = formatJobApplication(mockRawApplication)
    })

    it('should validate a complete application', () => {
      const result = validatePersonalInfoFields(validApplication)

      expect(result.isValid).toBe(true)
      expect(result.requiredFields.missing).toEqual([])
      expect(result.requiredFields.present).toEqual([
        'applicantFirstName',
        'applicantLastName', 
        'applicantPhone'
      ])
    })

    it('should detect missing required fields', () => {
      const incompleteApp = {
        ...validApplication,
        applicantFirstName: '',
        applicantPhone: ''
      }

      const result = validatePersonalInfoFields(incompleteApp)

      expect(result.isValid).toBe(false)
      expect(result.requiredFields.missing).toContain('applicantFirstName')
      expect(result.requiredFields.missing).toContain('applicantPhone')
      expect(result.requiredFields.present).toContain('applicantLastName')
    })

    it('should handle optional fields correctly', () => {
      const result = validatePersonalInfoFields(validApplication)

      const nationalityField = result.optionalFields.find(f => f.field === 'nationality')
      const wechatField = result.optionalFields.find(f => f.field === 'applicantWechatId')

      expect(nationalityField?.hasValue).toBe(true)
      expect(wechatField?.hasValue).toBe(true)
    })

    it('should handle missing optional fields', () => {
      const minimalApp = formatJobApplication(mockRawApplicationMinimal)
      const result = validatePersonalInfoFields(minimalApp)

      expect(result.isValid).toBe(true) // Still valid without optional fields
      
      const nationalityField = result.optionalFields.find(f => f.field === 'nationality')
      const wechatField = result.optionalFields.find(f => f.field === 'applicantWechatId')

      expect(nationalityField?.hasValue).toBe(false)
      expect(wechatField?.hasValue).toBe(false)
    })
  })

  describe('SELECT field constants', () => {
    it('should have valid APPLICATION_SELECT_FIELDS constant', () => {
      expect(APPLICATION_SELECT_FIELDS).toContain('applicant_first_name')
      expect(APPLICATION_SELECT_FIELDS).toContain('applicant_last_name')
      expect(APPLICATION_SELECT_FIELDS).toContain('applicant_phone')
      expect(APPLICATION_SELECT_FIELDS).toContain('nationality')
      expect(APPLICATION_SELECT_FIELDS).toContain('applicant_wechat_id')
      expect(APPLICATION_SELECT_FIELDS).toContain('jobs!job_id')
    })

    it('should have valid APPLICATION_SELECT_FIELDS_ALT constant', () => {
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('applicant_first_name')
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('applicant_last_name')
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('applicant_phone')
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('nationality')
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('applicant_wechat_id')
      expect(APPLICATION_SELECT_FIELDS_ALT).toContain('jobs!job_id')
    })
  })

  describe('Edge Cases and Error Handling', () => {
    it('should handle undefined jobs gracefully', () => {
      const appWithUndefinedJobs = {
        ...mockRawApplication,
        jobs: undefined
      }

      const result = formatJobApplication(appWithUndefinedJobs)
      expect(result.job).toBeUndefined()
    })

    it('should handle job ID fallback logic', () => {
      // Test job_id priority over id
      const appWithBothIds = {
        ...mockRawApplication,
        jobs: {
          id: 999,
          job_id: 789,
          title: 'Test Job',
          location: 'Test Location',
          employment_type: 'Full-time',
          companies: null
        }
      }

      const result = formatJobApplication(appWithBothIds)
      expect(result.job?.jobId).toBe(789) // Should prefer job_id
    })

    it('should handle job ID fallback to main job_id', () => {
      const appWithNoJobIds = {
        ...mockRawApplication,
        job_id: 555,
        jobs: {
          title: 'Test Job',
          location: 'Test Location', 
          employment_type: 'Full-time',
          companies: null
        }
      }

      const result = formatJobApplication(appWithNoJobIds)
      expect(result.job?.jobId).toBe(555) // Should fallback to main job_id
    })

    it('should handle extremely long strings', () => {
      const longString = 'a'.repeat(10000)
      const appWithLongStrings = {
        ...mockRawApplication,
        cover_letter: longString,
        applicant_first_name: longString
      }

      const result = formatJobApplication(appWithLongStrings)
      expect(result.coverLetter).toBe(longString)
      expect(result.applicantFirstName).toBe(longString)
    })

    it('should handle special characters in strings', () => {
      const specialChars = "John O'Connor-Smith 中文 🚀 <script>alert('test')</script>"
      const appWithSpecialChars = {
        ...mockRawApplication,
        applicant_first_name: specialChars
      }

      const result = formatJobApplication(appWithSpecialChars)
      expect(result.applicantFirstName).toBe(specialChars)
    })
  })

  describe('Performance Tests', () => {
    it('should format single application quickly', () => {
      const start = performance.now()
      
      for (let i = 0; i < 1000; i++) {
        formatJobApplication(mockRawApplication)
      }
      
      const end = performance.now()
      const avgTime = (end - start) / 1000
      
      expect(avgTime).toBeLessThan(1) // Should average less than 1ms per format
    })

    it('should format array of applications efficiently', () => {
      const applications = Array(100).fill(mockRawApplication)
      
      const start = performance.now()
      const results = formatJobApplications(applications)
      const end = performance.now()
      
      expect(results).toHaveLength(100)
      expect(end - start).toBeLessThan(100) // Should complete in under 100ms
    })
  })
})