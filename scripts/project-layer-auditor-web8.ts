#!/usr/bin/env node

/**
 * WEB8 PROJECT LAYER AUDITOR - 12-LAYER ARCHITECTURE
 * ===================================================
 * 
 * 🧠 Advanced project analysis system for Web8 12-layer architecture
 * 🔍 Comprehensive audit of monorepo structure with dynamic modules
 * ⚡ Industrial-grade quality assurance for AGI platforms
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// PROJECT ROOT RESOLUTION
const PROJECT_ROOT = process.cwd();

/**
 * 🏗️ WEB8 12-LAYER ARCHITECTURE INTERFACE
 */
interface Web8LayerStatus {
  exists: boolean;
  files: string[];
  issues: string[];
  health: 'excellent' | 'good' | 'warning' | 'critical';
  coverage: number;
}

interface Web8LayerAuditReport {
  // WEB8 12-LAYER ARCHITECTURE
  web8Layers: {
    agiCore: Web8LayerStatus;           // Layer 1: AGI Core Engine
    realtime: Web8LayerStatus;          // Layer 2: Real-time Processing
    neural: Web8LayerStatus;            // Layer 3: Neural Networks
    analytics: Web8LayerStatus;         // Layer 4: Analytics
    security: Web8LayerStatus;          // Layer 5: Security (Guardian)
    communication: Web8LayerStatus;     // Layer 6: Communication
    storage: Web8LayerStatus;           // Layer 7: Storage
    integration: Web8LayerStatus;       // Layer 8: Integration
    optimization: Web8LayerStatus;      // Layer 9: Optimization
    monitoring: Web8LayerStatus;        // Layer 10: Monitoring
    backup: Web8LayerStatus;            // Layer 11: Backup & Recovery
    lightning: Web8LayerStatus;         // Layer 12: Lightning Pool
  };

  // MONOREPO COMPLIANCE
  monorepoCompliance: {
    hasWorkspaces: boolean;
    hasAliases: boolean;
    hasScripts: boolean;
    dynamicModules: string[];
    score: number;
  };

  // MISSING COMPONENTS
  missingComponents: {
    critical: string[];
    recommended: string[];
    count: number;
  };

  // PERFORMANCE METRICS
  performanceMetrics: {
    loadTime: number;
    memoryUsage: number;
    bundleSize: number;
  };

  // OVERALL ASSESSMENT
  overallScore: number;
  grade: 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';
  recommendations: string[];
  timestamp: string;
}

/**
 * 🔍 WEB8 PROJECT LAYER AUDITOR CLASS
 */
class Web8ProjectAuditor {
  private report: Web8LayerAuditReport;

