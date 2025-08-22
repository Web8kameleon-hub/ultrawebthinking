/**
 * Test i thjeshtë për AGI Core Integration
 * @author EuroWeb Platform
 */

import { AGICoreService } from './agi/index';

// Test AGI Core Service
async function testAGICore() {
  console.log('🚀 Testing AGI Core Service...');
  
  try {
    // Create instance
    const agiCore = new AGICoreService({
      modelVersion: '8.0.0-Test',
      maxContextLength: 64000,
      temperature: 0.5,
      learningRate: 0.001,
      memoryCapacity: 100000,
      processingNodes: 4
    });

    console.log('✅ AGI Core instance created');

    // Test activation
    const activated = await agiCore.activate();
    console.log(`✅ AGI Core activated: ${activated}`);

    // Test system status
    const status = agiCore.getSystemStatus();
    console.log('✅ System status:', status);

    // Test task processing
    const taskId = await agiCore.processTask({
      type: 'generation',
      input: 'Test AGI functionality'
    });
    console.log(`✅ Task processed with ID: ${taskId}`);

    // Test memory storage
    const memoryId = await agiCore.storeMemory({
      type: 'semantic',
      content: 'AGI test completed successfully',
      importance: 80,
      associations: ['test', 'agi', 'success']
    });
    console.log(`✅ Memory stored with ID: ${memoryId}`);

    // Test memory query
    const memories = await agiCore.queryMemory('test', 5);
    console.log(`✅ Memory query returned ${memories.length} results`);

    // Test deactivation
    const deactivated = await agiCore.deactivate();
    console.log(`✅ AGI Core deactivated: ${deactivated}`);

    console.log('🎉 All AGI Core tests passed!');
    return true;

  } catch (error) {
    console.error('❌ AGI Core test failed:', error);
    return false;
  }
}

// Run test if called directly
if (require.main === module) {
  testAGICore()
    .then(success => {
      process.exit(success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

export { testAGICore };
