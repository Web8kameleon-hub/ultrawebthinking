import fs from 'node:fs';
import path from 'node:path';

export type EthicsConfig = {
    ethicsCore: {
        enabled: boolean;
        mode: 'GUARDIAN' | 'PASSIVE' | 'ACTIVE';
        decisionThresholds: Record<string, number>;
    };
    aiDefense: {
        selfMonitoring: boolean;
        behaviorBaseline: string;
        anomalyThreshold: number;
        quarantineSeconds: number;
    };
    rules: {
        allowSelfModification: boolean;
        requireHumanApproval: string[];
        autoResponse: string[];
        ethicalPrinciples: string[];
    };
    escalation: {
        levels: string[];
        timeouts: Record<string, number>;
    };
    integration: {
        guardianEvents: boolean;
        mirrorDefense: boolean;
        ddosShield: boolean;
        humanInterface: {
            dashboardUrl: string;
            alertWebhook: string;
            emergencyContact: string;
        };
    };
};

export function loadEthicsConfig(custom?: string): EthicsConfig {
    const p = custom ?? path.resolve(process.cwd(), 'LAYER_9_ETHICS_AI_DEFENSE', 'ethics.config.json');
    const raw = fs.readFileSync(p, 'utf-8');
    return JSON.parse(raw) as EthicsConfig;
}
