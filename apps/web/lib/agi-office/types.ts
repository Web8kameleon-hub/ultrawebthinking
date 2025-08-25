/**
 * AGI Office Suite - Type Definitions
 * EuroWeb Platform - Comprehensive Office Suite Types
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.4.0 Ultra
 * @license MIT
 * @created August 25, 2025
 */

// Document Management Types
export interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  author: string
  authorId: string
  version: number
  size: number
  status: 'draft' | 'published' | 'archived' | 'shared'
  tags: string[]
  category: string
  language: string
  permissions: DocumentPermissions
  metadata: DocumentMetadata
}

export interface DocumentPermissions {
  owner: string
  editors: string[]
  viewers: string[]
  isPublic: boolean
  allowComments: boolean
  allowDownload: boolean
  expiresAt?: Date
}

export interface DocumentMetadata {
  wordCount: number
  characterCount: number
  readingTime: number
  lastSaved: Date
  autoSaveEnabled: boolean
  encryptionLevel: 'none' | 'basic' | 'advanced'
  backupCount: number
}

// Activity and Collaboration Types
export interface ActivityEvent {
  id: string
  type: 'edit' | 'save' | 'share' | 'comment' | 'view' | 'download' | 'create' | 'delete'
  timestamp: Date
  userId: string
  userName: string
  documentId?: string
  documentTitle?: string
  description: string
  details?: string
  location?: string
  deviceInfo?: string
  duration?: number
  icon?: string
  priority?: 'low' | 'medium' | 'high'
}

export interface Comment {
  id: string
  documentId?: string
  userId?: string
  userName?: string
  author: string
  content: string
  timestamp?: Date
  created: Date
  location: string
  position?: CommentPosition
  status?: 'active' | 'resolved' | 'deleted'
  resolved: boolean
  replies: Comment[]
  isEdited?: boolean
}

export interface CommentPosition {
  startIndex: number
  endIndex: number
  selectedText: string
  paragraphIndex?: number
}

// Collaboration Types
export interface Collaborator {
  id: string
  name: string
  email: string
  role: 'viewer' | 'commenter' | 'editor' | 'owner'
  online: boolean
  cursor?: {
    sheet?: string
    cell?: string
    selection?: string
  }
  avatar?: string
  joinedAt: Date
  lastSeen: Date
}

export interface SecurityContext {
  level: 'public' | 'internal' | 'confidential' | 'secret' | 'nato-grade'
  accessLog: AccessLogEntry[]
  encryption: boolean
  auditRequired: boolean
}

export interface AccessLogEntry {
  userId: string
  action: string
  timestamp: Date
  ip: string
  userAgent: string
  success: boolean
}

// System and Performance Types
export interface SystemMetrics {
  memoryUsage: number
  cpuUsage: number
  diskUsage: number
  networkLatency: number
  activeUsers: number
  documentsCount: number
  totalStorage: number
  usedStorage: number
  lastUpdated: Date
  uptime: number
  errorRate: number
  throughput: number
}

export interface UserSession {
  id: string
  userId: string
  userName: string
  email: string
  avatar?: string
  isOnline: boolean
  lastActivity: Date
  activeDocument?: string
  permissions: UserPermissions
  preferences: UserPreferences
}

export interface UserPermissions {
  canCreate: boolean
  canEdit: boolean
  canDelete: boolean
  canShare: boolean
  canExport: boolean
  canManageUsers: boolean
  isAdmin: boolean
  role: 'viewer' | 'editor' | 'admin' | 'owner'
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  fontSize: number
  fontFamily: string
  autoSave: boolean
  autoSaveInterval: number
  spellCheck: boolean
  wordWrap: boolean
  showLineNumbers: boolean
  language: string
  timezone: string
}

// AI Assistant Types
export interface AIAssistant {
  id: string
  name: string
  model: string
  isActive: boolean
  capabilities: AICapabilities
  usage: AIUsageStats
  settings: AISettings
}

export interface AICapabilities {
  textGeneration: boolean
  textSummary: boolean
  textTranslation: boolean
  grammarCheck: boolean
  styleAnalysis: boolean
  contentSuggestions: boolean
  documentAnalysis: boolean
  codeGeneration: boolean
}

export interface AIUsageStats {
  totalRequests: number
  successfulRequests: number
  averageResponseTime: number
  tokensUsed: number
  lastUsed: Date
  dailyLimit: number
  remainingQuota: number
}

export interface AISettings {
  creativityLevel: number
  responseLength: 'short' | 'medium' | 'long'
  tone: 'professional' | 'casual' | 'creative' | 'technical'
  language: string
  enableAutoSuggestions: boolean
  enableRealTimeAnalysis: boolean
}

// Template and Format Types
export interface DocumentTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail?: string
  content: string
  variables: TemplateVariable[]
  isPublic: boolean
  usageCount: number
  rating: number
  createdBy: string
  createdAt: Date
}

export interface TemplateVariable {
  name: string
  type: 'text' | 'number' | 'date' | 'boolean' | 'select'
  defaultValue: any
  options?: string[]
  required: boolean
  description: string
}

