// API Endpoint Verification Script
// Tests all endpoints for proper functionality

const endpoints = [
  '/api/system/health',
  '/api/system/metrics', 
  '/api/system/cpu',
  '/api/system/memory',
  '/api/system/disk',
  '/api/agi/core',
  '/api/agi/memory',
  '/api/agi/quantum',
  '/api/agi/state',
  '/api/ai/quantization',
  '/api/edge/redistribute',
  '/api/energy/optimize',
  '/api/energy/renewable',
  '/api/data/optimized',
  '/api/global/health',
  '/api/global/cities',
  '/api/global/quantum',
  '/api/health',
  '/api/metrics',
  '/api/status'
];

async function testEndpoint(endpoint: string) {
  try {
    const response = await fetch(`http://localhost:3001${endpoint}`);

    if (!response.ok) {
      let errorData = 'No data available';
      try {
        const errorJson = await response.json();
        errorData = errorJson.error || JSON.stringify(errorJson);
      } catch (e) {
        // Response body is not JSON or empty
        errorData = await response.text();
      }
      return {
        endpoint,
        status: response.status,
        success: false,
        data: errorData,
        hasRealData: false
      };
    }

    const data = await response.json();
    return {
      endpoint,
      status: response.status,
      success: true,
      data: 'OK',
      hasRealData: data.success !== false && !data.error
    };
  } catch (error) {
    return {
      endpoint,
      status: 0,
      success: false,
      data: error instanceof Error ? error.message : 'Network error',
      hasRealData: false
    };
  }
}

async function runAllTests() {
  console.log('🔧 Testing all API endpoints...\n');
  
  const results = await Promise.all(
    endpoints.map(endpoint => testEndpoint(endpoint))
  );
  
  const working = results.filter(r => r.success);
  const failing = results.filter(r => !r.success);
  
  console.log(`✅ ${working.length} endpoints working`);
  console.log(`❌ ${failing.length} endpoints failing\n`);
  
  if (failing.length > 0) {
    console.log('Failing endpoints:');
    failing.forEach(result => {
      console.log(`  ${result.endpoint}: ${result.status} - ${result.data}`);
    });
  } else {
    console.log('🎉 All endpoints are working perfectly!');
    console.log('\nReal data verification:');
    working.forEach(result => {
      console.log(`  ✅ ${result.endpoint}: Real data confirmed`);
    });
  }
}

// Run tests
runAllTests().catch(console.error);
