/**
 * Integration Tests for Application Formatters
 * ===========================================
 * 
 * Integration tests that verify the formatter utilities work correctly
 * with real-world scenarios, edge cases, and error conditions.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  formatJobApplication,
  formatJobApplications,
  validatePersonalInfoFields,
  type RawApplicationData
} from '@/utils/applicationFormatters'
import {
  mockCompleteRawApplication,
  mockMinimalRawApplication,
  mockSpecialCharsRawApplication,
  mockApplicationsByStatus,
  generateLargeApplicationDataset,
  createMockApplication
} from '../fixtures/applicationData'

describe('Application Formatters Integration Tests', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
  })

  describe('Real-world Data Scenarios', () => {
    it('should handle applications from different database versions', () => {
      // Simulate old database schema without some fields
      const oldSchemaApp = {
        ...mockCompleteRawApplication,
        // Remove some newer fields that might not exist in older records
        nationality: null,
        applicant_wechat_id: null,
        custom_resume_url: null
      }

      const result = formatJobApplication(oldSchemaApp)

      expect(result.nationality).toBeNull()
      expect(result.applicantWechatId).toBeNull()
      expect(result.customResumeUrl).toBeNull()
      expect(result.applicantFirstName).toBe('John') // Core fields should still work
    })

    it('should handle applications with corrupted job data', () => {
      const corruptedJobApp = {
        ...mockCompleteRawApplication,
        jobs: {
          job_id: null,
          id: null,
          title: '',
          location: '',
          employment_type: '',
          companies: null
        }
      }

      const result = formatJobApplication(corruptedJobApp)

      expect(result.job?.jobId).toBe(789) // Should fallback to main job_id
      expect(result.job?.title).toBe('')
      expect(result.job?.company.name).toBe('Unknown Company')
    })

    it('should handle applications with mixed character encodings', () => {
      const mixedEncodingApp = {
        ...mockSpecialCharsRawApplication,
        applicant_first_name: 'José', // Spanish
        applicant_last_name: '田中', // Japanese
        nationality: 'Российская Федерация', // Russian
        applicant_wechat_id: 'user_测试_2025', // Chinese mixed with English
        jobs: {
          job_id: 777,
          title: 'Développeur Full-Stack', // French
          location: 'Zürich, Schweiz', // German with umlaut
          employment_type: 'Vollzeit',
          companies: {
            name: 'Société Internationale S.A.',
            logo_url: 'https://example.com/logos/société.png'
          }
        }
      }

      const result = formatJobApplication(mixedEncodingApp)

      expect(result.applicantFirstName).toBe('José')
      expect(result.applicantLastName).toBe('田中')
      expect(result.nationality).toBe('Российская Федерация')
      expect(result.job?.title).toBe('Développeur Full-Stack')
      expect(result.job?.location).toBe('Zürich, Schweiz')
    })
  })

  describe('Error Recovery and Resilience', () => {
    it('should handle malformed date strings gracefully', () => {
      const malformedDateApp = {
        ...mockCompleteRawApplication,
        applied_at: 'invalid-date-string',
        updated_at: '2025-13-45T25:70:00Z' // Invalid date components
      }

      const result = formatJobApplication(malformedDateApp)

      // Should pass through the values as-is, letting the consuming code handle validation
      expect(result.appliedAt).toBe('invalid-date-string')
      expect(result.updatedAt).toBe('2025-13-45T25:70:00Z')
    })

    it('should handle extremely nested object structures', () => {
      const deeplyNestedApp = {
        ...mockCompleteRawApplication,
        jobs: {
          job_id: 789,
          title: 'Test Job',
          location: 'Test Location',
          employment_type: 'Full-time',
          companies: {
            name: 'Test Company',
            logo_url: 'https://example.com/logo.png',
            // Additional nested data that might be ignored
            extra_nested_data: {
              level1: {
                level2: {
                  level3: 'deep value'
                }
              }
            }
          }
        }
      }

      const result = formatJobApplication(deeplyNestedApp)

      expect(result.job?.company.name).toBe('Test Company')
      expect(result.job?.company.logoUrl).toBe('https://example.com/logo.png')
      // Should not include extra nested data
      expect(result.job?.company).not.toHaveProperty('extra_nested_data')
    })

    it('should handle circular references safely', () => {
      const circularApp = { ...mockCompleteRawApplication }
      
      // Create circular reference (this would be unusual but could happen)
      const circularJobs = {
        job_id: 789,
        title: 'Test Job',
        location: 'Test Location',
        employment_type: 'Full-time',
        companies: {
          name: 'Test Company',
          logo_url: 'https://example.com/logo.png'
        }
      }
      
      // Add circular reference
      ;(circularJobs as any).self_reference = circularJobs
      circularApp.jobs = circularJobs

      // Should not throw an error
      expect(() => {
        const result = formatJobApplication(circularApp)
        expect(result.job?.title).toBe('Test Job')
      }).not.toThrow()
    })
  })

  describe('Performance Under Load', () => {
    it('should handle large datasets efficiently', () => {
      const largeDataset = generateLargeApplicationDataset(1000)
      
      const startTime = performance.now()
      const results = formatJobApplications(largeDataset)
      const endTime = performance.now()
      
      const processingTime = endTime - startTime
      
      expect(results).toHaveLength(1000)
      expect(processingTime).toBeLessThan(500) // Should process 1000 items in under 500ms
      
      // Verify random samples are formatted correctly
      const randomIndex = Math.floor(Math.random() * 1000)
      expect(results[randomIndex].id).toBe(`app-perf-test-${randomIndex}`)
      expect(results[randomIndex].applicantFirstName).toBe(`TestUser${randomIndex}`)
    })

    it('should handle memory efficiently with large objects', () => {
      const largeStringContent = 'A'.repeat(100000) // 100KB string
      const largeObjectApp = createMockApplication({
        cover_letter: largeStringContent,
        applicant_first_name: 'User with large data'
      })

      const result = formatJobApplication(largeObjectApp)

      expect(result.coverLetter).toHaveLength(100000)
      expect(result.applicantFirstName).toBe('User with large data')
    })
  })

  describe('Data Consistency Validation', () => {
    it('should maintain referential integrity across related data', () => {
      const app = mockCompleteRawApplication
      const result = formatJobApplication(app)

      // Job ID should be consistent
      expect(result.jobId).toBe(app.job_id)
      expect(result.job?.jobId).toBe(app.jobs?.job_id)

      // User ID should be consistent
      expect(result.userId).toBe(app.user_id)

      // Timestamps should match
      expect(result.appliedAt).toBe(app.applied_at)
      expect(result.updatedAt).toBe(app.updated_at)
    })

    it('should validate all status transitions', () => {
      Object.entries(mockApplicationsByStatus).forEach(([status, app]) => {
        const result = formatJobApplication(app)
        const validation = validatePersonalInfoFields(result)

        expect(result.status).toBe(status)
        expect(validation.isValid).toBe(true)
      })
    })

    it('should handle concurrent formatting operations', async () => {
      const concurrentOperations = Array.from({ length: 100 }, (_, i) =>
        Promise.resolve().then(() => {
          const app = createMockApplication({ id: `concurrent-${i}` })
          return formatJobApplication(app)
        })
      )

      const results = await Promise.all(concurrentOperations)

      expect(results).toHaveLength(100)
      results.forEach((result, index) => {
        expect(result.id).toBe(`concurrent-${index}`)
      })
    })
  })

  describe('Backwards Compatibility', () => {
    it('should work with legacy data formats', () => {
      // Simulate older data format that might be missing newer fields
      const legacyApp = {
        id: 'legacy-app-123',
        user_id: 'legacy-user-456',
        job_id: 789,
        status: 'pending',
        cover_letter: 'Legacy cover letter',
        applied_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
        applicant_first_name: 'Legacy',
        applicant_last_name: 'User',
        applicant_phone: '+1-555-000-0000',
        // Missing newer fields
        custom_resume_url: null,
        nationality: null,
        applicant_wechat_id: null,
        jobs: {
          job_id: 789,
          title: 'Legacy Job Title',
          location: 'Legacy Location',
          employment_type: 'Full-time',
          companies: {
            name: 'Legacy Company',
            logo_url: null
          }
        }
      } as RawApplicationData

      const result = formatJobApplication(legacyApp)

      expect(result.id).toBe('legacy-app-123')
      expect(result.applicantFirstName).toBe('Legacy')
      expect(result.nationality).toBeNull()
      expect(result.job?.company.logoUrl).toBeNull()
    })

    it('should handle field type changes gracefully', () => {
      // Simulate data where field types might have changed
      const typeChangedApp = {
        ...mockCompleteRawApplication,
        job_id: '789', // String instead of number
        status: 'PENDING' as any, // Different casing
      }

      const result = formatJobApplication(typeChangedApp)

      expect(result.jobId).toBe('789') // Should preserve the actual value
      expect(result.status).toBe('PENDING') // Should preserve the actual value
    })
  })

  describe('Integration with Type System', () => {
    it('should maintain type safety with strict TypeScript checks', () => {
      const app = mockCompleteRawApplication
      const result = formatJobApplication(app)

      // TypeScript should enforce these types at compile time
      const id: string = result.id
      const userId: string = result.userId
      const jobId: number = result.jobId
      const firstName: string = result.applicantFirstName
      const nationality: string | null = result.nationality

      expect(typeof id).toBe('string')
      expect(typeof userId).toBe('string')
      expect(typeof jobId).toBe('number')
      expect(typeof firstName).toBe('string')
      expect(nationality === null || typeof nationality === 'string').toBe(true)
    })

    it('should work with partial data types', () => {
      // Test with minimal required fields only
      const partialApp: RawApplicationData = {
        id: 'partial-123',
        user_id: 'user-123',
        job_id: 456,
        status: 'pending',
        cover_letter: 'Short letter',
        custom_resume_url: null,
        applied_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z',
        applicant_first_name: 'Test',
        applicant_last_name: 'User',
        applicant_phone: '+1-555-000-0000',
        nationality: null,
        applicant_wechat_id: null,
        jobs: null
      }

      const result = formatJobApplication(partialApp)
      const validation = validatePersonalInfoFields(result)

      expect(result.job).toBeUndefined()
      expect(validation.isValid).toBe(true)
    })
  })
})