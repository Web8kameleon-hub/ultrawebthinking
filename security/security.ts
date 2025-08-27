// security/security.ts
import { BrokenMirror } from './broken-mirror.module';
import { CloseMirror } from './close-mirror.module';
import { OutMirror } from './out-mirror.module';

export class Web8Security {
    async applyFullProtection(sourceCode: string, htmlTemplate: string, args: {
        protectedFileName: string;     // p.sh. app.protected.<stamp>.js
        extraCspScriptSrc?: string[];  // p.sh. ['https://trusted.cdn.com']
    }) {
        // 1) Decoy (Broken Mirror)
        const fakeCode = BrokenMirror.obfuscate(sourceCode);

        // 2) Protected (Close Mirror)
        const protectedCode = await CloseMirror.protect(sourceCode);

        // 3) UI (Out Mirror) me SRI real + referencë të saktë src
        const securedHTML = OutMirror.sanitize(htmlTemplate, {
            protectedFileName: args.protectedFileName,
            protectedContent: protectedCode,
            cspExtraScriptSrc: args.extraCspScriptSrc ?? []
        });

        return {
            decoy: fakeCode,
            protected: protectedCode,
            ui: securedHTML
        };
    }
}