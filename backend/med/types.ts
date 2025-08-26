// backend/med/types.ts
import { z } from "zod";

export const PatientSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    dob: z.string().optional(),      // ISO date
    sex: z.enum(["M", "F", "Other"]).optional(),
});

export type Patient = z.infer<typeof PatientSchema>;

export const RefRangeSchema = z.object({
    unit: z.string().optional(),
    low: z.number().optional(),
    high: z.number().optional(),
    note: z.string().optional()
});

export const LabValueSchema = z.object({
    code: z.string().min(1),            // e.g., "HGB"
    label: z.string().min(1),           // "Hemoglobin"
    value: z.number(),
    ref: RefRangeSchema.optional()
});

export type LabValue = z.infer<typeof LabValueSchema>;

export const ImagingFindingSchema = z.object({
    modality: z.enum(["MRI", "CT", "XR", "US", "Other"]),
    region: z.string().optional(),      // e.g., "knee-right"
    metrics: z.record(z.string(), z.number()).optional(), // e.g., { lesion_mm: 25 }
    description: z.string().optional()
});

export type ImagingFinding = z.infer<typeof ImagingFindingSchema>;

export const VitalSchema = z.object({
    name: z.string(),                   // e.g., "BP_sys","HR"
    value: z.number(),
    unit: z.string().optional(),
    ref: RefRangeSchema.optional()
});

export type Vital = z.infer<typeof VitalSchema>;

export const InputBundleSchema = z.object({
    patient: PatientSchema,
    labs: z.array(LabValueSchema).optional(),
    imaging: z.array(ImagingFindingSchema).optional(),
    vitals: z.array(VitalSchema).optional(),
    notes: z.string().optional(),       // free-text clinician note
    requestedPanels: z.array(z.string()).default([]) // e.g., ["GENERAL","ORTHO"]
});

export type InputBundle = z.infer<typeof InputBundleSchema>;

export type Severity = "info" | "low" | "moderate" | "high" | "critical";

export interface Finding {
    id: string;
    panel: string;              // analyzer id
    title: string;
    detail?: string;
    severity: Severity;
    confidence: number;         // 0..1
    tags?: string[];
}

export interface Recommendation {
    title: string;
    rationale?: string;
    actionType: "follow_up" | "monitor" | "refer" | "lifestyle" | "none";
    urgency: "routine" | "soon" | "urgent";
}

export interface Evidence {
    kind: "internal_rule" | "external_ref";
    ref?: string;               // DOI, URL, guideline id (ju vendosni burimin jashtë kodit)
    note?: string;
}

export interface StudyResult {
    studyId: string;
    createdAt: string;          // ISO
    patient: Patient;
    requestedPanels: string[];
    findings: Finding[];
    recommendations: Recommendation[];
    evidence: Evidence[];
    summary: {
        countsBySeverity: Record<Severity, number>;
        overallSeverity: Severity;
        confidenceAvg: number;
    };
    disclaimer: string;
}
