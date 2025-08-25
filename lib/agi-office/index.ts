/**
 * AGI Office Suite - Main Library Export
 * EuroWeb Platform - Complete Office Suite
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra
 * @license MIT
 * @created August 25, 2025
 */

// Export all types
export * from './types'

// Core Components (to be imported from components)
export type { 
  Document, 
  DocumentPermissions, 
  DocumentMetadata,
  ActivityEvent,
  Comment,
  CommentPosition,
  SystemMetrics,
  UserSession,
  UserPermissions,
  UserPreferences,
  AIAssistant,
  AICapabilities,
  AIUsageStats,
  AISettings,
  DocumentTemplate,
  TemplateVariable,
  ExportOptions,
  PageMargins,
  ImportResult,
  ImportStats,
  SearchQuery,
  SearchFilters,
  DateRange,
  SearchResult,
  Notification,
  DocumentVersion,
  BackupInfo,
  AGIOfficeError,
  DocumentAnalytics,
  UserAnalytics,
  CollaborationSession,
  CollaborationChange,
  CollaborationConflict,
  AGIPlugin,
  PluginHook,
  AGIOfficeConfig,
  APIResponse,
  PaginatedResponse,
  DocumentEvent,
  UserEvent,
  SystemEvent,
  DeepPartial,
  DocumentStatus,
  NotificationType,
  UserRole,
  ExportFormat
} from './types'

// Re-export utility functions if they exist
export const AGI_OFFICE_VERSION = '8.4.0'
export const AGI_OFFICE_BUILD = 'Ultra'
export const AGI_OFFICE_RELEASE_DATE = '2025-08-25'

// Configuration defaults
export const DEFAULT_THEME = 'dark'
export const DEFAULT_LANGUAGE = 'en'
export const DEFAULT_AUTO_SAVE_INTERVAL = 5000 // 5 seconds
export const DEFAULT_COLLABORATION_ENABLED = true
export const DEFAULT_FORMULA_ENGINE_ENABLED = true