  constructor() {
    this.report = {
      web8Layers: {
        agiCore: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        realtime: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        neural: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        analytics: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        security: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        communication: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        storage: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        integration: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        optimization: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        monitoring: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        backup: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 },
        lightning: { exists: false, files: [], issues: [], health: 'critical', coverage: 0 }
      },
      monorepoCompliance: {
        hasWorkspaces: false,
        hasAliases: false,
        hasScripts: false,
        dynamicModules: [],
        score: 0
      },
      missingComponents: {
        critical: [],
        recommended: [],
        count: 0
      },
      performanceMetrics: {
        loadTime: 0,
        memoryUsage: 0,
        bundleSize: 0
      },
      overallScore: 0,
      grade: 'F',
      recommendations: [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 🔍 MAIN AUDIT EXECUTION - WEB8 12-LAYER ARCHITECTURE
   */
  public async performAudit(): Promise<Web8LayerAuditReport> {
    console.log('🔍 WEB8 12-LAYER ARCHITECTURE AUDIT STARTING...\n');
    
    const startTime = Date.now();

    await this.auditWeb8Layers();
    await this.auditMonorepoCompliance();
    await this.auditMissingComponents();
    await this.generateWeb8Recommendations();
    this.calculateWeb8Score();

    this.report.performanceMetrics.loadTime = Date.now() - startTime;

    return this.report;
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
   * 🧠 LAYER 1: AGI CORE ENGINE AUDIT
   */
  private async auditLayer1AGICore(): Promise<void> {
    const agiFiles = await this.findFiles(['components/AGISheet/**/*.tsx', 'app/agi-*/**/*.tsx']);
    this.report.web8Layers.agiCore.files = agiFiles;
    this.report.web8Layers.agiCore.exists = agiFiles.length > 0;
    
    const expectedAGI = ['AGISheet.tsx', 'EcologyEngine.ts', 'BiologyEngine.ts'];
    for (const file of expectedAGI) {
      const exists = agiFiles.some(f => f.includes(file));
      if (!exists) {
        this.report.web8Layers.agiCore.issues.push(`Missing AGI component: ${file}`);
      }
    }
    
    this.report.web8Layers.agiCore.coverage = this.calculateCoverage(agiFiles.length, 10);
    this.report.web8Layers.agiCore.health = this.assessHealth(this.report.web8Layers.agiCore);
  }

  /**
   * ⚡ LAYER 2: REAL-TIME PROCESSING AUDIT
   */
  private async auditLayer2Realtime(): Promise<void> {
    const realtimeFiles = await this.findFiles(['backend/realtime-server.ts', 'hooks/useAGIRealTime.ts']);
    this.report.web8Layers.realtime.files = realtimeFiles;
    this.report.web8Layers.realtime.exists = realtimeFiles.length > 0;
    
    if (!realtimeFiles.some(f => f.includes('realtime-server.ts'))) {
      this.report.web8Layers.realtime.issues.push('Missing real-time WebSocket server');
    }
    
    this.report.web8Layers.realtime.coverage = this.calculateCoverage(realtimeFiles.length, 5);
    this.report.web8Layers.realtime.health = this.assessHealth(this.report.web8Layers.realtime);
  }

  /**
   * 🧠 LAYER 3: NEURAL NETWORKS AUDIT  
   */
  private async auditLayer3Neural(): Promise<void> {
    const neuralFiles = await this.findFiles(['lib/neuralAnalyzer.ts', 'lib/FluidArchitecture.ts']);
    this.report.web8Layers.neural.files = neuralFiles;
    this.report.web8Layers.neural.exists = neuralFiles.length > 0;
    
    if (!neuralFiles.some(f => f.includes('neuralAnalyzer.ts'))) {
      this.report.web8Layers.neural.issues.push('Missing neural analyzer engine');
    }
    
    this.report.web8Layers.neural.coverage = this.calculateCoverage(neuralFiles.length, 8);
    this.report.web8Layers.neural.health = this.assessHealth(this.report.web8Layers.neural);
  }

  /**
   * 📊 LAYER 4: ANALYTICS AUDIT
   */
  private async auditLayer4Analytics(): Promise<void> {
    const analyticsFiles = await this.findFiles(['components/Analytics/**/*.tsx', 'lib/analytics.ts']);
    this.report.web8Layers.analytics.files = analyticsFiles;
    this.report.web8Layers.analytics.exists = analyticsFiles.length > 0;
    
    this.report.web8Layers.analytics.coverage = this.calculateCoverage(analyticsFiles.length, 6);
    this.report.web8Layers.analytics.health = this.assessHealth(this.report.web8Layers.analytics);
  }

  /**
   * 🛡️ LAYER 5: SECURITY (GUARDIAN) AUDIT
   */
  private async auditLayer5Security(): Promise<void> {
    const securityFiles = await this.findFiles(['backend/guardian/**/*.ts', 'middleware.ts']);
    this.report.web8Layers.security.files = securityFiles;
    this.report.web8Layers.security.exists = securityFiles.length > 0;
    
    if (!securityFiles.some(f => f.includes('Guardian-web8.ts'))) {
      this.report.web8Layers.security.issues.push('Missing Web8 Guardian security module');
    }
    
    this.report.web8Layers.security.coverage = this.calculateCoverage(securityFiles.length, 7);
    this.report.web8Layers.security.health = this.assessHealth(this.report.web8Layers.security);
  }

  /**
   * 📡 LAYER 6: COMMUNICATION AUDIT
   */
  private async auditLayer6Communication(): Promise<void> {
    const commFiles = await this.findFiles(['backend/server.ts', 'app/api/**/*.ts']);
    this.report.web8Layers.communication.files = commFiles;
    this.report.web8Layers.communication.exists = commFiles.length > 0;
    
    this.report.web8Layers.communication.coverage = this.calculateCoverage(commFiles.length, 15);
    this.report.web8Layers.communication.health = this.assessHealth(this.report.web8Layers.communication);
  }

  /**
   * 💾 LAYER 7: STORAGE AUDIT
   */
  private async auditLayer7Storage(): Promise<void> {
    const storageFiles = await this.findFiles(['lib/storage/**/*.ts', 'backend/database/**/*.ts']);
    this.report.web8Layers.storage.files = storageFiles;
    this.report.web8Layers.storage.exists = storageFiles.length > 0;
    
    this.report.web8Layers.storage.coverage = this.calculateCoverage(storageFiles.length, 5);
    this.report.web8Layers.storage.health = this.assessHealth(this.report.web8Layers.storage);
  }

  /**
   * 🔗 LAYER 8: INTEGRATION AUDIT
   */
  private async auditLayer8Integration(): Promise<void> {
    const integrationFiles = await this.findFiles(['lib/integrations/**/*.ts', 'backend/integrations/**/*.ts']);
    this.report.web8Layers.integration.files = integrationFiles;
    this.report.web8Layers.integration.exists = integrationFiles.length > 0;
    
    this.report.web8Layers.integration.coverage = this.calculateCoverage(integrationFiles.length, 8);
    this.report.web8Layers.integration.health = this.assessHealth(this.report.web8Layers.integration);
  }

  /**
   * ⚡ LAYER 9: OPTIMIZATION AUDIT
   */
  private async auditLayer9Optimization(): Promise<void> {
    const optFiles = await this.findFiles(['components/LazyLoader.tsx', 'lib/web8-motion.ts']);
    this.report.web8Layers.optimization.files = optFiles;
    this.report.web8Layers.optimization.exists = optFiles.length > 0;
    
    if (!optFiles.some(f => f.includes('LazyLoader.tsx'))) {
      this.report.web8Layers.optimization.issues.push('Missing LazyLoader optimization system');
    }
    
    this.report.web8Layers.optimization.coverage = this.calculateCoverage(optFiles.length, 6);
    this.report.web8Layers.optimization.health = this.assessHealth(this.report.web8Layers.optimization);
  }

  /**
   * 📊 LAYER 10: MONITORING AUDIT
   */
  private async auditLayer10Monitoring(): Promise<void> {
    const monitorFiles = await this.findFiles(['backend/monitoring/**/*.ts', 'lib/monitoring.ts']);
    this.report.web8Layers.monitoring.files = monitorFiles;
    this.report.web8Layers.monitoring.exists = monitorFiles.length > 0;
    
    this.report.web8Layers.monitoring.coverage = this.calculateCoverage(monitorFiles.length, 4);
    this.report.web8Layers.monitoring.health = this.assessHealth(this.report.web8Layers.monitoring);
  }

  /**
   * 💾 LAYER 11: BACKUP & RECOVERY AUDIT
   */
  private async auditLayer11Backup(): Promise<void> {
    const backupFiles = await this.findFiles(['backend/backup/**/*.ts', 'scripts/backup*.ts']);
    this.report.web8Layers.backup.files = backupFiles;
    this.report.web8Layers.backup.exists = backupFiles.length > 0;
    
    this.report.web8Layers.backup.coverage = this.calculateCoverage(backupFiles.length, 3);
    this.report.web8Layers.backup.health = this.assessHealth(this.report.web8Layers.backup);
  }

  /**
   * ⚡ LAYER 12: LIGHTNING POOL AUDIT
   */
  private async auditLayer12Lightning(): Promise<void> {
    const lightningFiles = await this.findFiles(['backend/Web8LightningPool.ts', 'backend/workers/**/*.ts']);
    this.report.web8Layers.lightning.files = lightningFiles;
    this.report.web8Layers.lightning.exists = lightningFiles.length > 0;
    
    if (!lightningFiles.some(f => f.includes('Web8LightningPool.ts'))) {
      this.report.web8Layers.lightning.issues.push('Missing Web8 Lightning Pool system');
    }
    
    this.report.web8Layers.lightning.coverage = this.calculateCoverage(lightningFiles.length, 12);
    this.report.web8Layers.lightning.health = this.assessHealth(this.report.web8Layers.lightning);
  }

  /**
   * 📦 AUDIT MONOREPO COMPLIANCE
   */
  private async auditMonorepoCompliance(): Promise<void> {
    console.log('📦 Auditing Monorepo Compliance...');
    
    // Check package.json structure
    const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
    try {
      const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8');
      const packageJson = JSON.parse(packageJsonContent);
      
      this.report.monorepoCompliance.hasWorkspaces = !!packageJson.workspaces;
      this.report.monorepoCompliance.hasScripts = Object.keys(packageJson.scripts || {}).length > 5;
      
      // Check for dynamic modules
      const scripts = packageJson.scripts || {};
      this.report.monorepoCompliance.dynamicModules = Object.keys(scripts).filter(script => 
        script.includes('dev:') || script.includes('build:') || script.includes('test:')
      );
      
    } catch (error) {
      this.report.monorepoCompliance.score = 0;
    }
    
    // Check for aliases in tsconfig
    const tsConfigPath = path.join(PROJECT_ROOT, 'tsconfig.json');
    try {
      const tsConfigContent = await fs.readFile(tsConfigPath, 'utf-8');
      const tsConfig = JSON.parse(tsConfigContent);
      this.report.monorepoCompliance.hasAliases = !!tsConfig.compilerOptions?.paths;
    } catch (error) {
      // No tsconfig found
    }
    
    // Calculate monorepo score
    let score = 0;
    if (this.report.monorepoCompliance.hasWorkspaces) score += 30;
    if (this.report.monorepoCompliance.hasAliases) score += 25;
    if (this.report.monorepoCompliance.hasScripts) score += 20;
    if (this.report.monorepoCompliance.dynamicModules.length > 5) score += 25;
    
    this.report.monorepoCompliance.score = score;
    
    console.log('✅ Monorepo compliance audit complete\n');
  }

  /**
   * 🔍 AUDIT MISSING COMPONENTS
   */
  private async auditMissingComponents(): Promise<void> {
    console.log('🔍 Auditing Missing Components...');
    
    const criticalComponents = [
      'components/Web8TabSystem.tsx',
      'components/LazyLoader.tsx', 
      'backend/Web8LightningPool.ts',
      'backend/realtime-server.ts',
      'lib/neuralAnalyzer.ts'
    ];
    
    for (const component of criticalComponents) {
      const fullPath = path.join(PROJECT_ROOT, component);
      try {
        await fs.access(fullPath);
      } catch {
        this.report.missingComponents.critical.push(component);
      }
    }
    
    const recommendedComponents = [
      'lib/web8-motion.ts',
      'backend/guardian/Guardian-web8.ts',
      'components/AGISheet/AGISheet.tsx'
    ];
    
    for (const component of recommendedComponents) {
      const fullPath = path.join(PROJECT_ROOT, component);
      try {
        await fs.access(fullPath);
      } catch {
        this.report.missingComponents.recommended.push(component);
      }
    }
    
    this.report.missingComponents.count = this.report.missingComponents.critical.length + 
                                         this.report.missingComponents.recommended.length;
    
    console.log('✅ Missing components audit complete\n');
  }

  /**
   * 💡 GENERATE WEB8 RECOMMENDATIONS
   */
  private async generateWeb8Recommendations(): Promise<void> {
    console.log('💡 Generating Web8 Recommendations...');
    
    // AGI Core recommendations
    if (this.report.web8Layers.agiCore.issues.length > 0) {
      this.report.recommendations.push('🧠 Complete AGI Core implementation with all engines');
    }
    
    // Lightning Pool recommendations
    if (this.report.web8Layers.lightning.issues.length > 0) {
      this.report.recommendations.push('⚡ Implement Web8 Lightning Pool for 12-layer processing');
    }
    
    // Security recommendations
    if (this.report.web8Layers.security.issues.length > 0) {
      this.report.recommendations.push('🛡️ Deploy Guardian Web8 security system');
    }
    
    // Monorepo recommendations
    if (!this.report.monorepoCompliance.hasWorkspaces) {
      this.report.recommendations.push('📦 Configure proper monorepo workspace structure');
    }
    
    // Performance recommendations
    if (this.report.web8Layers.optimization.coverage < 70) {
      this.report.recommendations.push('⚡ Enhance optimization layer with LazyLoader components');
    }
    
    // Monitoring recommendations
    if (this.report.web8Layers.monitoring.exists === false) {
      this.report.recommendations.push('📊 Implement comprehensive monitoring system');
    }
    
    console.log('✅ Web8 recommendations generated\n');
  }

  /**
   * 📊 CALCULATE WEB8 ARCHITECTURE SCORE
   */
  private calculateWeb8Score(): void {
    let totalScore = 0;
    let maxScore = 0;
    
    // Web8 Layers scoring (70% weight)
    Object.values(this.report.web8Layers).forEach(layer => {
      maxScore += 10;
      if (layer.exists) totalScore += 6;
      if (layer.issues.length === 0) totalScore += 2;
      totalScore += (layer.coverage / 100) * 2; // Coverage contribution
    });
    
    // Monorepo compliance (20% weight)
    maxScore += 20;
    totalScore += (this.report.monorepoCompliance.score / 100) * 20;
    
    // Missing components penalty (10% weight)
    maxScore += 10;
    const componentPenalty = Math.min(this.report.missingComponents.count * 1, 10);
    totalScore += (10 - componentPenalty);
    
    this.report.overallScore = Math.round((totalScore / maxScore) * 100);
    this.report.grade = this.getGrade(this.report.overallScore);
  }

  /**
   * 🔍 UTILITY: FIND FILES BY PATTERNS
   */
  private async findFiles(patterns: string[]): Promise<string[]> {
    const files: string[] = [];
    
    for (const pattern of patterns) {
      try {
        // Simple pattern matching for now - could be enhanced with glob
        const parts = pattern.split('/');
        let currentDir = PROJECT_ROOT;
        
        for (let i = 0; i < parts.length - 1; i++) {
          if (parts[i] === '**') continue;
          currentDir = path.join(currentDir, parts[i]);
        }
        
        try {
          const dirContents = await fs.readdir(currentDir, { recursive: true });
          const matching = dirContents.filter(file => {
            const fileName = path.basename(pattern);
            return fileName.includes('*') ? true : file.toString().includes(fileName.replace('*', ''));
          });
          
          files.push(...matching.map(file => path.join(currentDir, file.toString())));
        } catch {
          // Directory doesn't exist
        }
      } catch {
        // Pattern error
      }
    }
    
    return files;
  }

  /**
   * 📊 UTILITY: CALCULATE COVERAGE PERCENTAGE
   */
  private calculateCoverage(found: number, expected: number): number {
    return Math.min(Math.round((found / expected) * 100), 100);
  }

  /**
   * 🩺 UTILITY: ASSESS LAYER HEALTH
   */
  private assessHealth(layer: Web8LayerStatus): 'excellent' | 'good' | 'warning' | 'critical' {
    if (!layer.exists) return 'critical';
    if (layer.issues.length === 0 && layer.coverage >= 80) return 'excellent';
    if (layer.issues.length <= 1 && layer.coverage >= 60) return 'good';
    if (layer.issues.length <= 3 && layer.coverage >= 40) return 'warning';
    return 'critical';
  }

  /**
   * 🎓 UTILITY: GET GRADE FROM SCORE
   */
  private getGrade(score: number): 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F' {
    if (score >= 97) return 'A+';
    if (score >= 93) return 'A';
    if (score >= 87) return 'B+';
    if (score >= 83) return 'B';
    if (score >= 77) return 'C+';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  /**
   * 📋 PRINT COMPREHENSIVE WEB8 REPORT
   */
  public printReport(report: Web8LayerAuditReport): void {
    console.log(`\n${'='.repeat(80)}`);
    console.log('🔍 WEB8 12-LAYER ARCHITECTURE AUDIT REPORT');
    console.log(`📅 ${report.timestamp}`);
    console.log('='.repeat(80));

    // Overall Score
    const scoreColor = report.overallScore >= 90 ? '🟢' : 
                      report.overallScore >= 70 ? '🟡' : '🔴';
    console.log(`\n📊 OVERALL SCORE: ${scoreColor} ${report.overallScore}/100 (Grade: ${report.grade})\n`);

    // Web8 Layer Status
    console.log('🏗️ WEB8 12-LAYER STATUS:');
    Object.entries(report.web8Layers).forEach(([name, layer]) => {
      const healthIcon = layer.health === 'excellent' ? '🟢' : 
                        layer.health === 'good' ? '🟡' : 
                        layer.health === 'warning' ? '🟠' : '🔴';
      console.log(`   ${healthIcon} Layer ${name.toUpperCase()}: ${layer.health} (${layer.files.length} files, ${layer.coverage}% coverage)`);
      
      if (layer.issues.length > 0) {
        layer.issues.forEach(issue => console.log(`      ❌ ${issue}`));
      }
    });

    // Monorepo Compliance
    console.log('\n📦 MONOREPO COMPLIANCE:');
    console.log(`   Workspaces: ${report.monorepoCompliance.hasWorkspaces ? '✅' : '❌'}`);
    console.log(`   Aliases: ${report.monorepoCompliance.hasAliases ? '✅' : '❌'}`);
    console.log(`   Scripts: ${report.monorepoCompliance.hasScripts ? '✅' : '❌'}`);
    console.log(`   Dynamic Modules: ${report.monorepoCompliance.dynamicModules.length}`);
    console.log(`   Score: ${report.monorepoCompliance.score}/100`);

    // Missing Components
    console.log('\n🔍 MISSING COMPONENTS:');
    console.log(`   Critical: ${report.missingComponents.critical.length}`);
    if (report.missingComponents.critical.length > 0) {
      report.missingComponents.critical.forEach(comp => console.log(`      ❌ ${comp}`));
    }
    console.log(`   Recommended: ${report.missingComponents.recommended.length}`);

    // Performance Metrics
    console.log('\n⚡ PERFORMANCE METRICS:');
    console.log(`   Audit Time: ${report.performanceMetrics.loadTime}ms`);

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
    console.log('🚀 Starting Web8 12-Layer Architecture Audit...\n');
    
    const auditor = new Web8ProjectAuditor();
    const report = await auditor.performAudit();
    auditor.printReport(report);

    // Exit with appropriate code
    if (report.overallScore >= 70) {
      console.log('✅ Web8 audit passed - Architecture meets quality standards');
      process.exit(0);
    } else {
      console.log('❌ Web8 audit failed - Score below acceptable threshold (70)');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Web8 audit failed with error:', error);
    process.exit(1);
  }
}

// Execute main function if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { Web8ProjectAuditor, type Web8LayerAuditReport };
