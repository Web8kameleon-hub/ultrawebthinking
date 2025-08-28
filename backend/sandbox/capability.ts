import crypto from "node:crypto";
import { Capability } from "./types";

function canonicalize(cap: Omit<Capability, "signature">): string {
  return JSON.stringify(cap, Object.keys(cap).sort());
}

export function signCapability(
  cap: Omit<Capability, "signature">,
  secret: string
): Capability {
  const body = canonicalize(cap);
  const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return { ...cap, signature };
}

export function verifyCapability(cap: Capability, secret: string): boolean {
  const { signature, ...rest } = cap;
  const body = canonicalize(rest);
  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export function assertCapability(
  cap: Capability | undefined,
  secret: string,
  subject: string,
  action: string
) {
  if (!cap) throw new Error("Missing capability");
  if (!verifyCapability(cap, secret)) throw new Error("Invalid capability signature");
  if (cap.subject !== subject) throw new Error("Capability subject mismatch");
  if (!cap.actions.includes(action as any)) throw new Error("Action not permitted by capability");
  if (cap.constraints?.expiresAt && new Date(cap.constraints.expiresAt) < new Date()) {
    throw new Error("Capability expired");
  }
}
