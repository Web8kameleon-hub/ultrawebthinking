import { signCapability } from "./capability";

const secret = process.env.WEB8_SANDBOX_SECRET ?? "change-me";
const agentId = "AGICore@web8";

// Junior FTX: gated but for smaller amounts (dev/test)
export const CAP_JUNIOR_GATE = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: ["TOKEN_TRANSFER", "NETWORK_FETCH", "LOG", "READ_DB"],
  scope: "wallet:junior:dev",
  constraints: { ratePerMin: 10, budgetALB: 2000 },
}, secret);

// Albion: gated with 4000 ALB budget (main lane)
export const CAP_ALBION_GATE_4000 = signCapability({
  issuer: "PolicyEngine@web8",
  subject: agentId,
  actions: ["TOKEN_TRANSFER", "NETWORK_FETCH", "LOG", "READ_DB", "WRITE_DB", "FILE_WRITE"],
  scope: "wallet:albion:main",
  constraints: { ratePerMin: 5, budgetALB: 4000 },
}, secret);
