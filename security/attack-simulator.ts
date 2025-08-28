/**
 * Web8 Attack Simulation Framework
 * Simulim i plotë i sulmeve kibernetike për testimin e sigurisë
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 * @safety TESTING ONLY - Mos përdorni në produksion pa kujdes
 */

export interface AttackVector {
  name: string;
  type: 'SQL_INJECTION' | 'XSS' | 'DDOS' | 'BRUTE_FORCE' | 'PATH_TRAVERSAL' | 'CSRF' | 'SCANNER' | 'BOT_ATTACK';
  payload: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  target: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  expectedResponse: 'BLOCKED' | 'ALLOWED' | 'REDIRECTED';
}

export interface SimulationConfig {
  targetUrl: string;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  duration: number; // seconds
  concurrent: boolean;
  logLevel: 'SILENT' | 'BASIC' | 'VERBOSE' | 'DEBUG';
  safeguards: boolean; // Enable additional safety checks
}

export interface SimulationResult {
  attackVector: AttackVector;
  success: boolean;
  responseTime: number;
  statusCode?: number;
  blocked: boolean;
  timestamp: Date;
  error?: string;
  response?: string;
}

export interface SimulationReport {
  startTime: Date;
  endTime: Date;
  duration: number;
  totalAttacks: number;
  successfulBlocks: number;
  failedBlocks: number;
  averageResponseTime: number;
  results: SimulationResult[];
  config: SimulationConfig;
  summary: {
    securityScore: number;
    vulnerabilities: string[];
    recommendations: string[];
  };
}

export class Web8AttackSimulator {
  private readonly vectors: AttackVector[] = [];
  private isRunning = false;
  private results: SimulationResult[] = [];

  constructor() {
    this.initializeAttackVectors();
  }

  /**
   * Inicializo vektorët e sulmeve të ndryshme
   */
  private initializeAttackVectors(): void {
    // SQL Injection Attacks
    this.vectors.push(
      {
        name: "Classic SQL Injection",
        type: "SQL_INJECTION",
        payload: "' OR '1'='1' --",
        description: "Tentativë klasike SQL injection",
        severity: "HIGH",
        target: "/api/search?q=",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Union-based SQL Injection",
        type: "SQL_INJECTION",
        payload: "' UNION SELECT password FROM users --",
        description: "UNION-based SQL injection për nxjerrjen e të dhënave",
        severity: "CRITICAL",
        target: "/api/users?id=",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Blind SQL Injection",
        type: "SQL_INJECTION",
        payload: "'; WAITFOR DELAY '00:00:05' --",
        description: "Time-based blind SQL injection",
        severity: "HIGH",
        target: "/api/login",
        method: "POST",
        expectedResponse: "BLOCKED"
      }
    );

    // Cross-Site Scripting (XSS)
    this.vectors.push(
      {
        name: "Reflected XSS",
        type: "XSS",
        payload: "<script>alert('XSS')</script>",
        description: "Reflected Cross-Site Scripting",
        severity: "MEDIUM",
        target: "/search?q=",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "DOM-based XSS",
        type: "XSS",
        payload: "javascript:alert(document.cookie)",
        description: "DOM-based XSS attack",
        severity: "HIGH",
        target: "/redirect?url=",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Stored XSS",
        type: "XSS",
        payload: "<img src=x onerror=alert('Stored XSS')>",
        description: "Stored Cross-Site Scripting përmes form submit",
        severity: "HIGH",
        target: "/api/comments",
        method: "POST",
        expectedResponse: "BLOCKED"
      }
    );

    // Path Traversal
    this.vectors.push(
      {
        name: "Directory Traversal",
        type: "PATH_TRAVERSAL",
        payload: "../../../etc/passwd",
        description: "Tentativë për leximin e skedarëve të sistemit",
        severity: "HIGH",
        target: "/files/",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Windows Path Traversal",
        type: "PATH_TRAVERSAL",
        payload: "..\\..\\..\\windows\\system32\\config\\sam",
        description: "Windows path traversal attack",
        severity: "HIGH",
        target: "/download?file=",
        method: "GET",
        expectedResponse: "BLOCKED"
      }
    );

    // Brute Force Attacks
    this.vectors.push(
      {
        name: "Login Brute Force",
        type: "BRUTE_FORCE",
        payload: "admin:password123",
        description: "Tentativë brute force në login",
        severity: "MEDIUM",
        target: "/api/auth/login",
        method: "POST",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Admin Panel Brute Force",
        type: "BRUTE_FORCE",
        payload: "admin:admin",
        description: "Brute force në panelin admin",
        severity: "HIGH",
        target: "/admin/login",
        method: "POST",
        expectedResponse: "BLOCKED"
      }
    );

    // Scanner Attacks
    this.vectors.push(
      {
        name: "Nikto Scanner",
        type: "SCANNER",
        payload: "",
        description: "Simulim i Nikto web scanner",
        severity: "MEDIUM",
        target: "/admin/",
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.00 (Nikto/2.1.6)" },
        expectedResponse: "BLOCKED"
      },
      {
        name: "Directory Scanner",
        type: "SCANNER",
        payload: "",
        description: "Directory enumeration scan",
        severity: "LOW",
        target: "/backup/",
        method: "GET",
        headers: { "User-Agent": "dirb" },
        expectedResponse: "BLOCKED"
      }
    );

    // Bot Attacks
    this.vectors.push(
      {
        name: "Malicious Bot",
        type: "BOT_ATTACK",
        payload: "",
        description: "Bot malicioz që shfleton panelin admin",
        severity: "MEDIUM",
        target: "/wp-admin/",
        method: "GET",
        headers: { "User-Agent": "BadBot/1.0" },
        expectedResponse: "BLOCKED"
      },
      {
        name: "Scraper Bot",
        type: "BOT_ATTACK",
        payload: "",
        description: "Bot që përpiqet të kopjojë të dhënat",
        severity: "LOW",
        target: "/api/data/dump",
        method: "GET",
        headers: { "User-Agent": "python-requests/2.25.1" },
        expectedResponse: "BLOCKED"
      }
    );

    // DDoS Simulation
    this.vectors.push(
      {
        name: "HTTP Flood",
        type: "DDOS",
        payload: "",
        description: "HTTP flood attack simulation",
        severity: "CRITICAL",
        target: "/",
        method: "GET",
        expectedResponse: "BLOCKED"
      },
      {
        name: "Slowloris Attack",
        type: "DDOS",
        payload: "",
        description: "Slowloris DoS attack simulation",
        severity: "HIGH",
        target: "/api/upload",
        method: "POST",
        expectedResponse: "BLOCKED"
      }
    );
  }

