/**
 * EconomicsEngine.ts
 * Advanced economics and financial analysis engine
 * © Web8 UltraThinking – Ledjan Ahmati
 */

export interface EconomicIndicator {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  trend: 'bullish' | 'bearish' | 'neutral';
  timeframe: 'daily' | 'weekly' | 'monthly' | 'yearly';
  confidence: number;
  timestamp: Date;
}

export interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  marketCap: number;
  change24h: number;
  volatility: number;
}

export interface EconomicForecast {
  indicator: string;
  currentValue: number;
  predictedValue: number;
  timeHorizon: number; // days
  confidence: number;
  factors: string[];
}

export class EconomicsEngine {
  private indicators: Map<string, EconomicIndicator> = new Map();
  private marketData: Map<string, MarketData> = new Map();
  private forecasts: Map<string, EconomicForecast> = new Map();

  constructor() {
    this.initializeIndicators();
    this.initializeMarketData();
  }

  private initializeIndicators(): void {
    const indicators = [
      {
        id: 'gdp_growth',
        name: 'GDP Growth Rate',
        value: 2.8,
        unit: '%',
        change: 0.3,
        trend: 'bullish' as const,
        timeframe: 'yearly' as const,
        confidence: 0.85
      },
      {
        id: 'inflation_rate',
        name: 'Inflation Rate',
        value: 3.2,
        unit: '%',
        change: -0.1,
        trend: 'bearish' as const,
        timeframe: 'monthly' as const,
        confidence: 0.92
      },
      {
        id: 'unemployment_rate',
        name: 'Unemployment Rate',
        value: 4.1,
        unit: '%',
        change: -0.2,
        trend: 'bullish' as const,
        timeframe: 'monthly' as const,
        confidence: 0.88
      },
      {
        id: 'interest_rate',
        name: 'Federal Interest Rate',
        value: 5.25,
        unit: '%',
        change: 0.0,
        trend: 'neutral' as const,
        timeframe: 'monthly' as const,
        confidence: 0.95
      }
    ];

    indicators.forEach(indicator => {
      this.indicators.set(indicator.id, {
        ...indicator,
        timestamp: new Date()
      });
    });
  }

  private initializeMarketData(): void {
    const markets = [
      {
        symbol: 'BTC',
        price: 45000,
        volume: 2500000000,
        marketCap: 875000000000,
        change24h: 2.5,
        volatility: 0.15
      },
      {
        symbol: 'ETH',
        price: 2800,
        volume: 1200000000,
        marketCap: 340000000000,
        change24h: 1.8,
        volatility: 0.18
      },
      {
        symbol: 'SPY',
        price: 430,
        volume: 85000000,
        marketCap: 400000000000,
        change24h: 0.5,
        volatility: 0.08
      }
    ];

    markets.forEach(market => {
      this.marketData.set(market.symbol, market);
    });
  }

  public analyzeEconomicTrends(): any {
    const indicators = Array.from(this.indicators.values());
    const positiveIndicators = indicators.filter(i => i.trend === 'bullish').length;
    const negativeIndicators = indicators.filter(i => i.trend === 'bearish').length;
    const neutralIndicators = indicators.filter(i => i.trend === 'neutral').length;

    const overallSentiment = positiveIndicators > negativeIndicators ? 'positive' : 
                             negativeIndicators > positiveIndicators ? 'negative' : 'neutral';

    return {
      overall_sentiment: overallSentiment,
      sentiment_strength: Math.abs(positiveIndicators - negativeIndicators) / indicators.length,
      key_indicators: {
        positive: indicators.filter(i => i.trend === 'bullish').map(i => i.name),
        negative: indicators.filter(i => i.trend === 'bearish').map(i => i.name),
        neutral: indicators.filter(i => i.trend === 'neutral').map(i => i.name)
      },
      risk_level: this.calculateRiskLevel(indicators),
      market_stability: this.assessMarketStability(),
      analysis_timestamp: new Date().toISOString()
    };
  }

  public generateEconomicForecast(days: number = 30): EconomicForecast[] {
    const forecasts: EconomicForecast[] = [];

    this.indicators.forEach((indicator, id) => {
      const volatility = this.calculateVolatility(indicator);
      const trendMultiplier = indicator.trend === 'bullish' ? 1.1 : 
                             indicator.trend === 'bearish' ? 0.9 : 1.0;
      
      const randomFactor = 0.95 + (Math.random() * 0.1); // ±5% random variation
      const predictedValue = indicator.value * trendMultiplier * randomFactor;

      forecasts.push({
        indicator: indicator.name,
        currentValue: indicator.value,
        predictedValue: Math.round(predictedValue * 100) / 100,
        timeHorizon: days,
        confidence: Math.max(0.6, indicator.confidence - (days / 365) * 0.3),
        factors: this.getInfluencingFactors(id)
      });
    });

    return forecasts;
  }

