interface EcoDataPoint {
  timestamp: Date;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

interface StatisticalSummary {
  mean: number;
  median: number;
  standardDeviation: number;
  variance: number;
  skewness: number;
  kurtosis: number;
  correlation: Record<string, number>;
  trend: 'upward' | 'downward' | 'stable';
  volatility: number;
  anomalies: Array<{ timestamp: Date; value: number; severity: number }>;
}

interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  prediction: number[];
  confidence: number;
}

interface SeasonalAnalysis {
  seasonality: 'strong' | 'moderate' | 'weak' | 'none';
  cycle: number; // Period in data points
  amplitude: number;
  phase: number;
}

export class EcoStatisticsEngine {
  private debugMode: boolean;

  constructor(debugMode = false) {
    this.debugMode = debugMode;
  }

  /**
   * Comprehensive statistical analysis of economic data
   */
  async analyzeData(data: EcoDataPoint[]): Promise<StatisticalSummary> {
    if (data.length === 0) {
      throw new Error('No data provided for analysis');
    }

    const values = data.map(d => d.value);
    const timestamps = data.map(d => d.timestamp);

    // Basic statistics
    const mean = this.calculateMean(values);
    const median = this.calculateMedian(values);
    const variance = this.calculateVariance(values, mean);
    const standardDeviation = Math.sqrt(variance);
    
    // Advanced statistics
    const skewness = this.calculateSkewness(values, mean, standardDeviation);
    const kurtosis = this.calculateKurtosis(values, mean, standardDeviation);
    
    // Correlation analysis by category
    const correlation = this.calculateCorrelation(data);
    
    // Trend analysis
    const trend = this.analyzeTrend(values, timestamps);
    
    // Volatility calculation
    const volatility = this.calculateVolatility(values);
    
    // Anomaly detection
    const anomalies = this.detectAnomalies(data, mean, standardDeviation);

    if (this.debugMode) {
      console.log('Statistical Analysis Complete:', {
        dataPoints: data.length,
        mean,
        standardDeviation,
        trend,
        anomalyCount: anomalies.length
      });
    }

    return {
      mean,
      median,
      standardDeviation,
      variance,
      skewness,
      kurtosis,
      correlation,
      trend,
      volatility,
      anomalies
    };
  }

  /**
   * Perform linear regression analysis
   */
  async performRegression(data: EcoDataPoint[]): Promise<RegressionResult> {
    const x = data.map((_, i) => i); // Time index
    const y = data.map(d => d.value);
    
    const n = data.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    // Calculate slope and intercept
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared
    const yMean = sumY / n;
    const ssRes = y.reduce((sum, yi, i) => {
      const predicted = slope * x[i] + intercept;
      return sum + Math.pow(yi - predicted, 2);
    }, 0);
    const ssTot = y.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    // Generate predictions
    const prediction = x.map(xi => slope * xi + intercept);
    
    // Calculate confidence level
    const confidence = Math.max(0, Math.min(1, rSquared));

    return {
      slope,
      intercept,
      rSquared,
      prediction,
      confidence
    };
  }

  /**
   * Analyze seasonal patterns in data
   */
  async analyzeSeasonality(data: EcoDataPoint[]): Promise<SeasonalAnalysis> {
    const values = data.map(d => d.value);
    
    // Simple seasonality detection using autocorrelation
    const maxLag = Math.min(Math.floor(data.length / 4), 100);
    let bestCorrelation = 0;
    let bestPeriod = 0;

    for (let lag = 2; lag <= maxLag; lag++) {
      const correlation = this.calculateAutoCorrelation(values, lag);
      if (correlation > bestCorrelation) {
        bestCorrelation = correlation;
        bestPeriod = lag;
      }
    }

    // Determine seasonality strength
    let seasonality: 'strong' | 'moderate' | 'weak' | 'none';
    if (bestCorrelation > 0.7) {seasonality = 'strong';}
    else if (bestCorrelation > 0.5) {seasonality = 'moderate';}
    else if (bestCorrelation > 0.3) {seasonality = 'weak';}
    else {seasonality = 'none';}

    // Calculate amplitude and phase (simplified)
    const amplitude = this.calculateAmplitude(values, bestPeriod);
    const phase = 0; // Simplified - would need FFT for accurate phase

    return {
      seasonality,
      cycle: bestPeriod,
      amplitude,
      phase
    };
  }

  // Private utility methods
  private calculateMean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private calculateMedian(values: number[]): number {
    const sorted = [...values].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    
    if (sorted.length % 2 === 0) {
      return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
  }

  private calculateVariance(values: number[], mean: number): number {
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  private calculateSkewness(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const sum = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 3), 0);
    return (n / ((n - 1) * (n - 2))) * sum;
  }

  private calculateKurtosis(values: number[], mean: number, stdDev: number): number {
    const n = values.length;
    const sum = values.reduce((sum, val) => sum + Math.pow((val - mean) / stdDev, 4), 0);
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * sum - (3 * Math.pow(n - 1, 2)) / ((n - 2) * (n - 3));
  }

