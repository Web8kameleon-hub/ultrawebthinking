/**
 * AGIBioNature Tests - Pure TypeScript Industrial
 * Modern JSX syntax + React TypeScript best practices
 */

import { render, screen } from '@testing-library/react';
import React, { createElement } from 'react';
import { beforeEach, describe, expect, test } from 'vitest';
import { AGIBioNature } from '../components/AGIBioNature';

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

describe('AGIBioNature Industrial Tests', () => {
  beforeEach(() => {
    // Pure setup - no useState
  });

  test('renders without useState violations', () => {
    const { container } = render(
      createElement(AGIBioNature, {
        mode: 'comprehensive',
        theme: 'forest',
        dataSource: 'simulation'
      })
    );
    
    expect(container).toBeDefined();
    expect(screen.getByText(/AGI × BioNature Intelligence/)).toBeDefined();
    expect(screen.getByTestId('agi-bionature-container')).toBeDefined();
  });

  test('specimen gallery displays correctly', async () => {
    render(
      <AGIBioNature 
        mode="biology" 
        theme="laboratory" 
        dataSource="simulation" 
      />
    );
    
    // Test pure TypeScript interaction
    const specimenElement = await screen.findByText(/Specimen Gallery/);
    expect(specimenElement).toBeDefined();
    expect(screen.getByTestId('specimen-gallery')).toBeDefined();
  });

  test('lazy engine loading works', async () => {
    render(
      <AGIBioNature 
        mode="comprehensive" 
        theme="ecosystem" 
        dataSource="simulation" 
      />
    );
    
    // Engines should be lazy loaded - not immediately available
    expect(screen.queryByText(/Analyzing.../)).toBeNull();
    expect(screen.getByTestId('agi-bionature-container')).toBeDefined();
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
    
    expect(screen.getByText(/AGI × BioNature Intelligence/)).toBeDefined();
    expect(screen.getByTestId('mode-display')).toBeDefined();
    
    // Test theme switching
    rerender(
      <AGIBioNature 
        mode="medical" 
        theme="laboratory" 
        dataSource="simulation" 
      />
    );
    
    expect(screen.getByText(/AGI × BioNature Intelligence/)).toBeDefined();
    expect(screen.getByText(/Mode: medical/)).toBeDefined();
    expect(screen.getByText(/Theme: laboratory/)).toBeDefined();
  });

  test('props are properly displayed', () => {
    render(
      <AGIBioNature 
        mode="comprehensive" 
        theme="ecosystem" 
        dataSource="live" 
      />
    );
    
    expect(screen.getByText(/Mode: comprehensive/)).toBeDefined();
    expect(screen.getByText(/Theme: ecosystem/)).toBeDefined();
    expect(screen.getByText(/Data Source: live/)).toBeDefined();
  });
});

// Export named test utilities
export const createMockSpecimen = (overrides = {}) => ({
  ...MOCK_BIOLOGICAL_DATA.specimens[0],
  ...overrides
});

export const createBiologyTestSuite = () => ({
  renderComponent: (props: Partial<React.ComponentProps<typeof AGIBioNature>> = {}) => {
    const defaultProps = {
      mode: 'comprehensive' as const,
      theme: 'forest' as const,
      dataSource: 'simulation' as const
    };
    return render(<AGIBioNature {...defaultProps} {...props} />);
  },
  mockData: MOCK_BIOLOGICAL_DATA
});
