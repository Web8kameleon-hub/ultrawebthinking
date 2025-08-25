/**
 * PHPMyAdmin Honeypot - Catches database admin attacks
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        'unknown';

    console.log(`🍯 PHPMYADMIN HONEYPOT HIT: ${ip} - ${request.url}`);

    const fakePhpMyAdmin = `
<!DOCTYPE html>
<html>
<head><title>phpMyAdmin</title></head>
<body>
<h1>phpMyAdmin 4.9.7</h1>
<form method="post">
  <input type="text" name="pma_username" placeholder="Username" />
  <input type="password" name="pma_password" placeholder="Password" />
  <button type="submit">Go</button>
</form>
</body>
</html>
  `;

    return new NextResponse(fakePhpMyAdmin, {
        status: 200,
        headers: {
            'Content-Type': 'text/html',
            'X-Honeypot-Type': 'phpmyadmin',
            'X-Honeypot-Triggered': 'true'
        }
    });
}

export { GET as POST };
