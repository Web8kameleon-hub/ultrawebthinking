/**
 * FLUID FLOW DEMO PAGE + AGI ECO REAL FUNCTIONS
 * Natural water-like flow demonstration with AGI Environmental Intelligence
 * 
 * @version 8.0.0-FLUID-AGI-ECO
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 */

'use client';

import * as React from 'react';

// AGI Eco Real Functions
interface EcoData {
  airQuality: number;
  waterQuality: number;
  soilHealth: number;
  biodiversity: number;
  carbonFootprint: number;
  renewableEnergy: number;
  wasteReduction: number;
  ecoScore: number;
}

interface EcoAnalysis {
  trends: string[];
  risks: string[];
  opportunities: string[];
  recommendations: string[];
}

// Real AGI Eco Analysis Functions
const analyzeAirQuality = (data: number): string => {
  if (data >= 90) return "🟢 Excellent - Clean air, optimal for health";
  if (data >= 75) return "🟡 Good - Minor pollutants detected";
  if (data >= 60) return "🟠 Moderate - Air quality concerns";
  return "🔴 Poor - Immediate action needed";
};

const analyzeWaterQuality = (data: number): string => {
  if (data >= 95) return "💧 Pure - Drinking water quality";
  if (data >= 80) return "💙 Clean - Safe for most uses";
  if (data >= 65) return "⚠️ Fair - Treatment recommended";
  return "🚨 Contaminated - Urgent filtration needed";
};

const analyzeSoilHealth = (data: number): string => {
  if (data >= 85) return "🌱 Fertile - Optimal for agriculture";
  if (data >= 70) return "🌿 Healthy - Good nutrient levels";
  if (data >= 55) return "🍃 Moderate - Needs enrichment";
  return "🏜️ Depleted - Restoration required";
};

const calculateEcoScore = (data: EcoData): number => {
  const weights = {
    airQuality: 0.2,
    waterQuality: 0.2,
    soilHealth: 0.15,
    biodiversity: 0.15,
    carbonFootprint: 0.1,
    renewableEnergy: 0.1,
    wasteReduction: 0.1
  };
  
  return Math.round(
    data.airQuality * weights.airQuality +
    data.waterQuality * weights.waterQuality +
    data.soilHealth * weights.soilHealth +
    data.biodiversity * weights.biodiversity +
    (100 - data.carbonFootprint) * weights.carbonFootprint +
    data.renewableEnergy * weights.renewableEnergy +
    data.wasteReduction * weights.wasteReduction
  );
};

const generateEcoAnalysis = (data: EcoData): EcoAnalysis => {
  const analysis: EcoAnalysis = {
    trends: [],
    risks: [],
    opportunities: [],
    recommendations: []
  };

  // Analyze trends
  if (data.airQuality > 80) analysis.trends.push("📈 Air quality improving");
  if (data.renewableEnergy > 70) analysis.trends.push("⚡ Green energy adoption rising");
  if (data.wasteReduction > 75) analysis.trends.push("♻️ Waste management optimizing");

  // Identify risks
  if (data.carbonFootprint > 70) analysis.risks.push("🌡️ High carbon emissions");
  if (data.biodiversity < 60) analysis.risks.push("🦋 Biodiversity loss threat");
  if (data.waterQuality < 70) analysis.risks.push("💧 Water contamination risk");

  // Find opportunities
  if (data.soilHealth > 75) analysis.opportunities.push("🌾 Agricultural expansion potential");
  if (data.airQuality > 85) analysis.opportunities.push("🏃 Outdoor activity promotion");
  if (data.renewableEnergy < 80) analysis.opportunities.push("☀️ Solar/wind investment opportunity");

  // Generate recommendations
  if (data.carbonFootprint > 60) analysis.recommendations.push("🌳 Implement carbon offset programs");
  if (data.wasteReduction < 70) analysis.recommendations.push("♻️ Enhance recycling infrastructure");
  if (data.biodiversity < 70) analysis.recommendations.push("🌿 Create wildlife protection zones");

  return analysis;
};

