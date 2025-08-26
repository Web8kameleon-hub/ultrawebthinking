// pages/api/med/report.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { buildStudyPDF } from "../../../backend/med/pdf/report";
import { getStudy } from "../../../backend/med/storage";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const id = (req.query.id as string || "").trim();
        if (!id) return res.status(400).send("Missing id");
        const study = getStudy(id);
        if (!study) return res.status(404).send("Not found");
        const pdf = await buildStudyPDF(study);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="Study_${id}.pdf"`);
        res.send(Buffer.from(pdf));
    } catch (e: any) {
        res.status(500).send(e.message || "report_failed");
    }
}
