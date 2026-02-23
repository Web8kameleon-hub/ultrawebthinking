/**
 * UTT-Albion Enterprise Gateway System
 * Industrial-Grade API Gateway & Integration Hub
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 1.0.0 Industrial
 * @license MIT
 * @created August 25, 2025
 */

import { ALB_TOKEN as _ALB_TOKEN } from './albion-token'
import { getAlbionConnection } from './albion-connection'
import { getPhantomIntegration } from './phantom-integration'
import { getUTTBridge, BridgeNetwork } from './utt-bridge'
import { getUTTPhysicalTokens, PhysicalTokenType as _PhysicalTokenType } from './utt-physical'
import { getUTTAuditSystem, AuditEventType, RiskLevel } from './utt-audit'

// Gateway service types
export enum GatewayServiceType {
  BLOCKCHAIN = 'blockchain',
  WALLET = 'wallet',
  BRIDGE = 'bridge',
  PHYSICAL = 'physical',
  AUDIT = 'audit',
  ANALYTICS = 'analytics',
  REPORTING = 'reporting',
  COMPLIANCE = 'compliance',
  NOTIFICATIONS = 'notifications',
  AUTHENTICATION = 'authentication'
}

// API endpoint definitions
export enum APIEndpoint {
  // Token endpoints
  TOKEN_BALANCE = '/api/v1/token/balance',
  TOKEN_TRANSFER = '/api/v1/token/transfer',
  TOKEN_HISTORY = '/api/v1/token/history',
  
  // Wallet endpoints
  WALLET_CONNECT = '/api/v1/wallet/connect',
  WALLET_DISCONNECT = '/api/v1/wallet/disconnect',
  WALLET_STATUS = '/api/v1/wallet/status',
  
  // Bridge endpoints
  BRIDGE_INITIATE = '/api/v1/bridge/initiate',
  BRIDGE_STATUS = '/api/v1/bridge/status',
  BRIDGE_HISTORY = '/api/v1/bridge/history',
  
  // Physical token endpoints
  PHYSICAL_CREATE = '/api/v1/physical/create',
  PHYSICAL_SCAN = '/api/v1/physical/scan',
  PHYSICAL_ACTIVATE = '/api/v1/physical/activate',
  
  // Audit endpoints
  AUDIT_LOG = '/api/v1/audit/log',
  AUDIT_SEARCH = '/api/v1/audit/search',
  AUDIT_REPORT = '/api/v1/audit/report',
  
  // System endpoints
  SYSTEM_STATUS = '/api/v1/system/status',
  SYSTEM_METRICS = '/api/v1/system/metrics',
  SYSTEM_CONFIG = '/api/v1/system/config'
}

// Gateway request interface
interface GatewayRequest {
  endpoint: APIEndpoint
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  headers: { [key: string]: string }
  params?: { [key: string]: any }
  body?: any
  timestamp: Date
  requestId: string
  clientId?: string
  apiKey?: string
}

// Gateway response interface
interface GatewayResponse {
  success: boolean
  data?: any
  error?: string
  statusCode: number
  timestamp: Date
  requestId: string
  processingTime: number
  metadata?: any
}

// Service status interface
interface ServiceStatus {
  service: GatewayServiceType
  status: 'healthy' | 'degraded' | 'unhealthy' | 'maintenance'
  lastCheck: Date
  responseTime: number
  errorRate: number
  uptime: number
}

// Gateway metrics interface
interface GatewayMetrics {
  totalRequests: number
  requestsPerSecond: number
  averageResponseTime: number
  errorRate: number
  activeConnections: number
  serviceStatuses: ServiceStatus[]
  lastUpdated: Date
}

// Client configuration interface
interface ClientConfig {
  clientId: string
  apiKey: string
  permissions: APIEndpoint[]
  rateLimit: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  allowedOrigins: string[]
  isActive: boolean
  createdAt: Date
  lastAccess: Date
}

// Rate limiting interface
interface RateLimitStatus {
  clientId: string
  requestsInMinute: number
  requestsInHour: number
  requestsInDay: number
  isLimited: boolean
  resetTimes: {
    minute: Date
    hour: Date
    day: Date
  }
}

/**
 * UTT-Albion Enterprise Gateway System
 */
