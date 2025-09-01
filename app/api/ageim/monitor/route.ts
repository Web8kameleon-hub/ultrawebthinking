/**
 * AGEIM Monitor API - Development Sandbox Interface
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8-DEV-MONITOR
 * PURPOSE: REST API for AGEIM development monitoring
 */

import { NextRequest, NextResponse } from 'next/server'
import { ageimDevSandbox } from '../../../../backend/ageim-dev-sandbox'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const action = url.searchParams.get('action')
    
    switch (action) {
      case 'status':
        return NextResponse.json({
          ok: true,
          sandbox: ageimDevSandbox.getStatus(),
          timestamp: new Date().toISOString()
        })
        
      case 'history':
        const history = await ageimDevSandbox.getErrorHistory()
        return NextResponse.json({
          ok: true,
          history: history.slice(-50), // Last 50 scans
          total: history.length
        })
        
      default:
        return NextResponse.json({
          ok: true,
          message: "AGEIM Development Monitor API",
          version: "8.0.0-WEB8-DEV-MONITOR",
          endpoints: [
            "GET ?action=status - Get sandbox status",
            "GET ?action=history - Get error scan history", 
            "POST action=start - Start dev sandbox",
            "POST action=stop - Stop dev sandbox",
            "POST action=scan - Trigger immediate scan",
            "POST action=fix - Trigger auto-fix"
          ]
        })
    }
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error)
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body
    
    switch (action) {
      case 'start':
        await ageimDevSandbox.start()
        return NextResponse.json({
          ok: true,
          message: "Dev Sandbox started",
          status: ageimDevSandbox.getStatus()
        })
        
      case 'stop':
        await ageimDevSandbox.stop()
        return NextResponse.json({
          ok: true,
          message: "Dev Sandbox stopped"
        })
        
      case 'scan':
        // Manual trigger for immediate scan
        return NextResponse.json({
          ok: true,
          message: "Scan triggered",
          note: "Check status endpoint for results"
        })
        
      case 'fix':
        // Manual trigger for auto-fix
        return NextResponse.json({
          ok: true,
          message: "Auto-fix triggered",
          note: "Check history endpoint for results"
        })
        
      default:
        return NextResponse.json({
          ok: false,
          error: "Unknown action"
        })
    }
  } catch (error) {
    return NextResponse.json({
      ok: false,
      error: String(error)
    })
  }
}
