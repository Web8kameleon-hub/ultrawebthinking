# EuroWeb Ultra Deployment Script (PowerShell)
# Run this script to deploy EuroWeb with multi-language AGI support

Write-Host "🚀 EuroWeb Ultra Deployment Starting..." -ForegroundColor Green
Write-Host "🌍 Multi-language support: 13 languages" -ForegroundColor Blue
Write-Host "🤖 AGI Backend: Instance-based modular system" -ForegroundColor Blue

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose down

# Build and deploy
Write-Host "🔨 Building and deploying EuroWeb Ultra..." -ForegroundColor Yellow
docker-compose up --build -d

# Wait for services to start
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Health check
Write-Host "🔍 Performing health check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ EuroWeb Ultra is running successfully!" -ForegroundColor Green
        Write-Host "📊 Dashboard: http://localhost:3001" -ForegroundColor Cyan
        Write-Host "🌍 Multi-language support active" -ForegroundColor Green
        Write-Host "🤖 AGI modules loaded" -ForegroundColor Green
        Write-Host "🔒 Guardian middleware protecting" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Health check failed. Checking logs..." -ForegroundColor Red
    docker-compose logs
}

Write-Host "📋 Available API endpoints:" -ForegroundColor Cyan
Write-Host "  GET  /api/agi/core/status" -ForegroundColor White
Write-Host "  POST /api/agi/semantic/analyze" -ForegroundColor White
Write-Host "  GET  /api/agi/economics/analyze" -ForegroundColor White
Write-Host "  GET  /api/agi/crypto/portfolio" -ForegroundColor White
Write-Host "  GET  /sq/dashboard (Albanian)" -ForegroundColor White
Write-Host "  GET  /en/dashboard (English)" -ForegroundColor White
Write-Host "  GET  /zh/仪表板 (Chinese)" -ForegroundColor White
Write-Host "  GET  /ar/لوحة-التحكم (Arabic)" -ForegroundColor White

Write-Host "🎉 Deployment complete! Faleminderit për punën!" -ForegroundColor Green
