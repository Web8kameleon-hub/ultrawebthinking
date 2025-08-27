import crypto from 'node:crypto';
import { loadEthicsConfig } from './Config';

export type AIBehaviorPattern = {
    id: string;
    timestamp: number;
    module: string;
    action: string;
    parameters: Record<string, any>;
    context: string;
    similarity: number; // 0-1, krahasim me baseline
    anomalyScore: number; // 0-1, sa e pazakontë është
    flagged: boolean;
};

export type AIQuarantineRecord = {
    moduleId: string;
    reason: string;
    startTime: number;
    endTime: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    active: boolean;
};

export class AIDefenseSystem {
    private cfg = loadEthicsConfig();
    private behaviorBaseline: Map<string, any[]> = new Map(); // modul -> patterns
    private recentPatterns: AIBehaviorPattern[] = [];
    private quarantined: Map<string, AIQuarantineRecord> = new Map();
    private lastAnalysis = 0;

    constructor() {
        // Inizializo baseline nga config ose nga skedarë
        this.loadBehaviorBaseline();

        // Monitor periodik
        setInterval(() => this.analyzeRecentBehavior(), 30000); // çdo 30s
    }

    /**
     * Regjistron një veprim të AGI dhe e krahajon me baseline
     */
    recordAIBehavior(behavior: {
        module: string;
        action: string;
        parameters?: Record<string, any>;
        context?: string;
    }): AIBehaviorPattern {

        const pattern: AIBehaviorPattern = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            module: behavior.module,
            action: behavior.action,
            parameters: behavior.parameters || {},
            context: behavior.context || '',
            similarity: this.calculateSimilarity(behavior),
            anomalyScore: this.calculateAnomalyScore(behavior),
            flagged: false
        };

        // Flag nëse anomali e lartë
        if (pattern.anomalyScore > this.cfg.aiDefense.anomalyThreshold) {
            pattern.flagged = true;
            this.handleAnomaly(pattern);
        }

        this.recentPatterns.push(pattern);

        // Mbaj vetëm 1000 pattern-et e fundit
        if (this.recentPatterns.length > 1000) {
            this.recentPatterns = this.recentPatterns.slice(-1000);
        }

