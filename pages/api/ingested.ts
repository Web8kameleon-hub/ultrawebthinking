import type { NextApiRequest, NextApiResponse } from "next";
import { store } from "./ingest";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const records = Object.values(store);
        const summary = {
            total: records.length,
            byLanguage: records.reduce((acc: any, r: any) => {
                const lang = r.analysis?.langGuess || "unknown";
                acc[lang] = (acc[lang] || 0) + 1;
                return acc;
            }, {}),
            avgWordCount: records.length > 0
                ? Math.round(records.reduce((sum: number, r: any) => sum + (r.analysis?.wordCount || 0), 0) / records.length)
                : 0,
            recent: records
                .sort((a: any, b: any) => b.ts - a.ts)
                .slice(0, 10)
                .map((r: any) => ({
                    id: r.id,
                    url: r.url,
                    ts: r.ts,
                    lang: r.analysis?.langGuess,
                    words: r.analysis?.wordCount,
                    sentiment: r.analysis?.sentiment?.score
                }))
        };

        res.json(summary);
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? "ingested_data_failed" });
    }
}
