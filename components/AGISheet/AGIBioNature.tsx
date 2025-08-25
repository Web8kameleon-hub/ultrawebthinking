/**
 * AGIBioNature.tsx - Pure TypeScript Biology Engine
 * Real modular AGI biology component without x
 * © Web8 UltraThinking – Ledjan Ahmati
 */

import React, { memo, useMemo } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// TypeScript interfaces for biology data
interface Specimen {
  id: string;
  species: string;
  category: 'plant' | 'animal' | 'microorganism' | 'fungi';
  location: {
    latitude: number;
    longitude: number;
    habitat: string;
  };
  properties: {
    size: number;
    population: number;
    healthStatus: 'healthy' | 'endangered' | 'critical' | 'extinct';
    geneticDiversity: number;
    metabolicRate: number;
  };
}

interface BiologyData {
  specimens: readonly Specimen[];
}

// CVA variants for theming
const bioNatureVariants = cva(
  "relative w-full min-h-screen bg-gradient-to-br transition-all duration-300",
  {
    variants: {
      theme: {
        forest: "from-green-50 to-emerald-100 text-green-900",
        laboratory: "from-slate-50 to-blue-100 text-slate-900", 
        ecosystem: "from-amber-50 to-orange-100 text-amber-900",
        medical: "from-red-50 to-pink-100 text-red-900"
      },
      mode: {
        biology: "p-6",
        comprehensive: "p-8",
        medical: "p-4"
      }
    },
    defaultVariants: {
      theme: "forest",
      mode: "biology"
    }
  }
);

const headerVariants = cva(
  "text-center mb-8 font-bold tracking-wide",
  {
    variants: {
      theme: {
        forest: "text-green-800",
        laboratory: "text-blue-800",
        ecosystem: "text-amber-800", 
        medical: "text-red-800"
      },
      mode: {
        biology: "text-3xl",
        comprehensive: "text-4xl",
        medical: "text-2xl"
      }
    }
  }
);

const cardVariants = cva(
  "rounded-lg shadow-lg p-6 backdrop-blur-sm border transition-all duration-200",
  {
    variants: {
      theme: {
        forest: "bg-green-50/80 border-green-200 hover:bg-green-100/80",
        laboratory: "bg-blue-50/80 border-blue-200 hover:bg-blue-100/80",
        ecosystem: "bg-amber-50/80 border-amber-200 hover:bg-amber-100/80",
        medical: "bg-red-50/80 border-red-200 hover:bg-red-100/80"
      }
    }
  }
);

// Props interface
interface AGIBioNatureProps extends VariantProps<typeof bioNatureVariants> {
  dataSource?: 'simulation' | 'live' | 'cached';
  data?: BiologyData;
  onSpecimenSelect?: (specimen: Specimen) => void;
  className?: string;
}

// Pure formatting functions
const formatNumber = (value: number, decimals: number = 2): string => value.toFixed(decimals);

const formatPopulation = (value: number): string => {
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
  return value.toString();
};

const getHealthStatusColor = (status: Specimen['properties']['healthStatus']): string => {
  const colors = {
    healthy: 'text-green-600',
    endangered: 'text-yellow-600', 
    critical: 'text-red-600',
    extinct: 'text-gray-600'
  };
  return colors[status];
};

// Mock data for simulation
const SIMULATION_DATA: BiologyData = {
  specimens: [
    {
      id: 'specimen_001',
      species: 'Quercus alba',
      category: 'plant',
      location: { latitude: 40.7128, longitude: -74.0060, habitat: 'Deciduous Forest' },
      properties: {
        size: 25.5,
        population: 1500,
        healthStatus: 'healthy',
        geneticDiversity: 0.78,
        metabolicRate: 0.45
      }
    },
    {
      id: 'specimen_002', 
      species: 'Ursus americanus',
      category: 'animal',
      location: { latitude: 45.5017, longitude: -73.5673, habitat: 'Boreal Forest' },
      properties: {
        size: 180.0,
        population: 850,
        healthStatus: 'endangered',
        geneticDiversity: 0.65,
        metabolicRate: 0.32
      }
    },
    {
      id: 'specimen_003',
      species: 'Mycorrhiza fungi',
      category: 'fungi',
      location: { latitude: 47.6062, longitude: -122.3321, habitat: 'Temperate Rainforest' },
      properties: {
        size: 0.001,
        population: 50000000,
        healthStatus: 'healthy',
        geneticDiversity: 0.92,
        metabolicRate: 0.78
      }
    }
  ]
} as const;

