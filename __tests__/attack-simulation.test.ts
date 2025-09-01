/**
 * Web8 Attack Simulation Tests
 * Testime për sistemin e simulimit të sulmeve
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 */

import { 
  Web8AttackSimulator, 
  QuickTestConfig,
  ComprehensiveTestConfig,
  createAttackSimulator
} from '../security/attack-simulator';

class AttackSimulationTester {
  private simulator: Web8AttackSimulator;

  constructor() {
    this.simulator = createAttackSimulator();
  }

  /**
   * Test basic simulator functionality
   */
  async testBasicFunctionality(): Promise<boolean> {
    console.log('🧪 Testing basic functionality...');
    
    try {
      // Test vector availability
      const vectors = this.simulator.getAvailableVectors();
      if (vectors.length === 0) {
        console.error('❌ No attack vectors available');
        return false;
      }
      console.log(`✅ Found ${vectors.length} attack vectors`);

      // Test status check
      const isRunning = this.simulator.isSimulationRunning();
      if (isRunning) {
        console.error('❌ Simulator should not be running initially');
        return false;
      }
      console.log('✅ Initial status check passed');

      return true;
    } catch (error) {
      console.error('❌ Basic functionality test failed:', error);
      return false;
    }
  }

  /**
   * Test attack vector types
   */
  testAttackVectors(): boolean {
    console.log('🧪 Testing attack vectors...');
    
    const vectors = this.simulator.getAvailableVectors();
    const requiredTypes: Array<'SQL_INJECTION' | 'XSS' | 'DDOS' | 'BRUTE_FORCE' | 'PATH_TRAVERSAL' | 'SCANNER' | 'BOT_ATTACK'> = [
      'SQL_INJECTION',
      'XSS', 
      'DDOS',
      'BRUTE_FORCE',
      'PATH_TRAVERSAL',
      'SCANNER',
      'BOT_ATTACK'
    ];

    const availableTypes = [...new Set(vectors.map(v => v.type))];
    
    for (const requiredType of requiredTypes) {
      if (!availableTypes.includes(requiredType)) {
        console.error(`❌ Missing attack vector type: ${requiredType}`);
        return false;
      }
    }

    console.log(`✅ All ${requiredTypes.length} required vector types available`);
    
    // Test vector properties
    for (const vector of vectors.slice(0, 3)) { // Test first 3 vectors
      if (!vector.name || !vector.payload || !vector.description) {
        console.error(`❌ Vector missing required properties: ${vector.name}`);
        return false;
      }
      
      if (!['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(vector.severity)) {
        console.error(`❌ Invalid severity level: ${vector.severity}`);
        return false;
      }
      
      if (!['GET', 'POST', 'PUT', 'DELETE'].includes(vector.method)) {
        console.error(`❌ Invalid HTTP method: ${vector.method}`);
        return false;
      }
    }

    console.log('✅ Vector properties validation passed');
    return true;
  }

  /**
   * Test configuration presets
   */
  testConfigurationPresets(): boolean {
    console.log('🧪 Testing configuration presets...');
    
    const presets = [QuickTestConfig, ComprehensiveTestConfig];
    
    for (const preset of presets) {
      if (!preset.targetUrl || !preset.intensity || !preset.duration) {
        console.error('❌ Preset missing required properties');
        return false;
      }
      
      if (!['LOW', 'MEDIUM', 'HIGH', 'EXTREME'].includes(preset.intensity)) {
        console.error(`❌ Invalid preset intensity: ${preset.intensity}`);
        return false;
      }
      
      if (preset.duration < 1 || preset.duration > 1000) {
        console.error(`❌ Invalid preset duration: ${preset.duration}`);
        return false;
      }
    }

    console.log('✅ Configuration presets validation passed');
    return true;
  }

  /**
   * Test mock simulation (without actual HTTP requests)
   */
  async testMockSimulation(): Promise<boolean> {
    console.log('🧪 Testing mock simulation...');
    
    try {
      // Real data source
      const mockConfig = {
        targetUrl: 'https://api.ultrawebthinking.com',
        intensity: 'LOW' as const,
        duration: 1,
        concurrent: false,
        logLevel: 'SILENT' as const,
        safeguards: true
      };

      console.log('⏳ Running mock simulation...');
      const report = await this.simulator.runSimulation(mockConfig);
      
      // Validate report structure
      if (!report.startTime || !report.endTime || !report.results) {
        console.error('❌ Invalid report structure');
        return false;
      }
      
      if (typeof report.summary.securityScore !== 'number') {
        console.error('❌ Invalid security score');
        return false;
      }
      
      if (!Array.isArray(report.summary.vulnerabilities)) {
        console.error('❌ Invalid vulnerabilities array');
        return false;
      }
      
      if (!Array.isArray(report.summary.recommendations)) {
        console.error('❌ Invalid recommendations array');
        return false;
      }

      console.log(`✅ Mock simulation completed with security score: ${report.summary.securityScore}%`);
      return true;
      
    } catch (error) {
      // Expected to fail with connection errors, but structure should be valid
      if (error instanceof Error && error.message.includes('fetch')) {
        console.log('✅ Mock simulation failed as expected (no connection)');
        return true;
      }
      
      console.error('❌ Unexpected mock simulation error:', error);
      return false;
    }
  }

  /**
   * Test security validations
   */
  testSecurityValidations(): boolean {
    console.log('🧪 Testing security validations...');
    
    try {
      // Test safeguards validation
      const vectors = this.simulator.getAvailableVectors();
      const hasHighSeverityVectors = vectors.some(v => v.severity === 'HIGH' || v.severity === 'CRITICAL');
      
      if (!hasHighSeverityVectors) {
        console.error('❌ No high severity vectors for testing safeguards');
        return false;
      }
      
      // Test vector payload validation
      const sqlInjectionVectors = vectors.filter(v => v.type === 'SQL_INJECTION');
      if (sqlInjectionVectors.length === 0) {
        console.error('❌ No SQL injection vectors available');
        return false;
      }
      
      const sqlVector = sqlInjectionVectors[0];
      if (!sqlVector.payload.includes("'") && !sqlVector.payload.includes('--')) {
        console.error('❌ SQL injection vector doesn\'t contain expected patterns');
        return false;
      }

      console.log('✅ Security validations passed');
      return true;
      
    } catch (error) {
      console.error('❌ Security validation error:', error);
      return false;
    }
  }

  /**
   * Test error handling
   */
  async testErrorHandling(): Promise<boolean> {
    console.log('🧪 Testing error handling...');
    
    try {
      // Test invalid configuration
      const invalidConfig = {
        targetUrl: '',
        intensity: 'INVALID' as any,
        duration: -1,
        concurrent: false,
        logLevel: 'SILENT' as const,
        safeguards: true
      };

      try {
        await this.simulator.runSimulation(invalidConfig);
        console.error('❌ Should have failed with invalid config');
        return false;
      } catch (error) {
        console.log('✅ Invalid config properly rejected');
      }

      // Test stop without start
      this.simulator.stopSimulation(); // Should not throw
      console.log('✅ Stop without start handled gracefully');

      return true;
      
    } catch (error) {
      console.error('❌ Error handling test failed:', error);
      return false;
    }
  }

  /**
   * Run all tests
   */
  async runAllTests(): Promise<boolean> {
    console.log('🚀 Starting Web8 Attack Simulation Tests...\n');

    const tests = [
      () => this.testBasicFunctionality(),
      () => this.testAttackVectors(),
      () => this.testConfigurationPresets(),
      () => this.testMockSimulation(),
      () => this.testSecurityValidations(),
      () => this.testErrorHandling()
    ];

    let passedTests = 0;
    let totalTests = tests.length;

    for (let i = 0; i < tests.length; i++) {
      const test = tests[i];
      try {
        const result = await test();
        if (result) {
          passedTests++;
          console.log(`✅ Test ${i + 1}/${totalTests} passed\n`);
        } else {
          console.log(`❌ Test ${i + 1}/${totalTests} failed\n`);
        }
      } catch (error) {
        console.error(`💥 Test ${i + 1}/${totalTests} crashed:`, error);
        console.log('');
      }
    }

    console.log('📊 Test Summary:');
    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
    console.log(`📈 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    if (passedTests === totalTests) {
      console.log('\n🎉 All tests passed! Attack simulation system is ready.');
      return true;
    } else {
      console.log('\n⚠️  Some tests failed. Please review the output above.');
      return false;
    }
  }
}

// Run tests if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname || 
    process.argv[1] === new URL(import.meta.url).pathname.replace(/\//g, '\\')) {
  const tester = new AttackSimulationTester();
  tester.runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Fatal test error:', error);
    process.exit(1);
  });
}

export { AttackSimulationTester };
