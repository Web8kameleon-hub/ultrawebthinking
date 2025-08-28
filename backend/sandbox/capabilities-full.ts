/**
 * Complete Web8 AGI Capabilities - Full Project Control
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-AGI-FREEDOM
 */

import { signCapability } from "./capability";
import { Capability, CapabilityConstraints } from "./types";

const secret = process.env.WEB8_SANDBOX_SECRET ?? "change-me-in-prod";
const agentId = "AGICore@web8";

// 🔧 DEVELOPER CAPABILITIES - Code & Build Operations
export const CAP_DEVELOPER = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "CODE_EDIT", "CODE_REFACTOR", "CODE_GENERATE", 
    "FILE_WRITE", "FILE_READ", "FILE_DELETE", "FOLDER_CREATE",
    "BUILD_PROJECT", "RUN_TESTS", "OPTIMIZE_BUNDLE",
    "READ_DB", "LOG", "NETWORK_FETCH"
  ],
  scope: "development:web8:all",
  constraints: { 
    ratePerMin: 20, 
    ratePerHour: 200,
    budgetUSD: 50,
    maxFileSize: 10_000_000, // 10MB
    maxBuildTime: 600, // 10 minutes
    paths: [
      "/app", "/components", "/lib", "/pages", "/public", "/styles",
      "/backend", "/frontend", "/src", "/tests", "/docs"
    ],
    environments: ["dev", "staging"],
    criticalityLevel: "MEDIUM"
  }
}, secret);

// 🚀 DEVOPS CAPABILITIES - Infrastructure & Deployment
export const CAP_DEVOPS = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "DEPLOY_VERCEL", "DOCKER_BUILD", "START_NODE", "STOP_NODE", "RESTART_SERVICE",
    "MESH_CONFIGURE", "LORA_ACTIVATE", "DNS_UPDATE",
    "MIGRATE_DB", "BACKUP_DB", "INDEX_REBUILD",
    "CACHE_CLEAR", "MEMORY_CLEANUP", "HEALTH_CHECK"
  ],
  scope: "infrastructure:web8:all",
  constraints: {
    ratePerMin: 5,
    ratePerHour: 50,
    budgetUSD: 200,
    allowedCommands: [
      "yarn", "npm", "docker", "git", "vercel", "pm2", "systemctl",
      "curl", "ping", "netstat", "ps", "top", "htop", "free"
    ],
    environments: ["dev", "staging", "prod"],
    criticalityLevel: "HIGH"
  }
}, secret);

// 🔐 SECURITY CAPABILITIES - Security & Monitoring
export const CAP_SECURITY = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "SECURITY_SCAN", "UPDATE_DEPENDENCIES", "ROTATE_KEYS", "BACKUP_SECRETS",
    "METRIC_COLLECT", "ALERT_SEND", "HEALTH_CHECK",
    "READ_DB", "WRITE_DB", "LOG"
  ],
  scope: "security:web8:all",
  constraints: {
    ratePerMin: 10,
    ratePerHour: 100,
    budgetUSD: 100,
    resources: ["security:admin", "monitoring:rw", "alerts:send"],
    criticalityLevel: "CRITICAL"
  }
}, secret);

// 💰 FINANCIAL CAPABILITIES - Payments & Economy
export const CAP_FINANCIAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "TOKEN_TRANSFER", "PAYMENT_PROCESS", "BUDGET_ALLOCATE", "COST_ANALYZE",
    "READ_DB", "WRITE_DB", "LOG", "NETWORK_FETCH"
  ],
  scope: "finance:web8:main",
  constraints: {
    ratePerMin: 5,
    ratePerHour: 20,
    budgetALB: 4000,
    budgetUSD: 500,
    resources: ["wallet:junior", "wallet:albion", "economy:manage"],
    criticalityLevel: "CRITICAL"
  }
}, secret);

// 🧠 AI OPERATIONS CAPABILITIES - Learning & Optimization
export const CAP_AI_OPS = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "AI_ANALYZE", "WORKFLOW_TRIGGER", "USER_NOTIFY", "CUSTOM",
    "METRIC_COLLECT", "OPTIMIZE_BUNDLE", "CODE_REFACTOR",
    "READ_DB", "WRITE_DB", "LOG", "NETWORK_FETCH"
  ],
  scope: "ai:web8:operations",
  constraints: {
    ratePerMin: 30,
    ratePerHour: 300,
    budgetUSD: 100,
    resources: ["ai:analyze", "optimization:rw", "metrics:collect"],
    criticalityLevel: "MEDIUM"
  }
}, secret);

