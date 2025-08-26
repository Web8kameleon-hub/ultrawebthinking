// app/api/aviation-taf/route.ts
// Aviation TAF API - Simple endpoint

import { NextRequest, NextResponse } from "next/server";

const AWC = "https://aviationweather.gov/api/data";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const icao = (url.searchParams.get("icao") || "").toUpperCase();

        if (!icao || !/^[A-Z]{4}$/.test(icao)) {
            return NextResponse.json({
                error: "Invalid ICAO code"
            }, { status: 400 });
        }

        const ua = process.env.AWC_USER_AGENT ?? "Web8-Aviation/1.0";
        const tafURL = `${AWC}/taf?ids=${icao}&format=json`;

        const response = await fetch(tafURL, {
            headers: { "User-Agent": ua },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`TAF service error: ${response.status}`);
        }

        const taf = await response.json();

        return NextResponse.json({
            success: true,
            icao,
            taf,
            source: "aviationweather.gov",
            timestamp: new Date().toISOString(),
            count: Array.isArray(taf) ? taf.length : 0
        }, {
            headers: {
                "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300"
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: true,
            message: error.message || "Failed to fetch TAF data",
            timestamp: new Date().toISOString()
        }, { status: 502 });
    }
}
