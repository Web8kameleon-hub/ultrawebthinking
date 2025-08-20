import React from 'react';

interface AGIEcoProps {
  mode: 'monitoring' | 'analysis' | 'optimization';
  ecosystem: 'forest' | 'marine' | 'urban' | 'agricultural';
  dataSource: 'sensors' | 'satellite' | 'simulation';
}

export const AGIEco: React.FC<AGIEcoProps> = ({ mode, ecosystem, dataSource }) => {
  return (
    <div data-testid="agi-eco-container">
      <h1 data-testid="agi-eco-title">{"AGI × Ecological Intelligence"}</h1>
      <div data-testid="ecosystem-monitor">Ecosystem Monitor</div>
      <div data-testid="mode-display">Mode: {mode}</div>
      <div data-testid="ecosystem-display">Ecosystem: {ecosystem}</div>
      <div data-testid="datasource-display">Data Source: {dataSource}</div>
      <div data-testid="sustainability-metrics">
        <h3>Sustainability Metrics</h3>
        <div>Carbon Footprint: 85% reduction</div>
        <div>Biodiversity Index: 0.92</div>
        <div>Resource Efficiency: 78%</div>
      </div>
    </div>
  );
};
