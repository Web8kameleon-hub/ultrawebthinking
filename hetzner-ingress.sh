#!/bin/bash
# JONA - NGINX Ingress & Cert-Manager Setup
# Run this after K3s is ready

set -e

DOMAIN="${1:-jona.yourdomain.com}"
EMAIL="${2:-admin@yourdomain.com}"

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  JONA - NGINX Ingress & Cert-Manager Setup               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Step 1: Install NGINX Ingress Controller
echo -e "\n${YELLOW}[1/4] Installing NGINX Ingress Controller...${NC}"
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.service.externalTrafficPolicy=Local \
  --wait

kubectl wait --for=condition=ready pod -l app.kubernetes.io/component=controller -n ingress-nginx --timeout=300s
echo -e "${GREEN}✓ NGINX Ingress installed${NC}"

# Step 2: Get LoadBalancer IP
echo -e "\n${YELLOW}[2/4] Waiting for LoadBalancer IP...${NC}"
sleep 10
INGRESS_IP=$(kubectl get svc ingress-nginx-controller -n ingress-nginx -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$INGRESS_IP" ]; then
    echo -e "${YELLOW}⚠ Using nodeport. Update DNS to: 46.224.203.89${NC}"
    INGRESS_IP="46.224.203.89"
fi

echo -e "${GREEN}✓ Ingress IP: $INGRESS_IP${NC}"
echo -e "${BLUE}  Update DNS: $DOMAIN A $INGRESS_IP${NC}"

# Step 3: Install Cert-Manager
echo -e "\n${YELLOW}[3/4] Installing Cert-Manager...${NC}"
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
kubectl wait --for=condition=Ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s
echo -e "${GREEN}✓ Cert-Manager installed${NC}"

# Step 4: Create ClusterIssuer for Let's Encrypt
echo -e "\n${YELLOW}[4/4] Creating Let's Encrypt ClusterIssuer...${NC}"
cat > /tmp/letsencrypt-issuer.yaml <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: $EMAIL
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
---
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-staging
spec:
  acme:
    server: https://acme-staging-v02.api.letsencrypt.org/directory
    email: $EMAIL
    privateKeySecretRef:
      name: letsencrypt-staging
    solvers:
    - http01:
        ingress:
          class: nginx
EOF

kubectl apply -f /tmp/letsencrypt-issuer.yaml
sleep 5
kubectl get clusterissuer
echo -e "${GREEN}✓ ClusterIssuer created${NC}"

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Setup Complete!                                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}Next Steps:${NC}"
echo -e "1. Update DNS: $DOMAIN A $INGRESS_IP"
echo -e "2. Wait 5 minutes for DNS propagation"
echo -e "3. Run: bash jona-deploy.sh"

echo -e "\n${BLUE}Verify Installation:${NC}"
echo -e "${YELLOW}kubectl get svc -n ingress-nginx${NC}"
echo -e "${YELLOW}kubectl get pods -n cert-manager${NC}"
echo -e "${YELLOW}kubectl get clusterissuer${NC}"
