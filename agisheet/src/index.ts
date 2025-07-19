/**
 * AGISheet - Kameleoni i Inteligjencës Operacionale
 * Excel-like interface me tru AGI për Web8 EuroWeb Platform
 */

export { AGISheetCore } from './core/AGISheetCore.js';
export { AGISheetEngine } from './engine/AGISheetEngine.js';
export { AGISheetUI } from './ui/AGISheetUI.js';
export { KameleonMode } from './core/KameleonMode.js';
export { AGIBinder } from './core/AGIBinder.js';
export { LayerController } from './controllers/LayerController.js';
export { DecisionChain } from './controllers/DecisionChain.js';
export { OperationalDashboard } from './controllers/OperationalDashboard.js';

// Types
export type {
  AGISheetConfig,
  CellData,
  LayerStatus,
  KameleonModeType,
  AGIBindingConfig,
  OperationalCommand,
  DecisionChainNode
} from './types/index.js';

// Constants
export const AGISHEET_VERSION = '1.0.0';
export const SUPPORTED_FORMATS = ['excel', 'csv', 'json', 'agi'] as const;
export const KAMELEON_MODES = [
  'analysis',
  'decision',
  'planning', 
  'control',
  'task',
  'admin',
  'industrial'
] as const;
