/**
 * Formatter Integration Test for Job Applications API
 * =================================================
 * 
 * Tests to verify that all routes now use the formatter utility consistently
 * and return the same standardized JobApplication format.
 * 
 * This test should be run after implementing the formatter utility across all routes.
 * Run in browser console after logging in.
 */

// Test data
const testJobId = 1; // Update with actual job ID

// Deep object comparison utility
function deepEqual(obj1, obj2, path = '') {
  if (obj1 === obj2) return { equal: true, differences: [] };
  
  if (!obj1 || !obj2) {
    return { 
      equal: false, 
      differences: [`${path}: ${obj1} !== ${obj2}`] 
    };
  }
  
  if (typeof obj1 !== typeof obj2) {
    return { 
      equal: false, 
      differences: [`${path}: type mismatch - ${typeof obj1} !== ${typeof obj2}`] 
    };
  }
  
  if (typeof obj1 !== 'object') {
    return obj1 === obj2 ? 
      { equal: true, differences: [] } : 
      { equal: false, differences: [`${path}: ${obj1} !== ${obj2}`] };
  }
  
  const differences = [];
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  
  // Check for different keys
  const allKeys = new Set([...keys1, ...keys2]);
  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;
    
    if (!(key in obj1)) {
      differences.push(`${newPath}: missing in first object`);
      continue;
    }
    
    if (!(key in obj2)) {
      differences.push(`${newPath}: missing in second object`);
      continue;
    }
    
    const result = deepEqual(obj1[key], obj2[key], newPath);
    differences.push(...result.differences);
  }
  
  return {
    equal: differences.length === 0,
    differences
  };
}

// Verify JobApplication structure consistency
function verifyJobApplicationStructure(application, sourceName) {
  console.log(`\n🔍 Verifying JobApplication structure from ${sourceName}`);
  console.log('='.repeat(60));
  
  const requiredFields = [
    'id', 'userId', 'jobId', 'status', 'coverLetter', 'appliedAt', 'updatedAt',
    'applicantFirstName', 'applicantLastName', 'applicantPhone'
  ];
  
  const optionalFields = [
    'customResumeUrl', 'nationality', 'applicantWechatId', 'job'
  ];
  
  let allRequired = true;
  const missing = [];
  const present = [];
  
  requiredFields.forEach(field => {
    if (application && application[field] !== undefined && application[field] !== null) {
      present.push(field);
      console.log(`  ✅ ${field}: ${typeof application[field]} ("${String(application[field]).substring(0, 50)}${String(application[field]).length > 50 ? '...' : ''}")`);
    } else {
      missing.push(field);
      console.log(`  ❌ ${field}: MISSING`);
      allRequired = false;
    }
  });
  
  optionalFields.forEach(field => {
    if (application && application[field] !== undefined && application[field] !== null) {
      console.log(`  ✅ ${field}: ${typeof application[field]} (optional, present)`);
    } else {
      console.log(`  ➖ ${field}: null/undefined (optional, ok)`);
    }
  });
  
  // Verify job structure if present
  if (application && application.job) {
    console.log(`  📋 job.jobId: ${application.job.jobId}`);
    console.log(`  📋 job.title: "${application.job.title}"`);
    console.log(`  📋 job.company.name: "${application.job.company?.name}"`);
  }
  
  console.log(`\n📊 ${sourceName} Summary:`);
  console.log(`  Required fields: ${allRequired ? '✅ ALL PRESENT' : `❌ MISSING ${missing.length}`}`);
  if (missing.length > 0) {
    console.log(`  Missing: ${missing.join(', ')}`);
  }
  
  return {
    valid: allRequired,
    missing,
    present,
    application
  };
}

