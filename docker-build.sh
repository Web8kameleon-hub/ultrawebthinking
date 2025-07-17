#!/bin/bash

# UltraWebThinking Web8 - Docker Build & Deploy Script
# Usage: ./docker-build.sh [dev|prod|clean]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="ultrawebthinking/web8"
VERSION="1.0.0"
CONTAINER_NAME="ultrawebthinking-web8"

print_banner() {
    echo -e "${BLUE}"
    echo "=================================================="
    echo "🧠 UltraWebThinking Web8 - Docker Manager"
    echo "=================================================="
    echo -e "${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

build_production() {
    print_info "Building production image..."
    
    # Build the Docker image
    docker build \
        --target runner \
        --tag $IMAGE_NAME:$VERSION \
        --tag $IMAGE_NAME:latest \
        --build-arg NODE_ENV=production \
        .
    
    print_success "Production image built successfully!"
}

build_development() {
    print_info "Building development environment..."
    
    docker-compose --profile dev build web8-dev
    docker-compose --profile dev up -d web8-dev
    
    print_success "Development environment is running at http://localhost:3001"
}

deploy_production() {
    print_info "Deploying production container..."
    
    # Stop existing container
    docker stop $CONTAINER_NAME 2>/dev/null || true
    docker rm $CONTAINER_NAME 2>/dev/null || true
    
    # Run new container
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p 3000:3000 \
        -e NODE_ENV=production \
        -e NEXT_TELEMETRY_DISABLED=1 \
        $IMAGE_NAME:latest
    
    print_success "Production container deployed at http://localhost:3000"
}

clean_docker() {
    print_warning "Cleaning Docker resources..."
    
    # Stop and remove containers
    docker-compose down --volumes --remove-orphans 2>/dev/null || true
    
    # Remove images
    docker rmi $IMAGE_NAME:$VERSION 2>/dev/null || true
    docker rmi $IMAGE_NAME:latest 2>/dev/null || true
    
    # Clean up build cache
    docker builder prune -f
    
    print_success "Docker resources cleaned!"
}

show_logs() {
    print_info "Showing container logs..."
    docker logs -f $CONTAINER_NAME
}

health_check() {
    print_info "Checking application health..."
    
    # Wait for container to be ready
    sleep 5
    
    # Check health endpoint
    if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
        print_success "Application is healthy!"
    else
        print_error "Application health check failed!"
        exit 1
    fi
}

main() {
    print_banner
    
    case "${1:-prod}" in
        "dev"|"development")
            build_development
            ;;
        "prod"|"production")
            build_production
            deploy_production
            health_check
            ;;
        "clean")
            clean_docker
            ;;
        "logs")
            show_logs
            ;;
        "health")
            health_check
            ;;
        *)
            echo "Usage: $0 [dev|prod|clean|logs|health]"
            echo ""
            echo "Commands:"
            echo "  dev     - Build and run development environment"
            echo "  prod    - Build and deploy production (default)"
            echo "  clean   - Clean all Docker resources"
            echo "  logs    - Show container logs"
            echo "  health  - Check application health"
            exit 1
            ;;
    esac
}

main "$@"