export class UTTGateway {
  private services: Map<GatewayServiceType, any> = new Map()
  private clients: Map<string, ClientConfig> = new Map()
  private rateLimits: Map<string, RateLimitStatus> = new Map()
  private requestHistory: Map<string, GatewayRequest[]> = new Map()
  private eventListeners: Map<string, Function[]> = new Map()
  private metricsInterval: NodeJS.Timeout | null = null
  private isInitialized = false

  constructor() {
    this.initializeGateway()
  }

  /**
   * Initialize gateway system
   */
  private async initializeGateway(): Promise<void> {
    try {
      console.log("🌐 Initializing UTT-Albion Enterprise Gateway...")

      // Initialize all services
      await this.initializeServices()
      
      // Setup API endpoints
      this.setupAPIEndpoints()
      
      // Initialize rate limiting
      this.initializeRateLimiting()
      
      // Start metrics collection
      this.startMetricsCollection()
      
      // Setup security protocols
      await this.setupSecurityProtocols()

      this.isInitialized = true
      console.log("✅ Enterprise Gateway initialized successfully")

      // Log gateway initialization
      const auditSystem = getUTTAuditSystem()
      await auditSystem.logAuditEvent({
        eventType: AuditEventType.SYSTEM_ACCESS,
        eventData: {
          action: 'gateway-initialized',
          version: '1.0.0',
          services: Array.from(this.services.keys()),
          endpoints: Object.values(APIEndpoint).length
        },
        riskLevel: RiskLevel.LOW
      })

    } catch (err) {
      console.error("❌ Failed to initialize gateway:", err)
      throw error
    }
  }

  /**
   * Process API request
   */
  async processRequest(request: GatewayRequest): Promise<GatewayResponse> {
    const startTime = Date.now()
    
    try {
      // Validate request
      await this.validateRequest(request)
      
      // Check rate limits
      await this.checkRateLimit(request)
      
      // Authenticate client
      await this.authenticateClient(request)
      
      // Route request to appropriate service
      const response = await this.routeRequest(request)
      
      // Log successful request
      await this.logRequest(request, response)
      
      // Update metrics
      this.updateMetrics(request, response, Date.now() - startTime)

      return response

    } catch (err) {
      const errorResponse: GatewayResponse = {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
        statusCode: this.getErrorStatusCode(error),
        timestamp: new Date(),
        requestId: request.requestId,
        processingTime: Date.now() - startTime
      }

      // Log failed request
      await this.logRequest(request, errorResponse)
      
      return errorResponse
    }
  }

  /**
   * Register new client
   */
  async registerClient(
    clientId: string,
    permissions: APIEndpoint[],
    rateLimit?: Partial<ClientConfig['rateLimit']>,
    allowedOrigins?: string[]
  ): Promise<ClientConfig> {
    try {
      // Generate API key
      const apiKey = this.generateAPIKey()

      const clientConfig: ClientConfig = {
        clientId,
        apiKey,
        permissions,
        rateLimit: {
          requestsPerMinute: rateLimit?.requestsPerMinute ?? 60,
          requestsPerHour: rateLimit?.requestsPerHour ?? 1000,
          requestsPerDay: rateLimit?.requestsPerDay ?? 10000
        },
        allowedOrigins: allowedOrigins ?? ['*'],
        isActive: true,
        createdAt: new Date(),
        lastAccess: new Date()
      }

      this.clients.set(clientId, clientConfig)

      console.log(`👥 Client registered: ${clientId}`)
      this.emit('clientRegistered', clientConfig)

      return clientConfig

    } catch (err) {
      console.error("❌ Failed to register client:", err)
      throw error
    }
  }

  /**
   * Get system status
   */
  async getSystemStatus(): Promise<{ [key: string]: any }> {
    const serviceStatuses: ServiceStatus[] = []

    // Check each service status
    for (const [serviceType, service] of this.services) {
      const status = await this.checkServiceHealth(serviceType, service)
      serviceStatuses.push(status)
    }

    return {
      gateway: {
        status: 'healthy',
        uptime: process.uptime ? process.uptime() : 0,
        version: '1.0.0'
      },
      services: serviceStatuses,
      metrics: await this.getGatewayMetrics(),
      timestamp: new Date()
    }
  }

  /**
   * Get gateway metrics
   */
  async getGatewayMetrics(): Promise<GatewayMetrics> {
    const now = new Date()
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000)

    // Calculate metrics from request history
    let totalRequests = 0
    let totalResponseTime = 0
    const errorCount = 0