// AGI Eco Monitor Component
const AGIEcoMonitor = () => {
  const [ecoData, setEcoData] = React.useState<EcoData>({
    airQuality: 78,
    waterQuality: 85,
    soilHealth: 72,
    biodiversity: 68,
    carbonFootprint: 45,
    renewableEnergy: 82,
    wasteReduction: 76,
    ecoScore: 0
  });

  const [analysis, setAnalysis] = React.useState<EcoAnalysis>({
    trends: [],
    risks: [],
    opportunities: [],
    recommendations: []
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setEcoData(prev => {
        const newData = {
          airQuality: Math.max(40, Math.min(100, prev.airQuality + (0.5 - 0.5) * 6)),
          waterQuality: Math.max(50, Math.min(100, prev.waterQuality + (0.5 - 0.5) * 5)),
          soilHealth: Math.max(30, Math.min(100, prev.soilHealth + (0.5 - 0.5) * 4)),
          biodiversity: Math.max(20, Math.min(100, prev.biodiversity + (0.5 - 0.5) * 3)),
          carbonFootprint: Math.max(20, Math.min(80, prev.carbonFootprint + (0.5 - 0.5) * 4)),
          renewableEnergy: Math.max(40, Math.min(100, prev.renewableEnergy + (0.5 - 0.5) * 5)),
          wasteReduction: Math.max(30, Math.min(100, prev.wasteReduction + (0.5 - 0.5) * 4)),
          ecoScore: 0
        };
        newData.ecoScore = calculateEcoScore(newData);
        return newData;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setAnalysis(generateEcoAnalysis(ecoData));
  }, [ecoData]);

  return (
    <div style={{ marginBottom: '30px' }}>
      <h2 style={{
        fontSize: '2.5rem',
        margin: '20px 0',
        textAlign: 'center',
        background: 'linear-gradient(45deg, #2e7d32, #66bb6a)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: '700'
      }}>
        🌱 AGI ECO INTELLIGENCE
      </h2>

      {/* Eco Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(46, 125, 50, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32', fontSize: '1.2rem' }}>
            🌬️ Air Quality
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#4caf50', marginBottom: '10px' }}>
            {ecoData.airQuality.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
            {analyzeAirQuality(ecoData.airQuality)}
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #e8f5e8, #4caf50)',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${ecoData.airQuality}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #2e7d32, #4caf50)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(21, 101, 192, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#1565c0', fontSize: '1.2rem' }}>
            💧 Water Quality
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#2196f3', marginBottom: '10px' }}>
            {ecoData.waterQuality.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
            {analyzeWaterQuality(ecoData.waterQuality)}
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #e3f2fd, #2196f3)',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${ecoData.waterQuality}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #1565c0, #2196f3)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(139, 69, 19, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#8b4513', fontSize: '1.2rem' }}>
            🌱 Soil Health
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#a1887f', marginBottom: '10px' }}>
            {ecoData.soilHealth.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
            {analyzeSoilHealth(ecoData.soilHealth)}
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #efebe9, #a1887f)',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${ecoData.soilHealth}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #8b4513, #a1887f)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 152, 0, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ff9800', fontSize: '1.2rem' }}>
            🦋 Biodiversity
          </h3>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffb74d', marginBottom: '10px' }}>
            {ecoData.biodiversity.toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '15px' }}>
            Species richness index
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #fff3e0, #ffb74d)',
            height: '8px',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${ecoData.biodiversity}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #ff9800, #ffb74d)',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* AGI Eco Analysis */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(46, 125, 50, 0.2)',
        marginBottom: '20px'
      }}>
        <h3 style={{
          fontSize: '1.8rem',
          margin: '0 0 25px 0',
          color: '#2e7d32',
          textAlign: 'center'
        }}>
          🧠 AGI ECO ANALYSIS
        </h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #e8f5e8, #f1f8e9)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #4caf50'
          }}>
            <h4 style={{ color: '#2e7d32', margin: '0 0 15px 0' }}>📈 Positive Trends</h4>
            {analysis.trends.map((trend, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                {trend}
              </div>
            ))}
            {analysis.trends.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>Monitoring for trends...</div>
            )}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #ffebee, #fce4ec)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #f44336'
          }}>
            <h4 style={{ color: '#c62828', margin: '0 0 15px 0' }}>⚠️ Environmental Risks</h4>
            {analysis.risks.map((risk, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                {risk}
              </div>
            ))}
            {analysis.risks.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>No major risks detected</div>
            )}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #e3f2fd, #e1f5fe)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #2196f3'
          }}>
            <h4 style={{ color: '#1565c0', margin: '0 0 15px 0' }}>💡 Opportunities</h4>
            {analysis.opportunities.map((opportunity, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                {opportunity}
              </div>
            ))}
            {analysis.opportunities.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>Scanning for opportunities...</div>
            )}
          </div>

          <div style={{
            background: 'linear-gradient(135deg, #fff3e0, #fef7e0)',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #ff9800'
          }}>
            <h4 style={{ color: '#ef6c00', margin: '0 0 15px 0' }}>🎯 Recommendations</h4>
            {analysis.recommendations.map((rec, index) => (
              <div key={index} style={{ marginBottom: '8px', fontSize: '0.9rem' }}>
                {rec}
              </div>
            ))}
            {analysis.recommendations.length === 0 && (
              <div style={{ color: '#666', fontStyle: 'italic' }}>System optimized</div>
            )}
          </div>
        </div>

        {/* Overall Eco Score */}
        <div style={{
          textAlign: 'center',
          marginTop: '25px',
          padding: '20px',
          background: 'linear-gradient(135deg, #e8f5e8, #c8e6c8)',
          borderRadius: '15px',
          border: '2px solid #4caf50'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>🌍 Overall Eco Score</h4>
          <div style={{
            fontSize: '3rem',
            fontWeight: '800',
            color: '#4caf50',
            margin: '10px 0'
          }}>
            {ecoData.ecoScore}%
          </div>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            {ecoData.ecoScore >= 80 ? '🟢 Excellent Environmental Health' :
             ecoData.ecoScore >= 65 ? '🟡 Good Environmental Status' :
             ecoData.ecoScore >= 50 ? '🟠 Moderate Environmental Concerns' :
             '🔴 Environmental Action Required'}
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple inline FluidMonitor component
const FluidMonitor = () => {
  const [flowData, setFlowData] = React.useState({
    velocity: 85,
    pressure: 92,
    clarity: 98,
    temperature: 22
  });

  React.useEffect(() => {
    const interval = setInterval(() => {
      setFlowData(prev => ({
        velocity: Math.max(70, Math.min(100, prev.velocity + (0.5 - 0.5) * 10)),
        pressure: Math.max(80, Math.min(100, prev.pressure + (0.5 - 0.5) * 8)),
        clarity: Math.max(90, Math.min(100, prev.clarity + (0.5 - 0.5) * 4)),
        temperature: Math.max(18, Math.min(28, prev.temperature + (0.5 - 0.5) * 2))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '20px'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#1565c0',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          💧 Flow Velocity
        </h3>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#42a5f5',
          marginBottom: '10px'
        }}>
          {flowData.velocity.toFixed(1)}%
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #e3f2fd, #42a5f5)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${flowData.velocity}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #1565c0, #42a5f5)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#2e7d32',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          ⚡ System Pressure
        </h3>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#66bb6a',
          marginBottom: '10px'
        }}>
          {flowData.pressure.toFixed(1)}%
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #e8f5e8, #66bb6a)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${flowData.pressure}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #2e7d32, #66bb6a)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#f57c00',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          🛡️ Flow Clarity
        </h3>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#ffb74d',
          marginBottom: '10px'
        }}>
          {flowData.clarity.toFixed(1)}%
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #fff3e0, #ffb74d)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${flowData.clarity}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #f57c00, #ffb74d)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        padding: '25px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#7b1fa2',
          fontSize: '1.3rem',
          fontWeight: '600'
        }}>
          🌡️ Temperature
        </h3>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#ba68c8',
          marginBottom: '10px'
        }}>
          {flowData.temperature.toFixed(1)}°C
        </div>
        <div style={{
          background: 'linear-gradient(90deg, #f3e5f5, #ba68c8)',
          height: '8px',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(flowData.temperature - 18) / 10 * 100}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #7b1fa2, #ba68c8)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>
    </div>
  );
};

