import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";

type FileInfo = { path: string; size: number; hash: string; normalizedHash: string; };
type NearPair = { a: string; b: string; similarity: number };

const ARGS = new Map<string, string>(
  process.argv.slice(2).map(a => {
    const [k, v] = a.split("=");
    return [k.replace(/^--/, ""), v ?? "true"];
  })
);

const ROOT = path.resolve(ARGS.get("root") || ".");
const OUTDIR = path.resolve(ARGS.get("out") || "reports/dupes");
const THRESH = Number(ARGS.get("threshold") || "0.90");
const MAX_BYTES = Number(ARGS.get("maxBytes") || 2_000_000);

const IGNORE_DIRS = new Set([
  "node_modules",".git",".next",".turbo",".vercel","dist","build","out",".cache","coverage"
]);

const TEXT_EXT = new Set([
  ".ts",".tsx",".js",".jsx",".mjs",".cjs",".json",".css",".scss",".sass",".md",".yml",".yaml",".html"
]);

function walk(dir: string, acc: string[] = []): string[] {
  const ents = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of ents) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!IGNORE_DIRS.has(e.name)) walk(p, acc);
    } else if (e.isFile()) acc.push(p);
  }
  return acc;
}

function sha256(buf: Buffer) {
  return createHash("sha256").update(buf).digest("hex");
}

function normalize(content: string, ext: string): string {
  let s = content;
  if (ext.match(/\.(ts|tsx|js|jsx|mjs|cjs)$/)) {
    s = s.replace(/\/\/[^\n\r]*/g, "");
    s = s.replace(/\/\*[\s\S]*?\*\//g, "");
  }
  s = s.replace(/\s+/g, " ");
  return s.trim();
}

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9_]+/g).filter(Boolean);
}
function tfVector(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) || 0) + 1);
  return m;
}
function cosineSim(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, na = 0, nb = 0;
  for (const v of a.values()) na += v * v;
  for (const v of b.values()) nb += v * v;
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const k of keys) dot += (a.get(k) || 0) * (b.get(k) || 0);
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function ensureDir(p: string) { fs.mkdirSync(p, { recursive: true }); }
function writeJSON(p: string, data: unknown) { fs.writeFileSync(p, JSON.stringify(data, null, 2)); }

function main() {
  console.log(`[dupes] Scanning: ${ROOT}`);
  const files = walk(ROOT).filter(f => {
    try {
      const st = fs.statSync(f);
      if (st.size > MAX_BYTES) return false;
      return TEXT_EXT.has(path.extname(f).toLowerCase());
    } catch { return false; }
  });

  const infos: FileInfo[] = [];
  for (const f of files) {
    try {
      const buf = fs.readFileSync(f);
      const ext = path.extname(f).toLowerCase();
      const rawHash = sha256(buf);
      const norm = normalize(buf.toString("utf8"), ext);
      const normHash = sha256(Buffer.from(norm));
      infos.push({ path: path.relative(ROOT, f), size: buf.length, hash: rawHash, normalizedHash: normHash });
    } catch {}
  }

  const byHash = new Map<string, FileInfo[]>();
  for (const i of infos) {
    const arr = byHash.get(i.hash) || [];
    arr.push(i); byHash.set(i.hash, arr);
  }
  const exactDupes = [...byHash.values()].filter(g => g.length > 1);

  const byNorm = new Map<string, FileInfo[]>();
  for (const i of infos) {
    const arr = byNorm.get(i.normalizedHash) || [];
    arr.push(i); byNorm.set(i.normalizedHash, arr);
  }
  const normDupes = [...byNorm.values()].filter(g => g.length > 1);

  ensureDir(OUTDIR);
  writeJSON(path.join(OUTDIR, "duplicates.json"), { root: ROOT, groups: exactDupes.map(g => g.map(x => x.path)) });
  writeJSON(path.join(OUTDIR, "near-duplicates.json"), { root: ROOT, normalized: normDupes.map(g => g.map(x => x.path)), threshold: THRESH });

  console.log(`[dupes] Done. Reports in: ${OUTDIR}`);
}
main();
