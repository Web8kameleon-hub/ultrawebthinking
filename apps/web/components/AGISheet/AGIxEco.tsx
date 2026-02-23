'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cva } from 'class-variance-authority';
import { EcoStatisticsEngine } from './EcoStatisticsEngine';
import { EconomicsEngine } from './EconomicsEngine';
import { CryptoAnalysisEngine } from './CryptoAnalysisEngine';
import styles from './AGIxEco.module.css';

const containerVariants = cva(styles.container, {
  variants: {
    mode: {
      statistics: styles.statisticsMode,
      economics: styles.economicsMode,
      crypto: styles.cryptoMode,
      comprehensive: styles.comprehensiveMode
    },
    theme: {
      green: styles.greenTheme,
      blue: styles.blueTheme,
      gold: styles.goldTheme,
      dark: styles.darkTheme
    }
  },
  defaultVariants: {
    mode: 'comprehensive',
    theme: 'green'
  }
});

const panelVariants = cva(styles.panel, {
  variants: {
    type: {
      chart: styles.chartPanel,
      data: styles.dataPanel,
      analysis: styles.analysisPanel,
      prediction: styles.predictionPanel
    },
    status: {
      active: styles.active,
      loading: styles.loading,
      error: styles.error,
      success: styles.success
    }
  }
});

interface EcoData {
  timestamp: Date;
  value: number;
  category: string;
  metadata?: Record<string, any>;
}

interface MarketIndicator {
  name: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
  confidence: number;
}

