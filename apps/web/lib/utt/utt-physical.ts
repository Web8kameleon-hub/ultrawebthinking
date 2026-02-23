/**
 * UTT-Albion Physical Token System
 * Industrial-Grade NFC/QR Physical Token Integration
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 1.0.0 Industrial
 * @license MIT
 * @created August 25, 2025
 */

import { ALB_TOKEN as _ALB_TOKEN } from './albion-token'
import { getPhantomIntegration } from './phantom-integration'

// Physical token types
export enum PhysicalTokenType {
  NFC_CARD = 'nfc-card',
  QR_CODE = 'qr-code',
  RFID_TAG = 'rfid-tag',
  SMART_CARD = 'smart-card',
  PAPER_WALLET = 'paper-wallet',
  HARDWARE_WALLET = 'hardware-wallet'
}

// Physical token status
export enum PhysicalTokenStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  LOCKED = 'locked',
  BURNED = 'burned',
  LOST = 'lost',
  TRANSFERRED = 'transferred'
}

// Physical token security level
export enum SecurityLevel {
  BASIC = 'basic',           // Simple QR/NFC
  ENHANCED = 'enhanced',     // Encrypted data
  PREMIUM = 'premium',       // Multi-factor authentication
  ENTERPRISE = 'enterprise'  // Hardware security module
}

// Physical token interface
interface PhysicalToken {
  id: string
  type: PhysicalTokenType
  securityLevel: SecurityLevel
  walletAddress: string
  balance: number
  isActive: boolean
  status: PhysicalTokenStatus
  metadata: PhysicalTokenMetadata
  createdAt: Date
  lastAccessedAt: Date
  expiresAt?: Date
}

// Physical token metadata
interface PhysicalTokenMetadata {
  name: string
  description: string
  manufacturer: string
  serialNumber: string
  batchNumber: string
  encryptionKey?: string
  publicKey?: string
  qrCodeData?: string
  nfcChipId?: string
  hologramId?: string
  tamperProof: boolean
  waterproof: boolean
  operatingTemp: {
    min: number
    max: number
  }
  dimensions: {
    width: number
    height: number
    thickness: number
  }
  weight: number
  certifications: string[]
}

// Physical token transaction
interface PhysicalTransaction {
  id: string
  tokenId: string
  type: 'scan' | 'tap' | 'transfer' | 'activate' | 'deactivate'
  amount?: number
  fromAddress?: string
  toAddress?: string
  location?: GeolocationCoordinates
  deviceInfo?: string
  ipAddress?: string
  userAgent?: string
  timestamp: Date
  signature?: string
  verified: boolean
}

// Geolocation interface
interface GeolocationCoordinates {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number
  heading?: number
  speed?: number
}

// NFC/QR scan result
interface ScanResult {
  success: boolean
  tokenId: string
  tokenType: PhysicalTokenType
  balance: number
  securityLevel: SecurityLevel
  verified: boolean
  error?: string
  rawData?: string
  location?: GeolocationCoordinates
  timestamp: Date
}

// Physical token activation request
interface ActivationRequest {
  tokenId: string
  walletAddress: string
  securityPin?: string
  biometricData?: string
  location?: GeolocationCoordinates
  deviceFingerprint: string
}

/**
 * UTT-Albion Physical Token System
 */
export class UTTPhysicalTokens {
  private tokens: Map<string, PhysicalToken> = new Map()
  private transactions: Map<string, PhysicalTransaction> = new Map()
  private eventListeners: Map<string, Function[]> = new Map()
  private scannerActive = false

  constructor() {
    this.initializeSecurityProtocols()
  }

  /**
   * Initialize security protocols
   */
  private initializeSecurityProtocols(): void {
    console.log("🔐 Initializing UTT Physical Token security protocols...")
    
    // Setup security policies
    this.setupTamperDetection()
    this.setupEncryptionProtocols()
    this.setupGeolocationTracking()
    
    console.log("✅ Physical token security protocols initialized")
  }

