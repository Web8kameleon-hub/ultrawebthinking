import { AIDefenseSystem } from './AIDefenseSystem';
import { loadEthicsConfig } from './Config';
import { EthicsCore } from './EthicsCore';

export type EthicsIntegration = {
    guardian?: any;
    ddosShield?: any;
    mirrorDefense?: any;
};

export class EthicsOrchestrator {
    private cfg = loadEthicsConfig();
    private ethics = new EthicsCore();
    private aiDefense = new AIDefenseSystem();
    private integrations: EthicsIntegration = {};

    constructor() {
        this.setupGlobalHooks();
    }

    /**
     * Getter për AI Defense System
     */
    get aiDefenseSystem() {
        return this.aiDefense;
    }

    /**
     * Regjistro sisteme të tjera mbrojtës
     */
    registerIntegrations(integrations: EthicsIntegration) {
        this.integrations = { ...this.integrations, ...integrations };
        console.info('[EthicsOrchestrator] Integrations registered:', Object.keys(integrations));
    }    /**
     * Hook kryesor: çdo sistem mbrojtës kalon nëpër këtu para se të veprojë
     */
    async requestAction(context: {
        requestedBy: 'GUARDIAN' | 'DDOS_SHIELD' | 'MIRROR_DEFENSE' | 'AGI_CORE' | 'HUMAN';
        action: string;
        target?: string;
        reason: string;
        severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
        metadata?: Record<string, any>;
    }): Promise<{ authorized: boolean; decisionId?: string; reason?: string }> {

        if (!this.cfg.ethicsCore.enabled) {
            return { authorized: true, reason: 'Ethics disabled' };
        }

        try {
            // 1. Regjistro në AI Defense nëse vjen nga AGI
            if (context.requestedBy === 'AGI_CORE') {
                const pattern = this.aiDefense.recordAIBehavior({
                    module: context.metadata?.module || 'unknown',
                    action: context.action,
                    parameters: context.metadata,
                    context: context.reason
                });

                // Nëse moduli është në karantinë, refuzo
                if (this.aiDefense.isModuleQuarantined(pattern.module)) {
                    return {
                        authorized: false,
                        reason: `Module ${pattern.module} is quarantined`
                    };
                }
            }

            // 2. Vlerëso etikisht
            const decision = await this.ethics.evaluateDecision(context);

            // 3. Nëse kërkon miratim njerëzor, prit
            if (decision.humanApprovalRequired) {
                return {
                    authorized: false,
                    decisionId: decision.id,
                    reason: 'Human approval required'
                };
            }

            // 4. Nëse u miratua automatikisht
            if (decision.executed && decision.approved) {
                return {
                    authorized: true,
                    decisionId: decision.id,
                    reason: 'Auto-approved by ethics core'
                };
            }

            return {
                authorized: false,
                decisionId: decision.id,
                reason: 'Decision pending evaluation'
            };

        } catch (error) {
            console.error('[EthicsOrchestrator] Error evaluating action:', error);
            return {
                authorized: false,
                reason: 'Ethics evaluation failed'
            };
        }
    }

    /**
     * Approve/reject decisions nga human interface
     */
    async humanDecision(decisionId: string, approved: boolean, approvedBy: string): Promise<boolean> {
        return this.ethics.approveDecision(decisionId, approved, approvedBy);
    }

    /**
     * Release module nga quarantine
     */
    releaseQuarantinedModule(moduleId: string, releasedBy: string): boolean {
        return this.aiDefense.releaseModule(moduleId, releasedBy);
    }

    /**
     * Kthe status për dashboard
     */
    getSystemStatus() {
        return {
            ethics: {
                enabled: this.cfg.ethicsCore.enabled,
                mode: this.cfg.ethicsCore.mode,
                pendingDecisions: this.ethics.getPendingDecisions().length,
                recentDecisions: this.ethics.getDecisionHistory(10).length
            },
            aiDefense: this.aiDefense.getStatus(),
            integrations: {
                guardian: !!this.integrations.guardian,
                ddosShield: !!this.integrations.ddosShield,
                mirrorDefense: !!this.integrations.mirrorDefense
            }
        };
    }

    /**
     * Kthe të dhënat për dashboard UI
     */
    getDashboardData() {
        return {
            pendingDecisions: this.ethics.getPendingDecisions(),
            recentDecisions: this.ethics.getDecisionHistory(20),
            aiPatterns: this.aiDefense.getRecentPatterns(30),
            systemStatus: this.getSystemStatus()
        };
    }

    /**
     * Emergency mode: kalon sistamin në mbrojtje maksimale
     */
    activateEmergencyMode(reason: string, activatedBy: string) {
        console.warn(`[EthicsOrchestrator] EMERGENCY MODE ACTIVATED by ${activatedBy}: ${reason}`);

        // Quarantine të gjithë modulet AGI
        ['planner', 'monitor', 'core', 'executor'].forEach(module => {
            this.aiDefense.quarantineModule(module, `EMERGENCY: ${reason}`, 'CRITICAL');
        });

        // Aktivizo Guardian nëse i integruar
        if (this.integrations.guardian?.emit) {
            this.integrations.guardian.emit({
                type: 'POLICY_VIOLATION',
                directive: 'EMERGENCY_MODE',
                value: `reason=${reason}, by=${activatedBy}`
            });
        }

        // Hook për sistemet e tjera (DDoS, Mirror)
        if (typeof (globalThis as any).__WEB8_EMERGENCY_HOOK === 'function') {
            (globalThis as any).__WEB8_EMERGENCY_HOOK({
                mode: 'EMERGENCY',
                reason,
                activatedBy,
                timestamp: Date.now()
            });
        }
    }

    /**
     * Setup global hooks për komunikim me sisteme të tjera
     */
    private setupGlobalHooks() {
        // Hook për Guardian të komunikojë me Ethics
        (globalThis as any).__WEB8_ETHICS_REQUEST = (context: any) => {
            return this.requestAction({ requestedBy: 'GUARDIAN', ...context });
        };

        // Hook për AGI të komunikojë me AI Defense
        (globalThis as any).__WEB8_AI_RECORD = (behavior: any) => {
            return this.aiDefense.recordAIBehavior(behavior);
        };

        // Hook për emergency mode
        (globalThis as any).__WEB8_EMERGENCY = (reason: string, by: string) => {
            this.activateEmergencyMode(reason, by);
        };
    }
}
