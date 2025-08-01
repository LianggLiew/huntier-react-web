/**
 * Vitest Test Setup
 * =================
 * 
 * Global test setup and configuration for the test suite.
 * This file runs before all tests.
 */

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest'

// Global test setup
beforeAll(() => {
  // Setup that runs once before all tests
  console.log('🧪 Starting test suite...')
})

afterAll(() => {
  // Cleanup that runs once after all tests  
  console.log('✅ Test suite completed!')
})

beforeEach(() => {
  // Setup that runs before each test
  // Reset any global state, mocks, etc.
})

afterEach(() => {
  // Cleanup that runs after each test
  // Clear any test artifacts, restore mocks, etc.
})

// Global test utilities and matchers can be added here
declare global {
  namespace Vi {
    interface AsymmetricMatchersContaining {
      // Custom matchers can be declared here
    }
  }
}