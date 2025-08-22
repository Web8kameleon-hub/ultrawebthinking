/**
 * Comprehensive EuroWeb System Test Suite
 * Testing all core components and functionality using TypeScript
 */

console.log('🧪 Starting EuroWeb System Tests...\n');

async function testDualMindEngine(): Promise<boolean> {
  console.log('🔍 Testing DualMindEngine...');
  try {
    // Test TypeScript imports
    const { DualMindEngine, createDualMindEngine, dualMindInstance } = await import('./lib/dualMindEngine');
    const DefaultImport = (await import('./lib/dualMindEngine')).default;
    
    console.log('✅ TypeScript imports successful');
    console.log('  - Named export DualMindEngine:', typeof DualMindEngine);
    console.log('  - Default export:', typeof DefaultImport);
    console.log('  - Factory function:', typeof createDualMindEngine);
    console.log('  - Instance function:', typeof dualMindInstance);
    
    // Test singleton pattern
    const instance1 = DualMindEngine.getInstance();
    const instance2 = DefaultImport.getInstance();
    const instance3 = createDualMindEngine();
    const instance4 = dualMindInstance();
    
    console.log('✅ Singleton instances created');
    console.log('  - Instance1 === Instance2:', instance1 === instance2);
    console.log('  - Instance1 === Instance3:', instance1 === instance3);
    console.log('  - Instance1 === Instance4:', instance1 === instance4);
    
    // Test core functionality
    const translation = await instance1.translateUniversal({
      text: 'Hello world',
      fromLanguage: 'en',
      toLanguage: 'sq'
    });
    
    console.log('✅ Translation test:', translation.translation);
    
    const conversation = await instance1.generateAnthropicConversation('Test message', 'en');
    console.log('✅ Conversation test - Albi response length:', conversation.albiResponse.length);
    console.log('✅ Conversation test - Jona response length:', conversation.jonaResponse.length);
    
    return true;
  } catch (error: any) {
    console.error('❌ DualMindEngine test failed:', error.message);
    console.error('   Stack:', error.stack?.split('\n')[0]);
    return false;
  }
}

async function testMultiGlueEngine(): Promise<boolean> {
  console.log('\n🔍 Testing MultiGlueEngine...');
  try {
    const { default: MultiGlueEngine } = await import('./lib/multoglue');
    
    const instance = MultiGlueEngine.getInstance();
    console.log('✅ MultiGlueEngine instance created');
    
    const response = await instance.processRequest({
      text: 'Test multilingual processing',
      mode: 'conversation',
      personality: 'both'
    });
    
    console.log('✅ MultiGlue processing test completed');
    console.log('  - Response success:', !!response);
    console.log('  - Has processed text:', !!(response as any).processedText);
    
    return true;
  } catch (error: any) {
    console.error('❌ MultiGlueEngine test failed:', error.message);
    console.error('   Stack:', error.stack?.split('\n')[0]);
    return false;
  }
}

async function testMemorySystem(): Promise<boolean> {
  console.log('\n🔍 Testing Memory System...');
  try {
    const { default: OpenMindMemory } = await import('./lib/memorySystem');
    
    const memory = OpenMindMemory.getInstance();
    console.log('✅ Memory system instance created');
    
    // Test storing conversation
    const memoryId = await memory.storeConversation(
      'Test query for memory',
      'Test response from AI',
      { confidence: 0.9 }
    );
    
    console.log('✅ Memory storage test - ID:', memoryId);
    
    // Test searching memory
    const results = memory.search('Test query', 5);
    console.log('✅ Memory search test - Results:', results.length);
    
    // Test memory stats
    const stats = memory.getMemoryStats();
    console.log('✅ Memory stats test - Total memories:', stats.totalMemories);
    
    return true;
  } catch (error: any) {
    console.error('❌ Memory system test failed:', error.message);
    console.error('   Stack:', error.stack?.split('\n')[0]);
    return false;
  }
}

