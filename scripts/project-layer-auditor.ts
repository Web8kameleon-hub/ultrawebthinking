#!/usr/bin/env tsx

/**
 * 🔍 PROJECT LAYER & TYPESCRIPT COMPLIANCE AUDITOR
 * Kontrollon layers, missing modules, dhe siguron TypeScript-only architecture
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.0.0-LAYER-AUDIT
 * @license MIT
 */

import { existsSync, readFileSync } from 'fs';
import { glob } from 'glob';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const PROJECT_ROOT = process.cwd();

interface LayerAuditReport {
  layers: {
    neural: LayerStatus;
    ethical: LayerStatus;
    fluid: LayerStatus;
    guardian: LayerStatus;
    memory: LayerStatus;
    api: LayerStatus;
  };
  typeScriptCompliance: {
    jsFilesFound: string[];
    missingTsFiles: string[];
    invalidImports: string[];
    infiniteLoops: string[];
  };
  missingModules: {
    validators: string[];
    lazers: string[];
    controllers: string[];
    interfaces: string[];
  };
  recommendations: string[];
  score: number;
}

interface LayerStatus {
  exists: boolean;
  files: string[];
  dependencies: string[];
  health: 'excellent' | 'good' | 'warning' | 'critical';
  issues: string[];
}

/**
 * 🎯 MAIN AUDITOR CLASS
 */
