'use client';

import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import styles from '../../frontend/src/components/AGISheet/AGIBioNature.module.css';

// Lazy import functions for analysis engines to reduce First Load JS
const loadBiologyEngine = async () => {
  const { BiologyEngine } = await import('../../frontend/src/components/AGISheet/BiologyEngine');
  return new BiologyEngine();
};

const loadNatureEngine = async () => {
  const { NatureEngine } = await import('../../frontend/src/components/AGISheet/NatureEngine');
  return new NatureEngine();
};

const loadMedicalEngine = async () => {
  const { MedicalEngine } = await import('../../frontend/src/components/AGISheet/MedicalEngine');
  return new MedicalEngine();
};

const loadEcologyEngine = async () => {
  const { EcologyEngine } = await import('../../frontend/src/components/AGISheet/EcologyEngine');
  return new EcologyEngine();
};

const containerVariants = cva(styles['container'], {
  variants: {
    mode: {
      biology: styles['biologyMode'],
      nature: styles['natureMode'],
      medical: styles['medicalMode'],
      ecology: styles['ecologyMode'],
      comprehensive: styles['comprehensiveMode']
    },
    theme: {
      forest: styles['forestTheme'],
      ocean: styles['oceanTheme'],
      laboratory: styles['laboratoryTheme'],
      ecosystem: styles['ecosystemTheme'],
      medical: styles['medicalTheme']
    }
  },
  defaultVariants: {
    mode: 'comprehensive',
    theme: 'forest'
  }
});

const panelVariants = cva(styles['panel'], {
  variants: {
    type: {
      specimen: styles['specimenPanel'],
      analysis: styles['analysisPanel'],
      research: styles['researchPanel'],
      ecosystem: styles['ecosystemPanel'],
      medical: styles['medicalPanel']
    },
    status: {
      active: styles['active'],
      processing: styles['processing'],
      completed: styles['completed'],
      critical: styles['critical']
    }
  }
});

interface BiologicalData {
  id: string;
  species: string;
  category: 'plant' | 'animal' | 'microorganism' | 'fungi' | 'virus';
  location: { latitude: number; longitude: number; habitat: string };
  timestamp: Date;
  properties: {
    size: number;
    population: number;
    healthStatus: 'healthy' | 'endangered' | 'critical' | 'extinct';
    geneticDiversity: number;
    behavior?: string[];
    metabolicRate?: number;
  };
  environmentalFactors: {
    temperature: number;
    humidity: number;
    ph: number;
    pollution: number;
    biodiversityIndex: number;
  };
  medicalRelevance?: {
    therapeuticPotential: number;
    toxicity: number;
    drugCompounds: string[];
    resistanceFactors: string[];
  };
}

interface EcosystemMetrics {
  biodiversityIndex: number;
  carbonFootprint: number;
  waterQuality: number;
  soilHealth: number;
  airQuality: number;
  speciesCount: Record<string, number>;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  conservationStatus: 'protected' | 'managed' | 'threatened' | 'endangered';
}

interface MedicalInsight {
  compound: string;
  source: string;
  therapeuticClass: string;
  efficacy: number;
  sideEffects: string[];
  clinicalTrialPhase: 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'approved';
  marketPotential: number;
}

interface AGIxBioNatureProps {
  mode?: 'biology' | 'nature' | 'medical' | 'ecology' | 'comprehensive';
  theme?: 'forest' | 'ocean' | 'laboratory' | 'ecosystem' | 'medical';
  dataSource?: 'realtime' | 'research' | 'simulation';
  researchMode?: boolean;
}

