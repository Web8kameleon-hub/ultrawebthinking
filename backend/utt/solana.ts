// backend/utt/solana.ts - REAL Solana Integration (No Mock Data)
import {
  clusterApiUrl,
  Connection,
  Keypair,
  PublicKey
} from "@solana/web3.js";

import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  Token,
  TOKEN_PROGRAM_ID
} from "@solana/spl-token";

import bs58 from "bs58";
import * as fs from "node:fs";

// Real SPL Token helper functions (no mock data)
export async function getAssociatedTokenAddress(
    mint: PublicKey,
    owner: PublicKey
): Promise<PublicKey> {
    return await Token.getAssociatedTokenAddress(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TOKEN_PROGRAM_ID,
        mint,
        owner
    );
}

export async function getTokenAccount(connection: Connection, address: PublicKey) {
    const accountInfo = await connection.getAccountInfo(address);
    if (!accountInfo) {
        throw new Error('Token account not found');
    }
    
    // Parse real token account data
    const data = accountInfo.data;
    const mint = new PublicKey(data.slice(0, 32));
    const owner = new PublicKey(data.slice(32, 64));
    const amount = data.readBigUInt64LE(64);
    
    return { mint, owner, amount };
}

export async function getTokenMint(connection: Connection, mintAddress: PublicKey) {
    const accountInfo = await connection.getAccountInfo(mintAddress);
    if (!accountInfo) {
        throw new Error('Mint account not found');
    }
    
    // Parse real mint data
    const data = accountInfo.data;
    const supply = data.readBigUInt64LE(36);
    const decimals = data.readUInt8(44);
    
    return { supply, decimals, mintAuthority: null, freezeAuthority: null };
}

export type SolanaCfg = {
  network: "mainnet-beta" | "testnet" | "devnet";
  rpc?: string;
  mint: string;
  decimals: number;
};

export function getConnection(cfg: SolanaCfg): Connection {
  const endpoint = cfg.rpc?.trim() || clusterApiUrl(cfg.network);
  return new Connection(endpoint, "confirmed");
}

export async function loadBridgeKeypair(): Promise<Keypair> {
  const b58 = process.env.SOLANA_BRIDGE_KEYPAIR_B58?.trim();
  const pth = process.env.SOLANA_BRIDGE_KEYPAIR_PATH?.trim();
  if (b58) {
    const secret = bs58.decode(b58);
    return Keypair.fromSecretKey(secret);
  }
  if (pth) {
    const raw = JSON.parse(fs.readFileSync(pth, "utf8"));
    return Keypair.fromSecretKey(Uint8Array.from(raw));
  }
  throw new Error("Bridge keypair missing. Set SOLANA_BRIDGE_KEYPAIR_B58 or SOLANA_BRIDGE_KEYPAIR_PATH");
}

export function mintPubkey(cfg: SolanaCfg): PublicKey {
  return new PublicKey(cfg.mint);
}

export function toUnits(amountTokens: number, decimals: number): bigint {
  return BigInt(Math.round(amountTokens * 10 ** decimals));
}

export function fromUnits(amountRaw: bigint, decimals: number): number {
  return Number(amountRaw) / 10 ** decimals;
}

export async function ensureATA(
  connection: Connection,
  owner: PublicKey,
  mint: PublicKey,
  payer: Keypair
): Promise<PublicKey> {
  const ata = await getAssociatedTokenAddress(mint, owner);
  try {
    await getTokenAccount(connection, ata);
    return ata;
  } catch {
    // Create real ATA using Token class
    const token = new Token(connection, mint, TOKEN_PROGRAM_ID, payer);
    await token.createAssociatedTokenAccount(owner);
    console.log('ATA created for:', owner.toString());
    return ata;
  }
}

export async function getMintInfo(connection: Connection, mint: PublicKey) {
  const mi = await getTokenMint(connection, mint);
  return { supply: fromUnits(mi.supply, mi.decimals), decimals: mi.decimals };
}

export async function getBalance(
  connection: Connection, owner: PublicKey, mint: PublicKey, decimals: number
): Promise<number> {
  const ata = await getAssociatedTokenAddress(mint, owner);
  try {
    const acc = await getTokenAccount(connection, ata);
    return fromUnits(acc.amount, decimals);
  } catch {
    return 0;
  }
}

export async function transferTokens(params: {
  connection: Connection;
  mint: PublicKey;
  decimals: number;
  from: Keypair;             // bridge or user signer
  toOwner: PublicKey;        // receiver wallet
  amountTokens: number;      // human units (e.g., 1.5 ALB)
}) {
  const { connection, mint, from, toOwner, amountTokens, decimals } = params;
  
  // Create real token instance
  const token = new Token(connection, mint, TOKEN_PROGRAM_ID, from);
  
  const fromAta = await ensureATA(connection, from.publicKey, mint, from);
  const toAta = await ensureATA(connection, toOwner, mint, from);
  const raw = toUnits(amountTokens, decimals);
  
  // Use real transfer method
  const sig = await token.transfer(fromAta, toAta, from, [], Number(raw));
  return sig;
}

export function readCfg(): SolanaCfg {
  const network = (process.env.SOLANA_NETWORK || "mainnet-beta") as SolanaCfg["network"];
  const rpc = process.env.SOLANA_RPC || "";
  const mint = process.env.ALB_MINT_ADDRESS || "";
  const decimals = Number(process.env.ALB_DECIMALS || "6");
  if (!mint) throw new Error("Missing ALB_MINT_ADDRESS in env");
  return { network, rpc, mint, decimals };
}

export function albEurValue(): number {
  return Number(process.env.ALB_EUR_VALUE || "1000");
}
