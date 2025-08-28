/**
 * Web8 AGI Freedom Sandbox - Core Types
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-SANDBOX
 * @description Industrial-grade AGI sandbox with comprehensive action support
 */

export type ActionKind =
  // Core System Operations
  | "READ_DB" | "WRITE_DB" | "MIGRATE_DB" | "BACKUP_DB"
  | "FILE_WRITE" | "FILE_READ" | "FILE_DELETE" | "FOLDER_CREATE"
  | "NETWORK_FETCH" | "LOG" | "HEALTH_CHECK"
  
  // Development Operations
  | "CODE_EDIT" | "CODE_REFACTOR" | "CODE_GENERATE" | "CODE_DEPLOY"
  | "BUILD_PROJECT" | "RUN_TESTS" | "DEPLOY_VERCEL" | "DOCKER_BUILD"
  
  // Infrastructure Operations
  | "START_NODE" | "STOP_NODE" | "RESTART_SERVICE" | "SPAWN_PROCESS"
  | "MESH_CONFIGURE" | "LORA_ACTIVATE" | "DNS_UPDATE"
  
  // Performance & Security
  | "OPTIMIZE_BUNDLE" | "CACHE_CLEAR" | "MEMORY_CLEANUP" | "INDEX_REBUILD"
  | "SECURITY_SCAN" | "UPDATE_DEPENDENCIES" | "ROTATE_KEYS" | "BACKUP_SECRETS"
  
  // Financial Operations
  | "TOKEN_TRANSFER" | "PAYMENT_PROCESS" | "BUDGET_ALLOCATE" | "COST_ANALYZE"
  
  // Monitoring & Analytics
  | "METRIC_COLLECT" | "ALERT_SEND" | "AI_ANALYZE" | "USER_NOTIFY" | "WORKFLOW_TRIGGER"
  
  // Professional Document Generation
  | "GENERATE_LEGAL_DOC" | "GENERATE_MEDICAL_REPORT" | "GENERATE_FINANCIAL_ANALYSIS"
  | "GENERATE_ENGINEERING_CALC" | "GENERATE_ARCHITECTURAL_PLAN" | "GENERATE_WEB_PROJECT"
  | "GENERATE_MEDIA_CONTENT" | "GENERATE_FASHION_DESIGN" | "GENERATE_SCIENTIFIC_PAPER"
  | "GENERATE_BUSINESS_PLAN" | "GENERATE_EDUCATIONAL_MATERIAL" | "GENERATE_MARKETING_CAMPAIGN"
  
  // Industry-Specific Operations
  | "LEGAL_RESEARCH" | "MEDICAL_DIAGNOSIS" | "FINANCIAL_MODELING" | "MARKET_ANALYSIS"
  | "COMPLIANCE_CHECK" | "RISK_ASSESSMENT" | "QUALITY_AUDIT" | "ENVIRONMENTAL_IMPACT"
  | "SAFETY_INSPECTION" | "PERFORMANCE_BENCHMARK" | "COST_OPTIMIZATION" | "WORKFLOW_AUTOMATION"
  
  // Professional Services
  | "CREATE_CONTRACT" | "PROCESS_INVOICE" | "MANAGE_INVENTORY" | "SCHEDULE_RESOURCES"
  | "TRACK_PROJECTS" | "ANALYZE_PERFORMANCE" | "GENERATE_REPORTS" | "MANAGE_CLIENTS"
  | "HANDLE_COMMUNICATIONS" | "PROCESS_PAYMENTS" | "MANAGE_COMPLIANCE" | "OPTIMIZE_OPERATIONS"
  
  // Custom Operations
  | "CUSTOM";

export interface CapabilityConstraints {
  expiresAt?: string;            // ISO timestamp
  ratePerMin?: number;           // max actions/min per agent+kind
  ratePerHour?: number;          // max actions/hour (for heavy operations)
  budgetALB?: number;            // max transferable ALB
  budgetUSD?: number;            // max USD equivalent for external services
  domains?: string[];            // allowed egress domains for NETWORK_FETCH
  paths?: string[];              // allowed file paths (prefix match)
  ipAllow?: string[];            // allowed IP ranges (CIDR or exact)
  resources?: string[];          // logical resource tags (db:rw, mesh:admin, deploy:prod)
  maxFileSize?: number;          // max file size in bytes for FILE_WRITE
  maxBuildTime?: number;         // max build time in seconds
  allowedCommands?: string[];    // allowed shell commands for SPAWN_PROCESS
  environments?: string[];       // allowed deployment environments (dev, staging, prod)
  criticalityLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; // operation impact level
  industries?: string[];         // allowed professional industries (legal, medical, financial, etc.)
  documentTypes?: string[];      // allowed document types to generate
  clientData?: boolean;          // can access client/patient/customer data
  confidentialityLevel?: "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "RESTRICTED"; // data classification
  professionalLicense?: string; // required professional license/certification
  maxDocumentComplexity?: "SIMPLE" | "STANDARD" | "COMPLEX" | "EXPERT"; // document complexity level
  qualityAssurance?: boolean;    // requires QA review before delivery
  legalCompliance?: string[];    // required compliance standards (GDPR, HIPAA, SOX, etc.)
  auditTrail?: boolean;          // requires detailed audit logging
  backupRequired?: boolean;      // requires automatic backup of generated content
}

export interface Capability {
  issuer: string;                // "PolicyEngine@web8"
  subject: string;               // agentId
  actions: ActionKind[];
  scope: string;                 // "sandbox:web8:zone-01"
  constraints?: CapabilityConstraints;
  signature: string;             // HMAC-SHA256 over canonical body
}

export interface ActionRequest {
  id: string;                    // uuid
  kind: ActionKind;
  params: Record<string, unknown>;
  meta: {
    agentId: string;
    ts: string;                  // ISO
    dryRun?: boolean;            // default true in SAFE preset
    humanGate?: boolean;         // if true, requires manual approve
  };
  capability?: Capability;
}

export type Decision = "ALLOW" | "DENY" | "REVIEW" | "SIMULATE";

export interface PolicyDecision {
  decision: Decision;
  reason: string;
  required?: Array<
    "capability" | "human-approval" | "budget" | "rate-limit" | 
    "professional-license" | "audit-trail" | "backup-required" | 
    "quality-assurance" | "compliance-check" | "environmental-clearance"
  >;
  patch?: Partial<ActionRequest>; // policy may force dryRun or tweak params
}

export interface AuditEntry {
  id: string;
  ts: string;
  actor: string;                 // agentId or "system" or "human"
  kind: string;                  // "ACTION_REQ" | "ACTION_RES" | "POLICY" | "ERROR" | "OPTIMIZATION" | "DEPLOY"
  payload: unknown;
  impact?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"; // business impact assessment
  environment?: "dev" | "staging" | "prod";        // affected environment
  rollbackPlan?: string;         // how to undo this action if needed
  prevHash?: string;
  hash?: string;
}

export interface BrokerResult<T = unknown> {
  ok: boolean;
  dryRun: boolean;
  decision: Decision;
  data?: T;
  error?: string;
  reviewId?: string;             // NEW: id for REVIEW queue
}
