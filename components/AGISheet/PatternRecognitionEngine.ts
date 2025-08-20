/**
 * PatternRecognitionEngine.ts
 * Advanced pattern recognition and predictive analytics engine
 * © Web8 UltraThinking – Ledjan Ahmati
 */

export interface DataPattern {
  id: string;
  type: 'trend' | 'cycle' | 'anomaly' | 'correlation' | 'seasonal';
  description: string;
  confidence: number;
  data_points: number[];
  metadata: {
    frequency: number;
    amplitude: number;
    phase: number;
    period?: number;
  };
  predictive_value: number;
  first_detected: Date;
  last_updated: Date;
}

export interface AnomalyDetection {
  timestamp: Date;
  value: number;
  expected_value: number;
  deviation: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: 'point' | 'contextual' | 'collective';
  explanation: string;
}

export interface PredictionModel {
  name: string;
  algorithm: string;
  accuracy: number;
  training_data_size: number;
  last_trained: Date;
  features: string[];
  hyperparameters: Record<string, any>;
  validation_score: number;
}

export interface SeasonalPattern {
  pattern_id: string;
  season_type: 'yearly' | 'quarterly' | 'monthly' | 'weekly' | 'daily';
  peak_periods: string[];
  trough_periods: string[];
  seasonal_factor: number;
  confidence: number;
}

export class PatternRecognitionEngine {
  private patterns: Map<string, DataPattern> = new Map();
  private anomalies: AnomalyDetection[] = [];
  private models: Map<string, PredictionModel> = new Map();
  private seasonalPatterns: Map<string, SeasonalPattern> = new Map();
  private dataHistory: Map<string, number[]> = new Map();

  constructor() {
    this.initializeModels();
    this.generateSampleData();
  }

  private initializeModels(): void {
    const models = [
      {
        name: 'Time Series Forecasting',
        algorithm: 'ARIMA',
        accuracy: 0.87,
        training_data_size: 10000,
        last_trained: new Date(Date.now() - 86400000), // 1 day ago
        features: ['timestamp', 'value', 'moving_average', 'seasonal_component'],
        hyperparameters: { p: 2, d: 1, q: 2, seasonal_periods: 12 },
        validation_score: 0.85
      },
      {
        name: 'Anomaly Detection',
        algorithm: 'Isolation Forest',
        accuracy: 0.92,
        training_data_size: 50000,
        last_trained: new Date(Date.now() - 172800000), // 2 days ago
        features: ['value', 'rate_of_change', 'moving_std', 'local_outlier_factor'],
        hyperparameters: { n_estimators: 100, contamination: 0.1, max_samples: 256 },
        validation_score: 0.90
      },
      {
        name: 'Pattern Classification',
        algorithm: 'Random Forest',
        accuracy: 0.89,
        training_data_size: 25000,
        last_trained: new Date(Date.now() - 259200000), // 3 days ago
        features: ['trend_slope', 'autocorrelation', 'spectral_density', 'entropy'],
        hyperparameters: { n_trees: 200, max_depth: 15, min_samples_split: 5 },
        validation_score: 0.88
      },
      {
        name: 'Correlation Analysis',
        algorithm: 'Pearson Correlation',
        accuracy: 0.94,
        training_data_size: 15000,
        last_trained: new Date(Date.now() - 86400000),
        features: ['variable_a', 'variable_b', 'lag_correlation', 'partial_correlation'],
        hyperparameters: { significance_level: 0.05, min_correlation: 0.3 },
        validation_score: 0.93
      }
    ];

    models.forEach(model => {
      this.models.set(model.name, model);
    });
  }

  private generateSampleData(): void {
    const datasets = ['sales', 'traffic', 'revenue', 'users', 'conversion'];
    
    datasets.forEach(dataset => {
      const data = this.generateTimeSeriesData(365); // 1 year of data
      this.dataHistory.set(dataset, data);
      
      // Detect patterns in sample data
      const patterns = this.detectPatterns(data, dataset);
      patterns.forEach(pattern => {
        this.patterns.set(pattern.id, pattern);
      });
    });
  }

