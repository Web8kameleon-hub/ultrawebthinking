/**
 * Web8 Industrial Production Roadmap
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cva } from 'class-variance-authority';
import { motion } from 'framer-motion';

// Web8 Variants
const containerVariants = cva(
  "min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6",
  {
    variants: {
      theme: {
        royal: "from-purple-50 via-blue-50 to-indigo-100 text-slate-900",
        dark: "from-gray-900 via-purple-900 to-black text-white",
        nature: "from-green-50 via-blue-50 to-teal-100 text-slate-900"
      }
    },
    defaultVariants: {
      theme: "dark"
    }
  }
);

const cardVariants = cva(
  "backdrop-blur-sm border shadow-lg rounded-xl p-6 mb-8",
  {
    variants: {
      variant: {
        primary: "bg-white/10 border-white/20",
        secondary: "bg-slate-800/50 border-slate-700/50",
        accent: "bg-purple-500/20 border-purple-400/30"
      }
    },
    defaultVariants: {
      variant: "primary"
    }
  }
);

const statusVariants = cva(
  "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
  {
    variants: {
      status: {
        active: "bg-green-500/20 text-green-400 border border-green-500/30",
        partial: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        inactive: "bg-red-500/20 text-red-400 border border-red-500/30"
      }
    }
  }
);

interface ModuleStatus {
  module: string;
  status: 'active' | 'partial' | 'inactive';
  statusText: string;
  action: string;
  hardware: string;
}

interface HardwareItem {
  icon: string;
  name: string;
  description: string;
}

export default function Web8ProductionRoadmap() {
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'royal' | 'dark' | 'nature'>('dark');

  // Production modules data
  const modules: ModuleStatus[] = [
    {
      module: "LoRa + PDF",
      status: "active",
      statusText: "Active",
      action: "Implement PDF engine + printer integration",
      hardware: "Network printer (IPP), reportlab/puppeteer"
    },
    {
      module: "Gateway + GPU",
      status: "partial",
      statusText: "GPU Overload",
      action: "Introduce load balancer / task queue",
      hardware: "GPU servers (A100/H100), Redis/Kafka"
    },
    {
      module: "Albion Solana",
      status: "active",
      statusText: "Token Deployed",
      action: "Integrate Phantom wallet + test transaction",
      hardware: "Phantom wallet, Solana Devnet/Mainnet"
    },
    {
      module: "Templates",
      status: "partial",
      statusText: "Static UI",
      action: "Convert to dynamic templates with data binding",
      hardware: "Next.js, PandaCSS"
    },
    {
      module: "OpenMind",
      status: "partial",
      statusText: "Partial",
      action: "Finish module, remove 3rd party branding",
      hardware: "AGI Core integration"
    },
    {
      module: "Search Ultra Engine",
      status: "inactive",
      statusText: "Non-functional",
      action: "Rebuild index + optimize query latency",
      hardware: "Elasticsearch/Meilisearch"
    },
    {
      module: "AGISheet / Agimed / Agieco",
      status: "inactive",
      statusText: "Inactive",
      action: "Link with AGI Core, produce functional apps",
      hardware: "Frontend grid + backend APIs"
    },
    {
      module: "UI Navigation",
      status: "partial",
      statusText: "Too many tabs",
      action: "Implement Mega Menu / Drawer system",
      hardware: "React components"
    },
    {
      module: "Governance",
      status: "inactive",
      statusText: "Minimal",
      action: "RBAC + Audit logs",
      hardware: "Database + logging system"
    },
    {
      module: "DDoS Defense",
      status: "inactive",
      statusText: "Minimal",
      action: "Deploy rate limiting + AI detection",
      hardware: "NGINX/Envoy, AI classifier"
    },
    {
      module: "Node Traffic",
      status: "partial",
      statusText: "Not distributed",
      action: "Implement mesh load distribution",
      hardware: "Consistent hashing, routing layer"
    }
  ];

  // Hardware requirements
  const hardwareItems: HardwareItem[] = [
    {
      icon: "🖥️",
      name: "GPU Servers",
      description: "NVIDIA A100/H100 or RTX 6000 for development"
    },
    {
      icon: "⚙️",
      name: "CPU Orchestrator Server",
      description: "High-performance CPU server for coordination"
    },
    {
      icon: "💾",
      name: "Redundant Storage",
      description: "NAS + NVMe SSD (≥ 4TB) with backup systems"
    },
    {
      icon: "📡",
      name: "LoRa Gateways",
      description: "5+ Industrial Gateways (RAK, Mikrotik) + High-gain antennas"
    },
    {
      icon: "🛡️",
      name: "Industrial Firewall",
      description: "Fortigate/Palo Alto or pfSense for security"
    },
    {
      icon: "🌐",
      name: "Redundant Routers",
      description: "Ubiquiti/EdgeRouter for network reliability"
    },
    {
      icon: "🖨️",
      name: "Network Printers",
      description: "IPP-compatible printers with auto-PDF capabilities"
    },
    {
      icon: "🔋",
      name: "Smart UPS",
      description: "Uninterruptible power supply for each server/gateway"
    },
    {
      icon: "🔐",
      name: "HSM Security",
      description: "YubiHSM for secure key storage and management"
    },
    {
      icon: "💳",
      name: "Phantom Wallet",
      description: "Multi-sig wallet for Albion ALB token management"
    }
  ];

  // Calculate progress
  useEffect(() => {
    const activeCount = modules.filter(m => m.status === 'active').length;
    const partialCount = modules.filter(m => m.status === 'partial').length;
    const totalProgress = ((activeCount * 1) + (partialCount * 0.5)) / modules.length * 100;
    
    const timer = setTimeout(() => {
      setProgress(totalProgress);
    }, 500);

    return () => clearTimeout(timer);
  }, [modules]);

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/production-roadmap/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modules,
          hardwareItems,
          progress,
          theme
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `web8-production-roadmap-${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Failed to export PDF. Please try again.');
    }
  };

  const shareRoadmap = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Web8 Industrial Production Roadmap',
        text: 'Comprehensive plan for transitioning to full production environment',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Roadmap URL copied to clipboard!');
    }
  };

  return (
    <div className={containerVariants({ theme })}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className={cardVariants({ variant: "accent" })}
        >
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                🚀 Web8 – Industrial Production Roadmap
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-6">
              Comprehensive plan for transitioning to full production environment
            </p>
            
            {/* Theme Switcher */}
            <div className="flex justify-center gap-2 mb-4">
              {(['royal', 'dark', 'nature'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    theme === t 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </motion.header>

        {/* Progress Overview */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cardVariants({ variant: "primary" })}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3">📊</span>
            Overall Progress
          </h2>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Project Completion</span>
              <span className="text-2xl font-bold text-purple-400">{Math.round(progress)}%</span>
            </div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportToPDF}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              📄 Export as PDF
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={shareRoadmap}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              🔗 Share Roadmap
            </motion.button>
          </div>
        </motion.div>

        {/* Production Modules Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={cardVariants({ variant: "primary" })}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3">📋</span>
            Production Modules Status
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="text-left py-4 px-2 font-semibold">Module</th>
                  <th className="text-left py-4 px-2 font-semibold">Status</th>
                  <th className="text-left py-4 px-2 font-semibold">Required Action</th>
                  <th className="text-left py-4 px-2 font-semibold">Hardware/Tools</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module, index) => (
                  <motion.tr
                    key={module.module}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    className="border-b border-gray-700/50 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-4 px-2 font-medium">{module.module}</td>
                    <td className="py-4 px-2">
                      <span className={statusVariants({ status: module.status })}>
                        {module.statusText}
                      </span>
                    </td>
                    <td className="py-4 px-2 text-gray-300 text-sm">{module.action}</td>
                    <td className="py-4 px-2 text-gray-400 text-sm">{module.hardware}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Hardware Requirements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={cardVariants({ variant: "secondary" })}
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-3">🔧</span>
            Hardware/Tools for Production
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hardwareItems.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="flex items-start p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <span className="text-2xl mr-4 flex-shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-semibold text-white mb-1">{item.name}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center py-8 text-gray-400"
        >
          <p>
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-semibold">
              Web8 Industrial Platform
            </span>
            {" "}- Built with TypeScript, Next.js & Neural Architecture
          </p>
          <p className="text-sm mt-2">
            Created by <span className="text-purple-400">Ledjan Ahmati</span> • Version 8.0.0-WEB8
          </p>
        </motion.footer>
      </div>
    </div>
  );
}
