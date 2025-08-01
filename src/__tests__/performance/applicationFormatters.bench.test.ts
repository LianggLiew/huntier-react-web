/**
 * Performance Benchmarking Tests for Application Formatters
 * =========================================================
 * 
 * Comprehensive performance tests to ensure the formatter utilities
 * can handle production workloads efficiently.
 */

import { describe, it, expect, beforeAll } from 'vitest'
import {
  formatJobApplication,
  formatJobApplications,
  validatePersonalInfoFields
} from '@/utils/applicationFormatters'
import {
  mockCompleteRawApplication,
  generateLargeApplicationDataset,
  createMockApplication
} from '../fixtures/applicationData'

// Performance test configuration
const PERFORMANCE_THRESHOLDS = {
  single_format_max_ms: 5,           // Single application formatting should take < 5ms
  batch_format_per_item_max_ms: 0.1, // Batch formatting should take < 0.1ms per item
  validation_max_ms: 1,              // Validation should take < 1ms
  memory_growth_max_mb: 50           // Memory growth should be < 50MB for large datasets
}

describe('Application Formatters Performance Benchmarks', () => {
  describe('Single Application Formatting Performance', () => {
    it('should format single application within performance threshold', () => {
      const iterations = 10000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        formatJobApplication(mockCompleteRawApplication)
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime
      const avgTimePerOperation = totalTime / iterations

      console.log(`Single format: ${avgTimePerOperation.toFixed(4)}ms avg (${iterations} iterations)`)
      
      expect(avgTimePerOperation).toBeLessThan(PERFORMANCE_THRESHOLDS.single_format_max_ms)
    })

    it('should handle large application data efficiently', () => {
      const largeApplication = createMockApplication({
        cover_letter: 'A'.repeat(50000), // 50KB cover letter
        applicant_first_name: 'B'.repeat(1000), // 1KB name
        applicant_last_name: 'C'.repeat(1000),
      })

      const iterations = 1000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        formatJobApplication(largeApplication)
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations

      console.log(`Large data format: ${avgTime.toFixed(4)}ms avg`)
      
      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.single_format_max_ms * 2) // Allow 2x threshold for large data
    })
  })

  describe('Batch Formatting Performance', () => {
    it('should format small batches efficiently', () => {
      const batchSizes = [10, 50, 100, 500]

      batchSizes.forEach(size => {
        const applications = generateLargeApplicationDataset(size)
        
        const startTime = performance.now()
        const results = formatJobApplications(applications)
        const endTime = performance.now()

        const totalTime = endTime - startTime
        const timePerItem = totalTime / size

        console.log(`Batch ${size}: ${timePerItem.toFixed(4)}ms per item`)

        expect(results).toHaveLength(size)
        expect(timePerItem).toBeLessThan(PERFORMANCE_THRESHOLDS.batch_format_per_item_max_ms)
      })
    })

    it('should handle large batches without performance degradation', () => {
      const largeBatch = generateLargeApplicationDataset(5000)
      
      const startTime = performance.now()
      const results = formatJobApplications(largeBatch)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const timePerItem = totalTime / 5000

      console.log(`Large batch (5000): ${timePerItem.toFixed(4)}ms per item, ${totalTime.toFixed(2)}ms total`)

      expect(results).toHaveLength(5000)
      expect(timePerItem).toBeLessThan(PERFORMANCE_THRESHOLDS.batch_format_per_item_max_ms * 2) // Allow some degradation for very large batches
      expect(totalTime).toBeLessThan(2000) // Should complete within 2 seconds
    })
  })

  describe('Validation Performance', () => {
    it('should validate applications quickly', () => {
      const formattedApp = formatJobApplication(mockCompleteRawApplication)
      const iterations = 50000

      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        validatePersonalInfoFields(formattedApp)
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations

      console.log(`Validation: ${avgTime.toFixed(6)}ms avg (${iterations} iterations)`)

      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.validation_max_ms)
    })

    it('should validate incomplete data efficiently', () => {
      const incompleteApp = formatJobApplication({
        ...mockCompleteRawApplication,
        applicant_first_name: '',
        nationality: null,
        applicant_wechat_id: null
      })

      const iterations = 50000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        const result = validatePersonalInfoFields(incompleteApp)
        expect(result.isValid).toBe(false) // Should detect missing first name
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations

      console.log(`Validation (incomplete): ${avgTime.toFixed(6)}ms avg`)

      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.validation_max_ms)
    })
  })

  describe('Memory Usage and Garbage Collection', () => {
    it('should not cause excessive memory growth', async () => {
      const initialMemory = getMemoryUsage()
      
      // Process large amounts of data in chunks to simulate real usage
      const chunkSize = 1000
      const numChunks = 10
      
      for (let chunk = 0; chunk < numChunks; chunk++) {
        const applications = generateLargeApplicationDataset(chunkSize)
        const results = formatJobApplications(applications)
        
        // Simulate doing something with the results
        results.forEach(app => {
          validatePersonalInfoFields(app)
        })
        
        // Force garbage collection if available (not in all environments)
        if (global.gc) {
          global.gc()
        }
      }

      const finalMemory = getMemoryUsage()
      const memoryGrowth = finalMemory - initialMemory

      console.log(`Memory growth: ${memoryGrowth.toFixed(2)}MB`)

      expect(memoryGrowth).toBeLessThan(PERFORMANCE_THRESHOLDS.memory_growth_max_mb)
    })

    it('should handle rapid creation and disposal of objects', () => {
      const iterations = 10000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        const app = createMockApplication({ id: `temp-${i}` })
        const formatted = formatJobApplication(app)
        const validated = validatePersonalInfoFields(formatted)
        
        // Verify the objects are created correctly
        expect(formatted.id).toBe(`temp-${i}`)
        expect(validated.isValid).toBe(true)
      }

      const endTime = performance.now()
      const totalTime = endTime - startTime
      const timePerIteration = totalTime / iterations

      console.log(`Object lifecycle: ${timePerIteration.toFixed(4)}ms per cycle`)

      expect(timePerIteration).toBeLessThan(0.5) // Should be very fast
    })
  })

  describe('Concurrent Processing Performance', () => {
    it('should handle concurrent formatting operations', async () => {
      const concurrentOps = 100
      const applicationsPerOp = 100

      const startTime = performance.now()

      const promises = Array.from({ length: concurrentOps }, async (_, i) => {
        const applications = generateLargeApplicationDataset(applicationsPerOp)
        return formatJobApplications(applications)
      })

      const results = await Promise.all(promises)
      const endTime = performance.now()

      const totalTime = endTime - startTime
      const totalApplications = concurrentOps * applicationsPerOp
      const timePerApplication = totalTime / totalApplications

      console.log(`Concurrent processing: ${timePerApplication.toFixed(4)}ms per item (${totalApplications} items across ${concurrentOps} concurrent operations)`)

      expect(results).toHaveLength(concurrentOps)
      results.forEach(batch => {
        expect(batch).toHaveLength(applicationsPerOp)
      })

      expect(timePerApplication).toBeLessThan(PERFORMANCE_THRESHOLDS.batch_format_per_item_max_ms * 3) // Allow higher threshold for concurrency overhead
    })
  })

  describe('Edge Case Performance', () => {
    it('should handle null and undefined values efficiently', () => {
      const nullApp = {
        ...mockCompleteRawApplication,
        custom_resume_url: null,
        nationality: null,
        applicant_wechat_id: null,
        jobs: null
      }

      const iterations = 10000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        formatJobApplication(nullApp)
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations

      console.log(`Null handling: ${avgTime.toFixed(4)}ms avg`)

      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.single_format_max_ms)
    })

    it('should handle malformed data without significant performance impact', () => {
      const malformedApp = {
        ...mockCompleteRawApplication,
        jobs: {
          job_id: null,
          id: undefined,
          title: '',
          location: null,
          employment_type: undefined,
          companies: null
        }
      } as any

      const iterations = 10000
      const startTime = performance.now()

      for (let i = 0; i < iterations; i++) {
        formatJobApplication(malformedApp)
      }

      const endTime = performance.now()
      const avgTime = (endTime - startTime) / iterations

      console.log(`Malformed data: ${avgTime.toFixed(4)}ms avg`)

      expect(avgTime).toBeLessThan(PERFORMANCE_THRESHOLDS.single_format_max_ms * 1.5) // Allow slight performance degradation
    })
  })
})

/**
 * Utility function to get memory usage (if available)
 */
function getMemoryUsage(): number {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    return process.memoryUsage().heapUsed / 1024 / 1024 // Convert to MB
  }
  
  if (typeof performance !== 'undefined' && (performance as any).memory) {
    return (performance as any).memory.usedJSHeapSize / 1024 / 1024 // Convert to MB
  }

  return 0 // Memory monitoring not available
}