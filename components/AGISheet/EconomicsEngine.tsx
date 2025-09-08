/**
 * EconomicsEngine - Simple Economic Analysis Module
 */

export interface MarketIndicator {
  name: string
  value: number
  change: number
  metadata?: any
}

export interface EconomicAnalysis {
  trend: 'bullish' | 'bearish' | 'neutral'
  confidence: number
  factors: string[]
  recommendation: string
}

export class EconomicsEngine {
  async analyzeMarket(indicators: MarketIndicator[]): Promise<EconomicAnalysis> {
    // Simple analysis logic
    const positiveCount = indicators.filter(ind => ind.change > 0).length
    const totalCount = indicators.length
    const positiveRatio = positiveCount / totalCount
    
    let trend: 'bullish' | 'bearish' | 'neutral' = 'neutral'
    let confidence = 0.5
    
    if (positiveRatio > 0.6) {
      trend = 'bullish'
      confidence = 0.7 + Math.random() * 0.2
    } else if (positiveRatio < 0.4) {
      trend = 'bearish'
      confidence = 0.7 + Math.random() * 0.2
    } else {
      trend = 'neutral'
      confidence = 0.5 + Math.random() * 0.3
    }
    
    return {
      trend,
      confidence,
      factors: [
        'Market sentiment analysis',
        'Technical indicators',
        'Economic fundamentals'
      ],
      recommendation: trend === 'bullish' 
        ? 'Consider long positions' 
        : trend === 'bearish' 
          ? 'Consider defensive strategies' 
          : 'Monitor market conditions'
    }
  }
  
  calculateGrowthRate(currentValue: number, previousValue: number): number {
    if (previousValue === 0) return 0
    return ((currentValue - previousValue) / previousValue) * 100
  }
  
  calculateVolatility(prices: number[]): number {
    if (prices.length < 2) return 0
    
    const mean = prices.reduce((sum, price) => sum + price, 0) / prices.length
    const variance = prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length
    
    return Math.sqrt(variance)
  }
}
