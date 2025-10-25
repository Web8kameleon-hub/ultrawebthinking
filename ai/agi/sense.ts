/* Industrial Sense – real input sensing (text/files/system)
   - Text: clean, language detect (heuristic), keywords (freq), URLs extract
   - File: probes via filesystem; audio via ffprobe (if present); EEG by extension
   - No randomization, no fake metrics. Everything reflects actual inputs.
*/
import { promises as fs } from "fs";
import { basename, extname } from "pathe";
import { execFile } from "child_process";
import { promisify } from "util";
import { z } from "zod";
import os from "os";

const pexecFile = promisify(execFile);

type Ctor = { logger: any; cfg: any };

export class Sense {
    private logger: any;
    private cfg: any;

    constructor({ logger, cfg }: Ctor) {
        this.logger = logger;
        this.cfg = cfg;
    }

    // -------- TEXT --------
    async fromText(text: string) {
        const cleaned = text.trim();
        const tokens = this.tokenize(cleaned);
        const keywords = this.keywords(tokens);
        const urls = this.extractUrls(cleaned);
        const lang = this.detectLanguage(cleaned);

        const tags = ["text"];
        if (urls.length) tags.push("url");
        if (lang) tags.push(`lang:${lang}`);

        return {
            modality: "text" as const,
            length: cleaned.length,
            words: tokens.length,
            lang,
            urls,
            keywords,
            tags,
        };
    }

    private tokenize(s: string): string[] {
        return s
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s:/._-]+/gu, " ")
            .split(/\s+/g)
            .filter(Boolean);
    }

    private keywords(tokens: string[]): Array<{ term: string; freq: number }> {
        const stop = new Set([
            "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "mit", "und", "der", "die", "das", "ein", "eine",
            "me", "you", "i", "is", "are", "am", "je", "le", "la", "et", "de", "que", "se", "po", "per", "te", "ti", "ne",
        ]);
        const map = new Map<string, number>();
        for (const t of tokens) {
            if (stop.has(t)) continue;
            map.set(t, (map.get(t) ?? 0) + 1);
        }
        const arr = [...map.entries()].map(([term, freq]) => ({ term, freq }));
        arr.sort((a, b) => b.freq - a.freq || a.term.localeCompare(b.term));
        return arr.slice(0, 24);
    }

    private extractUrls(s: string): string[] {
        const re = /\bhttps?:\/\/[^\s"'<>]+/gi;
        const out = s.match(re) ?? [];
        return [...new Set(out)];
    }

    private detectLanguage(s: string): string | null {
        // Heuristic: simple Unicode ranges + common words (no external model)
        const lower = s.toLowerCase();
        if (/[ëç]/i.test(s) || /\b(po|vlla|shqip|mir[eë]m[eë]ngjes)\b/.test(lower)) return "sq";
        if (/\b(und|der|die|das|nicht|bitte|danke)\b/.test(lower)) return "de";
        if (/\b(the|and|please|thank)\b/.test(lower)) return "en";
        if (/\b(le|la|et|merci|bonjour)\b/.test(lower)) return "fr";
        return null;
    }

    // -------- FILES --------
    async fromFile(path: string) {
        const st = await fs.stat(path); // throws if not exists
        const ext = extname(path).toLowerCase();
        const base = basename(path);

        let modality: "audio" | "eeg" | "text" | "json" | "binary" = "binary";
        if (ext === ".wav" || ext === ".mp3" || ext === ".flac") modality = "audio";
        else if (ext === ".edf" || ext === ".bdf" || ext === ".set") modality = "eeg";
        else if (ext === ".txt" || ext === ".md" || ext === ".log") modality = "text";
        else if (ext === ".json") modality = "json";

        const meta = {
            size: st.size,
            mtime: st.mtime.toISOString(),
            atime: st.atime.toISOString(),
            ctime: st.ctime.toISOString(),
            owner: os.userInfo().username,
            base,
            ext,
            path,
        };

        // Only real probing — no fake fallback.
        const summary: Record<string, unknown> = {};
        if (modality === "audio") {
            summary.audio = await this.probeAudio(path);
        } else if (modality === "eeg") {
            summary.eeg = { hint: "EEG container detected by extension (use Python bridge to parse with MNE/librosa)." };
        } else if (modality === "text") {
            const content = await fs.readFile(path, "utf-8");
            const features = await this.fromText(content);
            summary.text = { preview: content.slice(0, 4000), features };
        } else if (modality === "json") {
            const obj = JSON.parse(await fs.readFile(path, "utf-8"));
            summary.json = { keys: Object.keys(obj), preview: obj };
        }

        const tags = ["file", modality];

        return {
            modality,
            meta,
            summary,
            features: summary.text?.features ?? {},
            tags,
        };
    }

    private async probeAudio(path: string) {
        // Requires ffprobe in PATH. If missing, we return a clear error (no fake).
        try {
            const { stdout } = await pexecFile("ffprobe", [
                "-v", "error",
                "-print_format", "json",
                "-show_format",
                "-show_streams",
                path,
            ], { timeout: this.cfg.AGI_NET_TIMEOUT_MS });
            return JSON.parse(stdout);
        } catch (e) {
            this.logger.warn({ err: String(e) }, "ffprobe not available or failed");
            return { error: "ffprobe_unavailable_or_failed" };
        }
    }
}