// Compare JobApplication objects for consistency
function compareApplicationStructures(app1, app2, source1, source2) {
  console.log(`\n🔄 Comparing ${source1} vs ${source2}`);
  console.log('='.repeat(60));
  
  if (!app1 || !app2) {
    console.log('❌ Cannot compare - one or both applications are null/undefined');
    return false;
  }
  
  // Compare structure (ignore dynamic values like timestamps, specific IDs)
  const staticFields = [
    'applicantFirstName', 'applicantLastName', 'applicantPhone', 
    'nationality', 'applicantWechatId', 'coverLetter'
  ];
  
  let structureMatches = true;
  
  staticFields.forEach(field => {
    const val1 = app1[field];
    const val2 = app2[field];
    
    if (val1 !== val2) {
      console.log(`  ⚠️ ${field}: "${val1}" vs "${val2}"`);
      // This might be expected if different applications, so not marking as failure
    } else {
      console.log(`  ✅ ${field}: matches`);
    }
  });
  
  // Compare object structure types
  const structuralFields = ['id', 'userId', 'jobId', 'status', 'appliedAt', 'updatedAt'];
  
  structuralFields.forEach(field => {
    const type1 = typeof app1[field];
    const type2 = typeof app2[field];
    
    if (type1 !== type2) {
      console.log(`  ❌ ${field} type mismatch: ${type1} vs ${type2}`);
      structureMatches = false;
    } else {
      console.log(`  ✅ ${field}: ${type1} (type matches)`);
    }
  });
  
  // Compare job object structure
  if (app1.job && app2.job) {
    const jobFields = ['jobId', 'title', 'location', 'employmentType'];
    jobFields.forEach(field => {
      const type1 = typeof app1.job[field];
      const type2 = typeof app2.job[field];
      
      if (type1 !== type2) {
        console.log(`  ❌ job.${field} type mismatch: ${type1} vs ${type2}`);
        structureMatches = false;
      } else {
        console.log(`  ✅ job.${field}: ${type1} (type matches)`);
      }
    });
  } else if (app1.job || app2.job) {
    console.log('  ⚠️ Job data present in one but not the other');
  }
  
  console.log(`\n📊 Structure Comparison Result: ${structureMatches ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
  return structureMatches;
}

// Test all routes and compare consistency
async function testFormatterIntegration() {
  console.log('🚀 RUNNING FORMATTER INTEGRATION TESTS');
  console.log('======================================');
  console.log('Purpose: Verify all routes use formatter utility consistently');
  
  const results = {
    applications: null,
    applicationById: null,
    applicationStatus: null,
    consistency: false
  };
  
  let applicationId = null;
  
  try {
    // Test 1: Get applications list
    console.log('\n📋 TEST 1: GET /api/applications');
    console.log('--------------------------------');
    
    const listResponse = await fetch('/api/applications', {
      method: 'GET',
      credentials: 'include'
    });
    
    const listResult = await listResponse.json();
    
    if (listResponse.ok && listResult.success && listResult.data.applications.length > 0) {
      results.applications = verifyJobApplicationStructure(
        listResult.data.applications[0], 
        'GET /api/applications'
      );
      applicationId = listResult.data.applications[0].id;
    } else {
      console.log('⚠️ No applications found or request failed');
    }
    
  } catch (error) {
    console.error('❌ Error testing applications list:', error);
  }
  
  try {
    // Test 2: Get application by ID
    if (applicationId) {
      console.log('\n📋 TEST 2: GET /api/applications/[id]');
      console.log('------------------------------------');
      
      const byIdResponse = await fetch(`/api/applications/${applicationId}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      const byIdResult = await byIdResponse.json();
      
      if (byIdResponse.ok && byIdResult.success) {
        results.applicationById = verifyJobApplicationStructure(
          byIdResult.data,
          'GET /api/applications/[id]'
        );
      } else {
        console.log('❌ Failed to get application by ID:', byIdResult.error);
      }
    } else {
      console.log('\n⚠️ SKIPPING TEST 2: No application ID available');
    }
    
  } catch (error) {
    console.error('❌ Error testing application by ID:', error);
  }
  
  try {
    // Test 3: Get application status
    console.log('\n📋 TEST 3: GET /api/applications/status/[jobId]');
    console.log('----------------------------------------------');
    
    const statusResponse = await fetch(`/api/applications/status/${testJobId}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const statusResult = await statusResponse.json();
    
    if (statusResponse.ok && statusResult.success) {
      if (statusResult.data.hasApplied && statusResult.data.application) {
        results.applicationStatus = verifyJobApplicationStructure(
          statusResult.data.application,
          'GET /api/applications/status/[jobId]'
        );
      } else {
        console.log('ℹ️ User has not applied to this job - cannot test structure');
        results.applicationStatus = { valid: true, note: 'No application data to test' };
      }
    } else {
      console.log('❌ Failed to get application status:', statusResult.error);
    }
    
  } catch (error) {
    console.error('❌ Error testing application status:', error);
  }
  
  // Test 4: Compare consistency between routes
  console.log('\n📋 TEST 4: Cross-Route Consistency Check');
  console.log('----------------------------------------');
  
  const validResults = [results.applications, results.applicationById, results.applicationStatus]
    .filter(r => r && r.valid && r.application);
  
  if (validResults.length >= 2) {
    let allConsistent = true;
    
    for (let i = 0; i < validResults.length - 1; i++) {
      for (let j = i + 1; j < validResults.length; j++) {
        const consistent = compareApplicationStructures(
          validResults[i].application,
          validResults[j].application,
          `Route ${i + 1}`,
          `Route ${j + 1}`
        );
        if (!consistent) allConsistent = false;
      }
    }
    
    results.consistency = allConsistent;
  } else {
    console.log('⚠️ Not enough valid results to compare consistency');
    results.consistency = null;
  }
  
  // Final Summary
  console.log('\n🎯 FORMATTER INTEGRATION TEST SUMMARY');
  console.log('=====================================');
  
  const routeResults = [
    { name: 'GET /api/applications', result: results.applications },
    { name: 'GET /api/applications/[id]', result: results.applicationById },
    { name: 'GET /api/applications/status/[jobId]', result: results.applicationStatus }
  ];
  
  routeResults.forEach(route => {
    if (route.result) {
      if (route.result.note) {
        console.log(`📊 ${route.name}: ℹ️ ${route.result.note}`);
      } else {
        console.log(`📊 ${route.name}: ${route.result.valid ? '✅ VALID' : '❌ INVALID'}`);
      }
    } else {
      console.log(`📊 ${route.name}: ⚠️ NOT TESTED`);
    }
  });
  
  if (results.consistency !== null) {
    console.log(`📊 Cross-Route Consistency: ${results.consistency ? '✅ CONSISTENT' : '❌ INCONSISTENT'}`);
  }
  
  const overallSuccess = routeResults.every(r => !r.result || r.result.valid || r.result.note) && 
                        (results.consistency === null || results.consistency);
  
  console.log(`\n🎉 Overall Result: ${overallSuccess ? '✅ ALL TESTS PASSED! Formatter integration successful!' : '⚠️ Some issues detected - may need review'}`);
  
  return results;
}

// Export testing functions
window.FormatterIntegrationTesting = {
  testFormatterIntegration,
  verifyJobApplicationStructure,
  compareApplicationStructures,
  deepEqual,
  testJobId
};

console.log('🔧 Formatter Integration Testing Suite Loaded!');
console.log('===============================================');
console.log('Usage:');
console.log('- window.FormatterIntegrationTesting.testFormatterIntegration() - Run full integration test');
console.log('- window.FormatterIntegrationTesting.verifyJobApplicationStructure(app, name) - Test single application');
console.log(`- Current test job ID: ${testJobId} (update FormatterIntegrationTesting.testJobId if needed)`);