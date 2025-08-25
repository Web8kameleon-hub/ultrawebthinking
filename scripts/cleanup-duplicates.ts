#!/usr/bin/env tsx
/**
 * scripts/cleanup-duplicates.ts
 * Pastron automatikisht motorët dublikatë dhe skedarët empty
 */
import * as fs from 'fs';
import * as path from 'path';

const _EMPTY_HASH = 'e3b0c442'; // Hash për skedarët empty
const GRAVEYARD = './_graveyard';

// Lista e skedarëve empty që mund të fshihen pa problem
const SAFE_TO_DELETE_EMPTY = [
    'components\\AGIConsole.tsx',
    'components\\AGIMatrix.tsx',
    'components\\AGIPandaComponents.tsx',
    'components\\AGISearchEngine.tsx',
    'components\\AGIStatusIndicator.tsx',
    'components\\AGIxBioNature.tsx',
    'components\\ActiveAGI.tsx',
    'components\\AdvancedSearchEngine.module.css',
    'components\\AdvancedSearchEngine.tsx',
    'components\\AGISearchEngine.module.css',
    'components\\AGISheet\\AGIMedUltra.new.tsx',
    'components\\AGISheet\\AGISheet.module.css',
    'components\\AGISheet\\AGISheetDemo.module.css',
    'components\\AGISheet\\AGIxBioNature-pure.tsx',
    'components\\AGISheet\\AGIxBioNature-rewritten.tsx',
    'components\\AGISheet\\AGIxBioNature.module.css',
    'components\\AGISheet\\AGIxBioNature.tsx',
    'components\\AGISheet\\AGIxBioNatureDemo.module.css',
    'components\\AGISheet\\AGIxEco.module.css',
    'components\\AGISheet\\AGIxEcoDemo.module.css',
    'components\\AGISheet\\BiologyEngine.ts',
    'components\\AGISheet\\CellEngine.ts',
    'components\\AGISheet\\EcologyEngine.ts',
    'components\\AGISheet\\FormulaEngine.ts',
    'components\\AGISheet\\MedicalEngine.ts',
    'components\\AGISheet\\NatureEngine.ts',
    'components\\AGISheet\\register.ts',
    'components\\AGITunnel.module.css',
    'components\\EuropeanDashboard.tsx',
    'components\\MirrorDashboard.tsx',
    'components\\pages\\AGICore.module.css',
    'components\\pages\\AGICore.tsx',
    'components\\SearchEngine.module.css',
    'components\\SearchEngine.tsx'
];

function moveToGraveyard(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.log(`⚠️ File already deleted: ${filePath}`);
        return;
    }

    // Krijo graveyard directory
    if (!fs.existsSync(GRAVEYARD)) {
        fs.mkdirSync(GRAVEYARD, { recursive: true });
    }

    const fileName = path.basename(filePath);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const newPath = path.join(GRAVEYARD, `${timestamp}_${fileName}`);

    try {
        fs.renameSync(filePath, newPath);
        console.log(`✅ Moved to graveyard: ${filePath} → ${newPath}`);
    } catch (_error) {
        console.log(`❌ Failed to move ${filePath}: ${error}`);
    }
}

function main() {
    console.log('🧹 Starting cleanup of duplicate/empty files...\n');

    let movedCount = 0;

    for (const file of SAFE_TO_DELETE_EMPTY) {
        const fullPath = path.resolve(file);
        if (fs.existsSync(fullPath)) {
            const stat = fs.statSync(fullPath);
            if (stat.size === 0) {
                moveToGraveyard(fullPath);
                movedCount++;
            } else {
                console.log(`⚠️ File not empty, skipping: ${file} (${stat.size} bytes)`);
            }
        } else {
            console.log(`ℹ️ File not found: ${file}`);
        }
    }

    console.log(`\n✅ Cleanup complete! Moved ${movedCount} empty files to graveyard.`);
    console.log(`💡 Files are in ${GRAVEYARD}/ for review before permanent deletion.`);
}

main();
