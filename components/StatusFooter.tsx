"use client";

import { StatusBadge } from "@/components/StatusBadge";
import * as React from "react";

export function StatusFooter() {
    const [data, setData] = React.useState<any>(null);
    const [err, setErr] = React.useState<string>("");

    React.useEffect(() => {
        let alive = true;
        fetch("/api/health", { cache: "no-store" })
            .then(r => r.json())
            .then(j => { if (alive) setData(j); })
            .catch(e => setErr(String(e)));
        return () => { alive = false; };
    }, []);

    const uttOk = data?.services?.utt?.ok === true;
    const loraOk = data?.services?.lora?.ok === true;
    const allOk = uttOk && loraOk;

    return (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <StatusBadge label="UTT" ok={uttOk} />
            <StatusBadge label="LoRa" ok={loraOk} />
            <StatusBadge label="API" ok={allOk} />
            <span style={{ fontSize: 12, opacity: .7 }}>
                {err ? `Error: ${err}` : (data ? `ts: ${new Date(data.ts).toLocaleTimeString()}` : "loading...")}
            </span>
        </div>
    );
}

