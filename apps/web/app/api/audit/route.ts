import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok:false }, { status: 400 });
  console.log("[AUDIT]", body);
  return NextResponse.json({ ok: true });
}
