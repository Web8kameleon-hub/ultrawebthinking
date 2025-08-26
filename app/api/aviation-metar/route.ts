// app/api/aviation-metar/route.ts
// Aviation METAR API - Simple endpoint without dynamic routes

import { NextRequest, NextResponse } from "next/server";

const AWC = "https://aviationweather.gov/api/data";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const icao = (url.searchParams.get("icao") || "").toUpperCase();

        if (!icao || !/^[A-Z]{4}$/.test(icao)) {
            return NextResponse.json({
                error: "Invalid ICAO code. Use 4-letter format like LATI, LOWW, EDDF"
            }, { status: 400 });
        }

        const ua = process.env.AWC_USER_AGENT ?? "Web8-Aviation/1.0 (+https://euroweb.de)";
        const metarURL = `${AWC}/metar?ids=${icao}&format=json`;

        const response = await fetch(metarURL, {
            headers: { "User-Agent": ua },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error(`Aviation weather service error: ${response.status}`);
        }

        const metar = await response.json();

        return NextResponse.json({
            success: true,
            icao,
            metar,
            source: "aviationweather.gov",
            timestamp: new Date().toISOString(),
            count: Array.isArray(metar) ? metar.length : 0
        }, {
            headers: {
                "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300"
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: true,
            message: error.message || "Failed to fetch METAR data",
            icao: new URL(req.url).searchParams.get("icao"),
            timestamp: new Date().toISOString()
        }, { status: 502 });
    }
}
