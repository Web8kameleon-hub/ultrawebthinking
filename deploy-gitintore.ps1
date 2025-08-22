# EuroWeb Ultra GitIntore Push Script
# PowerShell script for distributed deployment

param(
    [string]$Environment = "production",
    [switch]$SkipBuild,
    [switch]$LargeFiles,
    [switch]$Verify
)

Write-Host "🚀 EuroWeb Ultra GitIntore Deployment" -ForegroundColor Cyan
Write-Host "Environment: $Environment" -ForegroundColor Yellow

# 1. Prepare repository for GitIntore
function Prepare-GitIntoreRepo {
    Write-Host "📦 Preparing GitIntore repository..." -ForegroundColor Green
    
    # Check if Git LFS is installed
    try {
        git lfs version | Out-Null
        Write-Host "✅ Git LFS is available" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Git LFS not found. Installing..." -ForegroundColor Red
        # Download and install Git LFS
        Invoke-WebRequest -Uri "https://github.com/git-lfs/git-lfs/releases/download/v3.4.0/git-lfs-windows-amd64-v3.4.0.exe" -OutFile "git-lfs-installer.exe"
        Start-Process -FilePath "git-lfs-installer.exe" -ArgumentList "/S" -Wait
        Remove-Item "git-lfs-installer.exe"
        git lfs install
    }
    
    # Track large files with LFS
    git lfs track "*.node"
    git lfs track "*.dll" 
    git lfs track "*.exe"
    git lfs track ".next/**"
    git lfs track "node_modules/**"
    
    Write-Host "✅ GitIntore LFS tracking configured" -ForegroundColor Green
}

# 2. Build for production
function Build-Production {
    if (!$SkipBuild) {
        Write-Host "🔨 Building for production..." -ForegroundColor Green
        
        # Clean previous builds
        Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
        
        # Install dependencies
        npm ci --production=false
        
        # Build project
        npm run build
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Build completed successfully" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Build failed" -ForegroundColor Red
            exit 1
        }
    }
}

# 3. Commit core files
function Commit-CoreFiles {
    Write-Host "📝 Committing core application files..." -ForegroundColor Green
    
    # Add core source files
    git add *.json *.ts *.tsx *.js *.mjs *.md
    git add app/ components/ lib/ scripts/ styles/ types/
    git add .gitattributes .gitignore
    
    # Commit with comprehensive message
    $commitMessage = @"
🚀 EuroWeb Ultra v8.1.0 - Production Release

✅ Features:
• Albanian Document Suite (Word, Excel, Forms, Letters)
• AGI System Integration (Context, Memory, Assistant)  
• UTT Token Transfer System
• LoRa Network Integration
• Multi-language i18n Support
• Redis Caching System
• QR Code Generation

✅ Technical Stack:
• Next.js 14.2.30 with App Router
• TypeScript with strict mode
• React 18 Server Components
• Tailwind CSS styling
• Git LFS for large files

✅ Deployment Ready:
• Docker containerization
• Kubernetes manifests
• Vercel configuration
• Node.js distribution
• GitIntore large file management

Environment: $Environment
Build: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')
"@

    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Core files committed" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️ Nothing to commit or commit failed" -ForegroundColor Yellow
    }
}

# 4. Handle large files with GitIntore
function Push-LargeFiles {
    if ($LargeFiles) {
        Write-Host "📦 Processing large files for GitIntore..." -ForegroundColor Green
        
        # Add large files and directories
        git add node_modules/ -f
        git add .next/ -f
        git add styled-system/ -f
        
        # Commit large files separately
        git commit -m "📦 Large files and build outputs for GitIntore LFS

• node_modules with native binaries (129MB+)
• .next build outputs and chunks
• styled-system generated files
• All binary dependencies

GitIntore LFS: Enabled
Compression: Automatic
Distribution: Multi-node"
        
        Write-Host "✅ Large files prepared for GitIntore" -ForegroundColor Green
    }
}

# 5. Push to GitIntore
function Push-ToGitIntore {
    Write-Host "🌐 Pushing to GitIntore..." -ForegroundColor Green
    
    # Configure GitIntore remote (if not exists)
    $gitintoreRemote = git remote get-url gitintore 2>$null
    if (!$gitintoreRemote) {
        Write-Host "📡 Configuring GitIntore remote..." -ForegroundColor Yellow
        git remote add gitintore https://gitintore.com/Web8kameleon-hub/ultrawebthinking.git
    }
    
    # Push to GitIntore with LFS
    git push gitintore version-stabil --force-with-lease
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Successfully pushed to GitIntore" -ForegroundColor Green
    }
    else {
        Write-Host "❌ GitIntore push failed" -ForegroundColor Red
        exit 1
    }
}

# 6. Verify deployment
function Verify-Deployment {
    if ($Verify) {
        Write-Host "🔍 Verifying deployment..." -ForegroundColor Green
        
        # Check repository size
        $repoSize = (git count-objects -vH | Select-String "size-pack").ToString().Split()[-1]
        Write-Host "Repository size: $repoSize" -ForegroundColor Cyan
        
        # Check LFS objects
        $lfsObjects = git lfs ls-files | Measure-Object | Select-Object -ExpandProperty Count
        Write-Host "LFS objects: $lfsObjects" -ForegroundColor Cyan
        
        # Test build
        Write-Host "Testing production build..." -ForegroundColor Yellow
        npm run build --silent
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Deployment verification successful" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Deployment verification failed" -ForegroundColor Red
        }
    }
}

# Main execution
try {
    Prepare-GitIntoreRepo
    Build-Production
    Commit-CoreFiles  
    Push-LargeFiles
    Push-ToGitIntore
    Verify-Deployment
    
    Write-Host "🎉 GitIntore deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Access your deployment at: https://gitintore.com/Web8kameleon-hub/ultrawebthinking" -ForegroundColor Cyan
    
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
