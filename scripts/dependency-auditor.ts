#!/usr/bin/env tsx

/**
 * 🔍 COMPREHENSIVE MODULE, LIBRARY & PACKAGE DEPENDENCY AUDITOR
 * Kontrollon të gjitha modulet, filet, libraritë dhe paketat e munguara
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-DEPENDENCY-AUDIT
 * @license MIT
 */

import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PROJECT_ROOT = process.cwd();

interface DependencyAuditReport {
  missingFiles: {
    core: string[];
    components: string[];
    libraries: string[];
    utilities: string[];
    types: string[];
  };
  missingPackages: {
    required: string[];
    recommended: string[];
    devDependencies: string[];
  };
  brokenImports: {
    file: string;
    import: string;
    reason: string;
  }[];
  unusedDependencies: string[];
  outdatedPackages: {
    package: string;
    current: string;
    latest: string;
  }[];
  recommendations: string[];
  score: number;
}

/**
 * 🎯 DEPENDENCY AUDITOR CLASS
 */
class DependencyAuditor {
  private report: DependencyAuditReport = {
    missingFiles: {
      core: [],
      components: [],
      libraries: [],
      utilities: [],
      types: []
    },
    missingPackages: {
      required: [],
      recommended: [],
      devDependencies: []
    },
    brokenImports: [],
    unusedDependencies: [],
    outdatedPackages: [],
    recommendations: [],
    score: 0
  };

  /**
   * 🔍 MAIN AUDIT EXECUTION
   */
  public async performAudit(): Promise<DependencyAuditReport> {
    console.log('🔍 COMPREHENSIVE DEPENDENCY AUDIT STARTING...\n');

    await this.auditMissingFiles();
    await this.auditMissingPackages();
    await this.auditBrokenImports();
    await this.auditUnusedDependencies();
    await this.auditOutdatedPackages();
    await this.generateRecommendations();
    this.calculateScore();

    return this.report;
  }

  /**
   * 📁 AUDIT MISSING FILES
   */
  private async auditMissingFiles(): Promise<void> {
    console.log('📁 Auditing Missing Files...');

    // Core files që duhet të ekzistojnë
    const coreFiles = [
      'lib/NeuralPlanner.ts',
      'lib/EthicalNeuralPlanner.ts',
      'lib/FluidArchitecture.ts',
      'lib/validator.ts',
      'lib/LaserController.ts',
      'lib/web8-utils.ts',
      'middleware.ts',
      'next.config.mts',
      'vitest.config.ts'
    ];

    for (const file of coreFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.missingFiles.core.push(file);
      }
    }

    // Components të nevojshme
    const componentFiles = [
      'components/LazyLoader.tsx',
      'components/Web8TabSystem.tsx',
      'components/GuardianMonitor.tsx',
      'components/AGIStatusIndicator.tsx',
      'components/BrowserLayout.tsx'
    ];

