// security/out-mirror.module.ts
import crypto from 'crypto';
import { JSDOM } from 'jsdom';

type SanitizeOptions = {
    protectedFileName: string;   // p.sh. "app.protected.1724740000000.js"
    protectedContent: string;    // përmbajtja JS (për SRI real)
    cspExtraScriptSrc?: string[]; // opsionale: origjina shtesë p.sh. CDN
};

export class OutMirror {
    static sanitize(html: string, opts: SanitizeOptions): string {
        const dom = new JSDOM(html);
        const { document } = dom.window;

        // 1) Fshi resource jo të mbuluara (script/link pa minified/obfuscated)
        document.querySelectorAll('script[src], link[href]').forEach((node) => {
            const el = node as HTMLElement;
            const src = el.getAttribute('src') || '';
            const href = el.getAttribute('href') || '';
            const isOK =
                src.includes('obfuscated') ||
                src.includes('minified') ||
                src.includes('protected') ||
                href.includes('obfuscated') ||
                href.includes('minified') ||
                href.includes('protected');

            if (!isOK) el.remove();
        });

        // 2) Siguro që ekziston një <script> për skedarin e mbrojtur
        const assetsPath = `assets/${opts.protectedFileName}`;
        let protectedScript = document.querySelector<HTMLScriptElement>(
            `script[src="${assetsPath}"]`
        );

        if (!protectedScript) {
            protectedScript = document.createElement('script');
            protectedScript.setAttribute('src', assetsPath);
            protectedScript.defer = true;
            document.body.appendChild(protectedScript);
        }

        // 3) Llogarit SRI real nga përmbajtja e skedarit
        const integrityHash = OutMirror.generateIntegrityHash(opts.protectedContent);
        console.log(`🔧 Setting integrity: ${integrityHash}`);
        protectedScript.setAttribute('integrity', integrityHash);
        protectedScript.setAttribute('crossorigin', 'anonymous');

        console.log(`✅ Script configured: src=${protectedScript.getAttribute('src')}, integrity=${protectedScript.getAttribute('integrity')}`);

        // 4) Vendos CSP meta-tag të fortë (me opsion shtesë për CDN nëse duhet)
        const cspMetaOld = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
        if (cspMetaOld) cspMetaOld.remove();

        const cspMeta = document.createElement('meta');
        cspMeta.setAttribute('http-equiv', 'Content-Security-Policy');
        cspMeta.setAttribute('content', OutMirror.generateCSP(opts.cspExtraScriptSrc ?? []));
        document.head.appendChild(cspMeta);

        return dom.serialize();
    }

    private static generateCSP(extraScriptSrc: string[]): string {
        // Shënim: `unsafe-eval` mund të jetë e nevojshme për disa obfuscator runtime.
        // Kufizojeni vetëm te origjinat e besuara dhe hiqeni nëse nuk përdoret.
        const base = [
            "default-src 'self'",
            "script-src 'self' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data:",
            "connect-src 'self'",
            "font-src 'self' data:",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "object-src 'none'",
            "form-action 'self'"
        ];

        if (extraScriptSrc.length) {
            base[1] = base[1] + ' ' + extraScriptSrc.join(' ');
        }
        return base.join('; ') + ';';
    }

    private static generateIntegrityHash(content: string): string {
        const hash = crypto.createHash('sha384').update(Buffer.from(content, 'utf8')).digest('base64');
        console.log(`🔒 SRI Hash generated: sha384-${hash.substring(0, 20)}...`);
        return 'sha384-' + hash;
    }
}
