// pages/api/med/run.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { runStudy } from "../../../backend/med/engine";
import { storeStudy } from "../../../backend/med/storage";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
        const result = runStudy(body);
        storeStudy(result);
        res.status(200).json(result);
    } catch (e: any) {
        res.status(400).json({ error: e.message || "study_failed" });
    }
}