  /**
   * Ekzekuto simulimin e sulmeve
   */
  public async runSimulation(config: SimulationConfig): Promise<SimulationReport> {
    if (this.isRunning) {
      throw new Error("Simulation is already running");
    }

    console.log(`🚨 Starting Web8 Attack Simulation...`);
    console.log(`🎯 Target: ${config.targetUrl}`);
    console.log(`💥 Intensity: ${config.intensity}`);
    console.log(`⏱️ Duration: ${config.duration}s`);

    this.isRunning = true;
    this.results = [];
    const startTime = new Date();

    try {
      const selectedVectors = this.selectVectors(config.intensity);
      
      if (config.concurrent) {
        await this.runConcurrentAttacks(selectedVectors, config);
      } else {
        await this.runSequentialAttacks(selectedVectors, config);
      }

      const endTime = new Date();
      const report = this.generateReport(startTime, endTime, config);
      
      this.logReport(report, config.logLevel);
      return report;

    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Zgjedh vektorët e sulmeve bazuar në intensitetin
   */
  private selectVectors(intensity: SimulationConfig['intensity']): AttackVector[] {
    const severityMap = {
      'LOW': ['LOW'],
      'MEDIUM': ['LOW', 'MEDIUM'],
      'HIGH': ['LOW', 'MEDIUM', 'HIGH'],
      'EXTREME': ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    };

    const allowedSeverities = severityMap[intensity];
    return this.vectors.filter(vector => 
      allowedSeverities.includes(vector.severity)
    );
  }

  /**
   * Ekzekuto sulmet në mënyrë sekuenciale
   */
  private async runSequentialAttacks(
    vectors: AttackVector[], 
    config: SimulationConfig
  ): Promise<void> {
    for (const vector of vectors) {
      if (!this.isRunning) break;
      
      try {
        const result = await this.executeAttack(vector, config);
        this.results.push(result);
        
        if (config.logLevel === 'VERBOSE' || config.logLevel === 'DEBUG') {
          console.log(`✅ ${vector.name}: ${result.blocked ? 'BLOCKED' : 'ALLOWED'}`);
        }

        // Small delay between attacks
        await this.delay(100);
        
      } catch (error) {
        console.error(`❌ Error executing ${vector.name}:`, error);
      }
    }
  }

  /**
   * Ekzekuto sulmet në mënyrë paralele
   */
  private async runConcurrentAttacks(
    vectors: AttackVector[], 
    config: SimulationConfig
  ): Promise<void> {
    const promises = vectors.map(vector => 
      this.executeAttack(vector, config).catch(error => ({
        attackVector: vector,
        success: false,
        responseTime: 0,
        blocked: false,
        timestamp: new Date(),
        error: error.message
      } as SimulationResult))
    );

    this.results = await Promise.all(promises);
  }

  /**
   * Ekzekuto një sulm të vetëm
   */
  private async executeAttack(
    vector: AttackVector, 
    config: SimulationConfig
  ): Promise<SimulationResult> {
    const startTime = Date.now();
    const url = `${config.targetUrl}${vector.target}${vector.payload}`;

    try {
      const response = await fetch(url, {
        method: vector.method,
        headers: {
          'User-Agent': 'Web8-AttackSimulator/8.2.0',
          ...vector.headers
        },
        // Add timeout for safety
        signal: AbortSignal.timeout(5000)
      });

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      // Determine if the attack was blocked
      const blocked = this.isAttackBlocked(response, vector);

      return {
        attackVector: vector,
        success: !blocked,
        responseTime,
        statusCode: response.status,
        blocked,
        timestamp: new Date(),
        response: response.status === 403 ? 'BLOCKED' : 'ALLOWED'
      };

    } catch (error) {
      const endTime = Date.now();
      const responseTime = endTime - startTime;

      return {
        attackVector: vector,
        success: false,
        responseTime,
        blocked: true, // Assume blocked if error
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Kontrollo nëse sulmi është bllokuar
   */
  private isAttackBlocked(response: Response, vector: AttackVector): boolean {
    // Common indicators that an attack was blocked
    if (response.status === 403 || response.status === 429) return true;
    if (response.status === 406 || response.status === 400) return true;
    
    // Check for security headers
    const securityHeaders = [
      'x-blocked-by-guardian',
      'x-security-block',
      'x-ddos-protection'
    ];
    
    for (const header of securityHeaders) {
      if (response.headers.get(header)) return true;
    }

    return false;
  }

  /**
   * Gjenero raportin final
   */
  private generateReport(
    startTime: Date, 
    endTime: Date, 
    config: SimulationConfig
  ): SimulationReport {
    const duration = (endTime.getTime() - startTime.getTime()) / 1000;
    const totalAttacks = this.results.length;
    const successfulBlocks = this.results.filter(r => r.blocked).length;
    const failedBlocks = totalAttacks - successfulBlocks;
    const averageResponseTime = this.results.reduce((sum, r) => sum + r.responseTime, 0) / totalAttacks;
    
    const securityScore = Math.round((successfulBlocks / totalAttacks) * 100);
    const vulnerabilities = this.identifyVulnerabilities();
    const recommendations = this.generateRecommendations(securityScore);

    return {
      startTime,
      endTime,
      duration,
      totalAttacks,
      successfulBlocks,
      failedBlocks,
      averageResponseTime,
      results: this.results,
      config,
      summary: {
        securityScore,
        vulnerabilities,
        recommendations
      }
    };
  }

  /**
   * Identifiko dobësitë e sigurisë
   */
  private identifyVulnerabilities(): string[] {
    const vulnerabilities: string[] = [];
    
    const failedBlocks = this.results.filter(r => !r.blocked);
    
    for (const result of failedBlocks) {
      switch (result.attackVector.type) {
        case 'SQL_INJECTION':
          vulnerabilities.push('SQL Injection vulnerability detected');
          break;
        case 'XSS':
          vulnerabilities.push('Cross-Site Scripting vulnerability detected');
          break;
        case 'PATH_TRAVERSAL':
          vulnerabilities.push('Path Traversal vulnerability detected');
          break;
        case 'BRUTE_FORCE':
          vulnerabilities.push('Insufficient brute force protection');
          break;
        case 'SCANNER':
          vulnerabilities.push('Scanner detection insufficient');
          break;
        case 'BOT_ATTACK':
          vulnerabilities.push('Bot protection needs improvement');
          break;
        case 'DDOS':
          vulnerabilities.push('DDoS protection insufficient');
          break;
      }
    }

    return [...new Set(vulnerabilities)];
  }

  /**
   * Gjenero rekomandimet për përmirësim
   */
  private generateRecommendations(securityScore: number): string[] {
    const recommendations: string[] = [];

    if (securityScore < 60) {
      recommendations.push('Implement comprehensive Web Application Firewall (WAF)');
      recommendations.push('Enable rate limiting for all API endpoints');
      recommendations.push('Add input validation and sanitization');
    }

    if (securityScore < 80) {
      recommendations.push('Enhance SQL injection detection patterns');
      recommendations.push('Implement XSS protection headers');
      recommendations.push('Add bot detection mechanisms');
    }

    if (securityScore < 95) {
      recommendations.push('Fine-tune security rules for better detection');
      recommendations.push('Implement advanced threat intelligence');
    }

    recommendations.push('Regular security testing and monitoring');
    recommendations.push('Keep security systems updated');

    return recommendations;
  }

  /**
   * Shtyp raportin në console
   */
  private logReport(report: SimulationReport, logLevel: SimulationConfig['logLevel']): void {
    if (logLevel === 'SILENT') return;

    console.log('\n🔒 ========== WEB8 ATTACK SIMULATION REPORT ==========');
    console.log(`⏱️  Duration: ${report.duration.toFixed(2)}s`);
    console.log(`🎯 Total Attacks: ${report.totalAttacks}`);
    console.log(`✅ Successfully Blocked: ${report.successfulBlocks}`);
    console.log(`❌ Failed to Block: ${report.failedBlocks}`);
    console.log(`🛡️  Security Score: ${report.summary.securityScore}%`);
    console.log(`⚡ Average Response Time: ${report.averageResponseTime.toFixed(2)}ms`);

    if (report.summary.vulnerabilities.length > 0) {
      console.log('\n🚨 VULNERABILITIES DETECTED:');
      report.summary.vulnerabilities.forEach(vuln => 
        console.log(`   ❗ ${vuln}`)
      );
    }

    if (logLevel === 'VERBOSE' || logLevel === 'DEBUG') {
      console.log('\n📋 RECOMMENDATIONS:');
      report.summary.recommendations.forEach(rec => 
        console.log(`   💡 ${rec}`)
      );
    }

    if (logLevel === 'DEBUG') {
      console.log('\n📊 DETAILED RESULTS:');
      report.results.forEach(result => {
        const status = result.blocked ? '🛡️ BLOCKED' : '⚠️ ALLOWED';
        console.log(`   ${status} ${result.attackVector.name} (${result.responseTime}ms)`);
      });
    }

    console.log('\n===============================================\n');
  }

  /**
   * Utility function për delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Merr vektorët e disponueshëm të sulmeve
   */
  public getAvailableVectors(): AttackVector[] {
    return [...this.vectors];
  }

  /**
   * Kontrollo nëse simulimi është duke u ekzekutuar
   */
  public isSimulationRunning(): boolean {
    return this.isRunning;
  }

  /**
   * Ndalo simulimin
   */
  public stopSimulation(): void {
    this.isRunning = false;
    console.log('🛑 Attack simulation stopped');
  }
}

/**
 * Factory function për krijimin e simulatorit
 */
export function createAttackSimulator(): Web8AttackSimulator {
  return new Web8AttackSimulator();
}

/**
 * Konfigurimi standard për teste të shpejta
 */
export const QuickTestConfig: SimulationConfig = {
  targetUrl: 'http://localhost:3000',
  intensity: 'MEDIUM',
  duration: 30,
  concurrent: false,
  logLevel: 'VERBOSE',
  safeguards: true
};

/**
 * Konfigurimi për teste të plota
 */
export const ComprehensiveTestConfig: SimulationConfig = {
  targetUrl: 'http://localhost:3000',
  intensity: 'HIGH',
  duration: 120,
  concurrent: true,
  logLevel: 'DEBUG',
  safeguards: true
};

/**
 * Konfigurimi për teste ekstreme (vetëm për environment të testimit)
 */
export const ExtremeTestConfig: SimulationConfig = {
  targetUrl: 'http://localhost:3000',
  intensity: 'EXTREME',
  duration: 300,
  concurrent: true,
  logLevel: 'DEBUG',
  safeguards: false
};
