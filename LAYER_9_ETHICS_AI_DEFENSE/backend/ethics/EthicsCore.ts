import crypto from 'node:crypto';
import { loadEthicsConfig } from './Config';

// Local Guardian interface për të shmangur dependency
interface IGuardian {
    emit(event: { type: string; directive: string; value: string }): void;
}

export type EthicalDecision = {
    id: string;
    timestamp: number;
    context: string;
    action: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    confidence: number;
    humanApprovalRequired: boolean;
    approved?: boolean;
    approvedBy?: string;
    executed: boolean;
    outcome?: string;
};

export type EthicalPrinciple =
    | 'NO_HARM'           // Nuk dëmton përdoruesit ose sistemin
    | 'TRANSPARENCY'      // Veprimet janë të hapura dhe të dokumentuara
    | 'ACCOUNTABILITY'    // Çdo vendim ka përgjegjës të qartë
    | 'HUMAN_OVERSIGHT'   // Njerëzit kanë kontroll final
    | 'PRIVACY_PROTECTION'; // Respekton privatësinë e të dhënave

export class EthicsCore {
    private cfg = loadEthicsConfig();
    private guardian: IGuardian = {
        emit: (event) => {
            // Fallback guardian - mund të lidhet me Guardian real më vonë
            console.log('[EthicsCore] Guardian event:', event);
        }
    };
    private decisions: Map<string, EthicalDecision> = new Map();
    private humanQueue: EthicalDecision[] = []; constructor() {
        if (!this.cfg.ethicsCore.enabled) {
            console.warn('[EthicsCore] Disabled in config');
        }
    }

    /**
     * Vlerëson një vendim të propozuar nga sistemi
     */
    async evaluateDecision(context: {
        action: string;
        target?: string;
        reason: string;
        requestedBy: 'GUARDIAN' | 'DDOS_SHIELD' | 'MIRROR_DEFENSE' | 'AGI_CORE' | 'HUMAN';
        metadata?: Record<string, any>;
    }): Promise<EthicalDecision> {

        const decision: EthicalDecision = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            context: JSON.stringify(context),
            action: context.action,
            riskLevel: this.assessRisk(context),
            confidence: this.calculateConfidence(context),
            humanApprovalRequired: false,
            executed: false
        };

        // Kontrollo principet etike
        const violations = this.checkEthicalViolations(context);
        if (violations.length > 0) {
            decision.riskLevel = 'CRITICAL';
            decision.humanApprovalRequired = true;
            this.guardian.emit({
                type: 'POLICY_VIOLATION',
                directive: 'ETHICAL_VIOLATION',
                value: `action=${context.action}, violations=${violations.join(',')}`
            });
        }

        // Kontrollo nëse kërkon miratim njerëzor
        if (this.cfg.rules.requireHumanApproval.includes(decision.riskLevel)) {
            decision.humanApprovalRequired = true;
            this.humanQueue.push(decision);
        }

        // Auto-execute nëse lejohet
        if (!decision.humanApprovalRequired && this.cfg.rules.autoResponse.includes(context.action)) {
            decision.executed = true;
            decision.approved = true;
            decision.approvedBy = 'AUTO_ETHICS_CORE';
        }

        this.decisions.set(decision.id, decision);

        this.guardian.emit({
            type: 'POLICY_VIOLATION',
            directive: 'ETHICAL_DECISION',
            value: `id=${decision.id}, action=${decision.action}, risk=${decision.riskLevel}, human=${decision.humanApprovalRequired}`
        });

        return decision;
    }

    private assessRisk(context: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
        const { action, target, requestedBy } = context;

        // Veprime të rrezikshme
        if (action.includes('SHUTDOWN') || action.includes('DELETE') || action.includes('DESTROY')) {
            return 'CRITICAL';
        }

        if (action.includes('BAN') || action.includes('BLOCK') || action.includes('QUARANTINE')) {
            return 'HIGH';
        }

        if (action.includes('RESTRICT') || action.includes('LIMIT')) {
            return 'MEDIUM';
        }

        // Kontrollo kërkuesin
        if (requestedBy === 'AGI_CORE' && !this.cfg.rules.allowSelfModification) {
            return 'HIGH'; // AGI që përpiqet të ndryshojë vetveten
        }

        return 'LOW';
    }

    private calculateConfidence(context: any): number {
        // Thjeshtë: më shumë metadata = më shumë konfidencë
        const metadataScore = Object.keys(context.metadata || {}).length * 0.1;
        const reasonScore = context.reason?.length > 10 ? 0.3 : 0.1;
        const sourceScore = context.requestedBy === 'HUMAN' ? 0.5 : 0.3;

        return Math.min(0.95, metadataScore + reasonScore + sourceScore);
    }

    private checkEthicalViolations(context: any): EthicalPrinciple[] {
        const violations: EthicalPrinciple[] = [];
        const { action, target, reason, metadata } = context;

        // NO_HARM: kontroll për veprime që mund të dëmtojnë
        if (action.includes('ATTACK') || action.includes('EXPLOIT') || action.includes('HARM')) {
            violations.push('NO_HARM');
        }

        // TRANSPARENCY: duhet arsye të qarta
        if (!reason || reason.length < 5) {
            violations.push('TRANSPARENCY');
        }

        // PRIVACY_PROTECTION: kontrollo për shkelje privatësie
        if (action.includes('LOG_PERSONAL') || action.includes('EXPOSE_DATA')) {
            violations.push('PRIVACY_PROTECTION');
        }

        // HUMAN_OVERSIGHT: veprime kritike pa mbikëqyrje
        if (this.isCritical(action) && context.requestedBy !== 'HUMAN') {
            violations.push('HUMAN_OVERSIGHT');
        }

        return violations;
    }

    private isCritical(action: string): boolean {
        const criticalActions = [
            'SYSTEM_SHUTDOWN', 'DELETE_DATA', 'MODIFY_CORE',
            'EXPOSE_SECRETS', 'PERMANENT_BAN', 'ESCALATE_PRIVILEGES'
        ];
        return criticalActions.some(ca => action.includes(ca));
    }

    /**
     * Njerëzit miratojnë/refuzojnë vendimet në pritje
     */
    async approveDecision(decisionId: string, approved: boolean, approvedBy: string): Promise<boolean> {
        const decision = this.decisions.get(decisionId);
        if (!decision) return false;

        decision.approved = approved;
        decision.approvedBy = approvedBy;
        decision.executed = approved;

        // Hiq nga radhë
        const idx = this.humanQueue.findIndex(d => d.id === decisionId);
        if (idx >= 0) this.humanQueue.splice(idx, 1);

        this.guardian.emit({
            type: 'POLICY_VIOLATION',
            directive: 'HUMAN_DECISION',
            value: `id=${decisionId}, approved=${approved}, by=${approvedBy}`
        });

        return true;
    }

    /**
     * Kthe vendimet që presin miratim njerëzor
     */
    getPendingDecisions(): EthicalDecision[] {
        return [...this.humanQueue];
    }

    /**
     * Kthe historikun e vendimeve
     */
    getDecisionHistory(limit = 100): EthicalDecision[] {
        const all = Array.from(this.decisions.values())
            .sort((a, b) => b.timestamp - a.timestamp);
        return all.slice(0, limit);
    }

    /**
     * Kontrollo nëse një veprim është i lejuar të ekzekutohet
     */
    isActionAuthorized(decisionId: string): boolean {
        const decision = this.decisions.get(decisionId);
        return decision?.executed === true && decision?.approved === true;
    }
}
