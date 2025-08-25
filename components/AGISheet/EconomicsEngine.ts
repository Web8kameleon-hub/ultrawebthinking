interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface EconomicAnalysis {
  marketHealth: 'excellent' | 'good' | 'moderate' | 'poor' | 'critical';
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  sentiment: 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish';
  recommendations: string[];
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
  economicScore: number; // 0-100
  inflationRisk: number; // 0-1
  growthPotential: number; // 0-1
  marketStability: number; // 0-1
}

interface EconomicForcast {
  shortTerm: { period: '1M' | '3M'; outlook: string; probability: number };
  mediumTerm: { period: '6M' | '1Y'; outlook: string; probability: number };
  longTerm: { period: '2Y' | '5Y'; outlook: string; probability: number };
}

interface SectorAnalysis {
  sector: string;
  performance: number;
  outlook: 'positive' | 'neutral' | 'negative';
  keyDrivers: string[];
  risks: string[];
}

interface MacroeconomicIndicators {
  gdpGrowth: number;
  inflationRate: number;
  unemploymentRate: number;
  interestRates: number;
  consumerConfidence: number;
  manufacturingIndex: number;
  tradeBalance: number;
}

export class EconomicsEngine {
  private debugMode: boolean;
  private economicModels: Map<string, any>;

  constructor(debugMode: boolean = false) {
    this.debugMode = debugMode;
    this.economicModels = new Map();
    this.initializeModels();
  }

  /**
   * Comprehensive market analysis
   */
  async analyzeMarket(indicators: MarketIndicator[]): Promise<EconomicAnalysis> {
    if (indicators.length === 0) {
      throw new Error('No market indicators provided');
    }

    // Calculate overall market health
    const marketHealth = this.assessMarketHealth(indicators);
    
    // Assess risk levels
    const riskLevel = this.calculateRiskLevel(indicators);
    
    // Determine market sentiment
    const sentiment = this.analyzeSentiment(indicators);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(indicators, marketHealth, riskLevel);
    
    // Extract key insights
    const keyInsights = this.extractKeyInsights(indicators);
    
    // Identify risk factors
    const riskFactors = this.identifyRiskFactors(indicators, riskLevel);
    
    // Find opportunities
    const opportunities = this.findOpportunities(indicators, marketHealth);
    
    // Calculate economic score
    const economicScore = this.calculateEconomicScore(indicators);
    
    // Assess specific risks
    const inflationRisk = this.assessInflationRisk(indicators);
    const growthPotential = this.assessGrowthPotential(indicators);
    const marketStability = this.assessMarketStability(indicators);

    if (this.debugMode) {
      }

    return {
      marketHealth,
      riskLevel,
      sentiment,
      recommendations,
      keyInsights,
      riskFactors,
      opportunities,
      economicScore,
      inflationRisk,
      growthPotential,
      marketStability
    };
  }

  /**
   * Generate economic forecast
   */
  async generateForecast(indicators: MarketIndicator[]): Promise<EconomicForcast> {
    const currentTrends = this.analyzeTrends(indicators);
    const volatility = this.calculateVolatility(indicators);
    const momentum = this.calculateMomentum(indicators);

    // Short-term forecast (1-3 months)
    const shortTermOutlook = this.generateShortTermOutlook(currentTrends, volatility);
    const shortTermProbability = this.calculateForecastConfidence(indicators, 'short');

    // Medium-term forecast (6-12 months)
    const mediumTermOutlook = this.generateMediumTermOutlook(currentTrends, momentum);
    const mediumTermProbability = this.calculateForecastConfidence(indicators, 'medium');

    // Long-term forecast (2-5 years)
    const longTermOutlook = this.generateLongTermOutlook(currentTrends);
    const longTermProbability = this.calculateForecastConfidence(indicators, 'long');

    return {
      shortTerm: { period: '3M', outlook: shortTermOutlook, probability: shortTermProbability },
      mediumTerm: { period: '1Y', outlook: mediumTermOutlook, probability: mediumTermProbability },
      longTerm: { period: '5Y', outlook: longTermOutlook, probability: longTermProbability }
    };
  }

  /**
   * Analyze sector performance
   */
  async analyzeSectors(indicators: MarketIndicator[]): Promise<SectorAnalysis[]> {
    const sectors = this.categorizeBySector(indicators);
    const analyses: SectorAnalysis[] = [];

    for (const sector of Array.from(sectors.keys())) {
      const sectorIndicators = sectors.get(sector)!;
      const performance = this.calculateSectorPerformance(sectorIndicators);
      const outlook = this.determineSectorOutlook(sectorIndicators);
      const keyDrivers = this.identifyKeyDrivers(sectorIndicators);
      const risks = this.identifySectorRisks(sectorIndicators);

      analyses.push({
        sector,
        performance,
        outlook,
        keyDrivers,
        risks
      });
    }

    return analyses.sort((a, b) => b.performance - a.performance);
  }

