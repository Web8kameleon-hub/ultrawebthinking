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
      console.log('Economic Analysis Complete:', {
        marketHealth,
        riskLevel,
        sentiment,
        economicScore,
        indicatorCount: indicators.length
      });
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

    for (const [sector, sectorIndicators] of sectors.entries()) {
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
      .filter(i => i.change < -1)
      .sort((a, b) => a.change - b.change);

    if (underperformers.length > 0) {
      recommendations.push(`Watch for potential opportunities in ${underperformers[0].name}`);
    }

    return recommendations;
  }

  private extractKeyInsights(indicators: MarketIndicator[]): string[] {
    const insights: string[] = [];

    const strongTrends = indicators.filter(i => Math.abs(i.change) > 2);
    if (strongTrends.length > 0) {
      insights.push(`Strong momentum detected in ${strongTrends.length} indicators`);
    }

    const highConfidence = indicators.filter(i => i.confidence > 0.8);
    if (highConfidence.length > indicators.length * 0.6) {
      insights.push('Market signals show high reliability');
    }

    const divergence = this.detectDivergence(indicators);
    if (divergence) {
      insights.push('Potential market divergence detected - exercise caution');
    }

    return insights;
  }

  private identifyRiskFactors(indicators: MarketIndicator[], riskLevel: string): string[] {
    const risks: string[] = [];

    const volatileIndicators = indicators.filter(i => Math.abs(i.change) > 3);
    if (volatileIndicators.length > 0) {
      risks.push(`High volatility in ${volatileIndicators.map(i => i.name).join(', ')}`);
    }

    if (riskLevel === 'high' || riskLevel === 'extreme') {
      risks.push('Elevated market uncertainty');
      risks.push('Potential for increased correlation during stress');
    }

    const lowConfidence = indicators.filter(i => i.confidence < 0.5);
    if (lowConfidence.length > indicators.length * 0.3) {
      risks.push('Signal reliability concerns');
    }

    return risks;
  }

  private findOpportunities(indicators: MarketIndicator[], health: string): string[] {
    const opportunities: string[] = [];

    const oversoldIndicators = indicators.filter(i => i.change < -2 && i.confidence > 0.7);
    if (oversoldIndicators.length > 0) {
      opportunities.push(`Potential value opportunities in ${oversoldIndicators.map(i => i.name).join(', ')}`);
    }

    if (health === 'good' || health === 'excellent') {
      opportunities.push('Favorable environment for growth investments');
    }

    const momentumIndicators = indicators.filter(i => i.trend === 'up' && i.change > 1);
    if (momentumIndicators.length > 0) {
      opportunities.push('Momentum strategies may be effective');
    }

    return opportunities;
  }

  private calculateEconomicScore(indicators: MarketIndicator[]): number {
    const avgChange = indicators.reduce((sum, i) => sum + i.change, 0) / indicators.length;
    const avgConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
    const stabilityScore = 1 - this.calculateVolatility(indicators);

    const score = (avgChange * 0.3 + avgConfidence * 0.4 + stabilityScore * 0.3) * 50 + 50;
    return Math.max(0, Math.min(100, score));
  }

  private assessInflationRisk(indicators: MarketIndicator[]): number {
    // Look for inflation-sensitive indicators
    const commodityIndicators = indicators.filter(i => 
      i.name.toLowerCase().includes('gold') || 
      i.name.toLowerCase().includes('oil') ||
      i.name.toLowerCase().includes('commodity')
    );

    if (commodityIndicators.length === 0) return 0.3; // Default moderate risk

    const avgCommodityChange = commodityIndicators.reduce((sum, i) => sum + i.change, 0) / commodityIndicators.length;
    return Math.max(0, Math.min(1, 0.5 + avgCommodityChange * 0.1));
  }

  private assessGrowthPotential(indicators: MarketIndicator[]): number {
    const equityIndicators = indicators.filter(i => 
      i.name.includes('S&P') || 
      i.name.includes('NASDAQ') ||
      i.name.includes('Dow')
    );

    if (equityIndicators.length === 0) return 0.5;

    const avgEquityChange = equityIndicators.reduce((sum, i) => sum + i.change, 0) / equityIndicators.length;
    const avgConfidence = equityIndicators.reduce((sum, i) => sum + i.confidence, 0) / equityIndicators.length;

    return Math.max(0, Math.min(1, 0.5 + (avgEquityChange * 0.1 + avgConfidence * 0.3)));
  }

  private assessMarketStability(indicators: MarketIndicator[]): number {
    const volatility = this.calculateVolatility(indicators);
    const confidenceVariance = this.calculateConfidenceVariance(indicators);
    
    return Math.max(0, Math.min(1, 1 - (volatility * 0.6 + confidenceVariance * 0.4)));
  }

  private calculateVolatility(indicators: MarketIndicator[]): number {
    const changes = indicators.map(i => i.change);
    const mean = changes.reduce((sum, c) => sum + c, 0) / changes.length;
    const variance = changes.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / changes.length;
    
    return Math.sqrt(variance) / 10; // Normalize
  }

  private calculateConfidenceVariance(indicators: MarketIndicator[]): number {
    const confidences = indicators.map(i => i.confidence);
    const mean = confidences.reduce((sum, c) => sum + c, 0) / confidences.length;
    const variance = confidences.reduce((sum, c) => sum + Math.pow(c - mean, 2), 0) / confidences.length;
    
    return variance;
  }

  // Additional helper methods for forecasting and sector analysis
  private analyzeTrends(indicators: MarketIndicator[]): Record<string, number> {
    const trends: Record<string, number> = {};
    
    for (const indicator of indicators) {
      trends[indicator.name] = indicator.change;
    }
    
    return trends;
  }

  private calculateMomentum(indicators: MarketIndicator[]): number {
    const momentumScore = indicators.reduce((sum, i) => {
      const momentum = i.trend === 'up' ? i.change : i.trend === 'down' ? -Math.abs(i.change) : 0;
      return sum + momentum * i.confidence;
    }, 0) / indicators.length;

    return momentumScore;
  }

  private generateShortTermOutlook(trends: Record<string, number>, volatility: number): string {
    const avgTrend = Object.values(trends).reduce((sum, t) => sum + t, 0) / Object.values(trends).length;
    
    if (volatility > 0.5) return 'High uncertainty expected with increased volatility';
    if (avgTrend > 1) return 'Positive momentum likely to continue in the short term';
    if (avgTrend < -1) return 'Downward pressure expected to persist';
    return 'Sideways movement with mixed signals anticipated';
  }

  private generateMediumTermOutlook(trends: Record<string, number>, momentum: number): string {
    if (momentum > 2) return 'Strong fundamentals support continued growth';
    if (momentum < -2) return 'Structural headwinds may persist';
    return 'Gradual stabilization expected with selective opportunities';
  }

  private generateLongTermOutlook(trends: Record<string, number>): string {
    const strongTrends = Object.values(trends).filter(t => Math.abs(t) > 2).length;
    const totalTrends = Object.values(trends).length;
    
    if (strongTrends / totalTrends > 0.6) {
      return 'Significant structural changes anticipated';
    }
    return 'Cyclical patterns expected to normalize over time';
  }

  private calculateForecastConfidence(indicators: MarketIndicator[], timeframe: 'short' | 'medium' | 'long'): number {
    const baseConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
    
    // Confidence decreases with longer timeframes
    const timeMultiplier = timeframe === 'short' ? 1 : timeframe === 'medium' ? 0.8 : 0.6;
    
    return Math.max(0.1, Math.min(0.9, baseConfidence * timeMultiplier));
  }

  private categorizeBySector(indicators: MarketIndicator[]): Map<string, MarketIndicator[]> {
    const sectors = new Map<string, MarketIndicator[]>();
    
    for (const indicator of indicators) {
      let sector = 'General';
      
      if (indicator.name.includes('S&P') || indicator.name.includes('NASDAQ')) sector = 'Equities';
      else if (indicator.name.includes('USD') || indicator.name.includes('EUR')) sector = 'Currencies';
      else if (indicator.name.includes('Gold') || indicator.name.includes('Oil')) sector = 'Commodities';
      else if (indicator.name.includes('Bond')) sector = 'Fixed Income';
      
      if (!sectors.has(sector)) sectors.set(sector, []);
      sectors.get(sector)!.push(indicator);
    }
    
    return sectors;
  }

  private calculateSectorPerformance(indicators: MarketIndicator[]): number {
    return indicators.reduce((sum, i) => sum + i.change * i.confidence, 0) / indicators.length;
  }

  private determineSectorOutlook(indicators: MarketIndicator[]): 'positive' | 'neutral' | 'negative' {
    const performance = this.calculateSectorPerformance(indicators);
    
    if (performance > 1) return 'positive';
    if (performance < -1) return 'negative';
    return 'neutral';
  }

  private identifyKeyDrivers(indicators: MarketIndicator[]): string[] {
    return indicators
      .filter(i => Math.abs(i.change) > 1 && i.confidence > 0.7)
      .map(i => `${i.name}: ${i.change > 0 ? 'Strong positive' : 'Significant negative'} impact`)
      .slice(0, 3);
  }

  private identifySectorRisks(indicators: MarketIndicator[]): string[] {
    const risks: string[] = [];
    
    const volatile = indicators.filter(i => Math.abs(i.change) > 3);
    if (volatile.length > 0) {
      risks.push(`High volatility in ${volatile.map(i => i.name).join(', ')}`);
    }
    
    const lowConfidence = indicators.filter(i => i.confidence < 0.5);
    if (lowConfidence.length > 0) {
      risks.push('Signal reliability concerns');
    }
    
    return risks;
  }

  private detectDivergence(indicators: MarketIndicator[]): boolean {
    // Simple divergence detection - check if major indicators move in opposite directions
    const major = indicators.filter(i => i.confidence > 0.8);
    if (major.length < 2) return false;
    
    const positive = major.filter(i => i.change > 0).length;
    const negative = major.filter(i => i.change < 0).length;
    
    return Math.abs(positive - negative) < major.length * 0.2; // Mixed signals
  }

  // Macroeconomic estimation methods
  private estimateGDPGrowth(indicators: MarketIndicator[]): number {
    const equityPerformance = indicators
      .filter(i => i.name.includes('S&P') || i.name.includes('NASDAQ'))
      .reduce((sum, i) => sum + i.change, 0) / 2;
    
    return Math.max(-5, Math.min(8, 2.5 + equityPerformance * 0.3));
  }

  private estimateInflation(indicators: MarketIndicator[]): number {
    const commodityChange = indicators
      .filter(i => i.name.includes('Gold') || i.name.includes('Oil'))
      .reduce((sum, i) => sum + i.change, 0);
    
    return Math.max(0, Math.min(10, 2.5 + commodityChange * 0.1));
  }

  private estimateUnemployment(indicators: MarketIndicator[]): number {
    const equityPerformance = indicators
      .filter(i => i.name.includes('S&P'))
      .reduce((sum, i) => sum + i.change, 0);
    
    return Math.max(2, Math.min(15, 5.5 - equityPerformance * 0.2));
  }

  private estimateInterestRates(indicators: MarketIndicator[]): number {
    // Simplified relationship with bond performance and inflation signals
    return Math.max(0, Math.min(10, 3.5 + Math.random() * 2 - 1));
  }

  private estimateConsumerConfidence(indicators: MarketIndicator[]): number {
    const marketHealth = this.assessMarketHealth(indicators);
    const healthScore = { excellent: 90, good: 75, moderate: 60, poor: 45, critical: 30 };
    
    return healthScore[marketHealth] + (Math.random() * 10 - 5);
  }

  private estimateManufacturingIndex(indicators: MarketIndicator[]): number {
    return Math.max(30, Math.min(70, 50 + Math.random() * 10 - 5));
  }

  private estimateTradeBalance(indicators: MarketIndicator[]): number {
    const currencyStrength = indicators
      .filter(i => i.name.includes('USD'))
      .reduce((sum, i) => sum + i.change, 0);
    
    return -50 - currencyStrength * 10 + Math.random() * 20 - 10;
  }
}
