import fs from "node:fs/promises";

export const secret = process.env.WEB8_SANDBOX_SECRET ?? "change-me-in-prod";

// Providers (replace with real adapters when ready)
export const providers = {
  READ_DB: async (p: { query: string }) => ({ rows: 0, note: "READ_DB adapter TODO" }),
  WRITE_DB: async (p: { query: string }) => ({ rows: 0, note: "WRITE_DB adapter TODO" }),
  NETWORK_FETCH: async (p: { url: string }) => ({ 
    status: 200, 
    bytes: Buffer.byteLength(p.url, "utf8"),
    note: "NETWORK_FETCH simulated" 
  }),
  FILE_WRITE: async (p: { path: string; data: string | Uint8Array }) => { 
    const dataStr = typeof p.data === 'string' ? p.data : new TextDecoder().decode(p.data);
    await fs.writeFile(p.path, dataStr, "utf8"); 
    return { bytes: Buffer.byteLength(dataStr) }; 
  },
  START_NODE: async () => ({ ok: false, note: "START_NODE not implemented" }),
  SPAWN_PROCESS: async () => ({ code: 1, note: "SPAWN_PROCESS denied" }),
  TOKEN_TRANSFER: async (p: { amountALB: number; to: string; chain?: "JUNIOR"|"ALBION" }) => {
    const chain = p.chain ?? "JUNIOR";
    // TODO: Wire to real Junior/Albion bridges
    return { txId: `${chain}-${Date.now()}`, simulated: true };
  },
  LOG: async (p: { level: "info"|"warn"|"error"; message: string }): Promise<true> => { 
    console[p.level](`[AGI-SANDBOX] ${p.message}`); 
    return true; 
  },
} as const;
