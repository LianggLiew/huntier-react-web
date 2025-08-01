/**
 * Baseline Testing Suite for Job Applications API
 * ==============================================
 * 
 * This suite provides comprehensive testing of all 3 application API routes
 * to establish baseline response structures before implementing changes.
 * 
 * Location: src/__tests__/api/applications/baseline-test.js
 * Run in browser console after logging in.
 */

// Enhanced test data with all personal info fields
const completeTestData = {
  jobId: 1, // Replace with actual job ID from your database
  coverLetter: "This is a comprehensive test cover letter with more than 50 characters to meet the minimum requirement for thorough API testing and validation purposes.",
  applicantInfo: {
    firstName: "Jane",
    lastName: "Smith", 
    phoneNumber: "+1-555-123-4567",
    nationality: "Canadian",
    wechatId: "jane_test_wechat_456"
  }
};

// Storage for baseline responses
const baselineResponses = {
  applicationSubmission: null,
  applicationsGet: null,
  applicationGetById: null,
  applicationStatus: null,
  errors: []
};

// Utility function to deep copy and log responses
function captureResponse(testName, response, data) {
  const captured = {
    testName,
    timestamp: new Date().toISOString(),
    status: response.status,
    ok: response.ok,
    data: JSON.parse(JSON.stringify(data)) // Deep copy
  };
  
  console.log(`📊 BASELINE CAPTURE [${testName}]:`, captured);
  return captured;
}

// Enhanced application submission test
async function testApplicationSubmissionBaseline() {
  try {
    console.log('🧪 BASELINE TEST: Application Submission');
    console.log('Test data:', completeTestData);
    
    const response = await fetch('/api/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(completeTestData)
    });
    
    const result = await response.json();
    baselineResponses.applicationSubmission = captureResponse('POST /api/applications', response, result);
    
    if (response.ok && result.success) {
      console.log('✅ Application submitted successfully!');
      console.log('📋 Personal Info Fields Check:');
      const app = result.data;
      console.log('  - applicantFirstName:', app.applicantFirstName || '❌ MISSING');
      console.log('  - applicantLastName:', app.applicantLastName || '❌ MISSING');
      console.log('  - applicantPhone:', app.applicantPhone || '❌ MISSING');
      console.log('  - nationality:', app.nationality || '❌ MISSING');
      console.log('  - applicantWechatId:', app.applicantWechatId || '❌ MISSING');
      
      return result.data;
    } else {
      console.log('❌ Application submission failed:', result.error);
      baselineResponses.errors.push({test: 'submission', error: result.error});
    }
  } catch (error) {
    console.error('❌ Network error in submission test:', error);
    baselineResponses.errors.push({test: 'submission', error: error.message});
  }
}

