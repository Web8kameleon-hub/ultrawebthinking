#!/bin/bash
set -euo pipefail

# JONA Hetzner Production Deployment Script
# One-command setup: Production K3s + Databases + Monitoring + Application

COLOR_BLUE='\033[0;34m'
COLOR_GREEN='\033[0;32m'
COLOR_YELLOW='\033[1;33m'
COLOR_RED='\033[0;31m'
NC='\033[0m'

log_info() { echo -e "${COLOR_BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${COLOR_GREEN}[✓]${NC} $1"; }
log_warning() { echo -e "${COLOR_YELLOW}[!]${NC} $1"; }
log_error() { echo -e "${COLOR_RED}[✗]${NC} $1"; }

# ============================================================================
# PHASE 1: System Preparation
# ============================================================================

log_info "PHASE 1: System Preparation"
log_info "Updating system packages..."

apt-get update -qq
apt-get upgrade -y -qq
apt-get install -y -qq curl wget git htop iotop sudo

log_success "System updated"

# ============================================================================
# PHASE 2: K3s Installation
# ============================================================================

log_info "PHASE 2: K3s Installation"

if ! command -v k3s &> /dev/null; then
    log_info "Installing K3s v1.34.3..."
    curl -sfL https://get.k3s.io | sh -s - \
        --write-kubeconfig-mode 644 \
        --disable traefik \
        --disable servicelb
    
    # Wait for K3s to be ready
    log_info "Waiting for K3s cluster to be ready..."
    for i in {1..60}; do
        if k3s kubectl get nodes &> /dev/null; then
            log_success "K3s cluster ready"
            break
        fi
        echo -n "."
        sleep 5
    done
else
    log_warning "K3s already installed"
fi

# Verify K3s
log_info "Verifying K3s installation..."
K3S_VERSION=$(k3s --version)
log_success "K3s version: $K3S_VERSION"

# ============================================================================
# PHASE 3: Storage Class Setup
# ============================================================================

log_info "PHASE 3: Storage Configuration"

k3s kubectl apply -f - <<'EOF'
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast
provisioner: kubernetes.io/host-path
allowVolumeExpansion: true
parameters:
  type: pd-ssd
EOF

log_success "Storage classes configured"

# ============================================================================
# PHASE 4: NGINX Ingress Installation
# ============================================================================

log_info "PHASE 4: NGINX Ingress Controller"

k3s kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

log_info "Waiting for NGINX Ingress to be ready..."
k3s kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

log_success "NGINX Ingress ready"

# ============================================================================
# PHASE 5: cert-manager Installation
# ============================================================================

log_info "PHASE 5: cert-manager for Let's Encrypt"

# Install cert-manager CRDs
k3s kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.crds.yaml

# Install cert-manager
helm repo add jetstack https://charts.jetstack.io
helm repo update
helm install cert-manager jetstack/cert-manager \
  --namespace cert-manager \
  --create-namespace \
  --version v1.13.0 \
  --set global.leaderElection.namespace=cert-manager

log_info "Waiting for cert-manager to be ready..."
k3s kubectl wait --for=condition=ready pod \
  -l app.kubernetes.io/instance=cert-manager \
  -n cert-manager \
  --timeout=120s

log_success "cert-manager ready"

# ============================================================================
# PHASE 6: Namespace & Secrets Setup
# ============================================================================

log_info "PHASE 6: Creating Production Namespace"

k3s kubectl create namespace jona-production 2>/dev/null || log_warning "Namespace already exists"

log_info "Creating secrets..."

# Generate secure random passwords
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

k3s kubectl create secret generic db-secret \
  --from-literal=postgres-password="$DB_PASSWORD" \
  --from-literal=redis-password="$REDIS_PASSWORD" \
  --from-literal=jwt-secret="$JWT_SECRET" \
  -n jona-production \
  2>/dev/null || log_warning "Secret already exists"

