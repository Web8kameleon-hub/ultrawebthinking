#!/usr/bin/env pwsh
# EuroWeb Ultra - Git Branch Management Script
# Author: AI Assistant

Write-Host "Git Branch Manager - EuroWeb Ultra" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Check if we're in a Git repository
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Not a Git repository!" -ForegroundColor Red
    exit 1
}

# Function to show current status
function Show-GitStatus {
    Write-Host "Git Repository Status" -ForegroundColor Cyan
    Write-Host "=====================" -ForegroundColor Cyan
    
    $currentBranch = git branch --show-current
    Write-Host "Current branch: $currentBranch" -ForegroundColor Green
    
    Write-Host "`nLocal branches:" -ForegroundColor Blue
    git branch -v
    
    Write-Host "`nRemote branches:" -ForegroundColor Blue
    git branch -r
    
    Write-Host "`nRepository status:" -ForegroundColor Blue
    git status --short
    
    Write-Host "`nRecent tags:" -ForegroundColor Blue
    $tags = git tag -l | Select-Object -Last 5
    if ($tags) {
        $tags | ForEach-Object { Write-Host "  Tag: $_" -ForegroundColor Cyan }
    } else {
        Write-Host "  No tags found" -ForegroundColor Gray
    }
}

# Function to clean local branches
function Clean-LocalBranches {
    Write-Host "Cleaning local branches..." -ForegroundColor Yellow
    
    $currentBranch = git branch --show-current
    Write-Host "Current branch: $currentBranch" -ForegroundColor Green
    
    # Delete merged branches
    Write-Host "Deleting merged branches..." -ForegroundColor Yellow
    $mergedBranches = git branch --merged | Where-Object { 
        $_ -notmatch '\*' -and 
        $_ -notmatch 'main' -and 
        $_ -notmatch 'master' -and 
        $_ -notmatch 'develop' -and 
        $_ -notmatch 'dev' 
    }
    
    if ($mergedBranches) {
        foreach ($branch in $mergedBranches) {
            $branchName = $branch.Trim()
            if ($branchName -and $branchName -ne $currentBranch) {
                Write-Host "  Deleting: $branchName" -ForegroundColor Red
                git branch -d $branchName
            }
        }
    } else {
        Write-Host "  No merged branches to delete" -ForegroundColor Green
    }
}

# Function to clean remote branches
function Clean-RemoteBranches {
    Write-Host "Cleaning remote branches..." -ForegroundColor Yellow
    
    # Prune remote references
    git remote prune origin
    
    # Fetch with prune
    git fetch --prune
    
    Write-Host "  Remote branches cleaned" -ForegroundColor Green
}

# Function to handle uncommitted changes
function Handle-UncommittedChanges {
    Write-Host "Checking for uncommitted changes..." -ForegroundColor Yellow
    
    $status = git status --porcelain
    if ($status) {
        Write-Host "  Found uncommitted changes:" -ForegroundColor Yellow
        git status --short
        
        $response = Read-Host "  Commit these changes? (y/n)"
        if ($response -eq 'y' -or $response -eq 'Y') {
            git add .
            $commitMessage = Read-Host "  Enter commit message"
            if (-not $commitMessage) {
                $commitMessage = "Auto-commit: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
            }
            git commit -m $commitMessage
            Write-Host "  Changes committed: $commitMessage" -ForegroundColor Green
        }
    } else {
        Write-Host "  No uncommitted changes" -ForegroundColor Green
    }
}

# Function to optimize repository
function Optimize-GitRepository {
    Write-Host "Optimizing repository..." -ForegroundColor Yellow
    
    # Git garbage collection
    Write-Host "  Running garbage collection..." -ForegroundColor Blue
    git gc --aggressive --prune=now
    
    # Repack objects
    Write-Host "  Repacking objects..." -ForegroundColor Blue
    git repack -ad
    
    Write-Host "  Repository optimized" -ForegroundColor Green
}

# Main repair function
function Repair-AllBranches {
    Write-Host "Starting complete branch repair..." -ForegroundColor Green
    
    try {
        # Fetch latest changes
        Write-Host "Fetching latest changes..." -ForegroundColor Yellow
        git fetch --all --prune
        
        # Handle uncommitted changes
        Handle-UncommittedChanges
        
        # Clean local branches
        Clean-LocalBranches
        
        # Clean remote branches
        Clean-RemoteBranches
        
        # Optimize repository
        Optimize-GitRepository
        
        Write-Host "Branch repair completed successfully!" -ForegroundColor Green
        
        # Show final status
        Write-Host "`nFinal status:" -ForegroundColor Cyan
        Show-GitStatus
        
    } catch {
        Write-Host "ERROR during repair: $($_.Exception.Message)" -ForegroundColor Red
        exit 1
    }
}

# Menu function
function Show-Menu {
    Write-Host "`nSelect an option:" -ForegroundColor Yellow
    Write-Host "=================" -ForegroundColor Yellow
    Write-Host "1. Show Git status"
    Write-Host "2. Clean local branches"
    Write-Host "3. Clean remote branches"
    Write-Host "4. Handle uncommitted changes"
    Write-Host "5. Optimize repository"
    Write-Host "6. Complete repair (all above)"
    Write-Host "0. Exit"
    Write-Host ""
}

# Main execution
if ($args.Length -eq 0) {
    # Interactive menu
    do {
        Show-Menu
        $choice = Read-Host "Choose option (0-6)"
        
        switch ($choice) {
            "1" { Show-GitStatus }
            "2" { Clean-LocalBranches }
            "3" { Clean-RemoteBranches }
            "4" { Handle-UncommittedChanges }
            "5" { Optimize-GitRepository }
            "6" { Repair-AllBranches }
            "0" { 
                Write-Host "Goodbye!" -ForegroundColor Green
                break 
            }
            default { 
                Write-Host "Invalid option!" -ForegroundColor Red 
            }
        }
        
        if ($choice -ne "0") {
            Write-Host "`nPress Enter to continue..." -ForegroundColor Gray
            Read-Host
        }
        
    } while ($choice -ne "0")
} else {
    # Command line arguments
    switch ($args[0]) {
        "all" { Repair-AllBranches }
        "local" { Clean-LocalBranches }
        "remote" { Clean-RemoteBranches }
        "commits" { Handle-UncommittedChanges }
        "optimize" { Optimize-GitRepository }
        "status" { Show-GitStatus }
        default {
            Write-Host "Invalid command!" -ForegroundColor Red
            Write-Host "Usage: .\fix-branches.ps1 [all|local|remote|commits|optimize|status]"
        }
    }
}

Write-Host "`nScript completed!" -ForegroundColor Green
