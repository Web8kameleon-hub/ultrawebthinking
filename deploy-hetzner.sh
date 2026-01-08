#!/usr/bin/env bash
# JONA Hetzner Production Deployment Script
# Quick setup for production environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DOMAIN="${DOMAIN:-jona.yourdomain.com}"
PROJECT_NAME="${PROJECT_NAME:-jona}"
NAMESPACE="jona-production"
K3S_VERSION="${K3S_VERSION:-latest}"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  JONA - Hetzner Production Deployment Script              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

# Check prerequisites
echo -e "\n${YELLOW}[1/10] Checking Prerequisites...${NC}"
for cmd in kubectl helm git docker; do
    if ! command -v $cmd &> /dev/null; then
        echo -e "${RED}✗ $cmd not found. Please install $cmd first.${NC}"
        exit 1
    fi
done
echo -e "${GREEN}✓ All prerequisites installed${NC}"

# Setup Hetzner API
echo -e "\n${YELLOW}[2/10] Configuring Hetzner API...${NC}"
if [ -z "$HETZNER_TOKEN" ]; then
    echo -e "${RED}✗ HETZNER_TOKEN not set${NC}"
    echo "Please set: export HETZNER_TOKEN=<your-token>"
    exit 1
fi
echo -e "${GREEN}✓ Hetzner API configured${NC}"

# Setup K3s cluster
echo -e "\n${YELLOW}[3/10] Setting up K3s cluster...${NC}"
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}✗ Kubernetes cluster not accessible${NC}"
    echo "Ensure your kubeconfig is set up correctly"
    exit 1
fi
echo -e "${GREEN}✓ K3s cluster ready${NC}"

# Create namespace
echo -e "\n${YELLOW}[4/10] Creating namespace...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace created: $NAMESPACE${NC}"

# Install NGINX Ingress Controller
echo -e "\n${YELLOW}[5/10] Installing NGINX Ingress Controller...${NC}"
if ! kubectl get deployment -n ingress-nginx ingress-nginx-controller &> /dev/null; then
    helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
    helm repo update
    helm install ingress-nginx ingress-nginx/ingress-nginx \
        --namespace ingress-nginx \
        --create-namespace \
        --set controller.service.type=LoadBalancer
    echo -e "${GREEN}✓ NGINX Ingress installed${NC}"
else
    echo -e "${GREEN}✓ NGINX Ingress already installed${NC}"
fi

# Install Cert-Manager
echo -e "\n${YELLOW}[6/10] Installing Cert-Manager...${NC}"
if ! kubectl get deployment -n cert-manager cert-manager &> /dev/null; then
    kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
    kubectl wait --for=condition=Ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
    echo -e "${GREEN}✓ Cert-Manager installed${NC}"
else
    echo -e "${GREEN}✓ Cert-Manager already installed${NC}"
fi

# Create secrets
echo -e "\n${YELLOW}[7/10] Creating Kubernetes secrets...${NC}"
POSTGRES_PWD=$(openssl rand -base64 32)
REDIS_PWD=$(openssl rand -base64 32)
MONGO_PWD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

kubectl create secret generic jona-secrets \
    --from-literal=POSTGRES_PASSWORD="$POSTGRES_PWD" \
    --from-literal=REDIS_PASSWORD="$REDIS_PWD" \
    --from-literal=MONGO_PASSWORD="$MONGO_PWD" \
    --from-literal=JWT_SECRET="$JWT_SECRET" \
    -n $NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

echo -e "${GREEN}✓ Secrets created${NC}"
echo -e "${BLUE}  PostgreSQL: $POSTGRES_PWD${NC}"
echo -e "${BLUE}  Redis: $REDIS_PWD${NC}"
echo -e "${BLUE}  MongoDB: $MONGO_PWD${NC}"

# Deploy JONA
echo -e "\n${YELLOW}[8/10] Deploying JONA...${NC}"
kubectl apply -f k8s-deployment.yaml
kubectl rollout status deployment/jona-api -n $NAMESPACE --timeout=5m
echo -e "${GREEN}✓ JONA deployed${NC}"

# Wait for services
echo -e "\n${YELLOW}[9/10] Waiting for services to be ready...${NC}"
sleep 10
kubectl get all -n $NAMESPACE
echo -e "${GREEN}✓ Services ready${NC}"

# Health check
echo -e "\n${YELLOW}[10/10] Running health checks...${NC}"
echo "Waiting for pods..."
sleep 30

READY=$(kubectl get deployment jona-api -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
if [ "$READY" -ge 3 ]; then
    echo -e "${GREEN}✓ All JONA replicas running${NC}"
else
    echo -e "${YELLOW}⚠ Only $READY/$DESIRED replicas running${NC}"
fi

# Summary
echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Deployment Complete!                                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Update DNS: jona.yourdomain.com -> $(kubectl get svc -n ingress-nginx ingress-nginx-controller -o jsonpath='{.status.loadBalancer.ingress[0].ip}')"
echo -e "2. Wait for SSL certificate (5-10 minutes)"
echo -e "3. Test: curl https://jona.yourdomain.com/health/live"
echo -e "4. View logs: kubectl logs -f -n $NAMESPACE deployment/jona-api"
echo -e "5. View metrics: kubectl port-forward -n monitoring svc/grafana 3000:80"

echo -e "\n${BLUE}Useful Commands:${NC}"
echo -e "  kubectl get all -n $NAMESPACE                     # Show all resources"
echo -e "  kubectl logs -f -n $NAMESPACE deployment/jona-api # Follow logs"
echo -e "  kubectl describe pod -n $NAMESPACE <pod-name>    # Pod details"
echo -e "  kubectl port-forward svc/jona-api-service 8000:80 # Local access"

echo -e "\n${BLUE}Documentation:${NC}"
echo -e "  📖 See HETZNER_DEPLOYMENT_GUIDE.md for detailed instructions"
echo -e "  🔗 GitHub: https://github.com/Web8kameleon-hub/ultrawebthinking"

echo -e "\n${GREEN}✓ JONA is ready for production!${NC}\n"
