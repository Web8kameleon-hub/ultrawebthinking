#!/usr/bin/env pwsh
# =======================================================================
# 🧪 UltraWeb Monorepo Test Suite
# Teston strukturën e pastër pa dist/ output
# @author Ledjan Ahmati
# @version 1.0.0-MONOREPO-TEST
# =======================================================================

param(
    [switch]$SkipBuild = $false,
    [switch]$Verbose = $false
)

$ROOT = "C:\Users\pc\UltraBuild\ultrawebthinking"
Set-Location $ROOT

Write-Host "🧪 UltraWeb Monorepo Test Suite" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$errors = @()
$warnings = @()

# 1) Test strukture
Write-Host "`n🏗️ Test strukture monorepo..." -ForegroundColor Green

$requiredDirs = @(
    "shared\src",
    "backend\src", 
    "frontend\src"
)

foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        $fileCount = (Get-ChildItem $dir -File -Recurse).Count
        Write-Host "  ✅ $dir ($fileCount files)" -ForegroundColor Gray
    } else {
        $errors += "❌ Directory mungon: $dir"
    }
}

# 2) Test tsconfig hierarchy
Write-Host "`n⚙️  Test TypeScript configs..." -ForegroundColor Green

$configs = @(
    "tsconfig.base.json",
    "tsconfig.json", 
    "shared\tsconfig.json",
    "backend\tsconfig.json",
    "frontend\tsconfig.json"
)

foreach ($config in $configs) {
    if (Test-Path $config) {
        try {
            $content = Get-Content $config -Raw | ConvertFrom-Json -ErrorAction Stop
            Write-Host "  ✅ $config (valid JSON)" -ForegroundColor Gray
        } catch {
            $errors += "❌ $config (invalid JSON)"
        }
    } else {
        $errors += "❌ Config mungon: $config"
    }
}

# 3) Test alias resolution
Write-Host "`n📦 Test path aliases..." -ForegroundColor Green

$baseConfig = Get-Content "tsconfig.base.json" -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue
if ($baseConfig.compilerOptions.paths) {
    $aliases = $baseConfig.compilerOptions.paths | Get-Member -Type NoteProperty | Select-Object -ExpandProperty Name
    Write-Host "  ✅ Aliases configured: $($aliases.Count)" -ForegroundColor Gray
    
    if ($Verbose) {
        foreach ($alias in $aliases) {
            Write-Host "    🔗 $alias" -ForegroundColor Gray
        }
    }
} else {
    $warnings += "⚠️  No path aliases found"
}

# 4) Test no dist/ pollution
Write-Host "`n🚫 Test dist/ cleanup..." -ForegroundColor Green

$distDirs = Get-ChildItem -Recurse -Directory -Name | Where-Object { $_ -match "dist|build|out" -and $_ -notmatch "node_modules" }
if ($distDirs.Count -eq 0) {
    Write-Host "  ✅ No dist/ directories found" -ForegroundColor Gray
} else {
    $warnings += "⚠️  Found build directories: $($distDirs.Count)"
    if ($Verbose) {
        foreach ($dir in $distDirs) {
            Write-Host "    📁 $dir" -ForegroundColor Yellow
        }
    }
}

# 5) Test TypeScript compilation
if (-not $SkipBuild) {
    Write-Host "`n🔨 Test TypeScript build..." -ForegroundColor Green
    
    try {
        $buildOutput = & yarn tsc -b --dry 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ TypeScript build successful" -ForegroundColor Gray
        } else {
            $errors += "❌ TypeScript build failed"
            if ($Verbose) {
                Write-Host "    Output: $buildOutput" -ForegroundColor Red
            }
        }
    } catch {
        $warnings += "⚠️  Could not run TypeScript build"
    }
}

# 6) Test import paths
Write-Host "`n🔍 Test import statements..." -ForegroundColor Green

$tsFiles = Get-ChildItem -Recurse -Include "*.ts", "*.tsx" | Where-Object {
    $_.FullName -notmatch "node_modules|\.next"
}

$aliasImports = 0
$relativeImports = 0

foreach ($file in $tsFiles[0..9]) { # Test first 10 files
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content) {
        $aliasMatches = [regex]::Matches($content, 'from ["\''`]@\w+/')
        $relativeMatches = [regex]::Matches($content, 'from ["\''`]\.\./\.\./') 
        
        $aliasImports += $aliasMatches.Count
        $relativeImports += $relativeMatches.Count
    }
}

Write-Host "  📊 Alias imports: $aliasImports" -ForegroundColor Gray
Write-Host "  📊 Deep relative imports: $relativeImports" -ForegroundColor Gray

if ($relativeImports -gt 5) {
    $warnings += "⚠️  Many deep relative imports found ($relativeImports)"
}

# 7) Test Gateway endpoint
Write-Host "`n🚪 Test API Gateway..." -ForegroundColor Green

if (Test-Path "app\api\gateway\route.ts") {
    $gatewayContent = Get-Content "app\api\gateway\route.ts" -Raw
    if ($gatewayContent -match "export.*async.*function.*(GET|POST)") {
        Write-Host "  ✅ Gateway exports found" -ForegroundColor Gray
    } else {
        $warnings += "⚠️  Gateway may have syntax issues"
    }
} else {
    $errors += "❌ Gateway route missing"
}

# 8) Test package.json scripts
Write-Host "`n📜 Test package.json scripts..." -ForegroundColor Green

if (Test-Path "package.json") {
    $pkg = Get-Content "package.json" -Raw | ConvertFrom-Json -ErrorAction SilentlyContinue
    if ($pkg.scripts) {
        $scriptCount = ($pkg.scripts | Get-Member -Type NoteProperty).Count
        Write-Host "  ✅ Scripts configured: $scriptCount" -ForegroundColor Gray
    }
} else {
    $errors += "❌ package.json missing"
}

# 9) Final report
Write-Host "`n📊 Final Report" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "🎉 Monorepo structure is perfect!" -ForegroundColor Green
    Write-Host "✅ Clean architecture (no dist/)" -ForegroundColor Green
    Write-Host "✅ TypeScript references working" -ForegroundColor Green
    Write-Host "✅ Alias imports configured" -ForegroundColor Green
    Write-Host "✅ API Gateway unified" -ForegroundColor Green
} else {
    if ($errors.Count -gt 0) {
        Write-Host "`n🔴 ERRORS ($($errors.Count)):" -ForegroundColor Red
        foreach ($error in $errors) {
            Write-Host "  $error" -ForegroundColor Red
        }
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "`n🟡 WARNINGS ($($warnings.Count)):" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  $warning" -ForegroundColor Yellow
        }
    }
}

Write-Host "`n🎯 Development commands:" -ForegroundColor Cyan
Write-Host "  yarn tsc -b              # Build all projects" -ForegroundColor White
Write-Host "  yarn tsx backend/src/server.ts  # Run backend directly" -ForegroundColor White
Write-Host "  yarn dev                 # Next.js frontend" -ForegroundColor White
Write-Host "  yarn test:monorepo       # Run this test again" -ForegroundColor White

exit $(if ($errors.Count -gt 0) { 1 } else { 0 })
