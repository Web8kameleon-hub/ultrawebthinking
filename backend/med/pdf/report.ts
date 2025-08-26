// backend/med/pdf/report.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import type { StudyResult } from "../types";

export async function buildStudyPDF(res: StudyResult): Promise<Uint8Array> {
    const pdf = await PDFDocument.create();
    const font = await pdf.embedFont(StandardFonts.Helvetica);
    const page = pdf.addPage([595.28, 841.89]); // A4
    const draw = (txt: string, x: number, y: number, size = 11) =>
        page.drawText(txt, { x, y, size, font, color: rgb(0, 0, 0) });

    let y = 812;
    draw("SuperCrista Medicine Engine – Study Report", 40, y, 16); y -= 20;
    draw(`Study ID: ${res.studyId}`, 40, y); y -= 14;
    draw(`Created: ${res.createdAt}`, 40, y); y -= 14;
    draw(`Patient: ${res.patient.name} (${res.patient.id})`, 40, y); y -= 18;

    draw("Requested Panels:", 40, y); y -= 14;
    draw(res.requestedPanels.join(", "), 50, y); y -= 18;

    draw("Summary:", 40, y); y -= 14;
    draw(`Overall Severity: ${res.summary.overallSeverity} • ConfidenceAvg: ${res.summary.confidenceAvg}`, 50, y); y -= 14;
    const cnt = res.summary.countsBySeverity;
    draw(`Counts — info:${cnt.info || 0} low:${cnt.low || 0} mod:${cnt.moderate || 0} high:${cnt.high || 0} crit:${cnt.critical || 0}`, 50, y); y -= 18;

    draw("Findings:", 40, y); y -= 16;
    for (const f of res.findings.slice(0, 24)) {
        const line1 = `• [${f.panel}] ${f.title}  (sev=${f.severity}, conf=${f.confidence})`;
        draw(line1, 50, y); y -= 12;
        if (f.detail) { // wrap rudimentar
            const chunks = f.detail.match(/.{1,90}(\s|$)/g) || [f.detail];
            for (const c of chunks) { draw(`  ${c.trim()}`, 50, y); y -= 11; }
        }
        if (y < 80) { // faqe e re
            const newPage = pdf.addPage([595.28, 841.89]);
            y = 812;
        }
    }

    if (y < 140) {
        const newPage = pdf.addPage([595.28, 841.89]);
        y = 812;
    }
    draw("Recommendations:", 40, y); y -= 16;
    for (const r of res.recommendations.slice(0, 16)) {
        draw(`• ${r.title} — action=${r.actionType}, urgency=${r.urgency}`, 50, y); y -= 12;
        if (r.rationale) { draw(`  ${r.rationale}`, 50, y); y -= 11; }
        if (y < 90) {
            const newPage = pdf.addPage([595.28, 841.89]);
            y = 812;
        }
    }

    if (y < 120) {
        const newPage = pdf.addPage([595.28, 841.89]);
        y = 812;
    }
    draw("Evidence (summaries):", 40, y); y -= 16;
    for (const e of res.evidence.slice(0, 12)) {
        draw(`• ${e.kind}${e.ref ? " — " + e.ref : ""}${e.note ? " :: " + e.note : ""}`, 50, y); y -= 12;
        if (y < 90) {
            const newPage = pdf.addPage([595.28, 841.89]);
            y = 812;
        }
    }

    if (y < 100) {
        const newPage = pdf.addPage([595.28, 841.89]);
        y = 812;
    }
    draw("Disclaimer:", 40, y); y -= 14;
    const dChunks = res.disclaimer.match(/.{1,95}(\s|$)/g) || [res.disclaimer];
    for (const c of dChunks) { draw(c.trim(), 50, y); y -= 11; }

    return await pdf.save();
}