// Enhanced get applications test
async function testGetApplicationsBaseline() {
  try {
    console.log('🧪 BASELINE TEST: Get Applications List');
    
    const response = await fetch('/api/applications', {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    baselineResponses.applicationsGet = captureResponse('GET /api/applications', response, result);
    
    if (response.ok && result.success) {
      console.log('✅ Applications retrieved successfully!');
      console.log('📊 Applications count:', result.data.applications.length);
      
      if (result.data.applications.length > 0) {
        console.log('📋 First Application Personal Info Fields Check:');
        const app = result.data.applications[0];
        console.log('  - applicantFirstName:', app.applicantFirstName || '❌ MISSING');
        console.log('  - applicantLastName:', app.applicantLastName || '❌ MISSING');
        console.log('  - applicantPhone:', app.applicantPhone || '❌ MISSING');
        console.log('  - nationality:', app.nationality || '❌ MISSING');
        console.log('  - applicantWechatId:', app.applicantWechatId || '❌ MISSING');
        
        return result.data.applications[0]; // Return first app for further testing
      }
    } else {
      console.log('❌ Failed to get applications:', result.error);
      baselineResponses.errors.push({test: 'get_applications', error: result.error});
    }
  } catch (error) {
    console.error('❌ Network error in get applications test:', error);
    baselineResponses.errors.push({test: 'get_applications', error: error.message});
  }
}

// Enhanced get application by ID test
async function testGetApplicationByIdBaseline(applicationId) {
  try {
    console.log(`🧪 BASELINE TEST: Get Application by ID [${applicationId}]`);
    
    const response = await fetch(`/api/applications/${applicationId}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    baselineResponses.applicationGetById = captureResponse('GET /api/applications/[id]', response, result);
    
    if (response.ok && result.success) {
      console.log('✅ Application retrieved by ID successfully!');
      console.log('📋 Personal Info Fields Check:');
      const app = result.data;
      console.log('  - applicantFirstName:', app.applicantFirstName || '❌ MISSING');
      console.log('  - applicantLastName:', app.applicantLastName || '❌ MISSING');
      console.log('  - applicantPhone:', app.applicantPhone || '❌ MISSING');
      console.log('  - nationality:', app.nationality || '❌ MISSING');
      console.log('  - applicantWechatId:', app.applicantWechatId || '❌ MISSING');
      
      return result.data;
    } else {
      console.log('❌ Failed to get application by ID:', result.error);
      baselineResponses.errors.push({test: 'get_by_id', error: result.error});
    }
  } catch (error) {
    console.error('❌ Network error in get by ID test:', error);
    baselineResponses.errors.push({test: 'get_by_id', error: error.message});
  }
}

// Enhanced application status test
async function testApplicationStatusBaseline(jobId) {
  try {
    console.log(`🧪 BASELINE TEST: Application Status for Job [${jobId}]`);
    
    const response = await fetch(`/api/applications/status/${jobId}`, {
      method: 'GET',
      credentials: 'include'
    });
    
    const result = await response.json();
    baselineResponses.applicationStatus = captureResponse('GET /api/applications/status/[jobId]', response, result);
    
    if (response.ok && result.success) {
      console.log('✅ Application status retrieved successfully!');
      console.log('📊 Has applied:', result.data.hasApplied);
      
      if (result.data.application) {
        console.log('📋 Application Personal Info Fields Check:');
        const app = result.data.application;
        console.log('  - applicantFirstName:', app.applicantFirstName || '❌ MISSING');
        console.log('  - applicantLastName:', app.applicantLastName || '❌ MISSING');
        console.log('  - applicantPhone:', app.applicantPhone || '❌ MISSING');
        console.log('  - nationality:', app.nationality || '❌ MISSING');
        console.log('  - applicantWechatId:', app.applicantWechatId || '❌ MISSING');
        
        return result.data.application;
      }
    } else {
      console.log('❌ Failed to get application status:', result.error);
      baselineResponses.errors.push({test: 'status_check', error: result.error});
    }
  } catch (error) {
    console.error('❌ Network error in status test:', error);
    baselineResponses.errors.push({test: 'status_check', error: error.message});
  }
}

// Comprehensive baseline test suite
async function runBaselineTestSuite() {
  console.log('🚀 STARTING COMPREHENSIVE BASELINE TEST SUITE');
  console.log('===============================================');
  console.log('Purpose: Document current API behavior before implementing changes');
  
  // Clear previous results
  Object.keys(baselineResponses).forEach(key => {
    if (key !== 'errors') baselineResponses[key] = null;
  });
  baselineResponses.errors = [];
  
  let testApplication = null;
  
  console.log('\n📋 TEST 1: Application Submission');
  console.log('----------------------------------');
  testApplication = await testApplicationSubmissionBaseline();
  
  console.log('\n📋 TEST 2: Get Applications List');  
  console.log('--------------------------------');
  const firstApp = await testGetApplicationsBaseline();
  
  // Use submitted application ID if available, otherwise use first from list
  const applicationId = testApplication?.id || firstApp?.id;
  
  if (applicationId) {
    console.log('\n📋 TEST 3: Get Application by ID');
    console.log('--------------------------------');
    await testGetApplicationByIdBaseline(applicationId);
  } else {
    console.log('\n⚠️ SKIPPING TEST 3: No application ID available');
  }
  
  console.log('\n📋 TEST 4: Application Status Check');
  console.log('-----------------------------------');
  await testApplicationStatusBaseline(completeTestData.jobId);
  
  console.log('\n📊 BASELINE TEST SUITE COMPLETE!');
  console.log('=================================');
  
  // Generate summary report
  generateBaselineSummary();
}

// Generate comprehensive baseline summary
function generateBaselineSummary() {
  console.log('\n📈 BASELINE SUMMARY REPORT');
  console.log('==========================');
  
  const routes = [
    { name: 'POST /api/applications', data: baselineResponses.applicationSubmission },
    { name: 'GET /api/applications', data: baselineResponses.applicationsGet },
    { name: 'GET /api/applications/[id]', data: baselineResponses.applicationGetById },
    { name: 'GET /api/applications/status/[jobId]', data: baselineResponses.applicationStatus }
  ];
  
  routes.forEach(route => {
    if (route.data) {
      console.log(`\n🛣️ ${route.name}`);
      console.log(`   Status: ${route.data.ok ? '✅ SUCCESS' : '❌ FAILED'} (${route.data.status})`);
      
      if (route.data.ok && route.data.data.success) {
        const appData = route.data.data.data;
        const application = appData.application || appData.applications?.[0] || appData;
        
        if (application) {
          console.log('   Personal Info Fields:');
          console.log(`     - applicantFirstName: ${application.applicantFirstName ? '✅' : '❌'}`);
          console.log(`     - applicantLastName: ${application.applicantLastName ? '✅' : '❌'}`);
          console.log(`     - applicantPhone: ${application.applicantPhone ? '✅' : '❌'}`);
          console.log(`     - nationality: ${application.nationality ? '✅' : '➖'}`);
          console.log(`     - applicantWechatId: ${application.applicantWechatId ? '✅' : '➖'}`);
        }
      }
    } else {
      console.log(`\n🛣️ ${route.name}`);
      console.log('   Status: ⚠️ NOT TESTED');
    }
  });
  
  if (baselineResponses.errors.length > 0) {
    console.log('\n❌ ERRORS ENCOUNTERED:');
    baselineResponses.errors.forEach(error => {
      console.log(`   - ${error.test}: ${error.error}`);
    });
  }
  
  console.log('\n💾 BASELINE DATA CAPTURED');
  console.log('Use window.applicationBaseline to access full response data');
  
  // Make baseline data available globally
  window.applicationBaseline = baselineResponses;
}

// Test individual routes for debugging
async function testSpecificRoute(routeName) {
  switch(routeName) {
    case 'submit':
      return await testApplicationSubmissionBaseline();
    case 'list':
      return await testGetApplicationsBaseline();
    case 'byid':
      const apps = await testGetApplicationsBaseline();
      if (apps && apps.length > 0) {
        return await testGetApplicationByIdBaseline(apps[0].id);
      }
      break;
    case 'status':
      return await testApplicationStatusBaseline(completeTestData.jobId);
    default:
      console.log('Available routes: submit, list, byid, status');
  }
}

// Export enhanced testing functions
window.ApplicationBaselineTesting = {
  runBaselineTestSuite,
  testApplicationSubmissionBaseline,
  testGetApplicationsBaseline, 
  testGetApplicationByIdBaseline,
  testApplicationStatusBaseline,
  testSpecificRoute,
  generateBaselineSummary,
  testData: completeTestData,
  getResults: () => baselineResponses
};

console.log('🧪 Application Baseline Testing Suite Loaded!');
console.log('==============================================');
console.log('Location: src/__tests__/api/applications/baseline-test.js');
console.log('Usage:');
console.log('- window.ApplicationBaselineTesting.runBaselineTestSuite() - Run full baseline suite');
console.log('- window.ApplicationBaselineTesting.testSpecificRoute("submit") - Test specific route');
console.log('- window.ApplicationBaselineTesting.generateBaselineSummary() - Generate summary report');
console.log('- window.ApplicationBaselineTesting.getResults() - Get captured baseline data');
console.log('');
console.log('Available specific routes: "submit", "list", "byid", "status"');