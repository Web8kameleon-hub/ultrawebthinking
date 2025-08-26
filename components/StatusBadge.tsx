"use client";


export function StatusBadge({ label, ok }: { label: string; ok?: boolean }) {
    const bg = ok ? "#DCFCE7" : "#FEE2E2";
    const col = ok ? "#16A34A" : "#DC2626";
    const dot = ok ? "#22C55E" : "#EF4444";
    const txt = ok ? "OK" : "DOWN";
    return (
        <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: bg, color: col, padding: "6px 10px",
            borderRadius: 999, fontSize: 12, fontWeight: 600
        }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: dot, display: "inline-block" }} />
            {label}: {txt}
        </span>
    );
}
