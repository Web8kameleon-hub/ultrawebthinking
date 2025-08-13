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
const require = createRequire(import.meta.url);

