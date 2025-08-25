/**
 * LoRa Gateway Dashboard Component
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { io, Socket } from 'socket.io-client';

interface LoRaMessage {
  id: string;
  deviceId: string;
  payload: string;
  rssi: number;
  snr: number;
  timestamp: Date;
  frequency: number;
  dataRate: string;
}

interface LoRaDevice {
  deviceId: string;
  name: string;
  lastSeen: Date;
  battery: number;
  location?: {
    lat: number;
    lng: number;
  };
}

interface SolanaWallet {
  publicKey: string;
  balance: number;
  network: string;
  albionTokenConfigured: boolean;
}

const dashboardVariants = cva("min-h-screen p-6", {
  variants: {
    theme: {
      royal: "bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100",
      dark: "bg-gradient-to-br from-gray-900 via-purple-900 to-black",
      nature: "bg-gradient-to-br from-green-50 via-blue-50 to-teal-100"
    }
  },
  defaultVariants: {
    theme: "royal"
  }
});

const cardVariants = cva("backdrop-blur-sm border shadow-lg rounded-xl p-6", {
  variants: {
    theme: {
      royal: "bg-white/80 border-purple-200",
      dark: "bg-black/40 border-purple-500/30 text-white",
      nature: "bg-white/80 border-green-200"
    }
  }
});

export default function Web8LoRaDashboard() {
  const [theme, setTheme] = useState<'royal' | 'dark' | 'nature'>('royal');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState<LoRaMessage[]>([]);
  const [devices, setDevices] = useState<LoRaDevice[]>([]);
  const [wallet, setWallet] = useState<SolanaWallet | null>(null);
  const [loraStatus, setLoraStatus] = useState({ connected: false });

  useEffect(() => {
    // Connect to LoRa Gateway WebSocket
    const newSocket = io('http://localhost:4001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('📡 Connected to LoRa Gateway');
      setConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Disconnected from LoRa Gateway');
      setConnected(false);
    });

    newSocket.on('lora:status', (status) => {
      setLoraStatus(status);
    });

    newSocket.on('lora:message', (message: LoRaMessage) => {
      setMessages(prev => [message, ...prev.slice(0, 49)]);
    });

    newSocket.on('lora:device', (device: LoRaDevice) => {
      setDevices(prev => {
        const existing = prev.find(d => d.deviceId === device.deviceId);
        if (existing) {
          return prev.map(d => d.deviceId === device.deviceId ? device : d);
        }
        return [device, ...prev];
      });
    });

    newSocket.on('lora:devices', (deviceList: LoRaDevice[]) => {
      setDevices(deviceList);
    });

    // Load initial data
    loadWalletInfo();

    return () => {
      newSocket.close();
    };
  }, []);

  const loadWalletInfo = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/solana/wallet');
      if (response.ok) {
        const walletData = await response.json();
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Failed to load wallet info:', error);
    }
  };

  const sendMessage = async (deviceId: string, message: string) => {
    try {
      const response = await fetch('http://localhost:4001/api/lora/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deviceId, message })
      });
      
      if (response.ok) {
        console.log('✅ Message sent successfully');
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  };

  const requestAirdrop = async () => {
    try {
      const response = await fetch('http://localhost:4001/api/solana/airdrop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 2 })
      });
      
      if (response.ok) {
        console.log('💧 Airdrop requested');
        setTimeout(loadWalletInfo, 2000);
      }
    } catch (error) {
      console.error('❌ Airdrop failed:', error);
    }
  };

  return (
    <div className={dashboardVariants({ theme })}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              🚀 Web8 LoRa Gateway
            </h1>
            <p className="text-gray-600 mt-2">Real-time IoT + Solana Blockchain Integration</p>
          </div>
          
          <div className="flex gap-2">
            {(['royal', 'dark', 'nature'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  theme === t
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cardVariants({ theme })}
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <h3 className="font-semibold">WebSocket</h3>
              <p className="text-sm opacity-70">{connected ? 'Connected' : 'Disconnected'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={cardVariants({ theme })}
        >
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${loraStatus.connected ? 'bg-green-500' : 'bg-orange-500'}`} />
            <div>
              <h3 className="font-semibold">LoRa Gateway</h3>
              <p className="text-sm opacity-70">{loraStatus.connected ? 'Active' : 'Standby'}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className={cardVariants({ theme })}
        >
          <div>
            <h3 className="font-semibold">Devices</h3>
            <p className="text-2xl font-bold text-purple-600">{devices.length}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={cardVariants({ theme })}
        >
          <div>
            <h3 className="font-semibold">Messages</h3>
            <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
          </div>
        </motion.div>
      </div>

      {/* Solana Wallet Info */}
      {wallet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${cardVariants({ theme })} mb-8`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold mb-2">💰 Solana Wallet</h3>
              <p className="text-sm opacity-70 mb-2">Network: {wallet.network}</p>
              <p className="font-mono text-sm">{wallet.publicKey}</p>
              <p className="text-lg font-semibold mt-2">{wallet.balance.toFixed(4)} SOL</p>
            </div>
            <button
              onClick={requestAirdrop}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              💧 Airdrop
            </button>
          </div>
        </motion.div>
      )}

      {/* Devices and Messages Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cardVariants({ theme })}
        >
          <h3 className="text-xl font-bold mb-4">📱 LoRa Devices</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {devices.length === 0 ? (
              <p className="text-center opacity-70 py-8">No devices detected</p>
            ) : (
              devices.map((device) => (
                <div key={device.deviceId} className="flex justify-between items-center p-3 bg-black/5 rounded-lg">
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-sm opacity-70">{device.deviceId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">🔋 {device.battery}%</p>
                    <p className="text-xs opacity-70">
                      {new Date(device.lastSeen).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Messages */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cardVariants({ theme })}
        >
          <h3 className="text-xl font-bold mb-4">📨 Recent Messages</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-center opacity-70 py-8">No messages received</p>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="p-3 bg-black/5 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-sm">{message.deviceId}</span>
                    <span className="text-xs opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm mb-2">{message.payload}</p>
                  <div className="flex gap-4 text-xs opacity-70">
                    <span>RSSI: {message.rssi}dBm</span>
                    <span>SNR: {message.snr}dB</span>
                    <span>{message.dataRate}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
