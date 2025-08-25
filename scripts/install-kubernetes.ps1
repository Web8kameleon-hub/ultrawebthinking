# 🚀 EuroWeb Kubernetes Installation Script
# 📦 Complete Kubernetes setup for Windows development
# 🧠 AGI-optimized container orchestration
#
# @author Ledjan Ahmati
# @version 8.0.0-K8S-SETUP
# @contact dealsjona@gmail.com

Write-Host "🚀 EuroWeb Kubernetes Installation Starting..." -ForegroundColor Cyan
Write-Host "📦 Installing Kubernetes ecosystem for AGI development" -ForegroundColor Green

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges!" -ForegroundColor Red
    Write-Host "🔧 Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "✅ Administrator privileges confirmed!" -ForegroundColor Green

# 1. Install Chocolatey (if not installed)
Write-Host "📦 Checking Chocolatey installation..." -ForegroundColor Yellow
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Host "📥 Installing Chocolatey package manager..." -ForegroundColor Cyan
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    refreshenv
    Write-Host "✅ Chocolatey installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✅ Chocolatey already installed!" -ForegroundColor Green
}

# 2. Install Docker Desktop (required for Kubernetes)
Write-Host "🐳 Installing Docker Desktop..." -ForegroundColor Yellow
try {
    choco install docker-desktop -y
    Write-Host "✅ Docker Desktop installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker Desktop installation failed or already installed" -ForegroundColor Yellow
}

# 3. Install kubectl (Kubernetes command-line tool)
Write-Host "⚡ Installing kubectl..." -ForegroundColor Yellow
try {
    choco install kubernetes-cli -y
    Write-Host "✅ kubectl installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ kubectl installation failed or already installed" -ForegroundColor Yellow
}

# 4. Install Minikube (local Kubernetes cluster)
Write-Host "🎯 Installing Minikube..." -ForegroundColor Yellow
try {
    choco install minikube -y
    Write-Host "✅ Minikube installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Minikube installation failed or already installed" -ForegroundColor Yellow
}

# 5. Install Kind (Kubernetes in Docker)
Write-Host "🔄 Installing Kind..." -ForegroundColor Yellow
try {
    choco install kind -y
    Write-Host "✅ Kind installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Kind installation failed or already installed" -ForegroundColor Yellow
}

# 6. Install Helm (Kubernetes package manager)
Write-Host "⚓ Installing Helm..." -ForegroundColor Yellow
try {
    choco install kubernetes-helm -y
    Write-Host "✅ Helm installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Helm installation failed or already installed" -ForegroundColor Yellow
}

# 7. Install K9s (Kubernetes CLI UI)
Write-Host "🎮 Installing K9s..." -ForegroundColor Yellow
try {
    choco install k9s -y
    Write-Host "✅ K9s installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ K9s installation failed or already installed" -ForegroundColor Yellow
}

# 8. Install Lens (Kubernetes IDE)
Write-Host "👁️ Installing Lens..." -ForegroundColor Yellow
try {
    choco install lens -y
    Write-Host "✅ Lens installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Lens installation failed or already installed" -ForegroundColor Yellow
}

# Refresh environment variables
Write-Host "🔄 Refreshing environment variables..." -ForegroundColor Yellow
refreshenv

# Wait for Docker to start
Write-Host "⏳ Waiting for Docker Desktop to start..." -ForegroundColor Yellow
Write-Host "🔧 Please start Docker Desktop manually if it's not running" -ForegroundColor Cyan
Start-Sleep -Seconds 10

# Verify installations
Write-Host "🔍 Verifying installations..." -ForegroundColor Yellow

Write-Host "📊 Checking Docker..." -ForegroundColor Cyan
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
}

Write-Host "📊 Checking kubectl..." -ForegroundColor Cyan
try {
    $kubectlVersion = kubectl version --client --short 2>$null
    Write-Host "✅ kubectl: $kubectlVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found" -ForegroundColor Red
}

Write-Host "📊 Checking Minikube..." -ForegroundColor Cyan
try {
    $minikubeVersion = minikube version --short 2>$null
    Write-Host "✅ Minikube: $minikubeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Minikube not found" -ForegroundColor Red
}

Write-Host "📊 Checking Kind..." -ForegroundColor Cyan
try {
    $kindVersion = kind version 2>$null
    Write-Host "✅ Kind: $kindVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Kind not found" -ForegroundColor Red
}

Write-Host "📊 Checking Helm..." -ForegroundColor Cyan
try {
    $helmVersion = helm version --short 2>$null
    Write-Host "✅ Helm: $helmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Helm not found" -ForegroundColor Red
}

Write-Host "📊 Checking K9s..." -ForegroundColor Cyan
try {
    $k9sVersion = k9s version 2>$null
    Write-Host "✅ K9s: $k9sVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ K9s not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎉 Kubernetes Installation Complete!" -ForegroundColor Green
Write-Host "🚀 EuroWeb Kubernetes ecosystem is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. 🐳 Start Docker Desktop if not running" -ForegroundColor White
Write-Host "2. 🎯 Run: minikube start" -ForegroundColor White
Write-Host "3. ⚡ Run: kubectl get nodes" -ForegroundColor White
Write-Host "4. 🎮 Run: k9s (for UI management)" -ForegroundColor White
Write-Host "5. 👁️ Open Lens for visual management" -ForegroundColor White
Write-Host ""
Write-Host "🧠 AGI-Ready Kubernetes Commands:" -ForegroundColor Magenta
Write-Host "   kubectl create namespace euroweb-agi" -ForegroundColor White
Write-Host "   kubectl config set-context --current --namespace=euroweb-agi" -ForegroundColor White
Write-Host ""

pause
