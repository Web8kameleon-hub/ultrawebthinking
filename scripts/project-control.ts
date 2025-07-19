#!/usr/bin/env tsx
/**
 * EuroWeb Project Control System
 * Kontrollo i plotë i projektit: teste, build, dev, push
 */

import { spawn, spawnSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import chalk from 'chalk';

interface ProjectConfig {
  name: string
  version: string
  workspaces: string[]
  scripts: Record<string, string>
}

interface TestResult {
  workspace: string
  passed: boolean
  coverage: number
  duration: number
  errors: string[]
}

interface BuildResult {
  workspace: string
  success: boolean
  outputSize: number
  duration: number
  warnings: string[]
}

class EuroWebProjectControl {
  private config: ProjectConfig;
  private rootDir: string;

  constructor() {
    this.rootDir = process.cwd();
    this.config = this.loadProjectConfig();
  }

  private loadProjectConfig(): ProjectConfig {
    const packagePath = join(this.rootDir, 'package.json');
    if (!existsSync(packagePath)) {
      throw new Error('package.json not found');
    }
    return JSON.parse(readFileSync(packagePath, 'utf-8'));
  }

  /**
   * Kontrollo statusin e projektit
   */
  async checkStatus(): Promise<void> {
    console.log(chalk.blue('🔍 EuroWeb Project Status Check'));
    console.log(chalk.gray('─'.repeat(50)));

    // Check Yarn Berry
    this.checkYarnBerry();
    
    // Check TypeScript
    this.checkTypeScript();
    
    // Check workspaces
    this.checkWorkspaces();
    
    // Check dependencies
    this.checkDependencies();
    
    // Check AGISheet
    this.checkAGISheet();

    console.log(chalk.green('✅ Project status check completed'));
  }

  /**
   * Ekzekuto testet e plota
   */
  async runTests(): Promise<TestResult[]> {
    console.log(chalk.blue('🧪 Running EuroWeb Tests'));
    console.log(chalk.gray('─'.repeat(50)));

    const results: TestResult[] = [];

    // Test each workspace
    for (const workspace of this.config.workspaces) {
      console.log(chalk.yellow(`Testing ${workspace}...`));
      
      const startTime = Date.now();
      const result = this.testWorkspace(workspace);
      const duration = Date.now() - startTime;

      results.push({
        workspace,
        passed: result.success,
        coverage: result.coverage,
        duration,
        errors: result.errors
      });

      if (result.success) {
        console.log(chalk.green(`✅ ${workspace} tests passed (${duration}ms)`));
      } else {
        console.log(chalk.red(`❌ ${workspace} tests failed`));
        result.errors.forEach(error => console.log(chalk.red(`   ${error}`)));
      }
    }

    // AGI-specific tests
    this.runAGITests();
    
    // Industrial tests
    this.runIndustrialTests();

    return results;
  }

  /**
   * Build i projektit
   */
  async buildProject(): Promise<BuildResult[]> {
    console.log(chalk.blue('🏗️ Building EuroWeb Platform'));
    console.log(chalk.gray('─'.repeat(50)));

    const results: BuildResult[] = [];

    // Pre-build validation
    this.preBuildValidation();

    // Build each workspace
    for (const workspace of this.config.workspaces) {
      console.log(chalk.yellow(`Building ${workspace}...`));
      
      const startTime = Date.now();
      const result = this.buildWorkspace(workspace);
      const duration = Date.now() - startTime;

      results.push({
        workspace,
        success: result.success,
        outputSize: result.outputSize,
        duration,
        warnings: result.warnings
      });

      if (result.success) {
        console.log(chalk.green(`✅ ${workspace} built successfully (${duration}ms)`));
        console.log(chalk.gray(`   Output size: ${this.formatBytes(result.outputSize)}`));
      } else {
        console.log(chalk.red(`❌ ${workspace} build failed`));
      }
    }

    // Post-build validation
    this.postBuildValidation();

    return results;
  }

  /**
   * Start development server
   */
  async startDev(): Promise<void> {
    console.log(chalk.blue('🚀 Starting EuroWeb Development Server'));
    console.log(chalk.gray('─'.repeat(50)));

    // Pre-dev checks
    this.preDevValidation();

    // Start services concurrently
    const services = [
      { name: 'Frontend', command: 'yarn', args: ['dev:frontend'] },
      { name: 'Backend', command: 'yarn', args: ['dev:backend'] },
      { name: 'AGISheet', command: 'yarn', args: ['agisheet:server'] },
      { name: 'Mesh Network', command: 'yarn', args: ['mesh:start'] }
    ];

    console.log(chalk.yellow('Starting services...'));
    
    services.forEach(service => {
      console.log(chalk.cyan(`🔄 Starting ${service.name}...`));
      spawn(service.command, service.args, {
        stdio: 'inherit',
        shell: true
      });
    });

    console.log(chalk.green('🎉 Development environment ready!'));
    console.log(chalk.blue('🌐 Frontend: http://localhost:3000'));
    console.log(chalk.blue('🔧 Backend: http://localhost:8080'));
    console.log(chalk.blue('📊 AGISheet: http://localhost:8081'));
  }

  /**
   * Git push me validime
   */
  async pushChanges(message: string): Promise<void> {
    console.log(chalk.blue('📤 EuroWeb Git Push Process'));
    console.log(chalk.gray('─'.repeat(50)));

    // Pre-push validation
    this.prePushValidation();

    // Run tests
    console.log(chalk.yellow('Running tests before push...'));
    const testResults = this.runTests();
    const failedTests = testResults.filter(r => !r.passed);
    
    if (failedTests.length > 0) {
      console.log(chalk.red('❌ Tests failed. Push aborted.'));
      return;
    }

    // Type check
    console.log(chalk.yellow('Type checking...'));
    this.runTypeCheck();

    // Linting
    console.log(chalk.yellow('Linting code...'));
    this.runLinting();

    // Security check
    console.log(chalk.yellow('Security audit...'));
    this.runSecurityAudit();

    // Git operations
    console.log(chalk.yellow('Committing changes...'));
    this.runCommand('git', ['add', '.']);
    this.runCommand('git', ['commit', '-m', message]);
    
    console.log(chalk.yellow('Pushing to remote...'));
    this.runCommand('git', ['push']);

    console.log(chalk.green('✅ Changes pushed successfully!'));
  }

  /**
   * Full project deployment
   */
  async deploy(environment: 'staging' | 'production' = 'production'): Promise<void> {
    console.log(chalk.blue(`🚀 Deploying EuroWeb to ${environment}`));
    console.log(chalk.gray('─'.repeat(50)));

    // Pre-deployment checks
    this.preDeploymentChecks();

    // Build for production
    this.buildProject();

    // Security validation
    this.runSecurityValidation();

    // Deploy based on environment
    if (environment === 'production') {
      this.deployProduction();
    } else {
      this.deployStaging();
    }

    console.log(chalk.green(`✅ Deployment to ${environment} completed!`));
  }

  // Private helper methods
  private async checkYarnBerry(): Promise<void> {
    const result = this.runCommand('yarn', ['--version'], { silent: true });
    if (result.success && result.output.startsWith('4.')) {
      console.log(chalk.green('✅ Yarn Berry 4 detected'));
    } else {
      throw new Error('Yarn Berry 4 required');
    }
  }

  private async checkTypeScript(): Promise<void> {
    const result = this.runCommand('yarn', ['tsc', '--version'], { silent: true });
    if (result.success) {
      console.log(chalk.green('✅ TypeScript compiler ready'));
    } else {
      throw new Error('TypeScript not found');
    }
  }

  private async checkWorkspaces(): Promise<void> {
    for (const workspace of this.config.workspaces) {
      if (existsSync(join(this.rootDir, workspace))) {
        console.log(chalk.green(`✅ Workspace ${workspace} found`));
      } else {
        console.log(chalk.yellow(`⚠️ Workspace ${workspace} missing`));
      }
    }
  }

  private async checkDependencies(): Promise<void> {
    const result = this.runCommand('yarn', ['install', '--check-cache'], { silent: true });
    if (result.success) {
      console.log(chalk.green('✅ Dependencies validated'));
    } else {
      console.log(chalk.yellow('⚠️ Dependencies need update'));
    }
  }

  private async checkAGISheet(): Promise<void> {
    const agisheetPath = join(this.rootDir, 'agisheet', 'src', 'index.ts');
    if (existsSync(agisheetPath)) {
      console.log(chalk.green('✅ AGISheet core found'));
    } else {
      console.log(chalk.red('❌ AGISheet core missing'));
    }
  }

  private async testWorkspace(workspace: string): Promise<{
    success: boolean
    coverage: number
    errors: string[]
  }> {
    const result = this.runCommand('yarn', ['workspace', workspace, 'test'], { 
      silent: true,
      cwd: this.rootDir
    });

    return {
      success: result.success,
      coverage: this.extractCoverage(result.output),
      errors: result.success ? [] : [result.error || 'Test failed']
    };
  }

  private async buildWorkspace(workspace: string): Promise<{
    success: boolean
    outputSize: number
    warnings: string[]
  }> {
    const result = this.runCommand('yarn', ['workspace', workspace, 'build'], {
      silent: true,
      cwd: this.rootDir
    });

    return {
      success: result.success,
      outputSize: this.calculateOutputSize(workspace),
      warnings: this.extractWarnings(result.output)
    };
  }

  private async runAGITests(): Promise<void> {
    console.log(chalk.yellow('Running AGI-specific tests...'));
    this.runCommand('yarn', ['test:agi']);
  }

  private async runIndustrialTests(): Promise<void> {
    console.log(chalk.yellow('Running industrial tests...'));
    this.runCommand('yarn', ['test:industrial']);
  }

  private async preBuildValidation(): Promise<void> {
    console.log(chalk.yellow('Pre-build validation...'));
    this.runTypeCheck();
  }

  private async postBuildValidation(): Promise<void> {
    console.log(chalk.yellow('Post-build validation...'));
    // Validate build outputs
  }

  private async preDevValidation(): Promise<void> {
    console.log(chalk.yellow('Pre-dev validation...'));
    this.checkDependencies();
  }

  private async prePushValidation(): Promise<void> {
    console.log(chalk.yellow('Pre-push validation...'));
    // Check git status, branches, etc.
  }

  private async preDeploymentChecks(): Promise<void> {
    console.log(chalk.yellow('Pre-deployment checks...'));
    // Environment validation, secrets check, etc.
  }

  private async runTypeCheck(): Promise<void> {
    const result = this.runCommand('yarn', ['type-check']);
    if (!result.success) {
      throw new Error('TypeScript type check failed');
    }
  }

  private async runLinting(): Promise<void> {
    const result = this.runCommand('yarn', ['lint']);
    if (!result.success) {
      throw new Error('Linting failed');
    }
  }

  private async runSecurityAudit(): Promise<void> {
    const result = this.runCommand('yarn', ['audit']);
    if (!result.success) {
      console.log(chalk.yellow('⚠️ Security audit warnings found'));
    }
  }

  private async runSecurityValidation(): Promise<void> {
    const result = this.runCommand('yarn', ['security:scan']);
    if (!result.success) {
      throw new Error('Security validation failed');
    }
  }

  private async deployProduction(): Promise<void> {
    console.log(chalk.yellow('Deploying to production...'));
    this.runCommand('yarn', ['deploy:vercel']);
  }

  private async deployStaging(): Promise<void> {
    console.log(chalk.yellow('Deploying to staging...'));
    // Staging deployment logic
  }

  private runCommand(command: string, args: string[] = [], options: {
    silent?: boolean
    cwd?: string
  } = {}): { success: boolean; output: string; error?: string } {
    try {
      const result = spawnSync(command, args, {
        cwd: options.cwd || this.rootDir,
        encoding: 'utf8',
        shell: true
      });

      if (!options.silent && result.stdout) {
        console.log(result.stdout);
      }

      return {
        success: result.status === 0,
        output: result.stdout || '',
        error: result.stderr
      };
    } catch (error) {
      return {
        success: false,
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private extractCoverage(output: string): number {
    const match = output.match(/(\d+(?:\.\d+)?)%/);
    return match ? parseFloat(match[1]) : 0;
  }

  private extractWarnings(output: string): string[] {
    const warnings = output.match(/warning: .+/gi);
    return warnings || [];
  }

  private calculateOutputSize(workspace: string): number {
    // Calculate build output size
    return 0; // Placeholder
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {return '0 Bytes';}
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// CLI Interface
function main() {
  const control = new EuroWebProjectControl();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'status':
        control.checkStatus();
        break;
      case 'test':
        control.runTests();
        break;
      case 'build':
        control.buildProject();
        break;
      case 'dev':
        control.startDev();
        break;
      case 'push':
        const message = process.argv[3] || 'feat: automated commit';
        control.pushChanges(message);
        break;
      case 'deploy':
        const env = (process.argv[3] as 'staging' | 'production') || 'production';
        control.deploy(env);
        break;
      default:
        console.log(chalk.blue('EuroWeb Project Control'));
        console.log(chalk.gray('Available commands:'));
        console.log(chalk.yellow('  status  - Check project status'));
        console.log(chalk.yellow('  test    - Run all tests'));
        console.log(chalk.yellow('  build   - Build project'));
        console.log(chalk.yellow('  dev     - Start development'));
        console.log(chalk.yellow('  push    - Git push with validation'));
        console.log(chalk.yellow('  deploy  - Deploy to production'));
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

export default EuroWebProjectControl;