  /**
   * Generate macroeconomic indicators
   */
  async generateMacroIndicators(indicators: MarketIndicator[]): Promise<MacroeconomicIndicators> {
    // Simulate macroeconomic calculations based on market indicators
    const gdpGrowth = this.estimateGDPGrowth(indicators);
    const inflationRate = this.estimateInflation(indicators);
    const unemploymentRate = this.estimateUnemployment(indicators);
    const interestRates = this.estimateInterestRates(indicators);
    const consumerConfidence = this.estimateConsumerConfidence(indicators);
    const manufacturingIndex = this.estimateManufacturingIndex(indicators);
    const tradeBalance = this.estimateTradeBalance(indicators);

    return {
      gdpGrowth,
      inflationRate,
      unemploymentRate,
      interestRates,
      consumerConfidence,
      manufacturingIndex,
      tradeBalance
    };
  }

  // Private utility methods
  private initializeModels(): void {
    // Initialize various economic models
    this.economicModels.set('inflation', {
      threshold: 0.02, // 2%
      target: 0.025, // 2.5%
      ceiling: 0.04 // 4%
    });

    this.economicModels.set('growth', {
      recession: -0.02,
      slow: 0.01,
      moderate: 0.025,
      strong: 0.04
    });

    this.economicModels.set('risk', {
      veryLow: 0.1,
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      extreme: 0.9
    });
  }

  private assessMarketHealth(indicators: MarketIndicator[]): 'excellent' | 'good' | 'moderate' | 'poor' | 'critical' {
    const positiveCount = indicators.filter(i => i.trend === 'up' && i.change > 0).length;
    const negativeCount = indicators.filter(i => i.trend === 'down' && i.change < 0).length;
    const averageConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;

    const healthScore = (positiveCount - negativeCount) / indicators.length + averageConfidence;

    if (healthScore > 0.8) return 'excellent';
    if (healthScore > 0.4) return 'good';
    if (healthScore > 0) return 'moderate';
    if (healthScore > -0.4) return 'poor';
    return 'critical';
  }

  private calculateRiskLevel(indicators: MarketIndicator[]): 'low' | 'medium' | 'high' | 'extreme' {
    const volatility = this.calculateVolatility(indicators);
    const negativeCount = indicators.filter(i => i.change < 0).length;
    const lowConfidenceCount = indicators.filter(i => i.confidence < 0.6).length;

    const riskScore = (volatility * 0.4) + (negativeCount / indicators.length * 0.3) + (lowConfidenceCount / indicators.length * 0.3);

    if (riskScore < 0.25) return 'low';
    if (riskScore < 0.5) return 'medium';
    if (riskScore < 0.75) return 'high';
    return 'extreme';
  }

  private analyzeSentiment(indicators: MarketIndicator[]): 'very_bullish' | 'bullish' | 'neutral' | 'bearish' | 'very_bearish' {
    const avgChange = indicators.reduce((sum, i) => sum + i.change, 0) / indicators.length;
    const positiveCount = indicators.filter(i => i.change > 0).length / indicators.length;

    const sentimentScore = avgChange * 0.6 + (positiveCount - 0.5) * 0.4;

    if (sentimentScore > 2) return 'very_bullish';
    if (sentimentScore > 0.5) return 'bullish';
    if (sentimentScore > -0.5) return 'neutral';
    if (sentimentScore > -2) return 'bearish';
    return 'very_bearish';
  }

  private generateRecommendations(indicators: MarketIndicator[], health: string, risk: string): string[] {
    const recommendations: string[] = [];

    if (health === 'excellent' && risk === 'low') {
      recommendations.push('Consider increasing portfolio allocation to growth assets');
      recommendations.push('Monitor for potential overheating signals');
    } else if (health === 'poor' || risk === 'high') {
      recommendations.push('Implement defensive investment strategies');
      recommendations.push('Increase cash reserves and reduce leverage');
      recommendations.push('Consider hedging strategies');
    }

    const topPerformers = indicators
      .filter(i => i.change > 0)
      .sort((a, b) => b.change - a.change)
      .slice(0, 2);

    if (topPerformers.length > 0) {
      recommendations.push(`Monitor ${topPerformers.map(i => i.name).join(' and ')} for continued strength`);
    }

    const underperformers = indicators
      .filter(i => i.change < 0)
      .sort((a, b) => a.change - b.change)
      .slice(0, 2);

    if (underperformers.length > 0) {
      recommendations.push(`Watch for potential opportunities in ${underperformers[0]!.name}`);
    }

    return recommendations;
  }

