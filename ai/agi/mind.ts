/* Industrial Mind – analysis & planning (deterministic, input-driven)
   - Builds plans strictly from real sensed features (no random)
   - Intent classification: rule-based from URLs/keywords/commands
   - Knowledge merge: appends/updates memory via Core (callers handle persist)
*/
import { z } from "zod";

type Ctor = { logger: any; cfg: any };

const PlanStep = z.object({
    id: z.string(),
    action: z.string(),
    params: z.record(z.unknown()).default({}),
});
type PlanStep = z.infer<typeof PlanStep>;

export class Mind {
    private logger: any;
    private cfg: any;

    constructor({ logger, cfg }: Ctor) {
        this.logger = logger;
        this.cfg = cfg;
    }

    async plan(features: any): Promise<{ intent: string; steps: PlanStep[]; reason: string }> {
        const steps: PlanStep[] = [];
        const intent = this.detectIntent(features);
        const reason = this.explain(features, intent);

        if (intent === "fetch_url" && Array.isArray(features.urls) && features.urls.length) {
            steps.push({ id: "step-fetch", action: "fetch.url", params: { url: features.urls[0] } });
            steps.push({ id: "step-summarize", action: "process.text.summarize", params: { source: "last_response" } });
        } else if (intent === "probe_audio" && features.modality === "audio") {
            steps.push({ id: "step-audio-probe", action: "probe.audio", params: { mode: "ffprobe" } });
        } else if (intent === "system_metrics") {
            steps.push({ id: "step-sys", action: "system.metrics", params: {} });
        } else if (intent === "run_allowed_cmd" && features.command) {
            steps.push({ id: "step-run", action: "process.run", params: { cmd: features.command, args: features.args ?? [] } });
        } else {
            // Fallback: structured reflection (still deterministic; no random)
            steps.push({ id: "step-keywords", action: "process.text.extract_keywords", params: { limit: 24 } });
        }

        return { intent, steps, reason };
    }

    private detectIntent(features: any): string {
        if (features?.urls?.length) return "fetch_url";
        if (features?.modality === "audio") return "probe_audio";
        if (features?.modality === "text") {
            const kws: Array<{ term: string }> = features.keywords ?? [];
            const set = new Set(kws.map(k => k.term));
            if (set.has("metrics") || set.has("cpu") || set.has("status")) return "system_metrics";
            if (set.has("run") || set.has("exec") || features.command) return "run_allowed_cmd";
        }
        if (features?.modality === "eeg") return "eeg_analysis_needed";
        return "analyze_text";
    }

    private explain(features: any, intent: string): string {
        switch (intent) {
            case "fetch_url": return "Input përmban URL reale; duhet të bëjmë fetch me kufizime sigurie.";
            case "probe_audio": return "Skedari është audio; do të përdorim ffprobe për metadata reale.";
            case "system_metrics": return "Kërkohen metrika të sistemit; marrim të dhëna reale OS.";
            case "run_allowed_cmd": return "Kërkohet ekzekutim komande; vetëm whitelist e lejuar.";
            case "eeg_analysis_needed": return "EEG file detektuar; nevojitet bridge Python (MNE/librosa).";
            default: return "Analizë tekstuale: ekstraktim keywords dhe strukturuar pa random.";
        }
    }
}