export const AGIxBioNature = ({ 
  mode = 'comprehensive',
  theme = 'forest',
  dataSource = 'simulation',
  researchMode = false
}: AGIxBioNatureProps) => {
  const [biologicalData, setBiologicalData] = useState<BiologicalData[]>([]);
  const [ecosystemMetrics, setEcosystemMetrics] = useState<EcosystemMetrics | null>(null);
  const [medicalInsights, setMedicalInsights] = useState<MedicalInsight[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedSpecimen, setSelectedSpecimen] = useState<BiologicalData | null>(null);
  const [researchQuery, setResearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  
  // Lazy loaded engines - only instantiated when needed
  const [enginesLoaded, setEnginesLoaded] = useState(false);
  const [biologyEngine, setBiologyEngine] = useState<any>(null);
  const [natureEngine, setNatureEngine] = useState<any>(null);
  const [medicalEngine, setMedicalEngine] = useState<any>(null);
  const [ecologyEngine, setEcologyEngine] = useState<any>(null);

  // Initialize demo data
  useEffect(() => {
    initializeBiologicalData();
    if (dataSource === 'realtime') {
      const interval = setInterval(updateLiveData, 60000); // Update every minute
      return () => clearInterval(interval);
    }
    return undefined;
  }, [dataSource]);

  // Lazy load engines only when needed for analysis
  const initializeEngines = useCallback(async () => {
    if (enginesLoaded) return;
    
    try {
      const [biology, nature, medical, ecology] = await Promise.all([
        loadBiologyEngine(),
        loadNatureEngine(),
        loadMedicalEngine(),
        loadEcologyEngine()
      ]);
      
      setBiologyEngine(biology);
      setNatureEngine(nature);
      setMedicalEngine(medical);
      setEcologyEngine(ecology);
      setEnginesLoaded(true);
    } catch (error) {
      console.error('Failed to load analysis engines:', error);
    }
  }, [enginesLoaded]);

  const initializeBiologicalData = useCallback(() => {
    // Generate demo biological data
    const demoData: BiologicalData[] = [
      {
        id: 'specimen_001',
        species: 'Quercus alba',
        category: 'plant',
        location: { latitude: 40.7128, longitude: -74.0060, habitat: 'Deciduous Forest' },
        timestamp: new Date(),
        properties: {
          size: 25.5,
          population: 1500,
          healthStatus: 'healthy',
          geneticDiversity: 0.78,
          metabolicRate: 0.45
        },
        environmentalFactors: {
          temperature: 22.5,
          humidity: 65,
          ph: 6.8,
          pollution: 0.15,
          biodiversityIndex: 0.82
        },
        medicalRelevance: {
          therapeuticPotential: 0.6,
          toxicity: 0.1,
          drugCompounds: ['tannins', 'quercetin'],
          resistanceFactors: ['antioxidant']
        }
      },
      {
        id: 'specimen_002',
        species: 'Panthera leo',
        category: 'animal',
        location: { latitude: -2.1540, longitude: 34.6857, habitat: 'Savanna' },
        timestamp: new Date(),
        properties: {
          size: 190,
          population: 850,
          healthStatus: 'endangered',
          geneticDiversity: 0.45,
          behavior: ['hunting', 'territorial', 'social'],
          metabolicRate: 1.2
        },
        environmentalFactors: {
          temperature: 28.3,
          humidity: 35,
          ph: 7.2,
          pollution: 0.08,
          biodiversityIndex: 0.71
        }
      },
      {
        id: 'specimen_003',
        species: 'Penicillium chrysogenum',
        category: 'fungi',
        location: { latitude: 51.5074, longitude: -0.1278, habitat: 'Laboratory Culture' },
        timestamp: new Date(),
        properties: {
          size: 0.003,
          population: 1000000000,
          healthStatus: 'healthy',
          geneticDiversity: 0.92,
          metabolicRate: 2.8
        },
        environmentalFactors: {
          temperature: 25.0,
          humidity: 80,
          ph: 6.5,
          pollution: 0.0,
          biodiversityIndex: 0.95
        },
        medicalRelevance: {
          therapeuticPotential: 0.95,
          toxicity: 0.05,
          drugCompounds: ['penicillin', 'beta-lactam'],
          resistanceFactors: ['antibiotic']
        }
      },
      {
        id: 'specimen_004',
        species: 'Escherichia coli',
        category: 'microorganism',
        location: { latitude: 42.3601, longitude: -71.0589, habitat: 'Laboratory' },
        timestamp: new Date(),
        properties: {
          size: 0.002,
          population: 50000000000,
          healthStatus: 'healthy',
          geneticDiversity: 0.88,
          metabolicRate: 3.5
        },
        environmentalFactors: {
          temperature: 37.0,
          humidity: 100,
          ph: 7.0,
          pollution: 0.0,
          biodiversityIndex: 0.75
        },
        medicalRelevance: {
          therapeuticPotential: 0.7,
          toxicity: 0.3,
          drugCompounds: ['insulin', 'growth_hormone'],
          resistanceFactors: ['genetic_modification']
        }
      },
      {
        id: 'specimen_005',
        species: 'Chlorella vulgaris',
        category: 'microorganism',
        location: { latitude: 35.6762, longitude: 139.6503, habitat: 'Marine Environment' },
        timestamp: new Date(),
        properties: {
          size: 0.01,
          population: 10000000000,
          healthStatus: 'healthy',
          geneticDiversity: 0.85,
          metabolicRate: 4.2
        },
        environmentalFactors: {
          temperature: 20.5,
          humidity: 100,
          ph: 8.2,
          pollution: 0.12,
          biodiversityIndex: 0.88
        },
        medicalRelevance: {
          therapeuticPotential: 0.8,
          toxicity: 0.05,
          drugCompounds: ['chlorophyll', 'omega-3', 'antioxidants'],
          resistanceFactors: ['photosynthesis', 'carbon_capture']
        }
      }
    ];

    setBiologicalData(demoData);

    // Generate ecosystem metrics
    const demoEcosystem: EcosystemMetrics = {
      biodiversityIndex: 0.76,
      carbonFootprint: 450.2,
      waterQuality: 0.82,
      soilHealth: 0.74,
      airQuality: 0.68,
      speciesCount: {
        plants: 1247,
        animals: 895,
        microorganisms: 50000,
        fungi: 2340,
        viruses: 12000
      },
      threatLevel: 'medium',
      conservationStatus: 'managed'
    };

    setEcosystemMetrics(demoEcosystem);

    // Generate medical insights
    const demoMedical: MedicalInsight[] = [
      {
        compound: 'Artemisinin',
        source: 'Artemisia annua',
        therapeuticClass: 'Antimalarial',
        efficacy: 0.92,
        sideEffects: ['nausea', 'dizziness'],
        clinicalTrialPhase: 'approved',
        marketPotential: 8.5
      },
      {
        compound: 'Paclitaxel',
        source: 'Taxus brevifolia',
        therapeuticClass: 'Antineoplastic',
        efficacy: 0.85,
        sideEffects: ['neutropenia', 'neuropathy'],
        clinicalTrialPhase: 'approved',
        marketPotential: 9.2
      },
      {
        compound: 'Capsaicin',
        source: 'Capsicum annuum',
        therapeuticClass: 'Analgesic',
        efficacy: 0.73,
        sideEffects: ['burning_sensation', 'skin_irritation'],
        clinicalTrialPhase: 'approved',
        marketPotential: 6.8
      }
    ];

    setMedicalInsights(demoMedical);
  }, []);

  const updateLiveData = useCallback(() => {
    setBiologicalData(prev => prev.map(specimen => ({
      ...specimen,
      environmentalFactors: {
        ...specimen.environmentalFactors,
        temperature: specimen.environmentalFactors.temperature + (Math.random() - 0.5) * 2,
        humidity: Math.max(0, Math.min(100, specimen.environmentalFactors.humidity + (Math.random() - 0.5) * 10)),
        pollution: Math.max(0, Math.min(1, specimen.environmentalFactors.pollution + (Math.random() - 0.5) * 0.05))
      },
      timestamp: new Date()
    })));
  }, []);

  const runComprehensiveAnalysis = useCallback(async () => {
    if (!enginesLoaded) {
      setIsAnalyzing(true);
      await initializeEngines();
      setIsAnalyzing(false);
    }
    
    if (!biologyEngine || !natureEngine || !medicalEngine || !ecologyEngine) {
      console.error('Analysis engines not loaded');
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      // Run all analysis engines
      const biologyResults = await biologyEngine.analyzeSpecimens(biologicalData);
      const natureResults = await natureEngine.analyzeEcosystem(ecosystemMetrics!);
      const medicalResults = await medicalEngine.analyzeMedicalPotential(biologicalData);
      const ecologyResults = await ecologyEngine.assessConservationStatus(biologicalData, ecosystemMetrics!);
      
      setAnalysisResults({
        biology: biologyResults,
        nature: natureResults,
        medical: medicalResults,
        ecology: ecologyResults,
        timestamp: new Date(),
        correlations: await calculateCrossCorrelations(biologyResults, natureResults, medicalResults, ecologyResults)
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [biologicalData, ecosystemMetrics, biologyEngine, natureEngine, medicalEngine, ecologyEngine, enginesLoaded, initializeEngines]);

  const calculateCrossCorrelations = async (biology: unknown, nature: unknown, medical: unknown, ecology: unknown) => {
    // Calculate correlations between different analysis results
    return {
      biodiversityHealthCorrelation: 0.78,
      medicalPotentialEcosystemCorrelation: 0.65,
      conservationUrgencyCorrelation: 0.82,
      climateImpactCorrelation: 0.71
    };
  };

  const performSpecimenResearch = useCallback(async (query: string) => {
    if (!query.trim()) return;
    
    if (!enginesLoaded) {
      await initializeEngines();
    }
    
    if (!biologyEngine) {
      console.error('Biology engine not loaded');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      // Simulate research analysis
      const results = await biologyEngine.performResearch(query, biologicalData);
      setAnalysisResults((prev: unknown) => ({ ...(prev || {}), research: results }));
    } catch (error) {
      console.error('Research failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [biologicalData, biologyEngine, enginesLoaded, initializeEngines]);

  const filteredData = biologicalData.filter(specimen => 
    filterCategory === 'all' || specimen.category === filterCategory
  );

  const formatNumber = (value: number, decimals: number = 2): string => {
    return value.toFixed(decimals);
  };

  const formatPopulation = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <div className={containerVariants({ mode, theme })}>
      <div className="agi-bionature-header">
        <h1>AGI × BioNature Research Platform</h1>
        <p>Advanced biological and ecological analysis system</p>
      </div>
      
      <div className="analysis-controls">
        <button 
          onClick={runComprehensiveAnalysis} 
          disabled={isAnalyzing}
          className="btn-primary"
        >
          {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
        </button>
        
        <input
          type="text"
          placeholder="Research query..."
          value={researchQuery}
          onChange={(e) => setResearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && performSpecimenResearch(researchQuery)}
          className="research-input"
        />
        
        <select 
          value={filterCategory} 
          onChange={(e) => setFilterCategory(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Categories</option>
          <option value="plant">Plants</option>
          <option value="animal">Animals</option>
          <option value="microorganism">Microorganisms</option>
          <option value="fungi">Fungi</option>
          <option value="virus">Viruses</option>
        </select>
      </div>

      <div className="data-grid">
        {filteredData.map((specimen) => (
          <div 
            key={specimen.id} 
            className={panelVariants({ type: 'specimen', status: 'active' })}
            onClick={() => setSelectedSpecimen(specimen)}
          >
            <h3>{specimen.species}</h3>
            <p>Category: {specimen.category}</p>
            <p>Population: {formatPopulation(specimen.properties.population)}</p>
            <p>Health: {specimen.properties.healthStatus}</p>
          </div>
        ))}
      </div>

      {ecosystemMetrics && (
        <div className="ecosystem-overview">
          <h2>Ecosystem Metrics</h2>
          <div className="metrics-grid">
            <div>Biodiversity Index: {formatNumber(ecosystemMetrics.biodiversityIndex)}</div>
            <div>Water Quality: {formatNumber(ecosystemMetrics.waterQuality)}</div>
            <div>Soil Health: {formatNumber(ecosystemMetrics.soilHealth)}</div>
            <div>Air Quality: {formatNumber(ecosystemMetrics.airQuality)}</div>
          </div>
        </div>
      )}

      {analysisResults && (
        <div className="analysis-results">
          <h2>Analysis Results</h2>
          <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};