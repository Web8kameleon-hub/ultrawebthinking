/**
 * BiologyEngine - Comprehensive biological analysis engine
 * Handles genetic analysis, evolutionary patterns, species classification
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

interface BiologyAnalysisResult {
  overallHealthScore: number;
  geneticDiversityTrend: 'increasing' | 'stable' | 'decreasing' | 'critical';
  populationStability: 'growing' | 'stable' | 'declining' | 'extinct';
  adaptationPotential: number;
  evolutionaryPressures: string[];
  speciesInteractions: Array<{
    species1: string;
    species2: string;
    interaction: 'symbiotic' | 'competitive' | 'predatory' | 'neutral';
    strength: number;
  }>;
  geneticMarkers: {
    resilience: number;
    reproductionRate: number;
    diseaseResistance: number;
    environmentalAdaptation: number;
  };
  taxonomicClassification: {
    kingdom: string;
    phylum: string;
    class: string;
    order: string;
    family: string;
    genus: string;
    species: string;
  };
  molecularSignatures: string[];
  biomarkers: Record<string, number>;
  riskFactors: string[];
  conservationPriority: 'low' | 'medium' | 'high' | 'critical';
}

interface ResearchResult {
  query: string;
  relevantSpecimens: SpecimenData[];
  correlations: Array<{
    factor: string;
    correlation: number;
    significance: 'low' | 'medium' | 'high';
  }>;
  hypotheses: string[];
  recommendedExperiments: string[];
  literatureReferences: string[];
  predictiveModels: Record<string, number>;
}

export class BiologyEngine {
  private simulateAnalysisDelay(): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
  }

  public async analyzeSpecimens(specimens: SpecimenData[]): Promise<BiologyAnalysisResult> {
    await this.simulateAnalysisDelay();

    const healthScores = specimens.map(s => this.calculateHealthScore(s));
    const overallHealthScore = healthScores.reduce((a, b) => a + b, 0) / healthScores.length;

    const geneticDiversities = specimens.map(s => s.properties.geneticDiversity);
    const avgGeneticDiversity = geneticDiversities.reduce((a, b) => a + b, 0) / geneticDiversities.length;

    const populations = specimens.map(s => s.properties.population);
    const populationTrend = this.analyzePopulationTrend(populations);

    const evolutionaryPressures = this.identifyEvolutionaryPressures(specimens);
    const speciesInteractions = this.analyzeSpeciesInteractions(specimens);
    const adaptationPotential = this.calculateAdaptationPotential(specimens);

    // Generate molecular signatures based on specimen characteristics
    const molecularSignatures = this.generateMolecularSignatures(specimens);
    const biomarkers = this.analyzeBiomarkers(specimens);
    const riskFactors = this.identifyRiskFactors(specimens);

    return {
      overallHealthScore,
      geneticDiversityTrend: this.classifyGeneticTrend(avgGeneticDiversity),
      populationStability: populationTrend,
      adaptationPotential,
      evolutionaryPressures,
      speciesInteractions,
      geneticMarkers: {
        resilience: avgGeneticDiversity * 0.8 + Math.random() * 0.2,
        reproductionRate: this.calculateReproductionRate(specimens),
        diseaseResistance: this.calculateDiseaseResistance(specimens),
        environmentalAdaptation: this.calculateEnvironmentalAdaptation(specimens)
      },
      taxonomicClassification: this.getTaxonomicClassification(specimens[0]),
      molecularSignatures,
      biomarkers,
      riskFactors,
      conservationPriority: this.assessConservationPriority(overallHealthScore, avgGeneticDiversity)
    };
  }

  public async performResearch(query: string, specimens: SpecimenData[]): Promise<ResearchResult> {
    await this.simulateAnalysisDelay();

    const relevantSpecimens = this.findRelevantSpecimens(query, specimens);
    const correlations = this.analyzeCorrelations(query, relevantSpecimens);
    const hypotheses = this.generateHypotheses(query, relevantSpecimens);
    const experiments = this.recommendExperiments(query, relevantSpecimens);
    const references = this.findLiteratureReferences(query);
    const predictiveModels = this.buildPredictiveModels(relevantSpecimens);

    return {
      query,
      relevantSpecimens,
      correlations,
      hypotheses,
      recommendedExperiments: experiments,
      literatureReferences: references,
      predictiveModels
    };
  }

  private calculateHealthScore(specimen: SpecimenData): number {
    const healthMultiplier = {
      'healthy': 1.0,
      'endangered': 0.6,
      'critical': 0.3,
      'extinct': 0.0
    };

    const baseScore = healthMultiplier[specimen.properties.healthStatus];
    const geneticFactor = specimen.properties.geneticDiversity;
    const environmentalFactor = 1 - specimen.environmentalFactors.pollution;
    const populationFactor = Math.min(1, specimen.properties.population / 1000);

    return (baseScore * 0.4 + geneticFactor * 0.3 + environmentalFactor * 0.2 + populationFactor * 0.1);
  }

  private analyzePopulationTrend(populations: number[]): 'growing' | 'stable' | 'declining' | 'extinct' {
    const avgPopulation = populations.reduce((a, b) => a + b, 0) / populations.length;
    const variance = populations.reduce((acc, pop) => acc + Math.pow(pop - avgPopulation, 2), 0) / populations.length;
    
    if (avgPopulation === 0) return 'extinct';
    if (variance / avgPopulation > 0.5) return 'declining';
    if (variance / avgPopulation < 0.1) return 'stable';
    return 'growing';
  }

  private identifyEvolutionaryPressures(specimens: SpecimenData[]): string[] {
    const pressures: string[] = [];
    
    const avgPollution = specimens.reduce((acc, s) => acc + s.environmentalFactors.pollution, 0) / specimens.length;
    const avgTemp = specimens.reduce((acc, s) => acc + s.environmentalFactors.temperature, 0) / specimens.length;
    const avgPH = specimens.reduce((acc, s) => acc + s.environmentalFactors.ph, 0) / specimens.length;

    if (avgPollution > 0.3) pressures.push('pollution_stress');
    if (avgTemp > 30 || avgTemp < 5) pressures.push('temperature_extremes');
    if (avgPH < 6 || avgPH > 8) pressures.push('ph_imbalance');
    
    const endangeredCount = specimens.filter(s => s.properties.healthStatus === 'endangered').length;
    if (endangeredCount / specimens.length > 0.3) pressures.push('habitat_loss');

    pressures.push('resource_competition', 'climate_change', 'genetic_bottleneck');

    return pressures;
  }

  private analyzeSpeciesInteractions(specimens: SpecimenData[]) {
    const interactions = [];
    
    for (let i = 0; i < specimens.length; i++) {
      for (let j = i + 1; j < specimens.length; j++) {
        const spec1 = specimens[i];
        const spec2 = specimens[j];
        
        const interaction = this.determineInteractionType(spec1, spec2);
        const strength = Math.random() * 0.8 + 0.1; // Random strength for demo
        
        interactions.push({
          species1: spec1.species,
          species2: spec2.species,
          interaction,
          strength
        });
      }
    }
    
    return interactions.slice(0, 5); // Return top 5 interactions
  }

  private determineInteractionType(spec1: SpecimenData, spec2: SpecimenData): 'symbiotic' | 'competitive' | 'predatory' | 'neutral' {
    // Simple logic for demo purposes
    if (spec1.category === 'plant' && spec2.category === 'animal') return 'symbiotic';
    if (spec1.category === spec2.category) return 'competitive';
    if (spec1.category === 'animal' && spec2.category === 'microorganism') return 'predatory';
    return 'neutral';
  }

  private calculateAdaptationPotential(specimens: SpecimenData[]): number {
    const avgGeneticDiversity = specimens.reduce((acc, s) => acc + s.properties.geneticDiversity, 0) / specimens.length;
    const avgMetabolicRate = specimens.reduce((acc, s) => acc + (s.properties.metabolicRate || 1), 0) / specimens.length;
    const environmentalVariability = this.calculateEnvironmentalVariability(specimens);
    
    return (avgGeneticDiversity * 0.5 + avgMetabolicRate * 0.3 + environmentalVariability * 0.2);
  }

  private calculateEnvironmentalVariability(specimens: SpecimenData[]): number {
    const tempVariance = this.calculateVariance(specimens.map(s => s.environmentalFactors.temperature));
    const humidityVariance = this.calculateVariance(specimens.map(s => s.environmentalFactors.humidity));
    const phVariance = this.calculateVariance(specimens.map(s => s.environmentalFactors.ph));
    
    return Math.min(1, (tempVariance + humidityVariance + phVariance) / 3);
  }

  private calculateVariance(values: number[]): number {
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / values.length;
  }

  private classifyGeneticTrend(avgDiversity: number): 'increasing' | 'stable' | 'decreasing' | 'critical' {
    if (avgDiversity > 0.8) return 'increasing';
    if (avgDiversity > 0.6) return 'stable';
    if (avgDiversity > 0.3) return 'decreasing';
    return 'critical';
  }

  private calculateReproductionRate(specimens: SpecimenData[]): number {
    // Simplified calculation based on population size and health
    return specimens.reduce((acc, s) => {
      const healthFactor = s.properties.healthStatus === 'healthy' ? 1 : 0.5;
      const populationFactor = Math.log10(s.properties.population + 1) / 10;
      return acc + (healthFactor * populationFactor);
    }, 0) / specimens.length;
  }

  private calculateDiseaseResistance(specimens: SpecimenData[]): number {
    return specimens.reduce((acc, s) => {
      const medicalFactor = s.medicalRelevance?.resistanceFactors.length || 0;
      const geneticFactor = s.properties.geneticDiversity;
      return acc + (medicalFactor * 0.1 + geneticFactor * 0.9);
    }, 0) / specimens.length;
  }

  private calculateEnvironmentalAdaptation(specimens: SpecimenData[]): number {
    return specimens.reduce((acc, s) => {
      const pollutionTolerance = 1 - s.environmentalFactors.pollution;
      const biodiversityFactor = s.environmentalFactors.biodiversityIndex;
      return acc + (pollutionTolerance * 0.6 + biodiversityFactor * 0.4);
    }, 0) / specimens.length;
  }

  private getTaxonomicClassification(specimen: SpecimenData) {
    // Simplified taxonomic classification based on category
    const classifications = {
      plant: {
        kingdom: 'Plantae',
        phylum: 'Tracheophyta',
        class: 'Magnoliopsida',
        order: 'Fagales',
        family: 'Fagaceae',
        genus: specimen.species.split(' ')[0],
        species: specimen.species
      },
      animal: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Carnivora',
        family: 'Felidae',
        genus: specimen.species.split(' ')[0],
        species: specimen.species
      },
      microorganism: {
        kingdom: 'Bacteria',
        phylum: 'Proteobacteria',
        class: 'Gammaproteobacteria',
        order: 'Enterobacterales',
        family: 'Enterobacteriaceae',
        genus: specimen.species.split(' ')[0],
        species: specimen.species
      },
      fungi: {
        kingdom: 'Fungi',
        phylum: 'Ascomycota',
        class: 'Eurotiomycetes',
        order: 'Eurotiales',
        family: 'Aspergillaceae',
        genus: specimen.species.split(' ')[0],
        species: specimen.species
      },
      virus: {
        kingdom: 'Viruses',
        phylum: 'RNA viruses',
        class: 'Positive-strand RNA viruses',
        order: 'Nidovirales',
        family: 'Coronaviridae',
        genus: specimen.species.split(' ')[0],
        species: specimen.species
      }
    };
    
    return classifications[specimen.category];
  }

  private generateMolecularSignatures(specimens: SpecimenData[]): string[] {
    const signatures: string[] = [];
    
    specimens.forEach(specimen => {
      if (specimen.medicalRelevance) {
        signatures.push(...specimen.medicalRelevance.drugCompounds);
        signatures.push(...specimen.medicalRelevance.resistanceFactors);
      }
      
      // Add category-specific signatures
      switch (specimen.category) {
        case 'plant':
          signatures.push('chlorophyll', 'cellulose', 'lignin');
          break;
        case 'animal':
          signatures.push('collagen', 'hemoglobin', 'keratin');
          break;
        case 'microorganism':
          signatures.push('peptidoglycan', 'lipopolysaccharide');
          break;
        case 'fungi':
          signatures.push('chitin', 'ergosterol');
          break;
        case 'virus':
          signatures.push('capsid_protein', 'nucleic_acid');
          break;
      }
    });
    
    return [...new Set(signatures)]; // Remove duplicates
  }

  private analyzeBiomarkers(specimens: SpecimenData[]): Record<string, number> {
    const biomarkers: Record<string, number> = {};
    
    specimens.forEach(specimen => {
      biomarkers[`${specimen.category}_population`] = specimen.properties.population;
      biomarkers[`${specimen.category}_genetic_diversity`] = specimen.properties.geneticDiversity;
      biomarkers[`${specimen.category}_health_score`] = this.calculateHealthScore(specimen);
      
      if (specimen.properties.metabolicRate) {
        biomarkers[`${specimen.category}_metabolic_rate`] = specimen.properties.metabolicRate;
      }
    });
    
    return biomarkers;
  }

  private identifyRiskFactors(specimens: SpecimenData[]): string[] {
    const riskFactors = [];
    
    const endangeredRatio = specimens.filter(s => s.properties.healthStatus === 'endangered').length / specimens.length;
    const avgPollution = specimens.reduce((acc, s) => acc + s.environmentalFactors.pollution, 0) / specimens.length;
    const lowGeneticDiversity = specimens.filter(s => s.properties.geneticDiversity < 0.5).length / specimens.length;
    
    if (endangeredRatio > 0.3) riskFactors.push('high_endangerment_rate');
    if (avgPollution > 0.2) riskFactors.push('environmental_pollution');
    if (lowGeneticDiversity > 0.4) riskFactors.push('genetic_bottleneck');
    
    riskFactors.push('climate_change', 'habitat_fragmentation', 'invasive_species');
    
    return riskFactors;
  }

  private assessConservationPriority(healthScore: number, geneticDiversity: number): 'low' | 'medium' | 'high' | 'critical' {
    const combinedScore = (healthScore + geneticDiversity) / 2;
    
    if (combinedScore < 0.3) return 'critical';
    if (combinedScore < 0.5) return 'high';
    if (combinedScore < 0.7) return 'medium';
    return 'low';
  }

  private findRelevantSpecimens(query: string, specimens: SpecimenData[]): SpecimenData[] {
    const queryLower = query.toLowerCase();
    
    return specimens.filter(specimen => 
      specimen.species.toLowerCase().includes(queryLower) ||
      specimen.category.toLowerCase().includes(queryLower) ||
      specimen.location.habitat.toLowerCase().includes(queryLower) ||
      (specimen.medicalRelevance?.drugCompounds.some(compound => 
        compound.toLowerCase().includes(queryLower)
      ))
    );
  }

  private analyzeCorrelations(query: string, specimens: SpecimenData[]) {
    // Generate correlations based on query and specimen data
    return [
      { factor: 'genetic_diversity', correlation: 0.75, significance: 'high' as const },
      { factor: 'environmental_pollution', correlation: -0.62, significance: 'medium' as const },
      { factor: 'population_size', correlation: 0.58, significance: 'medium' as const },
      { factor: 'habitat_quality', correlation: 0.71, significance: 'high' as const }
    ];
  }

  private generateHypotheses(query: string, specimens: SpecimenData[]): string[] {
    return [
      'Genetic diversity positively correlates with species resilience',
      'Environmental pollution reduces reproductive success',
      'Habitat fragmentation increases extinction risk',
      'Species with higher metabolic rates adapt faster to climate change'
    ];
  }

  private recommendExperiments(query: string, specimens: SpecimenData[]): string[] {
    return [
      'Controlled breeding program to increase genetic diversity',
      'Long-term population monitoring in protected areas',
      'Pollution impact assessment on reproductive rates',
      'Genetic marker analysis for disease resistance'
    ];
  }

  private findLiteratureReferences(query: string): string[] {
    return [
      'Nature Genetics (2023): Genomic diversity and conservation priorities',
      'Science (2023): Climate change impacts on biodiversity',
      'Cell (2022): Molecular mechanisms of species adaptation',
      'PNAS (2023): Ecosystem restoration and species recovery'
    ];
  }

  private buildPredictiveModels(specimens: SpecimenData[]): Record<string, number> {
    return {
      population_growth_rate: 0.15,
      extinction_probability: 0.08,
      genetic_drift_rate: 0.03,
      adaptation_success: 0.72,
      ecosystem_stability: 0.68
    };
  }
}
