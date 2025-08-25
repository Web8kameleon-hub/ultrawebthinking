# Targeted ESLint error fixes - surgical approach
# Focus on the most common and safe fixes

Write-Host "Starting targeted ESLint fixes..." -ForegroundColor Green

$fixedCount = 0

# Fix 1: Remove async from simple return methods
Write-Host "Fixing async methods without await..." -ForegroundColor Yellow

$asyncFiles = @(
    "lib\agi\agi-intelligence.ts",
    "lib\billing\billing-engine.ts", 
    "lib\config\station-location-config.ts",
    "lib\governance\governance-engine.ts",
    "lib\metrics\live-metrics-collector.ts",
    "lib\observability\observability-engine.ts",
    "lib\security\ddos-shield.ts",
    "lib\security\post-quantum.ts",
    "lib\utt\albion-connection.ts",
    "lib\utt\index.ts",
    "lib\utt\phantom-integration.ts",
    "lib\utt\utt-audit.ts",
    "lib\utt\utt-bridge.ts",
    "lib\utt\utt-gateway.ts",
    "lib\utt\utt-physical.ts"
)

foreach ($file in $asyncFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        # Remove async from methods that just return values
        $content = $content -replace 'async\s+(\w+\s*\([^)]*\)\s*[^{]*\{\s*return\s+[^;]+;\s*\})', '$1'
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $fixedCount++
            Write-Host "Fixed async in: $file" -ForegroundColor Green
        }
    }
}

# Fix 2: Add underscore to specific unused variables
Write-Host "Fixing unused variables..." -ForegroundColor Yellow

$unusedVarFixes = @{
    "components\AGI\LoRaConnectEngineUltra.tsx" = @("setAlerts", "commands", "setCommands", "topology", "setTopology")
    "components\EuroMeshDashboard.tsx" = @("setMetrics", "selectedNodeData")
    "pages\ultra-dashboard.tsx" = @("security", "billing")
    "lib\ultra-cache.ts" = @("priority", "setError")
    "lib\realEngine.ts" = @("userInput")
}

foreach ($file in $unusedVarFixes.Keys) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        foreach ($varName in $unusedVarFixes[$file]) {
            $content = $content -replace "\b$varName\b", "_$varName"
        }
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $fixedCount++
            Write-Host "Fixed unused vars in: $file" -ForegroundColor Green
        }
    }
}

# Fix 3: Fix equality operators
Write-Host "Fixing equality operators..." -ForegroundColor Yellow

$equalityFiles = @("components\utils\index.ts")

foreach ($file in $equalityFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        $content = $content -replace '\s==\s', ' === '
        $content = $content -replace '\s!=\s', ' !== '
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $fixedCount++
            Write-Host "Fixed equality in: $file" -ForegroundColor Green
        }
    }
}

# Fix 4: Replace confirm with window.confirm
Write-Host "Fixing alert usage..." -ForegroundColor Yellow

$alertFiles = @("components\settings\Settings.tsx")

foreach ($file in $alertFiles) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        $originalContent = $content
        
        $content = $content -replace '\bconfirm\s*\(', 'window.confirm('
        
        if ($content -ne $originalContent) {
            Set-Content -Path $file -Value $content -NoNewline
            $fixedCount++
            Write-Host "Fixed confirm in: $file" -ForegroundColor Green
        }
    }
}

Write-Host "Completed targeted fixes on $fixedCount files!" -ForegroundColor Green
Write-Host "Running ESLint to check progress..." -ForegroundColor Cyan

# Check progress
& npx eslint . --ext .ts,.tsx --max-warnings 0 --quiet 2>&1 | Select-String "problems" | Select-Object -Last 1

Write-Host "Targeted fixing complete!" -ForegroundColor Green
