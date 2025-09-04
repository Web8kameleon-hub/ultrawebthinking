/**
 * CryptoAnalysisEngine.ts
 * Advanced cryptocurrency analysis and trading engine
 * © Web8 UltraThinking – Ledjan Ahmati
 */

export interface CryptoAsset {
  symbol: string;
  name: string;
  price: number;
  marketCap: number;
  volume24h: number;
  change1h: number;
  change24h: number;
  change7d: number;
  volatility: number;
  liquidity: number;
  timestamp: Date;
}

export interface TechnicalIndicator {
  name: string;
  value: number;
  signal: 'buy' | 'sell' | 'hold';
  strength: number;
  timeframe: string;
}

export interface TradingSignal {
  asset: string;
  action: 'buy' | 'sell' | 'hold';
  confidence: number;
  priceTarget: number;
  stopLoss: number;
  reasoning: string[];
  indicators: TechnicalIndicator[];
  timestamp: Date;
}

export class CryptoAnalysisEngine {
  private assets: Map<string, CryptoAsset> = new Map();
  private signals: Map<string, TradingSignal> = new Map();
  private priceHistory: Map<string, number[]> = new Map();

  constructor() {
    this.initializeCryptoAssets();
  }

  private initializeCryptoAssets(): void {
    const cryptoData = [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        price: 45000,
        marketCap: 875000000000,
        volume24h: 25000000000,
        change1h: 0.5,
        change24h: 2.5,
        change7d: -1.2,
        volatility: 0.04,
        liquidity: 0.95
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        price: 2800,
        marketCap: 340000000000,
        volume24h: 12000000000,
        change1h: 0.8,
        change24h: 3.2,
        change7d: 0.5,
        volatility: 0.06,
        liquidity: 0.90
      },
      {
        symbol: 'ADA',
        name: 'Cardano',
        price: 0.45,
        marketCap: 15000000000,
        volume24h: 800000000,
        change1h: -0.2,
        change24h: 1.8,
        change7d: 4.5,
        volatility: 0.08,
        liquidity: 0.75
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        price: 85,
        marketCap: 38000000000,
        volume24h: 1500000000,
        change1h: 1.2,
        change24h: 4.8,
        change7d: 8.2,
        volatility: 0.12,
        liquidity: 0.80
      }
    ];

