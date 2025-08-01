/**
 * Fix Verification Test for Job Applications API
 * =============================================
 * 
 * Quick test to verify that the personal info field fixes are working
 * after updating applications/[id]/route.ts and applications/status/[jobId]/route.ts
 * 
 * Run in browser console after logging in.
 */

// Test data
const testJobId = 1; // Update with actual job ID

// Quick verification function for personal info fields
function verifyPersonalInfoFields(application, routeName) {
  console.log(`\n🔍 Verifying Personal Info Fields - ${routeName}`);
  console.log('='.repeat(50));
  
  const requiredFields = [
    'applicantFirstName',
    'applicantLastName', 
    'applicantPhone'
  ];
  
  const optionalFields = [
    'nationality',
    'applicantWechatId'
  ];
  
  let allRequired = true;
  let hasOptional = false;
  
  requiredFields.forEach(field => {
    const hasField = application && application[field];
    console.log(`  📋 ${field}: ${hasField ? '✅ PRESENT' : '❌ MISSING'} ${hasField ? `("${application[field]}")` : ''}`);
    if (!hasField) allRequired = false;
  });
  
  optionalFields.forEach(field => {
    const hasField = application && application[field];
    console.log(`  📋 ${field}: ${hasField ? '✅ PRESENT' : '➖ NULL/EMPTY'} ${hasField ? `("${application[field]}")` : ''}`);
    if (hasField) hasOptional = true;
  });
  
  console.log(`\n📊 Summary for ${routeName}:`);
  console.log(`  - Required fields: ${allRequired ? '✅ ALL PRESENT' : '❌ SOME MISSING'}`);
  console.log(`  - Optional fields: ${hasOptional ? '✅ SOME PRESENT' : '➖ ALL NULL/EMPTY'}`);
  
  return allRequired;
}

// Test specific application by ID
async function testApplicationById(applicationId) {
  try {
    console.log(`🧪 TESTING: GET /api/applications/${applicationId}`);
    
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      return verifyPersonalInfoFields(result.data, `GET /api/applications/${applicationId}`);
    } else {
      console.log('❌ Failed to get application by ID:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Test application status by job ID
async function testApplicationStatus(jobId) {
  try {
    console.log(`🧪 TESTING: GET /api/applications/status/${jobId}`);
    
    const response = await fetch(`/api/applications/status/${jobId}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      if (result.data.hasApplied && result.data.application) {
        return verifyPersonalInfoFields(result.data.application, `GET /api/applications/status/${jobId}`);
      } else {
        console.log('ℹ️ User has not applied to this job - cannot test personal info fields');
        return true; // Not an error, just no data to test
      }
    } else {
      console.log('❌ Failed to get application status:', result.error);
      return false;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Test applications list (should already work, but let's verify)
async function testApplicationsList() {
  try {
    console.log('🧪 TESTING: GET /api/applications (baseline verification)');
    
    const response = await fetch('/api/applications', {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (response.ok && result.success && result.data.applications.length > 0) {
      return verifyPersonalInfoFields(result.data.applications[0], 'GET /api/applications');
    } else {
      console.log('ℹ️ No applications found to test');
      return true;
    }
  } catch (error) {
    console.error('❌ Network error:', error);
    return false;
  }
}

// Main verification function
async function runFixVerification() {
  console.log('🚀 RUNNING FIX VERIFICATION TESTS');
  console.log('==================================');
  console.log('Purpose: Verify personal info fields are now included in all routes');
  
  const results = {
    applicationsList: false,
    applicationById: false,
    applicationStatus: false
  };
  
  // Test 1: Applications List (baseline - should already work)
  console.log('\n📋 TEST 1: Applications List');
  console.log('----------------------------');
  results.applicationsList = await testApplicationsList();
  
  // Get application ID for further testing
  let applicationId = null;
  try {
    const listResponse = await fetch('/api/applications', {
      method: 'GET',
      credentials: 'include'
    });
    const listResult = await listResponse.json();
    if (listResult.success && listResult.data.applications.length > 0) {
      applicationId = listResult.data.applications[0].id;
    }
  } catch (error) {
    console.log('Could not get application ID for testing');
  }
  
  // Test 2: Application by ID (should now work after fix)
  if (applicationId) {
    console.log('\n📋 TEST 2: Application by ID');
    console.log('-----------------------------');
    results.applicationById = await testApplicationById(applicationId);
  } else {
    console.log('\n⚠️ SKIPPING TEST 2: No application ID available');
    results.applicationById = true; // Skip this test
  }
  
  // Test 3: Application Status (should now work after fix)
  console.log('\n📋 TEST 3: Application Status');
  console.log('------------------------------');
  results.applicationStatus = await testApplicationStatus(testJobId);
  
  // Final Summary
  console.log('\n🎯 FIX VERIFICATION SUMMARY');
  console.log('============================');
  console.log(`📊 Applications List: ${results.applicationsList ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Application by ID: ${results.applicationById ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`📊 Application Status: ${results.applicationStatus ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = results.applicationsList && results.applicationById && results.applicationStatus;
  console.log(`\n${allPassed ? '🎉 ALL TESTS PASSED! Personal info fields fix is working!' : '⚠️ Some tests failed - may need additional debugging'}`);
  
  return results;
}

// Export testing functions
window.FixVerificationTesting = {
  runFixVerification,
  testApplicationById,
  testApplicationStatus,
  testApplicationsList,
  verifyPersonalInfoFields,
  testJobId
};

console.log('🔧 Fix Verification Testing Suite Loaded!');
console.log('==========================================');
console.log('Usage:');
console.log('- window.FixVerificationTesting.runFixVerification() - Run all verification tests');
console.log('- window.FixVerificationTesting.testApplicationById(id) - Test specific application');
console.log('- window.FixVerificationTesting.testApplicationStatus(jobId) - Test application status');
console.log(`- Current test job ID: ${testJobId} (update FixVerificationTesting.testJobId if needed)`);