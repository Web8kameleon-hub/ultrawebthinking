/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  Router, 
  Signal, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Settings, 
  Save, 
  RefreshCw,
  Shield,
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Globe,
  Bluetooth
} from 'lucide-react';

interface WirelessNetwork {
  id: string;
  ssid: string;
  bssid: string;
  frequency: number;
  channel: number;
  signal: number;
  security: 'WPA3' | 'WPA2' | 'WEP' | 'Open';
  connected: boolean;
  saved: boolean;
  hidden: boolean;
  bandwidth: '20MHz' | '40MHz' | '80MHz' | '160MHz';
  protocol: '802.11n' | '802.11ac' | '802.11ax';
}

interface WirelessConfig {
  ssid: string;
  password: string;
  security: string;
  channel: string;
  bandwidth: string;
  hidden: boolean;
  macFiltering: boolean;
  guestNetwork: boolean;
  guestSsid: string;
  guestPassword: string;
}

const WirelessConfiguration: React.FC = () => {
  const [networks, setNetworks] = useState<WirelessNetwork[]>([
    {
      id: 'net-001',
      ssid: 'UltraWeb-5G',
      bssid: '00:1A:2B:3C:4D:5E',
      frequency: 5180,
      channel: 36,
      signal: 95,
      security: 'WPA3',
      connected: true,
      saved: true,
      hidden: false,
      bandwidth: '80MHz',
      protocol: '802.11ax'
    },
    {
      id: 'net-002',
      ssid: 'UltraWeb-2.4G',
      bssid: '00:1A:2B:3C:4D:5F',
      frequency: 2437,
      channel: 6,
      signal: 88,
      security: 'WPA3',
      connected: false,
      saved: true,
      hidden: false,
      bandwidth: '40MHz',
      protocol: '802.11n'
    },
    {
      id: 'net-003',
      ssid: 'Neighbor_WiFi',
      bssid: '00:1A:2B:3C:4D:60',
      frequency: 2462,
      channel: 11,
      signal: 65,
      security: 'WPA2',
      connected: false,
      saved: false,
      hidden: false,
      bandwidth: '20MHz',
      protocol: '802.11n'
    },
    {
      id: 'net-004',
      ssid: 'Guest_Network',
      bssid: '00:1A:2B:3C:4D:61',
      frequency: 5745,
      channel: 149,
      signal: 72,
      security: 'WPA2',
      connected: false,
      saved: false,
      hidden: false,
      bandwidth: '80MHz',
      protocol: '802.11ac'
    }
  ]);

  const [config, setConfig] = useState<WirelessConfig>({
    ssid: 'UltraWeb-5G',
    password: '',
    security: 'WPA3',
    channel: 'auto',
    bandwidth: '80MHz',
    hidden: false,
    macFiltering: false,
    guestNetwork: true,
    guestSsid: 'UltraWeb-Guest',
    guestPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showGuestPassword, setShowGuestPassword] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'scan' | 'configure' | 'advanced'>('scan');

  useEffect(() => {
    // Simulate signal strength fluctuations
    const interval = setInterval(() => {
      setNetworks(prev => prev.map(network => ({
        ...network,
        signal: Math.max(10, Math.min(100, network.signal + (Math.random() - 0.5) * 10))
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scanNetworks = () => {
    setIsScanning(true);
    console.log('🔍 Scanning for wireless networks...');
    
    setTimeout(() => {
      // Simulate finding new networks
      const newNetworks: WirelessNetwork[] = [
        {
          id: `net-${Date.now()}`,
          ssid: `Network_${Math.floor(Math.random() * 1000)}`,
          bssid: `00:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}:${Math.random().toString(16).substr(2, 2).toUpperCase()}`,
          frequency: Math.random() > 0.5 ? 2437 : 5180,
          channel: Math.random() > 0.5 ? Math.floor(Math.random() * 11) + 1 : Math.floor(Math.random() * 23) + 36,
          signal: Math.floor(Math.random() * 70) + 20,
          security: ['WPA3', 'WPA2', 'Open'][Math.floor(Math.random() * 3)] as any,
          connected: false,
          saved: false,
          hidden: Math.random() > 0.8,
          bandwidth: ['20MHz', '40MHz', '80MHz'][Math.floor(Math.random() * 3)] as any,
          protocol: ['802.11n', '802.11ac', '802.11ax'][Math.floor(Math.random() * 3)] as any
        }
      ];
      
      setNetworks(prev => [...prev, ...newNetworks]);
      setIsScanning(false);
      console.log('✅ Network scan completed');
    }, 2500);
  };

  const connectToNetwork = (networkId: string) => {
    setNetworks(prev => prev.map(network => ({
      ...network,
      connected: network.id === networkId ? true : false
    })));
    console.log(`🔗 Connected to network: ${networks.find(n => n.id === networkId)?.ssid}`);
  };

  const saveConfiguration = () => {
    console.log('💾 Saving wireless configuration...', config);
    // Simulate save operation
    setTimeout(() => {
      console.log('✅ Configuration saved successfully');
    }, 1000);
  };

  const getSignalIcon = (signal: number) => {
    if (signal > 75) return <Signal className="w-5 h-5 text-green-500" />;
    if (signal > 50) return <Signal className="w-5 h-5 text-yellow-500" />;
    if (signal > 25) return <Signal className="w-5 h-5 text-orange-500" />;
    return <Signal className="w-5 h-5 text-red-500" />;
  };

  const getSecurityIcon = (security: string) => {
    return security === 'Open' ? 
      <Unlock className="w-4 h-4 text-red-500" /> : 
      <Lock className="w-4 h-4 text-green-500" />;
  };

  const getFrequencyBand = (frequency: number) => {
    return frequency > 5000 ? '5G' : '2.4G';
  };

  const connectedNetwork = networks.find(n => n.connected);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Wireless Configuration
        </h2>
        <p className="text-gray-600 mt-2">Configure and manage wireless network settings</p>
      </div>

      {/* Status Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {connectedNetwork ? <Wifi className="w-6 h-6 text-green-500" /> : <WifiOff className="w-6 h-6 text-red-500" />}
              <span className="font-semibold text-gray-800">
                {connectedNetwork ? `Connected to ${connectedNetwork.ssid}` : 'Not Connected'}
              </span>
            </div>
            {connectedNetwork && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{getSignalIcon(connectedNetwork.signal)}</span>
                <span>{connectedNetwork.signal}%</span>
                <span>•</span>
                <span>{getFrequencyBand(connectedNetwork.frequency)}</span>
                <span>•</span>
                <span>{connectedNetwork.protocol}</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scanNetworks}
              disabled={isScanning}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Refresh'}</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'scan', label: 'Network Scan', icon: <Wifi className="w-4 h-4" /> },
          { id: 'configure', label: 'Configuration', icon: <Settings className="w-4 h-4" /> },
          { id: 'advanced', label: 'Advanced', icon: <Shield className="w-4 h-4" /> }
        ].map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'scan' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Available Networks</h3>
            <span className="text-sm text-gray-600">{networks.length} networks found</span>
          </div>

          <div className="grid gap-3">
            {networks.map((network, index) => (
              <motion.div
                key={network.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  network.connected 
                    ? 'bg-green-50 border-green-200' 
                    : selectedNetwork === network.id
                    ? 'bg-blue-50 border-blue-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedNetwork(selectedNetwork === network.id ? null : network.id)}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSignalIcon(network.signal)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-800">
                          {network.hidden ? '<Hidden Network>' : network.ssid}
                        </h4>
                        {getSecurityIcon(network.security)}
                        {network.saved && <CheckCircle className="w-4 h-4 text-blue-500" />}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>{network.security}</span>
                        <span>•</span>
                        <span>{getFrequencyBand(network.frequency)}</span>
                        <span>•</span>
                        <span>Ch {network.channel}</span>
                        <span>•</span>
                        <span>{network.protocol}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">{network.signal}%</span>
                    {network.connected ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Connected
                      </span>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          connectToNetwork(network.id);
                        }}
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                      >
                        Connect
                      </motion.button>
                    )}
                  </div>
                </div>

                {selectedNetwork === network.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">BSSID</p>
                        <p className="font-medium">{network.bssid}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Frequency</p>
                        <p className="font-medium">{network.frequency} MHz</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Bandwidth</p>
                        <p className="font-medium">{network.bandwidth}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Protocol</p>
                        <p className="font-medium">{network.protocol}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'configure' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Network Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Network */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4">Main Network</h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Network Name (SSID)
                  </label>
                  <input
                    type="text"
                    value={config.ssid}
                    onChange={(e) => setConfig({...config, ssid: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={config.password}
                      onChange={(e) => setConfig({...config, password: e.target.value})}
                      className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security
                  </label>
                  <select
                    value={config.security}
                    onChange={(e) => setConfig({...config, security: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="WPA3">WPA3 (Recommended)</option>
                    <option value="WPA2">WPA2</option>
                    <option value="WEP">WEP (Not Recommended)</option>
                    <option value="Open">Open (No Security)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Channel
                    </label>
                    <select
                      value={config.channel}
                      onChange={(e) => setConfig({...config, channel: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="auto">Auto</option>
                      <option value="1">1 (2.4GHz)</option>
                      <option value="6">6 (2.4GHz)</option>
                      <option value="11">11 (2.4GHz)</option>
                      <option value="36">36 (5GHz)</option>
                      <option value="149">149 (5GHz)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bandwidth
                    </label>
                    <select
                      value={config.bandwidth}
                      onChange={(e) => setConfig({...config, bandwidth: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="20MHz">20 MHz</option>
                      <option value="40MHz">40 MHz</option>
                      <option value="80MHz">80 MHz</option>
                      <option value="160MHz">160 MHz</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="hidden"
                    checked={config.hidden}
                    onChange={(e) => setConfig({...config, hidden: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="hidden" className="text-sm text-gray-700">
                    Hide network name (SSID)
                  </label>
                </div>
              </div>
            </div>

            {/* Guest Network */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-800">Guest Network</h4>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="guestNetwork"
                    checked={config.guestNetwork}
                    onChange={(e) => setConfig({...config, guestNetwork: e.target.checked})}
                    className="mr-2"
                  />
                  <label htmlFor="guestNetwork" className="text-sm text-gray-700">
                    Enable
                  </label>
                </div>
              </div>
              
              {config.guestNetwork && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest SSID
                    </label>
                    <input
                      type="text"
                      value={config.guestSsid}
                      onChange={(e) => setConfig({...config, guestSsid: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guest Password
                    </label>
                    <div className="relative">
                      <input
                        type={showGuestPassword ? 'text' : 'password'}
                        value={config.guestPassword}
                        onChange={(e) => setConfig({...config, guestPassword: e.target.value})}
                        className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowGuestPassword(!showGuestPassword)}
                        className="absolute right-3 top-2.5"
                      >
                        {showGuestPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={saveConfiguration}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </motion.button>
          </div>
        </div>
      )}

      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-800">Advanced Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Security */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security
              </h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">MAC Address Filtering</p>
                    <p className="text-sm text-gray-600">Allow only specific devices</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.macFiltering}
                    onChange={(e) => setConfig({...config, macFiltering: e.target.checked})}
                    className="w-4 h-4"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">WPS</p>
                    <p className="text-sm text-gray-600">Wi-Fi Protected Setup</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Access Control</p>
                    <p className="text-sm text-gray-600">Time-based restrictions</p>
                  </div>
                  <input type="checkbox" className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="bg-white p-6 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Performance
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transmit Power
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>High (100%)</option>
                    <option>Medium (75%)</option>
                    <option>Low (50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    QoS Priority
                  </label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Gaming</option>
                    <option>Streaming</option>
                    <option>Balanced</option>
                    <option>Download</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-700">Band Steering</p>
                    <p className="text-sm text-gray-600">Auto-select best band</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          {/* Network Statistics */}
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2" />
              Network Statistics
            </h4>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">24</p>
                <p className="text-sm text-gray-600">Connected Devices</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">156 Mbps</p>
                <p className="text-sm text-gray-600">Current Speed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">2.4 GB</p>
                <p className="text-sm text-gray-600">Data Today</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">99.8%</p>
                <p className="text-sm text-gray-600">Uptime</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WirelessConfiguration;