  private calculateCorrelation(data: EcoDataPoint[]): Record<string, number> {
    const categories = [...new Set(data.map(d => d.category))];
    const correlations: Record<string, number> = {};

    for (let i = 0; i < categories.length; i++) {
      for (let j = i + 1; j < categories.length; j++) {
        const cat1Data = data.filter(d => d.category === categories[i]).map(d => d.value);
        const cat2Data = data.filter(d => d.category === categories[j]).map(d => d.value);
        
        const minLength = Math.min(cat1Data.length, cat2Data.length);
        if (minLength < 2) {continue;}

        const correlation = this.calculatePearsonCorrelation(
          cat1Data.slice(0, minLength),
          cat2Data.slice(0, minLength)
        );
        
        correlations[`${categories[i]}_${categories[j]}`] = correlation;
      }
    }

    return correlations;
  }

  private calculatePearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    if (n !== y.length ?? n < 2) {return 0;}

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private analyzeTrend(values: number[], timestamps: Date[]): 'upward' | 'downward' | 'stable' {
    if (values.length < 2) {return 'stable';}

    // Simple linear regression slope
    const n = values.length;
    const x = Array.from({ length: n }, (_, i) => i);
    const y = values;

    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);

    const threshold = Math.abs(this.calculateMean(values)) * 0.001; // 0.1% threshold

    if (slope > threshold) {return 'upward';}
    if (slope < -threshold) {return 'downward';}
    return 'stable';
  }

  private calculateVolatility(values: number[]): number {
    if (values.length < 2) {return 0;}

    const returns = [];
    for (let i = 1; i < values.length; i++) {
      const returnValue = (values[i] - values[i - 1]) / values[i - 1];
      returns.push(returnValue);
    }

    const mean = this.calculateMean(returns);
    const variance = this.calculateVariance(returns, mean);
    return Math.sqrt(variance * 252); // Annualized volatility
  }

  private detectAnomalies(data: EcoDataPoint[], mean: number, stdDev: number): Array<{ timestamp: Date; value: number; severity: number }> {
    const threshold = 2; // 2 standard deviations
    const anomalies: Array<{ timestamp: Date; value: number; severity: number }> = [];

    for (const point of data) {
      const zScore = Math.abs((point.value - mean) / stdDev);
      if (zScore > threshold) {
        anomalies.push({
          timestamp: point.timestamp,
          value: point.value,
          severity: zScore
        });
      }
    }

    return anomalies.sort((a, b) => b.severity - a.severity);
  }

  private calculateAutoCorrelation(values: number[], lag: number): number {
    if (lag >= values.length) {return 0;}

    const n = values.length - lag;
    const x1 = values.slice(0, n);
    const x2 = values.slice(lag, lag + n);

    return this.calculatePearsonCorrelation(x1, x2);
  }

  private calculateAmplitude(values: number[], period: number): number {
    if (period === 0 ?? values.length < period * 2) {return 0;}

    const cycles = Math.floor(values.length / period);
    let maxAmplitude = 0;

    for (let c = 0; c < cycles; c++) {
      const cycleData = values.slice(c * period, (c + 1) * period);
      const min = Math.min(...cycleData);
      const max = Math.max(...cycleData);
      const amplitude = (max - min) / 2;
      maxAmplitude = Math.max(maxAmplitude, amplitude);
    }

    return maxAmplitude;
  }

  /**
   * Advanced statistical forecasting
   */
  async forecast(data: EcoDataPoint[], periods = 10): Promise<{ predictions: number[]; confidence: number[] }> {
    const values = data.map(d => d.value);
    
    // Simple exponential smoothing for forecasting
    const alpha = 0.3; // Smoothing parameter
    let smoothed = values[0];
    const smoothedValues = [smoothed];

    for (let i = 1; i < values.length; i++) {
      smoothed = alpha * values[i] + (1 - alpha) * smoothed;
      smoothedValues.push(smoothed);
    }

    // Generate predictions
    const predictions: number[] = [];
    const confidence: number[] = [];
    const lastValue = smoothedValues[smoothedValues.length - 1];
    const error = this.calculateForecastError(values, smoothedValues);

    for (let i = 0; i < periods; i++) {
      predictions.push(lastValue);
      // Confidence decreases with distance
      confidence.push(Math.max(0.1, 0.9 - (i * 0.1)));
    }

    return { predictions, confidence };
  }

  private calculateForecastError(actual: number[], predicted: number[]): number {
    const minLength = Math.min(actual.length, predicted.length);
    let sumSquaredError = 0;

    for (let i = 0; i < minLength; i++) {
      sumSquaredError += Math.pow(actual[i] - predicted[i], 2);
    }

    return Math.sqrt(sumSquaredError / minLength);
  }
}
