/**
 * Real AGI Medical Analysis Engine
 * Analizë mjekësore e vërtetë me algoritme të avancuara
 * 
 * @author Ledjan Ahmati
 * @version 8.1.0-MEDICAL
 */

export interface MedicalAnalysis {
  symptoms: string[];
  confidence: number;
  recommendations: string[];
  possibleConditions: Array<{
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  timestamp: string;
  analysisId: string;
}

export class RealAGIMedical {
  private conditionDatabase: Map<string, any> = new Map();
  private symptomPatterns: Map<string, string[]> = new Map();

  constructor() {
    this.initializeMedicalDatabase();
  }

  private initializeMedicalDatabase(): void {
    // Simplified medical knowledge base
    this.conditionDatabase.set('flu', {
      name: 'Grip sezonal',
      commonSymptoms: ['ethje', 'temperaturë', 'kollë', 'dhimbje trupi', 'lodhje'],
      severity: 'medium',
      description: 'Infeksion viral i zakonshëm që prek sistemin e frymëmarrjes'
    });

    this.conditionDatabase.set('cold', {
      name: 'Të ftohurat e zakonshme',
      commonSymptoms: ['hundë të bllokuara', 'kollë', 'dhimbje fyti', 'teshtitje'],
      severity: 'low',
      description: 'Infeksion i lehtë viral i rrugëve të sipërme të frymëmarrjes'
    });

    this.conditionDatabase.set('migraine', {
      name: 'Migrenë',
      commonSymptoms: ['dhimbje koke', 'ndjeshmëri ndaj dritës', 'përzierje', 'marrje mendsh'],
      severity: 'medium',
      description: 'Dhimbje koke të forta dhe të përsëritura'
    });

    this.conditionDatabase.set('dehydration', {
      name: 'Dehidratim',
      commonSymptoms: ['etje', 'gojë e thatë', 'lodhje', 'marramendës i çelur'],
      severity: 'medium',
      description: 'Mungesë e lëngjeve në organizëm'
    });

    this.conditionDatabase.set('stress', {
      name: 'Stres dhe ankth',
      commonSymptoms: ['ankth', 'zemrërrrahje', 'djersitje', 'tension', 'lodhje'],
      severity: 'medium',
      description: 'Reagim psikologjik ndaj presionit të jashtëm'
    });

    this.conditionDatabase.set('food_poisoning', {
      name: 'Helmim ushqimor',
      commonSymptoms: ['përzierje', 'vjellë', 'dhimbje barku', 'diarre', 'temperaturë'],
      severity: 'high',
      description: 'Infeksion i shkaktuar nga ushqimi i kontaminuar'
    });

    // Initialize symptom patterns
    this.initializeSymptomPatterns();
  }

  private initializeSymptomPatterns(): void {
    // Map keywords to normalized symptoms
    this.symptomPatterns.set('dhimbje koke', ['dhimbje koke', 'kokëdhimbje', 'dhimbje në kokë']);
    this.symptomPatterns.set('temperaturë', ['temperaturë', 'ethe', 'nxehtësi', 'djegje']);
    this.symptomPatterns.set('kollë', ['kollë', 'kollitje', 'kollen']);
    this.symptomPatterns.set('dhimbje fyti', ['dhimbje fyti', 'fyt i dhimbshëm', 'përpin']);
    this.symptomPatterns.set('lodhje', ['lodhje', 'dobësi', 'mungesa e energjisë']);
    this.symptomPatterns.set('përzierje', ['përzierje', 'turbullim', 'dhembje barku']);
    this.symptomPatterns.set('vjellë', ['vjellë', 'vjellca', 'okull']);
  }

  public analyzeSymptoms(symptomsText: string): MedicalAnalysis {
    const normalizedSymptoms = this.normalizeSymptoms(symptomsText);
    const matchedConditions = this.findMatchingConditions(normalizedSymptoms);
    const urgencyLevel = this.determineUrgency(normalizedSymptoms, matchedConditions);
    
    return {
      symptoms: normalizedSymptoms,
      confidence: this.calculateConfidence(normalizedSymptoms, matchedConditions),
      recommendations: this.generateRecommendations(matchedConditions, urgencyLevel),
      possibleConditions: matchedConditions,
      urgencyLevel,
      timestamp: new Date().toISOString(),
      analysisId: crypto.randomUUID()
    };
  }

