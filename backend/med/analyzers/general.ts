// backend/med/analyzers/general.ts
import { v4 as uuid } from "uuid";
import type { Evidence, Finding, InputBundle, Recommendation } from "../types";

export function runGeneralPanel(input: InputBundle): {
    findings: Finding[]; recommendations: Recommendation[]; evidence: Evidence[];
} {
    const findings: Finding[] = [];
    const recs: Recommendation[] = [];
    const ev: Evidence[] = [];

    // Vitals: përdor referencat që vijnë në input (nuk ngulitim vlera në kod)
    for (const v of (input.vitals || [])) {
        if (v.ref?.low !== undefined && v.value < v.ref.low) {
            findings.push({
                id: uuid(), panel: "GENERAL",
                title: `Vlerë nën referencë: ${v.name}`,
                detail: `Vlera: ${v.value}${v.unit ? " " + v.unit : ""} (ref low=${v.ref.low})`,
                severity: "low", confidence: 0.7, tags: ["vital", "below_range"]
            });
        }
        if (v.ref?.high !== undefined && v.value > v.ref.high) {
            findings.push({
                id: uuid(), panel: "GENERAL",
                title: `Vlerë mbi referencë: ${v.name}`,
                detail: `Vlera: ${v.value}${v.unit ? " " + v.unit : ""} (ref high=${v.ref.high})`,
                severity: "moderate", confidence: 0.7, tags: ["vital", "above_range"]
            });
        }
    }

    // Labs: sinjalizim out-of-range bazuar vetëm në ref të ofruara nga input
    for (const l of (input.labs || [])) {
        if (l.ref?.low !== undefined && l.value < l.ref.low) {
            findings.push({
                id: uuid(), panel: "GENERAL",
                title: `Lab nën referencë: ${l.label}`,
                detail: `Vlera=${l.value}${l.ref.unit ? " " + l.ref.unit : ""} (ref low=${l.ref.low})`,
                severity: "low", confidence: 0.65, tags: ["lab", "below_range"]
            });
        }
        if (l.ref?.high !== undefined && l.value > l.ref.high) {
            findings.push({
                id: uuid(), panel: "GENERAL",
                title: `Lab mbi referencë: ${l.label}`,
                detail: `Vlera=${l.value}${l.ref.unit ? " " + l.ref.unit : ""} (ref high=${l.ref.high})`,
                severity: "moderate", confidence: 0.65, tags: ["lab", "above_range"]
            });
        }
    }

    // Rekomandim i përgjithshëm, jo-diagnostik:
    if (findings.length > 0) {
        recs.push({
            title: "Rishikim klinik i rezultateve",
            rationale: "Disa vlera jashtë intervalit të referencës së dhënë.",
            actionType: "follow_up", urgency: "routine"
        });
    }

    ev.push({ kind: "internal_rule", note: "Out-of-range bazuar në referencat e ofruara nga input; jo udhëzim mjekësor." });
    return { findings, recommendations: recs, evidence: ev };
}
