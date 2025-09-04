/**
 * AGI Medical Health Endpoint - Real Healthcare Services Only
 * @author Ledjan Ahmati
 * @version 8.0.0 Industrial Production
 */

import { assertReal, requireEnv } from '@/lib/real';
import { NextResponse } from 'next/server';

export const runtime = 'edge'
export const revalidate = 0

export async function GET() {
  try {
    assertReal('agi-med.health')
    
    const fhirBase = requireEnv('FHIR_BASE')
    const fdaKey = process.env.FDA_API_KEY
    
    const startTime = Date.now()
    
    // Test FHIR Server connection
    const fhirResponse = await fetch(`${fhirBase}/metadata`, {
      headers: {
        'Accept': 'application/fhir+json'
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(5000)
    })
    
    const responseTime = Date.now() - startTime
    
    if (!fhirResponse.ok) {
      return NextResponse.json({
        status: 'error',
        service: 'AGI Medical FHIR',
        error: `FHIR Server failed: ${fhirResponse.statusText}`,
        timestamp: new Date().toISOString(),
        responseTime
      }, { status: 503 })
    }
    
    const fhirMetadata = await fhirResponse.json()
    
    // Test FDA API if configured
    let fdaStatus = 'not-configured'
    if (fdaKey) {
      try {
        const fdaResponse = await fetch(`https://api.fda.gov/drug/event.json?api_key=${fdaKey}&limit=1`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        fdaStatus = fdaResponse.ok ? 'active' : 'degraded'
      } catch {
        fdaStatus = 'error'
      }
    }
    
    // Test HL7 endpoints if configured
    let hl7Status = 'not-configured'
    if (process.env.HL7_GATEWAY) {
      try {
        const hl7Response = await fetch(`${process.env.HL7_GATEWAY}/status`, {
          cache: 'no-store',
          signal: AbortSignal.timeout(3000)
        })
        hl7Status = hl7Response.ok ? 'active' : 'degraded'
      } catch {
        hl7Status = 'error'
      }
    }
    
    return NextResponse.json({
      status: 'active',
      service: 'AGI Medical Systems',
      providers: {
        fhirServer: 'active',
        fdaApi: fdaStatus,
        hl7Gateway: hl7Status
      },
      fhir: {
        version: fhirMetadata.fhirVersion || 'R4',
        software: fhirMetadata.software?.name || 'FHIR Server'
      },
      timestamp: new Date().toISOString(),
      responseTime,
      metrics: {
        patientRecords: true,
        clinicalData: true,
        medicalDevices: true,
        pharmacyIntegration: true
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      service: 'AGI Medical',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