  private normalizeSymptoms(text: string): string[] {
    const lowerText = text.toLowerCase();
    const foundSymptoms: string[] = [];

    for (const [symptom, patterns] of this.symptomPatterns.entries()) {
      for (const pattern of patterns) {
        if (lowerText.includes(pattern)) {
          foundSymptoms.push(symptom);
          break;
        }
      }
    }

    return [...new Set(foundSymptoms)]; // Remove duplicates
  }

  private findMatchingConditions(symptoms: string[]): Array<{
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }> {
    const matches: Array<{
      name: string;
      probability: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }> = [];

    for (const [, condition] of this.conditionDatabase.entries()) {
      const matchCount = symptoms.filter(symptom => 
        condition.commonSymptoms.includes(symptom)
      ).length;

      if (matchCount > 0) {
        const probability = Math.min(0.95, (matchCount / condition.commonSymptoms.length) * 0.8 + 0.1);
        matches.push({
          name: condition.name,
          probability: Math.round(probability * 100) / 100,
          severity: condition.severity,
          description: condition.description
        });
      }
    }

    return matches.sort((a, b) => b.probability - a.probability).slice(0, 5);
  }

  private calculateConfidence(symptoms: string[], conditions: any[]): number {
    if (conditions.length === 0) return 0.3;
    
    const maxProbability = Math.max(...conditions.map(c => c.probability));
    const symptomFactor = Math.min(1, symptoms.length / 3);
    
    return Math.round((maxProbability * symptomFactor) * 100) / 100;
  }

  private determineUrgency(symptoms: string[], conditions: any[]): 'low' | 'medium' | 'high' | 'emergency' {
    // Emergency symptoms
    const emergencySymptoms = ['dhimbje gjoksi', 'vështirësi në frymëmarrje', 'humbje ndërgjegjeje'];
    if (symptoms.some(s => emergencySymptoms.includes(s))) {
      return 'emergency';
    }

    // High urgency based on conditions
    const hasCriticalCondition = conditions.some(c => c.severity === 'high');
    if (hasCriticalCondition || symptoms.length >= 5) {
      return 'high';
    }

    // Medium urgency
    if (symptoms.length >= 3 || conditions.some(c => c.severity === 'medium')) {
      return 'medium';
    }

    return 'low';
  }

  private generateRecommendations(conditions: any[], urgency: string): string[] {
    const recommendations: string[] = [];

    switch (urgency) {
      case 'emergency':
        recommendations.push('🚨 EMERGJENCË: Kontaktoni menjëherë shërbimin e urgjencës ose shkoni në spital');
        break;
        
      case 'high':
        recommendations.push('⚠️ Konsultohuni me një mjek brenda 24 orëve');
        recommendations.push('Monitoroni simptomat dhe kontaktoni mjekun nëse përkeqësohen');
        break;
        
      case 'medium':
        recommendations.push('📋 Konsultohuni me mjekun tuaj brenda disa ditëve');
        recommendations.push('Pini shumë lëngje dhe pushoni');
        break;
        
      default:
        recommendations.push('💡 Monitoroni simptomat dhe pushoni');
        recommendations.push('Nëse simptomat vazhdojnë ose përkeqësohen, konsultohuni me mjekun');
    }

    // Add condition-specific recommendations
    if (conditions.some(c => c.name.includes('Grip') || c.name.includes('Të ftohurat'))) {
      recommendations.push('🌡️ Matni temperaturën rregullisht');
      recommendations.push('💊 Merrni ilaçe kundër dhimbjes nëse është e nevojshme');
    }

    if (conditions.some(c => c.name.includes('Dehidratim'))) {
      recommendations.push('💧 Pini ujë të bollshëm (8-10 gota në ditë)');
      recommendations.push('🧂 Konsideroni të pini lëngje që përmbajnë elektrolite');
    }

    recommendations.push('⚠️ KUJDES: Ky analiz është vetëm informativ dhe nuk zëvendëson konsultën mjekësore');

    return recommendations;
  }
}
