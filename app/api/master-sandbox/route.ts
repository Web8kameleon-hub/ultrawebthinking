import { NextRequest, NextResponse } from 'next/server'
import { masterSandbox } from '@/backend/sandbox/MasterSandbox'

/**
 * Master Sandbox API - Execute Creator's Vision
 * @author Ledjan Ahmati
 */

export async function GET() {
  try {
    const status = await masterSandbox.status()
    return NextResponse.json(status)
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error)
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'analyze':
        const health = await masterSandbox.analyzeWithCreatorEyes()
        return NextResponse.json({
          ok: true,
          health,
          timestamp: new Date().toISOString()
        })

      case 'plan':
        const plan = await masterSandbox.createMasterPlan()
        return NextResponse.json({
          ok: true,
          plan,
          timestamp: new Date().toISOString()
        })

      case 'execute':
        const result = await masterSandbox.executeMasterPlan()
        return NextResponse.json({
          ok: true,
          execution: result,
          timestamp: new Date().toISOString()
        })

      default:
        return NextResponse.json({
          ok: false,
          error: "Unknown action. Use: analyze, plan, execute"
        }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error)
    }, { status: 500 })
  }
}
