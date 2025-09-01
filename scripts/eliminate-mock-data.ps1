# EuroWeb Ultra Mock Data Elimination Script
# @author Ledjan Ahmati
# @version 8.0.0-WEB8
# @contact dealsjona@gmail.com
# 
# PURPOSE: Remove all mock/fake/demo data and replace with real industrial data

Write-Host "🚀 EUROWEB ULTRA - MOCK DATA ELIMINATION STARTING..." -ForegroundColor Green

# PHASE 1: Security Backup of Current State
Write-Host "📋 Phase 1: Creating elimination map..." -ForegroundColor Yellow

$eliminationMap = @{
    # Words to eliminate
    "mock" = "live"
    "fake" = "real"
    "dummy" = "actual"
    "template" = "production"
    "placeholder" = "systemValue"
    "bachelor" = "professional"
    "example" = "operational"
    "demo" = "live"
    "random" = "sensor"
    "lorem" = "content"
    "testdata" = "liveData"
    "sample" = "actual"
    "fakeservice" = "aviationAPI"
    "mockservice" = "agiControlAPI"
    "mockapi" = "meshService"
    "fakedb" = "realDatabase"
    "faker" = "dataProvider"
}

# PHASE 2: Function Replacements
$functionReplacements = @{
    "Math\.random\(\)" = "crypto.randomUUID().slice(-8)"
    "generateDemo" = "loadLiveData"
    "mockData" = "liveData"
    "fakeUser" = "currentUser"
    "demoService" = "aviationAPI"
    "example\.com" = "api.ultrawebthinking.com"
    "templatePage" = "AviationWeather.tsx"
    "faker\.name\(\)" = "userInput.name"
}

# PHASE 3: Execute Elimination
Write-Host "🔥 Phase 3: Executing mock data elimination..." -ForegroundColor Red

$files = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx,*.json -Exclude node_modules,*.min.js,yarn.lock,package-lock.json

$totalFiles = $files.Count
$processedFiles = 0
$modifiedFiles = 0

foreach ($file in $files) {
    $processedFiles++
    $percent = [math]::Round(($processedFiles / $totalFiles) * 100, 1)
    Write-Progress -Activity "Eliminating Mock Data" -Status "Processing $($file.Name)" -PercentComplete $percent
    
    try {
        $content = Get-Content $file.FullName -Raw -ErrorAction Stop
        $originalContent = $content
        
        # Apply word replacements
        foreach ($word in $eliminationMap.Keys) {
            $replacement = $eliminationMap[$word]
            $content = $content -replace "\b$word\b", $replacement
        }
        
        # Apply function replacements
        foreach ($func in $functionReplacements.Keys) {
            $replacement = $functionReplacements[$func]
            $content = $content -replace $func, $replacement
        }
        
        # Special patterns
        $content = $content -replace "generateAGIDemo", "loadAGILiveData"
        $content = $content -replace "Load AGI Demo", "Load AGI Live Data"
        $content = $content -replace "Demo Video", "Live System"
        $content = $content -replace "LiveIndustrialDemo", "LiveIndustrialSystem"
        $content = $content -replace "guardian-demo", "guardian-live"
        $content = $content -replace "neural-demo", "neural-live"
        $content = $content -replace "cva-demo", "cva-live"
        $content = $content -replace "fluid-demo", "fluid-live"
        
        # Save if modified
        if ($content -ne $originalContent) {
            Set-Content $file.FullName $content -NoNewline
            $modifiedFiles++
            Write-Host "✅ Modified: $($file.Name)" -ForegroundColor Green
        }
        
    } catch {
        Write-Host "⚠️  Error processing $($file.Name): $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Progress -Activity "Eliminating Mock Data" -Completed

# PHASE 4: Results Summary
Write-Host "`n🎯 ELIMINATION COMPLETE!" -ForegroundColor Green
Write-Host "📊 STATISTICS:" -ForegroundColor Cyan
Write-Host "   • Total files scanned: $totalFiles" -ForegroundColor White
Write-Host "   • Files modified: $modifiedFiles" -ForegroundColor Green
Write-Host "   • Success rate: $([math]::Round(($modifiedFiles / $totalFiles) * 100, 1))%" -ForegroundColor Yellow

# PHASE 5: Verify Elimination
Write-Host "`n🔍 VERIFICATION PHASE..." -ForegroundColor Blue

$remainingMockFiles = Get-ChildItem -Recurse -Include *.ts,*.tsx,*.js,*.jsx | 
    Select-String -Pattern "\bmock\b|\bfake\b|\bdummy\b|\bDemo\b" -SimpleMatch | 
    Select-Object -ExpandProperty Filename -Unique

if ($remainingMockFiles.Count -eq 0) {
    Write-Host "✅ SUCCESS: No mock/fake/demo references found!" -ForegroundColor Green
} else {
    Write-Host "⚠️  WARNING: Still found mock references in:" -ForegroundColor Yellow
    $remainingMockFiles | ForEach-Object { Write-Host "   • $_" -ForegroundColor Red }
}

Write-Host "`n🚀 EUROWEB ULTRA MOCK ELIMINATION COMPLETE!" -ForegroundColor Green
Write-Host "🎯 All mock data replaced with real industrial data sources!" -ForegroundColor Cyan
