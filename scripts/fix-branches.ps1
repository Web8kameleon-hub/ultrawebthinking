#!/usr/bin/env pwsh
# EuroWeb Ultra - Git Branch Management Script
# Rregullon dhe menaxhon degët e Git repository
# Author: AI Assistant | Version: Ultra 2.1.0

Write-Host "🌿 EuroWeb Ultra - Git Branch Manager" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Kontrollo nëse jemi në një Git repository
if (-not (Test-Path ".git")) {
    Write-Host "❌ Nuk është një Git repository!" -ForegroundColor Red
    exit 1
}

# Funksion për të pastruar degët lokale
function Repair-LocalBranches {
    Write-Host "🔧 Duke rregulluar degët lokale..." -ForegroundColor Yellow
    
    # Merr degën aktuale
    $currentBranch = git branch --show-current
    Write-Host "📍 Dega aktuale: $currentBranch" -ForegroundColor Green
    
    # Listo të gjitha degët lokale
    Write-Host "📋 Degët lokale:" -ForegroundColor Blue
    git branch -v
    
    # Fshi degët e merged
    Write-Host "🧹 Duke fshirë degët e merged..." -ForegroundColor Yellow
    $mergedBranches = git branch --merged | Where-Object { $_ -notmatch '\*' -and $_ -notmatch 'main|master|develop|dev' }
    
    if ($mergedBranches) {
        foreach ($branch in $mergedBranches) {
            $branchName = $branch.Trim()
            if ($branchName -and $branchName -ne $currentBranch) {
                Write-Host "  🗑️ Duke fshirë: $branchName" -ForegroundColor Red
                git branch -d $branchName
            }
        }
    } else {
        Write-Host "  ✅ Nuk ka degë të merged për t'u fshirë" -ForegroundColor Green
    }
}

# Funksion për të rregulluar remote branches
function Repair-RemoteBranches {
    Write-Host "🌐 Duke rregulluar remote branches..." -ForegroundColor Yellow
    
    # Prune remote references
    git remote prune origin
    
    # Listo remote branches
    Write-Host "📡 Remote branches:" -ForegroundColor Blue
    git branch -r
    
    # Sync me remote
    git fetch --prune
    
    Write-Host "  ✅ Remote branches u rregulluan" -ForegroundColor Green
}

# Funksion për të krijuar dege standard
function Create-StandardBranches {
    Write-Host "📝 Duke krijuar degë standard..." -ForegroundColor Yellow
    
    $standardBranches = @("develop", "staging", "hotfix", "feature/base")
    
    foreach ($branch in $standardBranches) {
        $exists = git branch --list $branch
        if (-not $exists) {
            Write-Host "  ➕ Duke krijuar: $branch" -ForegroundColor Green
            git checkout -b $branch
            git checkout main 2>$null || git checkout master 2>$null
        } else {
            Write-Host "  ✅ Ekziston tashmë: $branch" -ForegroundColor Blue
        }
    }
}

# Funksion për të rregulluar commit-et
function Repair-Commits {
    Write-Host "🔨 Duke rregulluar commit-et..." -ForegroundColor Yellow
    
    # Kontrollo për uncommitted changes
    $status = git status --porcelain
    if ($status) {
        Write-Host "  ⚠️ Ka ndryshime të pa-commit-uara:" -ForegroundColor Yellow
        git status --short
        
        $response = Read-Host "  Dëshiron t'i commit-osh? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            git add .
            $commitMessage = Read-Host "  Shkruaj commit message"
            if (-not $commitMessage) {
                $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            }
            git commit -m $commitMessage
            Write-Host "  ✅ Commit u krye: $commitMessage" -ForegroundColor Green
        }
    } else {
        Write-Host "  ✅ Nuk ka ndryshime të pa-commit-uara" -ForegroundColor Green
    }
    
    # Kontrollo për unpushed commits
    $unpushed = git log --oneline origin/$(git branch --show-current)..HEAD 2>$null
    if ($unpushed) {
        Write-Host "  📤 Ka commit-e të pa-push-uar:" -ForegroundColor Yellow
        Write-Host $unpushed -ForegroundColor White
        
        $response = Read-Host "  Dëshiron t'i push-osh? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            git push origin $(git branch --show-current)
            Write-Host "  ✅ Push u krye" -ForegroundColor Green
        }
    }
}

# Funksion për të rregulluar tags
function Repair-Tags {
    Write-Host "🏷️ Duke rregulluar tags..." -ForegroundColor Yellow
    
    # Fetch tags
    git fetch --tags
    
    # Listo tags
    $tags = git tag -l
    if ($tags) {
        Write-Host "  📋 Tags ekzistues:" -ForegroundColor Blue
        $tags | ForEach-Object { Write-Host "    📌 $_" -ForegroundColor Cyan }
    } else {
        Write-Host "  ℹ️ Nuk ka tags" -ForegroundColor Gray
        
        # Krijo një tag initial
        $response = Read-Host "  Dëshiron të krijosh tag-un 'v1.0.0'? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            git tag -a v1.0.0 -m "Initial version tag"
            git push origin v1.0.0
            Write-Host "  ✅ Tag v1.0.0 u krijua dhe u push-ua" -ForegroundColor Green
        }
    }
}

# Funksion për të optimizuar repository
function Optimize-Repository {
    Write-Host "⚡ Duke optimizuar repository..." -ForegroundColor Yellow
    
    # Git garbage collection
    Write-Host "  🧹 Duke kryer garbage collection..." -ForegroundColor Blue
    git gc --aggressive --prune=now
    
    # Repack objects
    Write-Host "  📦 Duke re-pack-uar objects..." -ForegroundColor Blue
    git repack -ad
    
    # Update server info
    git update-server-info
    
    Write-Host "  ✅ Repository u optimizua" -ForegroundColor Green
}

