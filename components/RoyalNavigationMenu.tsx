/**
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Home,
  Brain,
  Dna,
  Settings,
  Leaf,
  FileText,
  Stethoscope,
  Globe,
  Shield,
  BookOpen,
  Beaker,
  Router,
  Zap,
  MessageSquare,
  Map,
  Cpu,
  Wifi,
  Monitor,
  Activity,
  Bluetooth,
  Search,
  Eye,
  Smartphone,
  BarChart3
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  route?: string;
  children?: MenuItem[];
  color: string;
  category: 'core' | 'agi' | 'iot' | 'neural' | 'tools' | 'demos';
}

const RoyalNavigationMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = [
    // Core Platform
    {
      id: 'core',
      title: 'Core Platform',
      icon: <Home className="w-5 h-5" />,
      description: 'Main platform functions',
      color: 'from-purple-600 to-indigo-600',
      category: 'core',
      children: [
        {
          id: 'home',
          title: 'Home Dashboard',
          icon: <Home className="w-4 h-4" />,
          description: 'Main dashboard',
          route: '/',
          color: 'from-purple-500 to-blue-500',
          category: 'core'
        },
        {
          id: 'browser',
          title: 'Integrated Browser',
          icon: <Globe className="w-4 h-4" />,
          description: 'Built-in web browser',
          route: '/browser',
          color: 'from-blue-500 to-cyan-500',
          category: 'core'
        },
        {
          id: 'libraries',
          title: 'Libraries Showcase',
          icon: <BookOpen className="w-4 h-4" />,
          description: 'Component libraries',
          route: '/libraries-showcase',
          color: 'from-cyan-500 to-teal-500',
          category: 'core'
        }
      ]
    },

    // AGI Systems
    {
      id: 'agi-systems',
      title: 'AGI Systems',
      icon: <Brain className="w-5 h-5" />,
      description: 'Artificial General Intelligence',
      color: 'from-violet-600 to-purple-600',
      category: 'agi',
      children: [
        {
          id: 'agi-dashboard',
          title: 'AGI Dashboard',
          icon: <Brain className="w-4 h-4" />,
          description: 'Main AGI control center',
          route: '/agi-dashboard',
          color: 'from-violet-500 to-purple-500',
          category: 'agi'
        },
        {
          id: 'agi-control',
          title: 'AGI Control Panel',
          icon: <Settings className="w-4 h-4" />,
          description: 'Advanced AGI controls',
          route: '/agi-control',
          color: 'from-purple-500 to-pink-500',
          category: 'agi'
        },
        {
          id: 'agi-core',
          title: 'AGI Core Engine',
          icon: <Cpu className="w-4 h-4" />,
          description: 'Core AGI processing',
          route: '/agi',
          color: 'from-pink-500 to-rose-500',
          category: 'agi'
        },
        {
          id: 'agi-organizer',
          title: 'AGI Organizer',
          icon: <FileText className="w-4 h-4" />,
          description: 'Intelligent organization',
          route: '/agi-organizer',
          color: 'from-rose-500 to-red-500',
          category: 'agi'
        }
      ]
    },

    // Specialized AGI
    {
      id: 'specialized-agi',
      title: 'Specialized AGI',
      icon: <Dna className="w-5 h-5" />,
      description: 'Domain-specific AI systems',
      color: 'from-emerald-600 to-green-600',
      category: 'agi',
      children: [
        {
          id: 'agi-bio',
          title: 'AGI Bio Research',
          icon: <Dna className="w-4 h-4" />,
          description: 'Biological AI research',
          route: '/agi-bio-demo',
          color: 'from-emerald-500 to-green-500',
          category: 'agi'
        },
        {
          id: 'agi-eco',
          title: 'AGI Ecology',
          icon: <Leaf className="w-4 h-4" />,
          description: 'Environmental AI systems',
          route: '/agi-eco-demo',
          color: 'from-green-500 to-lime-500',
          category: 'agi'
        },
        {
          id: 'agimed',
          title: 'AgiMed Professional',
          icon: <Stethoscope className="w-4 h-4" />,
          description: 'Medical AI platform',
          route: '/agimed-professional',
          color: 'from-lime-500 to-yellow-500',
          category: 'agi'
        },
        {
          id: 'agixeco',
          title: 'AgiXEco Advanced',
          icon: <Globe className="w-4 h-4" />,
          description: 'Advanced ecological AI',
          route: '/agixeco-demo',
          color: 'from-yellow-500 to-orange-500',
          category: 'agi'
        }
      ]
    },

    // Neural Networks
    {
      id: 'neural',
      title: 'Neural Networks',
      icon: <Zap className="w-5 h-5" />,
      description: 'Neural processing systems',
      color: 'from-amber-600 to-orange-600',
      category: 'neural',
      children: [
        {
          id: 'neural-dashboard',
          title: 'Neural Dashboard',
          icon: <Zap className="w-4 h-4" />,
          description: 'Neural network monitoring',
          route: '/neural-dashboard',
          color: 'from-amber-500 to-orange-500',
          category: 'neural'
        },
        {
          id: 'neural-dev',
          title: 'Neural Development',
          icon: <Activity className="w-4 h-4" />,
          description: 'Neural network development',
          route: '/neural-dev',
          color: 'from-orange-500 to-red-500',
          category: 'neural'
        },
        {
          id: 'neural-demo',
          title: 'Neural Demo',
          icon: <Eye className="w-4 h-4" />,
          description: 'Neural network demonstrations',
          route: '/neural-demo',
          color: 'from-red-500 to-pink-500',
          category: 'neural'
        }
      ]
    },

    // IoT & Network
    {
      id: 'iot-network',
      title: 'IoT & Networks',
      icon: <Wifi className="w-5 h-5" />,
      description: 'Internet of Things & networking',
      color: 'from-sky-600 to-blue-600',
      category: 'iot',
      children: [
        {
          id: 'lora-mesh',
          title: 'LoRa Mesh Network',
          icon: <Wifi className="w-4 h-4" />,
          description: 'Interactive mesh topology',
          route: '/lora-mesh',
          color: 'from-violet-500 to-purple-500',
          category: 'iot'
        },
        {
          id: 'network-monitor',
          title: 'Network Monitor',
          icon: <Monitor className="w-4 h-4" />,
          description: 'Network topology monitoring',
          route: '/network-monitor',
          color: 'from-blue-500 to-indigo-500',
          category: 'iot'
        },
        {
          id: 'iot-control',
          title: 'IoT Control Center',
          icon: <Smartphone className="w-4 h-4" />,
          description: 'IoT device management',
          route: '/iot-control',
          color: 'from-indigo-500 to-purple-500',
          category: 'iot'
        },
        {
          id: 'device-manager',
          title: 'Device Manager',
          icon: <Settings className="w-4 h-4" />,
          description: 'Comprehensive device management',
          route: '/device-manager',
          color: 'from-purple-500 to-pink-500',
          category: 'iot'
        },
        {
          id: 'sensor-dashboard',
          title: 'Sensor Dashboard',
          icon: <BarChart3 className="w-4 h-4" />,
          description: 'Real-time sensor monitoring',
          route: '/sensor-dashboard',
          color: 'from-purple-500 to-violet-500',
          category: 'iot'
        },
        {
          id: 'wireless-config',
          title: 'Wireless Configuration',
          icon: <Bluetooth className="w-4 h-4" />,
          description: 'Wireless network configuration',
          route: '/wireless-config',
          color: 'from-pink-500 to-rose-500',
          category: 'iot'
        }
      ]
    },

    // AI Chat Systems
    {
      id: 'chat-systems',
      title: 'AI Chat Systems',
      icon: <MessageSquare className="w-5 h-5" />,
      description: 'Conversational AI interfaces',
      color: 'from-teal-600 to-cyan-600',
      category: 'tools',
      children: [
        {
          id: 'openmind-chat',
          title: 'OpenMind Chat',
          icon: <MessageSquare className="w-4 h-4" />,
          description: 'OpenMind AI conversation',
          route: '/openmind-chat',
          color: 'from-teal-500 to-cyan-500',
          category: 'tools'
        },
        {
          id: 'ultra-agi-chat',
          title: 'Ultra AGI Chat',
          icon: <Brain className="w-4 h-4" />,
          description: 'Advanced AGI chat system',
          route: '/ultra-agi-chat',
          color: 'from-cyan-500 to-blue-500',
          category: 'tools'
        },
        {
          id: 'ultra-ai-chat',
          title: 'Ultra AI Chat',
          icon: <Cpu className="w-4 h-4" />,
          description: 'Ultra AI conversation',
          route: '/ultra-ai-chat',
          color: 'from-blue-500 to-indigo-500',
          category: 'tools'
        },
        {
          id: 'openmind-ai',
          title: 'OpenMind AI',
          icon: <Search className="w-4 h-4" />,
          description: 'OpenMind AI platform',
          route: '/openmind-ai',
          color: 'from-indigo-500 to-purple-500',
          category: 'tools'
        }
      ]
    },

    // Development Tools
    {
      id: 'dev-tools',
      title: 'Development Tools',
      icon: <Beaker className="w-5 h-5" />,
      description: 'Development and testing tools',
      color: 'from-slate-600 to-gray-600',
      category: 'tools',
      children: [
        {
          id: 'live-testing',
          title: 'Live Testing',
          icon: <Beaker className="w-4 h-4" />,
          description: 'Real-time testing environment',
          route: '/live-testing',
          color: 'from-slate-500 to-gray-500',
          category: 'tools'
        },
        {
          id: 'cva-demo',
          title: 'CVA Demo',
          icon: <Settings className="w-4 h-4" />,
          description: 'Class Variance Authority demo',
          route: '/cva-demo',
          color: 'from-gray-500 to-zinc-500',
          category: 'tools'
        },
        {
          id: 'fluid-demo',
          title: 'Fluid Architecture',
          icon: <Activity className="w-4 h-4" />,
          description: 'Fluid architecture demonstration',
          route: '/fluid-demo',
          color: 'from-zinc-500 to-neutral-500',
          category: 'tools'
        },
        {
          id: 'guardian-demo',
          title: 'Guardian Security',
          icon: <Shield className="w-4 h-4" />,
          description: 'Security system demonstration',
          route: '/guardian-demo',
          color: 'from-neutral-500 to-stone-500',
          category: 'tools'
        },
        {
          id: 'production-roadmap',
          title: 'Production Roadmap',
          icon: <Map className="w-4 h-4" />,
          description: 'Development roadmap',
          route: '/production-roadmap',
          color: 'from-stone-500 to-red-500',
          category: 'tools'
        }
      ]
    }
  ];

  const toggleExpanded = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.children) {
      toggleExpanded(item.id);
    } else if (item.route) {
      setActiveItem(item.id);
      // Use Next.js router for navigation
      if (typeof window !== 'undefined') {
        window.location.href = item.route;
      }
      // Auto-close menu after navigation
      setTimeout(() => setIsOpen(false), 500);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'core': return '👑';
      case 'agi': return '🧠';
      case 'iot': return '📡';
      case 'neural': return '⚡';
      case 'tools': return '🛠️';
      case 'demos': return '🎭';
      default: return '⭐';
    }
  };

  const menuVariants = {
    closed: {
      x: '100%',
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    })
  };

  const childVariants = {
    closed: { height: 0, opacity: 0 },
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        height: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { delay: 0.1 }
      }
    }
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-shadow"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-96 bg-white/95 backdrop-blur-xl shadow-2xl z-40 overflow-y-auto border-l border-purple-200"
          >
            {/* Header */}
            <div className="p-6 border-b border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  👑 UltraWeb Platform
                </h2>
                <p className="text-gray-600 text-sm mt-1">Royal Navigation Menu</p>
                <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                  <span>🚀 26 Pages</span>
                  <span>🧩 48 Components</span>
                  <span>⚡ Real-time</span>
                </div>
              </motion.div>
            </div>

            {/* Menu Items */}
            <div className="p-4 space-y-2">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={itemVariants}
                  initial="closed"
                  animate="open"
                  className="space-y-1"
                >
                  {/* Parent Item */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleItemClick(item)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all ${
                      expandedItems.has(item.id) || activeItem === item.id
                        ? `bg-gradient-to-r ${item.color} text-white shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{getCategoryIcon(item.category)}</span>
                      {item.icon}
                      <div>
                        <h3 className="font-semibold text-sm">{item.title}</h3>
                        <p className={`text-xs ${
                          expandedItems.has(item.id) || activeItem === item.id
                            ? 'text-white/80'
                            : 'text-gray-500'
                        }`}>
                          {item.description}
                        </p>
                      </div>
                    </div>
                    {item.children && (
                      <motion.div
                        animate={{ rotate: expandedItems.has(item.id) ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Children Items */}
                  <AnimatePresence>
                    {item.children && expandedItems.has(item.id) && (
                      <motion.div
                        variants={childVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="ml-6 space-y-1 overflow-hidden"
                      >
                        {item.children.map((child, childIndex) => (
                          <motion.div
                            key={child.id}
                            custom={childIndex}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02, x: 4 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleItemClick(child)}
                            className={`flex items-center space-x-3 p-2 rounded-md cursor-pointer transition-all ${
                              activeItem === child.id
                                ? `bg-gradient-to-r ${child.color} text-white shadow-md`
                                : 'bg-white hover:bg-gray-50 text-gray-600 border border-gray-200'
                            }`}
                          >
                            {child.icon}
                            <div className="flex-1">
                              <h4 className="font-medium text-xs">{child.title}</h4>
                              <p className={`text-xs ${
                                activeItem === child.id ? 'text-white/80' : 'text-gray-400'
                              }`}>
                                {child.description}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 text-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <p className="text-xs text-gray-600">
                  🚀 UltraWeb AGI Platform v8.0.0
                </p>
                <p className="text-xs text-gray-500">
                  Created by Ledjan Ahmati
                </p>
                <div className="mt-2 flex justify-center space-x-1">
                  {['🧠', '⚡', '🌐', '🔮'].map((emoji, i) => (
                    <motion.span
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                      className="text-lg"
                    >
                      {emoji}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RoyalNavigationMenu;
