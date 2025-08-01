# Testing Infrastructure Documentation

## Overview

This directory contains comprehensive testing infrastructure for the Huntier job application platform, with a focus on the application formatter utilities and API endpoints.

## Test Structure

```
src/__tests__/
├── README.md                                    # This documentation
├── setup.ts                                    # Global test setup and configuration
├── fixtures/                                   # Test data and mock objects
│   └── applicationData.ts                      # Job application test fixtures
├── utils/                                      # Unit tests for utility functions
│   └── applicationFormatters.test.ts          # Comprehensive formatter tests
├── integration/                                # Integration and end-to-end tests
│   └── applicationFormatters.integration.test.ts  # Real-world scenario tests
├── performance/                                # Performance and benchmark tests
│   └── applicationFormatters.bench.test.ts    # Performance benchmarking
└── api/                                        # API endpoint tests
    └── applications/                           # Job application API tests
        ├── README.md                          # API testing documentation
        ├── baseline-test.js                   # Browser-based baseline tests
        ├── fix-verification-test.js           # Fix verification tests
        └── formatter-integration-test.js      # Integration validation tests
```

## Test Framework

**Primary Framework:** [Vitest](https://vitest.dev/)
- Fast, lightweight testing framework
- Built-in TypeScript support
- Jest-compatible API
- Excellent performance for Node.js environments

**Configuration:** `vitest.config.ts`
- Path aliases configured for `@/` imports
- Coverage reporting enabled 
- Node.js environment for utility testing
- Global test setup via `setup.ts`

## Test Categories

### 1. Unit Tests (`src/__tests__/utils/`)

**Purpose:** Test individual functions in isolation

**Coverage:**
- ✅ `formatJobApplication()` - Single application formatting
- ✅ `formatJobApplications()` - Batch application formatting  
- ✅ `validatePersonalInfoFields()` - Field validation logic
- ✅ SELECT query constants validation
- ✅ Edge cases and error handling
- ✅ Type safety verification

**Key Test Scenarios:**
- Complete application data formatting
- Minimal/null data handling
- Alternative job ID fields (`jobs.id` vs `jobs.job_id`)
- Missing company data handling
- All application status values
- Special characters and internationalization
- Field type preservation

### 2. Integration Tests (`src/__tests__/integration/`)

**Purpose:** Test utilities working together in realistic scenarios

**Coverage:**
- ✅ Real-world data scenarios
- ✅ Database schema variations
- ✅ Character encoding handling
- ✅ Error recovery and resilience
- ✅ Performance under load
- ✅ Data consistency validation
- ✅ Backwards compatibility
- ✅ TypeScript integration

**Key Test Scenarios:**
- Applications from different database versions
- Corrupted or malformed job data
- Mixed character encodings (Chinese, Spanish, German, etc.)
- Circular references and nested objects
- Concurrent formatting operations
- Memory efficiency with large datasets

### 3. Performance Tests (`src/__tests__/performance/`)

**Purpose:** Ensure production-ready performance characteristics

**Performance Thresholds:**
- Single application formatting: `< 5ms`
- Batch formatting: `< 0.1ms per item`
- Validation: `< 1ms`
- Memory growth: `< 50MB for large datasets`

**Coverage:**
- ✅ Single application formatting performance
- ✅ Batch processing efficiency
- ✅ Large dataset handling (1000+ applications)
- ✅ Validation performance
- ✅ Memory usage and garbage collection
- ✅ Concurrent processing performance
- ✅ Edge case performance impact

### 4. API Tests (`src/__tests__/api/applications/`)

**Purpose:** Validate API endpoints and integration

**Browser-Based Tests:** (Require manual execution in browser)
- ✅ Baseline testing for original API behavior
- ✅ Fix verification for personal info fields
- ✅ Integration testing for formatter utility usage

## Running Tests

### Prerequisites

**Install Dependencies:**
```bash
npm install -D vitest @vitest/coverage-v8
```

### Available Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (great for development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test categories
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:performance   # Performance benchmarks only

# Run specific test file
npm run test:formatters    # Application formatters only

# Run tests for CI/CD
npm run test:ci           # With verbose output and coverage
```

### Test Development Workflow

**1. During Development:**
```bash
npm run test:watch
```
- Automatically reruns tests when files change
- Fast feedback loop for TDD/BDD development

**2. Before Committing:**
```bash
npm run test:coverage
```
- Ensures all code paths are tested
- Generates HTML coverage report in `coverage/`

**3. Performance Validation:**
```bash  
npm run test:performance
```
- Validates performance hasn't degraded
- Benchmarks against established thresholds

## Test Data and Fixtures

### Application Test Fixtures (`fixtures/applicationData.ts`)

**Complete Test Data:**
- `mockCompleteRawApplication` - Full application with all fields
- `mockMinimalRawApplication` - Minimal required fields only
- `mockSpecialCharsRawApplication` - International characters and edge cases
- `mockApplicationsByStatus` - Applications in each status state

**Utility Functions:**
- `createMockApplication()` - Generate custom test applications
- `generateLargeApplicationDataset()` - Create datasets for performance testing
- `expectedCompleteJobApplication` - Expected formatted output for validation

## Coverage Goals

**Current Coverage Targets:**
- **Statements:** > 95%
- **Branches:** > 90%
- **Functions:** > 95%
- **Lines:** > 95%

**Critical Path Coverage:** 100%
- Application formatting functions
- Personal info field handling
- Job data processing
- Error handling paths

## Best Practices

### Writing Tests

1. **Use Descriptive Test Names:**
   ```typescript
   it('should handle applications with corrupted job data', () => {
     // Test implementation
   })
   ```

2. **Follow AAA Pattern:**
   ```typescript
   it('should format complete application correctly', () => {
     // Arrange
     const rawApp = mockCompleteRawApplication
     
     // Act
     const result = formatJobApplication(rawApp)
     
     // Assert
     expect(result.applicantFirstName).toBe('John')
   })
   ```

3. **Test Edge Cases:**
   - Null/undefined values
   - Empty strings
   - Invalid data types
   - Boundary conditions

4. **Use Test Fixtures:**
   ```typescript
   import { mockCompleteRawApplication } from '../fixtures/applicationData'
   ```

### Performance Testing

1. **Set Realistic Thresholds:**
   - Based on production requirements
   - Account for CI/CD environment differences
   - Monitor for performance regressions

2. **Test Real-World Scenarios:**
   - Large datasets (1000+ items)
   - Concurrent operations
   - Memory-intensive operations

## Continuous Integration

### GitHub Actions Integration

**Test Pipeline:**
```yaml
# Example .github/workflows/test.yml
- name: Run Tests
  run: npm run test:ci
  
- name: Performance Benchmarks  
  run: npm run test:performance
```

**Quality Gates:**
- All tests must pass
- Coverage thresholds must be met
- Performance benchmarks must pass
- No failing integration tests

## Troubleshooting

### Common Issues

**1. Import Path Errors:**
```bash
# Ensure path aliases are configured in vitest.config.ts
resolve: {
  alias: {
    '@': resolve(__dirname, './src'),
  },
}
```

**2. TypeScript Errors:**
```bash
# Check tsconfig.json includes test files
"include": ["src/**/*", "src/__tests__/**/*"]
```

**3. Performance Test Failures:**
- Check system load during testing
- Adjust thresholds for slower CI environments
- Monitor for memory leaks

### Debug Mode

```bash
# Run single test with debug output
npx vitest run --reporter=verbose src/__tests__/utils/applicationFormatters.test.ts
```

## Future Enhancements

### Planned Additions

1. **Visual Regression Testing**
   - Component screenshot comparisons
   - UI consistency validation

2. **E2E Testing**
   - Full user journey testing
   - Browser automation with Playwright

3. **Load Testing**
   - Stress testing with high concurrency
   - Database performance under load

4. **Security Testing**
   - Input sanitization validation
   - XSS prevention testing

### Contributing

When adding new tests:

1. **Follow Existing Patterns:**
   - Use established fixtures
   - Maintain naming conventions
   - Add appropriate documentation

2. **Update Documentation:**
   - Add test descriptions to this README
   - Update coverage expectations
   - Document new test utilities

3. **Validate Performance:**
   - Ensure new tests don't slow down suite
   - Add performance tests for new utilities
   - Update thresholds if needed

---

**Last Updated:** January 2025  
**Test Framework Version:** Vitest 1.x  
**Coverage Tool:** @vitest/coverage-v8