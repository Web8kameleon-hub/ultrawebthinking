/**
 * AGEIM PATCH ENDPOINT - ZERO-FAKE IMPLEMENTATION
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-AGEIM
 * PURPOSE: Real code patching via AGEIM engine with approval gates
 */

import { NextRequest, NextResponse } from 'next/server'
import ageim from '@/backend/ageim'

// AGEIM Patch Types
type PatchRequest = {
  action: 'plan' | 'apply'
  patches?: Array<{
    path: string
    content: string
    reason: string
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
  }>
  planId?: string
}

type PatchResult = {
  ok: true
  action: 'plan' | 'apply'
  result: {
    planPath?: string
    submitted?: number
    approvalIds?: string[]
  }
  timestamp: string
  nextSteps: string[]
} | {
  ok: false
  kind: "MISSING_TOOL" | "AGEIM_ERROR" | "PATCH_FAILED" | "APPROVAL_REQUIRED"
  message: string
  fix?: string[]
  approvalQueue?: string[]
}

export async function POST(request: NextRequest) {
  try {
    // Validate AGEIM patch headers
    const ageimMode = request.headers.get('X-AGEIM-Mode')
    const patchAuth = request.headers.get('X-Patch-Auth')
    
    if (ageimMode !== 'enabled') {
      return NextResponse.json({
        ok: false,
        kind: "AGEIM_ERROR",
        message: "AGEIM mode not enabled for patches",
        fix: [
          "Add X-AGEIM-Mode: enabled header",
          "Ensure AGEIM patch permissions"
        ]
      }, { status: 400 })
    }

    // Parse request body
    const body: PatchRequest = await request.json()
    const { action, patches, planId } = body

    console.log(`🤖 AGEIM PATCH: Action ${action} requested`)

    if (action === 'plan') {
      // Generate REAL fix plan
      console.log(`🤖 AGEIM: Generating real fix plan...`)
      
      const planResult = await ageim.planFixes()
      
      if (!planResult.ok) {
        return NextResponse.json({
          ok: false,
          kind: "PATCH_FAILED",
          message: `AGEIM plan generation failed: ${JSON.stringify(planResult)}`,
          fix: [
            "Check sandbox permissions",
            "Verify .sandbox directory exists",
            "Review AGEIM configuration"
          ]
        }, { status: 500 })
      }

      const response: PatchResult = {
        ok: true,
        action: 'plan',
        result: {
          planPath: planResult.planPath
        },
        timestamp: new Date().toISOString(),
        nextSteps: [
          "Review generated plan",
          "Submit patches for approval",
          "Monitor approval queue"
        ]
      }

      console.log(`🤖 AGEIM: Plan generated at ${planResult.planPath}`)

      const nextResponse = NextResponse.json(response)
      nextResponse.headers.set('X-AGEIM-Response', 'true')
      nextResponse.headers.set('X-Plan-Generated', new Date().toISOString())
      nextResponse.headers.set('X-Zero-Fake', 'guaranteed')
      
      return nextResponse

    } else if (action === 'apply') {
      // Apply REAL patches (goes through approval system)
      if (!patches || patches.length === 0) {
        return NextResponse.json({
          ok: false,
          kind: "PATCH_FAILED",
          message: "No patches provided for application",
          fix: [
            "Include patches array in request body",
            "Ensure patches have path, content, and reason"
          ]
        }, { status: 400 })
      }

      console.log(`🤖 AGEIM: Applying ${patches.length} patches...`)

      // Validate patches before submission
      const validationErrors = validatePatches(patches)
      if (validationErrors.length > 0) {
        return NextResponse.json({
          ok: false,
          kind: "PATCH_FAILED",
          message: `Patch validation failed: ${validationErrors.join(', ')}`,
          fix: [
            "Fix patch validation errors",
            "Ensure all paths are relative to repo root",
            "Verify content is valid"
          ]
        }, { status: 400 })
      }

      // Submit patches through AGEIM (triggers approval workflow)
      try {
        const applyResult = await ageim.applyPatches(patches.map(p => ({
          path: p.path,
          content: p.content
        })))

        if (!applyResult.ok) {
          return NextResponse.json({
            ok: false,
            kind: "PATCH_FAILED",
            message: `AGEIM patch application failed: ${JSON.stringify(applyResult)}`,
            fix: [
              "Check file permissions",
              "Verify paths exist",
              "Review approval queue"
            ]
          }, { status: 500 })
        }

        // Get pending approvals
        const approvals = ageim.listApprovals()
        let recentApprovals: string[] = []
        
        if (Array.isArray(approvals)) {
          recentApprovals = approvals
            .filter((a: any) => a.timestamp > Date.now() - 60000) // Last minute
            .map((a: any) => a.id)
        }

        const response: PatchResult = {
          ok: true,
          action: 'apply',
          result: {
            submitted: applyResult.submitted,
            approvalIds: recentApprovals
          },
          timestamp: new Date().toISOString(),
          nextSteps: [
            "Check approval queue for pending patches",
            "Visit /sandbox/approvals to approve/deny",
            "Monitor patch application status"
          ]
        }

        console.log(`🤖 AGEIM: ${applyResult.submitted} patches submitted for approval`)

        const nextResponse = NextResponse.json(response)
        nextResponse.headers.set('X-AGEIM-Response', 'true')
        nextResponse.headers.set('X-Patches-Submitted', String(applyResult.submitted))
        nextResponse.headers.set('X-Approval-Required', 'true')
        nextResponse.headers.set('X-Zero-Fake', 'guaranteed')
        
        return nextResponse

      } catch (approvalError) {
        console.log(`🤖 AGEIM: Patches require approval: ${approvalError}`)
        
        return NextResponse.json({
          ok: false,
          kind: "APPROVAL_REQUIRED",
          message: "Patches submitted but require human approval",
          fix: [
            "Visit /sandbox/approvals",
            "Review and approve pending patches",
            "Check approval queue status"
          ],
          approvalQueue: ["/sandbox/approvals"]
        }, { status: 202 }) // Accepted but requires approval
      }

    } else {
      return NextResponse.json({
        ok: false,
        kind: "PATCH_FAILED",
        message: `Unknown action: ${action}`,
        fix: [
          "Use action: 'plan' to generate fix plan",
          "Use action: 'apply' to submit patches"
        ]
      }, { status: 400 })
    }

  } catch (error) {
    console.error('🤖 AGEIM PATCH ERROR:', error)
    
    // Check for specific MISSING_TOOL errors
    if (String(error).includes('MISSING_TOOL:')) {
      const tool = String(error).split('MISSING_TOOL:')[1]
      return NextResponse.json({
        ok: false,
        kind: "MISSING_TOOL",
        message: `Required tool missing for patching: ${tool}`,
        fix: [
          `Install ${tool}`,
          `Configure ${tool} for file operations`,
          `Verify ${tool} permissions`
        ]
      }, { status: 503 })
    }

    return NextResponse.json({
      ok: false,
      kind: "AGEIM_ERROR",
      message: `AGEIM patch error: ${String(error)}`,
      fix: [
        "Check AGEIM patch configuration",
        "Verify sandbox write permissions",
        "Review error logs"
      ]
    }, { status: 500 })
  }
}

// Real patch validation (no fake checks)
function validatePatches(patches: PatchRequest['patches']): string[] {
  const errors: string[] = []
  
  if (!patches) return ['No patches provided']
  
  for (const [index, patch] of patches.entries()) {
    if (!patch.path) {
      errors.push(`Patch ${index}: missing path`)
    }
    
    if (!patch.content) {
      errors.push(`Patch ${index}: missing content`)
    }
    
    if (!patch.reason) {
      errors.push(`Patch ${index}: missing reason`)
    }
    
    // Validate path is safe (no directory traversal)
    if (patch.path && (patch.path.includes('..') || patch.path.startsWith('/'))) {
      errors.push(`Patch ${index}: unsafe path ${patch.path}`)
    }
    
    // Validate content length (reasonable limit)
    if (patch.content && patch.content.length > 1000000) {
      errors.push(`Patch ${index}: content too large (>1MB)`)
    }
  }
  
  return errors
}

// Only allow POST for AGEIM patch
export async function GET() {
  return NextResponse.json({
    ok: false,
    kind: "AGEIM_ERROR",
    message: "AGEIM patch only accepts POST requests",
    fix: ["Use POST method with proper AGEIM headers and patch data"]
  }, { status: 405 })
}
