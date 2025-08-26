"use client";

import * as React from "react";

type AviationData = {
    icao: string;
    metar: any;
    taf: any;
    ts: number;
    source: string;
    error?: string;
};

export default function AviationWeather() {
    const [icao, setIcao] = React.useState("LATI"); // default: Tirana
    const [data, setData] = React.useState<AviationData | null>(null);
    const [err, setErr] = React.useState("");

    async function load() {
        setErr("");
        setData(null);
        try {
            const r = await fetch(`/api/aviation/${icao}`, { cache: "no-store" });
            const j = await r.json();
            if (!r.ok) throw new Error(j?.error || r.statusText);
            setData(j);
        } catch (e: any) {
            setErr(String(e.message ?? e));
        }
    }

    React.useEffect(() => { load(); /* auto-load on mount */ }, []);

    return (
        <section style={{ display: "grid", gap: 12, padding: 16, background: "#0B1220", color: "#E2E8F0", borderRadius: 12 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>Aviation Weather</h2>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <input
                    value={icao}
                    onChange={e => setIcao(e.target.value.toUpperCase())}
                    maxLength={4}
                    placeholder="ICAO (e.g. LATI)"
                    style={{ padding: "8px 10px", borderRadius: 8, border: "1px solid #1E293B", background: "#0F172A", color: "#E2E8F0" }}
                />
                <button onClick={load} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#111827", color: "#E5E7EB", cursor: "pointer" }}>
                    Get METAR/TAF
                </button>
                {data?.ts && <span style={{ fontSize: 12, opacity: .7 }}>Updated: {new Date(data.ts).toLocaleTimeString()}</span>}
            </div>

            {err && <div style={{ color: "#FCA5A5" }}>Error: {err}</div>}

            {data && !err && (
                <div style={{ display: "grid", gap: 12 }}>
                    <div style={{ fontSize: 14, opacity: .8 }}>Source: {data.source}</div>
                    <div style={{ display: "grid", gap: 8 }}>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: 16 }}>METAR</h3>
                        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(data.metar, null, 2)}</pre>
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                        <h3 style={{ margin: "8px 0 0 0", fontSize: 16 }}>TAF</h3>
                        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(data.taf, null, 2)}</pre>
                    </div>
                </div>
            )}
        </section>
    );
}
