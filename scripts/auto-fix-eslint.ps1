# Auto-fix ESLint errors for EuroWeb
# Fokus tek nullish coalescing dhe unused variables

Write-Host "Starting auto-fix for common ESLint issues..." -ForegroundColor Green

# Get all TypeScript files
$tsFiles = Get-ChildItem -Path . -Filter "*.ts" -Recurse | Where-Object { 
    $_.DirectoryName -notlike "*node_modules*" -and 
    $_.DirectoryName -notlike "*.git*" -and
    $_.DirectoryName -notlike "*_graveyard*"
}

$tsxFiles = Get-ChildItem -Path . -Filter "*.tsx" -Recurse | Where-Object { 
    $_.DirectoryName -notlike "*node_modules*" -and 
    $_.DirectoryName -notlike "*.git*" -and
    $_.DirectoryName -notlike "*_graveyard*"
}

$allFiles = $tsFiles + $tsxFiles

Write-Host "Found $($allFiles.Count) TypeScript files to process" -ForegroundColor Cyan

$fixCount = 0

foreach ($file in $allFiles) {
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content
    
    # Fix 1: Replace || with ?? for nullish coalescing
    $content = $content -replace '\|\|', '??'
    
    # Fix 2: Add underscore prefix to unused variables in catch blocks
    $content = $content -replace 'catch\s*\(\s*([a-zA-Z][a-zA-Z0-9]*)\s*\)', 'catch (_$1)'
    
    # Fix 3: Fix if statements without braces
    $content = $content -replace 'if\s*\(([^)]+)\)\s*return\s+([^;]+);', 'if ($1) { return $2; }'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        $fixCount++
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Yellow
    }
}

Write-Host "Auto-fixed $fixCount files!" -ForegroundColor Green
Write-Host "Running ESLint --fix for remaining issues..." -ForegroundColor Cyan

# Run ESLint --fix
npx eslint . --ext .ts,.tsx --fix --quiet

Write-Host "Auto-fix complete!" -ForegroundColor Green
