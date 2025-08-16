#!/usr/bin/env pwsh
# =======================================================================
# 🏗️ AGI Module Name Cleaner
# Heq "x" dhe "×" nga emrat e moduleve AGI
# @author Ledjan Ahmati
# @version 1.0.0-CLEANER
# =======================================================================

param(
    [switch]$DryRun = $false,
    [switch]$Verbose = $false
)

$ROOT = "C:\Users\pc\UltraBuild\ultrawebthinking"
Set-Location $ROOT

Write-Host "🏗️ AGI Module Name Cleaner" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Pattern mappings for cleanup
$replacements = @{
    "AGI×Office" = "AGIOffice"
    "AGI×Med" = "AGIMed"  
    "AGI×El" = "AGIEl"
    "AGI×Eco" = "AGIEco"
    "AGI×BioNature" = "AGIBioNature"
    "AGIxOffice" = "AGIOffice"
    "AGIxMed" = "AGIMed"
    "AGIxEl" = "AGIEl" 
    "AGIxEco" = "AGIEco"
    "AGIxBioNature" = "AGIBioNature"
    "AGIXForm" = "AGIForm"
    "AGIxEcoLazy" = "AGIEcoLazy"
    "AGIxBioNatureLazy" = "AGIBioNatureLazy"
}

# File extensions to process
$extensions = @("*.tsx", "*.ts", "*.js", "*.json", "*.md")

# Get all files to process
$filesToProcess = @()
foreach ($ext in $extensions) {
    $files = Get-ChildItem -Recurse -Include $ext | Where-Object {
        $_.FullName -notmatch "node_modules|\.next|dist|coverage|\.git"
    }
    $filesToProcess += $files
}

Write-Host "`n📁 Files to process: $($filesToProcess.Count)" -ForegroundColor Green

$changedFiles = 0
$totalReplacements = 0

foreach ($file in $filesToProcess) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if (-not $content) { continue }
    
    $originalContent = $content
    $fileReplacements = 0
    
    # Apply all replacements
    foreach ($oldName in $replacements.Keys) {
        $newName = $replacements[$oldName]
        $oldCount = ([regex]::Matches($content, [regex]::Escape($oldName))).Count
        
        if ($oldCount -gt 0) {
            $content = $content -replace [regex]::Escape($oldName), $newName
            $fileReplacements += $oldCount
            
            if ($Verbose) {
                Write-Host "  🔄 $($file.Name): $oldName -> $newName ($oldCount times)" -ForegroundColor Gray
            }
        }
    }
    
    # Write changes if any
    if ($content -ne $originalContent) {
        $changedFiles++
        $totalReplacements += $fileReplacements
        
        Write-Host "  ✅ Updated: $($file.Name) ($fileReplacements replacements)" -ForegroundColor Green
        
        if (-not $DryRun) {
            Set-Content -Path $file.FullName -Value $content -Encoding UTF8
        }
    }
}

# Special handling for file renames
Write-Host "`n📂 Checking for file renames..." -ForegroundColor Green

$filesToRename = Get-ChildItem -Recurse -File | Where-Object {
    $_.Name -match "AGIx|AGI×" -and
    $_.FullName -notmatch "node_modules|\.next|dist|coverage|\.git"
}

foreach ($file in $filesToRename) {
    $oldName = $file.Name
    $newName = $oldName
    
    foreach ($pattern in $replacements.Keys) {
        if ($newName -match [regex]::Escape($pattern)) {
            $newName = $newName -replace [regex]::Escape($pattern), $replacements[$pattern]
        }
    }
    
    if ($newName -ne $oldName) {
        $newPath = Join-Path $file.DirectoryName $newName
        Write-Host "  🔄 Rename: $oldName -> $newName" -ForegroundColor Yellow
        
        if (-not $DryRun) {
            Move-Item $file.FullName $newPath -Force
        }
    }
}

# Summary
Write-Host "`n📊 Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

Write-Host "📁 Files processed: $($filesToProcess.Count)" -ForegroundColor Gray
Write-Host "✅ Files changed: $changedFiles" -ForegroundColor Green  
Write-Host "🔄 Total replacements: $totalReplacements" -ForegroundColor Green
Write-Host "📂 Files to rename: $($filesToRename.Count)" -ForegroundColor Yellow

if ($DryRun) {
    Write-Host "`n⚠️  DRY RUN - No actual changes made!" -ForegroundColor Yellow
    Write-Host "Run without -DryRun to apply changes." -ForegroundColor Yellow
} else {
    Write-Host "`n✅ All AGI module names cleaned!" -ForegroundColor Green
}

Write-Host "`n🎯 Next steps:" -ForegroundColor Cyan
Write-Host "1. yarn tsc --noEmit  # Check for any import errors" -ForegroundColor White
Write-Host "2. yarn dev -p 3001   # Test the application" -ForegroundColor White
Write-Host "3. git add -A && git commit -m 'Clean AGI module names'" -ForegroundColor White