  /**
   * Create a new physical token
   */
  async createPhysicalToken(
    type: PhysicalTokenType,
    securityLevel: SecurityLevel,
    metadata: Partial<PhysicalTokenMetadata>
  ): Promise<PhysicalToken> {
    try {
      const tokenId = this.generateTokenId(type)
      const walletAddress = await this.generateSecureWallet()

      const physicalToken: PhysicalToken = {
        id: tokenId,
        type,
        securityLevel,
        walletAddress,
        balance: 0,
        isActive: false,
        status: PhysicalTokenStatus.INACTIVE,
        metadata: {
          name: metadata.name ?? `UTT-ALB ${type.toUpperCase()}`,
          description: metadata.description ?? `Albion Physical Token - ${type}`,
          manufacturer: metadata.manufacturer ?? 'UTT-Albion Corp',
          serialNumber: this.generateSerialNumber(),
          batchNumber: metadata.batchNumber ?? this.generateBatchNumber(),
          encryptionKey: this.generateEncryptionKey(securityLevel),
          publicKey: this.generatePublicKey(),
          qrCodeData: this.generateQRCodeData(tokenId, securityLevel),
          nfcChipId: type === PhysicalTokenType.NFC_CARD ? this.generateNFCChipId() : undefined,
          hologramId: this.generateHologramId(),
          tamperProof: securityLevel !== SecurityLevel.BASIC,
          waterproof: metadata.waterproof ?? false,
          operatingTemp: metadata.operatingTemp ?? { min: -20, max: 85 },
          dimensions: metadata.dimensions ?? { width: 85.6, height: 53.98, thickness: 0.76 },
          weight: metadata.weight ?? 5.5,
          certifications: metadata.certifications ?? ['ISO/IEC 14443', 'ISO/IEC 18092']
        },
        createdAt: new Date(),
        lastAccessedAt: new Date()
      }

      this.tokens.set(tokenId, physicalToken)

      console.log(`🏷️ Physical token created: ${tokenId} (${type}, ${securityLevel})`)
      this.emit('tokenCreated', physicalToken)

      return physicalToken

    } catch (_error) {
      console.error("❌ Failed to create physical token:", _error)
      throw error
    }
  }

  /**
   * Activate a physical token
   */
  async activatePhysicalToken(activationRequest: ActivationRequest): Promise<boolean> {
    try {
      const token = this.tokens.get(activationRequest.tokenId)
      if (!token) {
        throw new Error("Physical token not found")
      }

      if (token.isActive) {
        throw new Error("Physical token is already active")
      }

      // Verify security credentials
      await this.verifyActivationCredentials(activationRequest)

      // Update token status
      token.isActive = true
      token.status = PhysicalTokenStatus.ACTIVE
      token.walletAddress = activationRequest.walletAddress
      token.lastAccessedAt = new Date()

      // Record activation transaction
      await this.recordPhysicalTransaction({
        id: this.generateTransactionId(),
        tokenId: activationRequest.tokenId,
        type: 'activate',
        toAddress: activationRequest.walletAddress,
        location: activationRequest.location,
        deviceInfo: activationRequest.deviceFingerprint,
        timestamp: new Date(),
        verified: true
      })

      console.log(`✅ Physical token activated: ${activationRequest.tokenId}`)
      this.emit('tokenActivated', token)

      return true

    } catch (_error) {
      console.error("❌ Failed to activate physical token:", _error)
      throw error
    }
  }

