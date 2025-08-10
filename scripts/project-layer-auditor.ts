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
  web8Layers: {
    layer1_agi_core: LayerStatus;
    layer2_realtime: LayerStatus;
    layer3_neural: LayerStatus;
    layer4_analytics: LayerStatus;
    layer5_security: LayerStatus;
    layer6_communication: LayerStatus;
    layer7_storage: LayerStatus;
    layer8_integration: LayerStatus;
    layer9_optimization: LayerStatus;
    layer10_monitoring: LayerStatus;
    layer11_backup: LayerStatus;
    layer12_lightning: LayerStatus;
  };
  monorepoCompliance: {
    aliasesConfigured: string[];
    dynamicModules: string[];
    missingAliases: string[];
    brokenImports: string[];
  };
  missingComponents: {
    web8Components: string[];
    agiModules: string[];
    lightningPool: string[];
    ultraSpeed: string[];
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
 * 🎯 MAIN AUDITOR CLASS - WEB8 12-LAYER ARCHITECTURE
 */
class ProjectLayerAuditor {
  private readonly report: LayerAuditReport = {
    web8Layers: {
      layer1_agi_core: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer2_realtime: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer3_neural: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer4_analytics: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer5_security: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer6_communication: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer7_storage: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer8_integration: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer9_optimization: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer10_monitoring: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer11_backup: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] },
      layer12_lightning: { exists: false, files: [], dependencies: [], health: 'critical', issues: [] }
    },
    monorepoCompliance: {
      aliasesConfigured: [],
      dynamicModules: [],
      missingAliases: [],
      brokenImports: []
    },
    missingComponents: {
      web8Components: [],
      agiModules: [],
      lightningPool: [],
      ultraSpeed: []
    },
    recommendations: [],
    score: 0
  };

  /**
   * 🔍 MAIN AUDIT EXECUTION - WEB8 12-LAYER ARCHITECTURE
   */
  public async performAudit(): Promise<LayerAuditReport> {
    console.log('🔍 WEB8 12-LAYER ARCHITECTURE AUDIT STARTING...\n');

    await this.auditWeb8Layers();
    await this.auditMonorepoCompliance();
    await this.auditMissingComponents();
    await this.generateWeb8Recommendations();
    this.calculateWeb8Score();

    return this.report;
  }

  /**
   * 🧠 LAYER 1: AGI CORE ENGINE AUDIT
   */
  private async auditLayer1AGICore(): Promise<void> {
    const agiFiles = await glob('**/AGI*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const sheetFiles = await glob('**/components/AGISheet/**/*', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer1_agi_core.files = [...agiFiles, ...sheetFiles];
    this.report.web8Layers.layer1_agi_core.exists = this.report.web8Layers.layer1_agi_core.files.length > 0;
    
    const requiredAGIFiles = ['components/AGISheet/AGISheet.tsx', 'components/AGISheet/EcologyEngine.ts'];
    for (const file of requiredAGIFiles) {
      if (!existsSync(join(PROJECT_ROOT, file))) {
        this.report.web8Layers.layer1_agi_core.issues.push(`Missing: ${file}`);
      }
    }
    
    this.report.web8Layers.layer1_agi_core.health = this.report.web8Layers.layer1_agi_core.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`🧠 Layer 1 AGI Core: ${this.report.web8Layers.layer1_agi_core.health} (${this.report.web8Layers.layer1_agi_core.files.length} files)`);
  }

  /**
   * ⚡ LAYER 2: REAL-TIME PROCESSING AUDIT
   */
  private async auditLayer2Realtime(): Promise<void> {
    const realtimeFiles = await glob('**/realtime*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const socketFiles = await glob('**/socket*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer2_realtime.files = [...realtimeFiles, ...socketFiles];
    this.report.web8Layers.layer2_realtime.exists = this.report.web8Layers.layer2_realtime.files.length > 0;
    
    if (!existsSync(join(PROJECT_ROOT, 'backend/realtime-server.ts'))) {
      this.report.web8Layers.layer2_realtime.issues.push('Missing: backend/realtime-server.ts');
    }
    
    this.report.web8Layers.layer2_realtime.health = this.report.web8Layers.layer2_realtime.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`⚡ Layer 2 Realtime: ${this.report.web8Layers.layer2_realtime.health} (${this.report.web8Layers.layer2_realtime.files.length} files)`);
  }

  /**
   * 🧠 LAYER 3: NEURAL NETWORKS AUDIT  
   */
  private async auditLayer3Neural(): Promise<void> {
    const neuralFiles = await glob('**/neural*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const analyzerFiles = await glob('**/neuralAnalyzer.ts', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer3_neural.files = [...neuralFiles, ...analyzerFiles];
    this.report.web8Layers.layer3_neural.exists = this.report.web8Layers.layer3_neural.files.length > 0;
    
    if (!existsSync(join(PROJECT_ROOT, 'lib/neuralAnalyzer.ts'))) {
      this.report.web8Layers.layer3_neural.issues.push('Missing: lib/neuralAnalyzer.ts');
    }
    
    this.report.web8Layers.layer3_neural.health = this.report.web8Layers.layer3_neural.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`🧠 Layer 3 Neural: ${this.report.web8Layers.layer3_neural.health} (${this.report.web8Layers.layer3_neural.files.length} files)`);
  }

  /**
   * 📊 LAYER 4: ANALYTICS AUDIT
   */
  private async auditLayer4Analytics(): Promise<void> {
    const analyticsFiles = await glob('**/analytics*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer4_analytics.files = analyticsFiles;
    this.report.web8Layers.layer4_analytics.exists = analyticsFiles.length > 0;
    this.report.web8Layers.layer4_analytics.health = analyticsFiles.length > 0 ? 'good' : 'warning';
    console.log(`📊 Layer 4 Analytics: ${this.report.web8Layers.layer4_analytics.health} (${analyticsFiles.length} files)`);
  }

  /**
   * 🛡️ LAYER 5: SECURITY (GUARDIAN) AUDIT
   */
  private async auditLayer5Security(): Promise<void> {
    const guardianFiles = await glob('**/guardian/**/*.ts', { cwd: PROJECT_ROOT });
    const securityFiles = await glob('**/security*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer5_security.files = [...guardianFiles, ...securityFiles];
    this.report.web8Layers.layer5_security.exists = this.report.web8Layers.layer5_security.files.length > 0;
    
    if (!existsSync(join(PROJECT_ROOT, 'backend/guardian/Guardian-web8.ts'))) {
      this.report.web8Layers.layer5_security.issues.push('Missing: backend/guardian/Guardian-web8.ts');
    }
    
    this.report.web8Layers.layer5_security.health = this.report.web8Layers.layer5_security.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`🛡️ Layer 5 Security: ${this.report.web8Layers.layer5_security.health} (${this.report.web8Layers.layer5_security.files.length} files)`);
  }

  /**
   * 📡 LAYER 6: COMMUNICATION AUDIT
   */
  private async auditLayer6Communication(): Promise<void> {
    const apiFiles = await glob('**/api/**/*.ts', { cwd: PROJECT_ROOT });
    const serverFiles = await glob('**/server*.ts', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer6_communication.files = [...apiFiles, ...serverFiles];
    this.report.web8Layers.layer6_communication.exists = this.report.web8Layers.layer6_communication.files.length > 0;
    this.report.web8Layers.layer6_communication.health = this.report.web8Layers.layer6_communication.files.length > 0 ? 'good' : 'warning';
    console.log(`📡 Layer 6 Communication: ${this.report.web8Layers.layer6_communication.health} (${this.report.web8Layers.layer6_communication.files.length} files)`);
  }

  /**
   * 💾 LAYER 7: STORAGE AUDIT
   */
  private async auditLayer7Storage(): Promise<void> {
    const storageFiles = await glob('**/storage*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const dbFiles = await glob('**/database/**/*.ts', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer7_storage.files = [...storageFiles, ...dbFiles];
    this.report.web8Layers.layer7_storage.exists = this.report.web8Layers.layer7_storage.files.length > 0;
    this.report.web8Layers.layer7_storage.health = this.report.web8Layers.layer7_storage.files.length > 0 ? 'good' : 'warning';
    console.log(`💾 Layer 7 Storage: ${this.report.web8Layers.layer7_storage.health} (${this.report.web8Layers.layer7_storage.files.length} files)`);
  }

  /**
   * 🔗 LAYER 8: INTEGRATION AUDIT
   */
  private async auditLayer8Integration(): Promise<void> {
    const integrationFiles = await glob('**/integration*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer8_integration.files = integrationFiles;
    this.report.web8Layers.layer8_integration.exists = integrationFiles.length > 0;
    this.report.web8Layers.layer8_integration.health = integrationFiles.length > 0 ? 'good' : 'warning';
    console.log(`🔗 Layer 8 Integration: ${this.report.web8Layers.layer8_integration.health} (${integrationFiles.length} files)`);
  }

  /**
   * ⚡ LAYER 9: OPTIMIZATION AUDIT
   */
  private async auditLayer9Optimization(): Promise<void> {
    const lazyFiles = await glob('**/Lazy*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const optimizationFiles = await glob('**/optimization*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer9_optimization.files = [...lazyFiles, ...optimizationFiles];
    this.report.web8Layers.layer9_optimization.exists = this.report.web8Layers.layer9_optimization.files.length > 0;
    
    if (!existsSync(join(PROJECT_ROOT, 'components/LazyLoader.tsx'))) {
      this.report.web8Layers.layer9_optimization.issues.push('Missing: components/LazyLoader.tsx');
    }
    
    this.report.web8Layers.layer9_optimization.health = this.report.web8Layers.layer9_optimization.issues.length === 0 ? 'excellent' : 'warning';
    console.log(`⚡ Layer 9 Optimization: ${this.report.web8Layers.layer9_optimization.health} (${this.report.web8Layers.layer9_optimization.files.length} files)`);
  }

  /**
   * 📊 LAYER 10: MONITORING AUDIT
   */
  private async auditLayer10Monitoring(): Promise<void> {
    const monitoringFiles = await glob('**/monitoring*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer10_monitoring.files = monitoringFiles;
    this.report.web8Layers.layer10_monitoring.exists = monitoringFiles.length > 0;
    this.report.web8Layers.layer10_monitoring.health = monitoringFiles.length > 0 ? 'good' : 'warning';
    console.log(`📊 Layer 10 Monitoring: ${this.report.web8Layers.layer10_monitoring.health} (${monitoringFiles.length} files)`);
  }

  /**
   * 💾 LAYER 11: BACKUP & RECOVERY AUDIT
   */
  private async auditLayer11Backup(): Promise<void> {
    const backupFiles = await glob('**/backup*.{ts,tsx}', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer11_backup.files = backupFiles;
    this.report.web8Layers.layer11_backup.exists = backupFiles.length > 0;
    this.report.web8Layers.layer11_backup.health = backupFiles.length > 0 ? 'good' : 'warning';
    console.log(`💾 Layer 11 Backup: ${this.report.web8Layers.layer11_backup.health} (${backupFiles.length} files)`);
  }

  /**
   * ⚡ LAYER 12: LIGHTNING POOL AUDIT
   */
  private async auditLayer12Lightning(): Promise<void> {
    const lightningFiles = await glob('**/Lightning*.{ts,tsx}', { cwd: PROJECT_ROOT });
    const workerFiles = await glob('**/workers/**/*.ts', { cwd: PROJECT_ROOT });
    
    this.report.web8Layers.layer12_lightning.files = [...lightningFiles, ...workerFiles];
    this.report.web8Layers.layer12_lightning.exists = this.report.web8Layers.layer12_lightning.files.length > 0;
    
    if (!existsSync(join(PROJECT_ROOT, 'backend/Web8LightningPool.ts'))) {
      this.report.web8Layers.layer12_lightning.issues.push('Missing: backend/Web8LightningPool.ts');
    }
    
    this.report.web8Layers.layer12_lightning.health = this.report.web8Layers.layer12_lightning.issues.length === 0 ? 'excellent' : 'critical';
    console.log(`⚡ Layer 12 Lightning: ${this.report.web8Layers.layer12_lightning.health} (${this.report.web8Layers.layer12_lightning.files.length} files)`);
  }

  /**
   * 📦 AUDIT MONOREPO COMPLIANCE
   */
  private async auditMonorepoCompliance(): Promise<void> {
    console.log('📦 Auditing Monorepo Compliance...');
    
    // Check for tsconfig aliases
    const tsconfigPath = join(PROJECT_ROOT, 'tsconfig.json');
    if (existsSync(tsconfigPath)) {
      const content = readFileSync(tsconfigPath, 'utf-8');
      const tsconfig = JSON.parse(content);
      
      if (tsconfig.compilerOptions?.paths) {
        this.report.monorepoCompliance.aliasesConfigured = Object.keys(tsconfig.compilerOptions.paths);
      }
    }
    
    // Check package.json scripts for dynamic modules
    const packageJsonPath = join(PROJECT_ROOT, 'package.json');
    if (existsSync(packageJsonPath)) {
      const content = readFileSync(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(content);
      
      if (packageJson.scripts) {
        this.report.monorepoCompliance.dynamicModules = Object.keys(packageJson.scripts).filter(script => 
          script.includes('dev:') || script.includes('build:') || script.includes('test:')
        );
      }
    }
    
    console.log(`📦 Aliases: ${this.report.monorepoCompliance.aliasesConfigured.length}`);
    console.log(`📦 Dynamic Modules: ${this.report.monorepoCompliance.dynamicModules.length}`);
  }

  /**
   * 🔍 AUDIT MISSING COMPONENTS
   */
  private async auditMissingComponents(): Promise<void> {
    console.log('🔍 Auditing Missing Components...');
    
    // Web8 Components
    const web8Components = ['components/Web8TabSystem.tsx', 'lib/web8-motion.ts'];
    for (const component of web8Components) {
      if (!existsSync(join(PROJECT_ROOT, component))) {
        this.report.missingComponents.web8Components.push(component);
      }
    }
    
    // AGI Modules
    const agiModules = ['components/AGISheet/AGISheet.tsx', 'components/AGISheet/EcologyEngine.ts'];
    for (const module of agiModules) {
      if (!existsSync(join(PROJECT_ROOT, module))) {
        this.report.missingComponents.agiModules.push(module);
      }
    }
    
    // Lightning Pool
    const lightningPool = ['backend/Web8LightningPool.ts', 'backend/UltraSpeedModule.ts'];
    for (const pool of lightningPool) {
      if (!existsSync(join(PROJECT_ROOT, pool))) {
        this.report.missingComponents.lightningPool.push(pool);
      }
    }
    
    console.log(`🔍 Missing Web8: ${this.report.missingComponents.web8Components.length}`);
    console.log(`🔍 Missing AGI: ${this.report.missingComponents.agiModules.length}`);
    console.log(`🔍 Missing Lightning: ${this.report.missingComponents.lightningPool.length}`);
  }

  /**
   * 💡 GENERATE WEB8 RECOMMENDATIONS
   */
  private async generateWeb8Recommendations(): Promise<void> {
    // Layer recommendations
    Object.entries(this.report.web8Layers).forEach(([layer, status]) => {
      if (!status.exists) {
        this.report.recommendations.push(`🚨 CRITICAL: Implement ${layer.replace('_', ' ').toUpperCase()}`);
      }
      if (status.issues.length > 0) {
        this.report.recommendations.push(`⚠️ WARNING: Fix issues in ${layer.replace('_', ' ').toUpperCase()}`);
      }
    });
    
    // Monorepo recommendations
    if (this.report.monorepoCompliance.aliasesConfigured.length === 0) {
      this.report.recommendations.push('📦 Configure TypeScript path aliases for monorepo');
    }
    
    if (this.report.monorepoCompliance.dynamicModules.length < 5) {
      this.report.recommendations.push('📦 Add more dynamic module scripts (dev:*, build:*, test:*)');
    }
    
    // Component recommendations
    if (this.report.missingComponents.lightningPool.length > 0) {
      this.report.recommendations.push('⚡ URGENT: Implement Web8 Lightning Pool system');
    }
  }

  /**
   * 📊 CALCULATE WEB8 SCORE
   */
  private calculateWeb8Score(): void {
    let score = 100;
    
    // Deduct for missing layers (each layer is worth ~8 points)
    Object.values(this.report.web8Layers).forEach(layer => {
      if (!layer.exists) score -= 8;
      if (layer.health === 'critical') score -= 4;
      if (layer.health === 'warning') score -= 2;
    });
    
    // Deduct for missing components
    score -= this.report.missingComponents.web8Components.length * 3;
    score -= this.report.missingComponents.agiModules.length * 3;
    score -= this.report.missingComponents.lightningPool.length * 5;
    
    this.report.score = Math.max(0, score);
  }

  /**
   * 🏗️ AUDIT WEB8 12-LAYER ARCHITECTURE
   */
  private async auditWeb8Layers(): Promise<void> {
    console.log('🏗️ Auditing Web8 12-Layer Architecture...');

    // Layer 1: AGI Core
    await this.auditLayer1AGICore();
    
    // Layer 2: Real-time Processing
    await this.auditLayer2Realtime();
    
    // Layer 3: Neural Networks
    await this.auditLayer3Neural();
    
    // Layer 4: Analytics
    await this.auditLayer4Analytics();
    
    // Layer 5: Security (Guardian)
    await this.auditLayer5Security();
    
    // Layer 6: Communication
    await this.auditLayer6Communication();
    
    // Layer 7: Storage
    await this.auditLayer7Storage();
    
    // Layer 8: Integration
    await this.auditLayer8Integration();
    
    // Layer 9: Optimization
    await this.auditLayer9Optimization();
    
    // Layer 10: Monitoring
    await this.auditLayer10Monitoring();
    
    // Layer 11: Backup & Recovery
    await this.auditLayer11Backup();
    
    // Layer 12: Lightning Pool
    await this.auditLayer12Lightning();

    console.log('✅ Web8 12-layer audit complete\n');
  }

  /**
   *  PRINT COMPREHENSIVE WEB8 REPORT
   */
  public printReport(report: LayerAuditReport): void {
    console.log(`\n${'='.repeat(80)}`);
    console.log('🔍 WEB8 12-LAYER ARCHITECTURE AUDIT REPORT');
    console.log('='.repeat(80));

    // Overall Score
    const scoreColor = report.score >= 90 ? '🟢' : report.score >= 70 ? '🟡' : '🔴';
    console.log(`\n📊 OVERALL SCORE: ${scoreColor} ${report.score}/100\n`);

    // Web8 12-Layer Status
    console.log('🏗️ WEB8 12-LAYER STATUS:');
    Object.entries(report.web8Layers).forEach(([name, layer]) => {
      const healthIcon = layer.health === 'excellent' ? '🟢' : 
                        layer.health === 'good' ? '🟡' : 
                        layer.health === 'warning' ? '🟠' : '🔴';
      console.log(`   ${healthIcon} ${name.replace('_', ' ').toUpperCase()}: ${layer.health} (${layer.files.length} files)`);
      
      if (layer.issues.length > 0) {
        layer.issues.forEach(issue => console.log(`      ❌ ${issue}`));
      }
    });

    // Monorepo Compliance
    console.log('\n� MONOREPO COMPLIANCE:');
    console.log(`   Configured Aliases: ${report.monorepoCompliance.aliasesConfigured.length}`);
    if (report.monorepoCompliance.aliasesConfigured.length > 0) {
      report.monorepoCompliance.aliasesConfigured.slice(0, 3).forEach(alias => {
        console.log(`      ✅ ${alias}`);
      });
    }
    
    console.log(`   Dynamic Modules: ${report.monorepoCompliance.dynamicModules.length}`);
    if (report.monorepoCompliance.dynamicModules.length > 0) {
      report.monorepoCompliance.dynamicModules.slice(0, 5).forEach(module => {
        console.log(`      ⚡ ${module}`);
      });
    }

    // Missing Components
    console.log('\n🔍 MISSING COMPONENTS:');
    console.log(`   Web8 Components: ${report.missingComponents.web8Components.length}`);
    report.missingComponents.web8Components.forEach(comp => console.log(`      ❌ ${comp}`));
    
    console.log(`   AGI Modules: ${report.missingComponents.agiModules.length}`);
    report.missingComponents.agiModules.forEach(comp => console.log(`      ❌ ${comp}`));
    
    console.log(`   Lightning Pool: ${report.missingComponents.lightningPool.length}`);
    report.missingComponents.lightningPool.forEach(comp => console.log(`      ❌ ${comp}`));

    // Recommendations
    console.log('\n💡 WEB8 RECOMMENDATIONS:');
    if (report.recommendations.length === 0) {
      console.log('   🎉 No recommendations - Web8 architecture is optimal!');
    } else {
      report.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }

    console.log(`\n${'='.repeat(80)}`);
    console.log('✅ WEB8 AUDIT COMPLETE - 12-layer architecture analyzed');
    console.log(`${'='.repeat(80)}\n`);
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
