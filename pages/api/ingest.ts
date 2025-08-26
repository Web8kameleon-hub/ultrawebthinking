import { randomUUID } from "crypto";
import type { NextApiRequest, NextApiResponse } from "next";
import { fetchText } from "../../backend/ingest/fetcher";
import { analyzePlain } from "../../backend/services/analyze/text";

// In-memory store - can be replaced with SQLite/PostgreSQL
const store: Record<string, any> = {};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const url = (req.query.url as string || "").trim();
        if (!url) {
            return res.status(400).json({ error: "Missing url parameter" });
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return res.status(400).json({ error: "Invalid URL format" });
        }

        // Fetch content
        const raw = await fetchText(url);

        // Analyze content
        const analysis = analyzePlain(raw);

        // Store result
        const id = randomUUID();
        const record = {
            id,
            url,
            ts: Date.now(),
            contentLength: raw.length,
            analysis,
            // Store first 1000 chars for preview
            preview: raw.substring(0, 1000) + (raw.length > 1000 ? "..." : "")
        };

        store[id] = record;

        // Return without raw content to keep response size reasonable
        const { preview, ...response } = record;
        res.json({
            ...response,
            hasPreview: !!preview,
            totalStored: Object.keys(store).length
        });

    } catch (e: any) {
        res.status(500).json({
            error: e.message ?? "ingest_failed",
            details: e.stack ? e.stack.split('\n')[0] : undefined
        });
    }
}

// Export store for other APIs to access
export { store };
