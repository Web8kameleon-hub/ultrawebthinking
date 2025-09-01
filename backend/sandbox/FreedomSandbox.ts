/**
 * FREEDOM SANDBOX - ZERO-FAKE ACTION EXECUTION
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-ZERO-FAKE
 * PURPOSE: Real action execution with policy enforcement
 */

import { providers, type ProviderActions, type ProviderResult } from './providers'

// Sandbox Configuration
export interface SandboxConfig {
  secret: string
  agentId: string
  scope: string
  allowLive?: boolean
  repoRoot?: string
  sandboxDir?: string
}

// Action Result Types
export type ActionResult<T = any> = 
  | { ok: true; result: T; timestamp: string }
  | { ok: false; error: string; missing?: string[]; timestamp: string }

// Policy Decision
export type PolicyDecision = 'ALLOW' | 'DENY' | 'REVIEW' | 'SIMULATE'

// Capability Token
export interface CapabilityToken {
  id: string
  permissions: string[]
  rateLimit: number
  budget: number
  signature: string
}

// Approval Item
export interface ReviewItem {
  id: string
  action: string
  params: any
  requestedAt: string
  status: 'pending' | 'approved' | 'denied'
  reviewedBy?: string
  reviewedAt?: string
}

/**
 * FreedomSandbox - Policy-enforced action execution
 * ZERO-FAKE: All actions are real or return MISSING_TOOL
 */
export class FreedomSandbox {
  private config: SandboxConfig
  private capability: CapabilityToken | null = null
  private approvalQueue: ReviewItem[] = []
  private auditLog: any[] = []

  constructor(config: SandboxConfig, private actionProviders = providers) {
    this.config = {
      allowLive: false,
      repoRoot: process.cwd(),
      sandboxDir: '.sandbox',
      ...config
    }
    
    console.log(`🏗️  FreedomSandbox initialized: ${this.config.agentId}`)
  }

  /**
   * Set capability token for gated actions
   */
  setCapability(token: CapabilityToken) {
    // TODO: Verify HMAC signature
    this.capability = token
    console.log(`🔑 Capability set: ${token.id} (${token.permissions.length} permissions)`)
  }

  /**
   * Execute action through providers with policy enforcement
   */
  async execute<T extends ProviderActions>(
    action: T, 
    params: Parameters<typeof providers[T]>[0],
    opts: { dryRun?: boolean; humanGate?: boolean } = {}
  ): Promise<ActionResult<ProviderResult<T>>> {
    const timestamp = new Date().toISOString()
    
    try {
      // Policy check
      const policy = this.checkPolicy(action, params)
      
      if (policy === 'DENY') {
        return {
          ok: false,
          error: `POLICY_DENY: Action ${action} not permitted`,
          timestamp
        }
      }

      if (policy === 'REVIEW' || opts.humanGate) {
        // Add to approval queue
        const reviewId = `review_${Date.now()}_${0.5.toString(36).slice(2)}`
        this.approvalQueue.push({
          id: reviewId,
          action,
          params,
          requestedAt: timestamp,
          status: 'pending'
        })
        
        return {
          ok: false,
          error: `PENDING_REVIEW: Action ${action} requires human approval (${reviewId})`,
          timestamp
        }
      }

      if (opts.dryRun) {
        return {
          ok: true,
          result: { ok: true, dryRun: true, action, params } as any,
          timestamp
        }
      }

      // Execute real action through provider
      const provider = this.actionProviders[action]
      if (!provider) {
        return {
          ok: false,
          error: `MISSING_TOOL: No provider for action ${action}`,
          timestamp
        }
      }

      const result = await provider(params as any)
      
      // Audit log with safe type checking
      this.auditLog.push({
        action,
        params,
        result: result && typeof result === 'object' && 'ok' in result ? result.ok : false,
        timestamp,
        agentId: this.config.agentId
      })

      return {
        ok: true,
        result: result as any,
        timestamp
      }
      
    } catch (error) {
      const errorResult = {
        ok: false as const,
        error: `EXECUTION_ERROR: ${String(error)}`,
        timestamp
      }
      
      // Audit error
      this.auditLog.push({
        action,
        params,
        result: false,
        error: String(error),
        timestamp,
        agentId: this.config.agentId
      })
      
      return errorResult
    }
  }

  /**
   * Policy enforcement - determine if action is allowed
   */
  private checkPolicy(action: string, params: any): PolicyDecision {
    // Emergency mode - deny all
    if (process.env.SANDBOX_EMERGENCY === '1') {
      return 'DENY'
    }

    // Capability check
    if (!this.capability) {
      // Basic actions allowed without capability
      const basicActions = ['LOG', 'STATUS_CHECK', 'FILE_READ']
      return basicActions.includes(action) ? 'ALLOW' : 'DENY'
    }

    // Permission check
    if (!this.capability.permissions.includes(action)) {
      return 'DENY'
    }

    // Sensitive actions need review
    const sensitiveActions = ['WRITE_DB', 'TOKEN_TRANSFER', 'SPAWN_PROCESS']
    if (sensitiveActions.includes(action)) {
      return 'REVIEW'
    }

    return 'ALLOW'
  }

  /**
   * List pending approvals
   */
  listApprovals(): ReviewItem[] | { ok: boolean; error: string } {
    try {
      return [...this.approvalQueue]
    } catch (error) {
      return { ok: false, error: String(error) }
    }
  }

  /**
   * Approve/deny a pending action
   */
  reviewAction(reviewId: string, decision: 'approved' | 'denied', reviewedBy: string): boolean {
    const item = this.approvalQueue.find(r => r.id === reviewId)
    if (!item) return false
    
    item.status = decision
    item.reviewedBy = reviewedBy
    item.reviewedAt = new Date().toISOString()
    
    console.log(`📋 Review ${reviewId}: ${decision} by ${reviewedBy}`)
    return true
  }

  /**
   * Get audit trail
   */
  audit(): any[] | { ok: boolean; error: string } {
    try {
      return [...this.auditLog]
    } catch (error) {
      return { ok: false, error: String(error) }
    }
  }

  /**
   * Get sandbox status
   */
  getStatus() {
    return {
      agentId: this.config.agentId,
      scope: this.config.scope,
      capability: this.capability?.id || null,
      queueLength: this.approvalQueue.length,
      auditEntries: this.auditLog.length,
      allowLive: this.config.allowLive,
      emergencyMode: process.env.SANDBOX_EMERGENCY === '1'
    }
  }

  /**
   * Reset approval queue (admin action)
   */
  resetQueue(): boolean {
    try {
      this.approvalQueue = []
      console.log(`🗑️  Approval queue reset by admin`)
      return true
    } catch (error) {
      console.error(`❌ Queue reset failed: ${error}`)
      return false
    }
  }
}

// Export for use in AGEIM
export { FreedomSandbox as default }

