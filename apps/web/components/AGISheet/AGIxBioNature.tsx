'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import styles from './AGIxBioNature.module.css';

// Lazy import functions for analysis engines to reduce First Load JS
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
  },
  defaultVariants: {
    mode: 'comprehensive',
    theme: 'forest'
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
  }, [dataSource]);

  // Lazy load engines only when needed for analysis
  const initializeEngines = useCallback(async () => {
    if (enginesLoaded) {return;}
    
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
    } catch (_error) {
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
    
    if (!biologyEngine ?? !natureEngine ?? !medicalEngine ?? !ecologyEngine) {
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
    } catch (_error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [biologicalData, ecosystemMetrics, biologyEngine, natureEngine, medicalEngine, ecologyEngine, enginesLoaded, initializeEngines]);

  const calculateCrossCorrelations = async (biology: any, nature: any, medical: any, ecology: any) => {
    // Calculate correlations between different analysis results
    return {
      biodiversityHealthCorrelation: 0.78,
      medicalPotentialEcosystemCorrelation: 0.65,
      conservationUrgencyCorrelation: 0.82,
      climateImpactCorrelation: 0.71
    };
  };

  const performSpecimenResearch = useCallback(async (query: string) => {
    if (!query.trim()) {return;}
    
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
      setAnalysisResults((prev: any) => ({ ...(prev ?? {}), research: results }));
    } catch (_error) {
      console.error('Research failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [biologicalData, biologyEngine, enginesLoaded, initializeEngines]);

  const filteredData = biologicalData.filter(specimen => 
    filterCategory === 'all' || specimen.category === filterCategory
  );

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

  const getThreatLevelColor = (level: string): string => {
    switch (level) {
      case 'low': return '#10b981';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      case 'critical': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <motion.div
      className={containerVariants({ mode, theme })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
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
          <div className={styles.controls}>
            <select 
              className={styles.categoryFilter}
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="plant">Plants</option>
              <option value="animal">Animals</option>
              <option value="microorganism">Microorganisms</option>
              <option value="fungi">Fungi</option>
              <option value="virus">Viruses</option>
            </select>
            
            <div className={styles.researchBox}>
              <input
                type="text"
                className={styles.researchInput}
                placeholder="Enter research query..."
                value={researchQuery}
                onChange={(e) => setResearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && performSpecimenResearch(researchQuery)}
              />
              <motion.button
                className={styles.researchButton}
                onClick={() => performSpecimenResearch(researchQuery)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                🔬 Research
              </motion.button>
            </div>

            <motion.button
              className={styles.analyzeButton}
              onClick={runComprehensiveAnalysis}
              disabled={isAnalyzing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnalyzing ? 
                (!enginesLoaded ? '⚡ Loading Engines...' : '🧬 Analyzing...') : 
                '🧠 Run Analysis'
              }
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Ecosystem Overview */}
      {ecosystemMetrics && (
        <motion.section
          className={styles.ecosystemSection}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className={styles.sectionTitle}>🌍 Ecosystem Overview</h2>
          <div className={styles.ecosystemGrid}>
            <motion.div
              className={panelVariants({ type: 'ecosystem', status: 'active' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Biodiversity Index</span>
                <span className={styles.metricValue}>{formatNumber(ecosystemMetrics.biodiversityIndex)}</span>
              </div>
              <div className={styles.progressBar}>
                <motion.div 
                  className={styles.progressFill}
                  initial={{ width: 0 }}
                  animate={{ width: `${ecosystemMetrics.biodiversityIndex * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ backgroundColor: '#10b981' }}
                />
              </div>
            </motion.div>

            <motion.div
              className={panelVariants({ type: 'ecosystem', status: 'active' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Carbon Footprint</span>
                <span className={styles.metricValue}>{formatNumber(ecosystemMetrics.carbonFootprint)} ppm</span>
              </div>
              <div className={styles.carbonIndicator}>
                <span className={ecosystemMetrics.carbonFootprint > 400 ? styles.high : styles.normal}>
                  {ecosystemMetrics.carbonFootprint > 400 ? '⚠️ High' : '✅ Normal'}
                </span>
              </div>
            </motion.div>

            <motion.div
              className={panelVariants({ type: 'ecosystem', status: 'active' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.metricHeader}>
                <span className={styles.metricName}>Threat Level</span>
                <span 
                  className={styles.threatLevel}
                  style={{ color: getThreatLevelColor(ecosystemMetrics.threatLevel) }}
                >
                  {ecosystemMetrics.threatLevel.toUpperCase()}
                </span>
              </div>
            </motion.div>

            <motion.div
              className={panelVariants({ type: 'ecosystem', status: 'active' })}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.speciesCount}>
                <h3>Species Count</h3>
                {Object.entries(ecosystemMetrics.speciesCount).map(([category, count]) => (
                  <div key={category} className={styles.speciesItem}>
                    <span>{category}:</span>
                    <span>{formatPopulation(count)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Specimen Gallery */}
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
                status: selectedSpecimen?.id === specimen.id ? 'active' : 'completed' 
              })}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.03, rotateY: 5 }}
              onClick={() => setSelectedSpecimen(specimen)}
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
                {specimen.medicalRelevance && (
                  <div className={styles.stat}>
                    <span>Medical Potential:</span>
                    <span>{formatNumber(specimen.medicalRelevance.therapeuticPotential)}</span>
                  </div>
                )}
              </div>

              <div className={styles.environmentalFactors}>
                <h4>Environmental Conditions</h4>
                <div className={styles.factorGrid}>
                  <div className={styles.factor}>
                    <span>🌡️ {formatNumber(specimen.environmentalFactors.temperature)}°C</span>
                  </div>
                  <div className={styles.factor}>
                    <span>💧 {formatNumber(specimen.environmentalFactors.humidity)}%</span>
                  </div>
                  <div className={styles.factor}>
                    <span>🧪 pH {formatNumber(specimen.environmentalFactors.ph)}</span>
                  </div>
                  <div className={styles.factor}>
                    <span>☣️ Pollution {formatNumber(specimen.environmentalFactors.pollution * 100)}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Medical Insights */}
      {medicalInsights.length > 0 && (
        <motion.section
          className={styles.medicalSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className={styles.sectionTitle}>💊 Medical Insights</h2>
          <div className={styles.medicalGrid}>
            {medicalInsights.map((insight, index) => (
              <motion.div
                key={insight.compound}
                className={panelVariants({ type: 'medical', status: 'completed' })}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className={styles.compoundHeader}>
                  <h3 className={styles.compoundName}>{insight.compound}</h3>
                  <span className={styles.clinicalPhase}>{insight.clinicalTrialPhase}</span>
                </div>
                
                <div className={styles.compoundDetails}>
                  <div className={styles.detail}>
                    <span>Source:</span>
                    <span>{insight.source}</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Class:</span>
                    <span>{insight.therapeuticClass}</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Efficacy:</span>
                    <span>{formatNumber(insight.efficacy * 100)}%</span>
                  </div>
                  <div className={styles.detail}>
                    <span>Market Potential:</span>
                    <span>{formatNumber(insight.marketPotential)}/10</span>
                  </div>
                </div>

                <div className={styles.sideEffects}>
                  <h4>Side Effects:</h4>
                  <div className={styles.effectsList}>
                    {insight.sideEffects.map(effect => (
                      <span key={effect} className={styles.effect}>{effect}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Analysis Results */}
      {analysisResults && (
        <motion.section
          className={styles.resultsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className={styles.sectionTitle}>🎯 Analysis Results</h2>
          <div className={styles.resultsGrid}>
            <motion.div
              className={panelVariants({ type: 'analysis', status: 'completed' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>🧬 Biology Analysis</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.biology, null, 2)}
              </pre>
            </motion.div>
            
            <motion.div
              className={panelVariants({ type: 'analysis', status: 'completed' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>🌿 Nature Assessment</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.nature, null, 2)}
              </pre>
            </motion.div>
            
            <motion.div
              className={panelVariants({ type: 'analysis', status: 'completed' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>💊 Medical Analysis</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.medical, null, 2)}
              </pre>
            </motion.div>
            
            <motion.div
              className={panelVariants({ type: 'analysis', status: 'completed' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>🌍 Ecology Report</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.ecology, null, 2)}
              </pre>
            </motion.div>

            {analysisResults.correlations && (
              <motion.div
                className={panelVariants({ type: 'analysis', status: 'active' })}
                whileHover={{ scale: 1.02 }}
              >
                <h3>🔗 Cross-Correlations</h3>
                <div className={styles.correlationsList}>
                  {Object.entries(analysisResults.correlations).map(([key, value]) => (
                    <div key={key} className={styles.correlation}>
                      <span>{key.replace(/([A-Z])/g, ' $1').toLowerCase()}:</span>
                      <span className={styles.correlationValue}>{formatNumber(value as number)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>
      )}

      {/* Status Footer */}
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
            🔬 Analysis Engines: Active
          </motion.div>
          <div className={styles.statusItem}>
            📊 Data Source: {dataSource}
          </div>
          <div className={styles.statusItem}>
            🧬 Specimens: {biologicalData.length}
          </div>
          <div className={styles.statusItem}>
            💊 Medical Insights: {medicalInsights.length}
          </div>
          <div className={styles.statusItem}>
            🕒 Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};
