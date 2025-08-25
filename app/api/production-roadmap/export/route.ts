/**
 * Web8 Production Roadmap PDF Export API
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { industrialPDFGenerator } from '../../../../backend/services/docs/pdfGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { modules, hardwareItems, progress, theme = 'industrial' } = body;

    // Prepare roadmap data for PDF generation
    const roadmapData = {
      title: 'Web8 Industrial Production Roadmap',
      description: 'Comprehensive plan for transitioning to full production environment',
      author: 'Ledjan Ahmati',
      date: new Date().toISOString(),
      sections: [
        {
          title: 'Executive Summary',
          content: `This roadmap outlines the transition plan for Web8 AGI platform to full production environment. 
                   Current completion status is ${progress || 35}% with ${modules?.filter((m: any) => m.status === 'active')?.length || 0} active modules.`,
          type: 'text' as const
        },
        {
          title: 'Production Modules Status',
          content: `${modules?.map((m: any) => `${m.module}: ${m.statusText} - ${m.action}`).join('\n') || 'No modules data provided'}`,
          type: 'text' as const
        },
        {
          title: 'Hardware Requirements',
          content: `${hardwareItems?.map((h: any) => `${h.name}: ${h.description}`).join('\n') || 'No hardware data provided'}`,
          type: 'text' as const
        },
        {
          title: 'Implementation Timeline',
          content: `Phase 1: Complete active modules optimization
                   Phase 2: Address partial implementations  
                   Phase 3: Activate currently inactive modules
                   Phase 4: Full production deployment with monitoring`,
          type: 'text' as const
        }
      ],
      metadata: {
        source: 'UltraWeb Thinking Platform',
        version: '8.0.0-WEB8',
        classification: 'internal' as const,
        tags: ['roadmap', 'production', 'web8', 'industrial']
      }
    };

    // Generate PDF using industrial service
    const pdfBuffer = await industrialPDFGenerator.generateCustomReport(roadmapData);

    // Return PDF as download
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="web8-production-roadmap-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('🚨 Roadmap PDF generation error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to generate roadmap PDF',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    service: 'Web8 Production Roadmap PDF Export',
    version: '8.0.0-WEB8',
    endpoints: {
      'POST /api/production-roadmap/export': 'Generate and download roadmap PDF',
    },
    author: 'Ledjan Ahmati',
    status: 'active'
  });
}
