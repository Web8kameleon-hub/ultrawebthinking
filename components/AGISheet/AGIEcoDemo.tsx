'use client';

import { useState, useEffect } from 'react';

interface EcoData {
  metric: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  impact: 'positive' | 'negative' | 'neutral';
}

export default function AGIEcoDemo() {
  const [ecoData, setEcoData] = useState<EcoData[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    // Simulate eco data monitoring
    const generateEcoData = (): EcoData[] => [
      {
        metric: 'Carbon Emissions',
        value: 2.3,
        unit: 'tons CO2/day',
        trend: 'down',
        impact: 'positive'
      },
      {
        metric: 'Energy Efficiency',
        value: 94.5,
        unit: '%',
        trend: 'up',
        impact: 'positive'
      },
      {
        metric: 'Waste Reduction',
        value: 78,
        unit: '%',
        trend: 'up',
        impact: 'positive'
      },
      {
        metric: 'Water Usage',
        value: 1200,
        unit: 'L/day',
        trend: 'down',
        impact: 'positive'
      },
      {
        metric: 'Renewable Energy',
        value: 87,
        unit: '%',
        trend: 'up',
        impact: 'positive'
      },
      {
        metric: 'Green Score',
        value: 92,
        unit: '/100',
        trend: 'up',
        impact: 'positive'
      }
    ];

    setEcoData(generateEcoData());
  }, []);

  const startMonitoring = () => {
    setIsMonitoring(true);
    setTimeout(() => {
      setIsMonitoring(false);
    }, 3000);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            🌱 AGI Eco Intelligence
          </h1>
          <p className="text-lg text-emerald-600">
            Advanced Environmental Monitoring & Sustainability Analytics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-emerald-200">
            <h3 className="text-xl font-semibold text-emerald-800 mb-6">🌍 Environmental Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ecoData.map((data, index) => (
                <div key={index} className="bg-emerald-50 p-4 rounded-lg border border-emerald-100">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm">{data.metric}</h4>
                    <span className="text-lg">{getTrendIcon(data.trend)}</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <span className={`text-2xl font-bold ${getImpactColor(data.impact)}`}>
                        {data.value}
                      </span>
                      <span className="text-sm text-gray-600 ml-1">{data.unit}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-6">🔋 Smart Grid Integration</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">⚡ Energy Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Solar</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{width: '65%'}}></div>
                      </div>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Wind</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{width: '22%'}}></div>
                      </div>
                      <span className="text-sm font-medium">22%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">Grid</span>
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                        <div className="bg-gray-500 h-2 rounded-full" style={{width: '13%'}}></div>
                      </div>
                      <span className="text-sm font-medium">13%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">💡 Smart Optimization</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Auto-dimming when natural light sufficient</li>
                  <li>• HVAC optimization based on occupancy</li>
                  <li>• Peak demand load balancing</li>
                  <li>• Predictive maintenance scheduling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">🧠 AI Insights</h3>
            <div className="text-center mb-4">
              <button 
                onClick={startMonitoring}
                disabled={isMonitoring}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                {isMonitoring ? '🔄 Monitoring...' : '🚀 Deep Analysis'}
              </button>
            </div>
            
            {isMonitoring && (
              <div className="text-center mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                <p className="text-purple-600 mt-2">AGI analyzing patterns...</p>
              </div>
            )}

            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">🎯 Recommendations</h4>
              <ul className="text-sm text-purple-700 space-y-2">
                <li>• Increase solar panel tilt by 5°</li>
                <li>• Schedule maintenance for wind turbine #3</li>
                <li>• Optimize heating schedule for Zone A</li>
                <li>• Consider battery upgrade next quarter</li>
              </ul>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-orange-200">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">📊 Impact Metrics</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">€12,450</div>
                <div className="text-sm text-gray-600">Monthly Savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-1">2.1t</div>
                <div className="text-sm text-gray-600">CO₂ Reduced</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">94%</div>
                <div className="text-sm text-gray-600">Efficiency Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-teal-200">
            <h3 className="text-xl font-semibold text-teal-800 mb-4">🌿 Sustainability Index</h3>
            <div className="text-center mb-4">
              <div className="relative w-32 h-32 mx-auto">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#10b981"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${92 * 3.52} 352`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">92%</span>
                </div>
              </div>
              <p className="text-teal-700 font-semibold">Excellent</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Energy Efficiency</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Waste Management</span>
                <span className="font-medium">89%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Carbon Footprint</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🌍 Global Environmental Impact
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌱</div>
              <div className="text-2xl font-bold text-green-600">1,250</div>
              <div className="text-sm text-gray-600">Trees Equivalent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">💧</div>
              <div className="text-2xl font-bold text-blue-600">45,000L</div>
              <div className="text-sm text-gray-600">Water Saved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl font-bold text-yellow-600">2.8MWh</div>
              <div className="text-sm text-gray-600">Clean Energy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">♻️</div>
              <div className="text-2xl font-bold text-purple-600">89%</div>
              <div className="text-sm text-gray-600">Waste Recycled</div>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-bold text-orange-600">A+</div>
              <div className="text-sm text-gray-600">ESG Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