class ProjectLayerAuditor {
  private report: LayerAuditReport = {
    layers: {
      neural: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      ethical: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      fluid: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      guardian: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      memory: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      api: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] }
    },
    typeScriptCompliance: {
      jsFilesFound: [],
      missingTsFiles: [],
      invalidImports: [],
      infiniteLoops: []
    },
    missingModules: {
      validators: [],
      lazers: [],
      controllers: [],
      interfaces: []
    },
    recommendations: [],
    score: 0
  };

  /**
   * 🔍 MAIN AUDIT EXECUTION
   */
  public async performAudit(): Promise<LayerAuditReport> {
    console.log('🔍 PROJECT LAYER & TYPESCRIPT AUDIT STARTING...\n');

    await this.auditLayers();
    await this.auditTypeScriptCompliance();
    await this.auditMissingModules();
    await this.generateRecommendations();
    this.calculateScore();

    return this.report;
  }

  /**
   * 🏗️ AUDIT PROJECT LAYERS
   */
  private async auditLayers(): Promise<void> {
    console.log('🏗️ Auditing Project Layers...');

    // Neural Layer
    await this.auditNeuralLayer();
    
    // Ethical Layer  
    await this.auditEthicalLayer();
    
    // Fluid Architecture Layer
    await this.auditFluidLayer();
    
    // Guardian Security Layer
    await this.auditGuardianLayer();
    
    // Memory Layer
    await this.auditMemoryLayer();
    
    // API Layer
    await this.auditApiLayer();

    console.log('✅ Layer audit complete\n');
  }

  /**
   * 🧠 NEURAL LAYER AUDIT
   */
  private async auditNeuralLayer(): Promise<void> {
    const neuralFiles = await glob('**/Neural*.ts', { cwd: PROJECT_ROOT });
    const plannerFiles = await glob('**/planner*.ts', { cwd: PROJECT_ROOT, nocase: true });
    
    this.report.layers.neural.files = [...neuralFiles, ...plannerFiles];
    this.report.layers.neural.exists = this.report.layers.neural.files.length > 0;

    // Check for required neural components
    const requiredNeuralFiles = [
      'lib/NeuralPlanner.ts',
      'lib/EthicalNeuralPlanner.ts',
      'ai/agi/mind.ts',
      'ai/agi/sense.ts'
    ];

    for (const file of requiredNeuralFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.layers.neural.issues.push(`Missing: ${file}`);
      }
    }

    // Health assessment
    if (this.report.layers.neural.issues.length === 0) {
      this.report.layers.neural.health = 'excellent';
    } else if (this.report.layers.neural.issues.length <= 2) {
      this.report.layers.neural.health = 'good';
    } else {
      this.report.layers.neural.health = 'warning';
    }

    console.log(`🧠 Neural Layer: ${this.report.layers.neural.health} (${this.report.layers.neural.files.length} files)`);
  }

  /**
   * ⚖️ ETHICAL LAYER AUDIT
   */
  private async auditEthicalLayer(): Promise<void> {
    const ethicalFiles = await glob('**/Ethical*.ts', { cwd: PROJECT_ROOT });
    const guardFiles = await glob('**/guard*.ts', { cwd: PROJECT_ROOT, nocase: true });
    
    this.report.layers.ethical.files = [...ethicalFiles, ...guardFiles];
    this.report.layers.ethical.exists = this.report.layers.ethical.files.length > 0;

    // Check for infinite loops in ethical planner
    const ethicalPlannerPath = join(PROJECT_ROOT, 'lib/EthicalNeuralPlanner.ts');
    if (existsSync(ethicalPlannerPath)) {
      const content = readFileSync(ethicalPlannerPath, 'utf-8');
      
      // Check for potential infinite loops
      const loopPatterns = [
        /while\s*\(\s*true\s*\)/g,
        /for\s*\(\s*;\s*;\s*\)/g,
        /do\s*{[^}]*}\s*while\s*\(\s*true\s*\)/g
      ];

      for (const pattern of loopPatterns) {
        if (pattern.test(content)) {
          this.report.typeScriptCompliance.infiniteLoops.push('EthicalNeuralPlanner.ts: Potential infinite loop detected');
        }
      }
    }

    this.report.layers.ethical.health = this.report.layers.ethical.files.length > 0 ? 'good' : 'critical';
    console.log(`⚖️ Ethical Layer: ${this.report.layers.ethical.health} (${this.report.layers.ethical.files.length} files)`);
  }

  /**
   * 💧 FLUID ARCHITECTURE AUDIT
   */
  private async auditFluidLayer(): Promise<void> {
    const fluidFiles = await glob('**/Fluid*.ts', { cwd: PROJECT_ROOT });
    const flowFiles = await glob('**/flow*.ts', { cwd: PROJECT_ROOT, nocase: true });
    
    this.report.layers.fluid.files = [...fluidFiles, ...flowFiles];
    this.report.layers.fluid.exists = this.report.layers.fluid.files.length > 0;

    // Check for required fluid components
    const requiredFluidFiles = [
      'lib/FluidArchitecture.ts',
      'scripts/flow-optimizer.ts',
      'scripts/system-health.ts'
    ];

    for (const file of requiredFluidFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.layers.fluid.issues.push(`Missing: ${file}`);
      }
    }

    this.report.layers.fluid.health = this.report.layers.fluid.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`💧 Fluid Layer: ${this.report.layers.fluid.health} (${this.report.layers.fluid.files.length} files)`);
  }

  /**
   * 🛡️ GUARDIAN SECURITY AUDIT
   */
  private async auditGuardianLayer(): Promise<void> {
    const guardianFiles = await glob('**/Guardian*.ts', { cwd: PROJECT_ROOT });
    const securityFiles = await glob('**/ddos*.ts', { cwd: PROJECT_ROOT, nocase: true });
    
    this.report.layers.guardian.files = [...guardianFiles, ...securityFiles];
    this.report.layers.guardian.exists = this.report.layers.guardian.files.length > 0;

    this.report.layers.guardian.health = this.report.layers.guardian.files.length > 0 ? 'good' : 'warning';
    console.log(`🛡️ Guardian Layer: ${this.report.layers.guardian.health} (${this.report.layers.guardian.files.length} files)`);
  }

  /**
   * 💾 MEMORY LAYER AUDIT
   */
  private async auditMemoryLayer(): Promise<void> {
    const memoryFiles = await glob('**/memory*.ts', { cwd: PROJECT_ROOT, nocase: true });
    const cacheFiles = await glob('**/cache*.ts', { cwd: PROJECT_ROOT, nocase: true });
    
    this.report.layers.memory.files = [...memoryFiles, ...cacheFiles];
    this.report.layers.memory.exists = this.report.layers.memory.files.length > 0;

    this.report.layers.memory.health = this.report.layers.memory.files.length > 0 ? 'good' : 'warning';
    console.log(`💾 Memory Layer: ${this.report.layers.memory.health} (${this.report.layers.memory.files.length} files)`);
  }

  /**
   * 🌐 API LAYER AUDIT
   */
  private async auditApiLayer(): Promise<void> {
    const apiFiles = await glob('**/api/**/*.ts', { cwd: PROJECT_ROOT });
    const serverFiles = await glob('**/server*.ts', { cwd: PROJECT_ROOT });
    
    this.report.layers.api.files = [...apiFiles, ...serverFiles];
    this.report.layers.api.exists = this.report.layers.api.files.length > 0;

    this.report.layers.api.health = this.report.layers.api.files.length > 0 ? 'good' : 'warning';
    console.log(`🌐 API Layer: ${this.report.layers.api.health} (${this.report.layers.api.files.length} files)`);
  }

  /**
   * 📜 TYPESCRIPT COMPLIANCE AUDIT
   */
  private async auditTypeScriptCompliance(): Promise<void> {
    console.log('📜 Auditing TypeScript Compliance...');

    // Check for .js files in source directories (excluding node_modules and .next)
    const jsFiles = await glob('**/*.js', { 
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**', 'dist/**', 'build/**']
    });

    this.report.typeScriptCompliance.jsFilesFound = jsFiles;

    // Check for missing TypeScript files that should exist
    const expectedTsFiles = [
      'lib/validator.ts',
      'lib/LaserController.ts',
      'components/LazyLoader.tsx',
      'utils/web8-utils.ts'
    ];

    for (const file of expectedTsFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.typeScriptCompliance.missingTsFiles.push(file);
      }
    }

    // Check for invalid imports (JavaScript imports in TypeScript files)
    const tsFiles = await glob('**/*.{ts,tsx}', { 
      cwd: PROJECT_ROOT,
      ignore: ['node_modules/**', '.next/**']
    });

    for (const file of tsFiles.slice(0, 20)) { // Limit to prevent performance issues
      try {
        const content = readFileSync(join(PROJECT_ROOT, file), 'utf-8');
        const jsImportPattern = /import.*from.*['"].*\.js['"];?/g;
        
        if (jsImportPattern.test(content)) {
          this.report.typeScriptCompliance.invalidImports.push(file);
        }
      } catch (error) {
        // Skip unreadable files
      }
    }

    console.log(`📜 TypeScript: ${this.report.typeScriptCompliance.jsFilesFound.length} JS files found`);
    console.log(`📜 Missing TS files: ${this.report.typeScriptCompliance.missingTsFiles.length}`);
  }

  /**
   * 🔍 AUDIT MISSING MODULES
   */
  private async auditMissingModules(): Promise<void> {
    console.log('🔍 Auditing Missing Modules...');

    // Validators
    const validatorFiles = await glob('**/validator*.ts', { cwd: PROJECT_ROOT, nocase: true });
    if (validatorFiles.length === 0) {
      this.report.missingModules.validators.push('lib/validator.ts');
    }

    // Lazers/LazyLoaders
    const lazerFiles = await glob('**/Lazy*.ts*', { cwd: PROJECT_ROOT });
    const laserFiles = await glob('**/Laser*.ts', { cwd: PROJECT_ROOT });
    if ([...lazerFiles, ...laserFiles].length === 0) {
      this.report.missingModules.lazers.push('components/LazyLoader.tsx');
      this.report.missingModules.lazers.push('lib/LaserController.ts');
    }

    // Controllers
    const controllerFiles = await glob('**/*Controller*.ts', { cwd: PROJECT_ROOT });
    if (controllerFiles.length < 3) {
      this.report.missingModules.controllers.push('lib/ThemeController.ts');
      this.report.missingModules.controllers.push('lib/StateController.ts');
    }

    // Interfaces/Types
    const interfaceFiles = await glob('**/types/**/*.ts', { cwd: PROJECT_ROOT });
    if (interfaceFiles.length < 5) {
      this.report.missingModules.interfaces.push('types/neural.types.ts');
      this.report.missingModules.interfaces.push('types/fluid.types.ts');
    }

    console.log(`🔍 Missing validators: ${this.report.missingModules.validators.length}`);
    console.log(`🔍 Missing lazers: ${this.report.missingModules.lazers.length}`);
    console.log(`🔍 Missing controllers: ${this.report.missingModules.controllers.length}`);
  }

  /**
   * 💡 GENERATE RECOMMENDATIONS
   */
  private async generateRecommendations(): Promise<void> {
    const recommendations = this.report.recommendations;

    // Layer recommendations
    if (!this.report.layers.neural.exists) {
      recommendations.push('🧠 CRITICAL: Implement Neural Layer - create NeuralPlanner.ts');
    }

    if (this.report.layers.ethical.issues.length > 0) {
      recommendations.push('⚖️ WARNING: Fix Ethical Layer issues - check EthicalNeuralPlanner.ts');
    }

    // TypeScript recommendations
    if (this.report.typeScriptCompliance.jsFilesFound.length > 0) {
      recommendations.push('📜 CRITICAL: Remove all .js files - project must be TypeScript-only');
    }

    if (this.report.typeScriptCompliance.infiniteLoops.length > 0) {
      recommendations.push('🔄 CRITICAL: Fix infinite loops in ethical planner');
    }

    // Missing modules recommendations
    if (this.report.missingModules.validators.length > 0) {
      recommendations.push('✅ HIGH: Implement missing validators for data validation');
    }

    if (this.report.missingModules.lazers.length > 0) {
      recommendations.push('⚡ MEDIUM: Implement LazyLoader components for performance');
    }

    // General recommendations
    recommendations.push('🔧 Update all imports to use TypeScript extensions (.ts/.tsx)');
    recommendations.push('🛡️ Ensure all layers have proper error handling');
    recommendations.push('📊 Add comprehensive type definitions for all modules');
  }

  /**
   * 📊 CALCULATE AUDIT SCORE
   */
  private calculateScore(): void {
    let score = 100;

    // Deduct for missing layers
    Object.values(this.report.layers).forEach(layer => {
      if (!layer.exists) score -= 15;
      if (layer.health === 'critical') score -= 10;
      if (layer.health === 'warning') score -= 5;
    });

    // Deduct for TypeScript compliance issues
    score -= this.report.typeScriptCompliance.jsFilesFound.length * 5;
    score -= this.report.typeScriptCompliance.missingTsFiles.length * 3;
    score -= this.report.typeScriptCompliance.invalidImports.length * 2;
    score -= this.report.typeScriptCompliance.infiniteLoops.length * 10;

    // Deduct for missing modules
    score -= this.report.missingModules.validators.length * 5;
    score -= this.report.missingModules.lazers.length * 3;
    score -= this.report.missingModules.controllers.length * 4;

    this.report.score = Math.max(0, score);
  }

  /**
   * 📋 PRINT COMPREHENSIVE REPORT
   */
  public printReport(report: LayerAuditReport): void {
    console.log('\n' + '='.repeat(80));
    console.log('🔍 PROJECT LAYER & TYPESCRIPT AUDIT REPORT');
    console.log('='.repeat(80));

    // Overall Score
    const scoreColor = report.score >= 90 ? '🟢' : report.score >= 70 ? '🟡' : '🔴';
    console.log(`\n📊 OVERALL SCORE: ${scoreColor} ${report.score}/100\n`);

    // Layer Status
    console.log('🏗️ LAYER STATUS:');
    Object.entries(report.layers).forEach(([name, layer]) => {
      const healthIcon = layer.health === 'excellent' ? '🟢' : 
                        layer.health === 'good' ? '🟡' : 
                        layer.health === 'warning' ? '🟠' : '🔴';
      console.log(`   ${healthIcon} ${name.toUpperCase()}: ${layer.health} (${layer.files.length} files)`);
      
      if (layer.issues.length > 0) {
        layer.issues.forEach(issue => console.log(`      ❌ ${issue}`));
      }
    });

    // TypeScript Compliance
    console.log('\n📜 TYPESCRIPT COMPLIANCE:');
    console.log(`   JS Files Found: ${report.typeScriptCompliance.jsFilesFound.length}`);
    if (report.typeScriptCompliance.jsFilesFound.length > 0) {
      report.typeScriptCompliance.jsFilesFound.slice(0, 5).forEach(file => {
        console.log(`      ❌ ${file}`);
      });
    }
    
    console.log(`   Missing TS Files: ${report.typeScriptCompliance.missingTsFiles.length}`);
    report.typeScriptCompliance.missingTsFiles.forEach(file => {
      console.log(`      ❌ ${file}`);
    });

    console.log(`   Infinite Loops: ${report.typeScriptCompliance.infiniteLoops.length}`);
    report.typeScriptCompliance.infiniteLoops.forEach(loop => {
      console.log(`      🔄 ${loop}`);
    });

    // Missing Modules
    console.log('\n🔍 MISSING MODULES:');
    console.log(`   Validators: ${report.missingModules.validators.length}`);
    console.log(`   Lazers: ${report.missingModules.lazers.length}`);
    console.log(`   Controllers: ${report.missingModules.controllers.length}`);
    console.log(`   Interfaces: ${report.missingModules.interfaces.length}`);

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach((rec, index) => {
      console.log(`   ${index + 1}. ${rec}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('✅ AUDIT COMPLETE - Reviewed project layers and TypeScript compliance');
    console.log('='.repeat(80) + '\n');
  }
}

/**
 * 🚀 MAIN EXECUTION
 */
async function main(): Promise<void> {
  try {
    const auditor = new ProjectLayerAuditor();
    const report = await auditor.performAudit();
    auditor.printReport(report);

    // Exit with error code if score is too low
    if (report.score < 70) {
      console.log('❌ Audit failed - Score below acceptable threshold (70)');
      process.exit(1);
    } else {
      console.log('✅ Audit passed - Project meets quality standards');
      process.exit(0);
    }
  } catch (error) {
    console.error('💥 Audit failed with error:', error);
    process.exit(1);
  }
}

// Execute main function
main();

export { ProjectLayerAuditor, type LayerAuditReport };
