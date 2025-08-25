// components/AGISheet/index.ts
// Centralized exports for AGISheet components
// © Web8 UltraThinking – Ledjan Ahmati

export { AGIBioNature } from './AGIBioNature';
export type { AGIBioNatureProps, Specimen, BiologyData } from './AGIBioNature';

export { default as AGISheet } from './AGISheet';
export { default as AGISheetDemo } from './AGISheetDemo';
export { default as AGISpreadsheetEngine } from './AGISpreadsheetEngine';

// Legacy exports (to be removed)
export { AGICoreUltra } from './AGICoreUltra';
export { default as AGIEcoUltra } from './AGIEcoUltra';
export { default as AGIElUltra } from './AGIElUltra';
export { AGIMedUltra } from './AGIMedUltra';
export { AGIOfficeUltra } from './AGIOfficeUltra';

// Mesh and connectivity
export { default as LoRaConnectUltra } from './LoRaConnectUltra';
export { default as MeshNetworkUltra } from './MeshNetworkUltra';

// AGI Components
export { AGIEco } from './AGIEco';

// Engine exports (working engines)
export { CryptoAnalysisEngine } from './CryptoAnalysisEngine';
export { EconomicsEngine } from './EconomicsEngine';
export { EcoStatisticsEngine } from './EcoStatisticsEngine';
export { MarketAnalyticsEngine } from './MarketAnalyticsEngine';
export { PatternRecognitionEngine } from './PatternRecognitionEngine';

// Engine types
export type { 
  CryptoAsset, 
  TechnicalIndicator, 
  TradingSignal 
} from './CryptoAnalysisEngine';

export type { 
  MarketSegment, 
  CompetitorProfile, 
  MarketOpportunity, 
  ConsumerInsight 
} from './MarketAnalyticsEngine';

export type { 
  DataPattern, 
  AnomalyDetection, 
  PredictionModel, 
  SeasonalPattern 
} from './PatternRecognitionEngine';
