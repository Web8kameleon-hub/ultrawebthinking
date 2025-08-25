# EMERGENCY MEMORY CLEANUP
# Ultra-aggressive memory optimization

Write-Host "EMERGENCY MEMORY CLEANUP STARTING..." -ForegroundColor Red

# 1. Stop heavy VS Code processes (keep main one)
Write-Host "Stopping heavy VS Code processes..." -ForegroundColor Yellow
$codeProcesses = Get-Process "Code" | Sort-Object WorkingSet64 -Descending
$mainProcess = $codeProcesses | Select-Object -First 1
$heavyProcesses = $codeProcesses | Select-Object -Skip 1 | Where-Object { $_.WorkingSet64 -gt 200MB }

foreach ($process in $heavyProcesses) {
    try {
        $memoryMB = [math]::Round($process.WorkingSet64/1MB, 2)
        Write-Host "Stopping Code process $($process.Id) ($memoryMB MB)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force
    } catch {
        Write-Host "Cannot stop process $($process.Id)" -ForegroundColor Red
    }
}

# 2. Clear all possible caches
Write-Host "Aggressive cache cleanup..." -ForegroundColor Yellow
$cachePaths = @(
    "$env:LOCALAPPDATA\Microsoft\Windows\WebCache",
    "$env:LOCALAPPDATA\Microsoft\Windows\INetCache",
    "$env:APPDATA\Code\User\workspaceStorage",
    "$env:APPDATA\Code\CachedExtensions",
    "$env:APPDATA\npm-cache",
    "$env:USERPROFILE\.npm",
    "$env:LOCALAPPDATA\yarn\cache",
    "$env:LOCALAPPDATA\pnpm\cache"
)

foreach ($path in $cachePaths) {
    if (Test-Path $path) {
        try {
            Remove-Item "$path\*" -Recurse -Force -ErrorAction SilentlyContinue
            Write-Host "Cleared: $path" -ForegroundColor Green
        } catch {
            Write-Host "Partial clear: $path" -ForegroundColor Yellow
        }
    }
}

# 3. Force garbage collection
Write-Host "Forcing garbage collection..." -ForegroundColor Yellow
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()
[System.GC]::Collect()

# 4. Empty working sets of all processes
Write-Host "Optimizing working sets..." -ForegroundColor Yellow
Get-Process | ForEach-Object {
    try {
        $_.WorkingSet = -1
    } catch {
        # Ignore errors
    }
}

# 5. Stop non-essential services temporarily
Write-Host "Stopping non-essential services..." -ForegroundColor Yellow
$services = @(
    "WSearch",  # Windows Search
    "SysMain",  # Superfetch
    "Themes"    # Themes service
)

foreach ($service in $services) {
    try {
        Stop-Service $service -Force -ErrorAction SilentlyContinue
        Write-Host "Stopped service: $service" -ForegroundColor Green
    } catch {
        Write-Host "Cannot stop service: $service" -ForegroundColor Yellow
    }
}

# 6. Check memory status
Write-Host "Memory status after cleanup:" -ForegroundColor Cyan
$totalMemory = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB
$availableMemory = (Get-WmiObject -Class Win32_OperatingSystem).FreePhysicalMemory / 1MB
$usedMemory = $totalMemory - ($availableMemory / 1024)

Write-Host "Total RAM: $([math]::Round($totalMemory, 2)) GB" -ForegroundColor White
Write-Host "Used RAM: $([math]::Round($usedMemory, 2)) GB" -ForegroundColor White  
Write-Host "Available RAM: $([math]::Round($availableMemory / 1024, 2)) GB" -ForegroundColor Green

if ($availableMemory -lt 500) {
    Write-Host "WARNING: Still very low memory!" -ForegroundColor Red
    Write-Host "Recommend reboot for full cleanup" -ForegroundColor Yellow
} else {
    Write-Host "Memory optimization successful!" -ForegroundColor Green
}

Write-Host "EMERGENCY CLEANUP COMPLETED" -ForegroundColor Green
