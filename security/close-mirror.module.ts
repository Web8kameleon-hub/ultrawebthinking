// security/close-mirror.module.ts
import javascriptObfuscator from 'javascript-obfuscator';
import { minify } from 'terser';

export class CloseMirror {
    static async protect(code: string): Promise<string> {
        // Minifikim
        const minified = (await minify(code)).code || '';

        // Obfuskim me shtresa të shumta
        return javascriptObfuscator.obfuscate(minified, {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 0.75,
            deadCodeInjection: true,
            deadCodeInjectionThreshold: 0.4,
            debugProtection: true,
            debugProtectionInterval: 4000,
            stringArray: true,
            stringArrayEncoding: ['rc4'],
            rotateStringArray: true,
            selfDefending: true,
            target: 'browser'
        }).getObfuscatedCode();
    }
}
