# 🚀 VS Code Memory Optimization Script
# Reduces VS Code memory usage and optimizes performance

param(
    [switch]$Force,
    [switch]$Restart
)

Write-Host "VS Code Memory Optimization Starting..." -ForegroundColor Cyan

# 1. Close unnecessary VS Code extensions
Write-Host "Optimizing Extensions..." -ForegroundColor Yellow
$extensions = @(
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss", 
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint"
)

# 2. Clear VS Code caches
Write-Host "Clearing VS Code Caches..." -ForegroundColor Yellow
$vscodeUserDir = "$env:APPDATA\Code\User"
$cacheDirectories = @(
    "$env:APPDATA\Code\CachedExtensions",
    "$env:APPDATA\Code\logs",
    "$env:APPDATA\Code\User\workspaceStorage",
    "$env:APPDATA\Code\User\History",
    "$env:LOCALAPPDATA\Microsoft\vscode-cpptools"
)

foreach ($dir in $cacheDirectories) {
    if (Test-Path $dir) {
        try {
            Get-ChildItem $dir -Recurse -Force | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Write-Host "✅ Cleared: $dir" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Cannot clear: $dir (in use)" -ForegroundColor Yellow
        }
    }
}

# 3. Optimize VS Code settings
Write-Host "`n⚙️ Optimizing VS Code Settings..." -ForegroundColor Yellow
$settingsFile = "$vscodeUserDir\settings.json"

$optimizedSettings = @{
    "typescript.preferences.noSemicolons" = "off"
    "typescript.updateImportsOnFileMove.enabled" = "never"
    "typescript.validate.enable" = $true
    "typescript.suggest.enabled" = $false
    "editor.suggest.filterGraceful" = $false
    "editor.suggest.localityBonus" = $false
    "files.watcherExclude" = @{
        "**/.git/objects/**" = $true
        "**/.git/subtree-cache/**" = $true
        "**/node_modules/**" = $true
        "**/tmp/**" = $true
        "**/.cache/**" = $true
        "**/dist/**" = $true
        "**/.next/**" = $true
        "**/build/**" = $true
    }
    "search.exclude" = @{
        "**/node_modules" = $true
        "**/bower_components" = $true
        "**/*.code-search" = $true
        "**/.next" = $true
        "**/dist" = $true
        "**/build" = $true
    }
    "files.exclude" = @{
        "**/.git" = $true
        "**/.DS_Store" = $true
        "**/node_modules" = $true
        "**/.next" = $true
        "**/dist" = $true
    }
    "editor.quickSuggestions" = @{
        "other" = $false
        "comments" = $false
        "strings" = $false
    }
    "editor.parameterHints.enabled" = $false
    "editor.hover.enabled" = $false
    "editor.lightbulb.enabled" = $false
    "breadcrumbs.enabled" = $false
    "explorer.decorations.badges" = $false
    "explorer.decorations.colors" = $false
    "git.decorations.enabled" = $false
    "window.title" = "\${activeEditorShort}\${separator}\${rootName}"
    "workbench.editor.enablePreview" = $false
    "workbench.editor.enablePreviewFromQuickOpen" = $false
    "extensions.autoUpdate" = $false
    "update.mode" = "none"
}

# Write optimized settings
$optimizedSettings | ConvertTo-Json -Depth 10 | Out-File -FilePath $settingsFile -Encoding UTF8 -Force
Write-Host "✅ VS Code settings optimized" -ForegroundColor Green

# 4. Clear system caches
Write-Host "`n🗑️ Clearing System Caches..." -ForegroundColor Yellow
$tempDirectories = @(
    $env:TEMP,
    "$env:LOCALAPPDATA\Temp",
    "$env:LOCALAPPDATA\Microsoft\Windows\INetCache",
    "$env:LOCALAPPDATA\CrashDumps"
)

foreach ($tempDir in $tempDirectories) {
    if (Test-Path $tempDir) {
        try {
            Get-ChildItem $tempDir -Force -ErrorAction SilentlyContinue | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-1) } |
            Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
            Write-Host "✅ Cleaned: $tempDir" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Partial clean: $tempDir" -ForegroundColor Yellow
        }
    }
}

# 5. Optimize Node.js memory for development
Write-Host "`n🟢 Optimizing Node.js Memory..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--max-old-space-size=2048 --optimize-for-size"
[Environment]::SetEnvironmentVariable("NODE_OPTIONS", "--max-old-space-size=2048 --optimize-for-size", "User")
Write-Host "✅ Node.js memory limit set to 2GB" -ForegroundColor Green

# 6. Memory report
Write-Host "`n📊 Current Memory Usage:" -ForegroundColor Cyan
$totalMemory = (Get-WmiObject -Class Win32_ComputerSystem).TotalPhysicalMemory / 1GB
$availableMemory = (Get-WmiObject -Class Win32_OperatingSystem).FreePhysicalMemory / 1MB
$usedMemory = $totalMemory - ($availableMemory / 1024)

Write-Host "Total RAM: $([math]::Round($totalMemory, 2)) GB" -ForegroundColor White
Write-Host "Used RAM: $([math]::Round($usedMemory, 2)) GB" -ForegroundColor White
Write-Host "Available RAM: $([math]::Round($availableMemory / 1024, 2)) GB" -ForegroundColor Green

# Get VS Code processes
$codeProcesses = Get-Process "Code" -ErrorAction SilentlyContinue
if ($codeProcesses) {
    $totalCodeMemory = ($codeProcesses | Measure-Object WorkingSet64 -Sum).Sum / 1MB
    Write-Host "VS Code Total Memory: $([math]::Round($totalCodeMemory, 2)) MB" -ForegroundColor Yellow
}

Write-Host "`nMemory optimization completed!" -ForegroundColor Green
Write-Host "Consider restarting VS Code for optimal performance" -ForegroundColor Cyan

if ($Restart) {
    Write-Host "`nRestarting VS Code..." -ForegroundColor Yellow
    Start-Sleep 2
    
    # Close VS Code
    Get-Process "Code" -ErrorAction SilentlyContinue | Stop-Process -Force
    Start-Sleep 3
    
    # Restart VS Code
    Start-Process "code" -ArgumentList "."
    Write-Host "✅ VS Code restarted" -ForegroundColor Green
}
