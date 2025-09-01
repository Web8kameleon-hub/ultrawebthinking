#!/usr/bin/env node
/**
 * Web8 Attack Simulation CLI
 * Command-line interface për simulimin e sulmeve
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 */

import { 
  Web8AttackSimulator, 
  SimulationConfig,
  QuickTestConfig,
  ComprehensiveTestConfig,
  ExtremeTestConfig
} from '../security/attack-simulator';

interface CLIConfig {
  target?: string;
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  duration?: number;
  concurrent?: boolean;
  preset?: 'quick' | 'comprehensive' | 'extreme';
  output?: string;
  verbose?: boolean;
  help?: boolean;
}

class AttackSimulationCLI {
  private simulator: Web8AttackSimulator;

  constructor() {
    this.simulator = new Web8AttackSimulator();
  }

  /**
   * Parse command line arguments
   */
  private parseArgs(): CLIConfig {
    const args = process.argv.slice(2);
    const config: CLIConfig = {};

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const nextArg = args[i + 1];

      switch (arg) {
        case '--target':
        case '-t':
          config.target = nextArg;
          i++;
          break;
        case '--intensity':
        case '-i':
          config.intensity = nextArg as CLIConfig['intensity'];
          i++;
          break;
        case '--duration':
        case '-d':
          config.duration = parseInt(nextArg);
          i++;
          break;
        case '--concurrent':
        case '-c':
          config.concurrent = true;
          break;
        case '--preset':
        case '-p':
          config.preset = nextArg as CLIConfig['preset'];
          i++;
          break;
        case '--output':
        case '-o':
          config.output = nextArg;
          i++;
          break;
        case '--verbose':
        case '-v':
          config.verbose = true;
          break;
        case '--help':
        case '-h':
          config.help = true;
          break;
        default:
          if (arg.startsWith('-')) {
            console.error(`❌ Unknown option: ${arg}`);
            process.exit(1);
          }
      }
    }

