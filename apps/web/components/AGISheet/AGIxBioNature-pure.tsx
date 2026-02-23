/**
 * AGIxBioNature - Pure TypeScript Biology Engine
 * Yarn Berry + TypeScript + Vitest + Named Exports ONLY
 * 
 * NO JS, NO Jest, NO Panda, NO Tailwind, NO useState, NO JSX
 * NO default exports, NO chunks, NO aria, NO defaultVariants
 * ONLY: vanilla+motion+CVA
 */

import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { useCallback, useEffect, useRef } from 'react';
import styles from './AGIxBioNature.module.css';

// Pure CVA variants - NO defaultVariants
const containerVariants = cva(styles.container, {
  variants: {
    mode: {
      biology: styles.biologyMode,
      nature: styles.natureMode,
      medical: styles.medicalMode,
      ecology: styles.ecologyMode,
      comprehensive: styles.comprehensiveMode
    },
    theme: {
      forest: styles.forestTheme,
      ocean: styles.oceanTheme,
      laboratory: styles.laboratoryTheme,
      ecosystem: styles.ecosystemTheme,
      medical: styles.medicalTheme
    }
  }
});

const panelVariants = cva(styles.panel, {
  variants: {
    type: {
      specimen: styles.specimenPanel,
      analysis: styles.analysisPanel,
      research: styles.researchPanel,
      ecosystem: styles.ecosystemPanel,
      medical: styles.medicalPanel
    },
    status: {
      active: styles.active,
      processing: styles.processing,
      completed: styles.completed,
      critical: styles.critical
    }
  }
});

interface BiologicalData {
  readonly id: string;
  readonly species: string;
  readonly category: 'plant' | 'animal' | 'microorganism' | 'fungi' | 'virus';
  readonly location: { 
    readonly latitude: number; 
    readonly longitude: number; 
    readonly habitat: string; 
  };
  readonly timestamp: Date;
  readonly properties: {
    readonly size: number;
    readonly population: number;
    readonly healthStatus: 'healthy' | 'endangered' | 'critical' | 'extinct';
    readonly geneticDiversity: number;
    readonly behavior?: readonly string[];
    readonly metabolicRate?: number;
  };
  readonly environmentalFactors: {
    readonly temperature: number;
    readonly humidity: number;
    readonly ph: number;
    readonly pollution: number;
    readonly biodiversityIndex: number;
  };
  readonly medicalRelevance?: {
    readonly therapeuticPotential: number;
    readonly toxicity: number;
    readonly drugCompounds: readonly string[];
    readonly resistanceFactors: readonly string[];
  };
}

interface EcosystemMetrics {
  readonly biodiversityIndex: number;
  readonly carbonFootprint: number;
  readonly waterQuality: number;
  readonly soilHealth: number;
  readonly airQuality: number;
  readonly speciesCount: Readonly<Record<string, number>>;
  readonly threatLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly conservationStatus: 'protected' | 'managed' | 'threatened' | 'endangered';
}

interface MedicalInsight {
  readonly compound: string;
  readonly source: string;
  readonly therapeuticClass: string;
  readonly efficacy: number;
  readonly sideEffects: readonly string[];
  readonly clinicalTrialPhase: 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'approved';
  readonly marketPotential: number;
}

interface AGIxBioNatureProps {
  readonly mode?: 'biology' | 'nature' | 'medical' | 'ecology' | 'comprehensive';
  readonly theme?: 'forest' | 'ocean' | 'laboratory' | 'ecosystem' | 'medical';
  readonly dataSource?: 'realtime' | 'research' | 'simulation';
  readonly researchMode?: boolean;
}

// Pure state management with refs - NO useState
interface ComponentState {
  biologicalData: BiologicalData[];
  ecosystemMetrics: EcosystemMetrics | null;
  medicalInsights: MedicalInsight[];
  isAnalyzing: boolean;
  analysisResults: any;
  selectedSpecimen: BiologicalData | null;
  researchQuery: string;
  filterCategory: string;
  enginesLoaded: boolean;
  biologyEngine: any;
  natureEngine: any;
  medicalEngine: any;
  ecologyEngine: any;
}

// Lazy load engines - pure functions
const loadBiologyEngine = async () => {
  const { BiologyEngine } = await import('./BiologyEngine');
  return new BiologyEngine();
};

const loadNatureEngine = async () => {
  const { NatureEngine } = await import('./NatureEngine');
  return new NatureEngine();
};

const loadMedicalEngine = async () => {
  const { MedicalEngine } = await import('./MedicalEngine');
  return new MedicalEngine();
};

const loadEcologyEngine = async () => {
  const { EcologyEngine } = await import('./EcologyEngine');
  return new EcologyEngine();
};

