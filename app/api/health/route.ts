import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const base = `${url.protocol}//${url.host}`;

    const [utt, lora] = await Promise.all([
        fetch(`${base}/api/utt/info`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
        fetch(`${base}/api/lora/status`, { cache: "no-store" }).then(r => r.json()).catch(() => null),
    ]);

    const uttOk = !!utt && (utt.status === "ready" || utt.transfersEnabled === true);
    const loraOk = !!lora && (typeof lora.verified === "number" || lora.status === "ok");

    return NextResponse.json({
        ok: uttOk && loraOk,
        services: {
            utt: { ok: uttOk, info: utt ?? null },
            lora: { ok: loraOk, info: lora ?? null }
        },
        ts: Date.now()
    });
}
