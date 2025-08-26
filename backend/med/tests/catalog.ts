// backend/med/tests/catalog.ts
export type PanelId = "GENERAL" | "ORTHO" | "CARDIO" | "ONCO";

export const PANELS: Record<PanelId, { id: PanelId; title: string; desc: string }> = {
    GENERAL: { id: "GENERAL", title: "General Panel", desc: "Kontrolle bazë mbi vitals/labs me intervale referencë të dhëna nga input." },
    ORTHO: { id: "ORTHO", title: "Orthopedics Panel", desc: "Shqyrtim i gjetjeve ortopedike (p.sh. gjuri) me sinjale për konsultë." },
    CARDIO: { id: "CARDIO", title: "Cardio Panel", desc: "Kontrolle të thjeshta sinjalizuese për parametra kardio (jo diagnozë)." },
    ONCO: { id: "ONCO", title: "Oncology Panel", desc: "Red flag sinjalizuese për referim. Nuk jep diagnozë." }
};
