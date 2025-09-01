#!/usr/bin/env pwsh
<#
.SYNOPSIS
EuroWeb Ultra - Directory Cleanup & Duplicate Removal
.DESCRIPTION
Removes empty and duplicate directories from the project structure
.AUTHOR
Ledjan Ahmati
.VERSION
8.0.0-WEB8
#>

Write-Host "🧹 EuroWeb Ultra - Directory Cleanup Started" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Cyan

# 1. Remove completely empty directories
Write-Host "📂 Removing empty directories..." -ForegroundColor Yellow
$emptyDirs = @("test-utils", "blocked")
foreach($dir in $emptyDirs) {
    if(Test-Path $dir) {
        Write-Host "   Removing empty: $dir" -ForegroundColor Red
        Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 2. Consolidate test directories
Write-Host "`n🧪 Consolidating test directories..." -ForegroundColor Yellow
# Keep __tests__ as main test directory
# Move files from other test dirs if they exist

if(Test-Path "test" -and (Get-ChildItem "test").Count -gt 0) {
    Write-Host "   Moving files from test/ to __tests__/" -ForegroundColor Cyan
    Get-ChildItem "test" | ForEach-Object {
        if($_.Name -ne "__tests__") {
            Move-Item $_.FullName "__tests__/" -Force -ErrorAction SilentlyContinue
        }
    }
    Remove-Item "test" -Recurse -Force -ErrorAction SilentlyContinue
}

if(Test-Path "test-data" -and (Get-ChildItem "test-data").Count -gt 0) {
    Write-Host "   Moving test-data/ to __tests__/data/" -ForegroundColor Cyan
    if(-not (Test-Path "__tests__/data")) {
        New-Item -ItemType Directory "__tests__/data" -Force | Out-Null
    }
    Get-ChildItem "test-data" | ForEach-Object {
        Move-Item $_.FullName "__tests__/data/" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "test-data" -Recurse -Force -ErrorAction SilentlyContinue
}

# Keep tests/ for performance testing since it has load and performance subdirs

# 3. Consolidate AGI/AI directories
Write-Host "`n🤖 Consolidating AGI/AI directories..." -ForegroundColor Yellow

# Check if agi and agisheet have minimal content and can be moved to main structure
if(Test-Path "agi" -and (Get-ChildItem "agi").Count -le 2) {
    Write-Host "   Moving minimal agi/ contents to lib/agi/" -ForegroundColor Cyan
    if(-not (Test-Path "lib/agi")) {
        New-Item -ItemType Directory "lib/agi" -Force | Out-Null
    }
    Get-ChildItem "agi" | ForEach-Object {
        Move-Item $_.FullName "lib/agi/" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "agi" -Recurse -Force -ErrorAction SilentlyContinue
}

if(Test-Path "agisheet" -and (Get-ChildItem "agisheet").Count -le 2) {
    Write-Host "   Moving minimal agisheet/ contents to components/AGISheet/" -ForegroundColor Cyan
    Get-ChildItem "agisheet" | ForEach-Object {
        Move-Item $_.FullName "components/AGISheet/" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "agisheet" -Recurse -Force -ErrorAction SilentlyContinue
}

# Keep ai/ as it might have more substantial content

# 4. Consolidate utils directories  
Write-Host "`n🔧 Consolidating utility directories..." -ForegroundColor Yellow

if(Test-Path "utils" -and (Get-ChildItem "utils").Count -le 2) {
    Write-Host "   Moving minimal utils/ to lib/utils/" -ForegroundColor Cyan
    if(-not (Test-Path "lib/utils")) {
        New-Item -ItemType Directory "lib/utils" -Force | Out-Null
    }
    Get-ChildItem "utils" | ForEach-Object {
        Move-Item $_.FullName "lib/utils/" -Force -ErrorAction SilentlyContinue
    }
    Remove-Item "utils" -Recurse -Force -ErrorAction SilentlyContinue
}

# Keep shared/ and tools/ as they might have more content

# 5. Clean up minimal single-file directories
Write-Host "`n🗂️ Cleaning up minimal directories..." -ForegroundColor Yellow
$minimalDirs = @("ddos", "logs", "governance", "utt")
foreach($dir in $minimalDirs) {
    if(Test-Path $dir -and (Get-ChildItem $dir).Count -le 1) {
        $items = Get-ChildItem $dir
        if($items.Count -eq 1) {
            $file = $items[0]
            Write-Host "   Moving single file from $dir/ to docs/" -ForegroundColor Cyan
            Move-Item $file.FullName "docs/" -Force -ErrorAction SilentlyContinue
        }
        Remove-Item $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 6. Create cleaned directory structure report
Write-Host "`n📋 Final directory structure:" -ForegroundColor Green
Get-ChildItem -Directory | Where-Object { 
    $_.Name -ne "node_modules" -and 
    $_.Name -ne ".git" -and 
    $_.Name -ne ".next" -and
    $_.Name -ne "openmind"
} | Sort-Object Name | ForEach-Object {
    $count = (Get-ChildItem $_.FullName -ErrorAction SilentlyContinue).Count
    Write-Host "   📁 $($_.Name) ($count items)" -ForegroundColor White
}

Write-Host "`n✅ Directory cleanup completed!" -ForegroundColor Green
Write-Host "🚀 EuroWeb Ultra structure optimized!" -ForegroundColor Magenta
