// scripts/protect-industrial.ts - Web8 Mirror Defense Industrial
import fs from 'node:fs';
import path from 'node:path';
import { Web8Security } from '../security/security';

const baseDir = process.cwd();

const SRC_CODE_PATH = process.env.WEB8_SRC_CODE_PATH || path.join(baseDir, 'src', 'index.ts');
const HTML_TMPL_PATH = process.env.WEB8_HTML_TMPL_PATH || path.join(baseDir, 'ui', 'index.html');

const OUT_ROOT = path.join(baseDir, 'build');
const OUT_DECOY = path.join(OUT_ROOT, 'decoy');
const OUT_PROT = path.join(OUT_ROOT, 'protected');
const OUT_UI = path.join(OUT_ROOT, 'ui');

function ensureDir(p: string) {
    fs.mkdirSync(p, { recursive: true });
}

async function main() {
    console.log('🔐 Web8 Mirrors: Protection start (Industrial)');

    if (!fs.existsSync(SRC_CODE_PATH)) throw new Error(`Source code not found: ${SRC_CODE_PATH}`);
    if (!fs.existsSync(HTML_TMPL_PATH)) throw new Error(`HTML template not found: ${HTML_TMPL_PATH}`);

    const sourceCode = fs.readFileSync(SRC_CODE_PATH, 'utf8');
    const htmlTemplate = fs.readFileSync(HTML_TMPL_PATH, 'utf8');

    const stamp = Date.now();
    const protectedFileName = `app.protected.${stamp}.js`;

    const security = new Web8Security();
    const result = await security.applyFullProtection(sourceCode, htmlTemplate, {
        protectedFileName,
        // nëse përdor CDN të besuar: extraCspScriptSrc: ['https://trusted.cdn.com']
    });

    ensureDir(OUT_DECOY);
    ensureDir(OUT_PROT);
    ensureDir(OUT_UI);

    const decoyPath = path.join(OUT_DECOY, `app.decoy.${stamp}.js`);
    const protPath = path.join(OUT_PROT, protectedFileName);
    const uiPath = path.join(OUT_UI, 'index.html');

    fs.writeFileSync(decoyPath, result.decoy, 'utf8');
    fs.writeFileSync(protPath, result.protected, 'utf8');
    fs.writeFileSync(uiPath, result.ui, 'utf8');

    const manifest = {
        timestamp: stamp,
        decoy: path.basename(decoyPath),
        protected: path.basename(protPath),
        ui: path.basename(uiPath)
    };
    fs.writeFileSync(path.join(OUT_ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');

    console.log('✅ Web8 Mirrors: Protection complete (Industrial)');
    console.log(JSON.stringify(manifest, null, 2));
}

main().catch((err) => {
    console.error('❌ Protection failed:', err);
    process.exit(1);
});
