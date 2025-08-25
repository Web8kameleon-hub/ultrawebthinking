/**
 * UTT-Albion Module Stack - Barrel Exports
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

// Core token functionality
export * from './albion-token';
export * from './albion-connection';

// Wallet integration
export * from './phantom-integration';

// Token operations
export * from './utt-bridge';

// Physical token interface
export * from './utt-physical';

// Audit & security
export * from './utt-audit';

// Gateway integration
export * from './utt-gateway';

// Re-export main components with aliases for convenience
export { default as AlbionToken } from './albion-token';
export { default as Connection } from './albion-connection';
export { default as PhantomWallet } from './phantom-integration';
export { default as TokenBridge } from './utt-bridge';
export { default as PhysicalToken } from './utt-physical';
export { default as Audit } from './utt-audit';
export { default as Gateway } from './utt-gateway';

// Version and metadata
export const UTT_VERSION = '8.0.0-WEB8';
export const AUTHOR = 'Ledjan Ahmati';
export const CONTACT = 'dealsjona@gmail.com';

/**
 * Initialize UTT system
 */
export async function initializeUTT() {
  console.log(`🚀 UTT-Albion Module Stack v${UTT_VERSION} by ${AUTHOR}`);
  console.log('📧 Contact:', CONTACT);
  console.log('🏗️ Initializing UTT system...');
  
  // Initialize components
  const { initializeGatewayMonitoring } = await import('./utt-gateway');
  initializeGatewayMonitoring();
  
  console.log('✅ UTT system initialized successfully');
}

export default {
  initializeUTT,
  UTT_VERSION,
  AUTHOR,
  CONTACT
};