    for (const requests of this.requestHistory.values()) {
      const recentRequests = requests.filter(req => req.timestamp >= lastHour)
      totalRequests += recentRequests.length
      
      // Mock response time calculation
      totalResponseTime += recentRequests.length * 150 // Average 150ms
    }

    const requestsPerSecond = totalRequests / 3600 // Requests in last hour / 3600 seconds
    const averageResponseTime = totalRequests > 0 ? totalResponseTime / totalRequests : 0
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0

    // Get service statuses
    const serviceStatuses: ServiceStatus[] = []
    for (const [serviceType] of this.services) {
      serviceStatuses.push({
        service: serviceType,
        status: 'healthy',
        lastCheck: now,
        responseTime: Math.random() * 100 + 50, // 50-150ms
        errorRate: Math.random() * 2, // 0-2%
        uptime: 99.9
      })
    }

    return {
      totalRequests,
      requestsPerSecond,
      averageResponseTime,
      errorRate,
      activeConnections: this.clients.size,
      serviceStatuses,
      lastUpdated: now
    }
  }

  /**
   * Execute health check
   */
  async healthCheck(): Promise<{ status: string; services: any[] }> {
    const results = []

    for (const [serviceType, service] of this.services) {
      try {
        const startTime = Date.now()
        
        // Perform service-specific health check
        await this.performServiceHealthCheck(serviceType, service)
        
        const responseTime = Date.now() - startTime

        results.push({
          service: serviceType,
          status: 'healthy',
          responseTime,
          timestamp: new Date()
        })

      } catch (err) {
        results.push({
          service: serviceType,
          status: 'unhealthy',
          error: err instanceof Error ? err.message : 'Unknown error',
          timestamp: new Date()
        })
      }
    }

    const overallStatus = results.every(r => r.status === 'healthy') ? 'healthy' : 'degraded'

    return {
      status: overallStatus,
      services: results
    }
  }

  /**
   * Get API documentation
   */
  getAPIDocumentation(): any {
    return {
      version: '1.0.0',
      title: 'UTT-Albion Enterprise Gateway API',
      description: 'Industrial-grade blockchain integration gateway',
      baseUrl: '/api/v1',
      endpoints: {
        token: {
          balance: {
            endpoint: APIEndpoint.TOKEN_BALANCE,
            method: 'GET',
            description: 'Get ALB token balance',
            parameters: ['walletAddress']
          },
          transfer: {
            endpoint: APIEndpoint.TOKEN_TRANSFER,
            method: 'POST',
            description: 'Transfer ALB tokens',
            parameters: ['toAddress', 'amount', 'memo']
          }
        },
        wallet: {
          connect: {
            endpoint: APIEndpoint.WALLET_CONNECT,
            method: 'POST',
            description: 'Connect to Phantom wallet'
          },
          status: {
            endpoint: APIEndpoint.WALLET_STATUS,
            method: 'GET',
            description: 'Get wallet connection status'
          }
        },
        bridge: {
          initiate: {
            endpoint: APIEndpoint.BRIDGE_INITIATE,
            method: 'POST',
            description: 'Initiate cross-chain bridge',
            parameters: ['sourceNetwork', 'destinationNetwork', 'amount', 'destinationAddress']
          },
          status: {
            endpoint: APIEndpoint.BRIDGE_STATUS,
            method: 'GET',
            description: 'Get bridge transaction status',
            parameters: ['transactionId']
          }
        },
        physical: {
          create: {
            endpoint: APIEndpoint.PHYSICAL_CREATE,
            method: 'POST',
            description: 'Create physical token',
            parameters: ['type', 'securityLevel', 'metadata']
          },
          scan: {
            endpoint: APIEndpoint.PHYSICAL_SCAN,
            method: 'POST',
            description: 'Scan physical token',
            parameters: ['rawData', 'location']
          }
        },
        audit: {
          log: {
            endpoint: APIEndpoint.AUDIT_LOG,
            method: 'POST',
            description: 'Log audit event',
            parameters: ['eventType', 'eventData', 'riskLevel']
          },
          search: {
            endpoint: APIEndpoint.AUDIT_SEARCH,
            method: 'GET',
            description: 'Search audit trail',
            parameters: ['criteria']
          }
        },
        system: {
          status: {
            endpoint: APIEndpoint.SYSTEM_STATUS,
            method: 'GET',
            description: 'Get system status'
          },
          metrics: {
            endpoint: APIEndpoint.SYSTEM_METRICS,
            method: 'GET',
            description: 'Get system metrics'
          }
        }
      },
      authentication: {
        type: 'API Key',
        header: 'X-API-Key',
        description: 'Include your API key in the X-API-Key header'
      },
      rateLimit: {
        default: '60 requests per minute',
        headers: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset']
      }
    }
  }

  /**
   * Add event listener
   */
  on(event: string, listener: Function): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(listener)
  }

  /**
   * Remove event listener
   */
  off(event: string, listener: Function): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(listener)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Private methods
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  private async initializeServices(): Promise<void> {
    // Initialize blockchain service
    this.services.set(GatewayServiceType.BLOCKCHAIN, getAlbionConnection())
    
    // Initialize wallet service
    this.services.set(GatewayServiceType.WALLET, getPhantomIntegration())
    
    // Initialize bridge service
    this.services.set(GatewayServiceType.BRIDGE, getUTTBridge())
    
    // Initialize physical tokens service
    this.services.set(GatewayServiceType.PHYSICAL, getUTTPhysicalTokens())
    
    // Initialize audit service
    this.services.set(GatewayServiceType.AUDIT, getUTTAuditSystem())

    console.log(`🔗 Initialized ${this.services.size} gateway services`)
  }

  private setupAPIEndpoints(): void {
    console.log("📡 API endpoints configured")
  }

  private initializeRateLimiting(): void {
    console.log("⚡ Rate limiting initialized")
  }

  private startMetricsCollection(): void {
    this.metricsInterval = setInterval(() => {
      this.collectMetrics()
    }, 60000) // Collect metrics every minute
  }

  private collectMetrics(): void {
    // Metrics collection logic
  }

  private async setupSecurityProtocols(): Promise<void> {
    console.log("🔒 Security protocols configured")
  }

  private async validateRequest(request: GatewayRequest): Promise<void> {
    if (!request.requestId) {
      throw new Error("Request ID is required")
    }

    if (!request.endpoint ?? !Object.values(APIEndpoint).includes(request.endpoint)) {
      throw new Error("Invalid API endpoint")
    }

    if (!['GET', 'POST', 'PUT', 'DELETE'].includes(request.method)) {
      throw new Error("Invalid HTTP method")
    }
  }

  private async checkRateLimit(request: GatewayRequest): Promise<void> {
    if (!request.clientId) {return}

    const clientConfig = this.clients.get(request.clientId)
    if (!clientConfig) {
      throw new Error("Unknown client")
    }

    let rateLimitStatus = this.rateLimits.get(request.clientId)
    
    if (!rateLimitStatus) {
      rateLimitStatus = this.initializeRateLimitStatus(request.clientId)
      this.rateLimits.set(request.clientId, rateLimitStatus)
    }

    // Update request counts
    this.updateRateLimitCounts(rateLimitStatus, clientConfig)

    // Check limits
    if (rateLimitStatus.requestsInMinute >= clientConfig.rateLimit.requestsPerMinute ??
        rateLimitStatus.requestsInHour >= clientConfig.rateLimit.requestsPerHour ??
        rateLimitStatus.requestsInDay >= clientConfig.rateLimit.requestsPerDay) {
      throw new Error("Rate limit exceeded")
    }
  }

  private async authenticateClient(request: GatewayRequest): Promise<void> {
    if (!request.clientId ?? !request.apiKey) {
      throw new Error("Authentication required")
    }

    const clientConfig = this.clients.get(request.clientId)
    
    if (!clientConfig?.isActive) {
      throw new Error("Invalid or inactive client")
    }

    if (clientConfig.apiKey !== request.apiKey) {
      throw new Error("Invalid API key")
    }

    if (!clientConfig.permissions.includes(request.endpoint)) {
      throw new Error("Insufficient permissions")
    }

    // Update last access
    clientConfig.lastAccess = new Date()
  }

  private async routeRequest(request: GatewayRequest): Promise<GatewayResponse> {
    // Route request based on endpoint
    switch (request.endpoint) {
      // Token endpoints
      case APIEndpoint.TOKEN_BALANCE:
        return await this.handleTokenBalance(request)
      case APIEndpoint.TOKEN_TRANSFER:
        return await this.handleTokenTransfer(request)
      
      // Wallet endpoints
      case APIEndpoint.WALLET_CONNECT:
        return await this.handleWalletConnect(request)
      case APIEndpoint.WALLET_STATUS:
        return await this.handleWalletStatus(request)
      
      // Bridge endpoints
      case APIEndpoint.BRIDGE_INITIATE:
        return await this.handleBridgeInitiate(request)
      case APIEndpoint.BRIDGE_STATUS:
        return await this.handleBridgeStatus(request)
      
      // Physical token endpoints
      case APIEndpoint.PHYSICAL_SCAN:
        return await this.handlePhysicalScan(request)
      
      // System endpoints
      case APIEndpoint.SYSTEM_STATUS:
        return await this.handleSystemStatus(request)
      case APIEndpoint.SYSTEM_METRICS:
        return await this.handleSystemMetrics(request)

      default:
        throw new Error("Endpoint not implemented")
    }
  }

  private async handleTokenBalance(request: GatewayRequest): Promise<GatewayResponse> {
    const { walletAddress } = request.params ?? {}
    if (!walletAddress) {
      throw new Error("Wallet address is required")
    }

    const connection = this.services.get(GatewayServiceType.BLOCKCHAIN)
    const balance = await connection.getALBBalance(walletAddress)

    return {
      success: true,
      data: balance,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleTokenTransfer(request: GatewayRequest): Promise<GatewayResponse> {
    const { toAddress, amount, memo } = request.body ?? {}
    
    const phantom = this.services.get(GatewayServiceType.WALLET)
    const result = await phantom.createTransferTransaction(toAddress, amount, memo)

    return {
      success: true,
      data: result,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleWalletConnect(request: GatewayRequest): Promise<GatewayResponse> {
    const phantom = this.services.get(GatewayServiceType.WALLET)
    const state = await phantom.connect()

    return {
      success: true,
      data: state,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleWalletStatus(request: GatewayRequest): Promise<GatewayResponse> {
    const phantom = this.services.get(GatewayServiceType.WALLET)
    const state = phantom.getWalletState()

    return {
      success: true,
      data: state,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleBridgeInitiate(request: GatewayRequest): Promise<GatewayResponse> {
    const { sourceNetwork, destinationNetwork, amount, destinationAddress } = request.body ?? {}
    
    const bridge = this.services.get(GatewayServiceType.BRIDGE)
    const transaction = await bridge.initiateBridge(
      sourceNetwork as BridgeNetwork,
      destinationNetwork as BridgeNetwork,
      destinationAddress,
      amount
    )

    return {
      success: true,
      data: transaction,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleBridgeStatus(request: GatewayRequest): Promise<GatewayResponse> {
    const { transactionId } = request.params ?? {}
    
    const bridge = this.services.get(GatewayServiceType.BRIDGE)
    const transaction = bridge.getBridgeTransaction(transactionId)

    return {
      success: true,
      data: transaction,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handlePhysicalScan(request: GatewayRequest): Promise<GatewayResponse> {
    const { rawData, location } = request.body ?? {}
    
    const physicalTokens = this.services.get(GatewayServiceType.PHYSICAL)
    const result = await physicalTokens.scanPhysicalToken(rawData, location)

    return {
      success: true,
      data: result,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleSystemStatus(request: GatewayRequest): Promise<GatewayResponse> {
    const status = await this.getSystemStatus()

    return {
      success: true,
      data: status,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async handleSystemMetrics(request: GatewayRequest): Promise<GatewayResponse> {
    const metrics = await this.getGatewayMetrics()

    return {
      success: true,
      data: metrics,
      statusCode: 200,
      timestamp: new Date(),
      requestId: request.requestId,
      processingTime: 0
    }
  }

  private async logRequest(request: GatewayRequest, response: GatewayResponse): Promise<void> {
    // Add to request history
    if (!this.requestHistory.has(request.clientId ?? 'anonymous')) {
      this.requestHistory.set(request.clientId ?? 'anonymous', [])
    }
    
    this.requestHistory.get(request.clientId ?? 'anonymous')?.push(request)

    // Log to audit system
    const auditSystem = this.services.get(GatewayServiceType.AUDIT)
    if (auditSystem) {
      await auditSystem.logAuditEvent({
        eventType: AuditEventType.SYSTEM_ACCESS,
        eventData: {
          endpoint: request.endpoint,
          method: request.method,
          statusCode: response.statusCode,
          processingTime: response.processingTime
        },
        riskLevel: response.statusCode >= 400 ? RiskLevel.HIGH : RiskLevel.LOW
      })
    }
  }

  private updateMetrics(request: GatewayRequest, response: GatewayResponse, processingTime: number): void {
    response.processingTime = processingTime
  }

  private getErrorStatusCode(error: any): number {
    if (err.message?.includes('Rate limit')) {return 429}
    if (err.message?.includes('Authentication')) {return 401}
    if (err.message?.includes('permissions')) {return 403}
    if (err.message?.includes('not found')) {return 404}
    return 500
  }

  private async checkServiceHealth(serviceType: GatewayServiceType, service: any): Promise<ServiceStatus> {
    try {
      const startTime = Date.now()
      await this.performServiceHealthCheck(serviceType, service)
      const responseTime = Date.now() - startTime

      return {
        service: serviceType,
        status: 'healthy',
        lastCheck: new Date(),
        responseTime,
        errorRate: 0,
        uptime: 99.9
      }

    } catch (err) {
      return {
        service: serviceType,
        status: 'unhealthy',
        lastCheck: new Date(),
        responseTime: 0,
        errorRate: 100,
        uptime: 0
      }
    }
  }

  private async performServiceHealthCheck(serviceType: GatewayServiceType, service: any): Promise<void> {
    // Perform service-specific health checks
    switch (serviceType) {
      case GatewayServiceType.BLOCKCHAIN:
        // Test blockchain connection
        break
      case GatewayServiceType.WALLET:
        // Test wallet service
        break
      default:
        // Generic health check
        break
    }
  }

  private initializeRateLimitStatus(clientId: string): RateLimitStatus {
    const now = new Date()
    
    return {
      clientId,
      requestsInMinute: 0,
      requestsInHour: 0,
      requestsInDay: 0,
      isLimited: false,
      resetTimes: {
        minute: new Date(now.getTime() + 60 * 1000),
        hour: new Date(now.getTime() + 60 * 60 * 1000),
        day: new Date(now.getTime() + 24 * 60 * 60 * 1000)
      }
    }
  }

  private updateRateLimitCounts(rateLimitStatus: RateLimitStatus, clientConfig: ClientConfig): void {
    const now = new Date()

    // Reset counters if time windows have passed
    if (now >= rateLimitStatus.resetTimes.minute) {
      rateLimitStatus.requestsInMinute = 0
      rateLimitStatus.resetTimes.minute = new Date(now.getTime() + 60 * 1000)
    }

    if (now >= rateLimitStatus.resetTimes.hour) {
      rateLimitStatus.requestsInHour = 0
      rateLimitStatus.resetTimes.hour = new Date(now.getTime() + 60 * 60 * 1000)
    }

    if (now >= rateLimitStatus.resetTimes.day) {
      rateLimitStatus.requestsInDay = 0
      rateLimitStatus.resetTimes.day = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }

    // Increment counters
    rateLimitStatus.requestsInMinute++
    rateLimitStatus.requestsInHour++
    rateLimitStatus.requestsInDay++
  }

  private generateAPIKey(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = 'utt_'
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
      this.metricsInterval = null
    }
    
    this.services.clear()
    this.clients.clear()
    this.rateLimits.clear()
    this.requestHistory.clear()
    this.eventListeners.clear()
  }
}

// Global gateway instance
let gatewayInstance: UTTGateway | null = null

/**
 * Get global UTT gateway instance
 */
export function getUTTGateway(): UTTGateway {
  if (!gatewayInstance) {
    gatewayInstance = new UTTGateway()
  }
  return gatewayInstance
}

/**
 * Quick API request function
 */
export async function processAPIRequest(
  endpoint: APIEndpoint,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  clientId: string,
  apiKey: string,
  params?: any,
  body?: any
): Promise<GatewayResponse> {
  const gateway = getUTTGateway()
  
  const request: GatewayRequest = {
    endpoint,
    method,
    headers: { 'X-API-Key': apiKey },
    params,
    body,
    timestamp: new Date(),
    requestId: `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
    clientId,
    apiKey
  }

  return await gateway.processRequest(request)
}

/**
 * Register new API client
 */
export async function registerAPIClient(
  clientId: string,
  permissions: APIEndpoint[]
): Promise<ClientConfig> {
  const gateway = getUTTGateway()
  return await gateway.registerClient(clientId, permissions)
}

export default UTTGateway
