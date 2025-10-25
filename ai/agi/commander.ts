/* Industrial Commander – safe execution & integrations
   - Whitelisted process execution with timeouts
   - Real HTTP fetch via undici (can be disabled via env)
   - System metrics (real OS/process)
   - Text processors (deterministic)
*/
import { execFile } from "child_process";
import { promisify } from "util";
import os from "os";
import process from "process";
import { fetch } from "undici";

const pexecFile = promisify(execFile);

type Ctor = { logger: any; cfg: any };

export class Commander {
    private logger: any;
    private cfg: any;
    private whitelist: Set<string>;

    constructor({ logger, cfg }: Ctor) {
        this.logger = logger;
        this.cfg = cfg;
        this.whitelist = new Set(String(cfg.AGI_COMMAND_WHITELIST).split(",").map(s => s.trim()).filter(Boolean));
    }

    async execute(cmd: { type: string; params?: Record<string, unknown> }) {
        switch (cmd.type) {
            case "fetch.url": return this.fetchUrl(String(cmd.params?.["url"] ?? ""));
            case "probe.audio": return { ok: true, message: "Audio was already probed by Sense using ffprobe (see sense.fromFile)." };
            case "system.metrics": return this.systemMetrics();
            case "process.run": return this.runProcess(String(cmd.params?.["cmd"] ?? ""), (cmd.params?.["args"] as string[]) ?? []);
            case "process.text.extract_keywords": return this.extractKeywords(String(cmd.params?.["text"] ?? ""), Number(cmd.params?.["limit"] ?? 24));
            case "process.text.summarize": return { ok: true, note: "Hook this to your last HTTP response/body in your REST layer." };
            default:
                return { ok: false, error: "unknown_command", cmd: cmd.type };
        }
    }

    private async fetchUrl(url: string) {
        if (!url || !/^https?:\/\//i.test(url)) return { ok: false, error: "invalid_url" };
        if (this.cfg.AGI_DISABLE_NETWORK === "1") return { ok: false, error: "network_disabled_by_policy" };
        const ctrl = new AbortController();
        const to = setTimeout(() => ctrl.abort(), this.cfg.AGI_NET_TIMEOUT_MS);
        try {
            const res = await fetch(url, { signal: ctrl.signal });
            const text = await res.text();
            return {
                ok: true,
                status: res.status,
                headers: Object.fromEntries([...res.headers.entries()].slice(0, 32)),
                bodyPreview: text.slice(0, 10000),
                length: text.length,
            };
        } catch (e) {
            this.logger.warn({ err: String(e), url }, "fetch failed");
            return { ok: false, error: "fetch_failed", detail: String(e) };
        } finally {
            clearTimeout(to);
        }
    }

    private systemMetrics() {
        const mu = process.memoryUsage();
        const load = os.loadavg();
        const cpus = os.cpus();
        return {
            ok: true,
            platform: process.platform,
            arch: process.arch,
            pid: process.pid,
            node: process.versions.node,
            uptime_s: process.uptime(),
            loadavg: { "1": load[0], "5": load[1], "15": load[2] },
            memory: {
                rss: mu.rss, heapTotal: mu.heapTotal, heapUsed: mu.heapUsed, external: mu.external,
            },
            cpu_count: cpus.length,
            cpu_model: cpus[0]?.model ?? null,
        };
    }

    private async runProcess(cmd: string, args: string[]) {
        if (!this.whitelist.has(cmd)) {
            return { ok: false, error: "cmd_not_whitelisted", cmd, allowed: [...this.whitelist] };
        }
        try {
            const { stdout, stderr } = await pexecFile(cmd, args, { timeout: 30_000 });
            return { ok: true, stdout: stdout.slice(0, 20000), stderr: stderr.slice(0, 20000) };
        } catch (e: any) {
            return { ok: false, error: "exec_failed", detail: String(e?.message ?? e) };
        }
    }

    private extractKeywords(text: string, limit = 24) {
        const tokens = text
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s:/._-]+/gu, " ")
            .split(/\s+/g)
            .filter(Boolean);
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
        return { ok: true, keywords: arr.slice(0, limit) };
    }
}
