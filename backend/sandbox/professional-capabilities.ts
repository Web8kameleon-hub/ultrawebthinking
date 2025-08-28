/**
 * Professional Industry Capabilities for Web8 AGI Sandbox
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-PROFESSIONAL
 */

import { signCapability } from "./capability";
import { Capability } from "./types";

const secret = process.env.WEB8_SANDBOX_SECRET ?? "change-me-in-prod";
const agentId = "AGICore@web8";

// Legal Industry Capabilities
export const CAP_LEGAL_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_LEGAL_DOC", "LEGAL_RESEARCH", "COMPLIANCE_CHECK", "CREATE_CONTRACT",
    "RISK_ASSESSMENT", "GENERATE_REPORTS", "MANAGE_CLIENTS", "FILE_WRITE", "READ_DB"
  ],
  scope: "industry:legal:professional",
  constraints: {
    ratePerMin: 5,
    ratePerHour: 20,
    budgetALB: 1000,
    industries: ["legal", "compliance", "corporate"],
    documentTypes: ["contract", "legal_brief", "compliance_report", "risk_assessment"],
    confidentialityLevel: "CONFIDENTIAL",
    professionalLicense: "BAR_CERTIFIED",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["GDPR", "SOX", "CCPA"],
    auditTrail: true,
    backupRequired: true
  }
}, secret);

// Medical Industry Capabilities
export const CAP_MEDICAL_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_MEDICAL_REPORT", "MEDICAL_DIAGNOSIS", "SAFETY_INSPECTION", "QUALITY_AUDIT",
    "GENERATE_REPORTS", "MANAGE_CLIENTS", "FILE_WRITE", "READ_DB", "ANALYZE_PERFORMANCE"
  ],
  scope: "industry:medical:professional",
  constraints: {
    ratePerMin: 3,
    ratePerHour: 15,
    budgetALB: 1500,
    industries: ["medical", "healthcare", "pharmaceutical"],
    documentTypes: ["medical_report", "diagnosis", "treatment_plan", "health_assessment"],
    confidentialityLevel: "RESTRICTED",
    professionalLicense: "MEDICAL_CERTIFIED",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["HIPAA", "FDA", "GCP"],
    auditTrail: true,
    backupRequired: true,
    clientData: true
  }
}, secret);

// Financial Industry Capabilities
export const CAP_FINANCIAL_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_FINANCIAL_ANALYSIS", "FINANCIAL_MODELING", "MARKET_ANALYSIS", "COST_OPTIMIZATION",
    "GENERATE_BUSINESS_PLAN", "PROCESS_INVOICE", "PROCESS_PAYMENTS", "BUDGET_ALLOCATE",
    "TOKEN_TRANSFER", "COST_ANALYZE", "GENERATE_REPORTS"
  ],
  scope: "industry:financial:professional",
  constraints: {
    ratePerMin: 8,
    ratePerHour: 40,
    budgetALB: 2000,
    budgetUSD: 500,
    industries: ["financial", "banking", "investment", "accounting"],
    documentTypes: ["financial_report", "investment_analysis", "budget_plan", "audit_report"],
    confidentialityLevel: "CONFIDENTIAL",
    professionalLicense: "CPA_CERTIFIED",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["SOX", "GDPR", "PCI_DSS"],
    auditTrail: true,
    backupRequired: true
  }
}, secret);

// Engineering Industry Capabilities
export const CAP_ENGINEERING_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_ENGINEERING_CALC", "GENERATE_ARCHITECTURAL_PLAN", "PERFORMANCE_BENCHMARK",
    "QUALITY_AUDIT", "SAFETY_INSPECTION", "ENVIRONMENTAL_IMPACT", "OPTIMIZE_OPERATIONS",
    "BUILD_PROJECT", "RUN_TESTS", "CODE_GENERATE"
  ],
  scope: "industry:engineering:professional",
  constraints: {
    ratePerMin: 10,
    ratePerHour: 50,
    budgetALB: 1200,
    industries: ["engineering", "construction", "manufacturing", "architecture"],
    documentTypes: ["technical_spec", "calculation_sheet", "blueprint", "safety_report"],
    confidentialityLevel: "INTERNAL",
    professionalLicense: "PE_CERTIFIED",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["ISO9001", "OSHA", "Building_Codes"],
    auditTrail: true,
    backupRequired: true
  }
}, secret);

