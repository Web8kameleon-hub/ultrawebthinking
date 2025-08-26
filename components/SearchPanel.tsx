"use client";
import { useState } from "react";

type Row = {
    id: string;
    title: string;
    url: string;
    snippet: string;
    source: string;
    ts: number;
};

export default function SearchPanel() {
    const [q, setQ] = useState("");
    const [rows, setRows] = useState<Row[]>([]);
    const [loading, setLoading] = useState(false);

    const run = async () => {
        if (!q.trim()) return;
        setLoading(true);
        try {
            const r = await fetch(`/api/search?q=${encodeURIComponent(q)}&count=8`);
            const data = await r.json();
            setRows(data.results || []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-3">
            <div className="flex gap-2">
                <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Kërko në Web8..."
                    className="flex-1 border rounded px-3 py-2"
                    onKeyDown={e => e.key === 'Enter' && run()}
                />
                <button
                    onClick={run}
                    disabled={loading}
                    className="px-4 py-2 rounded border bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Duke kërkuar..." : "Kërko"}
                </button>
            </div>
            <div className="space-y-3">
                {rows.map(r => (
                    <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border rounded p-3 hover:bg-black/5 transition-colors"
                    >
                        <div className="text-sm opacity-70">
                            {new Date(r.ts).toLocaleString()} — {r.source}
                        </div>
                        <div className="font-semibold text-blue-600">{r.title}</div>
                        <div className="text-sm text-gray-700">{r.snippet}</div>
                        <div className="text-xs opacity-70 break-all">{r.url}</div>
                    </a>
                ))}
            </div>
        </div>
    );
}
