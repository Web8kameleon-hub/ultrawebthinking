// Albion Connection - Solana/Blockchain connection
// Stub implementation for build compatibility

import { Connection, PublicKey } from '@solana/web3.js';

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(DEFAULT_RPC, 'confirmed');
  }
  return connection;
}

export function pubkeyFrom(address: string): PublicKey {
  return new PublicKey(address);
}

export function setRpcEndpoint(endpoint: string): void {
  connection = new Connection(endpoint, 'confirmed');
}