// Web Development & Tech Capabilities
export const CAP_WEB_TECH_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_WEB_PROJECT", "CODE_EDIT", "CODE_REFACTOR", "CODE_GENERATE", "CODE_DEPLOY",
    "BUILD_PROJECT", "RUN_TESTS", "DEPLOY_VERCEL", "DOCKER_BUILD", "OPTIMIZE_BUNDLE",
    "SECURITY_SCAN", "UPDATE_DEPENDENCIES", "PERFORMANCE_BENCHMARK", "WORKFLOW_AUTOMATION"
  ],
  scope: "industry:web:professional",
  constraints: {
    ratePerMin: 15,
    ratePerHour: 100,
    budgetALB: 800,
    industries: ["web_development", "software", "technology", "digital"],
    documentTypes: ["technical_doc", "api_spec", "deployment_guide", "security_report"],
    confidentialityLevel: "INTERNAL",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: false,
    legalCompliance: ["GDPR", "CCPA"],
    auditTrail: true,
    backupRequired: true,
    environments: ["dev", "staging", "prod"]
  }
}, secret);

// Media & Content Capabilities
export const CAP_MEDIA_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_MEDIA_CONTENT", "GENERATE_MARKETING_CAMPAIGN", "MANAGE_CLIENTS",
    "GENERATE_REPORTS", "WORKFLOW_AUTOMATION", "FILE_WRITE", "FILE_READ"
  ],
  scope: "industry:media:professional",
  constraints: {
    ratePerMin: 12,
    ratePerHour: 60,
    budgetALB: 600,
    industries: ["media", "advertising", "marketing", "content"],
    documentTypes: ["content_brief", "campaign_plan", "media_kit", "brand_guidelines"],
    confidentialityLevel: "INTERNAL",
    maxDocumentComplexity: "STANDARD",
    qualityAssurance: true,
    legalCompliance: ["GDPR", "CCPA", "Advertising_Standards"],
    auditTrail: false,
    backupRequired: true
  }
}, secret);

// Fashion & Design Capabilities
export const CAP_FASHION_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_FASHION_DESIGN", "MANAGE_INVENTORY", "TRACK_PROJECTS", "GENERATE_REPORTS",
    "MANAGE_CLIENTS", "FILE_WRITE", "FILE_READ"
  ],
  scope: "industry:fashion:professional",
  constraints: {
    ratePerMin: 8,
    ratePerHour: 30,
    budgetALB: 400,
    industries: ["fashion", "design", "textile", "retail"],
    documentTypes: ["design_spec", "collection_brief", "production_plan", "trend_report"],
    confidentialityLevel: "INTERNAL",
    maxDocumentComplexity: "STANDARD",
    qualityAssurance: true,
    auditTrail: false,
    backupRequired: true
  }
}, secret);

// Scientific Research Capabilities
export const CAP_SCIENTIFIC_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_SCIENTIFIC_PAPER", "AI_ANALYZE", "PERFORMANCE_BENCHMARK", "QUALITY_AUDIT",
    "GENERATE_REPORTS", "WORKFLOW_AUTOMATION", "READ_DB", "FILE_WRITE"
  ],
  scope: "industry:scientific:professional",
  constraints: {
    ratePerMin: 5,
    ratePerHour: 25,
    budgetALB: 1000,
    industries: ["research", "scientific", "academic", "laboratory"],
    documentTypes: ["research_paper", "lab_report", "data_analysis", "peer_review"],
    confidentialityLevel: "CONFIDENTIAL",
    professionalLicense: "PHD_CERTIFIED",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["Research_Ethics", "Data_Protection"],
    auditTrail: true,
    backupRequired: true
  }
}, secret);

