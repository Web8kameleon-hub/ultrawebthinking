# 🚀 JONA Production Deployment Guide

## Enterprise-Grade Kubernetes Deployment on Hetzner Cloud

**Status**: Production-Ready | **Version**: 1.0 | **Last Updated**: 2025

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Infrastructure Setup](#infrastructure-setup)
4. [Pre-Deployment Configuration](#pre-deployment-configuration)
5. [Deployment Steps](#deployment-steps)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)
9. [Scaling & Performance](#scaling--performance)
10. [Security Hardening](#security-hardening)

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    JONA Production Stack                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              External Load Balancer                   │   │
│  │         (NGINX Ingress + Let's Encrypt SSL)           │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │                                        │
│  ┌──────────────────┴───────────────────────────────────┐   │
│  │        Kubernetes Namespace: jona-production         │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │                                                       │   │
│  │  ┌─────────────────┐  ┌──────────────────────────┐  │   │
│  │  │   JONA API      │  │   Auto-Scaler (HPA)      │  │   │
│  │  │ Deployment (3)  │  │  3-10 replicas based on  │  │   │
│  │  │   Replicas      │  │  CPU/Memory metrics      │  │   │
│  │  └─────────────────┘  └──────────────────────────┘  │   │
│  │           │                                          │   │
│  │  ┌────────┴──────────────────────────────────────┐  │   │
│  │  │                                               │  │   │
│  │  │  ┌──────────────┐  ┌──────────────────────┐  │  │   │
│  │  │  │ PostgreSQL   │  │      Redis           │  │  │   │
│  │  │  │ StatefulSet  │  │    StatefulSet       │  │  │   │
│  │  │  │ (20GB PVC)   │  │    (10GB PVC)        │  │  │   │
│  │  │  └──────────────┘  └──────────────────────┘  │  │   │
│  │  │                                               │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                       │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │  Monitoring Stack:                                  │   │
│  │  • Prometheus (metrics collection)                  │   │
│  │  • Grafana (visualization)                          │   │
│  │  • Alert Manager (notifications)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Topology

| Component | Type | Instances | Storage | CPU | Memory |
|-----------|------|-----------|---------|-----|--------|
| JONA API | Deployment | 3-10 | None | 250m-500m | 512Mi-1Gi |
| PostgreSQL | StatefulSet | 1 | 20Gi | 500m | 512Mi |
| Redis | StatefulSet | 1 | 10Gi | 250m | 256Mi |
| NGINX Ingress | DaemonSet | 1 | None | 100m | 128Mi |
| Prometheus | Deployment | 1 | 10Gi | 500m | 512Mi |
| Grafana | Deployment | 1 | 1Gi | 250m | 256Mi |

---

## 📋 Prerequisites

### System Requirements

- **Kubernetes Cluster**: K3s v1.34.3+ on Hetzner Cloud
- **Server Specs** (Hetzner cx41):
  - 8 vCPU
  - 16GB RAM
  - 160GB SSD
  - Network: 1Gbps
- **Cost**: €8.99/month

### Required Tools

```bash
# Install kubectl (macOS)
brew install kubectl

# Install kubectl (Linux)
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/

# Install kubectl (Windows)
choco install kubernetes-cli
# OR
winget install Kubernetes.kubectl

# Verify installation
kubectl version --client
```

### Hetzner Server Access

```bash
# SSH into your Hetzner server
ssh root@46.224.203.89

# Verify K3s cluster
kubectl get nodes
kubectl get pods --all-namespaces
```

---

## 🔧 Infrastructure Setup

### 1. K3s Cluster Installation (If Not Already Done)

```bash
# SSH into Hetzner server
ssh root@46.224.203.89

# Install K3s
curl -sfL https://get.k3s.io | sh -

# Verify installation
k3s kubectl get nodes
k3s kubectl get pods --all-namespaces

# Copy kubeconfig to local machine
scp root@46.224.203.89:/etc/rancher/k3s/k3s.yaml ~/.kube/hetzner-k3s-config

# Update kubeconfig (change localhost to server IP)
sed -i '' 's/127.0.0.1/46.224.203.89/g' ~/.kube/hetzner-k3s-config
export KUBECONFIG=~/.kube/hetzner-k3s-config

# Verify connection from local machine
kubectl cluster-info
```

### 2. Storage Class Setup

K3s comes with local-storage. Verify:

```bash
kubectl get storageclass
# Should show: local-path (default)

# For production, consider using Hetzner's cinder volumes
# See: https://github.com/hetznercloud/csi-driver
```

### 3. Ingress Controller (Already in K3s)

K3s includes Traefik. We override it with NGINX for better control:

```bash
# Check if Traefik is disabled (optional)
kubectl get deployment -n kube-system traefik
```

---

## ⚙️ Pre-Deployment Configuration

### 1. GitHub Secrets Setup

For GitHub Actions to deploy to your K3s cluster:

```bash
# Get kubeconfig content (base64 encoded)
cat ~/.kube/hetzner-k3s-config | base64 | tr -d '\n'

# Copy to GitHub Secrets as KUBE_CONFIG
```

**GitHub Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value |
|-------------|-------|
| `KUBE_CONFIG` | Base64-encoded kubeconfig |
| `SLACK_WEBHOOK` | Your Slack webhook URL (optional) |
| `SNYK_TOKEN` | Snyk security token (optional) |

### 2. Update k8s-production.yaml

Before deployment, update these values:

```yaml
# In k8s-production.yaml

# 1. Email for Let's Encrypt (line ~550)
metadata:
  name: letsencrypt-prod
spec:
  acmeConfig:
    email: your-email@example.com

# 2. Domain name (line ~520)
metadata:
  name: jona-ingress
spec:
  tls:
    - hosts:
      - jona.yourdomain.com

# 3. Database passwords (line ~100)
data:
  POSTGRES_PASSWORD: your-secure-password
  REDIS_PASSWORD: your-redis-password
```

### 3. Domain Setup

1. Point your domain to Hetzner IP:
   ```
   A record: jona.yourdomain.com → 46.224.203.89
   ```

2. Wait for DNS propagation (5-10 minutes)

3. Verify:
   ```bash
   nslookup jona.yourdomain.com
   # Should resolve to 46.224.203.89
   ```

---

## 🚀 Deployment Steps

### Option 1: Automated Deployment (Recommended)

```bash
# Clone the repository
git clone https://github.com/Web8kameleon-hub/ultrawebthinking.git
cd ultrawebthinking

# Make deployment script executable
chmod +x scripts/deploy-k8s.sh

# Run deployment
./scripts/deploy-k8s.sh

# Expected output:
# ✓ Pre-flight checks passed
# ✓ Namespace created
# ✓ Manifests applied
# ✓ Services ready
# ✓ Deployment ready
# ✓ Health checks passed
```

### Option 2: Manual Deployment

```bash
# 1. Create namespace
kubectl create namespace jona-production

# 2. Apply manifests
kubectl apply -f k8s-production.yaml

# 3. Wait for deployments
kubectl rollout status deployment/jona-api -n jona-production --timeout=5m

# 4. Verify status
kubectl get all -n jona-production
```

### Option 3: Deploy with Docker Compose (Local Testing)

```bash
# Start full stack locally
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker-compose -f docker-compose.prod.yml ps

# Stop services
docker-compose -f docker-compose.prod.yml down
```

---

## ✅ Post-Deployment Verification

### 1. Check Pod Status

```bash
# Get all pods in production namespace
kubectl get pods -n jona-production

# Expected output:
# NAME                        READY   STATUS    RESTARTS   AGE
# jona-api-6f4d89d4d-xxxxx    1/1     Running   0          2m
# postgres-0                  1/1     Running   0          3m
# redis-0                     1/1     Running   0          3m
# nginx-ingress-xxxxx         1/1     Running   0          2m
```

### 2. Verify Services

```bash
# Get services
kubectl get svc -n jona-production

# Expected output:
# NAME                 TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)
# jona-api             ClusterIP      10.43.x.x    <none>        5000/TCP
# postgres             ClusterIP      10.43.x.x    <none>        5432/TCP
# redis                ClusterIP      10.43.x.x    <none>        6379/TCP
# nginx-ingress        LoadBalancer   10.43.x.x    46.224.203.89 80:xxxxx/TCP,443:xxxxx/TCP
```

### 3. Check Ingress

```bash
# Get ingress status
kubectl get ingress -n jona-production

# Expected:
# NAME           CLASS    HOSTS                ADDRESS         PORTS       AGE
# jona-ingress   nginx    jona.yourdomain.com  46.224.203.89   80, 443    2m
```

### 4. Verify SSL Certificate

```bash
# Wait for cert-manager to issue certificate (5-10 minutes)
kubectl get certificate -n jona-production

# Expected:
# NAME           READY   SECRET         AGE
# jona-tls       True    jona-tls-cert  5m

# Check certificate details
kubectl describe certificate jona-tls -n jona-production
```

### 5. Health Checks

```bash
# Health check endpoint
curl -k https://jona.yourdomain.com/health/live
# Expected: {"status": "healthy"}

# API status
curl -k https://jona.yourdomain.com/api/status
# Expected: JSON with server metrics

# Dashboard access
# Open: https://jona.yourdomain.com in browser
```

### 6. Database Connectivity

```bash
# Connect to PostgreSQL pod
kubectl exec -it postgres-0 -n jona-production -- \
  psql -U postgres -c "\dt"

# Connect to Redis pod
kubectl exec -it redis-0 -n jona-production -- redis-cli ping
# Expected: PONG
```

---

## 📊 Monitoring & Logging

### 1. Access Grafana Dashboard

```bash
# Get Grafana URL
kubectl get svc grafana -n jona-production -o wide

# Port-forward to local machine
kubectl port-forward svc/grafana 3000:3000 -n jona-production

# Access: http://localhost:3000
# Default credentials: admin/prom-operator
```

### 2. Prometheus Metrics

```bash
# Port-forward Prometheus
kubectl port-forward svc/prometheus 9090:9090 -n jona-production

# Access: http://localhost:9090
# Query examples:
# - up{job="jona-api"}
# - rate(http_requests_total[5m])
# - container_memory_usage_bytes
```

### 3. View Logs

```bash
# Stream logs from API pods
kubectl logs -f deployment/jona-api -n jona-production

# View logs from specific pod
kubectl logs pod-name -n jona-production

# View logs with timestamps
kubectl logs deployment/jona-api -n jona-production --timestamps=true

# View previous logs (if pod crashed)
kubectl logs pod-name -n jona-production --previous
```

### 4. Watch Events

```bash
# Watch all events in namespace
kubectl get events -n jona-production --watch

# Watch specific resource
kubectl describe deployment jona-api -n jona-production
```

---

## 🐛 Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod pod-name -n jona-production

# Check logs
kubectl logs pod-name -n jona-production

# Check previous logs (if crashed)
kubectl logs pod-name -n jona-production --previous

# Check events
kubectl get events -n jona-production --sort-by='.lastTimestamp'
```

### Persistent Volume Issues

```bash
# Check PVC status
kubectl get pvc -n jona-production

# Describe PVC
kubectl describe pvc pvc-name -n jona-production

# Check PV
kubectl get pv
```

### Certificate Issues

```bash
# Check cert-manager status
kubectl get pods -n cert-manager

# Check ClusterIssuer
kubectl describe clusterissuer letsencrypt-prod

# Check certificate status
kubectl describe certificate jona-tls -n jona-production

# View cert-manager logs
kubectl logs -n cert-manager -l app=cert-manager
```

### Network/Ingress Issues

```bash
# Check ingress status
kubectl describe ingress jona-ingress -n jona-production

# Check NGINX ingress controller
kubectl get pods -n ingress-nginx

# Test DNS
nslookup jona.yourdomain.com
ping jona.yourdomain.com

# Test HTTP/HTTPS
curl -v http://jona.yourdomain.com
curl -v https://jona.yourdomain.com
```

### Database Connection Issues

```bash
# Connect to PostgreSQL
kubectl exec -it postgres-0 -n jona-production -- psql -U postgres

# Check PostgreSQL logs
kubectl logs postgres-0 -n jona-production

# Test connection from API pod
kubectl exec -it jona-api-xxxxx -n jona-production -- \
  psql -h postgres -U postgres -d jona_db -c "SELECT version();"
```

### Resource Exhaustion

```bash
# Check node resources
kubectl top nodes

# Check pod resources
kubectl top pods -n jona-production

# Check HPA status
kubectl get hpa -n jona-production
kubectl describe hpa jona-api-hpa -n jona-production
```

---

## 📈 Scaling & Performance

### Manual Scaling

```bash
# Scale API deployment
kubectl scale deployment jona-api --replicas=5 -n jona-production

# Verify scaling
kubectl get pods -n jona-production
```

### Auto-Scaling (HPA)

HPA is configured to scale based on:
- CPU threshold: 70%
- Memory threshold: 80%
- Min replicas: 3
- Max replicas: 10

Monitor HPA:
```bash
# Get HPA status
kubectl get hpa jona-api-hpa -n jona-production

# Watch HPA activity
kubectl get hpa jona-api-hpa -n jona-production --watch

# Detailed HPA info
kubectl describe hpa jona-api-hpa -n jona-production
```

### Performance Tuning

```bash
# Check container resource usage
kubectl top pods -n jona-production --containers

# View resource limits/requests
kubectl describe node node-name

# Adjust resource limits in k8s-production.yaml:
resources:
  requests:
    cpu: 250m
    memory: 512Mi
  limits:
    cpu: 500m
    memory: 1Gi
```

---

## 🔒 Security Hardening

### 1. Network Policies

Already configured in `k8s-production.yaml`:
- Ingress only from NGINX
- Egress only to databases and DNS
- Deny-all default policy

```bash
# Verify NetworkPolicy
kubectl get networkpolicy -n jona-production
```

### 2. RBAC

ServiceAccount and Role Binding configured:

```bash
# Check ServiceAccount
kubectl get serviceaccount -n jona-production
kubectl describe sa jona-api -n jona-production

# Verify RBAC
kubectl get roles -n jona-production
kubectl get rolebindings -n jona-production
```

### 3. Pod Security

- Non-root user (UID 1000)
- Read-only root filesystem
- No privilege escalation
- Dropped unnecessary capabilities

```bash
# Verify security context
kubectl get pod pod-name -n jona-production -o yaml | grep -A 10 securityContext
```

### 4. Secrets Management

Sensitive data stored as Kubernetes Secrets:

```bash
# List secrets
kubectl get secrets -n jona-production

# View secret (base64 encoded)
kubectl get secret db-secret -n jona-production -o yaml

# Update secret
kubectl create secret generic db-secret --from-literal=password=newpassword \
  -n jona-production --dry-run=client -o yaml | kubectl apply -f -
```

### 5. SSL/TLS

- Automatic certificate provisioning with Let's Encrypt
- Certificate renewal automatic
- HTTPS-only access

```bash
# Check certificate status
kubectl get certificate -n jona-production

# View certificate details
openssl s_client -connect jona.yourdomain.com:443
```

---

## 📝 Maintenance Tasks

### Regular Backups

```bash
# Backup database
kubectl exec postgres-0 -n jona-production -- \
  pg_dump -U postgres jona_db > jona-db-backup.sql

# Backup persistent volumes
kubectl get pvc -n jona-production
# Backup manually or use Velero for automated backups
```

### Updates & Upgrades

```bash
# Update Docker image
kubectl set image deployment/jona-api \
  jona-api=ghcr.io/web8kameleon-hub/jona:latest \
  -n jona-production

# Watch rollout
kubectl rollout status deployment/jona-api -n jona-production --watch

# Rollback if needed
kubectl rollout undo deployment/jona-api -n jona-production
```

### Cleanup

```bash
# Delete namespace (removes all resources)
kubectl delete namespace jona-production

# Clean up unused images
docker image prune -a

# Clean up unused volumes
docker volume prune
```

---

## 📞 Support & Resources

- **Documentation**: See `README.md` and `ARCHITECTURE.md`
- **Issue Tracking**: GitHub Issues
- **Kubernetes Docs**: https://kubernetes.io/docs/
- **K3s Docs**: https://docs.k3s.io/
- **cert-manager**: https://cert-manager.io/docs/

---

## 🎯 Success Criteria

✅ All pods running in `jona-production` namespace  
✅ Services accessible via HTTPS  
✅ SSL certificate issued and valid  
✅ HPA scaling pods based on metrics  
✅ Monitoring dashboards operational  
✅ Logs streaming to centralized storage  
✅ Backup strategy in place  

**Estimated Time to Production**: 30-45 minutes  
**Cost**: €8.99/month (Hetzner cx41 instance)  
**Production Readiness**: 99.9% uptime SLA target  

---

**Last Updated**: 2025 | **Version**: 1.0 | **Status**: Production-Ready