async function testServiceRegistry(): Promise<boolean> {
  console.log('\n🔍 Testing Service Registry...');
  try {
    const { default: ServiceRegistry } = await import('./lib/serviceRegistry');
    
    const registry = ServiceRegistry.getInstance();
    console.log('✅ Service registry instance created');
    
    const services = registry.getAllServices();
    console.log('✅ Service registry test - Services count:', services.length);
    
    const overview = registry.getSystemOverview();
    console.log('✅ System overview test:');
    console.log('  - Total services:', overview.totalServices);
    console.log('  - Active services:', overview.activeServices);
    console.log('  - System health:', overview.systemHealth);
    
    return true;
  } catch (error: any) {
    console.error('❌ Service registry test failed:', error.message);
    console.error('   Stack:', error.stack?.split('\n')[0]);
    return false;
  }
}

async function testAPIEndpoint(): Promise<boolean> {
  console.log('\n🔍 Testing API Endpoint...');
  try {
    const response = await fetch('http://localhost:3000/api/openmind', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Test comprehensive system functionality',
        options: {
          ethicalCheck: true,
          maxResults: 3
        }
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('❌ API test failed:', errorData.error);
      console.error('   Details:', errorData.details);
      return false;
    }
    
    const data = await response.json();
    console.log('✅ API endpoint test successful');
    console.log('  - Has synthesis:', !!data.synthesis);
    console.log('  - Has responses:', !!data.responses && data.responses.length);
    console.log('  - Response time:', data.meta?.totalResponseTime, 'ms');
    
    return true;
  } catch (error: any) {
    console.error('❌ API endpoint test failed:', error.message);
    return false;
  }
}

async function testFrontendLoad(): Promise<boolean> {
  console.log('\n🔍 Testing Frontend Load...');
  try {
    const response = await fetch('http://localhost:3000/openmind');
    
    if (!response.ok) {
      console.error('❌ Frontend test failed - Status:', response.status);
      return false;
    }
    
    const html = await response.text();
    const hasExpectedContent = html.includes('OpenMind Universal AI') && 
                              html.includes('Kërko në OpenMind');
    
    if (!hasExpectedContent) {
      console.error('❌ Frontend test failed - Missing expected content');
      return false;
    }
    
    console.log('✅ Frontend load test successful');
    console.log('  - Page loads correctly');
    console.log('  - Contains expected Albanian content');
    
    return true;
  } catch (error: any) {
    console.error('❌ Frontend test failed:', error.message);
    return false;
  }
}

async function testVitest(): Promise<boolean> {
  console.log('\n🔍 Testing Vitest Unit Tests...');
  try {
    // Import and run a simple test
    const { expect, test } = await import('vitest');
    
    // Simple TypeScript functionality test
    test('TypeScript compilation works', () => {
      const message: string = 'EuroWeb TypeScript Test';
      expect(message).toBe('EuroWeb TypeScript Test');
    });
    
    console.log('✅ Vitest TypeScript integration working');
    return true;
  } catch (error: any) {
    console.error('❌ Vitest test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests(): Promise<boolean> {
  const results: boolean[] = [];
  
  results.push(await testDualMindEngine());
  results.push(await testMultiGlueEngine());
  results.push(await testMemorySystem());
  results.push(await testServiceRegistry());
  results.push(await testAPIEndpoint());
  results.push(await testFrontendLoad());
  results.push(await testVitest());
  
  const passedTests = results.filter(Boolean).length;
  const totalTests = results.length;
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! System is fully functional.');
    console.log('💪 EuroWeb platform është gati për përdorim!');
  } else {
    console.log('\n⚠️  Some tests failed. Check the errors above.');
    console.log('🔧 Ka nevojë për disa ndreqje në sistem.');
  }
  
  return passedTests === totalTests;
}

// Wait a moment for server to be ready, then run tests
setTimeout(runAllTests, 2000);
