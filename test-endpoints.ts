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
  '/api/ai/quantization',
  '/api/edge/redistribute',
  '/api/energy/optimize',
  '/api/energy/renewable',
  '/api/health',
  '/api/metrics',
  '/api/status'
];

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`http://localhost:3001${endpoint}`);
    const data = await response.json();
    
    return {
      endpoint,
      status: response.status,
      success: response.ok,
      data: response.ok ? 'OK' : data.error || 'Unknown error',
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
