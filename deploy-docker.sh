#!/bin/bash
# EuroWeb Platform v9.0.1 - Docker Deployment Script
# Ultra Modern Aviation & Office Suite
# Author: Ledjan Ahmati (100% Owner)
# Contact: dealsjona@gmail.com

set -e

echo "🚀 EuroWeb Platform v9.0.1 - Docker Deployment"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker first."
    exit 1
fi

# Parse command line arguments
MODE=${1:-production}

if [ "$MODE" = "dev" ] || [ "$MODE" = "development" ]; then
    print_status "🔧 Starting EuroWeb Platform in DEVELOPMENT mode..."
    
    # Stop existing containers
    print_status "Stopping existing development containers..."
    docker-compose -f docker-compose.dev.yml down
    
    # Build and start development
    print_status "Building and starting development environment..."
    docker-compose -f docker-compose.dev.yml up --build -d
    
    # Show logs
    print_success "✅ Development environment started!"
    print_status "📋 Viewing logs (Ctrl+C to exit)..."
    docker-compose -f docker-compose.dev.yml logs -f
    
elif [ "$MODE" = "prod" ] || [ "$MODE" = "production" ]; then
    print_status "🏭 Starting EuroWeb Platform in PRODUCTION mode..."
    
    # Stop existing containers
    print_status "Stopping existing production containers..."
    docker-compose down
    
    # Build production image
    print_status "Building production image..."
    docker build -f Dockerfile.production -t euroweb-platform:latest .
    
    # Start production
    print_status "Starting production environment..."
    docker-compose up -d
    
    print_success "✅ Production environment started!"
    print_status "🌐 Application available at: http://localhost:3000"
    print_status "💊 Health check: http://localhost:3000/api/health"
    
elif [ "$MODE" = "stop" ]; then
    print_status "🛑 Stopping all EuroWeb Platform containers..."
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
    print_success "✅ All containers stopped!"
    
elif [ "$MODE" = "logs" ]; then
    print_status "📋 Showing logs for running containers..."
    if docker-compose ps | grep -q "Up"; then
        docker-compose logs -f
    elif docker-compose -f docker-compose.dev.yml ps | grep -q "Up"; then
        docker-compose -f docker-compose.dev.yml logs -f
    else
        print_warning "No running containers found."
    fi
    
elif [ "$MODE" = "health" ]; then
    print_status "💊 Checking application health..."
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "✅ Application is healthy!"
        curl -s http://localhost:3000/api/health | jq '.'
    else
        print_error "❌ Application health check failed!"
        exit 1
    fi
    
else
    echo "🐳 EuroWeb Platform v9.0.1 - Docker Management"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  dev|development  - Start development environment"
    echo "  prod|production  - Start production environment (default)"
    echo "  stop            - Stop all containers"
    echo "  logs            - Show container logs"
    echo "  health          - Check application health"
    echo ""
    echo "Examples:"
    echo "  $0 dev          # Start development with hot reload"
    echo "  $0 prod         # Start production build"
    echo "  $0 stop         # Stop everything"
    echo "  $0 health       # Check if app is running"
    echo ""
    exit 1
fi