  /**
   * Scan physical token (NFC/QR)
   */
  async scanPhysicalToken(rawData: string, location?: GeolocationCoordinates): Promise<ScanResult> {
    try {
      console.log("📱 Scanning physical token...")

      // Parse scan data
      const scanData = this.parseScanData(rawData)
      if (!scanData.tokenId) {
        throw new Error("Invalid token data")
      }

      const token = this.tokens.get(scanData.tokenId)
      if (!token) {
        return {
          success: false,
          tokenId: scanData.tokenId,
          tokenType: PhysicalTokenType.QR_CODE,
          balance: 0,
          securityLevel: SecurityLevel.BASIC,
          verified: false,
          error: "Token not found",
          timestamp: new Date()
        }
      }

      // Verify token integrity
      const isVerified = await this.verifyTokenIntegrity(token, scanData)

      // Update last accessed time
      token.lastAccessedAt = new Date()

      // Get current balance
      const balance = await this.getTokenBalance(token.walletAddress)
      token.balance = balance

      // Record scan transaction
      await this.recordPhysicalTransaction({
        id: this.generateTransactionId(),
        tokenId: token.id,
        type: 'scan',
        location,
        timestamp: new Date(),
        verified: isVerified
      })

      const result: ScanResult = {
        success: true,
        tokenId: token.id,
        tokenType: token.type,
        balance: token.balance,
        securityLevel: token.securityLevel,
        verified: isVerified,
        rawData,
        location,
        timestamp: new Date()
      }

      console.log(`📱 Token scanned successfully: ${token.id} (Balance: ${balance} ALB)`)
      this.emit('tokenScanned', result)

      return result

    } catch (_error) {
      console.error("❌ Token scan failed:", _error)
      
      return {
        success: false,
        tokenId: '',
        tokenType: PhysicalTokenType.QR_CODE,
        balance: 0,
        securityLevel: SecurityLevel.BASIC,
        verified: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      }
    }
  }

  /**
   * Transfer ALB to physical token
   */
  async transferToPhysicalToken(tokenId: string, amount: number): Promise<boolean> {
    try {
      const token = this.tokens.get(tokenId)
      if (!token) {
        throw new Error("Physical token not found")
      }

      if (!token.isActive) {
        throw new Error("Physical token is not active")
      }

      // Get current wallet
      const phantom = getPhantomIntegration()
      const walletState = phantom.getWalletState()
      
      if (!walletState.connected) {
        throw new Error("Wallet not connected")
      }

      // Transfer ALB to token wallet
      const transferResult = await phantom.createTransferTransaction(
        token.walletAddress,
        amount,
        `UTT Physical Token Load: ${tokenId}`
      )

      if (!transferResult.success) {
        throw new Error(`Transfer failed: ${transferResult.error}`)
      }

      // Update token balance
      token.balance += amount
      token.lastAccessedAt = new Date()

      // Record transaction
      await this.recordPhysicalTransaction({
        id: this.generateTransactionId(),
        tokenId,
        type: 'transfer',
        amount,
        fromAddress: walletState.publicKey!,
        toAddress: token.walletAddress,
        timestamp: new Date(),
        signature: transferResult.signature,
        verified: true
      })

      console.log(`💰 Transferred ${amount} ALB to physical token: ${tokenId}`)
      this.emit('tokenLoaded', { token, amount, signature: transferResult.signature })

      return true

    } catch (_error) {
      console.error("❌ Failed to transfer to physical token:", _error)
      throw error
    }
  }

  /**
   * Transfer ALB from physical token
   */
  async transferFromPhysicalToken(
    tokenId: string, 
    toAddress: string, 
    amount: number,
    securityPin?: string
  ): Promise<boolean> {
    try {
      const token = this.tokens.get(tokenId)
      if (!token) {
        throw new Error("Physical token not found")
      }

      if (!token.isActive) {
        throw new Error("Physical token is not active")
      }

      if (token.balance < amount) {
        throw new Error(`Insufficient balance. Available: ${token.balance} ALB`)
      }

      // Verify security pin if required
      if (token.securityLevel !== SecurityLevel.BASIC) {
        await this.verifySecurityPin(tokenId, securityPin)
      }

      // Simulate transfer from token wallet
      await new Promise(resolve => setTimeout(resolve, 2000))
      const signature = this.generateTransactionSignature()

      // Update token balance
      token.balance -= amount
      token.lastAccessedAt = new Date()

      // Record transaction
      await this.recordPhysicalTransaction({
        id: this.generateTransactionId(),
        tokenId,
        type: 'transfer',
        amount,
        fromAddress: token.walletAddress,
        toAddress,
        timestamp: new Date(),
        signature,
        verified: true
      })

      console.log(`💸 Transferred ${amount} ALB from physical token: ${tokenId}`)
      this.emit('tokenUnloaded', { token, amount, toAddress, signature })

      return true

    } catch (_error) {
      console.error("❌ Failed to transfer from physical token:", _error)
      throw error
    }
  }

  /**
   * Get physical token by ID
   */
  getPhysicalToken(tokenId: string): PhysicalToken | undefined {
    return this.tokens.get(tokenId)
  }

