/**
 * Honeypot API Endpoint - Mirror Defense Layer 7
 * Fake admin endpoint to catch malicious actors
 * 
 * @author EuroWeb Ultra Defense Team
 * @version 2.0.0 Mirror Defense
 */

import { NextRequest, NextResponse } from 'next/server';

// Log honeypot hits for security analysis
const honeypotLogs: Array<{
    ip: string;
    userAgent: string;
    timestamp: number;
    path: string;
    headers: Record<string, string>;
}> = [];

export async function GET(request: NextRequest) {
    // Log the honeypot hit
    const ip = request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        'unknown';

    const userAgent = request.headers.get('user-agent') ?? 'unknown';
    const timestamp = Date.now();

    // Collect headers for analysis
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
        headers[key] = value;
    });

    const logEntry = {
        ip,
        userAgent,
        timestamp,
        path: request.url,
        headers
    };

    honeypotLogs.push(logEntry);

    // Keep only last 100 entries to prevent memory leaks
    if (honeypotLogs.length > 100) {
        honeypotLogs.shift();
    }

    console.log(`🍯 HONEYPOT HIT: ${ip} - ${userAgent}`);
    console.log(`🍯 Path: ${request.url}`);

    // Return fake admin panel to keep attacker engaged
    const fakeAdminHTML = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Login - EuroWeb</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 50px; background: #f0f0f0; }
        .login-box { 
            max-width: 400px; 
            margin: 0 auto; 
            background: white; 
            padding: 30px; 
            border-radius: 8px; 
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #333; text-align: center; }
        input { 
            width: 100%; 
            padding: 12px; 
            margin: 10px 0; 
            border: 1px solid #ddd; 
            border-radius: 4px;
        }
        button { 
            width: 100%; 
            padding: 12px; 
            background: #007cba; 
            color: white; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer;
        }
        .error { color: red; text-align: center; margin-top: 10px; }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>🔒 EuroWeb Admin Panel</h1>
        <form id="loginForm">
            <input type="text" placeholder="Username" required />
            <input type="password" placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
        <div class="error" id="error" style="display: none;">
            Invalid credentials. Access denied.
        </div>
    </div>
    <script>
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('error').style.display = 'block';
            
            // Log the attempt (this data goes nowhere but keeps attacker busy)
            setTimeout(function() {
                document.getElementById('error').textContent = 'System temporarily locked. Try again in 5 minutes.';
            }, 2000);
        });
    </script>
</body>
</html>
  `;

    return new NextResponse(fakeAdminHTML, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'X-Honeypot-Triggered': 'true',
            'X-Security-Level': 'TRAP-ACTIVE',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
    });
}

export async function POST(request: NextRequest) {
    // Log POST attempts (login attempts, etc.)
    const ip = request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        'unknown';

    console.log(`🍯 HONEYPOT POST ATTEMPT: ${ip}`);

    try {
        const body = await request.text();
        console.log(`🍯 POST Body: ${body.substring(0, 200)}...`);
    } catch (_e) {
        console.log(`🍯 Could not read POST body`);
    }

    return NextResponse.json({
        error: 'Authentication failed',
        message: 'Invalid credentials',
        code: 'AUTH_FAILED'
    }, {
        status: 401,
        headers: {
            'X-Honeypot-Triggered': 'true',
            'X-Auth-Attempts': 'LOGGED'
        }
    });
}

// Export honeypot logs for Guardian dashboard
export function getHoneypotLogs() {
    return honeypotLogs.slice(-50); // Return last 50 entries
}

export { GET as DELETE, GET as PATCH, GET as PUT };

