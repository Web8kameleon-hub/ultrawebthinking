/**
 * Web8 Security Test Suite
 * SAFE testing të moduleve të sigurisë pa rrezik për projektin
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-SECURITY-TEST
 */

import BrokenMirror from './broken-mirror';
import CloseMirror from './close-mirror';
import OutMirror from './out-mirror';
import IntrusionResponder from './intrusion-responder';

export class SecurityTester {
  
  /**
   * Test Broken Mirror with sample code
   */
  public static testBrokenMirror(): void {
    console.log('\n🔮 Testing Broken Mirror...');
    
    const sampleCode = `
function originalFunction() {
  if (user.isAdmin === true) {
    return "Secret admin data";
  }
  return "Public data";
}
`;

    const brokenMirror = new BrokenMirror({
      zombieRatio: 0.4,
      distortionLevel: 'EXTREME'
    });

    const preview = brokenMirror.previewTransformation(sampleCode);
    console.log('🔮 Broken Mirror Preview:');
    console.log(`${preview.substring(0, 300)  }...`);
    console.log('✅ Broken Mirror test completed (no files created)');
  }

  /**
   * Test Close Mirror with sample code
   */
  public static testCloseMirror(): void {
    console.log('\n🛡️ Testing Close Mirror...');
    
    const sampleCode = `
const secretKey = "ultra-secret-key";
function authenticate(password) {
  return password === secretKey;
}
`;

    const closeMirror = new CloseMirror({
      layers: 2,
      debugProtection: true
    });

    const preview = closeMirror.previewProtection(sampleCode);
    console.log('🛡️ Close Mirror Preview:');
    console.log(`${preview.substring(0, 400)  }...`);
    console.log('✅ Close Mirror test completed (no files created)');
  }

  /**
   * Test Out Mirror with sample HTML
   */
  public static testOutMirror(): void {
    console.log('\n🧼 Testing Out Mirror...');
    
    const sampleHTML = `
<!DOCTYPE html>
<html>
<head>
  <title>Test Page</title>
</head>
<body>
  <script src="https://evil-domain.com/malicious.js"></script>
  <script>alert("inline script")</script>
  <div onclick="dangerousFunction()">Click me</div>
</body>
</html>
`;

    const outMirror = new OutMirror({
      whitelistCDNs: ['https://cdn.jsdelivr.net'],
      generateCSP: true
    });

    const analysis = outMirror.analyzeHTML(sampleHTML);
    console.log('🧼 Security Analysis:', analysis);

    const preview = outMirror.previewSecurity(sampleHTML);
    console.log('🧼 Out Mirror Preview:');
    console.log(`${preview.substring(0, 400)  }...`);
    console.log('✅ Out Mirror test completed (no files created)');
  }

  /**
   * Test Intrusion Responder
   */
  public static testIntrusionResponder(): void {
    console.log('\n🚨 Testing Intrusion Responder...');
    
    const responder = IntrusionResponder.getInstance({
      sensitivityLevel: 'LOW',
      responseMode: 'LOG',
      allowedDevTools: true
    });

    console.log('🚨 Intrusion Responder configured');
    console.log('🚨 In browser environment, call responder.startMonitoring()');
    
    const report = responder.getIntrusionReport();
    console.log('🚨 Current report:', report);
    console.log('✅ Intrusion Responder test completed');
  }

  /**
   * Run all security tests safely
   */
  public static runAllTests(): void {
    console.log('🛡️ Starting Web8 Security Test Suite...');
    console.log('⚠️ These tests are SAFE and create no files');
    
    try {
      this.testBrokenMirror();
      this.testCloseMirror();
      this.testOutMirror();
      this.testIntrusionResponder();
      
      console.log('\n✅ All security tests completed successfully!');
      console.log('📁 No files were created or modified');
      console.log('🔒 Your project remains untouched');
      
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  SecurityTester.runAllTests();
}

export default SecurityTester;
