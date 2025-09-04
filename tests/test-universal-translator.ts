/**
 * Test Universal Translation Engine
 * Testimi i Motorit Universal të Përkthimit
 */

import UniversalTranslationEngine from './lib/universalTranslationEngine';

async function testUniversalTranslation() {
  console.log('🌍 Testing Universal Translation Engine...\n');
  
  const translator = UniversalTranslationEngine.getInstance();
  
  // Test 1: Albanian language detection
  console.log('Test 1: Albanian language detection');
  try {
    const detected1 = await translator.detectLanguage('pershendetje! si jeni?');
    console.log('✅ Detected:', detected1.nativeName, `(${detected1.code})`, `- Confidence: ${detected1.confidence}%`);
    
    const detected2 = await translator.detectLanguage('tani si mund te pergjigjesh?');
    console.log('✅ Detected:', detected2.nativeName, `(${detected2.code})`, `- Confidence: ${detected2.confidence}%`);
    console.log('---');
  } catch (error) {
    console.error('❌ Error 1:', error);
  }
  
  // Test 2: Albanian to English translation
  console.log('Test 2: Albanian to English translation');
  try {
    const result1 = await translator.translateText({
      text: 'pershendetje! si jeni?',
      toLanguage: 'en',
      mode: 'casual'
    });
    console.log('✅ Original (Albanian):', result1.originalText);
    console.log('✅ Translated (English):', result1.translatedText);
    console.log('✅ From:', result1.fromLanguage.nativeName, 'To:', result1.toLanguage.nativeName);
    if (result1.culturalNotes) {
      console.log('🏛️ Cultural Notes:', result1.culturalNotes);
    }
    console.log('---');
  } catch (error) {
    console.error('❌ Error 2:', error);
  }
  
  // Test 3: English to Albanian translation
  console.log('Test 3: English to Albanian translation');
  try {
    const result2 = await translator.translateText({
      text: 'Hello! How can you help me?',
      toLanguage: 'sq',
      mode: 'formal'
    });
    console.log('✅ Original (English):', result2.originalText);
    console.log('✅ Translated (Albanian):', result2.translatedText);
    console.log('✅ From:', result2.fromLanguage.nativeName, 'To:', result2.toLanguage.nativeName);
    console.log('---');
  } catch (error) {
    console.error('❌ Error 3:', error);
  }
  
  // Test 4: Multiple language detection
  console.log('Test 4: Multiple language detection');
  const testTexts = [
    'Hello world',
    'Bonjour le monde',
    'Hola mundo',
    'Привет мир',
    'こんにちは世界',
    'مرحبا بالعالم',
    'Guten Tag Welt'
  ];
  
  for (const text of testTexts) {
    try {
      const detected = await translator.detectLanguage(text);
      console.log(`✅ "${text}" -> ${detected.nativeName} (${detected.code}) - ${detected.confidence}%`);
    } catch (error) {
      console.error(`❌ Error detecting "${text}":`, error);
    }
  }
  
  console.log('\n🎉 Universal Translation Engine test completed!');
}

testUniversalTranslation().catch(console.error);
