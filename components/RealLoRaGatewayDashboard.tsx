/**
 * Real LoRa Gateway Dashboard
 * Dashboard për Gateway LoRa të Vërtetë
 * 
 * Component for managing real LoRa gateway connections and monitoring
 * Komponent për menaxhimin e lidhjeve fizike LoRa dhe monitorimin
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GatewayInfo {
  id: string;
  ip: string;
  port: number;
  lastSeen: Date;
  status: 'connected' | 'disconnected' | 'error';
}

interface LoRaPacket {
  gatewayId: string;
  frequency: number;
  dataRate: string;
  codingRate: string;
  rssi: number;
  snr: number;
  payload: string;
  timestamp: Date;
  decoded?: any;
}

interface GatewayStats {
  gatewayId: string;
  packetsReceived: number;
  packetsSent: number;
  lastActivity: Date;
  stats?: {
    rxnb: number;
    txnb: number;
    rxok: number;
    rxfw: number;
    ackr: number;
    dwnb: number;
  };
}

const RealLoRaGatewayDashboard: React.FC = () => {
  const [isServerRunning, setIsServerRunning] = useState(false);
  const [connectedGateways, setConnectedGateways] = useState<GatewayInfo[]>([]);
  const [recentPackets, setRecentPackets] = useState<LoRaPacket[]>([]);
  const [gatewayStats, setGatewayStats] = useState<Map<string, GatewayStats>>(new Map());
  const [serverStatus, setServerStatus] = useState<'stopped' | 'starting' | 'running' | 'error'>('stopped');
  const [serverPort, setServerPort] = useState(1700);
  const [serverLogs, setServerLogs] = useState<string[]>([]);
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null);
  const [downlinkQueue, setDownlinkQueue] = useState<any[]>([]);

  // Simulated real gateway data (replace with actual WebSocket/API calls)
  const simulateRealGateway = () => {
    // Simulate gateway connection
    const newGateway: GatewayInfo = {
      id: `192.168.1.100:1700`,
      ip: '192.168.1.100',
      port: 1700,
      lastSeen: new Date(),
      status: 'connected'
    };

    setConnectedGateways(prev => {
      const existing = prev.find(g => g.id === newGateway.id);
      if (existing) {
        return prev.map(g => g.id === newGateway.id ? { ...g, lastSeen: new Date() } : g);
      }
      return [...prev, newGateway];
    });

    // Simulate incoming LoRa packet
    const packet: LoRaPacket = {
      gatewayId: newGateway.id,
      frequency: 868.1 + Math.random() * 0.4,
      dataRate: 'SF7BW125',
      codingRate: '4/5',
      rssi: -80 + Math.random() * 40,
      snr: -5 + Math.random() * 15,
      payload: btoa(JSON.stringify({
        deviceId: `node_${Math.floor(Math.random() * 1000)}`,
        temperature: 20 + Math.random() * 15,
        humidity: 50 + Math.random() * 30,
        battery: 80 + Math.random() * 20
      })),
      timestamp: new Date()
    };

    // Decode payload for display
    try {
      packet.decoded = JSON.parse(atob(packet.payload));
    } catch {
      packet.decoded = { raw: packet.payload.substring(0, 20) + '...' };
    }

    setRecentPackets(prev => [packet, ...prev].slice(0, 50));

    // Update stats
    setGatewayStats(prev => {
      const current = prev.get(newGateway.id) || {
        gatewayId: newGateway.id,
        packetsReceived: 0,
        packetsSent: 0,
        lastActivity: new Date(),
        stats: {
          rxnb: 0,
          txnb: 0,
          rxok: 0,
          rxfw: 0,
          ackr: 0,
          dwnb: 0
        }
      };

      const updated = {
        ...current,
        packetsReceived: current.packetsReceived + 1,
        lastActivity: new Date(),
        stats: {
          ...current.stats!,
          rxnb: current.stats!.rxnb + 1,
          rxok: current.stats!.rxok + (Math.random() > 0.1 ? 1 : 0)
        }
      };

      const newMap = new Map(prev);
      newMap.set(newGateway.id, updated);
      return newMap;
    });

    addLog(`📨 Packet received from ${packet.decoded?.deviceId || 'unknown'}: ${JSON.stringify(packet.decoded).substring(0, 50)}...`);
  };

  const addLog = (message: string) => {
    setServerLogs(prev => [
      `${new Date().toLocaleTimeString()} - ${message}`,
      ...prev
    ].slice(0, 100));
  };

  const startServer = async () => {
    setServerStatus('starting');
    addLog('🚀 Starting LoRa Gateway Server...');
    
    try {
      // Simulate server start (replace with actual server start call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setServerStatus('running');
      setIsServerRunning(true);
      addLog(`✅ LoRa Gateway Server started on port ${serverPort}`);
      addLog('📡 Waiting for LoRa gateways to connect...');
      
      // Start simulation
      const interval = setInterval(() => {
        if (Math.random() > 0.3) { // 70% chance of receiving packet
          simulateRealGateway();
        }
      }, 2000 + Math.random() * 3000);

      return () => clearInterval(interval);
    } catch (error) {
      setServerStatus('error');
      addLog(`❌ Failed to start server: ${error}`);
    }
  };

  const stopServer = async () => {
    setServerStatus('stopped');
    setIsServerRunning(false);
    setConnectedGateways([]);
    addLog('🛑 LoRa Gateway Server stopped');
  };

  const sendDownlink = async (gatewayId: string, payload: any) => {
    try {
      addLog(`📤 Sending downlink to ${gatewayId}: ${JSON.stringify(payload).substring(0, 50)}...`);
      
      // Simulate downlink send (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setDownlinkQueue(prev => [
        {
          id: Date.now(),
          gatewayId,
          payload,
          timestamp: new Date(),
          status: 'sent'
        },
        ...prev
      ].slice(0, 20));

      // Update stats
      setGatewayStats(prev => {
        const current = prev.get(gatewayId);
        if (current) {
          const updated = {
            ...current,
            packetsSent: current.packetsSent + 1,
            stats: {
              ...current.stats!,
              txnb: current.stats!.txnb + 1,
              dwnb: current.stats!.dwnb + 1
            }
          };
          const newMap = new Map(prev);
          newMap.set(gatewayId, updated);
          return newMap;
        }
        return prev;
      });

      addLog(`✅ Downlink sent successfully to ${gatewayId}`);
    } catch (error) {
      addLog(`❌ Failed to send downlink: ${error}`);
    }
  };

  const formatPayload = (packet: LoRaPacket): string => {
    if (packet.decoded) {
      return JSON.stringify(packet.decoded, null, 2);
    }
    return packet.payload.substring(0, 100) + (packet.payload.length > 100 ? '...' : '');
  };

  const getSignalQuality = (rssi: number, snr: number): { quality: string; color: string } => {
    if (rssi > -70 && snr > 5) return { quality: 'Excellent', color: 'text-green-400' };
    if (rssi > -85 && snr > 0) return { quality: 'Good', color: 'text-blue-400' };
    if (rssi > -100 && snr > -5) return { quality: 'Fair', color: 'text-yellow-400' };
    return { quality: 'Poor', color: 'text-red-400' };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Real LoRa Gateway Dashboard</h1>
          <p className="text-gray-400">Connect and monitor physical LoRa gateways in real-time</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            serverStatus === 'running' ? 'bg-green-900/30 text-green-400' :
            serverStatus === 'starting' ? 'bg-yellow-900/30 text-yellow-400' :
            serverStatus === 'error' ? 'bg-red-900/30 text-red-400' :
            'bg-gray-900/30 text-gray-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              serverStatus === 'running' ? 'bg-green-400 animate-pulse' :
              serverStatus === 'starting' ? 'bg-yellow-400 animate-pulse' :
              serverStatus === 'error' ? 'bg-red-400' :
              'bg-gray-400'
            }`} />
            <span className="text-sm font-medium">
              {serverStatus === 'running' ? 'Server Running' :
               serverStatus === 'starting' ? 'Starting...' :
               serverStatus === 'error' ? 'Error' :
               'Server Stopped'}
            </span>
          </div>
        </div>
      </div>

      {/* Server Control */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Server Control</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-400">Port:</label>
            <input
              type="number"
              value={serverPort}
              onChange={(e) => setServerPort(parseInt(e.target.value))}
              disabled={isServerRunning}
              className="px-3 py-1 bg-gray-800 border border-gray-700 rounded text-white text-sm w-20"
            />
          </div>
          {!isServerRunning ? (
            <button
              onClick={startServer}
              disabled={serverStatus === 'starting'}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
            >
              {serverStatus === 'starting' ? '⏳ Starting...' : '🚀 Start Server'}
            </button>
          ) : (
            <button
              onClick={stopServer}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              🛑 Stop Server
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connected Gateways */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Connected Gateways ({connectedGateways.length})
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {connectedGateways.map((gateway) => {
                const stats = gatewayStats.get(gateway.id);
                return (
                  <motion.div
                    key={gateway.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      selectedGateway === gateway.id
                        ? 'bg-blue-900/30 border-blue-600'
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedGateway(gateway.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{gateway.ip}:{gateway.port}</div>
                        <div className="text-sm text-gray-400">
                          Last seen: {gateway.lastSeen.toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${
                          gateway.status === 'connected' ? 'text-green-400' :
                          gateway.status === 'error' ? 'text-red-400' :
                          'text-gray-400'
                        }`}>
                          {gateway.status}
                        </div>
                        {stats && (
                          <div className="text-xs text-gray-500">
                            RX: {stats.packetsReceived} | TX: {stats.packetsSent}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {connectedGateways.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📡</div>
                <div>No gateways connected</div>
                <div className="text-sm mt-1">Configure your LoRa gateway to connect to this server</div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Packets */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Recent Packets ({recentPackets.length})
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <AnimatePresence>
              {recentPackets.map((packet, index) => {
                const signal = getSignalQuality(packet.rssi, packet.snr);
                return (
                  <motion.div
                    key={`${packet.gatewayId}-${packet.timestamp.getTime()}-${index}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-white">
                        {packet.decoded?.deviceId || 'Unknown Device'}
                      </div>
                      <div className={`text-xs ${signal.color}`}>
                        {signal.quality}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                      <div>RSSI: {packet.rssi} dBm</div>
                      <div>SNR: {packet.snr} dB</div>
                      <div>Freq: {packet.frequency.toFixed(1)} MHz</div>
                      <div>DR: {packet.dataRate}</div>
                    </div>
                    {packet.decoded && (
                      <div className="mt-2 text-xs text-gray-300">
                        <pre className="text-xs overflow-x-auto">
                          {JSON.stringify(packet.decoded, null, 2)}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {recentPackets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📨</div>
                <div>No packets received</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Server Logs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
      >
        <h3 className="text-xl font-semibold text-white mb-4">Server Logs</h3>
        <div className="bg-black/50 rounded-lg p-4 max-h-60 overflow-y-auto font-mono text-sm">
          {serverLogs.map((log, index) => (
            <div key={index} className="text-gray-300 mb-1">
              {log}
            </div>
          ))}
          {serverLogs.length === 0 && (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      {selectedGateway && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">
            Gateway Actions - {selectedGateway}
          </h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => sendDownlink(selectedGateway, { cmd: 'ping' })}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              📡 Send Ping
            </button>
            <button
              onClick={() => sendDownlink(selectedGateway, { cmd: 'reset' })}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
            >
              🔄 Send Reset Command
            </button>
            <button
              onClick={() => sendDownlink(selectedGateway, { 
                cmd: 'config', 
                params: { frequency: 868.1, power: 14 } 
              })}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              ⚙️ Send Config
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RealLoRaGatewayDashboard;