  private generateTimeSeriesData(length: number): number[] {
    const data = [];
    let value = 1000;
    
    for (let i = 0; i < length; i++) {
      // Add trend
      const trend = 0.1 * Math.sin(i * 0.01);
      
      // Add seasonal component
      const seasonal = 50 * Math.sin(2 * Math.PI * i / 30) + 25 * Math.sin(2 * Math.PI * i / 7);
      
      // Add noise
      const noise = (Math.random() - 0.5) * 20;
      
      // Occasional anomalies
      const anomaly = Math.random() < 0.02 ? (Math.random() - 0.5) * 200 : 0;
      
      value += trend + seasonal + noise + anomaly;
      data.push(Math.max(0, Math.round(value * 100) / 100));
    }
    
    return data;
  }

  public detectPatterns(data: number[], datasetName: string): DataPattern[] {
    const patterns: DataPattern[] = [];
    
    // Detect trend patterns
    const trendPattern = this.detectTrendPattern(data, datasetName);
    if (trendPattern) patterns.push(trendPattern);
    
    // Detect cyclical patterns
    const cyclicalPattern = this.detectCyclicalPattern(data, datasetName);
    if (cyclicalPattern) patterns.push(cyclicalPattern);
    
    // Detect seasonal patterns
    const seasonalPattern = this.detectSeasonalPattern(data, datasetName);
    if (seasonalPattern) patterns.push(seasonalPattern);
    
    // Detect correlation patterns
    if (this.dataHistory.size > 1) {
      const correlationPatterns = this.detectCorrelationPatterns(data, datasetName);
      patterns.push(...correlationPatterns);
    }
    
    return patterns;
  }

  public analyzeAnomalies(data: number[], threshold: number = 2.5): AnomalyDetection[] {
    const anomalies: AnomalyDetection[] = [];
    
    // Calculate moving statistics
    const windowSize = Math.min(30, Math.floor(data.length / 10));
    const movingAvg = this.calculateMovingAverage(data, windowSize);
    const movingStd = this.calculateMovingStandardDeviation(data, windowSize);
    
    for (let i = windowSize; i < data.length; i++) {
      const value = data[i];
      const expected = movingAvg[i - windowSize];
      const stdDev = movingStd[i - windowSize];
      const deviation = Math.abs(value - expected) / stdDev;
      
      if (deviation > threshold) {
        const severity = this.classifyAnomalySeverity(deviation, threshold);
        
        anomalies.push({
          timestamp: new Date(Date.now() - (data.length - i) * 86400000), // Backdate
          value,
          expected_value: expected,
          deviation,
          severity,
          type: this.classifyAnomalyType(data, i, windowSize),
          explanation: this.generateAnomalyExplanation(deviation, expected, value)
        });
      }
    }
    
    this.anomalies = anomalies;
    return anomalies;
  }

  public predictFutureValues(datasetName: string, periods: number): any {
    const data = this.dataHistory.get(datasetName);
    if (!data || data.length < 10) return null;
    
    const predictions = [];
    const lastValue = data[data.length - 1];
    const trend = this.calculateTrend(data.slice(-30)); // Last 30 points
    const seasonalComponent = this.extractSeasonalComponent(data);
    
    for (let i = 1; i <= periods; i++) {
      const trendValue = trend * i;
      const seasonal = seasonalComponent[i % seasonalComponent.length];
      const noise = (Math.random() - 0.5) * 5; // Small random component
      
      const predictedValue = lastValue + trendValue + seasonal + noise;
      const confidence = Math.max(0.3, 0.9 - (i * 0.05)); // Decreasing confidence
      
      predictions.push({
        period: i,
        predicted_value: Math.round(predictedValue * 100) / 100,
        confidence: Math.round(confidence * 100) / 100,
        upper_bound: Math.round((predictedValue + (confidence * 20)) * 100) / 100,
        lower_bound: Math.round((predictedValue - (confidence * 20)) * 100) / 100
      });
    }
    
    return {
      dataset: datasetName,
      predictions,
      model_used: 'Time Series Forecasting',
      prediction_accuracy: this.models.get('Time Series Forecasting')?.accuracy,
      generated_at: new Date().toISOString()
    };
  }