  public calculateMarketMetrics(): any {
    const markets = Array.from(this.marketData.values());
    
    const totalMarketCap = markets.reduce((sum, m) => sum + m.marketCap, 0);
    const avgVolatility = markets.reduce((sum, m) => sum + m.volatility, 0) / markets.length;
    const avgChange = markets.reduce((sum, m) => sum + m.change24h, 0) / markets.length;

    return {
      total_market_cap: totalMarketCap,
      average_volatility: Math.round(avgVolatility * 1000) / 1000,
      average_24h_change: Math.round(avgChange * 100) / 100,
      market_dominance: this.calculateMarketDominance(markets),
      liquidity_index: this.calculateLiquidityIndex(markets),
      fear_greed_index: this.calculateFearGreedIndex(markets),
      calculated_at: new Date().toISOString()
    };
  }

  public performRiskAnalysis(): any {
    const indicators = Array.from(this.indicators.values());
    const markets = Array.from(this.marketData.values());

    const economicRisk = this.assessEconomicRisk(indicators);
    const marketRisk = this.assessMarketRisk(markets);
    const systemicRisk = this.assessSystemicRisk(indicators, markets);

    return {
      economic_risk: {
        level: economicRisk.level,
        score: economicRisk.score,
        factors: economicRisk.factors
      },
      market_risk: {
        level: marketRisk.level,
        score: marketRisk.score,
        factors: marketRisk.factors
      },
      systemic_risk: {
        level: systemicRisk.level,
        score: systemicRisk.score,
        factors: systemicRisk.factors
      },
      overall_risk: this.calculateOverallRisk(economicRisk, marketRisk, systemicRisk),
      recommendations: this.generateRiskRecommendations(economicRisk, marketRisk, systemicRisk),
      analysis_timestamp: new Date().toISOString()
    };
  }

  private calculateVolatility(indicator: EconomicIndicator): number {
    // Simplified volatility calculation
    const baseVolatility = 0.05; // 5% base volatility
    const trendMultiplier = indicator.trend === 'neutral' ? 1.5 : 1.0;
    return baseVolatility * trendMultiplier;
  }

  private calculateRiskLevel(indicators: EconomicIndicator[]): string {
    const avgConfidence = indicators.reduce((sum, i) => sum + i.confidence, 0) / indicators.length;
    const volatilityCount = indicators.filter(i => Math.abs(i.change) > 0.5).length;
    
    if (avgConfidence < 0.7 || volatilityCount > indicators.length / 2) return 'high';
    if (avgConfidence < 0.8 || volatilityCount > indicators.length / 3) return 'medium';
    return 'low';
  }

  private assessMarketStability(): number {
    const markets = Array.from(this.marketData.values());
    const avgVolatility = markets.reduce((sum, m) => sum + m.volatility, 0) / markets.length;
    
    // Stability is inverse of volatility (higher volatility = lower stability)
    return Math.max(0, Math.min(1, 1 - (avgVolatility * 5)));
  }

  private getInfluencingFactors(indicatorId: string): string[] {
    const factorMap: Record<string, string[]> = {
      gdp_growth: ['Consumer Spending', 'Business Investment', 'Government Policy', 'International Trade'],
      inflation_rate: ['Energy Prices', 'Supply Chain', 'Monetary Policy', 'Labor Costs'],
      unemployment_rate: ['Economic Growth', 'Technological Changes', 'Government Programs', 'Industry Trends'],
      interest_rate: ['Federal Reserve Policy', 'Inflation Expectations', 'Economic Indicators', 'Global Markets']
    };

    return factorMap[indicatorId] || ['Market Conditions', 'Economic Policy', 'Global Events'];
  }

  private calculateMarketDominance(markets: MarketData[]): any {
    const totalCap = markets.reduce((sum, m) => sum + m.marketCap, 0);
    
    return markets.map(market => ({
      symbol: market.symbol,
      dominance: Math.round((market.marketCap / totalCap) * 10000) / 100 // percentage with 2 decimals
    }));
  }

  private calculateLiquidityIndex(markets: MarketData[]): number {
    const avgVolume = markets.reduce((sum, m) => sum + m.volume, 0) / markets.length;
    const normalizedLiquidity = Math.min(1, avgVolume / 1000000000); // Normalize to 1B volume
    
    return Math.round(normalizedLiquidity * 100);
  }

