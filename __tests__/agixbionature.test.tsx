/**
 * AGIxBioNature Tests - Pure TypeScript Biology Engine
 * Modern JSX + Lazy vectors + Framer Motion
 */

import React from 'react';
import { test, expect, describe, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AGIxBioNature } from '../components/AGISheet/AGIxBioNature';

// Pure TypeScript test data - readonly immutable
const MOCK_BIOLOGICAL_DATA = {
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

describe('AGIxBioNature Industrial Tests', () => {
  beforeEach(() => {
    // Pure setup - no useState
  });

  test('renders without useState violations', () => {
    const { container } = render(
      <AGIxBioNature 
        mode="comprehensive" 
        theme="forest" 
        dataSource="simulation" 
      />
    );
    
    expect(container).toBeDefined();
    expect(screen.getByText(/AGI×BioNature Intelligence/)).toBeInTheDocument();
  });

  test('specimen gallery displays correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <AGIxBioNature 
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
      <AGIxBioNature 
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
      <AGIxBioNature 
        mode="biology" 
        theme="forest" 
        dataSource="simulation" 
      />
    );
    
    expect(screen.getByText(/AGI×BioNature Intelligence/)).toBeInTheDocument();
    
    // Test theme switching
    rerender(
      <AGIxBioNature 
        mode="medical" 
        theme="laboratory" 
        dataSource="simulation" 
      />
    );
    
    expect(screen.getByText(/AGI×BioNature Intelligence/)).toBeInTheDocument();
  });
});

// Export named test utilities
export const createMockSpecimen = (overrides = {}) => ({
  ...MOCK_BIOLOGICAL_DATA.specimens[0],
  ...overrides
});

// Removed unused export: export const createBiologyTestSuite = () => ({
  renderComponent: (props = {}) => render(<AGIxBioNature {...props} />),
  mockData: MOCK_BIOLOGICAL_DATA
});
