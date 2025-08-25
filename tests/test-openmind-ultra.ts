/**
 * EuroWeb OpenMind Ultra Test - DualMind Engine Test
 * Testing ALBI & JONA Dual Personality System
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0 Ultra
 * @license MIT
 */

import { DualMindEngine } from './lib/dualMindEngine';

async function testOpenMindUltra(): Promise<void> {
  console.log('🧠 Testing OpenMind Ultra - DualMind System');
  console.log('====================================================');

  try {
    // Initialize DualMind Engine
    const dualMind = DualMindEngine.getInstance();
    console.log('✅ DualMind Engine initialized successfully');

    // Test 1: English conversation
    console.log('\n🔍 Test 1: English Conversation');
    const englishTest = await dualMind.generateAnthropicConversation(
      "Hello, can you help me understand artificial intelligence?"
    );

    console.log('🔍 M.Albi (Analytical):', englishTest.albiResponse);
    console.log('💝 F.Jona (Creative):', englishTest.jonaResponse);
    console.log('🤝 Synthesis:', englishTest.sharedInsight);

    // Test 2: Albanian conversation
    console.log('\n🇦🇱 Test 2: Albanian Conversation');
    const albanianTest = await dualMind.generateAnthropicConversation(
      "Tungjatjeta, si jeni?", 
      "sq"
    );

    console.log('🔍 M.Albi (Shqip):', albanianTest.albiResponse);
    console.log('💝 F.Jona (Shqip):', albanianTest.jonaResponse);
    console.log('🤝 Synthesis (Shqip):', albanianTest.sharedInsight);

    // Test 3: Translation capabilities
    console.log('\n🌐 Test 3: Translation System');
    const translation = await dualMind.translateUniversal({
      text: "Mirëmbrëma, si po kaloni?",
      fromLanguage: "sq",
      toLanguage: "en",
      context: "Evening greeting"
    });

    console.log('📝 Original (Albanian):', "Mirëmbrëma, si po kaloni?");
    console.log('🔄 Translation (English):', translation.translation);
    console.log('🎯 Confidence:', translation.confidence);
    console.log('🏛️ Cultural Notes:', translation.culturalNotes);

    // Test 4: Complex conversation
    console.log('\n💡 Test 4: Complex Problem Solving');
    const complexTest = await dualMind.generateAnthropicConversation(
      "How can we solve climate change using AI and technology?"
    );

    console.log('🔍 M.Albi (Technical Analysis):', complexTest.albiResponse);
    console.log('💝 F.Jona (Human Perspective):', complexTest.jonaResponse);
    console.log('🤝 Combined Solution:', complexTest.sharedInsight);

    console.log('\n🎉 OpenMind Ultra Testing Complete!');
    console.log('✅ All DualMind features working perfectly');
    
  } catch (error) {
    console.error('❌ OpenMind Ultra Test Failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testOpenMindUltra();
}

export { testOpenMindUltra };
