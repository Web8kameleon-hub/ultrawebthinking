/**
 * Web8 AGI Sandbox Main API
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-SANDBOX
 * @description Single endpoint for all AGI sandbox operations
 */

import { NextRequest, NextResponse } from 'next/server';
import { FreedomSandbox } from '@/backend/sandbox/sandbox-runner';
import { CAP_JUNIOR_GATE, CAP_ALBION_GATE_4000 } from '@/backend/sandbox/caps';
import { providers, secret } from '@/backend/sandbox/wire';
import { ActionKind } from '@/backend/sandbox/types';

interface SandboxRequest {
  action: 'execute' | 'status' | 'audit' | 'capabilities' | 'budget';
  kind?: ActionKind;
  params?: Record<string, unknown>;
  capability?: 'junior' | 'albion' | 'custom';
  dryRun?: boolean;
  humanGate?: boolean;
}

let sandbox: FreedomSandbox | null = null;

function getSandbox(): FreedomSandbox {
  if (!sandbox) {
    sandbox = new FreedomSandbox({
      secret,
      agentId: "AGICore@web8",
      scope: "sandbox:web8:main",
      allowLive: true
    }, providers);
    
    // Set default capability (Junior)
    sandbox.setCapability(CAP_JUNIOR_GATE);
  }
  return sandbox;
}

export async function POST(request: NextRequest) {
  try {
    const body: SandboxRequest = await request.json();
    const sbx = getSandbox();

    switch (body.action) {
      case 'execute':
        if (!body.kind || !body.params) {
          return NextResponse.json({
            success: false,
            error: 'Missing kind or params for execute action'
          }, { status: 400 });
        }

        // Set capability based on request
        if (body.capability === 'albion') {
          sbx.setCapability(CAP_ALBION_GATE_4000);
        } else if (body.capability === 'junior') {
          sbx.setCapability(CAP_JUNIOR_GATE);
        }

        const actOptions: { dryRun?: boolean; humanGate?: boolean } = {};
        if (body.dryRun !== undefined) actOptions.dryRun = body.dryRun;
        if (body.humanGate !== undefined) actOptions.humanGate = body.humanGate;

        const result = await sbx.act(body.kind, body.params, actOptions);

        return NextResponse.json({
          success: true,
          result,
          timestamp: new Date().toISOString()
        });

      case 'status':
        return NextResponse.json({
          success: true,
          status: {
            agentId: "AGICore@web8",
            scope: "sandbox:web8:main",
            auditValid: sbx.verifyAudit(),
            budgetUsage: {
              junior: sbx.budgetUsage("wallet:junior:dev"),
              albion: sbx.budgetUsage("wallet:albion:main")
            }
          }
        });

      case 'audit':
        return NextResponse.json({
          success: true,
          audit: {
            entries: sbx.audit(),
            valid: sbx.verifyAudit(),
            totalEntries: sbx.audit().length
          }
        });

      case 'capabilities':
        return NextResponse.json({
          success: true,
          capabilities: {
            junior: {
              scope: "wallet:junior:dev",
              budgetALB: 2000,
              ratePerMin: 10,
              actions: CAP_JUNIOR_GATE.actions
            },
            albion: {
              scope: "wallet:albion:main", 
              budgetALB: 4000,
              ratePerMin: 5,
              actions: CAP_ALBION_GATE_4000.actions
            }
          }
        });

      case 'budget':
        return NextResponse.json({
          success: true,
          budget: {
            junior: {
              allocated: 2000,
              used: sbx.budgetUsage("wallet:junior:dev"),
              remaining: 2000 - sbx.budgetUsage("wallet:junior:dev")
            },
            albion: {
              allocated: 4000,
              used: sbx.budgetUsage("wallet:albion:main"),
              remaining: 4000 - sbx.budgetUsage("wallet:albion:main")
            }
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Sandbox API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const sbx = getSandbox();
    
    return NextResponse.json({
      success: true,
      sandbox: {
        agentId: "AGICore@web8",
        scope: "sandbox:web8:main",
        status: "active",
        auditValid: sbx.verifyAudit(),
        totalAuditEntries: sbx.audit().length,
        capabilities: ["junior", "albion"],
        emergencyMode: process.env.SANDBOX_EMERGENCY === "1"
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