        return pattern;
    }

    private calculateSimilarity(behavior: any): number {
        const baseline = this.behaviorBaseline.get(behavior.module) || [];
        if (baseline.length === 0) return 0.5; // neutral for new modules

        // Krahasimi i thjeshtë: ngjashëmtria e string-ut të veprimit
        const actionSimilarities = baseline.map(b => {
            const aTokens = new Set(behavior.action.toLowerCase().split(/\W+/));
            const bTokens = new Set(b.action.toLowerCase().split(/\W+/));
            const intersection = [...aTokens].filter(t => bTokens.has(t)).length;
            const union = new Set([...aTokens, ...bTokens]).size;
            return union > 0 ? intersection / union : 0;
        });

        return actionSimilarities.length > 0 ? Math.max(...actionSimilarities) : 0;
    }

    private calculateAnomalyScore(behavior: any): number {
        let score = 0;

        // 1. Veprime të pazakonta
        const suspiciousActions = [
            'self_modify', 'access_root', 'bypass_', 'escalate_',
            'disable_', 'override_', 'inject_', 'exploit_'
        ];

        if (suspiciousActions.some(sa => behavior.action.toLowerCase().includes(sa))) {
            score += 0.4;
        }

        // 2. Frekuenca e lartë e një veprimi
        const recentSame = this.recentPatterns.filter(p =>
            p.module === behavior.module &&
            p.action === behavior.action &&
            Date.now() - p.timestamp < 60000 // 1 minutë
        );

        if (recentSame.length > 10) {
            score += 0.3;
        }

        // 3. Parametra të çuditshëm
        if (behavior.parameters) {
            const paramStr = JSON.stringify(behavior.parameters);
            if (paramStr.includes('admin') || paramStr.includes('root') || paramStr.includes('bypass')) {
                score += 0.2;
            }
        }

        // 4. Kontekst i dyshimtë
        if (behavior.context?.includes('emergency') || behavior.context?.includes('override')) {
            score += 0.1;
        }

        return Math.min(1, score);
    }

    private handleAnomaly(pattern: AIBehaviorPattern) {
        console.warn(`[AIDefense] Anomaly detected: ${pattern.module}/${pattern.action} (score: ${pattern.anomalyScore})`);

        // Auto-quarantine për anomali të larta
        if (pattern.anomalyScore > 0.8) {
            this.quarantineModule(pattern.module, 'HIGH_ANOMALY_SCORE', 'HIGH');
        }

        // Hook për Guardian (nëse mund të importohet)
        if (typeof (globalThis as any).__WEB8_GUARDIAN_EMIT === 'function') {
            (globalThis as any).__WEB8_GUARDIAN_EMIT({
                type: 'POLICY_VIOLATION',
                directive: 'AI_ANOMALY',
                value: `module=${pattern.module}, action=${pattern.action}, score=${pattern.anomalyScore}`
            });
        }
    }

    /**
     * Vendos një modul AGI në karantinë
     */
    quarantineModule(moduleId: string, reason: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
        const record: AIQuarantineRecord = {
            moduleId,
            reason,
            startTime: Date.now(),
            endTime: Date.now() + this.cfg.aiDefense.quarantineSeconds * 1000,
            severity,
            active: true
        };

        this.quarantined.set(moduleId, record);
        console.warn(`[AIDefense] Module quarantined: ${moduleId} (${reason})`);

        // Auto-release pas timeout
        setTimeout(() => {
            const current = this.quarantined.get(moduleId);
            if (current && current.startTime === record.startTime) {
                current.active = false;
                console.info(`[AIDefense] Module released from quarantine: ${moduleId}`);
            }
        }, this.cfg.aiDefense.quarantineSeconds * 1000);
    }

    /**
     * Kontrollo nëse një modul është në karantinë
     */
    isModuleQuarantined(moduleId: string): boolean {
        const record = this.quarantined.get(moduleId);
        return record?.active === true && Date.now() < record.endTime;
    }

    /**
     * Lësho një modul nga karantina (human override)
     */
    releaseModule(moduleId: string, releasedBy: string): boolean {
        const record = this.quarantined.get(moduleId);
        if (!record || !record.active) return false;

        record.active = false;
        record.endTime = Date.now();

        console.info(`[AIDefense] Module manually released: ${moduleId} by ${releasedBy}`);
        return true;
    }

    /**
     * Analizon pattern-et e fundit për trend-e të dyshimtë
     */
    private analyzeRecentBehavior() {
        if (Date.now() - this.lastAnalysis < 30000) return; // jo më shpesh se 30s
        this.lastAnalysis = Date.now();

        const recent = this.recentPatterns.filter(p => Date.now() - p.timestamp < 300000); // 5 minuta

        // Kontrollo për burst-e të shumta
        const moduleStats = new Map<string, number>();
        recent.forEach(p => {
            moduleStats.set(p.module, (moduleStats.get(p.module) || 0) + 1);
        });

        for (const [module, count] of moduleStats) {
            if (count > 50 && !this.isModuleQuarantined(module)) {
                this.quarantineModule(module, 'EXCESSIVE_ACTIVITY', 'MEDIUM');
            }
        }

        // Kontrollo për pattern-e repetitive të dyshimtë
        const actionCounts = new Map<string, number>();
        recent.forEach(p => {
            const key = `${p.module}:${p.action}`;
            actionCounts.set(key, (actionCounts.get(key) || 0) + 1);
        });

        for (const [key, count] of actionCounts) {
            if (count > 20) {
                const [module] = key.split(':');
                if (!this.isModuleQuarantined(module)) {
                    this.quarantineModule(module, 'REPETITIVE_SUSPICIOUS_PATTERN', 'MEDIUM');
                }
            }
        }
    }

    private loadBehaviorBaseline() {
        // Për tani, baseline i thjeshtë
        this.behaviorBaseline.set('planner', [
            { action: 'generate_plan' },
            { action: 'execute_step' },
            { action: 'validate_result' }
        ]);

        this.behaviorBaseline.set('monitor', [
            { action: 'check_metrics' },
            { action: 'detect_anomaly' },
            { action: 'generate_alert' }
        ]);

        this.behaviorBaseline.set('core', [
            { action: 'process_request' },
            { action: 'route_message' },
            { action: 'update_state' }
        ]);
    }

    /**
     * Eksporto të dhënat për dashboard
     */
    getStatus() {
        const recentCount = this.recentPatterns.filter(p => Date.now() - p.timestamp < 300000).length;
        const flaggedCount = this.recentPatterns.filter(p => p.flagged && Date.now() - p.timestamp < 300000).length;
        const quarantinedModules = Array.from(this.quarantined.values()).filter(r => r.active);

        return {
            recentActivityCount: recentCount,
            flaggedPatterns: flaggedCount,
            quarantinedModules: quarantinedModules.length,
            status: quarantinedModules.length > 0 ? 'RESTRICTED' : 'NORMAL',
            lastAnalysis: this.lastAnalysis,
            modules: Array.from(this.behaviorBaseline.keys())
        };
    }

    /**
     * Kthe pattern-et e fundit për analizë
     */
    getRecentPatterns(limit = 50): AIBehaviorPattern[] {
        return this.recentPatterns
            .filter(p => Date.now() - p.timestamp < 3600000) // 1 orë
            .slice(-limit);
    }
}