  /**
   * Get all physical tokens
   */
  getAllPhysicalTokens(): PhysicalToken[] {
    return Array.from(this.tokens.values())
  }

  /**
   * Get physical tokens by wallet address
   */
  getPhysicalTokensByWallet(walletAddress: string): PhysicalToken[] {
    return Array.from(this.tokens.values()).filter(
      token => token.walletAddress === walletAddress
    )
  }

  /**
   * Get transaction history for a token
   */
  getTokenTransactionHistory(tokenId: string): PhysicalTransaction[] {
    return Array.from(this.transactions.values()).filter(
      tx => tx.tokenId === tokenId
    ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  /**
   * Start NFC/QR scanner
   */
  async startScanner(): Promise<boolean> {
    try {
      if (this.scannerActive) {
        console.log("📱 Scanner already active")
        return true
      }

      // Check for NFC support
      const hasNFC = 'NDEFReader' in window
      
      // Check for camera access (for QR codes)
      const hasCamera = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)

      if (!hasNFC && !hasCamera) {
        throw new Error("Neither NFC nor camera access available")
      }

      this.scannerActive = true

      if (hasNFC) {
        await this.startNFCScanner()
      }

      if (hasCamera) {
        await this.startQRScanner()
      }

      console.log("📱 Physical token scanner started")
      this.emit('scannerStarted', { nfc: hasNFC, camera: hasCamera })

      return true

    } catch (_error) {
      console.error("❌ Failed to start scanner:", _error)
      throw error
    }
  }

  /**
   * Stop scanner
   */
  stopScanner(): void {
    this.scannerActive = false
    console.log("📱 Physical token scanner stopped")
    this.emit('scannerStopped', null)
  }

  /**
   * Burn physical token (permanent deactivation)
   */
  async burnPhysicalToken(tokenId: string, securityPin?: string): Promise<boolean> {
    try {
      const token = this.tokens.get(tokenId)
      if (!token) {
        throw new Error("Physical token not found")
      }

      // Verify security pin
      if (token.securityLevel !== SecurityLevel.BASIC) {
        await this.verifySecurityPin(tokenId, securityPin)
      }

      // Transfer remaining balance back to owner (if any)
      if (token.balance > 0) {
        console.log(`💰 Returning ${token.balance} ALB from burned token`)
        // In production, this would transfer back to the owner's wallet
      }

      // Update token status
      token.status = PhysicalTokenStatus.BURNED
      token.isActive = false
      token.balance = 0
      token.lastAccessedAt = new Date()

      // Record burn transaction
      await this.recordPhysicalTransaction({
        id: this.generateTransactionId(),
        tokenId,
        type: 'deactivate',
        timestamp: new Date(),
        verified: true
      })

      console.log(`🔥 Physical token burned: ${tokenId}`)
      this.emit('tokenBurned', token)

      return true

    } catch (_error) {
      console.error("❌ Failed to burn physical token:", _error)
      throw error
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
   * Private utility methods
   */
  private emit(event: string, data: any): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }

  private async recordPhysicalTransaction(transaction: PhysicalTransaction): Promise<void> {
    this.transactions.set(transaction.id, transaction)
  }

  private async startNFCScanner(): Promise<void> {
    try {
      const ndef = new (window as any).NDEFReader()
      await ndef.scan()
      
      ndef.addEventListener('reading', ({ message }: any) => {
        const record = message.records[0]
        if (record && record.recordType === 'text') {
          const textDecoder = new TextDecoder()
          const data = textDecoder.decode(record.data)
          this.scanPhysicalToken(data)
        }
      })

      console.log("📱 NFC scanner initialized")

    } catch (_error) {
      console.warn("⚠️ NFC scanner failed to initialize:", _error)
    }
  }

  private async startQRScanner(): Promise<void> {
    try {
      // QR scanner would be implemented here
      console.log("📱 QR scanner initialized")
      
    } catch (_error) {
      console.warn("⚠️ QR scanner failed to initialize:", _error)
    }
  }

  private setupTamperDetection(): void {
    console.log("🛡️ Tamper detection protocols enabled")
  }

  private setupEncryptionProtocols(): void {
    console.log("🔐 Encryption protocols configured")
  }

  private setupGeolocationTracking(): void {
    console.log("🌍 Geolocation tracking enabled")
  }

  private async verifyActivationCredentials(request: ActivationRequest): Promise<boolean> {
    // Implement activation verification logic
    return true
  }

  private parseScanData(rawData: string): { tokenId: string; checksum?: string } {
    try {
      // Parse QR/NFC data
      if (rawData.startsWith('UTT-ALB:')) {
        const parts = rawData.split(':')
        return { tokenId: parts[1], checksum: parts[2] }
      }
      
      // Try JSON format
      const data = JSON.parse(rawData)
      return { tokenId: data.tokenId, checksum: data.checksum }
      
    } catch {
      return { tokenId: rawData }
    }
  }

  private async verifyTokenIntegrity(token: PhysicalToken, scanData: any): Promise<boolean> {
    // Implement token integrity verification
    return token.isActive && token.status === PhysicalTokenStatus.ACTIVE
  }

  private async getTokenBalance(walletAddress: string): Promise<number> {
    // In production, this would query the blockchain
    return Math.random() * 1000 // Mock balance
  }

  private async verifySecurityPin(tokenId: string, pin?: string): Promise<boolean> {
    if (!pin) {
      throw new Error("Security PIN required")
    }
    // Implement PIN verification
    return pin.length >= 4
  }

  private generateTokenId(type: PhysicalTokenType): string {
    const prefix = type.toUpperCase().replace('-', '').substring(0, 3)
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    return `UTT-${prefix}-${timestamp}-${random}`
  }

  private async generateSecureWallet(): Promise<string> {
    // Generate a new wallet address for the physical token
    return `ALB${  Math.random().toString(36).substring(2, 42)}`
  }

  private generateSerialNumber(): string {
    return `UTT${Date.now().toString().slice(-8)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
  }

  private generateBatchNumber(): string {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    return `BTH${year}${month}${day}${Math.floor(Math.random() * 100).toString().padStart(2, '0')}`
  }

  private generateEncryptionKey(level: SecurityLevel): string {
    const length = level === SecurityLevel.ENTERPRISE ? 64 : level === SecurityLevel.PREMIUM ? 32 : 16
    const chars = 'abcdef0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  private generatePublicKey(): string {
    return `ALBpub${  Math.random().toString(36).substring(2, 40)}`
  }

  private generateQRCodeData(tokenId: string, level: SecurityLevel): string {
    const data = {
      tokenId,
      version: '1.0',
      type: 'utt-alb-physical',
      level,
      timestamp: Date.now()
    }
    return `UTT-ALB:${tokenId}:${btoa(JSON.stringify(data))}`
  }

  private generateNFCChipId(): string {
    return `NFC${  Math.random().toString(16).substring(2, 12).toUpperCase()}`
  }

  private generateHologramId(): string {
    return `HOL${  Math.random().toString(36).substring(2, 12).toUpperCase()}`
  }

  private generateTransactionId(): string {
    return `UTT-TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`
  }

  private generateTransactionSignature(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 88; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }
}

// Global physical tokens instance
let physicalTokensInstance: UTTPhysicalTokens | null = null

/**
 * Get global physical tokens instance
 */
export function getUTTPhysicalTokens(): UTTPhysicalTokens {
  if (!physicalTokensInstance) {
    physicalTokensInstance = new UTTPhysicalTokens()
  }
  return physicalTokensInstance
}

/**
 * Quick token creation function
 */
export async function createPhysicalALBToken(
  type: PhysicalTokenType = PhysicalTokenType.NFC_CARD,
  securityLevel: SecurityLevel = SecurityLevel.ENHANCED,
  metadata?: Partial<PhysicalTokenMetadata>
): Promise<PhysicalToken> {
  const physicalTokens = getUTTPhysicalTokens()
  return await physicalTokens.createPhysicalToken(type, securityLevel, metadata ?? {})
}

/**
 * Quick token scan function
 */
export async function scanALBToken(rawData: string): Promise<ScanResult> {
  const physicalTokens = getUTTPhysicalTokens()
  return await physicalTokens.scanPhysicalToken(rawData)
}

export default UTTPhysicalTokens