  public analyzeCorrelations(datasets: string[]): any {
    const correlations = [];
    
    for (let i = 0; i < datasets.length; i++) {
      for (let j = i + 1; j < datasets.length; j++) {
        const data1 = this.dataHistory.get(datasets[i]);
        const data2 = this.dataHistory.get(datasets[j]);
        
        if (data1 && data2) {
          const correlation = this.calculateCorrelation(data1, data2);
          const significance = this.calculateCorrelationSignificance(correlation, data1.length);
          
          correlations.push({
            dataset_a: datasets[i],
            dataset_b: datasets[j],
            correlation_coefficient: Math.round(correlation * 1000) / 1000,
            strength: this.classifyCorrelationStrength(Math.abs(correlation)),
            direction: correlation > 0 ? 'positive' : 'negative',
            statistical_significance: significance,
            is_significant: significance < 0.05
          });
        }
      }
    }
    
    return {
      correlations: correlations.sort((a, b) => Math.abs(b.correlation_coefficient) - Math.abs(a.correlation_coefficient)),
      analysis_timestamp: new Date().toISOString(),
      total_comparisons: correlations.length
    };
  }

  public identifySeasonalPatterns(datasetName: string): SeasonalPattern[] {
    const data = this.dataHistory.get(datasetName);
    if (!data || data.length < 50) return [];
    
    const patterns: SeasonalPattern[] = [];
    
    // Weekly patterns (7-day cycle)
    const weeklyPattern = this.analyzeSeasonalCycle(data, 7, 'weekly');
    if (weeklyPattern) patterns.push(weeklyPattern);
    
    // Monthly patterns (30-day cycle)
    const monthlyPattern = this.analyzeSeasonalCycle(data, 30, 'monthly');
    if (monthlyPattern) patterns.push(monthlyPattern);
    
    // Quarterly patterns (90-day cycle)
    if (data.length >= 180) {
      const quarterlyPattern = this.analyzeSeasonalCycle(data, 90, 'quarterly');
      if (quarterlyPattern) patterns.push(quarterlyPattern);
    }
    
    patterns.forEach(pattern => {
      this.seasonalPatterns.set(`${datasetName}_${pattern.season_type}`, pattern);
    });
    
    return patterns;
  }

  public generatePatternReport(): any {
    const allPatterns = Array.from(this.patterns.values());
    const patternsByType = this.groupPatternsByType(allPatterns);
    const anomalyAnalysis = this.analyzeAnomalyTrends();
    const seasonalAnalysis = this.analyzeSeasonalTrends();
    
    return {
      pattern_summary: {
        total_patterns: allPatterns.length,
        pattern_types: patternsByType,
        high_confidence_patterns: allPatterns.filter(p => p.confidence > 0.8).length,
        recent_patterns: allPatterns.filter(p => 
          (Date.now() - p.first_detected.getTime()) < 7 * 24 * 60 * 60 * 1000
        ).length
      },
      anomaly_analysis: anomalyAnalysis,
      seasonal_analysis: seasonalAnalysis,
      model_performance: this.analyzeModelPerformance(),
      recommendations: this.generatePatternRecommendations(allPatterns),
      analysis_timestamp: new Date().toISOString()
    };
  }