    return config;
  }

  /**
   * Display help information
   */
  private showHelp(): void {
    console.log(`
🚨 Web8 Attack Simulation CLI v8.2.0

USAGE:
  yarn attack-sim [OPTIONS]

OPTIONS:
  -t, --target <url>        Target URL (default: http://localhost:3000)
  -i, --intensity <level>   Attack intensity: LOW, MEDIUM, HIGH, EXTREME (default: MEDIUM)
  -d, --duration <seconds>  Simulation duration in seconds (default: 30)
  -c, --concurrent          Run attacks concurrently
  -p, --preset <name>       Use preset configuration: quick, comprehensive, extreme
  -o, --output <file>       Save report to JSON file
  -v, --verbose             Verbose output
  -h, --help                Show this help

EXAMPLES:
  # Quick test with default settings
  yarn attack-sim --preset quick

  # Custom test against specific target
  yarn attack-sim --target https://api.ultrawebthinking.com --intensity HIGH --duration 60

  # Comprehensive test with concurrent attacks
  yarn attack-sim --preset comprehensive --concurrent --output report.json

  # Extreme test (requires careful consideration)
  yarn attack-sim --preset extreme --verbose

PRESETS:
  quick         - Basic security test (LOW-MEDIUM attacks, 30s)
  comprehensive - Full security audit (LOW-HIGH attacks, 120s)
  extreme       - Maximum intensity test (ALL attacks, 300s)

SECURITY NOTICE:
  ⚠️  Use this tool only on systems you own or have explicit permission to test.
  ⚠️  The extreme preset should only be used in testing environments.
  ⚠️  Always ensure proper safeguards are in place.

For more information, visit: https://github.com/Web8kameleon-hub/ultrawebthinking
`);
  }

  /**
   * Get simulation config based on CLI arguments
   */
  private getSimulationConfig(cliConfig: CLIConfig): SimulationConfig {
    // Use preset if specified
    if (cliConfig.preset) {
      switch (cliConfig.preset) {
        case 'quick':
          return { ...QuickTestConfig, targetUrl: cliConfig.target || QuickTestConfig.targetUrl };
        case 'comprehensive':
          return { ...ComprehensiveTestConfig, targetUrl: cliConfig.target || ComprehensiveTestConfig.targetUrl };
        case 'extreme':
          return { ...ExtremeTestConfig, targetUrl: cliConfig.target || ExtremeTestConfig.targetUrl };
      }
    }

    // Build custom config
    return {
      targetUrl: cliConfig.target || 'http://localhost:3000',
      intensity: cliConfig.intensity || 'MEDIUM',
      duration: cliConfig.duration || 30,
      concurrent: cliConfig.concurrent || false,
      logLevel: cliConfig.verbose ? 'DEBUG' : 'BASIC',
      safeguards: true
    };
  }

  /**
   * Save report to file
   */
  private async saveReport(report: any, filename: string): Promise<void> {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const outputPath = path.resolve(filename);
    const reportData = {
      ...report,
      generatedAt: new Date().toISOString(),
      generator: 'Web8 Attack Simulation CLI v8.2.0',
      author: 'Ledjan Ahmati'
    };

    await fs.writeFile(outputPath, JSON.stringify(reportData, null, 2));
    console.log(`📄 Report saved to: ${outputPath}`);
  }

  /**
   * Display summary in CLI format
   */
  private displaySummary(report: any): void {
    console.log('\n🔒 ========== SIMULATION SUMMARY ==========');
    console.log(`🎯 Target: ${report.config.targetUrl}`);
    console.log(`⏱️  Duration: ${report.duration.toFixed(2)}s`);
    console.log(`💥 Total Attacks: ${report.totalAttacks}`);
    console.log(`✅ Successfully Blocked: ${report.successfulBlocks}`);
    console.log(`❌ Failed to Block: ${report.failedBlocks}`);
    console.log(`🛡️  Security Score: ${report.summary.securityScore}%`);
    console.log(`⚡ Avg Response Time: ${report.averageResponseTime.toFixed(2)}ms`);

    if (report.summary.vulnerabilities.length > 0) {
      console.log('\n🚨 VULNERABILITIES DETECTED:');
      report.summary.vulnerabilities.forEach((vuln: string) => {
        console.log(`   ❗ ${vuln}`);
      });
    }

    if (report.summary.securityScore < 80) {
      console.log('\n💡 TOP RECOMMENDATIONS:');
      report.summary.recommendations.slice(0, 3).forEach((rec: string) => {
        console.log(`   💡 ${rec}`);
      });
    }

    // Security score interpretation
    if (report.summary.securityScore >= 95) {
      console.log('\n🏆 EXCELLENT: Your security is very strong!');
    } else if (report.summary.securityScore >= 80) {
      console.log('\n👍 GOOD: Security is solid with minor improvements needed.');
    } else if (report.summary.securityScore >= 60) {
      console.log('\n⚠️  WARNING: Significant security improvements required.');
    } else {
      console.log('\n🚨 CRITICAL: Immediate security attention required!');
    }

    console.log('\n=========================================\n');
  }

  /**
   * Main CLI execution
   */
  public async run(): Promise<void> {
    try {
      const cliConfig = this.parseArgs();

      if (cliConfig.help) {
        this.showHelp();
        return;
      }

      console.log('🚨 Web8 Attack Simulation CLI v8.2.0');
      console.log('🔒 Initializing security testing framework...\n');

      const simulationConfig = this.getSimulationConfig(cliConfig);

      // Safety confirmation for extreme tests
      if (simulationConfig.intensity === 'EXTREME') {
        console.log('⚠️  WARNING: You are about to run an EXTREME intensity test.');
        console.log('⚠️  This should only be used in testing environments.');
        console.log('⚠️  Press Ctrl+C to cancel or wait 5 seconds to continue...\n');
        
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

      console.log(`🎯 Target: ${simulationConfig.targetUrl}`);
      console.log(`💥 Intensity: ${simulationConfig.intensity}`);
      console.log(`⏱️  Duration: ${simulationConfig.duration}s`);
      console.log(`🔄 Concurrent: ${simulationConfig.concurrent ? 'Yes' : 'No'}`);
      console.log('\n🚀 Starting attack simulation...\n');

      // Show progress during execution
      const progressInterval = setInterval(() => {
        process.stdout.write('.');
      }, 1000);

      const report = await this.simulator.runSimulation(simulationConfig);
      
      clearInterval(progressInterval);
      console.log('\n\n✅ Simulation completed!\n');

      this.displaySummary(report);

      // Save report if requested
      if (cliConfig.output) {
        await this.saveReport(report, cliConfig.output);
      }

      // Exit with appropriate code based on security score
      const exitCode = report.summary.securityScore >= 80 ? 0 : 1;
      process.exit(exitCode);

    } catch (error) {
      console.error('\n❌ Simulation failed:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }
}

// Run CLI if this file is executed directly
if (process.argv[1] === new URL(import.meta.url).pathname || 
    process.argv[1] === new URL(import.meta.url).pathname.replace(/\//g, '\\')) {
  const cli = new AttackSimulationCLI();
  cli.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { AttackSimulationCLI };