  // Missing method implementations
  private extractKeyInsights(indicators: MarketIndicator[]): string[] {
    return indicators
      .filter(i => Math.abs(i.change) > 5)
      .map(i => `${i.name}: ${i.change > 0 ? 'Strong growth' : 'Significant decline'} of ${Math.abs(i.change)}%`);
  }
  
  private identifyRiskFactors(indicators: MarketIndicator[], riskLevel: string): string[] {
    const risks: string[] = [];
    const volatileIndicators = indicators.filter(i => Math.abs(i.change) > 10);
    
    if (volatileIndicators.length > 0) {
      risks.push(`High volatility detected in ${volatileIndicators.length} indicators`);
    }
    
    return risks;
  }
  
  private findOpportunities(indicators: MarketIndicator[], marketHealth: string): string[] {
    const opportunities: string[] = [];
    const growthIndicators = indicators.filter(i => i.change > 5);
    
    if (growthIndicators.length > 0) {
      opportunities.push(`Growth potential in ${growthIndicators.map(i => i.name).join(', ')}`);
    }
    
    return opportunities;
  }
  
  private calculateEconomicScore(indicators: MarketIndicator[]): number {
    const total = indicators.reduce((sum, i) => sum + i.change, 0);
    return Math.max(0, Math.min(100, 50 + total / indicators.length));
  }
  
  private assessInflationRisk(indicators: MarketIndicator[]): number {
    const inflationIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('inflation') || 
      i.name.toLowerCase().includes('price')
    );
    
    if (inflationIndicators.length === 0) return 0;
    