// Main component
export const AGIBioNature = memo<AGIBioNatureProps>(({
  theme = 'forest',
  mode = 'biology',
  dataSource = 'simulation',
  data,
  onSpecimenSelect,
  className
}) => {
  // Memoized data selection
  const biologyData = useMemo(() => {
    if (data) return data;
    if (dataSource === 'simulation') return SIMULATION_DATA;
    return { specimens: [] };
  }, [data, dataSource]);

  // Memoized statistics
  const statistics = useMemo(() => {
    const specimens = biologyData.specimens;
    return {
      totalSpecimens: specimens.length,
      healthyCount: specimens.filter(s => s.properties.healthStatus === 'healthy').length,
      endangeredCount: specimens.filter(s => s.properties.healthStatus === 'endangered').length,
      avgGeneticDiversity: specimens.reduce((sum, s) => sum + s.properties.geneticDiversity, 0) / specimens.length,
      totalPopulation: specimens.reduce((sum, s) => sum + s.properties.population, 0)
    };
  }, [biologyData.specimens]);

  const handleSpecimenClick = useMemo(() => 
    onSpecimenSelect ? (specimen: Specimen) => onSpecimenSelect(specimen) : undefined,
    [onSpecimenSelect]
  );

  return (
    <div className={bioNatureVariants({ theme, mode, className })}>
      {/* Header */}
      <header className={headerVariants({ theme, mode })}>
        <h1>AGI BioNature Intelligence</h1>
        <p className="text-sm opacity-75 mt-2">
          Advanced biological specimen analysis and monitoring system
        </p>
      </header>

      {/* Statistics Dashboard */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={cardVariants({ theme })}>
          <h3 className="font-semibold mb-2">Total Specimens</h3>
          <p className="text-2xl font-bold">{statistics.totalSpecimens}</p>
        </div>
        
        <div className={cardVariants({ theme })}>
          <h3 className="font-semibold mb-2">Healthy Status</h3>
          <p className="text-2xl font-bold text-green-600">{statistics.healthyCount}</p>
        </div>
        
        <div className={cardVariants({ theme })}>
          <h3 className="font-semibold mb-2">At Risk</h3>
          <p className="text-2xl font-bold text-red-600">{statistics.endangeredCount}</p>
        </div>
        
        <div className={cardVariants({ theme })}>
          <h3 className="font-semibold mb-2">Genetic Diversity</h3>
          <p className="text-2xl font-bold">{formatNumber(statistics.avgGeneticDiversity)}</p>
        </div>
      </section>

      {/* Specimen Gallery */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Specimen Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biologyData.specimens.map((specimen) => (
            <div
              key={specimen.id}
              className={`${cardVariants({ theme })} cursor-pointer transform hover:scale-105`}
              onClick={() => handleSpecimenClick?.(specimen)}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-lg">{specimen.species}</h3>
                <span className={`px-2 py-1 rounded text-xs font-semibold ${getHealthStatusColor(specimen.properties.healthStatus)}`}>
                  {specimen.properties.healthStatus}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Category:</span> {specimen.category}</p>
                <p><span className="font-medium">Population:</span> {formatPopulation(specimen.properties.population)}</p>
                <p><span className="font-medium">Habitat:</span> {specimen.location.habitat}</p>
                <p><span className="font-medium">Genetic Diversity:</span> {formatNumber(specimen.properties.geneticDiversity)}</p>
                <p><span className="font-medium">Metabolic Rate:</span> {formatNumber(specimen.properties.metabolicRate)}</p>
              </div>
              
              <div className="mt-4 pt-3 border-t border-current border-opacity-20">
                <p className="text-xs opacity-75">
                  Location: {formatNumber(specimen.location.latitude)}, {formatNumber(specimen.location.longitude)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Analysis Summary */}
      <section className={cardVariants({ theme })}>
        <h2 className="text-xl font-bold mb-4">Analysis Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold mb-2">Population Overview</h3>
            <p className="text-sm">
              Total monitored population: <strong>{formatPopulation(statistics.totalPopulation)}</strong>
            </p>
            <p className="text-sm mt-1">
              Average genetic diversity across specimens: <strong>{formatNumber(statistics.avgGeneticDiversity)}</strong>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Conservation Status</h3>
            <p className="text-sm">
              <span className="text-green-600">{statistics.healthyCount} healthy</span> specimens monitored
            </p>
            <p className="text-sm mt-1">
              <span className="text-red-600">{statistics.endangeredCount} at-risk</span> specimens require attention
            </p>
          </div>
        </div>
      </section>

      {/* Data Source Indicator */}
      <footer className="mt-8 text-center">
        <p className="text-xs opacity-60">
          Data Source: {dataSource} | Mode: {mode} | Theme: {theme}
        </p>
      </footer>
    </div>
  );
});

AGIBioNature.displayName = 'AGIBioNature';

// Export types for external use
export type { AGIBioNatureProps, Specimen, BiologyData };

// Export utility functions
export { formatNumber, formatPopulation, getHealthStatusColor };

// Default export
export default AGIBioNature;
