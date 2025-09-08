/**
 * EcologyEngine - Ecological and conservation analysis engine
 * Handles ecosystem dynamics, conservation strategies, environmental impact
 */

interface SpecimenData {
  id: string;
  species: string;
  category: 'plant' | 'animal' | 'microorganism' | 'fungi' | 'virus';
  location: { latitude: number; longitude: number; habitat: string };
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

interface ConservationStrategy {
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeframe: 'immediate' | 'short_term' | 'medium_term' | 'long_term';
  approach: 'protection' | 'restoration' | 'management' | 'research';
  stakeholders: string[];
  estimatedCost: number;
  expectedOutcome: string;
  successProbability: number;
  keyPerformanceIndicators: string[];
}

interface PopulationDynamics {
  currentPopulation: number;
  carryingCapacity: number;
  growthRate: number;
  mortalityRate: number;
  migrationRate: number;
  ageStructure: {
    juvenile: number;
    adult: number;
    elderly: number;
  };
  reproductiveSuccess: number;
  populationViability: number;
  minimumViablePopulation: number;
  projectedTrends: {
    short_term: number;
    medium_term: number;
    long_term: number;
  };
}

interface HabitatAssessment {
  habitatType: string;
  area: number;
  quality: number;
  fragmentation: number;
  connectivity: number;
  humanImpact: number;
  climateSuitability: number;
  resourceAvailability: {
    food: number;
    water: number;
    shelter: number;
    breedingSites: number;
  };
  threats: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    scope: 'local' | 'regional' | 'global';
    timeframe: 'immediate' | 'short' | 'medium' | 'long';
  }>;
  protectionStatus: string;
  managementEffectiveness: number;
}

interface EcologyAnalysisResult {
  conservationStatus: {
    overallAssessment: 'least_concern' | 'near_threatened' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct';
    redListCriteria: string[];
    populationTrend: 'increasing' | 'stable' | 'decreasing' | 'unknown';
    conservationActions: ConservationStrategy[];
    priorityRanking: number;
  };
  populationAnalysis: PopulationDynamics[];
  habitatEvaluation: HabitatAssessment[];
  ecosystemServices: {
    provisioning: { type: string; value: number; importance: string }[];
    regulating: { type: string; value: number; importance: string }[];
    cultural: { type: string; value: number; importance: string }[];
    supporting: { type: string; value: number; importance: string }[];
    totalEconomicValue: number;
  };
  foodWebPosition: {
    trophicLevel: number;
    role: 'producer' | 'primary_consumer' | 'secondary_consumer' | 'tertiary_consumer' | 'decomposer';
    keyInteractions: Array<{
      partner: string;
      relationship: 'predator' | 'prey' | 'competitor' | 'mutualist' | 'parasite';
      strength: number;
    }>;
    keystoneSpecies: boolean;
    indicatorSpecies: boolean;
  };
  climateVulnerability: {
    exposureLevel: number;
    sensitivity: number;
    adaptiveCapacity: number;
    vulnerabilityIndex: number;
    projectedImpacts: string[];
    adaptationOptions: string[];
  };
  humanWildlifeConflict: {
    conflictLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe';
    conflictTypes: string[];
    mitigationStrategies: string[];
    stakeholderEngagement: number;
    economicImpact: number;
  };
  geneticHealth: {
    geneticDiversity: number;
    inbreedingLevel: number;
    effectivePopulationSize: number;
    geneFlow: number;
    adaptivePotential: number;
    conservationGenetics: string[];
  };
  restorationPotential: {
    feasibility: number;
    cost: number;
    timeframe: number;
    successProbability: number;
    keyFactors: string[];
    monitoringRequirements: string[];
  };
  connectivityAnalysis: {
    habitatConnectivity: number;
    corridorEffectiveness: number;
    barrierIdentification: string[];
    connectivitySolutions: string[];
    landscapePermeability: number;
  };
}

export class EcologyEngine {
  private habitatTypes = [
    'forest', 'grassland', 'wetland', 'desert', 'mountain', 'coastal', 'marine', 'urban', 'agricultural'
  ];

