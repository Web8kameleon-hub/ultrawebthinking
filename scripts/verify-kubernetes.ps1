#!/usr/bin/env pwsh
# 🔍 Kubernetes Installation Verification Script
# 🧠 EuroWeb AGI Kubernetes Setup Checker

Write-Host "🔍 EuroWeb Kubernetes Verification" -ForegroundColor Cyan
Write-Host "🧠 Checking AGI-ready Kubernetes setup..." -ForegroundColor Green
Write-Host ""

# Check kubectl
Write-Host "⚡ Checking kubectl..." -ForegroundColor Yellow
try {
    $kubectlVersion = kubectl version --client --output=json 2>$null | ConvertFrom-Json
    Write-Host "✅ kubectl: v$($kubectlVersion.clientVersion.gitVersion)" -ForegroundColor Green
} catch {
    Write-Host "❌ kubectl not found or not working" -ForegroundColor Red
}

# Check Docker
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version 2>$null
    if ($dockerVersion) {
        Write-Host "✅ Docker: $dockerVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Docker not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Docker not found or not running" -ForegroundColor Red
    Write-Host "Please start Docker Desktop" -ForegroundColor Cyan
}

# Check Minikube
Write-Host "🎯 Checking Minikube..." -ForegroundColor Yellow
try {
    & "C:\Program Files\Kubernetes\Minikube\minikube.exe" version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Minikube: Available" -ForegroundColor Green
    } else {
        Write-Host "❌ Minikube not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Minikube not found in standard location" -ForegroundColor Red
}

# Check Helm
Write-Host "⚓ Checking Helm..." -ForegroundColor Yellow
try {
    $helmVersion = helm version --short 2>$null
    if ($helmVersion) {
        Write-Host "✅ Helm: $helmVersion" -ForegroundColor Green
    } else {
        Write-Host "❌ Helm not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Helm not found" -ForegroundColor Red
}

# Check K9s
Write-Host "🎮 Checking K9s..." -ForegroundColor Yellow
try {
    k9s version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ K9s: Available" -ForegroundColor Green
    } else {
        Write-Host "❌ K9s not found" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ K9s not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 Quick Start Commands:" -ForegroundColor Magenta
Write-Host "1. Start Minikube: minikube start" -ForegroundColor White
Write-Host "2. Check cluster: kubectl cluster-info" -ForegroundColor White
Write-Host "3. Open dashboard: minikube dashboard" -ForegroundColor White
Write-Host "4. Launch K9s UI: k9s" -ForegroundColor White
Write-Host ""
Write-Host "🧠 EuroWeb AGI Namespace:" -ForegroundColor Magenta
Write-Host "kubectl create namespace euroweb-agi" -ForegroundColor White
Write-Host "kubectl config set-context --current --namespace=euroweb-agi" -ForegroundColor White
Write-Host ""