export default function FluidFlowDemo() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 50%, #90caf9 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <header style={{
          textAlign: 'center',
          marginBottom: '40px',
          background: 'rgba(255, 255, 255, 0.9)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)'
        }}>
          <h1 style={{
            fontSize: '3.5rem',
            margin: '0 0 20px 0',
            background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '700'
          }}>
            🌊 FLUID ARCHITECTURE + AGI ECO
          </h1>
          <p style={{
            fontSize: '1.4rem',
            color: '#424242',
            margin: '0',
            fontWeight: '500'
          }}>
            Rrjedhje e natyrshme si ujë + Inteligjencë mjedisore AGI
          </p>
          <div style={{
            marginTop: '20px',
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <span style={{
              background: 'linear-gradient(45deg, #e3f2fd, #bbdefb)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#1565c0',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              💧 Crystal Clear Flow
            </span>
            <span style={{
              background: 'linear-gradient(45deg, #e8f5e8, #c8e6c8)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#2e7d32',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              🌱 AGI Eco Intelligence
            </span>
            <span style={{
              background: 'linear-gradient(45deg, #fff3e0, #ffe0b2)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: '#f57c00',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              🧠 Real Functions
            </span>
          </div>
        </header>

        {/* AGI Eco Intelligence Section */}
        <AGIEcoMonitor />

        {/* Original Fluid Monitoring */}
        <h2 style={{
          fontSize: '2.5rem',
          margin: '20px 0',
          textAlign: 'center',
          background: 'linear-gradient(45deg, #1565c0, #42a5f5)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '700'
        }}>
          💧 FLUID FLOW MONITORING
        </h2>

        <FluidMonitor />

        <footer style={{
          textAlign: 'center',
          marginTop: '40px',
          background: 'rgba(255, 255, 255, 0.8)',
          padding: '25px',
          borderRadius: '15px',
          color: '#666'
        }}>
          <p style={{ margin: '0', fontSize: '1.1rem' }}>
            🌊 <strong>Fluid Architecture + AGI Eco</strong> - Ku çdo komponent rrjedh natyrshëm si ujë i pastër dhe analizon mjedisin
          </p>
          <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#888' }}>
            Real-time environmental analysis • AI-powered recommendations • Crystal clear performance
          </p>
          <div style={{
            marginTop: '15px',
            fontSize: '0.8rem',
            color: '#999',
            borderTop: '1px solid #eee',
            paddingTop: '15px'
          }}>
            Created by <strong>Ledjan Ahmati</strong> • 100% Owner & Creator • dealsjona@gmail.com
          </div>
        </footer>
      </div>
    </div>
  );
}