    const avgChange = inflationIndicators.reduce((sum, i) => sum + i.change, 0) / inflationIndicators.length;
    return Math.max(0, Math.min(100, avgChange * 10));
  }
  
  private assessGrowthPotential(indicators: MarketIndicator[]): number {
    const growthIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('gdp') || 
      i.name.toLowerCase().includes('growth')
    );
    
    if (growthIndicators.length === 0) return 50;
    
    const avgChange = growthIndicators.reduce((sum, i) => sum + i.change, 0) / growthIndicators.length;
    return Math.max(0, Math.min(100, 50 + avgChange * 5));
  }
  
  private assessMarketStability(indicators: MarketIndicator[]): number {
    const volatility = indicators.reduce((sum, i) => sum + Math.abs(i.change), 0) / indicators.length;
    return Math.max(0, Math.min(100, 100 - volatility * 2));
  }
  
  private analyzeTrends(indicators: MarketIndicator[]): Array<{name: string; trend: 'up' | 'down' | 'stable'}> {
    return indicators.map(i => ({
      name: i.name,
      trend: i.change > 2 ? 'up' : i.change < -2 ? 'down' : 'stable'
    }));
  }
  
  private calculateVolatility(indicators: MarketIndicator[]): number {
    const changes = indicators.map(i => i.change);
    const avg = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    const variance = changes.reduce((sum, c) => sum + Math.pow(c - avg, 2), 0) / changes.length;
    return Math.sqrt(variance);
  }
  
  private calculateMomentum(indicators: MarketIndicator[]): number {
    const positiveChanges = indicators.filter(i => i.change > 0).length;
    return (positiveChanges / indicators.length) * 100;
  }
  
  private generateShortTermOutlook(trends: any[], volatility: number): string {
    if (volatility > 10) return 'Highly volatile with significant uncertainty';
    if (volatility > 5) return 'Moderate volatility expected';
    return 'Stable conditions anticipated';
  }
  
  private generateMediumTermOutlook(trends: any[], momentum: number): string {
    if (momentum > 70) return 'Strong positive momentum expected';
    if (momentum > 30) return 'Mixed outlook with selective opportunities';
    return 'Cautious approach recommended';
  }
  
  private generateLongTermOutlook(trends: any[]): string {
    const positiveCount = trends.filter(t => t.trend === 'up').length;
    if (positiveCount > trends.length * 0.6) return 'Favorable long-term prospects';
    if (positiveCount > trends.length * 0.4) return 'Balanced long-term outlook';
    return 'Challenging long-term environment';
  }
  
  private calculateForecastConfidence(indicators: MarketIndicator[], timeframe: string): number {
    const dataQuality = Math.min(100, indicators.length * 10);
    const volatilityPenalty = this.calculateVolatility(indicators) * 2;
    return Math.max(10, Math.min(95, dataQuality - volatilityPenalty));
  }
  
  private categorizeBySector(indicators: MarketIndicator[]): Map<string, MarketIndicator[]> {
    const sectors = new Map<string, MarketIndicator[]>();
    sectors.set('technology', []);
    sectors.set('finance', []);
    sectors.set('healthcare', []);
    sectors.set('energy', []);
    sectors.set('other', []);
    
    indicators.forEach(indicator => {
      const name = indicator.name.toLowerCase();
      if (name.includes('tech') || name.includes('innovation')) {
        sectors.get('technology')!.push(indicator);
      } else if (name.includes('bank') || name.includes('finance')) {
        sectors.get('finance')!.push(indicator);
      } else if (name.includes('health') || name.includes('medical')) {
        sectors.get('healthcare')!.push(indicator);
      } else if (name.includes('energy') || name.includes('oil')) {
        sectors.get('energy')!.push(indicator);
      } else {
        sectors.get('other')!.push(indicator);
      }
    });
    
    return sectors;
  }
  
  private calculateSectorPerformance(indicators: MarketIndicator[]): number {
    if (indicators.length === 0) return 50;
    const avgChange = indicators.reduce((sum, i) => sum + i.change, 0) / indicators.length;
    return Math.max(0, Math.min(100, 50 + avgChange * 2));
  }
  
  private determineSectorOutlook(indicators: MarketIndicator[]): 'positive' | 'neutral' | 'negative' {
    const performance = this.calculateSectorPerformance(indicators);
    if (performance > 70) return 'positive';
    if (performance > 30) return 'neutral';
    return 'negative';
  }

  private identifyKeyDrivers(indicators: MarketIndicator[]): string[] {
    return indicators
      .filter(i => Math.abs(i.change) > 3)
      .map(i => `${i.name}: ${i.change > 0 ? 'positive' : 'negative'} impact`)
      .slice(0, 3);
  }

  private identifySectorRisks(indicators: MarketIndicator[]): string[] {
    return indicators
      .filter(i => i.change < -5 || i.confidence < 0.5)
      .map(i => `${i.name}: ${i.change < -5 ? 'declining performance' : 'low confidence'}`)
      .slice(0, 3);
  }

  // Macroeconomic estimation methods
  private estimateGDPGrowth(indicators: MarketIndicator[]): number {
    const economicIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('gdp') || 
      i.name.toLowerCase().includes('economic')
    );
    const avgChange = economicIndicators.length > 0 
      ? economicIndicators.reduce((sum, i) => sum + i.change, 0) / economicIndicators.length
      : 2.5;
    return Math.max(-5, Math.min(8, avgChange));
  }

  private estimateInflation(indicators: MarketIndicator[]): number {
    const inflationIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('inflation') || 
      i.name.toLowerCase().includes('price')
    );
    const avgChange = inflationIndicators.length > 0 
      ? inflationIndicators.reduce((sum, i) => sum + i.change, 0) / inflationIndicators.length
      : 2.0;
    return Math.max(0, Math.min(10, avgChange));
  }

  private estimateUnemployment(indicators: MarketIndicator[]): number {
    const employmentIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('employment') || 
      i.name.toLowerCase().includes('jobs')
    );
    const avgChange = employmentIndicators.length > 0 
      ? employmentIndicators.reduce((sum, i) => sum + i.change, 0) / employmentIndicators.length
      : 4.0;
    return Math.max(1, Math.min(15, Math.abs(avgChange)));
  }

  private estimateInterestRates(indicators: MarketIndicator[]): number {
    const rateIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('rate') || 
      i.name.toLowerCase().includes('bond')
    );
    const avgChange = rateIndicators.length > 0 
      ? rateIndicators.reduce((sum, i) => sum + i.change, 0) / rateIndicators.length
      : 3.5;
    return Math.max(0, Math.min(10, avgChange));
  }

  private estimateConsumerConfidence(indicators: MarketIndicator[]): number {
    const confidenceScore = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
    return Math.round(confidenceScore * 100);
  }

  private estimateManufacturingIndex(indicators: MarketIndicator[]): number {
    const manufacturingIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('manufacturing') || 
      i.name.toLowerCase().includes('industrial')
    );
    const avgChange = manufacturingIndicators.length > 0 
      ? manufacturingIndicators.reduce((sum, i) => sum + i.change, 0) / manufacturingIndicators.length
      : 52;
    return Math.max(30, Math.min(70, 50 + avgChange));
  }

  private estimateTradeBalance(indicators: MarketIndicator[]): number {
    const tradeIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('trade') || 
      i.name.toLowerCase().includes('export')
    );
    const avgChange = tradeIndicators.length > 0 
      ? tradeIndicators.reduce((sum, i) => sum + i.change, 0) / tradeIndicators.length
      : -50;
    return avgChange * 1000; // Convert to billions
  }
}