interface CryptoMetrics {
  symbol: string;
  price: number;
  volume: number;
  marketCap: number;
  change24h: number;
  volatility: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

interface AGIxEcoProps {
  mode?: 'statistics' | 'economics' | 'crypto' | 'comprehensive';
  theme?: 'green' | 'blue' | 'gold' | 'dark';
  autoUpdate?: boolean;
  dataSource?: string;
}

export const AGIxEco = ({ 
  mode = 'comprehensive',
  theme = 'green',
  autoUpdate = true,
  dataSource = 'real-time'
}: AGIxEcoProps) => {
  const [ecoData, setEcoData] = useState<EcoData[]>([]);
  const [marketIndicators, setMarketIndicators] = useState<MarketIndicator[]>([]);
  const [cryptoMetrics, setCryptoMetrics] = useState<CryptoMetrics[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  const statisticsEngine = new EcoStatisticsEngine();
  const economicsEngine = new EconomicsEngine();
  const cryptoEngine = new CryptoAnalysisEngine();

  // Initialize demo data
  useEffect(() => {
    initializeDemoData();
    if (autoUpdate) {
      const interval = setInterval(updateData, 30000); // Update every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoUpdate]);

  const initializeDemoData = useCallback(() => {
    // Generate demo economic data
    const demoEcoData: EcoData[] = [];
    const now = new Date();
    
    for (let i = 0; i < 100; i++) {
      demoEcoData.push({
        timestamp: new Date(now.getTime() - i * 3600000), // Hourly data
        value: Math.random() * 1000 + 500,
        category: ['GDP', 'Inflation', 'Employment', 'Trade'][i % 4],
        metadata: { source: 'demo', confidence: Math.random() * 0.4 + 0.6 }
      });
    }
    
    setEcoData(demoEcoData);

    // Generate demo market indicators
    const demoIndicators: MarketIndicator[] = [
      { name: 'S&P 500', value: 4567.89, change: 23.45, trend: 'up', confidence: 0.85 },
      { name: 'NASDAQ', value: 15234.67, change: -45.23, trend: 'down', confidence: 0.78 },
      { name: 'EUR/USD', value: 1.0856, change: 0.0023, trend: 'up', confidence: 0.72 },
      { name: 'Gold', value: 1987.34, change: 12.67, trend: 'up', confidence: 0.91 },
      { name: 'Oil (WTI)', value: 78.92, change: -2.34, trend: 'down', confidence: 0.83 }
    ];
    
    setMarketIndicators(demoIndicators);

    // Generate demo crypto metrics
    const demoCrypto: CryptoMetrics[] = [
      { symbol: 'BTC', price: 67234.56, volume: 28456789123, marketCap: 1345678901234, change24h: 2.34, volatility: 0.045, sentiment: 'bullish' },
      { symbol: 'ETH', price: 3456.78, volume: 15678901234, marketCap: 456789012345, change24h: -1.23, volatility: 0.067, sentiment: 'bearish' },
      { symbol: 'ADA', price: 0.4567, volume: 987654321, marketCap: 15678901234, change24h: 5.67, volatility: 0.089, sentiment: 'bullish' },
      { symbol: 'SOL', price: 123.45, volume: 2345678901, marketCap: 56789012345, change24h: -0.89, volatility: 0.123, sentiment: 'neutral' }
    ];
    
    setCryptoMetrics(demoCrypto);
  }, []);

  const updateData = useCallback(async () => {
    // Simulate real-time updates
    setEcoData(prev => prev.map(item => ({
      ...item,
      value: item.value * (0.98 + Math.random() * 0.04) // ±2% variation
    })));

    setMarketIndicators(prev => prev.map(indicator => {
      const variation = (Math.random() - 0.5) * 0.02; // ±1% variation
      const newValue = indicator.value * (1 + variation);
      const newChange = newValue - indicator.value;
      
      return {
        ...indicator,
        value: newValue,
        change: newChange,
        trend: newChange > 0 ? 'up' : newChange < 0 ? 'down' : 'stable'
      };
    }));

    setCryptoMetrics(prev => prev.map(crypto => {
      const variation = (Math.random() - 0.5) * 0.05; // ±2.5% variation
      const newPrice = crypto.price * (1 + variation);
      const change24h = ((newPrice - crypto.price) / crypto.price) * 100;
      
      return {
        ...crypto,
        price: newPrice,
        change24h,
        volatility: Math.abs(variation),
        sentiment: change24h > 1 ? 'bullish' : change24h < -1 ? 'bearish' : 'neutral'
      };
    }));
  }, []);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    try {
      // Run comprehensive analysis
      const stats = await statisticsEngine.analyzeData(ecoData);
      const ecoAnalysis = await economicsEngine.analyzeMarket(marketIndicators);
      const cryptoAnalysis = await cryptoEngine.analyzeCrypto(cryptoMetrics);
      
      setAnalysisResults({
        statistics: stats,
        economics: ecoAnalysis,
        crypto: cryptoAnalysis,
        timestamp: new Date()
      });
    } catch (err) {
      console.error('Analysis failed:', _error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [ecoData, marketIndicators, cryptoMetrics, statisticsEngine, economicsEngine, cryptoEngine]);

  const formatCurrency = (value: number, currency = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatPercent = (value: number): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formatLargeNumber = (value: number): string => {
    if (value >= 1e12) {return `${(value / 1e12).toFixed(2)}T`;}
    if (value >= 1e9) {return `${(value / 1e9).toFixed(2)}B`;}
    if (value >= 1e6) {return `${(value / 1e6).toFixed(2)}M`;}
    if (value >= 1e3) {return `${(value / 1e3).toFixed(2)}K`;}
    return value.toFixed(2);
  };

  return (
    <motion.div
      className={containerVariants({ mode, theme })}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <motion.header 
        className={styles.header}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🌱
            </motion.span>
            AGI×Eco Analytics
          </h1>
          <div className={styles.controls}>
            <select 
              className={styles.timeframeSelect}
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
            >
              <option value="1h">1 Hour</option>
              <option value="24h">24 Hours</option>
              <option value="7d">7 Days</option>
              <option value="30d">30 Days</option>
            </select>
            
            <motion.button
              className={styles.analyzeButton}
              onClick={runAnalysis}
              disabled={isAnalyzing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isAnalyzing ? '🔄 Analyzing...' : '🧠 Run Analysis'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Market Indicators */}
      <motion.section
        className={styles.indicatorsSection}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className={styles.sectionTitle}>📊 Market Indicators</h2>
        <div className={styles.indicatorsGrid}>
          {marketIndicators.map((indicator, index) => (
            <motion.div
              key={indicator.name}
              className={panelVariants({ type: 'data', status: 'active' })}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className={styles.indicatorHeader}>
                <span className={styles.indicatorName}>{indicator.name}</span>
                <span className={`${styles.trend} ${styles[indicator.trend]}`}>
                  {indicator.trend === 'up' ? '📈' : indicator.trend === 'down' ? '📉' : '➡️'}
                </span>
              </div>
              <div className={styles.indicatorValue}>
                {formatCurrency(indicator.value)}
              </div>
              <div className={`${styles.indicatorChange} ${indicator.change >= 0 ? styles.positive : styles.negative}`}>
                {formatPercent(indicator.change)}
              </div>
              <div className={styles.confidence}>
                Confidence: {(indicator.confidence * 100).toFixed(0)}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Crypto Metrics */}
      <motion.section
        className={styles.cryptoSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className={styles.sectionTitle}>₿ Crypto Analysis</h2>
        <div className={styles.cryptoGrid}>
          {cryptoMetrics.map((crypto, index) => (
            <motion.div
              key={crypto.symbol}
              className={panelVariants({ type: 'analysis', status: 'active' })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.02, rotateY: 2 }}
            >
              <div className={styles.cryptoHeader}>
                <span className={styles.cryptoSymbol}>{crypto.symbol}</span>
                <span className={`${styles.sentiment} ${styles[crypto.sentiment]}`}>
                  {crypto.sentiment === 'bullish' ? '🟢' : crypto.sentiment === 'bearish' ? '🔴' : '🟡'}
                </span>
              </div>
              <div className={styles.cryptoPrice}>
                {formatCurrency(crypto.price)}
              </div>
              <div className={styles.cryptoStats}>
                <div className={styles.cryptoStat}>
                  <span>24h Change:</span>
                  <span className={crypto.change24h >= 0 ? styles.positive : styles.negative}>
                    {formatPercent(crypto.change24h)}
                  </span>
                </div>
                <div className={styles.cryptoStat}>
                  <span>Volume:</span>
                  <span>{formatLargeNumber(crypto.volume)}</span>
                </div>
                <div className={styles.cryptoStat}>
                  <span>Market Cap:</span>
                  <span>{formatLargeNumber(crypto.marketCap)}</span>
                </div>
                <div className={styles.cryptoStat}>
                  <span>Volatility:</span>
                  <span>{(crypto.volatility * 100).toFixed(1)}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Analysis Results */}
      {analysisResults && (
        <motion.section
          className={styles.resultsSection}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className={styles.sectionTitle}>🎯 Analysis Results</h2>
          <div className={styles.resultsGrid}>
            <motion.div
              className={panelVariants({ type: 'prediction', status: 'success' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>📈 Statistical Summary</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.statistics, null, 2)}
              </pre>
            </motion.div>
            
            <motion.div
              className={panelVariants({ type: 'prediction', status: 'success' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>💰 Economic Insights</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.economics, null, 2)}
              </pre>
            </motion.div>
            
            <motion.div
              className={panelVariants({ type: 'prediction', status: 'success' })}
              whileHover={{ scale: 1.02 }}
            >
              <h3>🔐 Crypto Intelligence</h3>
              <pre className={styles.analysisData}>
                {JSON.stringify(analysisResults.crypto, null, 2)}
              </pre>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Status Footer */}
      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className={styles.statusIndicators}>
          <motion.div 
            className={styles.statusItem}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ⚡ Real-time Updates: {autoUpdate ? 'ON' : 'OFF'}
          </motion.div>
          <div className={styles.statusItem}>
            🧠 AGI Engines: Active
          </div>
          <div className={styles.statusItem}>
            📊 Data Points: {ecoData.length + marketIndicators.length + cryptoMetrics.length}
          </div>
          <div className={styles.statusItem}>
            🕒 Last Update: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </motion.footer>
    </motion.div>
  );
};