log_success "Secrets created"
echo "  PostgreSQL Password: $DB_PASSWORD" > /root/jona-secrets.txt
echo "  Redis Password: $REDIS_PASSWORD" >> /root/jona-secrets.txt
echo "  JWT Secret: $JWT_SECRET" >> /root/jona-secrets.txt

# ============================================================================
# PHASE 7: Deploy Monitoring Stack
# ============================================================================

log_info "PHASE 7: Deploying Monitoring Stack"

k3s kubectl apply -f - <<'EOF'
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: prometheus-pvc
  namespace: monitoring
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: prometheus
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: prometheus
  template:
    metadata:
      labels:
        app: prometheus
    spec:
      containers:
      - name: prometheus
        image: prom/prometheus:latest
        ports:
        - containerPort: 9090
        args:
          - '--config.file=/etc/prometheus/prometheus.yml'
          - '--storage.tsdb.path=/prometheus'
        volumeMounts:
        - name: storage
          mountPath: /prometheus
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: prometheus-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: prometheus
  namespace: monitoring
spec:
  selector:
    app: prometheus
  ports:
  - port: 9090
    targetPort: 9090
  type: ClusterIP

---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: grafana-pvc
  namespace: monitoring
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: grafana
  namespace: monitoring
spec:
  replicas: 1
  selector:
    matchLabels:
      app: grafana
  template:
    metadata:
      labels:
        app: grafana
    spec:
      containers:
      - name: grafana
        image: grafana/grafana:latest
        ports:
        - containerPort: 3000
        env:
        - name: GF_SECURITY_ADMIN_PASSWORD
          value: "admin123"
        volumeMounts:
        - name: storage
          mountPath: /var/lib/grafana
      volumes:
      - name: storage
        persistentVolumeClaim:
          claimName: grafana-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: grafana
  namespace: monitoring
spec:
  selector:
    app: grafana
  ports:
  - port: 3000
    targetPort: 3000
  type: ClusterIP
EOF

log_success "Monitoring stack deployed"

# ============================================================================
# PHASE 8: Deploy Databases
# ============================================================================

log_info "PHASE 8: Deploying Databases"

k3s kubectl apply -f - <<'EOF'
# PostgreSQL StatefulSet
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: jona-production
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: jona-production
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:16-alpine
        ports:
        - containerPort: 5432
        env:
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: postgres-password
        - name: PGDATA
          value: /var/lib/postgresql/data/pgdata
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: postgres-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: jona-production
spec:
  clusterIP: None
  selector:
    app: postgres
  ports:
  - port: 5432
    targetPort: 5432

---
# Redis StatefulSet
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: redis-pvc
  namespace: jona-production
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 10Gi

---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: redis
  namespace: jona-production
spec:
  serviceName: redis
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
      - name: redis
        image: redis:7-alpine
        ports:
        - containerPort: 6379
        command:
        - redis-server
        - "--requirepass"
        - $(REDIS_PASSWORD)
        env:
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: redis-password
        volumeMounts:
        - name: data
          mountPath: /data
        resources:
          requests:
            cpu: 100m
            memory: 256Mi
          limits:
            cpu: 250m
            memory: 512Mi
      volumes:
      - name: data
        persistentVolumeClaim:
          claimName: redis-pvc

---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: jona-production
spec:
  clusterIP: None
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6379
EOF

log_success "Databases deployed"

# Wait for databases
log_info "Waiting for databases to be ready..."
k3s kubectl wait --for=condition=ready pod \
  -l app=postgres \
  -n jona-production \
  --timeout=120s 2>/dev/null || log_warning "PostgreSQL taking longer to start..."

k3s kubectl wait --for=condition=ready pod \
  -l app=redis \
  -n jona-production \
  --timeout=120s 2>/dev/null || log_warning "Redis taking longer to start..."

# ============================================================================
# PHASE 9: Deploy JONA Application
# ============================================================================

log_info "PHASE 9: Deploying JONA Application"