// Export and Import Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'html' | 'markdown' | 'odt'
  includeComments: boolean
  includeMetadata: boolean
  quality: 'low' | 'medium' | 'high'
  pageSize?: string
  orientation?: 'portrait' | 'landscape'
  margins?: PageMargins
}

export interface PageMargins {
  top: number
  right: number
  bottom: number
  left: number
}

export interface ImportResult {
  success: boolean
  documentId?: string
  errors: string[]
  warnings: string[]
  stats: ImportStats
}

export interface ImportStats {
  originalSize: number
  processedSize: number
  wordCount: number
  processingTime: number
  imagesConverted: number
  stylesApplied: number
}

// Search and Filter Types
export interface SearchQuery {
  text: string
  filters: SearchFilters
  sortBy: 'relevance' | 'date' | 'title' | 'author'
  sortOrder: 'asc' | 'desc'
  limit: number
  offset: number
}

export interface SearchFilters {
  author?: string
  dateRange?: DateRange
  category?: string
  tags?: string[]
  status?: Document['status']
  hasComments?: boolean
  language?: string
}

export interface DateRange {
  start: Date
  end: Date
}

export interface SearchResult {
  documents: Document[]
  total: number
  hasMore: boolean
  executionTime: number
  suggestions: string[]
}

// Notification Types
export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionText?: string
  userId: string
  documentId?: string
  expiresAt?: Date
}

// Backup and Version Control Types
export interface DocumentVersion {
  id: string
  documentId: string
  version: number
  content: string
  title: string
  createdAt: Date
  createdBy: string
  changesSummary: string
  size: number
  isAutoSave: boolean
}

export interface BackupInfo {
  id: string
  documentId: string
  version: number
  timestamp: Date
  size: number
  checksum: string
  location: string
  isEncrypted: boolean
  restoreCount: number
}

// Error Handling Types
export interface AGIOfficeError {
  code: string
  message: string
  details?: any
  timestamp: Date
  userId?: string
  documentId?: string
  action?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// Analytics Types
export interface DocumentAnalytics {
  documentId: string
  views: number
  uniqueViewers: number
  edits: number
  comments: number
  shares: number
  downloads: number
  averageReadTime: number
  popularSections: string[]
  peakUsageHours: number[]
  lastAnalyzed: Date
}

export interface UserAnalytics {
  userId: string
  documentsCreated: number
  documentsEdited: number
  totalWords: number
  activeHours: number
  collaborations: number
  averageSessionTime: number
  mostUsedFeatures: string[]
  productivityScore: number
  lastActive: Date
}

// Collaboration Engine Types
export interface CollaborationSession {
  id: string
  documentId: string
  participants: UserSession[]
  isActive: boolean
  startedAt: Date
  lastActivity: Date
  changes: CollaborationChange[]
  conflicts: CollaborationConflict[]
}

export interface CollaborationChange {
  id: string
  userId: string
  timestamp: Date
  type: 'insert' | 'delete' | 'format' | 'move'
  position: number
  content: string
  metadata: any
}

export interface CollaborationConflict {
  id: string
  timestamp: Date
  users: string[]
  position: number
  conflictType: 'simultaneous_edit' | 'delete_modify' | 'format_conflict'
  resolved: boolean
  resolution?: string
}

// Plugin and Extension Types
export interface AGIPlugin {
  id: string
  name: string
  version: string
  description: string
  author: string
  isEnabled: boolean
  permissions: string[]
  settings: Record<string, any>
  hooks: PluginHook[]
}

export interface PluginHook {
  event: string
  callback: string
  priority: number
}

// Configuration Types
export interface AGIOfficeConfig {
  maxDocumentSize: number
  maxVersionHistory: number
  autoSaveInterval: number
  sessionTimeout: number
  maxConcurrentUsers: number
  allowedFileTypes: string[]
  enableRealTimeCollaboration: boolean
  enableAIAssistant: boolean
  enableAdvancedAnalytics: boolean
  enableEncryption: boolean
  backupRetentionDays: number
}

// Response Types for API
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: AGIOfficeError
  timestamp: Date
  requestId: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

// Event Types
export type DocumentEvent = 
  | 'document:created'
  | 'document:updated'
  | 'document:deleted'
  | 'document:shared'
  | 'document:opened'
  | 'document:closed'
  | 'document:exported'
  | 'document:imported'

export type UserEvent = 
  | 'user:login'
  | 'user:logout'
  | 'user:registered'
  | 'user:profile_updated'
  | 'user:permission_changed'

export type SystemEvent = 
  | 'system:backup_completed'
  | 'system:maintenance_start'
  | 'system:maintenance_end'
  | 'system:error_occurred'
  | 'system:performance_alert'

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type DocumentStatus = Document['status']
export type NotificationType = Notification['type']
export type UserRole = UserPermissions['role']
export type ExportFormat = ExportOptions['format']

// Constants
export const DOCUMENT_STATUSES = ['draft', 'published', 'archived', 'shared'] as const
export const USER_ROLES = ['viewer', 'editor', 'admin', 'owner'] as const
export const EXPORT_FORMATS = ['pdf', 'docx', 'txt', 'html', 'markdown', 'odt'] as const
export const NOTIFICATION_TYPES = ['info', 'success', 'warning', 'error'] as const
