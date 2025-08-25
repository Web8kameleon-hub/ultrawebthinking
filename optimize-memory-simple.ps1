# VS Code Memory Optimizer - Simple Version
# @author Ledjan Ahmati

Write-Host "VS Code Memory Optimizer Starting..." -ForegroundColor Cyan

# Get all VS Code processes
$codeProcesses = Get-Process Code -ErrorAction SilentlyContinue | Sort-Object WorkingSet -Descending

if ($codeProcesses) {
    Write-Host "Found $($codeProcesses.Count) VS Code processes" -ForegroundColor Yellow
    
    # Show current memory usage
    $totalMemoryMB = [math]::Round(($codeProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB, 2)
    Write-Host "Current total memory usage: $totalMemoryMB MB" -ForegroundColor Yellow
    
    # Kill processes using more than 600MB (keep main window)
    $heavyProcesses = $codeProcesses | Where-Object { $_.WorkingSet -gt 600MB -and $_.CPU -lt 100 }
    
    if ($heavyProcesses) {
        Write-Host "Killing $($heavyProcesses.Count) heavy processes..." -ForegroundColor Red
        
        foreach ($process in $heavyProcesses) {
            $memoryMB = [math]::Round($process.WorkingSet / 1MB, 2)
            try {
                Write-Host "Killing PID: $($process.Id) - Memory: $memoryMB MB" -ForegroundColor Red
                Stop-Process -Id $process.Id -Force
                Start-Sleep -Milliseconds 500
            } catch {
                Write-Host "Failed to kill process $($process.Id)" -ForegroundColor Red
            }
        }
    }
    
    # Clean VS Code cache
    Write-Host "Cleaning VS Code cache..." -ForegroundColor Cyan
    
    $cachePaths = @(
        "$env:APPDATA\Code\logs",
        "$env:APPDATA\Code\CachedExtensions", 
        "$env:TEMP\vscode-*"
    )
    
    foreach ($path in $cachePaths) {
        try {
            if (Test-Path $path) {
                Remove-Item $path -Recurse -Force -ErrorAction SilentlyContinue
                Write-Host "Cleaned: $path" -ForegroundColor Green
            }
        } catch {
            # Ignore errors
        }
    }
    
    Start-Sleep -Seconds 2
    
    # Show final memory usage
    $finalProcesses = Get-Process Code -ErrorAction SilentlyContinue
    if ($finalProcesses) {
        $finalMemoryMB = [math]::Round(($finalProcesses | Measure-Object WorkingSet -Sum).Sum / 1MB, 2)
        $saved = $totalMemoryMB - $finalMemoryMB
        Write-Host "Final memory usage: $finalMemoryMB MB (Saved: $saved MB)" -ForegroundColor Green
    }
    
} else {
    Write-Host "No VS Code processes found" -ForegroundColor Blue
}

# Force garbage collection
[System.GC]::Collect()
[System.GC]::WaitForPendingFinalizers()

Write-Host "Memory optimization complete!" -ForegroundColor Green