JONA_VERSION="${JONA_VERSION:-latest}"

k3s kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: jona-api
  namespace: jona-production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: jona-api
  template:
    metadata:
      labels:
        app: jona-api
    spec:
      containers:
      - name: jona-api
        image: ghcr.io/web8kameleon-hub/jona:$JONA_VERSION
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 5000
        env:
        - name: ENVIRONMENT
          value: "production"
        - name: DATABASE_URL
          value: "postgresql://postgres:\$(POSTGRES_PASSWORD)@postgres:5432/jona_db"
        - name: REDIS_URL
          value: "redis://:$(REDIS_PASSWORD)@redis:6379"
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: jwt-secret
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: postgres-password
        - name: REDIS_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: redis-password
        resources:
          requests:
            cpu: 250m
            memory: 512Mi
          limits:
            cpu: 500m
            memory: 1Gi
        livenessProbe:
          httpGet:
            path: /health/live
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health/ready
            port: 5000
          initialDelaySeconds: 20
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: jona-api
  namespace: jona-production
spec:
  selector:
    app: jona-api
  ports:
  - port: 5000
    targetPort: 5000
  type: ClusterIP

---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: jona-api-hpa
  namespace: jona-production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: jona-api
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF

log_success "JONA application deployed"

# ============================================================================
# PHASE 10: Setup Ingress
# ============================================================================

log_info "PHASE 10: Setting up Ingress & SSL"

# Get server IP
SERVER_IP=$(hostname -I | awk '{print $1}')

k3s kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@jona.local
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: jona-ingress
  namespace: jona-production
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - jona.yourdomain.com
    secretName: jona-tls
  rules:
  - host: jona.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: jona-api
            port:
              number: 5000
      - path: /monitoring
        pathType: Prefix
        backend:
          service:
            name: prometheus
            port:
              number: 9090
      - path: /grafana
        pathType: Prefix
        backend:
          service:
            name: grafana
            port:
              number: 3000
EOF

log_success "Ingress configured"

# ============================================================================
# PHASE 11: Verification
# ============================================================================

log_info "PHASE 11: Verification & Status"

echo ""
log_success "Kubernetes Cluster Status:"
k3s kubectl get nodes
echo ""

log_success "Pods Status (Production):"
k3s kubectl get pods -n jona-production
echo ""

log_success "Pods Status (Monitoring):"
k3s kubectl get pods -n monitoring
echo ""

log_success "Services:"
k3s kubectl get svc -A | grep -E "jona-api|prometheus|grafana"
echo ""

log_success "Storage Status:"
k3s kubectl get pvc -A
echo ""

# ============================================================================
# FINAL SUMMARY
# ============================================================================

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║  ✓ JONA PRODUCTION DEPLOYMENT COMPLETE!                  ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""
echo "Server Information:"
echo "  IP Address: $SERVER_IP"
echo "  Kubernetes: K3s (v1.34.3+)"
echo "  Namespace: jona-production"
echo ""
echo "Services Deployed:"
echo "  ✓ JONA API (3 replicas, auto-scaling 3-10)"
echo "  ✓ PostgreSQL 16 (20GB storage)"
echo "  ✓ Redis 7 (10GB storage)"
echo "  ✓ Prometheus (metrics)"
echo "  ✓ Grafana (dashboards)"
echo "  ✓ NGINX Ingress + cert-manager"
echo ""
echo "Next Steps:"
echo "  1. Configure DNS: jona.yourdomain.com → $SERVER_IP"
echo "  2. Wait for certificate provisioning (5-10 minutes)"
echo "  3. Access dashboard: https://jona.yourdomain.com"
echo "  4. Access Grafana: https://jona.yourdomain.com/grafana"
echo "  5. View logs: k3s kubectl logs -f deployment/jona-api -n jona-production"
echo ""
echo "Credentials saved in: /root/jona-secrets.txt"
echo ""
