import type { NextApiRequest, NextApiResponse } from "next";
import { analyzePlain } from "../../backend/services/analyze/text";
import { buildAnalysisPDF } from "../../backend/services/docs/report";
import { getSearchProvider } from "../../backend/services/search";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const q = (req.query.q as string || "").trim();
        if (!q) return res.status(400).send("Missing q parameter");

        // Get search results
        const provider = getSearchProvider();
        const results = await provider.search(q, { count: 10, lang: "de" });

        // Analyze combined content
        const joined = results.map(r => `${r.title}. ${r.snippet}`).join(" ");
        const analysis = analyzePlain(joined);

        // Generate PDF
        const pdf = await buildAnalysisPDF({
            title: "Web8 Intelligence Report",
            query: q,
            results: results.map(r => ({
                title: r.title,
                url: r.url,
                snippet: r.snippet
            })),
            analysis
        });

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `inline; filename="web8-report-${Date.now()}.pdf"`);
        res.send(Buffer.from(pdf));
    } catch (e: any) {
        res.status(500).send(e.message ?? "report_failed");
    }
}
