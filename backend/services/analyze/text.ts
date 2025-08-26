import { parse } from "node-html-parser";

export type Analysis = {
    langGuess: string;
    wordCount: number;
    topKeywords: { token: string; score: number }[];
    summary: string[];
    sentiment: { score: number; magnitude: number };
};

export function cleanText(input: string): string {
    try {
        const root = parse(input);
        const text = root.text.trim().replace(/\s+/g, " ");
        return text || input;
    } catch {
        return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    }
}

export function analyzePlain(textRaw: string, maxSummaryLines = 4): Analysis {
    const text = cleanText(textRaw);
    const words = text.toLowerCase().match(/[a-zëçöäüßğşıșčžáéíóúàèìòùâêîôû0-9]+/gi) || [];
    const wordCount = words.length;

    // Simple language guessing (heuristic)
    const langGuess = /[äöüß]/i.test(text) ? "de" : /[çë]/i.test(text) ? "sq" : "en";

    // Keywords (tf)
    const stop = new Set([
        "the", "and", "of", "to", "a", "in", "is", "for", "are", "as", "at", "be", "or", "an", "will", "on", "with", "by",
        "mit", "und", "die", "der", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "ist", "sind", "war", "hat", "haben",
        "dhe", "qe", "per", "ne", "është", "janë", "ka", "do", "te", "me", "nga", "si", "ose", "por", "edhe", "nuk", "ky", "kjo"
    ]);

    const freq = new Map<string, number>();
    for (const w of words) {
        if (!stop.has(w) && w.length > 2) {
            freq.set(w, (freq.get(w) || 0) + 1);
        }
    }

    const topKeywords = Array.from(freq.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15)
        .map(([token, score]) => ({ token, score }));

    // Extractive summary: choose sentences with high rare word density
    const lines = text.split(/[.!?]\s+/).filter(Boolean);
    const scores = lines.map((ln) => {
        const toks = (ln.toLowerCase().match(/[a-zëçöäüß0-9]+/g) || []).filter(w => !stop.has(w));
        const sc = toks.reduce((s, w) => s + (1 / (1 + (freq.get(w) || 1))), 0);
        return { ln, sc };
    });

    const summary = scores
        .sort((a, b) => b.sc - a.sc)
        .slice(0, maxSummaryLines)
        .map(x => x.ln.trim());

    // Simple sentiment (mini AFINN)
    const pos = new Set([
        "good", "great", "excellent", "fit", "improve", "fast", "secure", "amazing", "perfect", "success", "win", "best",
        "stabil", "shpejt", "mirë", "shkëlqyer", "perfekt", "sukses", "fitore", "më i miri",
        "gut", "großartig", "ausgezeichnet", "perfekt", "schnell", "sicher", "erfolg", "beste"
    ]);

    const neg = new Set([
        "bad", "poor", "bug", "slow", "error", "vulnerable", "fail", "worst", "terrible", "awful", "broken",
        "rrëzik", "dobët", "gabim", "ngadalë", "dështim", "më i keqi", "i tmerrshëm",
        "schlecht", "langsam", "fehler", "verwundbar", "scheitern", "schlimmste", "schrecklich"
    ]);

    let score = 0, magnitude = 0;
    for (const w of words) {
        if (pos.has(w)) { score++; magnitude++; }
        if (neg.has(w)) { score--; magnitude++; }
    }

    return {
        langGuess,
        wordCount,
        topKeywords,
        summary,
        sentiment: { score, magnitude }
    };
}