    cryptoData.forEach(crypto => {
      this.assets.set(crypto.symbol, {
        ...crypto,
        timestamp: new Date()
      });

      // Initialize price history with  data
      this.priceHistory.set(crypto.symbol, this.generatePriceHistory(crypto.price));
    });
  }

  private generatePriceHistory(currentPrice: number, days: number = 30): number[] {
    const history = [];
    let price = currentPrice;
    
    for (let i = days; i >= 0; i--) {
      const dailyChange = (Math.random() - 0.5) * 0.1; // ±5% daily variation
      price = price * (1 + dailyChange);
      history.push(Math.round(price * 100) / 100);
    }
    
    return history.reverse();
  }

  public analyzeMarketTrends(): any {
    const assets = Array.from(this.assets.values());
    
    const bullishAssets = assets.filter(a => a.change24h > 2).length;
    const bearishAssets = assets.filter(a => a.change24h < -2).length;
    const neutralAssets = assets.length - bullishAssets - bearishAssets;

    const marketSentiment = bullishAssets > bearishAssets ? 'bullish' : 
                           bearishAssets > bullishAssets ? 'bearish' : 'neutral';

    const totalMarketCap = assets.reduce((sum, a) => sum + a.marketCap, 0);
    const totalVolume = assets.reduce((sum, a) => sum + a.volume24h, 0);
    const avgVolatility = assets.reduce((sum, a) => sum + a.volatility, 0) / assets.length;

    return {
      market_sentiment: marketSentiment,
      sentiment_strength: Math.abs(bullishAssets - bearishAssets) / assets.length,
      total_market_cap: totalMarketCap,
      total_volume_24h: totalVolume,
      average_volatility: Math.round(avgVolatility * 1000) / 1000,
      asset_distribution: {
        bullish: bullishAssets,
        bearish: bearishAssets,
        neutral: neutralAssets
      },
      market_dominance: this.calculateMarketDominance(assets),
      fear_greed_index: this.calculateCryptoFearGreed(assets),
      analysis_timestamp: new Date().toISOString()
    };
  }

  public generateTradingSignals(): TradingSignal[] {
    const signals: TradingSignal[] = [];

    this.assets.forEach((asset, symbol) => {
      const technicalAnalysis = this.performTechnicalAnalysis(symbol);
      const fundamentalScore = this.calculateFundamentalScore(asset);
      
      const signal = this.generateSignalForAsset(asset, technicalAnalysis, fundamentalScore);
      signals.push(signal);
      
      this.signals.set(symbol, signal);
    });

    return signals.sort((a, b) => b.confidence - a.confidence);
  }

  public performTechnicalAnalysis(symbol: string): TechnicalIndicator[] {
    const asset = this.assets.get(symbol);
    const priceHistory = this.priceHistory.get(symbol);
    
    if (!asset || !priceHistory) return [];

    const indicators: TechnicalIndicator[] = [];

    // RSI (Relative Strength Index)
    const rsi = this.calculateRSI(priceHistory);
    indicators.push({
      name: 'RSI',
      value: rsi,
      signal: rsi > 70 ? 'sell' : rsi < 30 ? 'buy' : 'hold',
      strength: Math.abs(rsi - 50) / 50,
      timeframe: '14d'
    });

    // Moving Average Convergence Divergence
    const macd = this.calculateMACD(priceHistory);
    indicators.push({
      name: 'MACD',
      value: macd.signal,
      signal: macd.signal > 0 ? 'buy' : 'sell',
      strength: Math.min(1, Math.abs(macd.signal) / 100),
      timeframe: '12/26/9'
    });

    // Bollinger Bands
    const bb = this.calculateBollingerBands(priceHistory);
    const currentPrice = asset.price;
    let bbSignal: 'buy' | 'sell' | 'hold' = 'hold';
    
    if (currentPrice < bb.lower) bbSignal = 'buy';
    else if (currentPrice > bb.upper) bbSignal = 'sell';
    
    indicators.push({
      name: 'Bollinger Bands',
      value: (currentPrice - bb.middle) / (bb.upper - bb.lower),
      signal: bbSignal,
      strength: Math.abs((currentPrice - bb.middle) / (bb.upper - bb.lower)),
      timeframe: '20d'
    });

    return indicators;
  }

  public predictPriceMovement(symbol: string, days: number = 7): any {
    const asset = this.assets.get(symbol);
    const priceHistory = this.priceHistory.get(symbol);
    
    if (!asset || !priceHistory) return null;

    const currentPrice = asset.price;
    const volatility = asset.volatility;
    const trend = this.calculateTrend(priceHistory);
    
    const predictions = [];
    let price = currentPrice;

    for (let day = 1; day <= days; day++) {
      const trendInfluence = trend * 0.01 * day; // Trend impact increases over time
      const alk = (Math.random() - 0.5) * volatility * 2;
      const priceChange = trendInfluence + alk;
      
      price = price * (1 + priceChange);
      
      predictions.push({
        day,
        predicted_price: Math.round(price * 100) / 100,
        change_from_current: Math.round(((price - currentPrice) / currentPrice) * 10000) / 100,
        confidence: Math.max(0.3, 0.9 - (day * 0.1)) // Confidence decreases over time
      });
    }

    return {
      symbol,
      current_price: currentPrice,
      predictions,
      trend_direction: trend > 0 ? 'upward' : trend < 0 ? 'downward' : 'sideways',
      volatility_level: volatility > 0.1 ? 'high' : volatility > 0.05 ? 'medium' : 'low',
      prediction_timestamp: new Date().toISOString()
    };
  }

  public analyzePortfolioRisk(portfolio: { symbol: string; amount: number }[]): any {
    const totalValue = portfolio.reduce((sum, holding) => {
      const asset = this.assets.get(holding.symbol);
      return sum + (asset ? asset.price * holding.amount : 0);
    }, 0);

    const portfolioMetrics = portfolio.map(holding => {
      const asset = this.assets.get(holding.symbol);
      if (!asset) return null;

      const value = asset.price * holding.amount;
      const weight = value / totalValue;

      return {
        symbol: holding.symbol,
        value,
        weight: Math.round(weight * 10000) / 100,
        volatility: asset.volatility,
        risk_contribution: weight * asset.volatility
      };
    }).filter(Boolean);

    const portfolioVolatility = portfolioMetrics.reduce((sum, m) => sum + m!.risk_contribution, 0);
    const portfolioVaR = this.calculateVaR(portfolioMetrics, totalValue);

    return {
      total_value: Math.round(totalValue * 100) / 100,
      portfolio_volatility: Math.round(portfolioVolatility * 1000) / 1000,
      value_at_risk: portfolioVaR,
      diversification_score: this.calculateDiversificationScore(portfolioMetrics),
      holdings: portfolioMetrics,
      risk_level: portfolioVolatility > 0.15 ? 'high' : portfolioVolatility > 0.08 ? 'medium' : 'low',
      recommendations: this.generatePortfolioRecommendations(portfolioMetrics, portfolioVolatility),
      analysis_timestamp: new Date().toISOString()
    };
  }

  private calculateMarketDominance(assets: CryptoAsset[]): any[] {
    const totalMarketCap = assets.reduce((sum, a) => sum + a.marketCap, 0);
    
    return assets.map(asset => ({
      symbol: asset.symbol,
      dominance: Math.round((asset.marketCap / totalMarketCap) * 10000) / 100
    })).sort((a, b) => b.dominance - a.dominance);
  }

  private calculateCryptoFearGreed(assets: CryptoAsset[]): number {
    const avgChange24h = assets.reduce((sum, a) => sum + a.change24h, 0) / assets.length;
    const avgVolatility = assets.reduce((sum, a) => sum + a.volatility, 0) / assets.length;
    const avgVolume = assets.reduce((sum, a) => sum + a.volume24h, 0) / assets.length;
    
    let fearGreed = 50; // Neutral
    fearGreed += avgChange24h * 5; // Price momentum
    fearGreed -= avgVolatility * 200; // Volatility fear
    fearGreed += Math.min(10, avgVolume / 1000000000); // Volume confidence
    
    return Math.max(0, Math.min(100, Math.round(fearGreed)));
  }

  private calculateFundamentalScore(asset: CryptoAsset): number {
    let score = 50; // Base score
    
    // Market cap influence
    if (asset.marketCap > 100000000000) score += 20; // Large cap
    else if (asset.marketCap > 10000000000) score += 10; // Mid cap
    
    // Volume influence
    if (asset.volume24h > asset.marketCap * 0.1) score += 15; // High volume
    
    // Liquidity influence
    score += asset.liquidity * 15;
    
    return Math.max(0, Math.min(100, score));
  }

  private generateSignalForAsset(asset: CryptoAsset, indicators: TechnicalIndicator[], fundamentalScore: number): TradingSignal {
    const buySignals = indicators.filter(i => i.signal === 'buy').length;
    const sellSignals = indicators.filter(i => i.signal === 'sell').length;
    
    let action: 'buy' | 'sell' | 'hold' = 'hold';
    let confidence = 0.5;
    const reasoning: string[] = [];

    if (buySignals > sellSignals && fundamentalScore > 60) {
      action = 'buy';
      confidence = 0.6 + (buySignals / indicators.length) * 0.4;
      reasoning.push('Technical indicators show buying opportunity');
      reasoning.push('Strong fundamental metrics');
    } else if (sellSignals > buySignals || fundamentalScore < 40) {
      action = 'sell';
      confidence = 0.6 + (sellSignals / indicators.length) * 0.4;
      reasoning.push('Technical indicators suggest selling');
      if (fundamentalScore < 40) reasoning.push('Weak fundamental metrics');
    }

    return {
      asset: asset.symbol,
      action,
      confidence: Math.round(confidence * 100) / 100,
      priceTarget: this.calculatePriceTarget(asset, action),
      stopLoss: this.calculateStopLoss(asset, action),
      reasoning,
      indicators,
      timestamp: new Date()
    };
  }

  private calculateRSI(prices: number[], period: number = 14): number {
    if (prices.length < period + 1) return 50;
    
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i <= period; i++) {
      const change = prices[prices.length - i] - prices[prices.length - i - 1];
      if (change > 0) gains += change;
      else losses -= change;
    }
    
    const rs = (gains / period) / (losses / period);
    return 100 - (100 / (1 + rs));
  }

  private calculateMACD(prices: number[]): { signal: number; histogram: number } {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    const macdLine = ema12 - ema26;
    
    return {
      signal: macdLine,
      histogram: macdLine * 0.8 // Simplified
    };
  }

  private calculateEMA(prices: number[], period: number): number {
    if (prices.length === 0) return 0;
    
    const multiplier = 2 / (period + 1);
    let ema = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
      ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
    }
    
    return ema;
  }

  private calculateBollingerBands(prices: number[], period: number = 20, stdDev: number = 2): any {
    const recentPrices = prices.slice(-period);
    const average = recentPrices.reduce((sum, p) => sum + p, 0) / recentPrices.length;
    
    const variance = recentPrices.reduce((sum, p) => sum + Math.pow(p - average, 2), 0) / recentPrices.length;
    const standardDeviation = Math.sqrt(variance);
    
    return {
      upper: average + (standardDeviation * stdDev),
      middle: average,
      lower: average - (standardDeviation * stdDev)
    };
  }

  private calculateTrend(prices: number[]): number {
    if (prices.length < 2) return 0;
    
    const recentPrices = prices.slice(-10); // Last 10 data points
    const changes = [];
    
    for (let i = 1; i < recentPrices.length; i++) {
      changes.push((recentPrices[i] - recentPrices[i-1]) / recentPrices[i-1]);
    }
    
    return changes.reduce((sum, c) => sum + c, 0) / changes.length;
  }

  private calculateVaR(portfolioMetrics: any[], totalValue: number, confidence: number = 0.05): any {
    const dailyReturn = 0.02; // Assume 2% daily return
    const portfolioStdDev = Math.sqrt(portfolioMetrics.reduce((sum, m) => sum + Math.pow(m!.volatility * m!.weight, 2), 0));
    
    // VaR calculation (simplified)
    const zScore = 1.645; // 95% confidence level
    const varAmount = totalValue * zScore * portfolioStdDev;
    
    return {
      confidence_level: (1 - confidence) * 100,
      amount: Math.round(varAmount * 100) / 100,
      percentage: Math.round((varAmount / totalValue) * 10000) / 100
    };
  }

  private calculateDiversificationScore(portfolioMetrics: any[]): number {
    if (!portfolioMetrics.length) return 0;
    
    // Simple diversification score based on weight distribution
    const weights = portfolioMetrics.map(m => m!.weight / 100);
    const herfindahlIndex = weights.reduce((sum, w) => sum + Math.pow(w, 2), 0);
    
    return Math.round((1 - herfindahlIndex) * 100);
  }

  private generatePortfolioRecommendations(portfolioMetrics: any[], volatility: number): string[] {
    const recommendations = [];
    
    if (volatility > 0.15) {
      recommendations.push('Consider reducing position sizes in high-volatility assets');
    }
    
    const maxWeight = Math.max(...portfolioMetrics.map(m => m!.weight));
    if (maxWeight > 50) {
      recommendations.push('Portfolio is too concentrated - consider diversifying');
    }
    
    if (portfolioMetrics.length < 3) {
      recommendations.push('Add more assets to improve diversification');
    }
    
    return recommendations.length ? recommendations : ['Portfolio allocation appears balanced'];
  }

  private calculatePriceTarget(asset: CryptoAsset, action: 'buy' | 'sell' | 'hold'): number {
    const currentPrice = asset.price;
    const volatility = asset.volatility;
    
    if (action === 'buy') {
      return Math.round(currentPrice * (1 + volatility * 2) * 100) / 100;
    } else if (action === 'sell') {
      return Math.round(currentPrice * (1 - volatility * 1.5) * 100) / 100;
    }
    
    return currentPrice;
  }

  private calculateStopLoss(asset: CryptoAsset, action: 'buy' | 'sell' | 'hold'): number {
    const currentPrice = asset.price;
    const volatility = asset.volatility;
    
    if (action === 'buy') {
      return Math.round(currentPrice * (1 - volatility * 1.5) * 100) / 100;
    } else if (action === 'sell') {
      return Math.round(currentPrice * (1 + volatility * 2) * 100) / 100;
    }
    
    return currentPrice;
  }

  public getAssets(): Map<string, CryptoAsset> {
    return this.assets;
  }

  public getSignals(): Map<string, TradingSignal> {
    return this.signals;
  }

  public updateAssetPrice(symbol: string, price: number): boolean {
    const asset = this.assets.get(symbol);
    if (!asset) return false;

    const priceHistory = this.priceHistory.get(symbol) || [];
    priceHistory.push(price);
    
    // Keep only last 100 price points
    if (priceHistory.length > 100) {
      priceHistory.shift();
    }
    
    this.priceHistory.set(symbol, priceHistory);

    // Update asset
    const change24h = ((price - asset.price) / asset.price) * 100;
    asset.price = price;
    asset.change24h = Math.round(change24h * 100) / 100;
    asset.timestamp = new Date();

    return true;
  }
}
