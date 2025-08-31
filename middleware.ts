import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const dev = process.env.NODE_ENV !== "production"
  const allow = (process.env.RADIO_AUDIO_ALLOWLIST || "").split(",").map(s=>s.trim()).filter(Boolean)
  const origins = allow.map(v => { try { return new URL(v).origin } catch { return null } }).filter(Boolean).join(" ")

  const csp = [
    "default-src 'self'",
    `script-src 'self'${dev ? " 'unsafe-eval' 'unsafe-inline'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self' ${origins}`,
    `media-src 'self' data: blob: ${origins}`,
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "frame-ancestors 'none'",
    "base-uri 'self'",
  ].join("; ")

  res.headers.set("Content-Security-Policy", csp)
  res.headers.set("X-Content-Type-Options", "nosniff")
  res.headers.set("Referrer-Policy", "no-referrer")
  res.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()")
  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
}
