// backend/med/engine.ts
import { v4 as uuid } from "uuid";
import { runGeneralPanel } from "./analyzers/general";
import { runOrthoPanel } from "./analyzers/ortho";
import { InputBundleSchema, type InputBundle, type Severity, type StudyResult } from "./types";

const DISCLAIMER = [
    "KJO NUK ËSHTË MJEKIM OSE DIAGNOZË.",
    "Rezultatet janë sinjalizuese dhe kërkojnë rishikim nga profesionist i licencuar.",
    "Motori nuk zëvendëson vlerësimin klinik, udhëzimet dhe testet zyrtare.",
].join(" ");

export function computeOverallSeverity(counts: Record<Severity, number>): Severity {
    if ((counts.critical ?? 0) > 0) return "critical";
    if ((counts.high ?? 0) > 0) return "high";
    if ((counts.moderate ?? 0) > 0) return "moderate";
    if ((counts.low ?? 0) > 0) return "low";
    return "info";
}

export function runStudy(inputRaw: unknown): StudyResult {
    const input = InputBundleSchema.parse(inputRaw) as InputBundle;

    const studyId = uuid();
    const panels = (input.requestedPanels.length > 0 ? input.requestedPanels : ["GENERAL", "ORTHO"]) as string[];

    let findings: StudyResult["findings"] = [];
    let recommendations: StudyResult["recommendations"] = [];
    let evidence: StudyResult["evidence"] = [];

    for (const p of panels) {
        if (p === "GENERAL") {
            const r = runGeneralPanel(input);
            findings = findings.concat(r.findings);
            recommendations = recommendations.concat(r.recommendations);
            evidence = evidence.concat(r.evidence);
        } else if (p === "ORTHO") {
            const r = runOrthoPanel(input);
            findings = findings.concat(r.findings);
            recommendations = recommendations.concat(r.recommendations);
            evidence = evidence.concat(r.evidence);
        }
        // Zgjero me panele të tjera (CARDIO, ONCO) si module të veçanta
    }

    const counts: Record<Severity, number> = { info: 0, low: 0, moderate: 0, high: 0, critical: 0 };
    for (const f of findings) counts[f.severity] = (counts[f.severity] || 0) + 1;

    const confAvg = findings.length ? (findings.reduce((s, f) => s + f.confidence, 0) / findings.length) : 1;

    const result: StudyResult = {
        studyId,
        createdAt: new Date().toISOString(),
        patient: input.patient,
        requestedPanels: panels,
        findings,
        recommendations,
        evidence,
        summary: {
            countsBySeverity: counts,
            overallSeverity: computeOverallSeverity(counts),
            confidenceAvg: Number(confAvg.toFixed(2))
        },
        disclaimer: DISCLAIMER
    };

    return result;
}
