#!/bin/bash
set -euo pipefail

# JONA Kubernetes Deployment Script
# Enterprise-grade production deployment on Hetzner K3s

NAMESPACE="jona-production"
MANIFEST_FILE="k8s-production.yaml"
HETZNER_IP="${HETZNER_IP:-46.224.203.89}"
MAX_RETRIES=5
RETRY_INTERVAL=10

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

log_error() {
    echo -e "${RED}[✗]${NC} $1"
}

# Pre-flight checks
preflight_checks() {
    log_info "Running pre-flight checks..."
    
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Install kubectl first."
        exit 1
    fi
    log_success "kubectl found: $(kubectl version --short --client)"
    
    if ! kubectl cluster-info &> /dev/null; then
        log_error "Cannot connect to Kubernetes cluster"
        exit 1
    fi
    log_success "Connected to Kubernetes cluster"
    
    if [ ! -f "$MANIFEST_FILE" ]; then
        log_error "Manifest file $MANIFEST_FILE not found"
        exit 1
    fi
    log_success "Manifest file found"
}

# Create namespace
create_namespace() {
    log_info "Creating/verifying namespace: $NAMESPACE"
    
    if kubectl get namespace "$NAMESPACE" &> /dev/null; then
        log_warning "Namespace $NAMESPACE already exists"
    else
        kubectl create namespace "$NAMESPACE"
        log_success "Namespace created: $NAMESPACE"
    fi
}

# Apply manifests
apply_manifests() {
    log_info "Applying Kubernetes manifests..."
    
    kubectl apply -f "$MANIFEST_FILE"
    log_success "Manifests applied"
}

# Wait for deployments
wait_for_deployments() {
    local retry=0
    
    log_info "Waiting for deployments to be ready..."
    
    while [ $retry -lt $MAX_RETRIES ]; do
        if kubectl rollout status deployment/jona-api -n "$NAMESPACE" --timeout=120s 2>/dev/null; then
            log_success "JONA API deployment ready"
            return 0
        fi
        
        retry=$((retry + 1))
        if [ $retry -lt $MAX_RETRIES ]; then
            log_warning "Deployment not ready, retrying ($retry/$MAX_RETRIES)..."
            sleep $RETRY_INTERVAL
        fi
    done
    
    log_error "Deployment did not become ready within timeout"
    return 1
}

# Wait for services
wait_for_services() {
    log_info "Waiting for services to be ready..."
    
    # Wait for PostgreSQL
    kubectl wait --for=condition=ready pod \
        -l app=postgres \
        -n "$NAMESPACE" \
        --timeout=300s 2>/dev/null || log_warning "PostgreSQL pod not ready"
    
    # Wait for Redis
    kubectl wait --for=condition=ready pod \
        -l app=redis \
        -n "$NAMESPACE" \
        --timeout=300s 2>/dev/null || log_warning "Redis pod not ready"
    
    log_success "Services ready"
}

# Verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    echo ""
    log_info "Pods status:"
    kubectl get pods -n "$NAMESPACE" -o wide
    
    echo ""
    log_info "Services status:"
    kubectl get svc -n "$NAMESPACE" -o wide
    
    echo ""
    log_info "Ingress status:"
    kubectl get ingress -n "$NAMESPACE" -o wide
    
    echo ""
    log_info "PersistentVolumeClaims:"
    kubectl get pvc -n "$NAMESPACE" -o wide
    
    echo ""
    log_info "StorageClasses:"
    kubectl get storageclass
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    # Get API pod
    local api_pod=$(kubectl get pod -n "$NAMESPACE" -l app=jona-api -o jsonpath='{.items[0].metadata.name}' 2>/dev/null)
    
    if [ -z "$api_pod" ]; then
        log_warning "No API pod found"
        return 1
    fi
    
    log_info "Testing API pod: $api_pod"
    
    # Check if pod is running
    local pod_status=$(kubectl get pod "$api_pod" -n "$NAMESPACE" -o jsonpath='{.status.phase}')
    if [ "$pod_status" = "Running" ]; then
        log_success "API pod is running"
    else
        log_warning "API pod status: $pod_status"
    fi
    
    # Get pod logs (last 10 lines)
    echo ""
    log_info "Recent pod logs:"
    kubectl logs "$api_pod" -n "$NAMESPACE" --tail=10 2>/dev/null || log_warning "Could not fetch logs"
}

# Rollback function
rollback_deployment() {
    log_warning "Rolling back deployment..."
    
    kubectl rollout undo deployment/jona-api -n "$NAMESPACE"
    log_success "Rollback completed"
}

# Main deployment
main() {
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║   JONA Production Deployment                      ║"
    echo "║   Enterprise-grade Kubernetes on Hetzner          ║"
    echo "╚═══════════════════════════════════════════════════╝"
    echo ""
    
    preflight_checks
    create_namespace
    apply_manifests
    wait_for_services
    wait_for_deployments
    verify_deployment
    health_check
    
    echo ""
    echo "╔═══════════════════════════════════════════════════╗"
    echo "║   ✓ Deployment Successful!                        ║"
    echo "╚═══════════════════════════════════════════════════╝"
    echo ""
    echo "Next steps:"
    echo "1. Configure DNS: jona.yourdomain.com → $HETZNER_IP"
    echo "2. Wait for DNS propagation (~5-10 minutes)"
    echo "3. Access dashboard: https://jona.yourdomain.com"
    echo "4. Monitor with: kubectl logs -f deployment/jona-api -n $NAMESPACE"
    echo ""
}

# Error handling
trap 'log_error "Deployment failed"; rollback_deployment' ERR

main "$@"
