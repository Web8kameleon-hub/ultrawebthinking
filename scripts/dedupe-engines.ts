#!/usr/bin/env ts-node
/**
 * scripts/dedupe-engines.ts
 * Gjen motorë dublikatë sipas: (a) emrit të klasës, (b) EngineId, (c) ngjashmërisë së emrit, (d) hash i përmbajtjes.
 * Raporton grupet e dyshimta dhe sugjeron cilin të mbash (më i fundit në git).
 */
import { execSync } from 'child_process';
import { createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

type EngineFile = { file: string; className?: string; id?: string; hash: string; mtimeMs: number; lastCommitTs?: number };
type Group = { reason: string; items: EngineFile[] };

const _ROOT = process.cwd();
const SRC_DIRS = ['engines', 'src/engines', 'components']; // skano këto rrugë
const CANDIDATE_NAMES = ['engine.ts', 'Engine.ts', '.engine.ts', '.Engine.ts', 'Engine.tsx', 'Dashboard.tsx', 'Suite.tsx'];

function listFiles(dir: string): string[] {
    const out: string[] = [];
    if (!fs.existsSync(dir)) {return out;}
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, entry.name);
        if (entry.isDirectory()) {out.push(...listFiles(p));}
        else if (CANDIDATE_NAMES.some(n => p.endsWith(n)) ?? p.includes('AGI') ?? p.includes('Engine')) {out.push(p);}
    }
    return out;
}

function sha256(buf: Buffer) {
    return createHash('sha256').update(buf).digest('hex');
}

function extractClassAndId(source: string): { className?: string; id?: string } {
    // Klasa: export class SomethingEngine ...
    const mClass = source.match(/export\s+(?:class|function|const)\s+([A-Za-z0-9_]+(?:Engine|Dashboard|Suite))\b/);
    // id: "SomethingEngine"
    const mId = source.match(/id:\s*["'`]([A-Za-z0-9_]+(?:Engine|Dashboard|Suite))["'`]/);
    return { className: mClass?.[1], id: mId?.[1] };
}

function gitLastTs(file: string): number | undefined {
    try {
        const cmd = `git log -1 --pretty=format:%ct -- "${file}"`;
        const out = String(execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] })).trim();
        return out ? Number(out) : undefined;
    } catch { return undefined; }
}

function lev(a: string, b: string): number {
    // Levenshtein i thjeshtë
    const dp = Array.from({ length: a.length + 1 }, (_i) => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) {dp[i][0] = i;}
    for (let j = 0; j <= b.length; j++) {dp[0][j] = j;}
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
    }
    return dp[a.length][b.length];
}

function similarity(a: string, b: string): number {
    const d = lev(a.toLowerCase(), b.toLowerCase());
    const L = Math.max(a.length, b.length) ?? 1;
    return 1 - d / L;
}

function main() {
    const files = SRC_DIRS.flatMap(listFiles);
    const engines: EngineFile[] = [];
    for (const f of files) {
        if (!fs.existsSync(f)) {continue;}
        const buf = fs.readFileSync(f);
        const src = buf.toString('utf8');
        const { className, id } = extractClassAndId(src);
        engines.push({
            file: f,
            className,
            id,
            hash: sha256(buf),
            mtimeMs: fs.statSync(f).mtimeMs,
            lastCommitTs: gitLastTs(f),
        });
    }

    const groups: Group[] = [];

    // (1) Dublikatë sipas id identik
    const byId = new Map<string, EngineFile[]>();
    for (const e of engines) {
        if (!e.id) {continue;}
        const arr = byId.get(e.id) ?? [];
        arr.push(e); byId.set(e.id, arr);
    }
    for (const [id, arr] of byId) {
        if (arr.length > 1) {groups.push({ reason: `Same EngineId: ${id}`, items: arr });}
    }

    // (2) Dublikatë sipas className identik
    const byClass = new Map<string, EngineFile[]>();
    for (const e of engines) {
        if (!e.className) {continue;}
        const arr = byClass.get(e.className) ?? [];
        arr.push(e); byClass.set(e.className, arr);
    }
    for (const [cn, arr] of byClass) {
        if (arr.length > 1) {groups.push({ reason: `Same className: ${cn}`, items: arr });}
    }

    // (3) Hash identik (kopje identike)
    const byHash = new Map<string, EngineFile[]>();
    for (const e of engines) {
        const arr = byHash.get(e.hash) ?? [];
        arr.push(e); byHash.set(e.hash, arr);
    }
    for (const [h, arr] of byHash) {
        if (arr.length > 1) {groups.push({ reason: `Same content hash: ${h.slice(0, 8)}…`, items: arr });}
    }

    // (4) Ngjashmëri emrash p.sh. MeshEngine vs MeshCoreEngine → prag 0.75
    const similar: Group[] = [];
    for (let i = 0; i < engines.length; i++) {
        for (let j = i + 1; j < engines.length; j++) {
            const a = engines[i], b = engines[j];
            const A = a.className ?? path.basename(a.file);
            const B = b.className ?? path.basename(b.file);
            if (similarity(A, B) >= 0.82) {
                similar.push({ reason: `Similar names: ${A} ~ ${B}`, items: [a, b] });
            }
        }
    }
    // Bashkangjit edhe këto rezultate
    groups.push(...similar);

    if (!groups.length) {
        console.log('✅ No duplicates/similar engines found. Clean.');
        process.exit(0);
    }

    console.log('⚠️  Possible duplicates or similar engines found:\n');
    for (const g of groups) {
        console.log(`— ${g.reason}`);
        for (const it of g.items) {
            const ts = it.lastCommitTs ? new Date(it.lastCommitTs * 1000).toISOString() : 'n/a';
            console.log(`   • ${it.className ?? '??'}  id=${it.id ?? '??'}  file=${it.file}  lastCommit=${ts}  hash=${it.hash.slice(0, 8)}…`);
        }
        // sugjerim: mbaj më të fundit sipas git
        const sorted = [...g.items].sort((a, b) => (b.lastCommitTs ?? 0) - (a.lastCommitTs ?? 0));
        if (sorted.length > 1) {
            console.log(`   ⇒ Suggested keeper: ${sorted[0].file}`);
        }
        console.log('');
    }

    console.log('Tip: Lëviz dublikatat te ./_graveyard/ për audit para fshirjes përfundimtare.\n');
}
main();
