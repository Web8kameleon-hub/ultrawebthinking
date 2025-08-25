# EuroWeb Platform v9.0.1 - Docker Deployment Script (PowerShell)
# Ultra Modern Aviation & Office Suite
# Author: Ledjan Ahmati (100% Owner)
# Contact: dealsjona@gmail.com

param(
    [Parameter(Position=0)]
    [string]$Mode = "production"
)

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Cyan"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor $Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

Write-Host "🚀 EuroWeb Platform v9.0.1 - Docker Deployment" -ForegroundColor $Blue
Write-Host "===============================================" -ForegroundColor $Blue

# Check if Docker is running
try {
    docker info | Out-Null
} catch {
    Write-Error "Docker is not running. Please start Docker Desktop first."
    exit 1
}

switch ($Mode.ToLower()) {
    { $_ -in @("dev", "development") } {
        Write-Status "🔧 Starting EuroWeb Platform in DEVELOPMENT mode..."
        
        # Stop existing containers
        Write-Status "Stopping existing development containers..."
        docker-compose -f docker-compose.dev.yml down
        
        # Build and start development
        Write-Status "Building and starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build -d
        
        # Show logs
        Write-Success "✅ Development environment started!"
        Write-Status "📋 Viewing logs (Ctrl+C to exit)..."
        docker-compose -f docker-compose.dev.yml logs -f
    }
    
    { $_ -in @("prod", "production") } {
        Write-Status "🏭 Starting EuroWeb Platform in PRODUCTION mode..."
        
        # Stop existing containers
        Write-Status "Stopping existing production containers..."
        docker-compose down
        
        # Build production image
        Write-Status "Building production image..."
        docker build -f Dockerfile.production -t euroweb-platform:latest .
        
        # Start production
        Write-Status "Starting production environment..."
        docker-compose up -d
        
        Write-Success "✅ Production environment started!"
        Write-Status "🌐 Application available at: http://localhost:3000"
        Write-Status "💊 Health check: http://localhost:3000/api/health"
    }
    
    "stop" {
        Write-Status "🛑 Stopping all EuroWeb Platform containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        Write-Success "✅ All containers stopped!"
    }
    
    "logs" {
        Write-Status "📋 Showing logs for running containers..."
        $prodRunning = docker-compose ps | Select-String "Up"
        $devRunning = docker-compose -f docker-compose.dev.yml ps | Select-String "Up"
        
        if ($prodRunning) {
            docker-compose logs -f
        } elseif ($devRunning) {
            docker-compose -f docker-compose.dev.yml logs -f
        } else {
            Write-Warning "No running containers found."
        }
    }
    
    "health" {
        Write-Status "💊 Checking application health..."
        try {
            $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method Get
            Write-Success "✅ Application is healthy!"
            $response | ConvertTo-Json -Depth 3
        } catch {
            Write-Error "❌ Application health check failed!"
            exit 1
        }
    }
    
    default {
        Write-Host "🐳 EuroWeb Platform v9.0.1 - Docker Management" -ForegroundColor $Blue
        Write-Host ""
        Write-Host "Usage: .\deploy-docker.ps1 [command]" -ForegroundColor $Yellow
        Write-Host ""
        Write-Host "Commands:" -ForegroundColor $Yellow
        Write-Host "  dev|development  - Start development environment"
        Write-Host "  prod|production  - Start production environment (default)"
        Write-Host "  stop            - Stop all containers"
        Write-Host "  logs            - Show container logs"
        Write-Host "  health          - Check application health"
        Write-Host ""
        Write-Host "Examples:" -ForegroundColor $Green
        Write-Host "  .\deploy-docker.ps1 dev          # Start development with hot reload"
        Write-Host "  .\deploy-docker.ps1 prod         # Start production build"
        Write-Host "  .\deploy-docker.ps1 stop         # Stop everything"
        Write-Host "  .\deploy-docker.ps1 health       # Check if app is running"
        Write-Host ""
        exit 1
    }
}