// Business & Management Capabilities
export const CAP_BUSINESS_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_BUSINESS_PLAN", "MARKET_ANALYSIS", "COST_OPTIMIZATION", "WORKFLOW_AUTOMATION",
    "TRACK_PROJECTS", "MANAGE_CLIENTS", "SCHEDULE_RESOURCES", "ANALYZE_PERFORMANCE",
    "GENERATE_REPORTS", "HANDLE_COMMUNICATIONS"
  ],
  scope: "industry:business:professional",
  constraints: {
    ratePerMin: 10,
    ratePerHour: 50,
    budgetALB: 800,
    industries: ["business", "management", "consulting", "strategy"],
    documentTypes: ["business_plan", "strategy_doc", "market_analysis", "project_report"],
    confidentialityLevel: "CONFIDENTIAL",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["GDPR", "SOX"],
    auditTrail: true,
    backupRequired: true
  }
}, secret);

// Education Capabilities
export const CAP_EDUCATION_PROFESSIONAL = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    "GENERATE_EDUCATIONAL_MATERIAL", "GENERATE_REPORTS", "TRACK_PROJECTS",
    "WORKFLOW_AUTOMATION", "FILE_WRITE", "FILE_READ"
  ],
  scope: "industry:education:professional",
  constraints: {
    ratePerMin: 15,
    ratePerHour: 80,
    budgetALB: 300,
    industries: ["education", "training", "academic", "e_learning"],
    documentTypes: ["curriculum", "lesson_plan", "assessment", "educational_content"],
    confidentialityLevel: "INTERNAL",
    maxDocumentComplexity: "STANDARD",
    qualityAssurance: true,
    legalCompliance: ["FERPA", "COPPA", "GDPR"],
    auditTrail: false,
    backupRequired: true
  }
}, secret);

// Export all capabilities
export const PROFESSIONAL_CAPABILITIES = {
  LEGAL: CAP_LEGAL_PROFESSIONAL,
  MEDICAL: CAP_MEDICAL_PROFESSIONAL,
  FINANCIAL: CAP_FINANCIAL_PROFESSIONAL,
  ENGINEERING: CAP_ENGINEERING_PROFESSIONAL,
  WEB_TECH: CAP_WEB_TECH_PROFESSIONAL,
  MEDIA: CAP_MEDIA_PROFESSIONAL,
  FASHION: CAP_FASHION_PROFESSIONAL,
  SCIENTIFIC: CAP_SCIENTIFIC_PROFESSIONAL,
  BUSINESS: CAP_BUSINESS_PROFESSIONAL,
  EDUCATION: CAP_EDUCATION_PROFESSIONAL
} as const;

// Helper function to get capability by industry
export function getCapabilityByIndustry(industry: keyof typeof PROFESSIONAL_CAPABILITIES): Capability {
  return PROFESSIONAL_CAPABILITIES[industry];
}

// Multi-industry capability (for AGI that works across industries)
export const CAP_MULTI_INDUSTRY_AGI = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: [
    // Core operations available to all industries
    "READ_DB", "FILE_READ", "GENERATE_REPORTS", "ANALYZE_PERFORMANCE",
    "WORKFLOW_AUTOMATION", "LOG", "METRIC_COLLECT", "AI_ANALYZE",
    // Professional document generation (all types)
    "GENERATE_LEGAL_DOC", "GENERATE_MEDICAL_REPORT", "GENERATE_FINANCIAL_ANALYSIS",
    "GENERATE_ENGINEERING_CALC", "GENERATE_ARCHITECTURAL_PLAN", "GENERATE_WEB_PROJECT",
    "GENERATE_MEDIA_CONTENT", "GENERATE_FASHION_DESIGN", "GENERATE_SCIENTIFIC_PAPER",
    "GENERATE_BUSINESS_PLAN", "GENERATE_EDUCATIONAL_MATERIAL", "GENERATE_MARKETING_CAMPAIGN"
  ],
  scope: "industry:multi:agi",
  constraints: {
    ratePerMin: 20,
    ratePerHour: 150,
    budgetALB: 4000,
    industries: ["legal", "medical", "financial", "engineering", "web", "media", "fashion", "scientific", "business", "education"],
    documentTypes: ["all"],
    confidentialityLevel: "CONFIDENTIAL",
    maxDocumentComplexity: "EXPERT",
    qualityAssurance: true,
    legalCompliance: ["GDPR", "HIPAA", "SOX", "CCPA", "ISO9001"],
    auditTrail: true,
    backupRequired: true,
    criticalityLevel: "HIGH"
  }
}, secret);
