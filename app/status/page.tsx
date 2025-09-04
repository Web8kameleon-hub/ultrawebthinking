"use client";

import { StatusBadge } from "@/components/StatusBadge";
import React from "react";

export default function StatusPage() {
    const [data, setData] = React.useState<any>(null);
    const [err, setErr] = React.useState<string>("");

    React.useEffect(() => {
        let alive = true;
        fetch("/api/health", { cache: "no-store" })
            .then(r => r.json())
            .then(j => { if (alive) setData(j) })
            .catch(e => setErr(String(e)));
        return () => { alive = false; };
    }, []);

    const uttOk = data?.services?.utt?.ok === true;
    const loraOk = data?.services?.lora?.ok === true;

    return (
        <main style={{ padding: 24, display: "grid", gap: 16, maxWidth: 900, margin: "0 auto" }}>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>System Status</h1>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <StatusBadge label="UTT" ok={uttOk} />
                <StatusBadge label="LoRa" ok={loraOk} />
                <StatusBadge label="API" ok={uttOk && loraOk} />
            </div>

            <section style={{ background: "#0F172A", color: "#E2E8F0", padding: 16, borderRadius: 12 }}>
                <div style={{ fontSize: 14, opacity: .8, marginBottom: 8 }}>Raw JSON</div>
                <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {JSON.stringify(data ?? { error: err || "loading..." }, null, 2)}
                </pre>
            </section>
        </main>
    );
}

