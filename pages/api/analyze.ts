import type { NextApiRequest, NextApiResponse } from "next";
import { analyzePlain } from "../../backend/services/analyze/text";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = typeof req.body === "string" ? req.body : req.body?.text;
        if (!body || typeof body !== "string") {
            return res.status(400).json({ error: "Provide text" });
        }

        const analysis = analyzePlain(body);
        res.json(analysis);
    } catch (e: any) {
        res.status(500).json({ error: e.message ?? "analyze_failed" });
    }
}
