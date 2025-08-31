import { NextRequest } from "next/server"
export const runtime = "nodejs"

function allow(src: string) {
  const allow = (process.env.RADIO_AUDIO_ALLOWLIST || "")
    .split(",").map(s => s.trim()).filter(Boolean)
  if (allow.length === 0) return true
  try {
    const u = new URL(src)
    return allow.includes(u.origin) || allow.includes(u.toString())
  } catch {
    return false
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const src = searchParams.get("src") || process.env.RADIO_AUDIO_URL
  if (!src) return new Response("Missing src", { status: 400 })
  if (!allow(src)) return new Response("Forbidden src", { status: 403 })

  const ctl = new AbortController()
  const t = setTimeout(() => ctl.abort("timeout"), 7000)
  try {
    const up = await fetch(src, { headers: { "icy-metadata": "1" }, cache: "no-store", signal: ctl.signal as any })
    if (!up.ok || !up.body) return new Response(`Upstream ${up.status}`, { status: 502 })
    const h = new Headers()
    h.set("Content-Type", up.headers.get("content-type") || "audio/mpeg")
    for (const k of ["icy-br","icy-name","icy-genre","icy-url"]) {
      const v = up.headers.get(k); if (v) h.set(k, v)
    }
    h.set("Cache-Control", "no-store")
    h.set("Access-Control-Allow-Origin", "*")
    return new Response(up.body, { status: 200, headers: h })
  } catch (e: any) {
    return new Response(`Fetch failed: ${e?.message || e}`, { status: 502 })
  } finally { clearTimeout(t) }
}

export async function HEAD(req: NextRequest) { return GET(req) }
