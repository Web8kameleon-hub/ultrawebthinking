// backend/med/analyzers/ortho.ts
import { v4 as uuid } from "uuid";
import type { Evidence, Finding, InputBundle, Recommendation } from "../types";

export function runOrthoPanel(input: InputBundle): {
    findings: Finding[]; recommendations: Recommendation[]; evidence: Evidence[];
} {
    const findings: Finding[] = [];
    const recs: Recommendation[] = [];
    const ev: Evidence[] = [];

    for (const im of (input.imaging || [])) {
        if (im.modality === "MRI" && (im.region || "").toLowerCase().includes("knee")) {
            const mm = im.metrics?.lesion_mm ?? im.metrics?.defect_mm;
            if (typeof mm === "number") {
                findings.push({
                    id: uuid(), panel: "ORTHO",
                    title: "Gjetje MRI në gju",
                    detail: `Parametër i raportuar (lesion/defect) ≈ ${mm} mm. Përshkrim: ${im.description ?? "-"}`,
                    severity: mm >= 10 ? "moderate" : "low",
                    confidence: 0.7, tags: ["ortho", "knee", "mri"]
                });
                recs.push({
                    title: "Konsultë ortopedike",
                    rationale: "Gjetje e raportuar në imazheri; kërkon interpretim klinik.",
                    actionType: "refer", urgency: mm >= 20 ? "soon" : "routine"
                });
            }
        }
    }

    ev.push({ kind: "internal_rule", note: "Sinjalizim i thjeshtë bazuar në metrika të raportuara; jo diagnozë." });
    return { findings, recommendations: recs, evidence: ev };
}