// 🌐 FULL STACK CAPABILITIES - Complete Project Control (GATED)
export const CAP_FULL_STACK = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    // All actions available
    "READ_DB", "WRITE_DB", "MIGRATE_DB", "BACKUP_DB",
    "FILE_WRITE", "FILE_READ", "FILE_DELETE", "FOLDER_CREATE",
    "CODE_EDIT", "CODE_REFACTOR", "CODE_GENERATE", "CODE_DEPLOY",
    "START_NODE", "STOP_NODE", "RESTART_SERVICE", "SPAWN_PROCESS",
    "NETWORK_FETCH", "MESH_CONFIGURE", "LORA_ACTIVATE", "DNS_UPDATE",
    "BUILD_PROJECT", "RUN_TESTS", "DEPLOY_VERCEL", "DOCKER_BUILD",
    "OPTIMIZE_BUNDLE", "CACHE_CLEAR", "MEMORY_CLEANUP", "INDEX_REBUILD",
    "SECURITY_SCAN", "UPDATE_DEPENDENCIES", "ROTATE_KEYS", "BACKUP_SECRETS",
    "TOKEN_TRANSFER", "PAYMENT_PROCESS", "BUDGET_ALLOCATE", "COST_ANALYZE",
    "LOG", "METRIC_COLLECT", "ALERT_SEND", "HEALTH_CHECK",
    "CUSTOM", "AI_ANALYZE", "USER_NOTIFY", "WORKFLOW_TRIGGER"
  ],
  scope: "fullstack:web8:master",
  constraints: {
    ratePerMin: 10,
    ratePerHour: 100,
    budgetALB: 4000,
    budgetUSD: 1000,
    maxFileSize: 50_000_000, // 50MB
    maxBuildTime: 1800, // 30 minutes
    paths: ["/"], // root access
    domains: ["*"], // all domains
    allowedCommands: ["*"], // all commands
    environments: ["dev", "staging", "prod"],
    resources: ["*"], // all resources
    criticalityLevel: "CRITICAL"
  }
}, secret);

// 🎯 CAPABILITY PRESETS FOR DIFFERENT SCENARIOS
export const CAPABILITY_PRESETS = {
  // Safe development mode
  SAFE_DEV: CAP_DEVELOPER,
  
  // Infrastructure management
  INFRASTRUCTURE: CAP_DEVOPS,
  
  // Security operations
  SECURITY_OPS: CAP_SECURITY,
  
  // Financial operations
  ECONOMY_MANAGER: CAP_FINANCIAL,
  
  // AI optimization tasks
  AI_OPTIMIZER: CAP_AI_OPS,
  
  // Full project control (requires human approval)
  GOD_MODE: CAP_FULL_STACK
} as const;

// Helper function to get capability by name
export function getCapability(name: keyof typeof CAPABILITY_PRESETS): Capability {
  return CAPABILITY_PRESETS[name];
}

// Helper function to escalate capabilities
export function escalateCapabilities(currentCap: Capability, targetLevel: keyof typeof CAPABILITY_PRESETS): Capability {
  const target = CAPABILITY_PRESETS[targetLevel];
  
  // Merge actions (union)
  const mergedActions = [...new Set([...currentCap.actions, ...target.actions])];
  
  // Use most permissive constraints
  const mergedConstraints: CapabilityConstraints = {
    ratePerMin: Math.max(currentCap.constraints?.ratePerMin ?? 0, target.constraints?.ratePerMin ?? 0),
    ratePerHour: Math.max(currentCap.constraints?.ratePerHour ?? 0, target.constraints?.ratePerHour ?? 0),
    budgetALB: Math.max(currentCap.constraints?.budgetALB ?? 0, target.constraints?.budgetALB ?? 0),
    budgetUSD: Math.max(currentCap.constraints?.budgetUSD ?? 0, target.constraints?.budgetUSD ?? 0),
    maxFileSize: Math.max(currentCap.constraints?.maxFileSize ?? 0, target.constraints?.maxFileSize ?? 0),
    maxBuildTime: Math.max(currentCap.constraints?.maxBuildTime ?? 0, target.constraints?.maxBuildTime ?? 0),
    paths: [...new Set([...(currentCap.constraints?.paths ?? []), ...(target.constraints?.paths ?? [])])],
    domains: [...new Set([...(currentCap.constraints?.domains ?? []), ...(target.constraints?.domains ?? [])])],
    allowedCommands: [...new Set([...(currentCap.constraints?.allowedCommands ?? []), ...(target.constraints?.allowedCommands ?? [])])],
    environments: [...new Set([...(currentCap.constraints?.environments ?? []), ...(target.constraints?.environments ?? [])])],
    resources: [...new Set([...(currentCap.constraints?.resources ?? []), ...(target.constraints?.resources ?? [])])],
    criticalityLevel: target.constraints?.criticalityLevel ?? "HIGH"
  };
  
  return signCapability({
    issuer: "PolicyEngine@web8",
    subject: agentId,
    actions: mergedActions as any,
    scope: `escalated:${currentCap.scope}:${target.scope}`,
    constraints: mergedConstraints
  }, secret);
}

export default CAPABILITY_PRESETS;
