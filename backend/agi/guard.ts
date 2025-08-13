/**
 * EuroWeb AGI Module Guard - Siguria dhe kontrolli i moduleve AGI
 * @module AGIModuleGuard
 * @author EuroWeb Development Team
 * @version 8.0.0 Industrial
 */

import type { AGIModule, EuroWebConfig } from '../src/agi/types';

interface TrustedModule {
  name: string;
  trustLevel: 'core' | 'trusted' | 'standard' | 'restricted';
  permissions: string[];
  lastValidated: number;
  validationHash: string;
}

interface ModuleLimits {
  maxConcurrentModules: number;
  maxMemoryUsage: number;
  maxCpuUsage: number;
}

interface SecurityEvent {
  timestamp: number;
  type: string;
  moduleName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityValidation {
  isValid: boolean;
  moduleName: string;
  timestamp: number;
  securityLevel: string;
  threats: string[];
  recommendations: string[];
}

export class AGIModuleGuard {
  private allowedModules: Set<string> = new Set();
  private trustedModules: Map<string, TrustedModule> = new Map();
  private securityLevel: 'standard' | 'high' | 'military' | 'post-quantum';
  private moduleLimits: ModuleLimits;
  private auditLog: SecurityEvent[] = [];
  
  constructor(config: Partial<EuroWebConfig> = {}) {
    this.securityLevel = config.securityLevel || 'standard';
    this.moduleLimits = this.getDefaultLimits();
    this.initializeDefaultModules();
    this.startSecurityMonitoring();
  }

  private initializeDefaultModules(): void {
    // Core EuroWeb modules që janë të sigurta by default
    const coreModules = [
      'mind', 'sense', 'planner', 'response', 'monitor',
      'echo-engine', 'orchestrator', 'memory-layer',
      'signal-trace', 'intelli-context', 'navigation',
      'mesh-network', 'ddos-protection', 'governance'
    ];

    coreModules.forEach(module => {
      this.allowedModules.add(module);
      this.trustedModules.set(module, {
        name: module,
        trustLevel: 'core',
        permissions: this.getCorePermissions(),
        lastValidated: Date.now(),
        validationHash: this.generateValidationHash(module)
      });
    });

  }

  /**
   * Get default security limits for modules
   */
  private getDefaultLimits(): ModuleLimits {
    return {
      maxConcurrentModules: 10,
      maxMemoryUsage: 512 * 1024 * 1024, // 512MB
      maxCpuUsage: 70 // 70% CPU
    };
  }

  /**
   * Get core module permissions
   */
  private getCorePermissions(): string[] {
    return ['read', 'write', 'execute', 'network', 'memory'];
  }

  /**
   * Generate validation hash for module
   */
  private generateValidationHash(data: string): string {
    // Simple hash generation for validation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Start security monitoring
   */
  private startSecurityMonitoring(): void {
    console.log('🛡️ AGI Module Guard security monitoring started');
  }

  /**
   * Log security events
   */
  private logSecurityEvent(type: string, moduleName: string, severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'): void {
    const event: SecurityEvent = {
      timestamp: Date.now(),
      type,
      moduleName,
      severity
    };
    this.auditLog.push(event);
    console.warn(`🔒 Security Event: ${type} for module ${moduleName}`);
  }

  /**
   * Check if security level is compatible
   */
  private isSecurityLevelCompatible(trustLevel: string): boolean {
    const securityMatrix = {
      'standard': ['core', 'trusted', 'standard'],
      'high': ['core', 'trusted'],
      'military': ['core'],
      'post-quantum': ['core']
    };
    return securityMatrix[this.securityLevel]?.includes(trustLevel) || false;
  }

  /**
   * Check resource limits for module
   */
  private checkResourceLimits(moduleName: string): { allowed: boolean; reason?: string } {
    // Simplified resource check
    const activeModules = this.trustedModules.size;
    if (activeModules >= this.moduleLimits.maxConcurrentModules) {
      return { allowed: false, reason: 'Too many active modules' };
    }
    return { allowed: true };
  }

  /**
   * Validate Module - Kontrollon nëse moduli është i sigurt
   */
  public validateModule(moduleName: string, moduleCode?: string): SecurityValidation {
    const validation: SecurityValidation = {
      isValid: false,
      moduleName,
      timestamp: Date.now(),
      securityLevel: this.securityLevel,
      threats: [],
      recommendations: []
    };

    try {
      // 1. Check if module is in allowed list
      if (!this.allowedModules.has(moduleName)) {
        validation.threats.push('Module not in allowed list');
        validation.recommendations.push('Add module to authorized list first');
        this.logSecurityEvent('unauthorized_module_access', moduleName);
        return validation;
      }

      // 2. Check trusted module status
      const trustedModule = this.trustedModules.get(moduleName);
      if (!trustedModule) {
        validation.threats.push('Module not in trusted registry');
        validation.recommendations.push('Register module in trusted registry');
        return validation;
      }

      // 3. Validate module hash if code is provided
      if (moduleCode) {
        const currentHash = this.generateValidationHash(moduleCode);
        if (currentHash !== trustedModule.validationHash) {
          validation.threats.push('Module hash mismatch - possible tampering');
          validation.recommendations.push('Re-validate module integrity');
          this.logSecurityEvent('module_tampering_detected', moduleName);
          return validation;
        }
      }

      // 4. Check security level compatibility
      if (!this.isSecurityLevelCompatible(trustedModule.trustLevel)) {
        validation.threats.push('Module security level incompatible');
        validation.recommendations.push('Upgrade module security or lower system security level');
        return validation;
      }

      // 5. Check resource limits
      const resourceCheck = this.checkResourceLimits(moduleName);
      if (!resourceCheck.allowed) {
        validation.threats.push('Module exceeds resource limits');
        validation.recommendations.push(`Reduce usage: ${resourceCheck.reason}`);
        return validation;
      }

      // All checks passed
      validation.isValid = true;
      validation.recommendations.push('Module is secure and validated');
      return validation;

    } catch (error) {
      validation.threats.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error(`❌ AGIModuleGuard: Dështoi autorizimi i modulit '${moduleName}': ${error instanceof Error ? error.message : 'Unknown error'}`);
      return validation;
    }
  }

  /**
   * Get security audit summary
   */
  public getSecurityAudit(): { threats: string[]; warnings: number } {
    const threats = this.auditLog.filter(event => event.severity === 'high' || event.severity === 'critical')
                                 .map(event => `${event.type} in ${event.moduleName}`);
    
    if (threats.length > 0) {
      console.warn(`⚠️ Security audit detected ${threats.length} threats`);
    }
    
    return {
      threats,
      warnings: this.auditLog.filter(event => event.severity === 'medium').length
    };
  }
}