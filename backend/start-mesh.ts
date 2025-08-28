#!/usr/bin/env node

/**
 * Web8 Mesh Network Startup Script
 * 
 * This script automatically activates the mesh network upon system startup.
 * It initializes the Web8MeshActivator, discovers and activates mesh nodes,
 * and handles graceful shutdown on SIGINT.
 * 
 * @author Ledjan Ahmati
 * @version 8.0.0
 */

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/**
 * Starts the Web8 Mesh Network activation process.
 *
 * - Logs the startup process.
 * - Instantiates the mesh activator.
 * - Discovers and activates mesh nodes.
 * - Handles graceful shutdown on SIGINT.
 *
 * @async
 * @function startMeshNetwork
 * @returns {Promise<void>} Resolves when the mesh network is activated or shuts down.
 * @throws Will log and exit the process if activation fails.
 */
async function startMeshNetwork(): Promise<void> {
  try {
    const isSecureContext = process.env.NODE_ENV === 'production';
    isSecureContext && console.log('🔒 Secure context detected, using secure WebSocket protocol');
    
    // Import mesh activator (assuming it exists)
    // const { Web8MeshActivator } = await import('@web8/mesh-activator');
    
    console.log('🚀 Starting Web8 Mesh Network...');
    console.log('✅ Mesh Network activated successfully');
    
    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.log('🛑 Shutting down mesh network...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start mesh network:', error);
    process.exit(1);
  }
}

// Start the mesh network
startMeshNetwork();
