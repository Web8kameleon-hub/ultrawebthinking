#!/bin/bash
# JONA - Production Deployment on Hetzner K3s

set -e

DOMAIN="${1:-jona.yourdomain.com}"
NAMESPACE="jona-production"
IMAGE_REGISTRY="ghcr.io/web8kameleon-hub/jona"
IMAGE_TAG="${2:-latest}"

# Colors
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  JONA - Production Deployment                             ║${NC}"
echo -e "${BLUE}║  Domain: $DOMAIN                                          ║${NC}"
echo -e "${BLUE}║  Image: $IMAGE_REGISTRY:$IMAGE_TAG                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"

export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Step 1: Create namespace
echo -e "\n${YELLOW}[1/7] Creating namespace...${NC}"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -
echo -e "${GREEN}✓ Namespace: $NAMESPACE${NC}"

# Step 2: Generate secrets
echo -e "\n${YELLOW}[2/7] Generating secrets...${NC}"
POSTGRES_PWD=$(openssl rand -base64 32)
REDIS_PWD=$(openssl rand -base64 32)
MONGO_PWD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

cat > /tmp/secrets.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: jona-secrets
  namespace: $NAMESPACE
type: Opaque
stringData:
  DATABASE_URL: "postgresql://jona:\${POSTGRES_PWD}@postgres-service:5432/jona_db"
  REDIS_URL: "redis://:${REDIS_PWD}@redis-service:6379/0"
  MONGO_URL: "mongodb://jona:${MONGO_PWD}@mongo-service:27017"
  JWT_SECRET: "${JWT_SECRET}"
  POSTGRES_PASSWORD: "${POSTGRES_PWD}"
  REDIS_PASSWORD: "${REDIS_PWD}"
  MONGO_PASSWORD: "${MONGO_PWD}"
EOF

kubectl apply -f /tmp/secrets.yaml
echo -e "${GREEN}✓ Secrets created${NC}"

# Step 3: Create ConfigMap
echo -e "\n${YELLOW}[3/7] Creating ConfigMap...${NC}"
cat > /tmp/configmap.yaml <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: jona-config
  namespace: $NAMESPACE
data:
  ENV: "production"
  DEBUG: "false"
  LOG_LEVEL: "INFO"
  PYTHONUNBUFFERED: "1"
  DOMAIN: "$DOMAIN"
EOF

kubectl apply -f /tmp/configmap.yaml
echo -e "${GREEN}✓ ConfigMap created${NC}"

# Step 4: Apply K8s manifests
echo -e "\n${YELLOW}[4/7] Applying Kubernetes manifests...${NC}"

# Download and apply manifests from GitHub
curl -fsSL https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/k8s-deployment.yaml \
  | sed "s|web8kameleon-hub/jona:latest|${IMAGE_REGISTRY}:${IMAGE_TAG}|g" \
  | sed "s|jona.yourdomain.com|${DOMAIN}|g" \
  | kubectl apply -f -

echo -e "${GREEN}✓ Manifests applied${NC}"

# Step 5: Wait for database
echo -e "\n${YELLOW}[5/7] Waiting for database...${NC}"
kubectl rollout status statefulset/postgres -n $NAMESPACE --timeout=5m || true
sleep 10
echo -e "${GREEN}✓ Database ready${NC}"

# Step 6: Wait for API
echo -e "\n${YELLOW}[6/7] Waiting for API deployment...${NC}"
kubectl rollout status deployment/jona-api -n $NAMESPACE --timeout=5m
echo -e "${GREEN}✓ API ready${NC}"

# Step 7: Verify deployment
echo -e "\n${YELLOW}[7/7] Verifying deployment...${NC}"
READY=$(kubectl get deployment jona-api -n $NAMESPACE -o jsonpath='{.status.readyReplicas}')
DESIRED=$(kubectl get deployment jona-api -n $NAMESPACE -o jsonpath='{.status.replicas}')

if [ "$READY" == "$DESIRED" ]; then
    echo -e "${GREEN}✓ All replicas running ($READY/$DESIRED)${NC}"
else
    echo -e "${YELLOW}⚠ Only $READY/$DESIRED replicas ready${NC}"
fi

echo -e "\n${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Deployment Complete!                                     ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${BLUE}📊 Deployment Summary:${NC}"
echo -e "  Namespace: ${YELLOW}$NAMESPACE${NC}"
echo -e "  Domain: ${YELLOW}$DOMAIN${NC}"
echo -e "  Image: ${YELLOW}$IMAGE_REGISTRY:$IMAGE_TAG${NC}"
echo -e "  Replicas: ${YELLOW}$READY/$DESIRED${NC}"

echo -e "\n${BLUE}🔒 Credentials (save securely):${NC}"
echo -e "  PostgreSQL Password: ${YELLOW}${POSTGRES_PWD:0:16}...${NC}"
echo -e "  Redis Password: ${YELLOW}${REDIS_PWD:0:16}...${NC}"
echo -e "  JWT Secret: ${YELLOW}${JWT_SECRET:0:16}...${NC}"

echo -e "\n${BLUE}📝 Check Status:${NC}"
echo -e "  ${YELLOW}kubectl get all -n $NAMESPACE${NC}"
echo -e "  ${YELLOW}kubectl logs -f -n $NAMESPACE deployment/jona-api${NC}"

echo -e "\n${BLUE}🔗 Access API:${NC}"
echo -e "  https://${YELLOW}$DOMAIN${NC}"
echo -e "  https://${YELLOW}$DOMAIN/health/live${NC}"
echo -e "  https://${YELLOW}$DOMAIN/api/eeg/status${NC}"

echo -e "\n${BLUE}⏳ Wait 5-10 minutes for SSL certificate...${NC}"
echo -e "  ${YELLOW}kubectl get certificate -n $NAMESPACE${NC}"

echo -e "\n✅ ${GREEN}JONA is running on Hetzner!${NC}\n"