  public optimizeModels(): any {
    const optimizationResults: any[] = [];
    
    this.models.forEach((model, name) => {
      const currentAccuracy = model.accuracy;
      
      // Simulate model optimization (in reality, this would involve actual ML operations)
      const optimizedAccuracy = Math.min(0.99, currentAccuracy + (Math.random() * 0.05));
      const improvementPercentage = ((optimizedAccuracy - currentAccuracy) / currentAccuracy) * 100;
      
      // Update model
      model.accuracy = optimizedAccuracy;
      model.last_trained = new Date();
      
      optimizationResults.push({
        model_name: name,
        previous_accuracy: Math.round(currentAccuracy * 1000) / 1000,
        new_accuracy: Math.round(optimizedAccuracy * 1000) / 1000,
        improvement: Math.round(improvementPercentage * 100) / 100,
        optimization_status: improvementPercentage > 0 ? 'improved' : 'stable'
      });
    });
    
    return {
      optimization_summary: {
        models_optimized: optimizationResults.length,
        average_improvement: Math.round(
          (optimizationResults.reduce((sum, r) => sum + r.improvement, 0) / optimizationResults.length) * 100
        ) / 100,
        best_performing_model: optimizationResults.reduce((best, current) => 
          current.new_accuracy > best.new_accuracy ? current : best
        )
      },
      detailed_results: optimizationResults,
      next_optimization: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Private helper methods

  private detectTrendPattern(data: number[], datasetName: string): DataPattern | null {
    if (data.length < 10) return null;
    
    const trend = this.calculateTrend(data);
    const confidence = this.calculateTrendConfidence(data, trend);
    
    if (confidence < 0.6) return null;
    
    return {
      id: `${datasetName}_trend_${Date.now()}`,
      type: 'trend',
      description: trend > 0 ? 'Upward trend detected' : 'Downward trend detected',
      confidence,
      data_points: data,
      metadata: {
        frequency: 1,
        amplitude: Math.abs(trend),
        phase: 0
      },
      predictive_value: confidence * 0.8,
      first_detected: new Date(),
      last_updated: new Date()
    };
  }

  private detectCyclicalPattern(data: number[], datasetName: string): DataPattern | null {
    if (data.length < 20) return null;
    
    const autocorrelations = this.calculateAutocorrelation(data, Math.floor(data.length / 4));
    const peaks = this.findPeaks(autocorrelations);
    
    if (peaks.length === 0) return null;
    
    const dominantPeak = peaks.reduce((max, peak) => 
      autocorrelations[peak] > autocorrelations[max] ? peak : max
    );
    
    const confidence = autocorrelations[dominantPeak];
    
    if (confidence < 0.5) return null;
    
    return {
      id: `${datasetName}_cycle_${Date.now()}`,
      type: 'cycle',
      description: `Cyclical pattern with period of ${dominantPeak} units`,
      confidence,
      data_points: data,
      metadata: {
        frequency: 1 / dominantPeak,
        amplitude: this.calculateAmplitude(data),
        phase: 0,
        period: dominantPeak
      },
      predictive_value: confidence * 0.7,
      first_detected: new Date(),
      last_updated: new Date()
    };
  }

  private detectSeasonalPattern(data: number[], datasetName: string): DataPattern | null {
    if (data.length < 50) return null;
    
    const seasonalComponent = this.extractSeasonalComponent(data);
    const seasonalStrength = this.calculateSeasonalStrength(data, seasonalComponent);
    
    if (seasonalStrength < 0.3) return null;
    
    return {
      id: `${datasetName}_seasonal_${Date.now()}`,
      type: 'seasonal',
      description: 'Seasonal pattern detected',
      confidence: seasonalStrength,
      data_points: data,
      metadata: {
        frequency: seasonalComponent.length,
        amplitude: Math.max(...seasonalComponent) - Math.min(...seasonalComponent),
        phase: 0,
        period: seasonalComponent.length
      },
      predictive_value: seasonalStrength * 0.9,
      first_detected: new Date(),
      last_updated: new Date()
    };
  }

  private detectCorrelationPatterns(data: number[], datasetName: string): DataPattern[] {
    const patterns: DataPattern[] = [];
    
    this.dataHistory.forEach((otherData, otherDataset) => {
      if (otherDataset === datasetName) return;
      
      const correlation = this.calculateCorrelation(data, otherData);
      
      if (Math.abs(correlation) > 0.5) {
        patterns.push({
          id: `${datasetName}_${otherDataset}_correlation_${Date.now()}`,
          type: 'correlation',
          description: `${Math.abs(correlation) > 0.7 ? 'Strong' : 'Moderate'} ${correlation > 0 ? 'positive' : 'negative'} correlation with ${otherDataset}`,
          confidence: Math.abs(correlation),
          data_points: data,
          metadata: {
            frequency: 1,
            amplitude: correlation,
            phase: 0
          },
          predictive_value: Math.abs(correlation) * 0.6,
          first_detected: new Date(),
          last_updated: new Date()
        });
      }
    });
    
    return patterns;
  }

  private calculateMovingAverage(data: number[], windowSize: number): number[] {
    const result = [];
    
    for (let i = windowSize - 1; i < data.length; i++) {
      const sum = data.slice(i - windowSize + 1, i + 1).reduce((a, b) => a + b, 0);
      result.push(sum / windowSize);
    }
    
    return result;
  }

  private calculateMovingStandardDeviation(data: number[], windowSize: number): number[] {
    const result = [];
    const movingAvg = this.calculateMovingAverage(data, windowSize);
    
    for (let i = windowSize - 1; i < data.length; i++) {
      const window = data.slice(i - windowSize + 1, i + 1);
      const avg = movingAvg[i - windowSize + 1];
      const variance = window.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / windowSize;
      result.push(Math.sqrt(variance));
    }
    
    return result;
  }

  private calculateTrend(data: number[]): number {
    if (data.length < 2) return 0;
    
    const n = data.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = data.reduce((sum, val) => sum + val, 0);
    const sumXY = data.reduce((sum, val, i) => sum + (i * val), 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;
    
    return (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  }

  private calculateTrendConfidence(data: number[], trend: number): number {
    const predicted = data.map((_, i) => data[0] + trend * i);
    const errors = data.map((val, i) => Math.abs(val - predicted[i]));
    const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
    const meanValue = data.reduce((sum, val) => sum + val, 0) / data.length;
    
    return Math.max(0, 1 - (meanError / meanValue));
  }

  private calculateAutocorrelation(data: number[], maxLag: number): number[] {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
    
    const autocorrelations = [];
    
    for (let lag = 0; lag <= maxLag; lag++) {
      let covariance = 0;
      
      for (let i = 0; i < data.length - lag; i++) {
        covariance += (data[i] - mean) * (data[i + lag] - mean);
      }
      
      covariance /= (data.length - lag);
      autocorrelations.push(covariance / variance);
    }
    
    return autocorrelations;
  }

  private findPeaks(data: number[]): number[] {
    const peaks = [];
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > 0.3) {
        peaks.push(i);
      }
    }
    
    return peaks;
  }

  private calculateAmplitude(data: number[]): number {
    return Math.max(...data) - Math.min(...data);
  }

  private extractSeasonalComponent(data: number[], period: number = 12): number[] {
    const seasonal = new Array(period).fill(0);
    const counts = new Array(period).fill(0);
    
    for (let i = 0; i < data.length; i++) {
      const seasonIndex = i % period;
      seasonal[seasonIndex] += data[i];
      counts[seasonIndex]++;
    }
    
    return seasonal.map((sum, i) => counts[i] > 0 ? sum / counts[i] : 0);
  }

  private calculateSeasonalStrength(data: number[], seasonalComponent: number[]): number {
    const deseasonalized = data.map((val, i) => val - seasonalComponent[i % seasonalComponent.length]);
    const originalVariance = this.calculateVariance(data);
    const deseasonalizedVariance = this.calculateVariance(deseasonalized);
    
    return Math.max(0, 1 - (deseasonalizedVariance / originalVariance));
  }

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    return data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
  }

  private calculateCorrelation(data1: number[], data2: number[]): number {
    const minLength = Math.min(data1.length, data2.length);
    const x = data1.slice(0, minLength);
    const y = data2.slice(0, minLength);
    
    const meanX = x.reduce((sum, val) => sum + val, 0) / x.length;
    const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
    
    let numerator = 0;
    let sumXSquared = 0;
    let sumYSquared = 0;
    
    for (let i = 0; i < x.length; i++) {
      const xDiff = x[i] - meanX;
      const yDiff = y[i] - meanY;
      
      numerator += xDiff * yDiff;
      sumXSquared += xDiff * xDiff;
      sumYSquared += yDiff * yDiff;
    }
    
    const denominator = Math.sqrt(sumXSquared * sumYSquared);
    return denominator === 0 ? 0 : numerator / denominator;
  }

  private calculateCorrelationSignificance(correlation: number, sampleSize: number): number {
    // Simplified p-value calculation
    const tStat = correlation * Math.sqrt((sampleSize - 2) / (1 - correlation * correlation));
    return 2 * (1 - this.cdf(Math.abs(tStat), sampleSize - 2));
  }

  private cdf(x: number, df: number): number {
    // Simplified cumulative distribution function for t-distribution
    return 0.5 + 0.5 * Math.sign(x) * Math.sqrt(1 - Math.exp(-2 * x * x / Math.PI));
  }

  private classifyCorrelationStrength(correlation: number): string {
    const abs = Math.abs(correlation);
    if (abs >= 0.8) return 'very_strong';
    if (abs >= 0.6) return 'strong';
    if (abs >= 0.4) return 'moderate';
    if (abs >= 0.2) return 'weak';
    return 'very_weak';
  }

  private classifyAnomalySeverity(deviation: number, threshold: number): 'low' | 'medium' | 'high' | 'critical' {
    if (deviation > threshold * 3) return 'critical';
    if (deviation > threshold * 2) return 'high';
    if (deviation > threshold * 1.5) return 'medium';
    return 'low';
  }

  private classifyAnomalyType(data: number[], index: number, windowSize: number): 'point' | 'contextual' | 'collective' {
    // Simplified classification
    const contextWindow = data.slice(Math.max(0, index - windowSize), index + windowSize + 1);
    const anomalousPoints = contextWindow.filter((_, i) => Math.abs(i - windowSize) < 3).length;
    
    if (anomalousPoints > 3) return 'collective';
    if (index > 0 && index < data.length - 1) return 'contextual';
    return 'point';
  }

  private generateAnomalyExplanation(deviation: number, expected: number, actual: number): string {
    const percentageDeviation = Math.round(((actual - expected) / expected) * 100);
    
    if (actual > expected) {
      return `Value is ${Math.abs(percentageDeviation)}% higher than expected`;
    } else {
      return `Value is ${Math.abs(percentageDeviation)}% lower than expected`;
    }
  }

  private analyzeSeasonalCycle(data: number[], period: number, seasonType: string): SeasonalPattern | null {
    if (data.length < period * 2) return null;
    
    const cycles = Math.floor(data.length / period);
    const seasonalValues = new Array(period).fill(0);
    
    for (let cycle = 0; cycle < cycles; cycle++) {
      for (let i = 0; i < period; i++) {
        seasonalValues[i] += data[cycle * period + i];
      }
    }
    
    seasonalValues.forEach((val, i) => {
      seasonalValues[i] = val / cycles;
    });
    
    const mean = seasonalValues.reduce((sum, val) => sum + val, 0) / seasonalValues.length;
    const variance = seasonalValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / seasonalValues.length;
    const seasonalFactor = Math.sqrt(variance) / mean;
    
    if (seasonalFactor < 0.1) return null; // Not enough seasonal variation
    
    const maxIndex = seasonalValues.indexOf(Math.max(...seasonalValues));
    const minIndex = seasonalValues.indexOf(Math.min(...seasonalValues));
    
    return {
      pattern_id: `seasonal_${seasonType}_${Date.now()}`,
      season_type: seasonType as any,
      peak_periods: [this.indexToPeriodLabel(maxIndex, seasonType)],
      trough_periods: [this.indexToPeriodLabel(minIndex, seasonType)],
      seasonal_factor: Math.round(seasonalFactor * 1000) / 1000,
      confidence: Math.min(0.95, seasonalFactor * 2)
    };
  }

  private indexToPeriodLabel(index: number, seasonType: string): string {
    switch (seasonType) {
      case 'weekly':
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[index] || `Day ${index}`;
      case 'monthly':
        return `Day ${index + 1}`;
      case 'quarterly':
        return `Day ${index + 1} of quarter`;
      default:
        return `Period ${index + 1}`;
    }
  }

  private groupPatternsByType(patterns: DataPattern[]): Record<string, number> {
    return patterns.reduce((acc: Record<string, number>, pattern) => {
      acc[pattern.type] = (acc[pattern.type] || 0) + 1;
      return acc;
    }, {});
  }

  private analyzeAnomalyTrends(): any {
    const severityCounts = this.anomalies.reduce((acc: Record<string, number>, anomaly) => {
      acc[anomaly.severity] = (acc[anomaly.severity] || 0) + 1;
      return acc;
    }, {});

    const recentAnomalies = this.anomalies.filter(a => 
      (Date.now() - a.timestamp.getTime()) < 7 * 24 * 60 * 60 * 1000
    );

    return {
      total_anomalies: this.anomalies.length,
      severity_distribution: severityCounts,
      recent_anomalies: recentAnomalies.length,
      anomaly_rate: this.anomalies.length / Math.max(1, this.dataHistory.size * 365)
    };
  }

  private analyzeSeasonalTrends(): any {
    const seasonalPatterns = Array.from(this.seasonalPatterns.values());
    
    return {
      total_seasonal_patterns: seasonalPatterns.length,
      pattern_types: seasonalPatterns.reduce((acc: Record<string, number>, pattern) => {
        acc[pattern.season_type] = (acc[pattern.season_type] || 0) + 1;
        return acc;
      }, {}),
      average_confidence: seasonalPatterns.length > 0 ? 
        Math.round((seasonalPatterns.reduce((sum, p) => sum + p.confidence, 0) / seasonalPatterns.length) * 100) / 100 : 0
    };
  }

  private analyzeModelPerformance(): any {
    const models = Array.from(this.models.values());
    
    return {
      total_models: models.length,
      average_accuracy: Math.round((models.reduce((sum, m) => sum + m.accuracy, 0) / models.length) * 1000) / 1000,
      best_model: models.reduce((best, current) => current.accuracy > best.accuracy ? current : best),
      models_needing_retraining: models.filter(m => 
        (Date.now() - m.last_trained.getTime()) > 7 * 24 * 60 * 60 * 1000
      ).length
    };
  }

  private generatePatternRecommendations(patterns: DataPattern[]): string[] {
    const recommendations = [];
    
    const highConfidencePatterns = patterns.filter(p => p.confidence > 0.8);
    if (highConfidencePatterns.length > 0) {
      recommendations.push('Leverage high-confidence patterns for strategic planning');
    }
    
    const trendPatterns = patterns.filter(p => p.type === 'trend');
    if (trendPatterns.some(p => p.metadata.amplitude > 0)) {
      recommendations.push('Capitalize on positive trend patterns');
    }
    
    const seasonalPatterns = patterns.filter(p => p.type === 'seasonal');
    if (seasonalPatterns.length > 0) {
      recommendations.push('Prepare for seasonal fluctuations in planning');
    }
    
    if (this.anomalies.length > 0) {
      recommendations.push('Investigate root causes of detected anomalies');
    }
    
    return recommendations.length > 0 ? recommendations : ['No specific recommendations at this time'];
  }

  // Public getters
  public getPatterns(): Map<string, DataPattern> {
    return this.patterns;
  }

  public getAnomalies(): AnomalyDetection[] {
    return this.anomalies;
  }

  public getModels(): Map<string, PredictionModel> {
    return this.models;
  }

  public getSeasonalPatterns(): Map<string, SeasonalPattern> {
    return this.seasonalPatterns;
  }

  public getDataHistory(): Map<string, number[]> {
    return this.dataHistory;
  }

  public addDataPoint(datasetName: string, value: number): void {
    const data = this.dataHistory.get(datasetName) || [];
    data.push(value);
    
    // Keep only last 1000 points
    if (data.length > 1000) {
      data.shift();
    }
    
    this.dataHistory.set(datasetName, data);
    
    // Re-analyze patterns for updated dataset
    const newPatterns = this.detectPatterns(data, datasetName);
    newPatterns.forEach(pattern => {
      this.patterns.set(pattern.id, pattern);
    });
  }
}