  private threatTypes = [
    'habitat_loss', 'pollution', 'climate_change', 'invasive_species', 'overexploitation',
    'disease', 'human_disturbance', 'fragmentation', 'infrastructure'
  ];

  private simulateAnalysisDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 850 + Math.random() * 1100));
  }

  public async assessConservationStatus(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics): Promise<EcologyAnalysisResult> {
    await this.simulateAnalysisDelay();

    const conservationStatus = this.evaluateConservationStatus(specimens, ecosystemMetrics);
    const populationAnalysis = this.analyzePopulationDynamics(specimens);
    const habitatEvaluation = this.assessHabitats(specimens, ecosystemMetrics);
    const ecosystemServices = this.evaluateEcosystemServices(specimens, ecosystemMetrics);
    const foodWebPosition = this.analyzeFoodWebPosition(specimens);
    const climateVulnerability = this.assessClimateVulnerability(specimens, ecosystemMetrics);
    const humanWildlifeConflict = this.evaluateHumanWildlifeConflict(specimens, ecosystemMetrics);
    const geneticHealth = this.assessGeneticHealth(specimens);
    const restorationPotential = this.evaluateRestorationPotential(specimens, ecosystemMetrics);
    const connectivityAnalysis = this.analyzeConnectivity(specimens, ecosystemMetrics);

    return {
      conservationStatus,
      populationAnalysis,
      habitatEvaluation,
      ecosystemServices,
      foodWebPosition,
      climateVulnerability,
      humanWildlifeConflict,
      geneticHealth,
      restorationPotential,
      connectivityAnalysis
    };
  }

  private evaluateConservationStatus(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const endangeredCount = specimens.filter(s => s.properties.healthStatus === 'endangered' || s.properties.healthStatus === 'critical').length;
    const healthyCount = specimens.filter(s => s.properties.healthStatus === 'healthy').length;
    const totalSpecimens = specimens.length;

    const endangeredRatio = endangeredCount / totalSpecimens;
    
    let overallAssessment: 'least_concern' | 'near_threatened' | 'vulnerable' | 'endangered' | 'critically_endangered' | 'extinct';
    
    if (endangeredRatio > 0.7 || ecosystemMetrics.threatLevel === 'critical') {
      overallAssessment = 'critically_endangered';
    } else if (endangeredRatio > 0.5 || ecosystemMetrics.threatLevel === 'high') {
      overallAssessment = 'endangered';
    } else if (endangeredRatio > 0.3) {
      overallAssessment = 'vulnerable';
    } else if (endangeredRatio > 0.1) {
      overallAssessment = 'near_threatened';
    } else {
      overallAssessment = 'least_concern';
    }

    const populationTrend = this.determinePopulationTrend(specimens);
    const conservationActions = this.generateConservationActions(specimens, ecosystemMetrics, overallAssessment);
    const priorityRanking = this.calculateConservationPriority(overallAssessment, ecosystemMetrics);

    return {
      overallAssessment,
      redListCriteria: this.generateRedListCriteria(specimens, ecosystemMetrics),
      populationTrend,
      conservationActions,
      priorityRanking
    };
  }

  private analyzePopulationDynamics(specimens: SpecimenData[]): PopulationDynamics[] {
    return specimens.map(specimen => {
      const currentPopulation = specimen.properties.population;
      const carryingCapacity = currentPopulation * (1.2 + Math.random() * 0.8);
      
      const healthMultiplier = this.getHealthMultiplier(specimen.properties.healthStatus);
      const growthRate = (0.05 + Math.random() * 0.15) * healthMultiplier;
      const mortalityRate = (0.02 + Math.random() * 0.08) * (2 - healthMultiplier);
      
      const ageStructure = this.generateAgeStructure(specimen);
      const reproductiveSuccess = healthMultiplier * specimen.properties.geneticDiversity;
      
      return {
        currentPopulation,
        carryingCapacity,
        growthRate,
        mortalityRate,
        migrationRate: Math.random() * 0.1,
        ageStructure,
        reproductiveSuccess,
        populationViability: this.calculatePopulationViability(specimen),
        minimumViablePopulation: Math.max(50, currentPopulation * 0.1),
        projectedTrends: {
          short_term: currentPopulation * (1 + growthRate - mortalityRate),
          medium_term: currentPopulation * Math.pow(1 + growthRate - mortalityRate, 5),
          long_term: currentPopulation * Math.pow(1 + growthRate - mortalityRate, 10)
        }
      };
    });
  }

  private assessHabitats(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics): HabitatAssessment[] {
    const habitatGroups = this.groupSpecimensByHabitat(specimens);
    
    return Object.entries(habitatGroups).map(([habitat, habitatSpecimens]) => {
      const quality = habitatSpecimens.reduce((sum, s) => sum + s.environmentalFactors.biodiversityIndex, 0) / habitatSpecimens.length;
      const fragmentation = 1 - quality; // Simplified relationship
      const humanImpact = habitatSpecimens.reduce((sum, s) => sum + s.environmentalFactors.pollution, 0) / habitatSpecimens.length;
      
      return {
        habitatType: habitat,
        area: 1000 + Math.random() * 9000, // Simulated area in hectares
        quality,
        fragmentation,
        connectivity: quality * 0.8 + Math.random() * 0.2,
        humanImpact,
        climateSuitability: 1 - humanImpact,
        resourceAvailability: {
          food: quality * 0.9 + Math.random() * 0.1,
          water: ecosystemMetrics.waterQuality,
          shelter: quality * 0.85 + Math.random() * 0.15,
          breedingSites: quality * 0.7 + Math.random() * 0.3
        },
        threats: this.identifyHabitatThreats(habitatSpecimens, ecosystemMetrics),
        protectionStatus: this.determineProtectionStatus(ecosystemMetrics.conservationStatus),
        managementEffectiveness: this.calculateManagementEffectiveness(ecosystemMetrics)
      };
    });
  }

  private evaluateEcosystemServices(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const serviceValue = ecosystemMetrics.biodiversityIndex * 1000000; // Base economic value
    
    return {
      provisioning: [
        { type: 'food_production', value: serviceValue * 0.2, importance: 'high' },
        { type: 'fresh_water', value: serviceValue * 0.15, importance: 'critical' },
        { type: 'timber', value: serviceValue * 0.1, importance: 'medium' },
        { type: 'genetic_resources', value: serviceValue * 0.08, importance: 'high' }
      ],
      regulating: [
        { type: 'climate_regulation', value: serviceValue * 0.25, importance: 'critical' },
        { type: 'water_purification', value: serviceValue * 0.12, importance: 'high' },
        { type: 'disease_control', value: serviceValue * 0.08, importance: 'medium' },
        { type: 'pollination', value: serviceValue * 0.15, importance: 'high' }
      ],
      cultural: [
        { type: 'recreation', value: serviceValue * 0.05, importance: 'medium' },
        { type: 'spiritual_values', value: serviceValue * 0.03, importance: 'medium' },
        { type: 'educational', value: serviceValue * 0.02, importance: 'low' }
      ],
      supporting: [
        { type: 'nutrient_cycling', value: serviceValue * 0.08, importance: 'critical' },
        { type: 'soil_formation', value: serviceValue * 0.06, importance: 'high' },
        { type: 'primary_production', value: serviceValue * 0.10, importance: 'critical' }
      ],
      totalEconomicValue: serviceValue
    };
  }

  private analyzeFoodWebPosition(specimens: SpecimenData[]) {
    // Analyze first specimen as representative
    const specimen = specimens[0];
    if (!specimen) {
      return {
        trophicLevel: 1,
        role: 'producer' as const,
        keyInteractions: [],
        keystoneSpecies: false,
        indicatorSpecies: false
      };
    }

    const trophicLevel = this.calculateTrophicLevel(specimen);
    const role = this.determineTrophicRole(specimen, trophicLevel);
    const keyInteractions = this.generateKeyInteractions(specimens);
    
    return {
      trophicLevel,
      role,
      keyInteractions,
      keystoneSpecies: this.isKeystoneSpecies(specimen, specimens),
      indicatorSpecies: this.isIndicatorSpecies(specimen)
    };
  }

  private assessClimateVulnerability(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const avgTemperature = specimens.reduce((sum, s) => sum + s.environmentalFactors.temperature, 0) / specimens.length;
    const temperatureVariability = this.calculateTemperatureVariability(specimens);
    
    const exposureLevel = Math.min(1, temperatureVariability / 10); // Normalized
    const sensitivity = 1 - (specimens.reduce((sum, s) => sum + s.properties.geneticDiversity, 0) / specimens.length);
    const adaptiveCapacity = ecosystemMetrics.biodiversityIndex;
    
    const vulnerabilityIndex = (exposureLevel + sensitivity - adaptiveCapacity) / 2;
    
    return {
      exposureLevel,
      sensitivity,
      adaptiveCapacity,
      vulnerabilityIndex: Math.max(0, vulnerabilityIndex),
      projectedImpacts: this.generateClimateImpacts(vulnerabilityIndex),
      adaptationOptions: this.generateAdaptationOptions(vulnerabilityIndex)
    };
  }

  private evaluateHumanWildlifeConflict(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const humanImpact = specimens.reduce((sum, s) => sum + s.environmentalFactors.pollution, 0) / specimens.length;
    
    let conflictLevel: 'none' | 'low' | 'moderate' | 'high' | 'severe';
    
    if (humanImpact > 0.7) conflictLevel = 'severe';
    else if (humanImpact > 0.5) conflictLevel = 'high';
    else if (humanImpact > 0.3) conflictLevel = 'moderate';
    else if (humanImpact > 0.1) conflictLevel = 'low';
    else conflictLevel = 'none';
    
    return {
      conflictLevel,
      conflictTypes: this.generateConflictTypes(conflictLevel),
      mitigationStrategies: this.generateMitigationStrategies(conflictLevel),
      stakeholderEngagement: 1 - humanImpact,
      economicImpact: humanImpact * 1000000
    };
  }

  private assessGeneticHealth(specimens: SpecimenData[]) {
    const avgGeneticDiversity = specimens.reduce((sum, s) => sum + s.properties.geneticDiversity, 0) / specimens.length;
    const totalPopulation = specimens.reduce((sum, s) => sum + s.properties.population, 0);
    
    return {
      geneticDiversity: avgGeneticDiversity,
      inbreedingLevel: 1 - avgGeneticDiversity,
      effectivePopulationSize: totalPopulation * 0.25, // Simplified calculation
      geneFlow: avgGeneticDiversity * 0.8,
      adaptivePotential: avgGeneticDiversity,
      conservationGenetics: this.generateConservationGenetics(avgGeneticDiversity)
    };
  }

  private evaluateRestorationPotential(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const healthScore = (ecosystemMetrics.biodiversityIndex + ecosystemMetrics.waterQuality + ecosystemMetrics.soilHealth + ecosystemMetrics.airQuality) / 4;
    
    const feasibility = healthScore * 0.8 + 0.2;
    const cost = (1 - healthScore) * 10000000; // Higher cost for more degraded systems
    const timeframe = (1 - healthScore) * 50 + 5; // 5-55 years
    const successProbability = healthScore * 0.7 + 0.3;
    
    return {
      feasibility,
      cost,
      timeframe,
      successProbability,
      keyFactors: this.generateRestorationFactors(healthScore),
      monitoringRequirements: this.generateMonitoringRequirements()
    };
  }

  private analyzeConnectivity(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    const habitatConnectivity = ecosystemMetrics.biodiversityIndex * 0.9;
    const corridorEffectiveness = habitatConnectivity * 0.8;
    
    return {
      habitatConnectivity,
      corridorEffectiveness,
      barrierIdentification: this.identifyBarriers(ecosystemMetrics),
      connectivitySolutions: this.generateConnectivitySolutions(ecosystemMetrics),
      landscapePermeability: habitatConnectivity
    };
  }

  // Helper methods
  private getHealthMultiplier(healthStatus: string): number {
    switch (healthStatus) {
      case 'healthy': return 1.0;
      case 'endangered': return 0.6;
      case 'critical': return 0.3;
      case 'extinct': return 0.0;
      default: return 0.5;
    }
  }

  private generateAgeStructure(specimen: SpecimenData) {
    const health = this.getHealthMultiplier(specimen.properties.healthStatus);
    return {
      juvenile: 0.3 * health + Math.random() * 0.2,
      adult: 0.5 + Math.random() * 0.2,
      elderly: 0.2 * (2 - health) + Math.random() * 0.1
    };
  }

  private calculatePopulationViability(specimen: SpecimenData): number {
    const populationFactor = Math.min(1, specimen.properties.population / 1000);
    const geneticFactor = specimen.properties.geneticDiversity;
    const healthFactor = this.getHealthMultiplier(specimen.properties.healthStatus);
    
    return (populationFactor * 0.4 + geneticFactor * 0.35 + healthFactor * 0.25);
  }

  private groupSpecimensByHabitat(specimens: SpecimenData[]): Record<string, SpecimenData[]> {
    const groups: Record<string, SpecimenData[]> = {};
    
    specimens.forEach(specimen => {
      const habitat = specimen.location.habitat;
      if (!groups[habitat]) {
        groups[habitat] = [];
      }
      groups[habitat].push(specimen);
    });
    
    return groups;
  }

  private determinePopulationTrend(specimens: SpecimenData[]): 'increasing' | 'stable' | 'decreasing' | 'unknown' {
    const healthyRatio = specimens.filter(s => s.properties.healthStatus === 'healthy').length / specimens.length;
    
    if (healthyRatio > 0.7) return 'increasing';
    if (healthyRatio > 0.4) return 'stable';
    if (healthyRatio > 0.1) return 'decreasing';
    return 'decreasing';
  }

  private generateConservationActions(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics, status: string): ConservationStrategy[] {
    const actions: ConservationStrategy[] = [];
    
    if (status === 'critically_endangered' || status === 'endangered') {
      actions.push({
        priority: 'critical',
        timeframe: 'immediate',
        approach: 'protection',
        stakeholders: ['government', 'conservation_orgs', 'local_communities'],
        estimatedCost: 5000000,
        expectedOutcome: 'Species population stabilization',
        successProbability: 0.7,
        keyPerformanceIndicators: ['population_size', 'breeding_success', 'habitat_quality']
      });
    }
    
    actions.push({
      priority: 'high',
      timeframe: 'medium_term',
      approach: 'restoration',
      stakeholders: ['researchers', 'government', 'ngos'],
      estimatedCost: 2000000,
      expectedOutcome: 'Habitat restoration and connectivity improvement',
      successProbability: 0.6,
      keyPerformanceIndicators: ['habitat_area', 'connectivity_index', 'species_diversity']
    });
    
    return actions;
  }

  private calculateConservationPriority(status: string, ecosystemMetrics: EcosystemMetrics): number {
    const statusWeights = {
      'critically_endangered': 1.0,
      'endangered': 0.8,
      'vulnerable': 0.6,
      'near_threatened': 0.4,
      'least_concern': 0.2
    };
    
    const statusWeight = statusWeights[status as keyof typeof statusWeights] || 0.5;
    const threatWeight = ecosystemMetrics.threatLevel === 'critical' ? 1.0 :
                        ecosystemMetrics.threatLevel === 'high' ? 0.8 :
                        ecosystemMetrics.threatLevel === 'medium' ? 0.6 : 0.4;
    
    return (statusWeight * 0.7 + threatWeight * 0.3);
  }

  private generateRedListCriteria(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics): string[] {
    const criteria = [];
    
    const smallPopulations = specimens.filter(s => s.properties.population < 1000).length;
    if (smallPopulations > 0) criteria.push('Small population size');
    
    const lowDiversity = specimens.filter(s => s.properties.geneticDiversity < 0.3).length;
    if (lowDiversity > 0) criteria.push('Low genetic diversity');
    
    if (ecosystemMetrics.threatLevel === 'high' || ecosystemMetrics.threatLevel === 'critical') {
      criteria.push('High threat level');
    }
    
    criteria.push('Habitat degradation', 'Climate change impacts');
    
    return criteria;
  }

  private calculateTrophicLevel(specimen: SpecimenData): number {
    switch (specimen.category) {
      case 'plant': return 1.0;
      case 'microorganism': return 1.5;
      case 'fungi': return 2.0;
      case 'animal': return specimen.properties.behavior?.includes('hunting') ? 3.5 : 2.5;
      case 'virus': return 1.0;
      default: return 2.0;
    }
  }

  private determineTrophicRole(specimen: SpecimenData, trophicLevel: number): 'producer' | 'primary_consumer' | 'secondary_consumer' | 'tertiary_consumer' | 'decomposer' {
    if (specimen.category === 'fungi' || specimen.category === 'microorganism') return 'decomposer';
    if (trophicLevel <= 1.5) return 'producer';
    if (trophicLevel <= 2.5) return 'primary_consumer';
    if (trophicLevel <= 3.5) return 'secondary_consumer';
    return 'tertiary_consumer';
  }

  private generateKeyInteractions(specimens: SpecimenData[]) {
    const interactions = [];
    
    for (let i = 0; i < Math.min(3, specimens.length - 1); i++) {
      interactions.push({
        partner: specimens[i + 1].species,
        relationship: this.determineRelationship(specimens[0], specimens[i + 1]) as 'predator' | 'prey' | 'competitor' | 'mutualist' | 'parasite',
        strength: Math.random() * 0.8 + 0.1
      });
    }
    
    return interactions;
  }

  private determineRelationship(spec1: SpecimenData, spec2: SpecimenData): string {
    if (spec1.category === 'plant' && spec2.category === 'animal') return 'mutualist';
    if (spec1.category === 'animal' && spec2.category === 'plant') return 'mutualist';
    if (spec1.category === spec2.category) return 'competitor';
    if (spec1.category === 'animal' && spec2.category === 'microorganism') return 'predator';
    return 'neutral';
  }

  private isKeystoneSpecies(specimen: SpecimenData, specimens: SpecimenData[]): boolean {
    // Simplified: larger animals or plants with high genetic diversity
    return specimen.properties.size > 100 && specimen.properties.geneticDiversity > 0.7;
  }

  private isIndicatorSpecies(specimen: SpecimenData): boolean {
    // Simplified: species sensitive to environmental changes
    return specimen.environmentalFactors.pollution < 0.2 && specimen.properties.healthStatus === 'healthy';
  }

  private calculateTemperatureVariability(specimens: SpecimenData[]): number {
    const temperatures = specimens.map(s => s.environmentalFactors.temperature);
    const avg = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
    const variance = temperatures.reduce((acc, temp) => acc + Math.pow(temp - avg, 2), 0) / temperatures.length;
    return Math.sqrt(variance);
  }

  private generateClimateImpacts(vulnerabilityIndex: number): string[] {
    const impacts = [];
    
    if (vulnerabilityIndex > 0.7) {
      impacts.push('Severe habitat loss', 'Population collapse', 'Range shifts');
    } else if (vulnerabilityIndex > 0.4) {
      impacts.push('Moderate habitat changes', 'Breeding disruption', 'Food web alterations');
    } else {
      impacts.push('Minor habitat modifications', 'Seasonal pattern changes');
    }
    
    return impacts;
  }

  private generateAdaptationOptions(vulnerabilityIndex: number): string[] {
    return [
      'Assisted migration',
      'Habitat connectivity enhancement',
      'Ex-situ conservation',
      'Genetic rescue',
      'Climate refugia protection'
    ];
  }

  private identifyHabitatThreats(specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics) {
    return this.threatTypes.map(type => ({
      type,
      severity: this.determineThreatSeverity(type, specimens, ecosystemMetrics) as 'low' | 'medium' | 'high' | 'critical',
      scope: this.determineThreatScope(type) as 'local' | 'regional' | 'global',
      timeframe: this.determineThreatTimeframe(type) as 'immediate' | 'short' | 'medium' | 'long'
    })).slice(0, 5);
  }

  private determineThreatSeverity(threatType: string, specimens: SpecimenData[], ecosystemMetrics: EcosystemMetrics): string {
    if (threatType === 'pollution' && specimens.some(s => s.environmentalFactors.pollution > 0.5)) return 'high';
    if (threatType === 'climate_change') return ecosystemMetrics.threatLevel;
    return ['low', 'medium', 'high'][Math.floor(Math.random() * 3)];
  }

  private determineThreatScope(threatType: string): string {
    if (['climate_change', 'pollution'].includes(threatType)) return 'global';
    if (['habitat_loss', 'invasive_species'].includes(threatType)) return 'regional';
    return 'local';
  }

  private determineThreatTimeframe(threatType: string): string {
    if (['disease', 'overexploitation'].includes(threatType)) return 'immediate';
    if (['habitat_loss', 'pollution'].includes(threatType)) return 'short';
    if (['climate_change', 'invasive_species'].includes(threatType)) return 'medium';
    return 'long';
  }

  private determineProtectionStatus(conservationStatus: string): string {
    switch (conservationStatus) {
      case 'protected': return 'Strictly Protected Area';
      case 'managed': return 'Multiple Use Area';
      case 'threatened': return 'Vulnerable Area';
      case 'endangered': return 'Critical Habitat';
      default: return 'Unprotected';
    }
  }

  private calculateManagementEffectiveness(ecosystemMetrics: EcosystemMetrics): number {
    const statusMultiplier = ecosystemMetrics.conservationStatus === 'protected' ? 1.0 :
                            ecosystemMetrics.conservationStatus === 'managed' ? 0.7 :
                            ecosystemMetrics.conservationStatus === 'threatened' ? 0.4 : 0.2;
    
    return statusMultiplier * ecosystemMetrics.biodiversityIndex;
  }

  private generateConflictTypes(conflictLevel: string): string[] {
    const types = [];
    
    if (conflictLevel === 'severe' || conflictLevel === 'high') {
      types.push('Crop damage', 'Livestock predation', 'Property damage');
    }
    
    if (conflictLevel !== 'none') {
      types.push('Resource competition', 'Habitat encroachment');
    }
    
    return types;
  }

  private generateMitigationStrategies(conflictLevel: string): string[] {
    return [
      'Community education programs',
      'Compensation schemes',
      'Conflict-resistant farming practices',
      'Early warning systems',
      'Alternative livelihood development'
    ];
  }

  private generateConservationGenetics(geneticDiversity: number): string[] {
    const strategies = [];
    
    if (geneticDiversity < 0.5) {
      strategies.push('Genetic rescue programs', 'Captive breeding');
    }
    
    strategies.push('Population monitoring', 'Genetic health assessment');
    
    return strategies;
  }

  private generateRestorationFactors(healthScore: number): string[] {
    const factors = ['Community support', 'Technical expertise', 'Funding availability'];
    
    if (healthScore < 0.5) {
      factors.push('Severe degradation', 'Multiple stressors');
    }
    
    return factors;
  }

  private generateMonitoringRequirements(): string[] {
    return [
      'Population monitoring',
      'Habitat quality assessment',
      'Genetic diversity tracking',
      'Threat assessment',
      'Restoration progress evaluation'
    ];
  }

  private identifyBarriers(ecosystemMetrics: EcosystemMetrics): string[] {
    const barriers = [];
    
    if (ecosystemMetrics.airQuality < 0.5) barriers.push('Infrastructure development');
    if (ecosystemMetrics.waterQuality < 0.5) barriers.push('Waterway modifications');
    
    barriers.push('Urban development', 'Agricultural expansion');
    
    return barriers;
  }

  private generateConnectivitySolutions(ecosystemMetrics: EcosystemMetrics): string[] {
    return [
      'Wildlife corridors',
      'Green bridges',
      'Habitat restoration',
      'Land use planning',
      'Protected area expansion'
    ];
  }
}
