/**
 * Test DualMind Engine Response Generation
 */
import DualMindEngine from './lib/dualMindEngine';

async function testDualMindResponses() {
  console.log('🧠 Testing DualMind Engine Response Generation...\n');
  
  const dualMind = DualMindEngine.getInstance();
  
  // Test 1: Albanian greeting "pershendetje"
  console.log('Test 1: Albanian greeting "pershendetje"');
  try {
    const response1 = await dualMind.generateAnthropicConversation('pershendetje!', 'sq');
    console.log('✅ ALBI Response:', response1.albiResponse);
    console.log('✅ JONA Response:', response1.jonaResponse);
    console.log('✅ Synthesis:', response1.sharedInsight);
    console.log('---');
  } catch (error) {
    console.error('❌ Error 1:', error);
  }
  
  // Test 2: English greeting
  console.log('Test 2: English greeting "hello"');
  try {
    const response2 = await dualMind.generateAnthropicConversation('hello', 'en');
    console.log('✅ ALBI Response:', response2.albiResponse);
    console.log('✅ JONA Response:', response2.jonaResponse);
    console.log('✅ Synthesis:', response2.sharedInsight);
    console.log('---');
  } catch (error) {
    console.error('❌ Error 2:', error);
  }
  
  // Test 3: General question
  console.log('Test 3: General question');
  try {
    const response3 = await dualMind.generateAnthropicConversation('What is artificial intelligence?', 'en');
    console.log('✅ ALBI Response:', response3.albiResponse);
    console.log('✅ JONA Response:', response3.jonaResponse);
    console.log('✅ Synthesis:', response3.sharedInsight);
  } catch (error) {
    console.error('❌ Error 3:', error);
  }
}

testDualMindResponses().catch(console.error);
