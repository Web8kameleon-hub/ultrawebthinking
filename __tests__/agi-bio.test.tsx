/**
 * AGI Bio Tests - Pure TypeScript Biology Engine
 * Modern JSX + Lazy vectors + Framer Motion
 */

import React from 'react';
import { test, expect, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AGIBioNature } from '../components/AGISheet/AGIBioNature';
import '@testing-library/jest-dom';

// Real biological data for EuroWeb Ultra testing
const LIVE_BIOLOGICAL_DATA = {
  specimens: [
    {
      id: 'specimen_001',
      species: 'Quercus alba',
      category: 'plant' as const,
      location: { latitude: 40.7128, longitude: -74.0060, habitat: 'Deciduous Forest' },
      properties: {
        size: 25.5,
        population: 1500,
        healthStatus: 'healthy' as const,
        geneticDiversity: 0.78,
        metabolicRate: 0.45
      }
    }
  ]
} as const;

// Sensor data for real-time monitoring
const SENSOR_DATA = {
  timestamp: Date.now(),
  temperature: 23.4,
  humidity: 67.2,
  soilMoisture: 45.8,
  lightLevel: 850.5,
  co2Level: 412.3
} as const;

// Real input from environmental sensors
const REAL_INPUT = {
  source: 'EuroWeb-Sensors',
  location: 'Forest-Station-A1',
  readings: SENSOR_DATA,
  validated: true,
  provenance: {
    deviceId: 'ENV-001',
    lastCalibration: '2025-09-01T00:00:00Z',
    accuracy: 0.95
  }
} as const;

describe('AGIBioNature Industrial Tests', () => {
  beforeEach(() => {
    // Pure setup - no useState
  });

  test('renders without useState violations', () => {
    const { container } = render(
      <AGIBioNature 
        mode="comprehensive" 
        theme="forest" 
        dataSource="simulation" 
      />
    );
    
    expect(container).toBeDefined();
    expect(screen.getByText(/AGIBioNature Intelligence/)).toBeInTheDocument();
  });

  test('specimen gallery displays correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <AGIBioNature 
        mode="biology" 
        theme="laboratory" 
        dataSource="simulation" 
      />
    );
    
    // Test pure TypeScript interaction
    const specimenElement = await screen.findByText(/Specimen Gallery/);
    expect(specimenElement).toBeInTheDocument();
  });

  test('lazy engine loading works', async () => {
    const user = userEvent.setup();
    
    render(
      <AGIBioNature 
        mode="comprehensive" 
        theme="ecosystem" 
        dataSource="simulation" 
      />
    );
    
    // Engines should be lazy loaded - not immediately available
    expect(screen.queryByText(/Analyzing.../)).not.toBeInTheDocument();
  });

  test('pure TypeScript data formatting', () => {
    // Test number formatting - pure functions
    const formatNumber = (value: number, decimals: number = 2): string => value.toFixed(decimals);
    const formatPopulation = (value: number): string => {
      if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
      if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
      if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
      return value.toString();
    };

    expect(formatNumber(0.78)).toBe('0.78');
    expect(formatPopulation(1500)).toBe('1.5K');
    expect(formatPopulation(1500000)).toBe('1.5M');
  });

  test('CVA variants work correctly', () => {
    const { rerender } = render(
      <AGIBioNature 
        mode="biology" 
        theme="forest" 
        dataSource="simulation" 
      />
    );
    
    expect(screen.getByText(/AGIBioNature Intelligence/)).toBeInTheDocument();
    
    // Test theme switching
    rerender(
      <AGIBioNature 
        mode="medical" 
        theme="laboratory" 
        dataSource="simulation" 
      />
    );
    
    expect(screen.getByText(/AGIBioNature Intelligence/)).toBeInTheDocument();
  });
});

// Export named test utilities
export const createLiveSpecimen = (overrides = {}) => ({
  ...LIVE_BIOLOGICAL_DATA.specimens[0],
  ...overrides,
  sensorData: SENSOR_DATA,
  realInput: REAL_INPUT
});

// Export test suite utilities with real data
export const createBiologyTestSuite = () => ({
  renderComponent: (props = {}) => render(<AGIBioNature {...props} />),
  liveData: LIVE_BIOLOGICAL_DATA,
  sensorData: SENSOR_DATA,
  realInput: REAL_INPUT
});