  private calculateFearGreedIndex(markets: MarketData[]): number {
    const avgChange = markets.reduce((sum, m) => sum + m.change24h, 0) / markets.length;
    const avgVolatility = markets.reduce((sum, m) => sum + m.volatility, 0) / markets.length;
    
    // Simplified Fear & Greed calculation
    let fearGreed = 50; // Neutral starting point
    fearGreed += avgChange * 10; // Positive change increases greed
    fearGreed -= avgVolatility * 100; // High volatility increases fear
    
    return Math.max(0, Math.min(100, Math.round(fearGreed)));
  }

  private assessEconomicRisk(indicators: EconomicIndicator[]): any {
    let riskScore = 0;
    const factors: string[] = [];

    indicators.forEach(indicator => {
      if (indicator.id === 'inflation_rate' && indicator.value > 4) {
        riskScore += 25;
        factors.push('High Inflation');
      }
      if (indicator.id === 'unemployment_rate' && indicator.value > 6) {
        riskScore += 20;
        factors.push('High Unemployment');
      }
      if (indicator.id === 'gdp_growth' && indicator.value < 1) {
        riskScore += 30;
        factors.push('Low GDP Growth');
      }
    });

    const level = riskScore > 50 ? 'high' : riskScore > 25 ? 'medium' : 'low';
    
    return { level, score: riskScore, factors };
  }

  private assessMarketRisk(markets: MarketData[]): any {
    let riskScore = 0;
    const factors = [];

    const avgVolatility = markets.reduce((sum, m) => sum + m.volatility, 0) / markets.length;
    if (avgVolatility > 0.2) {
      riskScore += 30;
      factors.push('High Market Volatility');
    }

    const negativeChangeCount = markets.filter(m => m.change24h < -5).length;
    if (negativeChangeCount > markets.length / 2) {
      riskScore += 25;
      factors.push('Widespread Market Decline');
    }

    const level = riskScore > 40 ? 'high' : riskScore > 20 ? 'medium' : 'low';
    
    return { level, score: riskScore, factors };
  }

  private assessSystemicRisk(indicators: EconomicIndicator[], markets: MarketData[]): any {
    let riskScore = 0;
    const factors = [];

    // Check for correlation between economic indicators and market performance
    const economicTrend = indicators.filter(i => i.trend === 'bearish').length > indicators.length / 2;
    const marketTrend = markets.filter(m => m.change24h < 0).length > markets.length / 2;

    if (economicTrend && marketTrend) {
      riskScore += 40;
      factors.push('Economic and Market Alignment Risk');
    }

    const level = riskScore > 30 ? 'high' : riskScore > 15 ? 'medium' : 'low';
    
    return { level, score: riskScore, factors };
  }

  private calculateOverallRisk(economic: any, market: any, systemic: any): any {
    const weightedScore = (economic.score * 0.4) + (market.score * 0.4) + (systemic.score * 0.2);
    const level = weightedScore > 40 ? 'high' : weightedScore > 20 ? 'medium' : 'low';
    
    return {
      level,
      score: Math.round(weightedScore),
      confidence: 0.85
    };
  }

  private generateRiskRecommendations(economic: any, market: any, systemic: any): string[] {
    const recommendations = [];

    if (economic.level === 'high') {
      recommendations.push('Monitor economic indicators closely and consider defensive investment strategies');
    }

    if (market.level === 'high') {
      recommendations.push('Increase cash reserves and reduce portfolio volatility');
    }

    if (systemic.level === 'high') {
      recommendations.push('Diversify across uncorrelated assets and consider hedging strategies');
    }

    if (recommendations.length === 0) {
      recommendations.push('Current risk levels are manageable - maintain balanced approach');
    }

    return recommendations;
  }

  public getIndicators(): Map<string, EconomicIndicator> {
    return this.indicators;
  }

  public getMarketData(): Map<string, MarketData> {
    return this.marketData;
  }

  public updateIndicator(id: string, value: number): boolean {
    const indicator = this.indicators.get(id);
    if (!indicator) return false;

    const change = value - indicator.value;
    indicator.value = value;
    indicator.change = change;
    indicator.timestamp = new Date();
    
    // Update trend based on change
    if (Math.abs(change) < 0.1) {
      indicator.trend = 'neutral';
    } else {
      indicator.trend = change > 0 ? 'bullish' : 'bearish';
    }

    return true;
  }
}