# Funksion për të krijuar backup
function Create-Backup {
    Write-Host "💾 Duke krijuar backup..." -ForegroundColor Yellow
    
    $backupDir = "backup-$(Get-Date -Format 'yyyy-MM-dd-HH-mm-ss')"
    $currentDir = Split-Path -Leaf (Get-Location)
    
    # Krijo backup directory
    New-Item -ItemType Directory -Path "../$backupDir" -Force | Out-Null
    
    # Copy repository (pa .git)
    robocopy . "../$backupDir" /E /XD .git node_modules /XF .env* /NP /NFL /NDL
    
    Write-Host "  ✅ Backup u krijua në: ../$backupDir" -ForegroundColor Green
}

# Funksion kryesor për rregullimin e degëve
function Repair-AllBranches {
    Write-Host "🚀 Duke filluar rregullimin e plotë të degëve..." -ForegroundColor Green
    
    try {
        # 1. Backup
        Create-Backup
        
        # 2. Fetch latest changes
        Write-Host "📥 Duke fetch-uar ndryshimet e fundit..." -ForegroundColor Yellow
        git fetch --all --prune
        
        # 3. Rregullon degët lokale
        Repair-LocalBranches
        
        # 4. Rregullon remote branches
        Repair-RemoteBranches
        
        # 5. Krijo degë standard
        Create-StandardBranches
        
        # 6. Rregullon commit-et
        Repair-Commits
        
        # 7. Rregullon tags
        Repair-Tags
        
        # 8. Optimizon repository
        Optimize-Repository
        
        Write-Host "🎉 Rregullimi i degëve u krye me sukses!" -ForegroundColor Green
        
        # Trego statusin final
        Write-Host "`n📊 Statusi final:" -ForegroundColor Cyan
        Write-Host "=================" -ForegroundColor Cyan
        Write-Host "🌿 Degët lokale:" -ForegroundColor Blue
        git branch -v
        Write-Host "`n📡 Degët remote:" -ForegroundColor Blue
        git branch -r
        Write-Host "`n📍 Dega aktuale: $(git branch --show-current)" -ForegroundColor Green
        Write-Host "`n🏷️ Tags:" -ForegroundColor Blue
        git tag -l | ForEach-Object { Write-Host "  📌 $_" -ForegroundColor Cyan }
        
    } catch {
        Write-Host "❌ Gabim gjatë rregullimit: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Menu interaktiv
function Show-Menu {
    Write-Host "`n🔧 Zgjedh një opsion:" -ForegroundColor Yellow
    Write-Host "=====================" -ForegroundColor Yellow
    Write-Host "1. 🌿 Rregullon degët lokale"
    Write-Host "2. 📡 Rregullon remote branches"
    Write-Host "3. ➕ Krijo degë standard"
    Write-Host "4. 🔨 Rregullon commit-et"
    Write-Host "5. 🏷️ Rregullon tags"
    Write-Host "6. ⚡ Optimizon repository"
    Write-Host "7. 💾 Krijo backup"
    Write-Host "8. 🚀 Rregullim i plotë (e gjitha)"
    Write-Host "9. 📊 Trego statusin"
    Write-Host "0. ❌ Dil"
    Write-Host ""
}

# Trego statusin e Git repository
function Show-Status {
    Write-Host "📊 Git Repository Status" -ForegroundColor Cyan
    Write-Host "========================" -ForegroundColor Cyan
    
    Write-Host "📍 Dega aktuale: $(git branch --show-current)" -ForegroundColor Green
    Write-Host "`n🌿 Degët lokale:" -ForegroundColor Blue
    git branch -v
    Write-Host "`n📡 Degët remote:" -ForegroundColor Blue
    git branch -r
    Write-Host "`n📋 Statusi i repository:" -ForegroundColor Blue
    git status --short
    Write-Host "`n🏷️ Tags të fundit:" -ForegroundColor Blue
    git tag -l | Select-Object -Last 5 | ForEach-Object { Write-Host "  📌 $_" -ForegroundColor Cyan }
}

# Main execution
if ($args.Length -eq 0) {
    # Menu interaktiv
    do {
        Show-Menu
        $choice = Read-Host "Zgjedh opsionin (0-9)"
        
        switch ($choice) {
            "1" { Repair-LocalBranches }
            "2" { Repair-RemoteBranches }
            "3" { Create-StandardBranches }
            "4" { Repair-Commits }
            "5" { Repair-Tags }
            "6" { Optimize-Repository }
            "7" { Create-Backup }
            "8" { Repair-AllBranches }
            "9" { Show-Status }
            "0" { 
                Write-Host "👋 Mirupafshim!" -ForegroundColor Green
                break 
            }
            default { 
                Write-Host "❌ Opsion i pavlefshëm!" -ForegroundColor Red 
            }
        }
        
        if ($choice -ne "0") {
            Write-Host "`nShtyp Enter për të vazhduar..." -ForegroundColor Gray
            Read-Host
        }
        
    } while ($choice -ne "0")
} else {
    # Command line arguments
    switch ($args[0]) {
        "all" { Repair-AllBranches }
        "local" { Repair-LocalBranches }
        "remote" { Repair-RemoteBranches }
        "commits" { Repair-Commits }
        "tags" { Repair-Tags }
        "optimize" { Optimize-Repository }
        "backup" { Create-Backup }
        "status" { Show-Status }
        default {
            Write-Host "❌ Komandë e pavlefshme!" -ForegroundColor Red
            Write-Host "Përdorimi: .\fix-branches.ps1 [all|local|remote|commits|tags|optimize|backup|status]"
        }
    }
}

Write-Host "`n✅ Script perfundoi!" -ForegroundColor Green