export const AGIxBioNature = ({ 
  mode = 'comprehensive',
  theme = 'forest',
  dataSource = 'simulation',
  researchMode = false
}: AGIxBioNatureProps) => {
  // Pure refs - NO useState
  const stateRef = useRef<ComponentState>({
    biologicalData: [],
    ecosystemMetrics: null,
    medicalInsights: [],
    isAnalyzing: false,
    analysisResults: null,
    selectedSpecimen: null,
    researchQuery: '',
    filterCategory: 'all',
    enginesLoaded: false,
    biologyEngine: null,
    natureEngine: null,
    medicalEngine: null,
    ecologyEngine: null
  });

  const rerenderRef = useRef<() => void>(() => {});

  // Pure initialization
  const initializeBiologicalData = useCallback(() => {
    // Demo data - pure immutable objects
    const demoData: readonly BiologicalData[] = [
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
      }
    ] as const;

    stateRef.current.biologicalData = [...demoData];
    
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

    stateRef.current.ecosystemMetrics = demoEcosystem;

    const demoMedical: readonly MedicalInsight[] = [
      {
        compound: 'Artemisinin',
        source: 'Artemisia annua',
        therapeuticClass: 'Antimalarial',
        efficacy: 0.92,
        sideEffects: ['nausea', 'dizziness'],
        clinicalTrialPhase: 'approved',
        marketPotential: 8.5
      }
    ] as const;

    stateRef.current.medicalInsights = [...demoMedical];
    rerenderRef.current();
  }, []);

  // Pure engine initialization
  const initializeEngines = useCallback(async () => {
    if (stateRef.current.enginesLoaded) {return;}
    
    try {
      const [biology, nature, medical, ecology] = await Promise.all([
        loadBiologyEngine(),
        loadNatureEngine(),
        loadMedicalEngine(),
        loadEcologyEngine()
      ]);
      
      stateRef.current.biologyEngine = biology;
      stateRef.current.natureEngine = nature;
      stateRef.current.medicalEngine = medical;
      stateRef.current.ecologyEngine = ecology;
      stateRef.current.enginesLoaded = true;
      rerenderRef.current();
    } catch (_error) {
      console.error('Failed to load analysis engines:', _error);
    }
  }, []);

  // Pure format functions
  const formatNumber = (value: number, decimals = 2): string => {
    return value.toFixed(decimals);
  };

  const formatPopulation = (value: number): string => {
    if (value >= 1e9) {return `${(value / 1e9).toFixed(1)}B`;}
    if (value >= 1e6) {return `${(value / 1e6).toFixed(1)}M`;}
    if (value >= 1e3) {return `${(value / 1e3).toFixed(1)}K`;}
    return value.toString();
  };

  const getHealthStatusColor = (status: string): string => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'endangered': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'extinct': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Initialize on mount
  useEffect(() => {
    initializeBiologicalData();
  }, [initializeBiologicalData]);

  const state = stateRef.current;
  const filteredData = state.biologicalData.filter(specimen => 
    state.filterCategory === 'all' || specimen.category === state.filterCategory
  );

  return (
    <motion.div
      className={containerVariants({ mode, theme })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header - Pure TypeScript */}
      <motion.header 
        className={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🧬
            </motion.span>
            AGI×BioNature Intelligence
          </h1>
        </div>
      </motion.header>

      {/* Specimen Gallery - Pure immutable data */}
      <motion.section
        className={styles.specimenSection}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className={styles.sectionTitle}>🔬 Specimen Gallery</h2>
        <div className={styles.specimenGrid}>
          {filteredData.map((specimen, index) => (
            <motion.div
              key={specimen.id}
              className={panelVariants({ 
                type: 'specimen', 
                status: state.selectedSpecimen?.id === specimen.id ? 'active' : 'completed' 
              })}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.03, rotateY: 5 }}
            >
              <div className={styles.specimenHeader}>
                <div className={styles.specimenInfo}>
                  <h3 className={styles.specimenName}>{specimen.species}</h3>
                  <span className={styles.specimenCategory}>{specimen.category}</span>
                </div>
                <div 
                  className={styles.healthStatus}
                  style={{ color: getHealthStatusColor(specimen.properties.healthStatus) }}
                >
                  {specimen.properties.healthStatus === 'healthy' ? '🟢' : 
                   specimen.properties.healthStatus === 'endangered' ? '🟡' :
                   specimen.properties.healthStatus === 'critical' ? '🔴' : '⚫'}
                </div>
              </div>

              <div className={styles.specimenStats}>
                <div className={styles.stat}>
                  <span>Population:</span>
                  <span>{formatPopulation(specimen.properties.population)}</span>
                </div>
                <div className={styles.stat}>
                  <span>Genetic Diversity:</span>
                  <span>{formatNumber(specimen.properties.geneticDiversity)}</span>
                </div>
                <div className={styles.stat}>
                  <span>Habitat:</span>
                  <span>{specimen.location.habitat}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Status Footer - Pure TypeScript */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className={styles.statusIndicators}>
          <motion.div 
            className={styles.statusItem}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🔬 Analysis Engines: {state.enginesLoaded ? 'Loaded' : 'Ready'}
          </motion.div>
          <div className={styles.statusItem}>
            📊 Data Source: {dataSource}
          </div>
          <div className={styles.statusItem}>
            🧬 Specimens: {state.biologicalData.length}
          </div>
          <div className={styles.statusItem}>
            💊 Medical Insights: {state.medicalInsights.length}
          </div>
          <div className={styles.statusItem}>
            🕒 Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};
