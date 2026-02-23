interface CryptoMetrics {
  symbol: string;
  price: number;
  volume: number;
  marketCap: number;
  change24h: number;
  volatility: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface CryptoAnalysis {
  marketOverview: {
    totalMarketCap: number;
    dominanceIndex: Record<string, number>;
    fearGreedIndex: number;
    marketPhase: 'accumulation' | 'markup' | 'distribution' | 'markdown';
  };
  technicalAnalysis: {
    support: number;
    resistance: number;
    rsi: number;
    macd: { signal: 'buy' | 'sell' | 'hold'; strength: number };
    bollingerBands: { upper: number; middle: number; lower: number };
  };
  sentimentAnalysis: {
    socialSentiment: number; // -1 to 1
    newsImpact: number; // -1 to 1
    whaleActivity: 'accumulating' | 'distributing' | 'neutral';
    institutionalFlow: number;
  };
  riskMetrics: {
    volatilityRank: number; // 1-10
    liquidityScore: number; // 0-1
    correlationRisk: number; // 0-1
    regulatoryRisk: 'low' | 'medium' | 'high';
  };
  predictions: {
    shortTerm: { target: number; probability: number; timeframe: '24h' };
    mediumTerm: { target: number; probability: number; timeframe: '7d' };
    longTerm: { target: number; probability: number; timeframe: '30d' };
  };
  tradingSignals: Array<{
    type: 'buy' | 'sell' | 'hold';
    strength: number;
    reasoning: string;
    confidence: number;
  }>;
  deFiMetrics?: {
    tvl: number;
    yieldRate: number;
    liquidityPools: number;
    activeUsers: number;
  };
}

interface BlockchainMetrics {
  networkHash: number;
  transactionCount: number;
  activeAddresses: number;
  fees: { average: number; median: number };
  congestion: number; // 0-1
}

interface CryptoPortfolioAnalysis {
  allocation: Record<string, number>;
  riskScore: number;
  diversificationIndex: number;
  expectedReturn: number;
  valueAtRisk: number;
  recommendations: string[];
}

export class CryptoAnalysisEngine {
  private debugMode: boolean;
  private priceHistory: Map<string, number[]>;
  private technicalIndicators: Map<string, any>;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
    this.priceHistory = new Map();
    this.technicalIndicators = new Map();
    this.initializeTechnicalModels();
  }

  /**
   * Comprehensive cryptocurrency analysis
   */
  async analyzeCrypto(cryptoData: CryptoMetrics[]): Promise<CryptoAnalysis> {
    if (cryptoData.length === 0) {
      throw new Error('No crypto data provided');
    }

    // Market overview analysis
    const marketOverview = this.analyzeMarketOverview(cryptoData);
    
    // Technical analysis for the primary asset (first in array)
    const primaryAsset = cryptoData[0];
    const technicalAnalysis = this.performTechnicalAnalysis(primaryAsset);
    
    // Sentiment analysis
    const sentimentAnalysis = this.analyzeSentiment(cryptoData);
    
    // Risk assessment
    const riskMetrics = this.assessRisks(cryptoData);
    
    // Price predictions
    const predictions = this.generatePredictions(primaryAsset);
    
    // Trading signals
    const tradingSignals = this.generateTradingSignals(cryptoData, technicalAnalysis);
    
    // DeFi metrics (if applicable)
    const deFiMetrics = this.analyzeDeFiMetrics(cryptoData);

    if (this.debugMode) {
      console.log('Crypto Analysis Complete:', {
        assetsAnalyzed: cryptoData.length,
        marketPhase: marketOverview.marketPhase,
        fearGreedIndex: marketOverview.fearGreedIndex,
        primaryAsset: primaryAsset.symbol
      });
    }

    return {
      marketOverview,
      technicalAnalysis,
      sentimentAnalysis,
      riskMetrics,
      predictions,
      tradingSignals,
      deFiMetrics
    };
  }

  /**
   * Analyze portfolio allocation and risk
   */
  async analyzePortfolio(cryptoData: CryptoMetrics[], holdings: Record<string, number>): Promise<CryptoPortfolioAnalysis> {
    const totalValue = Object.entries(holdings).reduce((sum, [symbol, amount]) => {
      const crypto = cryptoData.find(c => c.symbol === symbol);
      return sum + (crypto ? crypto.price * amount : 0);
    }, 0);

    // Calculate allocation percentages
    const allocation: Record<string, number> = {};
    for (const [symbol, amount] of Object.entries(holdings)) {
      const crypto = cryptoData.find(c => c.symbol === symbol);
      if (crypto) {
        allocation[symbol] = (crypto.price * amount) / totalValue;
      }
    }

    // Calculate risk metrics
    const riskScore = this.calculatePortfolioRisk(cryptoData, allocation);
    const diversificationIndex = this.calculateDiversificationIndex(allocation);
    const expectedReturn = this.calculateExpectedReturn(cryptoData, allocation);
    const valueAtRisk = this.calculateVaR(cryptoData, allocation);

    // Generate recommendations
    const recommendations = this.generatePortfolioRecommendations(allocation, riskScore);

    return {
      allocation,
      riskScore,
      diversificationIndex,
      expectedReturn,
      valueAtRisk,
      recommendations
    };
  }

  /**
   * Real-time arbitrage opportunities detection
   */
  async detectArbitrageOpportunities(cryptoData: CryptoMetrics[]): Promise<Array<{
    symbol: string;
    opportunity: number;
    exchanges: string[];
    profitPotential: number;
    risk: 'low' | 'medium' | 'high';
  }>> {
    const opportunities: Array<{
      symbol: string;
      opportunity: number;
      exchanges: string[];
      profitPotential: number;
      risk: 'low' | 'medium' | 'high';
    }> = [];

    // Simulate arbitrage detection (in real implementation, would compare across exchanges)
    for (const crypto of cryptoData) {
      // Simulate price differences across exchanges
      const exchangePrices = this.simulateExchangePrices(crypto.price);
      const maxPrice = Math.max(...exchangePrices.prices);
      const minPrice = Math.min(...exchangePrices.prices);
      const spread = ((maxPrice - minPrice) / minPrice) * 100;

      if (spread > 0.5) { // Minimum 0.5% spread for viable arbitrage
        opportunities.push({
          symbol: crypto.symbol,
          opportunity: spread,
          exchanges: ['Exchange A', 'Exchange B'],
          profitPotential: spread - 0.2, // Minus trading fees
          risk: spread > 2 ? 'high' : spread > 1 ? 'medium' : 'low'
        });
      }
    }

    return opportunities.sort((a, b) => b.profitPotential - a.profitPotential);
  }

  /**
   * DeFi yield farming analysis
   */
  async analyzeYieldFarming(cryptoData: CryptoMetrics[]): Promise<Array<{
    protocol: string;
    apr: number;
    tvl: number;
    riskLevel: 'low' | 'medium' | 'high' | 'extreme';
    impermanentLossRisk: number;
    recommendations: string[];
  }>> {
    const yieldOpportunities = [];

    // Simulate DeFi protocols analysis
    const protocols = ['Uniswap V3', 'Compound', 'Aave', 'PancakeSwap', 'SushiSwap'];
    
    for (const protocol of protocols) {
      const apr = Math.random() * 50 + 5; // 5-55% APR
      const tvl = Math.random() * 1000000000 + 100000000; // $100M - $1B TVL
      const riskLevel = this.assessProtocolRisk(apr, tvl);
      const impermanentLossRisk = Math.random() * 0.3; // 0-30% IL risk
      const recommendations = this.generateYieldRecommendations(protocol, apr, riskLevel);

      yieldOpportunities.push({
        protocol,
        apr,
        tvl,
        riskLevel,
        impermanentLossRisk,
        recommendations
      });
    }

    return yieldOpportunities.sort((a, b) => this.calculateRiskAdjustedReturn(b) - this.calculateRiskAdjustedReturn(a));
  }

  // Private utility methods
  private initializeTechnicalModels(): void {
    // Initialize technical analysis models and parameters
    this.technicalIndicators.set('rsi', { period: 14, overbought: 70, oversold: 30 });
    this.technicalIndicators.set('macd', { fast: 12, slow: 26, signal: 9 });
    this.technicalIndicators.set('bollinger', { period: 20, stdDev: 2 });
  }

  private analyzeMarketOverview(cryptoData: CryptoMetrics[]): {
    totalMarketCap: number;
    dominanceIndex: Record<string, number>;
    fearGreedIndex: number;
    marketPhase: 'accumulation' | 'markup' | 'distribution' | 'markdown';
  } {
    const totalMarketCap = cryptoData.reduce((sum, crypto) => sum + crypto.marketCap, 0);
    
    // Calculate dominance index
    const dominanceIndex: Record<string, number> = {};
    for (const crypto of cryptoData) {
      dominanceIndex[crypto.symbol] = (crypto.marketCap / totalMarketCap) * 100;
    }

    // Calculate Fear & Greed Index (simplified)
    const avgChange = cryptoData.reduce((sum, crypto) => sum + crypto.change24h, 0) / cryptoData.length;
    const avgVolatility = cryptoData.reduce((sum, crypto) => sum + crypto.volatility, 0) / cryptoData.length;
    const fearGreedIndex = Math.max(0, Math.min(100, 50 + avgChange * 5 - avgVolatility * 100));

    // Determine market phase
    const marketPhase = this.determineMarketPhase(avgChange, avgVolatility, fearGreedIndex);

    return {
      totalMarketCap,
      dominanceIndex,
      fearGreedIndex,
      marketPhase
    };
  }

  private performTechnicalAnalysis(crypto: CryptoMetrics): {
    support: number;
    resistance: number;
    rsi: number;
    macd: { signal: 'buy' | 'sell' | 'hold'; strength: number };
    bollingerBands: { upper: number; middle: number; lower: number };
  } {
    // Generate simulated price history for technical analysis
    const priceHistory = this.generatePriceHistory(crypto.price, crypto.volatility);
    
    // Calculate support and resistance
    const { support, resistance } = this.calculateSupportResistance(priceHistory);
    
    // Calculate RSI
    const rsi = this.calculateRSI(priceHistory);
    
    // Calculate MACD
    const macd = this.calculateMACD(priceHistory);
    
    // Calculate Bollinger Bands
    const bollingerBands = this.calculateBollingerBands(priceHistory);

    return {
      support,
      resistance,
      rsi,
      macd,
      bollingerBands
    };
  }

  private analyzeSentiment(cryptoData: CryptoMetrics[]): {
    socialSentiment: number;
    newsImpact: number;
    whaleActivity: 'accumulating' | 'distributing' | 'neutral';
    institutionalFlow: number;
  } {
    // Simulate sentiment analysis based on market data
    const avgSentiment = cryptoData.reduce((sum, crypto) => {
      const sentimentScore = crypto.sentiment === 'bullish' ? 1 : crypto.sentiment === 'bearish' ? -1 : 0;
      return sum + sentimentScore;
    }, 0) / cryptoData.length;

    const socialSentiment = Math.max(-1, Math.min(1, avgSentiment + (Math.random() - 0.5) * 0.4));
    const newsImpact = (Math.random() - 0.5) * 2; // Random news impact
    const whaleActivity = this.determineWhaleActivity(cryptoData);
    const institutionalFlow = socialSentiment * 0.7 + (Math.random() - 0.5) * 0.6;

    return {
      socialSentiment,
      newsImpact,
      whaleActivity,
      institutionalFlow
    };
  }

  private assessRisks(cryptoData: CryptoMetrics[]): {
    volatilityRank: number;
    liquidityScore: number;
    correlationRisk: number;
    regulatoryRisk: 'low' | 'medium' | 'high';
  } {
    const avgVolatility = cryptoData.reduce((sum, crypto) => sum + crypto.volatility, 0) / cryptoData.length;
    const volatilityRank = Math.min(10, Math.ceil(avgVolatility * 100));

    const avgVolume = cryptoData.reduce((sum, crypto) => sum + crypto.volume, 0) / cryptoData.length;
    const liquidityScore = Math.min(1, avgVolume / 1000000000); // Normalize by $1B volume

    const correlationRisk = this.calculateCorrelationRisk(cryptoData);
    const regulatoryRisk = this.assessRegulatoryRisk(cryptoData);

    return {
      volatilityRank,
      liquidityScore,
      correlationRisk,
      regulatoryRisk
    };
  }

  private generatePredictions(crypto: CryptoMetrics): {
    shortTerm: { target: number; probability: number; timeframe: '24h' };
    mediumTerm: { target: number; probability: number; timeframe: '7d' };
    longTerm: { target: number; probability: number; timeframe: '30d' };
  } {
    const currentPrice = crypto.price;
    const volatility = crypto.volatility;
    const trend = crypto.change24h > 0 ? 1 : -1;

    // Short-term prediction (24h)
    const shortTermVariation = volatility * 0.5 * trend;
    const shortTermTarget = currentPrice * (1 + shortTermVariation);
    const shortTermProbability = Math.max(0.4, 0.8 - volatility);

    // Medium-term prediction (7d)
    const mediumTermVariation = volatility * 1.5 * trend * (0.8 + Math.random() * 0.4);
    const mediumTermTarget = currentPrice * (1 + mediumTermVariation);
    const mediumTermProbability = Math.max(0.3, 0.7 - volatility * 1.2);

    // Long-term prediction (30d)
    const longTermVariation = volatility * 3 * trend * (0.6 + Math.random() * 0.8);
    const longTermTarget = currentPrice * (1 + longTermVariation);
    const longTermProbability = Math.max(0.2, 0.6 - volatility * 1.5);

    return {
      shortTerm: { target: shortTermTarget, probability: shortTermProbability, timeframe: '24h' },
      mediumTerm: { target: mediumTermTarget, probability: mediumTermProbability, timeframe: '7d' },
      longTerm: { target: longTermTarget, probability: longTermProbability, timeframe: '30d' }
    };
  }

  private generateTradingSignals(cryptoData: CryptoMetrics[], technical: any): Array<{
    type: 'buy' | 'sell' | 'hold';
    strength: number;
    reasoning: string;
    confidence: number;
  }> {
    const signals: Array<{
      type: 'buy' | 'sell' | 'hold';
      strength: number;
      reasoning: string;
      confidence: number;
    }> = [];

    const primary = cryptoData[0];

    // RSI-based signal
    if (technical.rsi < 30) {
      signals.push({
        type: 'buy',
        strength: 0.8,
        reasoning: 'RSI indicates oversold conditions',
        confidence: 0.75
      });
    } else if (technical.rsi > 70) {
      signals.push({
        type: 'sell',
        strength: 0.7,
        reasoning: 'RSI indicates overbought conditions',
        confidence: 0.7
      });
    }

    // MACD-based signal
    signals.push({
      type: technical.macd.signal,
      strength: technical.macd.strength,
      reasoning: `MACD ${technical.macd.signal} signal detected`,
      confidence: technical.macd.strength
    });

    // Volume-based signal
    if (primary.volume > this.getAverageVolume(primary.symbol)) {
      signals.push({
        type: primary.change24h > 0 ? 'buy' : 'sell',
        strength: 0.6,
        reasoning: 'High volume confirms price movement',
        confidence: 0.65
      });
    }

    // Sentiment-based signal
    if (primary.sentiment === 'bullish' && primary.change24h > 2) {
      signals.push({
        type: 'buy',
        strength: 0.7,
        reasoning: 'Strong bullish sentiment with positive momentum',
        confidence: 0.6
      });
    }

    return signals.sort((a, b) => (b.strength * b.confidence) - (a.strength * a.confidence));
  }

  private analyzeDeFiMetrics(cryptoData: CryptoMetrics[]): {
    tvl: number;
    yieldRate: number;
    liquidityPools: number;
    activeUsers: number;
  } | undefined {
    // Check if any crypto in the data is DeFi-related
    const deFiTokens = cryptoData.filter(crypto => 
      ['UNI', 'AAVE', 'COMP', 'SUSHI', 'CAKE'].includes(crypto.symbol)
    );

    if (deFiTokens.length === 0) {return undefined;}

    // Simulate DeFi metrics
    const tvl = Math.random() * 50000000000 + 10000000000; // $10B - $60B
    const yieldRate = Math.random() * 20 + 5; // 5-25% APY
    const liquidityPools = Math.floor(Math.random() * 1000 + 100); // 100-1100 pools
    const activeUsers = Math.floor(Math.random() * 1000000 + 100000); // 100K-1.1M users

    return {
      tvl,
      yieldRate,
      liquidityPools,
      activeUsers
    };
  }

  // Technical analysis helper methods
  private generatePriceHistory(currentPrice: number, volatility: number, periods = 50): number[] {
    const history = [currentPrice];
    
    for (let i = 1; i < periods; i++) {
      const change = (Math.random() - 0.5) * volatility * 2;
      const newPrice = history[i - 1] * (1 + change);
      history.push(Math.max(0.01, newPrice)); // Prevent negative prices
    }
    
    return history;
  }

  private calculateSupportResistance(prices: number[]): { support: number; resistance: number } {
    const highs = [];
    const lows = [];
    
    for (let i = 1; i < prices.length - 1; i++) {
      if (prices[i] > prices[i - 1] && prices[i] > prices[i + 1]) {
        highs.push(prices[i]);
      }
      if (prices[i] < prices[i - 1] && prices[i] < prices[i + 1]) {
        lows.push(prices[i]);
      }
    }
    
    const resistance = highs.length > 0 ? Math.max(...highs) : Math.max(...prices) * 1.05;
    const support = lows.length > 0 ? Math.min(...lows) : Math.min(...prices) * 0.95;
    
    return { support, resistance };
  }

  private calculateRSI(prices: number[], period = 14): number {
    if (prices.length < period + 1) {return 50;} // Default neutral RSI
    
    const gains = [];
    const losses = [];
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? Math.abs(change) : 0);
    }
    
    const avgGain = gains.slice(-period).reduce((a, b) => a + b, 0) / period;
    const avgLoss = losses.slice(-period).reduce((a, b) => a + b, 0) / period;
    
    if (avgLoss === 0) {return 100;}
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { signal: 'buy' | 'sell' | 'hold'; strength: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    
    // Simplified MACD signal
    if (macdLine > 0 && Math.abs(macdLine) > prices[prices.length - 1] * 0.01) {
      return { signal: 'buy', strength: Math.min(1, Math.abs(macdLine) / (prices[prices.length - 1] * 0.05)) };
    } else if (macdLine < 0 && Math.abs(macdLine) > prices[prices.length - 1] * 0.01) {
      return { signal: 'sell', strength: Math.min(1, Math.abs(macdLine) / (prices[prices.length - 1] * 0.05)) };
    }
    
    return { signal: 'hold', strength: 0.3 };
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) {return 0;}
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateBollingerBands(prices: number[], period = 20, stdDev = 2): {
    upper: number;
    middle: number;
    lower: number;
  } {
    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    
    const variance = recentPrices.reduce((sum, price) => sum + Math.pow(price - sma, 2), 0) / recentPrices.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: sma + (standardDeviation * stdDev),
      middle: sma,
      lower: sma - (standardDeviation * stdDev)
    };
  }

  // Portfolio analysis methods
  private calculatePortfolioRisk(cryptoData: CryptoMetrics[], allocation: Record<string, number>): number {
    let weightedRisk = 0;
    
    for (const [symbol, weight] of Object.entries(allocation)) {
      const crypto = cryptoData.find(c => c.symbol === symbol);
      if (crypto) {
        weightedRisk += weight * crypto.volatility;
      }
    }
    
    return Math.min(1, weightedRisk);
  }

  private calculateDiversificationIndex(allocation: Record<string, number>): number {
    const weights = Object.values(allocation);
    const herfindahl = weights.reduce((sum, weight) => sum + weight * weight, 0);
    return 1 - herfindahl; // Higher value = more diversified
  }

  private calculateExpectedReturn(cryptoData: CryptoMetrics[], allocation: Record<string, number>): number {
    let weightedReturn = 0;
    
    for (const [symbol, weight] of Object.entries(allocation)) {
      const crypto = cryptoData.find(c => c.symbol === symbol);
      if (crypto) {
        // Use 24h change as proxy for expected return (simplified)
        weightedReturn += weight * (crypto.change24h / 100);
      }
    }
    
    return weightedReturn * 365; // Annualized
  }

  private calculateVaR(cryptoData: CryptoMetrics[], allocation: Record<string, number>, confidence = 0.95): number {
    // Simplified VaR calculation
    const portfolioVolatility = this.calculatePortfolioRisk(cryptoData, allocation);
    const zScore = confidence === 0.95 ? 1.645 : confidence === 0.99 ? 2.33 : 1.28;
    
    return portfolioVolatility * zScore;
  }

  private generatePortfolioRecommendations(allocation: Record<string, number>, riskScore: number): string[] {
    const recommendations: string[] = [];
    
    if (riskScore > 0.7) {
      recommendations.push('Consider reducing exposure to high-volatility assets');
      recommendations.push('Add stablecoins for risk management');
    }
    
    const maxAllocation = Math.max(...Object.values(allocation));
    if (maxAllocation > 0.5) {
      recommendations.push('Diversify holdings to reduce concentration risk');
    }
    
    if (Object.keys(allocation).length < 3) {
      recommendations.push('Increase diversification across different cryptocurrencies');
    }
    
    return recommendations;
  }

  // Utility methods
  private determineMarketPhase(avgChange: number, avgVolatility: number, fearGreedIndex: number): 'accumulation' | 'markup' | 'distribution' | 'markdown' {
    if (fearGreedIndex < 25 && avgChange < -5) {return 'markdown';}
    if (fearGreedIndex < 50 && avgVolatility < 0.05) {return 'accumulation';}
    if (fearGreedIndex > 75 && avgChange > 5) {return 'distribution';}
    return 'markup';
  }

  private determineWhaleActivity(cryptoData: CryptoMetrics[]): 'accumulating' | 'distributing' | 'neutral' {
    const highVolumeAssets = cryptoData.filter(c => c.volume > 1000000000); // > $1B volume
    
    if (highVolumeAssets.length === 0) {return 'neutral';}
    
    const avgChange = highVolumeAssets.reduce((sum, c) => sum + c.change24h, 0) / highVolumeAssets.length;
    
    if (avgChange > 3) {return 'accumulating';}
    if (avgChange < -3) {return 'distributing';}
    return 'neutral';
  }

  private calculateCorrelationRisk(cryptoData: CryptoMetrics[]): number {
    // Simplified correlation risk - assume higher when most assets move in same direction
    const positiveChanges = cryptoData.filter(c => c.change24h > 0).length;
    const negativeChanges = cryptoData.filter(c => c.change24h < 0).length;
    
    const directionAlignment = Math.abs(positiveChanges - negativeChanges) / cryptoData.length;
    return directionAlignment;
  }

  private assessRegulatoryRisk(cryptoData: CryptoMetrics[]): 'low' | 'medium' | 'high' {
    // Simple heuristic based on asset types
    const privacyCoins = cryptoData.filter(c => ['XMR', 'ZEC', 'DASH'].includes(c.symbol));
    const stablecoins = cryptoData.filter(c => ['USDT', 'USDC', 'BUSD'].includes(c.symbol));
    
    if (privacyCoins.length > cryptoData.length * 0.3) {return 'high';}
    if (stablecoins.length > cryptoData.length * 0.5) {return 'low';}
    return 'medium';
  }

  private getAverageVolume(symbol: string): number {
    // Mock average volume - in real implementation would use historical data
    return 1000000000; // $1B default
  }

  private simulateExchangePrices(basePrice: number): { prices: number[]; exchanges: string[] } {
    const exchanges = ['Binance', 'Coinbase', 'Kraken', 'Huobi', 'KuCoin'];
    const prices = exchanges.map(() => basePrice * (0.998 + Math.random() * 0.004)); // ±0.2% variation
    
    return { prices, exchanges };
  }

  private assessProtocolRisk(apr: number, tvl: number): 'low' | 'medium' | 'high' | 'extreme' {
    if (apr > 100) {return 'extreme';} // Unsustainably high APR
    if (apr > 50 || tvl < 100000000) {return 'high';} // High APR or low TVL
    if (apr > 25 || tvl < 500000000) {return 'medium';}
    return 'low';
  }

  private generateYieldRecommendations(protocol: string, apr: number, riskLevel: string): string[] {
    const recommendations: string[] = [];
    
    if (riskLevel === 'extreme') {
      recommendations.push('Extreme risk - avoid or use only small amounts');
    } else if (riskLevel === 'high') {
      recommendations.push('High risk - monitor closely and consider exit strategy');
    } else if (riskLevel === 'low' && apr > 10) {
      recommendations.push('Attractive risk-adjusted returns');
    }
    
    recommendations.push(`Consider ${protocol} for ${riskLevel} risk tolerance`);
    
    return recommendations;
  }

  private calculateRiskAdjustedReturn(opportunity: any): number {
    const riskMultiplier = opportunity.riskLevel === 'low' ? 1 : 
                          opportunity.riskLevel === 'medium' ? 0.8 :
                          opportunity.riskLevel === 'high' ? 0.6 : 0.3;
    
    return opportunity.apr * riskMultiplier;
  }
}
