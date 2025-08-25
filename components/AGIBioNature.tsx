import React from 'react';

interface AGIBioNatureProps {
  mode: 'comprehensive' | 'biology' | 'medical';
  theme: 'forest' | 'laboratory' | 'ecosystem';
  dataSource: 'simulation' | 'live';
}

export const AGIBioNature: React.FC<AGIBioNatureProps> = ({ mode, theme, dataSource }) => {
  return (
    <div data-testid="agi-bionature-container">
      <h1 data-testid="agi-title">{"AGI × BioNature Intelligence"}</h1>
      <div data-testid="specimen-gallery">Specimen Gallery</div>
      <div data-testid="mode-display">Mode: {mode}</div>
      <div data-testid="theme-display">Theme: {theme}</div>
      <div data-testid="datasource-display">Data Source: {dataSource}</div>
    </div>
  );
};
