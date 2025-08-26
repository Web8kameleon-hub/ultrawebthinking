import { NextResponse } from "next/server";

const AWC = "https://aviationweather.gov/api/data"; // Data API root

export async function GET(_: Request, ctx: { params: { icao: string } }) {
    const icao = (ctx.params.icao || "").toUpperCase();
    if (!/^[A-Z0-9]{3,4}$/.test(icao)) {
        return NextResponse.json({ error: "Bad ICAO" }, { status: 400 });
    }

    const ua = process.env.AWC_USER_AGENT ?? "EuroWeb/8.0.1 (+support@example.com)";
    const headers = { "User-Agent": ua };

    // AWC endpoints (json)
    const metarURL = `${AWC}/metar?ids=${icao}&format=json`;
    const tafURL = `${AWC}/taf?ids=${icao}&format=json`;

    try {
        const [metarRes, tafRes] = await Promise.all([
            fetch(metarURL, { headers, cache: "no-store" }),
            fetch(tafURL, { headers, cache: "no-store" }),
        ]);

        if (!metarRes.ok) throw new Error(`METAR ${metarRes.status}`);
        if (!tafRes.ok) throw new Error(`TAF ${tafRes.status}`);

        const metar = await metarRes.json();
        const taf = await tafRes.json();

        return NextResponse.json({
            icao,
            metar,
            taf,
            source: "aviationweather.gov",
            ts: Date.now()
        }, { headers: { "Cache-Control": "no-store" } });
    } catch (e: any) {
        return NextResponse.json({ icao, error: String(e) }, { status: 502 });
    }
}
