// backend/med/storage.ts
import type { StudyResult } from "./types";

const mem = new Map<string, StudyResult>();

export function storeStudy(res: StudyResult) {
    mem.set(res.studyId, res);
}

export function getStudy(id: string): StudyResult | undefined {
    return mem.get(id);
}

export function getAllStudies(): StudyResult[] {
    return Array.from(mem.values());
}

export function getStudyCount(): number {
    return mem.size;
}
