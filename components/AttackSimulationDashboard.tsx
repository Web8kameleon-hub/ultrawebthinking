'use client';

/**
 * Web8 Attack Simulation Dashboard
 * Interface për kontrollimin dhe monitorimin e simulimeve të sulmeve
 * 
 * @author Ledjan Ahmati
 * @version 8.2.0-ATTACK-SIM
 * @contact dealsjona@gmail.com
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Web8AttackSimulator, 
  SimulationConfig, 
  SimulationReport, 
  AttackVector,
  QuickTestConfig,
  ComprehensiveTestConfig,
  ExtremeTestConfig
} from '../security/attack-simulator';

interface AttackSimulationDashboardProps {
  className?: string;
}

export default function AttackSimulationDashboard({ className = '' }: AttackSimulationDashboardProps) {
  const [simulator] = useState(() => new Web8AttackSimulator());
  const [isRunning, setIsRunning] = useState(false);
  const [currentReport, setCurrentReport] = useState<SimulationReport | null>(null);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [config, setConfig] = useState<SimulationConfig>(QuickTestConfig);
  const [availableVectors, setAvailableVectors] = useState<AttackVector[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAvailableVectors(simulator.getAvailableVectors());
  }, [simulator]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const startSimulation = async () => {
    if (isRunning) return;

    setIsRunning(true);
    setProgress(0);
    setLogs([]);
    setCurrentReport(null);

    addLog('🚀 Starting Web8 Attack Simulation...');
    addLog(`🎯 Target: ${config.targetUrl}`);
    addLog(`💥 Intensity: ${config.intensity}`);
    addLog(`⏱️ Duration: ${config.duration}s`);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (config.duration * 10));
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);

    try {
      const report = await simulator.runSimulation(config);
      setCurrentReport(report);
      addLog(`✅ Simulation completed successfully`);
      addLog(`🛡️ Security Score: ${report.summary.securityScore}%`);
      addLog(`🎯 Total Attacks: ${report.totalAttacks}`);
      addLog(`✅ Successfully Blocked: ${report.successfulBlocks}`);
      addLog(`❌ Failed to Block: ${report.failedBlocks}`);
      
      if (report.summary.vulnerabilities.length > 0) {
        addLog(`🚨 ${report.summary.vulnerabilities.length} vulnerabilities detected`);
      }
    } catch (error) {
      addLog(`❌ Simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setIsRunning(false);
    }
  };

  const stopSimulation = () => {
    simulator.stopSimulation();
    setIsRunning(false);
    addLog('🛑 Simulation stopped by user');
  };

  const loadPresetConfig = (preset: 'quick' | 'comprehensive' | 'extreme') => {
    switch (preset) {
      case 'quick':
        setConfig(QuickTestConfig);
        break;
      case 'comprehensive':
        setConfig(ComprehensiveTestConfig);
        break;
      case 'extreme':
        setConfig(ExtremeTestConfig);
        break;
    }
    addLog(`📋 Loaded ${preset} test configuration`);
  };

  const updateConfig = (updates: Partial<SimulationConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getSecurityScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  const getVectorTypeIcon = (type: AttackVector['type']) => {
    const icons = {
      SQL_INJECTION: '💉',
      XSS: '🕷️',
      DDOS: '💥',
      BRUTE_FORCE: '🔨',
      PATH_TRAVERSAL: '📂',
      CSRF: '🔄',
      SCANNER: '🔍',
      BOT_ATTACK: '🤖'
    };
    return icons[type] || '⚠️';
  };

  const getSeverityColor = (severity: AttackVector['severity']) => {
    const colors = {
      LOW: 'text-blue-600 bg-blue-50',
      MEDIUM: 'text-yellow-600 bg-yellow-50',
      HIGH: 'text-orange-600 bg-orange-50',
      CRITICAL: 'text-red-600 bg-red-50'
    };
    return colors[severity];
  };

  return (
    <div className={`p-6 space-y-6 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 min-h-screen ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-purple-600 bg-clip-text text-transparent mb-2">
          🚨 Web8 Attack Simulator
        </h1>
        <p className="text-gray-600 text-lg">
          Simulimi dhe testimi i sigurisë së platformës
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            ⚙️ Konfigurimi
          </h2>
          
          {/* Preset Configurations */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfigurimi i paracaktuar:
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => loadPresetConfig('quick')}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
              >
                🚀 I shpejtë
              </button>
              <button
                onClick={() => loadPresetConfig('comprehensive')}
                className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 transition-colors"
              >
                🔍 I plotë
              </button>
              <button
                onClick={() => loadPresetConfig('extreme')}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                disabled={!config.safeguards}
              >
                ⚡ Ekstrem
              </button>
            </div>
          </div>

          {/* Manual Configuration */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target URL:
              </label>
              <input
                type="text"
                value={config.targetUrl}
                onChange={(e) => updateConfig({ targetUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="http://localhost:3000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intensiteti:
              </label>
              <select
                value={config.intensity}
                onChange={(e) => updateConfig({ intensity: e.target.value as SimulationConfig['intensity'] })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="LOW">I ulët</option>
                <option value="MEDIUM">I mesëm</option>
                <option value="HIGH">I lartë</option>
                <option value="EXTREME">Ekstrem</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kohëzgjatja (sekonda):
              </label>
              <input
                type="number"
                value={config.duration}
                onChange={(e) => updateConfig({ duration: parseInt(e.target.value) || 30 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min="10"
                max="600"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.concurrent}
                  onChange={(e) => updateConfig({ concurrent: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Paralel</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.safeguards}
                  onChange={(e) => updateConfig({ safeguards: e.target.checked })}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Mbrojtje shtesë</span>
              </label>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            🎮 Kontrolli
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={startSimulation}
                disabled={isRunning}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isRunning ? '🔄 Duke ekzekutuar...' : '🚀 Nis simulimin'}
              </button>
              
              {isRunning && (
                <button
                  onClick={stopSimulation}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  🛑 Ndalo
                </button>
              )}
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progresi:</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {currentReport && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-medium text-gray-800">📊 Rezultatet e fundit:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Security Score:</span>
                    <div className={`font-bold text-lg ${getSecurityScoreColor(currentReport.summary.securityScore)}`}>
                      {currentReport.summary.securityScore}%
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Sulme të testuara:</span>
                    <div className="font-bold text-lg text-blue-600">
                      {currentReport.totalAttacks}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Të bllokaura:</span>
                    <div className="font-bold text-lg text-green-600">
                      {currentReport.successfulBlocks}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-600">Të dështuara:</span>
                    <div className="font-bold text-lg text-red-600">
                      {currentReport.failedBlocks}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Attack Vectors Overview */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          🎯 Vektorët e sulmeve
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {availableVectors.map((vector, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{getVectorTypeIcon(vector.type)}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getSeverityColor(vector.severity)}`}>
                  {vector.severity}
                </span>
              </div>
              <h3 className="font-medium text-gray-800 text-sm mb-1">{vector.name}</h3>
              <p className="text-xs text-gray-600">{vector.description}</p>
              <div className="text-xs text-gray-500 mt-2">
                {vector.method} {vector.target}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Logs */}
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center">
            📋 Logs
          </h2>
          <button
            onClick={clearLogs}
            className="px-3 py-1 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            🗑️ Pastro
          </button>
        </div>
        
        <div 
          ref={logContainerRef}
          className="h-64 overflow-y-auto p-4 bg-gray-900 text-green-400 font-mono text-sm"
        >
          {logs.length === 0 ? (
            <div className="text-gray-500 italic">No logs yet...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detailed Report */}
      {currentReport && (
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            📊 Raporti i detajuar
          </h2>
          
          {/* Vulnerabilities */}
          {currentReport.summary.vulnerabilities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-red-600 mb-3">🚨 Dobësitë e identifikuara:</h3>
              <ul className="space-y-2">
                {currentReport.summary.vulnerabilities.map((vuln, index) => (
                  <li key={index} className="flex items-center text-red-700 bg-red-50 p-2 rounded">
                    <span className="mr-2">❗</span>
                    {vuln}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-blue-600 mb-3">💡 Rekomandimet:</h3>
            <ul className="space-y-2">
              {currentReport.summary.recommendations.map((rec, index) => (
                <li key={index} className="flex items-center text-blue-700 bg-blue-50 p-2 rounded">
                  <span className="mr-2">💡</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Detailed Results */}
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-3">📋 Rezultatet e detajuara:</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Sulmi</th>
                    <th className="px-4 py-2 text-left">Tipi</th>
                    <th className="px-4 py-2 text-left">Statusi</th>
                    <th className="px-4 py-2 text-left">Koha (ms)</th>
                    <th className="px-4 py-2 text-left">Status Code</th>
                  </tr>
                </thead>
                <tbody>
                  {currentReport.results.map((result, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="px-4 py-2">{result.attackVector.name}</td>
                      <td className="px-4 py-2">
                        {getVectorTypeIcon(result.attackVector.type)} {result.attackVector.type}
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          result.blocked 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {result.blocked ? '🛡️ BLOCKED' : '⚠️ ALLOWED'}
                        </span>
                      </td>
                      <td className="px-4 py-2">{result.responseTime}</td>
                      <td className="px-4 py-2">{result.statusCode || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
