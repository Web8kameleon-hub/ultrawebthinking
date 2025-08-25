/**
 * WordPress Honeypot - Catches WP-based attacks
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        'unknown';

    console.log(`🍯 WORDPRESS HONEYPOT HIT: ${ip} - ${request.url}`);

    return NextResponse.json({
        error: 'Not Found',
        message: 'WordPress installation not found'
    }, {
        status: 404,
        headers: {
            'X-Honeypot-Type': 'wordpress',
            'X-Honeypot-Triggered': 'true'
        }
    });
}

export { GET as DELETE, GET as POST, GET as PUT };

