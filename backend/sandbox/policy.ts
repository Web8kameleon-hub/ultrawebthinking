import { ActionRequest, Decision, PolicyDecision } from "./types";

// SAFE preset: requires REVIEW for sensitive actions
export const SafePreset = {
  name: "WEB8_SAFE_V2_PROFESSIONAL",
  dryRunDefault: true,
  allowDomains: ["api.euroweb.local", "status.ultra", "docs.web8", "localhost"],
  denyKinds: ["SPAWN_PROCESS", "START_NODE"],
  reviewKinds: ["WRITE_DB", "FILE_WRITE", "TOKEN_TRANSFER"],
  hardDenyPaths: ["/etc", "/root", "C:\\Windows"],
  // Professional industry rules
  professionalReviewKinds: [
    "GENERATE_LEGAL_DOC", "GENERATE_MEDICAL_REPORT", "MEDICAL_DIAGNOSIS",
    "GENERATE_FINANCIAL_ANALYSIS", "TOKEN_TRANSFER", "PROCESS_PAYMENTS",
    "CREATE_CONTRACT", "COMPLIANCE_CHECK", "RISK_ASSESSMENT"
  ],
  confidentialDataKinds: [
    "MEDICAL_DIAGNOSIS", "LEGAL_RESEARCH", "FINANCIAL_MODELING", 
    "GENERATE_MEDICAL_REPORT", "CREATE_CONTRACT"
  ],
  autoApproveKinds: [
    "GENERATE_EDUCATIONAL_MATERIAL", "GENERATE_MEDIA_CONTENT",
    "GENERATE_WEB_PROJECT", "WORKFLOW_AUTOMATION", "GENERATE_REPORTS"
  ]
};

export function decide(req: ActionRequest): PolicyDecision {
  // Emergency kill-switch
  if (process.env.SANDBOX_EMERGENCY === "1") {
    return { decision: "DENY", reason: "Emergency kill-switch activated" };
  }

  // Hard-deny dangerous kinds
  if (SafePreset.denyKinds.includes(req.kind)) {
    return { decision: "DENY", reason: "Kind denied in SAFE preset" };
  }

  // Professional document generation policies
  if (req.kind.startsWith("GENERATE_") || SafePreset.professionalReviewKinds.includes(req.kind)) {
    const scope = req.capability?.scope ?? "";
    const industry = scope.split(":")[1]; // Extract industry from scope like "industry:legal:professional"
    
    // High-risk professional operations require review
    if (SafePreset.professionalReviewKinds.includes(req.kind)) {
      return {
        decision: "REVIEW",
        reason: `Professional ${industry} operation requires human approval`,
        required: ["human-approval", "capability", "professional-license", "audit-trail"],
        patch: { meta: { ...req.meta, dryRun: true, humanGate: true } },
      };
    }

    // Confidential data operations require enhanced review
    if (SafePreset.confidentialDataKinds.includes(req.kind)) {
      const confidentialityLevel = req.capability?.constraints?.confidentialityLevel;
      if (confidentialityLevel === "RESTRICTED" || confidentialityLevel === "CONFIDENTIAL") {
        return {
          decision: "REVIEW",
          reason: `Confidential ${industry} data operation requires approval`,
          required: ["human-approval", "capability", "professional-license", "audit-trail", "backup-required"],
          patch: { meta: { ...req.meta, dryRun: true, humanGate: true } },
        };
      }
    }

    // Auto-approve safe professional operations
    if (SafePreset.autoApproveKinds.includes(req.kind)) {
      return {
        decision: req.meta.dryRun ? "SIMULATE" : "ALLOW",
        reason: `Safe ${industry} operation auto-approved`,
        patch: { meta: { ...req.meta } },
      };
    }
  }

  // TOKEN_TRANSFER always requires human gate (both Junior and Albion)
  if (req.kind === "TOKEN_TRANSFER") {
    const scope = req.capability?.scope ?? "";
    if (scope.startsWith("wallet:junior") || scope.startsWith("wallet:albion")) {
      return {
        decision: "REVIEW",
        reason: scope.includes("albion") ? "Albion gated" : "Junior gated",
        required: ["human-approval", "capability", "budget", "rate-limit"],
        patch: { meta: { ...req.meta, dryRun: true, humanGate: true } },
      };
    }
  }

  // Professional license verification
  const requiredLicense = req.capability?.constraints?.professionalLicense;
  if (requiredLicense && !verifyProfessionalLicense(requiredLicense, req)) {
    return {
      decision: "DENY",
      reason: `Professional license ${requiredLicense} required but not verified`,
    };
  }

  // Quality assurance requirement
  const requiresQA = req.capability?.constraints?.qualityAssurance;
  if (requiresQA && !req.meta.humanGate) {
    return {
      decision: "REVIEW",
      reason: "Quality assurance review required",
      required: ["human-approval", "quality-assurance"],
      patch: { meta: { ...req.meta, dryRun: true, humanGate: true } },
    };
  }

// Professional license verification function
function verifyProfessionalLicense(license: string, req: ActionRequest): boolean {
  // In production, this would verify against a real professional licensing database
  const validLicenses = process.env.WEB8_VALID_LICENSES?.split(",") || [];
  return validLicenses.includes(license) || process.env.NODE_ENV === "development";
}

  // NETWORK constraints
  if (req.kind === "NETWORK_FETCH") {
    const url = String(req.params?.url ?? "");
    try {
      const u = new URL(url);
      if (!SafePreset.allowDomains.some(d => u.hostname.endsWith(d) || u.hostname === d)) {
        return { decision: "DENY", reason: `Domain ${u.hostname} not allowlisted` };
      }
    } catch {
      return { decision: "DENY", reason: "Malformed URL" };
    }
  }

  // FILE_WRITE constraints
  if (req.kind === "FILE_WRITE") {
    const p = String(req.params?.path ?? "");
    const denied = SafePreset.hardDenyPaths.some(prefix => p.startsWith(prefix));
    if (denied) return { decision: "DENY", reason: "Path not permitted" };
  }

  // Review-required kinds
  if (SafePreset.reviewKinds.includes(req.kind)) {
    return {
      decision: "REVIEW",
      reason: "Action requires human approval in SAFE preset",
      required: ["human-approval", "capability"],
      patch: { meta: { ...req.meta, dryRun: true } },
    };
  }

  // Default allow but simulate unless explicitly forced otherwise
  const dryRun = req.meta.dryRun ?? SafePreset.dryRunDefault;
  return {
    decision: dryRun ? "SIMULATE" : "ALLOW",
    reason: dryRun ? "Default simulate in SAFE preset" : "Allowed by policy",
    patch: { meta: { ...req.meta, dryRun } },
  };
}
