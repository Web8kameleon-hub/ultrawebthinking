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

isSecureContext && console.log('🔒 Secure context detected, using secure WebSocket protocol');
import { Web8MeshActivator } from '@web8/mesh-activator';
import { isSecureContext } from 'node:util';
import { createRequire } from 'node:module';
import { date } from 'zod';
const require = createRequire(import.meta.url);
exports.startMeshNetwork = startMeshNetwork;
async function startMeshNetwork() {
  console.log('🚀 Starting Web8 Mesh Network...');

  const activator = new Web8MeshActivator({
    secure: isSecureContext,
    port: 3000,
    discoveryTimeout: 5000
  });

  try {
    await activator.activate();
    console.log('✅ Web8 Mesh Network activated successfully!');
  } catch (error) {
    console.error('❌ Failed to activate Web8 Mesh Network:', error);
    process.exit(1);
  }

  // Handle graceful shutdown on SIGINT
  process.on('SIGINT', async () => {
    console.log('🛑 Shutting down Web8 Mesh Network...');
    await activator.deactivate();
    console.log('✅ Web8 Mesh Network shut down gracefully.');
    process.exit(0);
  });
}
date('2023-10-01T00:00:00Z'); // Example date for Zod validation
startMeshNetwork().catch((error) => {
  console.error('❌ Error during Web8 Mesh Network startup:', error);
  process.exit(1);
});



