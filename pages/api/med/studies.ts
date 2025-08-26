// pages/api/med/studies.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getAllStudies, getStudyCount } from "../../../backend/med/storage";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const studies = getAllStudies();
        const summary = {
            total: getStudyCount(),
            studies: studies.map(s => ({
                studyId: s.studyId,
                createdAt: s.createdAt,
                patientName: s.patient.name,
                patientId: s.patient.id,
                panels: s.requestedPanels,
                overallSeverity: s.summary.overallSeverity,
                findingsCount: s.findings.length,
                recommendationsCount: s.recommendations.length
            }))
        };
        res.status(200).json(summary);
    } catch (e: any) {
        res.status(500).json({ error: e.message || "failed_to_get_studies" });
    }
}
