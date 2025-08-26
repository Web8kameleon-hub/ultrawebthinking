import type { NextApiRequest, NextApiResponse } from "next";
import { getSearchProvider } from "../../backend/services/search";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const q = (req.query.q as string || "").trim();
        const count = parseInt((req.query.count as string) || "8", 10);

        if (!q) return res.status(400).json({ error: "Missing q" });

        const provider = getSearchProvider();
        const results = await provider.search(q, { count, lang: "de" });

        res.json({ provider: provider.name(), results });
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? "search_failed" });
    }
}
