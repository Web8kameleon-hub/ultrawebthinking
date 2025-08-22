import * as fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';

interface BlockRequest {
  ip: string;
  reason: string;
}

interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: number;
  userAgent?: string | undefined;
}

export async function POST(request: NextRequest) {
  try {
    const { ip, reason }: BlockRequest = await request.json();
    
    if (!ip || !reason) {
      return NextResponse.json(
        { error: 'IP and reason are required' },
        { status: 400 }
      );
    }

    // Validate IP format
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipRegex.test(ip)) {
      return NextResponse.json(
        { error: 'Invalid IP format' },
        { status: 400 }
      );
    }

    // Emergency block implementation
    const result = await emergencyBlock(ip, reason, request);
    
    console.log(`🚨 GUARDIAN: IP ${ip} blocked - ${reason}`);
    
    return NextResponse.json({
      success: true,
      message: `IP ${ip} has been blocked`,
      blockedAt: new Date().toISOString(),
      ...result
    });

  } catch (error) {
    console.error('Emergency block failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function emergencyBlock(ip: string, reason: string, request: NextRequest) {
  const blockedIPsPath = path.join(process.cwd(), 'guardian', 'blocked-ips.json');
  
  // Ensure guardian directory exists
  const guardianDir = path.dirname(blockedIPsPath);
  if (!fs.existsSync(guardianDir)) {
    fs.mkdirSync(guardianDir, { recursive: true });
  }

  // Load existing blocked IPs
  let blockedIPs: BlockedIP[] = [];
  if (fs.existsSync(blockedIPsPath)) {
    try {
      const data = fs.readFileSync(blockedIPsPath, 'utf8');
      blockedIPs = JSON.parse(data);
    } catch (error) {
      console.error('Failed to read blocked IPs:', error);
    }
  }

  // Check if IP is already blocked
  const existingBlock = blockedIPs.find(blocked => blocked.ip === ip);
  if (existingBlock) {
    return { alreadyBlocked: true, existingBlock };
  }

  // Add new blocked IP
  const newBlock: BlockedIP = {
    ip,
    reason,
    timestamp: Date.now(),
    userAgent: request.headers.get('user-agent') || undefined
  };

  blockedIPs.push(newBlock);

  // Save blocked IPs
  try {
    fs.writeFileSync(blockedIPsPath, JSON.stringify(blockedIPs, null, 2));
  } catch (error) {
    console.error('Failed to save blocked IPs:', error);
    throw new Error('Failed to save block list');
  }

  // Log security event
  await logSecurityEvent({
    type: 'EMERGENCY_BLOCK',
    ip,
    reason,
    timestamp: Date.now(),
    userAgent: request.headers.get('user-agent'),
    source: 'Guardian Panel'
  });

  // Trigger real-time notifications (you can extend this)
  await notifySecurityTeam(ip, reason);

  return { blocked: true, newBlock };
}

async function logSecurityEvent(event: any) {
  const logsPath = path.join(process.cwd(), 'guardian', 'security-logs.json');
  
  let logs: any[] = [];
  if (fs.existsSync(logsPath)) {
    try {
      const data = fs.readFileSync(logsPath, 'utf8');
      logs = JSON.parse(data);
    } catch (error) {
      console.error('Failed to read security logs:', error);
    }
  }

  logs.push(event);
  
  // Keep only last 1000 logs
  if (logs.length > 1000) {
    logs = logs.slice(-1000);
  }

  try {
    fs.writeFileSync(logsPath, JSON.stringify(logs, null, 2));
  } catch (error) {
    console.error('Failed to save security log:', error);
  }
}

async function notifySecurityTeam(ip: string, reason: string) {
  // Here you can implement real notifications:
  // - Slack webhook
  // - Email alerts
  // - Discord webhook
  // - SMS notifications
  
  console.log(`🚨 SECURITY ALERT: IP ${ip} blocked for: ${reason}`);
  
  // Example: Send to monitoring service
  try {
    // await fetch('YOUR_MONITORING_WEBHOOK', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     alert: 'Emergency IP Block',
    //     ip,
    //     reason,
    //     timestamp: new Date().toISOString()
    //   })
    // });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
}

export async function GET() {
  try {
    const blockedIPsPath = path.join(process.cwd(), 'guardian', 'blocked-ips.json');
    
    if (!fs.existsSync(blockedIPsPath)) {
      return NextResponse.json({ blockedIPs: [] });
    }

    const data = fs.readFileSync(blockedIPsPath, 'utf8');
    const blockedIPs = JSON.parse(data);

    return NextResponse.json({ blockedIPs });
  } catch (error) {
    console.error('Failed to get blocked IPs:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve blocked IPs' },
      { status: 500 }
    );
  }
}
