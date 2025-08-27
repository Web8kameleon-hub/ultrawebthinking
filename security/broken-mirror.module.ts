// security/broken-mirror.module.ts
import { transform } from '@babel/core';
import * as ts from 'typescript';

export class BrokenMirror {
    static obfuscate(code: string): string {
        try {
            // Shtrembërim i kodit me Babel
            const obfuscated = transform(code, {
                plugins: [
                    // Shton noise dhe false patterns
                    function () {
                        return {
                            visitor: {
                                FunctionDeclaration(path: any) {
                                    // Shto false comments
                                    path.addComment('leading', ' FAKE FUNCTION - DECOY');
                                },
                                Identifier(path: any) {
                                    // Scramble disa identifier-a
                                    if (Math.random() > 0.8) {
                                        const scrambled = path.node.name.split('').reverse().join('') + '_decoy';
                                        path.node.name = scrambled;
                                    }
                                }
                            }
                        };
                    }
                ],
                presets: [require('@babel/preset-typescript')]
            })?.code || code;

            // Shtrembërim shtesë me TypeScript AST
            const sourceFile = ts.createSourceFile('temp.ts', obfuscated, ts.ScriptTarget.Latest);
            const transformer = (context: ts.TransformationContext) => {
                const visit = (node: ts.Node): ts.Node => {
                    if (ts.isIdentifier(node)) {
                        return ts.factory.createIdentifier(this.scrambleName(node.text));
                    }
                    return ts.visitEachChild(node, visit, context);
                };
                return (node: ts.Node) => ts.visitNode(node, visit);
            };

            const result = ts.transform(sourceFile, [transformer]);
            return ts.createPrinter().printFile(result.transformed[0] as ts.SourceFile);
        } catch (error) {
            // Fallback në scrambling manual
            return this.manualScramble(code);
        }
    }

    private static scrambleName(name: string): string {
        return name.split('').reverse().join('') + '_' + Math.random().toString(36).substring(2, 7);
    }

    private static manualScramble(code: string): string {
        // Manual obfuscation për fallback
        return code
            .replace(/function\s+(\w+)/g, (match, name) => `function ${this.scrambleName(name)}`)
            .replace(/const\s+(\w+)/g, (match, name) => `const ${this.scrambleName(name)}`)
            .replace(/let\s+(\w+)/g, (match, name) => `let ${this.scrambleName(name)}`);
    }
}
