'use client';

import { useState, useEffect } from 'react';

interface BiologicalData {
  species: string;
  population: number;
  healthScore: number;
  environmentalImpact: number;
  prediction: string;
}

export default function AGIBioNatureDemo() {
  const [biologicalData, setBiologicalData] = useState<BiologicalData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Simulate biological data analysis
    const generateBioData = (): BiologicalData[] => [
      {
        species: 'European Wolf',
        population: 17000,
        healthScore: 85,
        environmentalImpact: 92,
        prediction: 'Population stable, expanding territory'
      },
      {
        species: 'Alpine Ibex',
        population: 45000,
        healthScore: 78,
        environmentalImpact: 76,
        prediction: 'Climate adaptation needed'
      },
      {
        species: 'Golden Eagle',
        population: 12000,
        healthScore: 82,
        environmentalImpact: 88,
        prediction: 'Hunting pressure declining'
      }
    ];

    setBiologicalData(generateBioData());
  }, []);

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-4">
            🌿 AGI BioNature Analysis
          </h1>
          <p className="text-lg text-green-600">
            AI-Powered Ecosystem Intelligence & Biodiversity Monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-4">🔬 Species Analysis</h3>
            <div className="space-y-4">
              {biologicalData.map((species, index) => (
                <div key={index} className="border-l-4 border-green-400 pl-4">
                  <h4 className="font-semibold text-gray-800">{species.species}</h4>
                  <p className="text-sm text-gray-600">Population: {species.population.toLocaleString()}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${species.healthScore}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{species.healthScore}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-200">
            <h3 className="text-xl font-semibold text-blue-800 mb-4">🌍 Environmental Impact</h3>
            <div className="space-y-4">
              {biologicalData.map((species, index) => (
                <div key={index} className="border-l-4 border-blue-400 pl-4">
                  <h4 className="font-semibold text-gray-800">{species.species}</h4>
                  <p className="text-sm text-gray-600">{species.prediction}</p>
                  <div className="flex items-center mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${species.environmentalImpact}%` }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm font-medium">{species.environmentalImpact}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg border border-purple-200">
            <h3 className="text-xl font-semibold text-purple-800 mb-4">🧠 AI Predictions</h3>
            <div className="space-y-4">
              <div className="text-center">
                <button 
                  onClick={runAnalysis}
                  disabled={isAnalyzing}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {isAnalyzing ? '🔄 Analyzing...' : '🚀 Run Deep Analysis'}
                </button>
              </div>
              
              {isAnalyzing && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-purple-600 mt-2">AGI analyzing ecosystem patterns...</p>
                </div>
              )}

              <div className="bg-purple-50 p-4 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">🎯 Key Insights</h4>
                <ul className="text-sm text-purple-700 space-y-2">
                  <li>• Wolf populations recovering in protected areas</li>
                  <li>• Climate change affecting Alpine species</li>
                  <li>• Ecosystem balance improving overall</li>
                  <li>• Biodiversity index: 87% healthy</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            🌿 Real-Time Ecosystem Dashboard
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">95%</div>
              <div className="text-sm text-gray-600">Forest Health</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">87%</div>
              <div className="text-sm text-gray-600">Water Quality</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">92%</div>
              <div className="text-sm text-gray-600">Air Purity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">78%</div>
              <div className="text-sm text-gray-600">Biodiversity</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}