    for (const file of componentFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.missingFiles.components.push(file);
      }
    }

    // Libraries dhe utilities
    const utilityFiles = [
      'utils/themeController.ts',
      'utils/web8-utils.ts',
      'lib/memory-manager.ts',
      'lib/cache-controller.ts',
      'lib/state-manager.ts'
    ];

    for (const file of utilityFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.missingFiles.utilities.push(file);
      }
    }

    // Type definitions
    const typeFiles = [
      'types/neural.types.ts',
      'types/fluid.types.ts',
      'types/guardian.types.ts',
      'types/api.types.ts',
      'types/css-modules.d.ts'
    ];

    for (const file of typeFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.missingFiles.types.push(file);
      }
    }

    console.log(`📁 Core files missing: ${this.report.missingFiles.core.length}`);
    console.log(`📁 Component files missing: ${this.report.missingFiles.components.length}`);
    console.log(`📁 Utility files missing: ${this.report.missingFiles.utilities.length}`);
    console.log(`📁 Type files missing: ${this.report.missingFiles.types.length}`);
  }

  /**
   * 📦 AUDIT MISSING PACKAGES
   */
  private async auditMissingPackages(): Promise<void> {
    console.log('\n📦 Auditing Missing Packages...');

    const packageJsonPath = join(PROJECT_ROOT, 'package.json');
    if (!existsSync(packageJsonPath)) {
      this.report.missingPackages.required.push('package.json file missing');
      return;
    }

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };

    // Required packages për TypeScript Next.js project
    const requiredPackages = [
      'next',
      'react',
      'react-dom',
      'typescript',
      '@types/react',
      '@types/react-dom',
      '@types/node'
    ];

    for (const pkg of requiredPackages) {
      if (!allDeps[pkg]) {
        this.report.missingPackages.required.push(pkg);
      }
    }

    // Recommended packages për advanced features
    const recommendedPackages = [
      'class-variance-authority',
      'framer-motion',
      'vitest',
      '@vitejs/plugin-react',
      'glob',
      'tsx'
    ];

    for (const pkg of recommendedPackages) {
      if (!allDeps[pkg]) {
        this.report.missingPackages.recommended.push(pkg);
      }
    }

    // Dev dependencies të nevojshme për development
    const devDependencies = [
      'eslint',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'rimraf',
      'concurrently'
    ];

    for (const pkg of devDependencies) {
      if (!allDeps[pkg]) {
        this.report.missingPackages.devDependencies.push(pkg);
      }
    }

    console.log(`📦 Required packages missing: ${this.report.missingPackages.required.length}`);
    console.log(`📦 Recommended packages missing: ${this.report.missingPackages.recommended.length}`);
    console.log(`📦 Dev dependencies missing: ${this.report.missingPackages.devDependencies.length}`);
  }

  /**
   * 🔗 AUDIT BROKEN IMPORTS
   */
  private async auditBrokenImports(): Promise<void> {
    console.log('\n🔗 Auditing Broken Imports...');

    const tsFiles = await glob('**/*.{ts,tsx}', {
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**', 'dist/**']
    });

    for (const file of tsFiles.slice(0, 30)) { // Limit për performance
      try {
        const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
        const lines = content.split('\n');

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          
          // Check për import statements
          const importMatch = line.match(/import.*from\s+['"`]([^'"`]+)['"`]/);
          if (importMatch) {
            const importPath = importMatch[1];
            
            // Skip node_modules imports
            if (!importPath.startsWith('.') && !importPath.startsWith('@/')) {
              continue;
            }

            let resolvedPath = '';
            if (importPath.startsWith('@/')) {
              resolvedPath = importPath.replace('@/', '');
            } else if (importPath.startsWith('./')) {
              const dir = file.split('/').slice(0, -1).join('/');
              resolvedPath = join(dir, importPath.substring(2));
            } else if (importPath.startsWith('../')) {
              const dir = file.split('/').slice(0, -1).join('/');
              const levels = (importPath.match(/\.\.\//g) || []).length;
              const targetDir = dir.split('/').slice(0, -levels).join('/');
              const relativePath = importPath.replace(/\.\.\//g, '');
              resolvedPath = join(targetDir, relativePath);
            }

            // Check nëse file ekziston
            const possibleExtensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mts'];
            let fileExists = false;

            for (const ext of possibleExtensions) {
              const fullPath = join(PROJECT_ROOT, resolvedPath + ext);
              if (existsSync(fullPath)) {
                fileExists = true;
                break;
              }
            }

            // Check për index files
            if (!fileExists) {
              for (const ext of ['index.ts', 'index.tsx']) {
                const indexPath = join(PROJECT_ROOT, resolvedPath, ext);
                if (existsSync(indexPath)) {
                  fileExists = true;
                  break;
                }
              }
            }

            if (!fileExists) {
              this.report.brokenImports.push({
                file,
                import: importPath,
                reason: `File not found: ${resolvedPath}`
              });
            }
          }
        }
      } catch (error) {
        // Skip unreadable files
      }
    }

    console.log(`🔗 Broken imports found: ${this.report.brokenImports.length}`);
  }

  /**
   * 🗑️ AUDIT UNUSED DEPENDENCIES
   */
  private async auditUnusedDependencies(): Promise<void> {
    console.log('\n🗑️ Auditing Unused Dependencies...');

    const packageJsonPath = join(PROJECT_ROOT, 'package.json');
    if (!existsSync(packageJsonPath)) return;

    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = Object.keys(packageJson.dependencies || {});

    // Get të gjitha files për të kontrolluar usage
    const allFiles = await glob('**/*.{ts,tsx,js,jsx,mts}', {
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**', 'dist/**']
    });

    for (const dep of dependencies) {
      // Skip built-in dhe special packages
      if (['react', 'react-dom', 'next', 'typescript'].includes(dep)) {
        continue;
      }

      let isUsed = false;
      
      // Check në të gjitha files
      for (const file of allFiles.slice(0, 50)) { // Limit për performance
        try {
          const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
          
          // Check për import statements
          if (content.includes(`from '${dep}'`) || 
              content.includes(`from "${dep}"`) ||
              content.includes(`require('${dep}')`) ||
              content.includes(`require("${dep}")`)) {
            isUsed = true;
            break;
          }
        } catch (error) {
          // Skip unreadable files
        }
      }

      if (!isUsed) {
        this.report.unusedDependencies.push(dep);
      }
    }

    console.log(`🗑️ Unused dependencies found: ${this.report.unusedDependencies.length}`);
  }

  /**
   * 📅 AUDIT OUTDATED PACKAGES
   */
  private async auditOutdatedPackages(): Promise<void> {
    console.log('\n📅 Auditing Outdated Packages...');

    try {
      // Use yarn outdated command për të kontrolluar outdated packages
      const { stdout } = await execAsync('yarn outdated --json', { 
        cwd: PROJECT_ROOT,
        timeout: 10000 
      });

      const lines = stdout.trim().split('\n');
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.type === 'table' && data.data && data.data.body) {
            for (const row of data.data.body) {
              const [packageName, current, , latest] = row;
              if (current !== latest) {
                this.report.outdatedPackages.push({
                  package: packageName,
                  current,
                  latest
                });
              }
            }
          }
        } catch (parseError) {
          // Skip invalid JSON lines
        }
      }
    } catch (error) {
      console.log('📅 Could not check outdated packages (yarn outdated failed)');
    }

    console.log(`📅 Outdated packages found: ${this.report.outdatedPackages.length}`);
  }

  /**
   * 💡 GENERATE RECOMMENDATIONS
   */
  private async generateRecommendations(): Promise<void> {
    const recommendations = this.report.recommendations;

    // Missing files recommendations
    if (this.report.missingFiles.core.length > 0) {
      recommendations.push(`🔴 CRITICAL: ${this.report.missingFiles.core.length} core files missing - create immediately`);
    }

    if (this.report.missingFiles.components.length > 0) {
      recommendations.push(`🟡 HIGH: ${this.report.missingFiles.components.length} component files missing - affects functionality`);
    }

    // Missing packages recommendations
    if (this.report.missingPackages.required.length > 0) {
      recommendations.push(`📦 CRITICAL: Install required packages: ${this.report.missingPackages.required.join(', ')}`);
    }

    if (this.report.missingPackages.recommended.length > 0) {
      recommendations.push(`📦 MEDIUM: Install recommended packages: ${this.report.missingPackages.recommended.join(', ')}`);
    }

    // Broken imports recommendations
    if (this.report.brokenImports.length > 0) {
      recommendations.push(`🔗 HIGH: Fix ${this.report.brokenImports.length} broken imports`);
    }

    // Unused dependencies recommendations
    if (this.report.unusedDependencies.length > 0) {
      recommendations.push(`🗑️ MEDIUM: Remove ${this.report.unusedDependencies.length} unused dependencies`);
    }

    // Outdated packages recommendations
    if (this.report.outdatedPackages.length > 0) {
      recommendations.push(`📅 LOW: Update ${this.report.outdatedPackages.length} outdated packages`);
    }

    // General recommendations
    if (this.report.missingFiles.types.length > 0) {
      recommendations.push('🔧 Create comprehensive type definitions for better TypeScript support');
    }

    recommendations.push('🛡️ Run dependency security audit regularly');
    recommendations.push('📊 Monitor bundle size when adding new dependencies');
  }

  /**
   * 📊 CALCULATE AUDIT SCORE
   */
  private calculateScore(): void {
    let score = 100;

    // Deduct për missing files
    score -= this.report.missingFiles.core.length * 15;
    score -= this.report.missingFiles.components.length * 10;
    score -= this.report.missingFiles.utilities.length * 5;
    score -= this.report.missingFiles.types.length * 3;

    // Deduct për missing packages
    score -= this.report.missingPackages.required.length * 20;
    score -= this.report.missingPackages.recommended.length * 5;

    // Deduct për broken imports
    score -= this.report.brokenImports.length * 8;

    // Deduct për unused dependencies (positive për cleanup)
    score -= this.report.unusedDependencies.length * 2;

    // Deduct për outdated packages
    score -= this.report.outdatedPackages.length * 1;

    this.report.score = Math.max(0, score);
  }

  /**
   * 📋 PRINT COMPREHENSIVE REPORT
   */
  public printReport(report: DependencyAuditReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 COMPREHENSIVE DEPENDENCY AUDIT REPORT');
    console.log('='.repeat(80));

    // Overall Score
    const scoreColor = report.score >= 90 ? '🟢' : report.score >= 70 ? '🟡' : '🔴';
    console.log(`\n📊 OVERALL SCORE: ${scoreColor} ${report.score}/100\n`);

    // Missing Files
    console.log('📁 MISSING FILES:');
    console.log(`   Core Files: ${report.missingFiles.core.length}`);
    if (report.missingFiles.core.length > 0) {
      report.missingFiles.core.forEach(file => console.log(`      ❌ ${file}`));
    }

    console.log(`   Component Files: ${report.missingFiles.components.length}`);
    if (report.missingFiles.components.length > 0) {
      report.missingFiles.components.forEach(file => console.log(`      ❌ ${file}`));
    }

    console.log(`   Utility Files: ${report.missingFiles.utilities.length}`);
    if (report.missingFiles.utilities.length > 0) {
      report.missingFiles.utilities.slice(0, 3).forEach(file => console.log(`      ❌ ${file}`));
      if (report.missingFiles.utilities.length > 3) {
        console.log(`      ... dhe ${report.missingFiles.utilities.length - 3} të tjera`);
      }
    }

    // Missing Packages
    console.log('\n📦 MISSING PACKAGES:');
    console.log(`   Required: ${report.missingPackages.required.length}`);
    report.missingPackages.required.forEach(pkg => console.log(`      ❌ ${pkg}`));

    console.log(`   Recommended: ${report.missingPackages.recommended.length}`);
    report.missingPackages.recommended.slice(0, 3).forEach(pkg => console.log(`      ⚠️ ${pkg}`));

    // Broken Imports
    console.log('\n🔗 BROKEN IMPORTS:');
    console.log(`   Total: ${report.brokenImports.length}`);
    report.brokenImports.slice(0, 5).forEach(broken => {
      console.log(`      ❌ ${broken.file}: ${broken.import}`);
    });

    // Unused Dependencies
    console.log('\n🗑️ UNUSED DEPENDENCIES:');
    console.log(`   Total: ${report.unusedDependencies.length}`);
    report.unusedDependencies.slice(0, 5).forEach(dep => console.log(`      🗑️ ${dep}`));

    // Outdated Packages
    console.log('\n📅 OUTDATED PACKAGES:');
    console.log(`   Total: ${report.outdatedPackages.length}`);
    report.outdatedPackages.slice(0, 5).forEach(pkg => {
      console.log(`      📅 ${pkg.package}: ${pkg.current} → ${pkg.latest}`);
    });

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ DEPENDENCY AUDIT COMPLETE');
    console.log('='.repeat(80) + '\n');
  }
}

/**
 * 🚀 MAIN EXECUTION
 */
async function main(): Promise<void> {
  try {
    const auditor = new DependencyAuditor();
    const report = await auditor.performAudit();
    auditor.printReport(report);

    // Exit with error code if score is too low
    if (report.score < 70) {
      console.log('❌ Dependency audit failed - Score below acceptable threshold (70)');
      process.exit(1);
    } else {
      console.log('✅ Dependency audit passed - Project dependencies are in good shape');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Dependency audit failed with error:', error);
    process.exit(1);
  }
}

// Execute main function
main();

export { DependencyAuditor, type DependencyAuditReport };
