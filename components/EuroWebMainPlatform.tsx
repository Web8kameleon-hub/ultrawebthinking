/**
 * EuroWeb Ultra Main Platform
 * Integron të gjitha modulet AGI me Web8 Tab System dhe OpenMind Chat
 */

'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Lazy load major components
const Web8TabSystem = lazy(() => import('./Web8TabSystem'));
const SecurityDashboard = lazy(() => import('./SecurityDashboard'));
const NeuralAnalytics = lazy(() => import('./NeuralAnalytics'));
const AGIConsole = lazy(() => import('./AGIConsole'));

interface Tab {
  id: string;
  title: string;
  url: string;
  icon: string;
  isActive: boolean;
  type: 'agi' | 'dashboard' | 'search' | 'chat' | 'module';
  component?: React.ComponentType;
}

interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type: 'text' | 'system' | 'suggestion';
}

const LoadingSpinner = ({ message = 'Duke ngarkuar...' }: { message?: string }) => (
  <motion.div 
    className="flex flex-col items-center justify-center p-8 space-y-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <motion.div
      className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
    <p className="text-slate-600 text-sm">{message}</p>
  </motion.div>
);

export const EuroWebMainPlatform: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'dashboard',
      title: '🧠 AGI Dashboard',
      url: 'euroweb://dashboard',
      icon: '🧠',
      isActive: true,
      type: 'dashboard'
    },
    {
      id: 'agioffice',
      title: '💼 AGIOffice',
      url: 'euroweb://office',
      icon: '💼',
      isActive: false,
      type: 'module'
    },
    {
      id: 'agimed',
      title: '🏥 AGIMed',
      url: 'euroweb://medical',
      icon: '🏥',
      isActive: false,
      type: 'module'
    },
    {
      id: 'agiel',
      title: '⚡ AGIEl',
      url: 'euroweb://energy',
      icon: '⚡',
      isActive: false,
      type: 'module'
    },
    {
      id: 'agieco',
      title: '🌱 AGIEco',
      url: 'euroweb://environment',
      icon: '🌱',
      isActive: false,
      type: 'module'
    },
    {
      id: 'search',
      title: '🔍 AGI Search',
      url: 'euroweb://search',
      icon: '🔍',
      isActive: false,
      type: 'search'
    },
    {
      id: 'guardian',
      title: '🛡️ Guardian',
      url: 'euroweb://security',
      icon: '🛡️',
      isActive: false,
      type: 'module'
    }
  ]);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Mirësevini në EuroWeb Ultra! Si mund t\'ju ndihmoj sot?',
      sender: 'ai',
      timestamp: new Date(),
      type: 'system'
    }
  ]);
  
  const [chatInput, setChatInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const activeTab = tabs.find(tab => tab.isActive);

  const handleTabClick = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({
      ...tab,
      isActive: tab.id === tabId
    })));
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex === -1) return;
    
    const wasActive = tabs[tabIndex]?.isActive;
    
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (wasActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      const nextTab = newTabs[nextActiveIndex];
      if (nextTab) {
        nextTab.isActive = true;
      }
    }
    
    setTabs(newTabs);
  };

  const addNewTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: 'New Tab',
      url: 'euroweb://new',
      icon: '⭐',
      isActive: true,
      type: 'dashboard'
    };
    
    setTabs(prev => [
      ...prev.map(tab => ({ ...tab, isActive: false })),
      newTab
    ]);
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      content: chatInput,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/openmind', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: chatInput,
          options: {
            ethicalCheck: true,
            attributeSource: true
          }
        })
      });

      const data = await response.json();
      
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        content: data.synthesis?.mainResponse || 'Më falni, por nuk mund të përpunoj kërkesën tuaj në këtë moment.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'text'
      };

      setChatMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: 'Ka ndodhur një gabim. Ju lutem provoni sërish.',
        sender: 'ai',
        timestamp: new Date(),
        type: 'system'
      };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    if (!activeTab) return <LoadingSpinner />;

    switch (activeTab.type) {
      case 'dashboard':
        return (
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">🧠 AGI Dashboard</h1>
            <Suspense fallback={<LoadingSpinner message="Duke ngarkuar Dashboard..." />}>
              <NeuralAnalytics />
            </Suspense>
          </div>
        );
      
      case 'search':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">🔍 AGI Search Ultra</h1>
            <div className="bg-slate-50 rounded-lg p-8 text-center">
              <h2 className="text-xl mb-4">Kërko në të gjithë platformën AGI</h2>
              <p className="text-slate-600 mb-6">Përdor search bar në krye të faqes</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">🏥 Medical Search</h3>
                  <p className="text-sm text-slate-600">Kërko për diagnostikime, trajtim mjekësor, dhe hulumtime</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">🌱 Environmental Search</h3>
                  <p className="text-sm text-slate-600">Kërko për klimë, mjedis, dhe qëndrueshmëri</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">⚡ Energy Search</h3>
                  <p className="text-sm text-slate-600">Kërko për energji, rrjete të mençura, dhe optimizim</p>
                </div>
                <div className="bg-white p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">💼 Office Search</h3>
                  <p className="text-sm text-slate-600">Kërko për dokumente, tabela, dhe vegla zyre</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'module':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-900 mb-6">{activeTab.title}</h1>
            <Suspense fallback={<LoadingSpinner message="Duke ngarkuar modulin..." />}>
              {activeTab.id === 'guardian' ? (
                <SecurityDashboard />
              ) : activeTab.id === 'agioffice' ? (
                <div className="bg-slate-50 rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">💼</div>
                    <h2 className="text-xl font-semibold mb-4">AGI Office</h2>
                    <p className="text-slate-600 mb-6">Sistemi inteligjent i zyrës për produktivitet maksimal</p>
                    <a 
                      href="/agioffice" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
                    >
                      Hap AGI Office
                    </a>
                  </div>
                </div>
              ) : activeTab.id === 'agimed' ? (
                <div className="bg-slate-50 rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🏥</div>
                    <h2 className="text-xl font-semibold mb-4">AGI Medical</h2>
                    <p className="text-slate-600 mb-6">Sistemi mjekësor me AI për diagnostikime dhe trajtime</p>
                    <a 
                      href="/agimed" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors inline-block"
                    >
                      Hap AGI Medical
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">{activeTab.icon}</div>
                  <h2 className="text-xl font-semibold mb-4">{activeTab.title}</h2>
                  <p className="text-slate-600 mb-6">Moduli është duke u ngarkuar...</p>
                  <div className="bg-white p-6 rounded-lg border">
                    <p className="text-sm">Ky modul do të jetë i disponueshëm së shpejti me funksionalitete të plota AGI.</p>
                  </div>
                </div>
              )}
            </Suspense>
          </div>
        );
      
      default:
        return <LoadingSpinner />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Header with Search */}
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-slate-900">EuroWeb Ultra</h1>
            <div className="flex items-center bg-slate-100 rounded-lg px-4 py-2 min-w-96">
              <span className="text-slate-500 mr-2">🔍</span>
              <input
                type="text"
                placeholder="Kërko në AGI Platform..."
                className="bg-transparent outline-none flex-1 text-slate-700"
              />
              <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm ml-2 hover:bg-blue-700 transition-colors">
                Kërko
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-600">
              🧠 AGI Core | 📊 Analytics | AGI Active
            </div>
            <div className="text-sm font-mono bg-slate-100 px-3 py-1 rounded">
              {new Date().toLocaleTimeString('sq-AL')}
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`
                flex items-center space-x-2 px-4 py-3 cursor-pointer group min-w-max
                ${tab.isActive 
                  ? 'bg-slate-100 border-b-2 border-blue-500' 
                  : 'hover:bg-slate-50'
                }
              `}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="text-sm font-medium text-slate-700">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                  className="text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
          
          <button
            onClick={addNewTab}
            className="px-3 py-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded"
          >
            + New Tab
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2">
        <div className="flex items-center space-x-4 text-sm">
          <button className="text-slate-500 hover:text-slate-700">←</button>
          <button className="text-slate-500 hover:text-slate-700">→</button>
          <button className="text-slate-500 hover:text-slate-700">↻</button>
          <div className="flex items-center bg-white rounded px-3 py-1 flex-1 max-w-md">
            <span className="text-green-600 mr-2">🛡️</span>
            <span className="text-slate-700">{activeTab?.url || 'euroweb://dashboard'}</span>
            <span className="text-green-600 ml-auto text-xs">Secure</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab?.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
      >
        💬
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-40 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
              <h2 className="font-semibold">🤖 OpenMind Chat</h2>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-blue-200"
              >
                ×
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`
                      max-w-xs p-3 rounded-lg text-sm
                      ${message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-200 text-slate-800'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t border-slate-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Shkruani mesazhin tuaj..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  📤
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EuroWebMainPlatform;
