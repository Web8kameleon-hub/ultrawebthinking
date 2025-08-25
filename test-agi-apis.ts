/**
 * Test AGI APIs to see which ones are returning empty responses
 */

const BASE_URL = 'http://localhost:3000';

const agiEndpoints = [
  '/api/agi/analytics',
  '/api/agi/bio-analysis', 
  '/api/agi/core/process',
  '/api/agi/core/state',
  '/api/agi/economic-analysis',
  '/api/agi/general-analysis',
  '/api/agi/notifications',
  '/api/agi/scroll',
  '/api/agi/state',
  '/api/agi/stats',
  '/api/agi/ui/activate',
  '/api/agi/ui/pulse',
  '/api/agi-analytics',
  '/api/agi-deepthink',
  '/api/agi-eco',
  '/api/agi-electronics',
  '/api/agi-office'
];

async function testAPI(endpoint: string) {
  try {
    console.log(`Testing ${endpoint}...`);
    
    // Test GET request
    const getResponse = await fetch(`${BASE_URL}${endpoint}?q=test`);
    const getData = await getResponse.json();
    
    console.log(`GET ${endpoint}:`, {
      status: getResponse.status,
      hasData: !!getData.success || !!getData.data || Object.keys(getData).length > 1
    });
    
    // Test POST request  
    const postResponse = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'test', data: { test: true } })
    });
    
    const postData = await postResponse.json();
    
    console.log(`POST ${endpoint}:`, {
      status: postResponse.status,
      hasData: !!postData.success || !!postData.data || Object.keys(postData).length > 1
    });
    
  } catch (error) {
    console.log(`ERROR ${endpoint}:`, error.message);
  }
}

// Test all endpoints
async function testAllAPIs() {
  console.log('🧪 Testing all AGI APIs...\n');
  
  for (const endpoint of agiEndpoints) {
    await testAPI(endpoint);
    console.log('---');
  }
  
  console.log('✅ Testing complete!');
}

// Run tests if this script is executed directly
if (require.main === module) {
  testAllAPIs();
}

export { testAllAPIs, testAPI };
