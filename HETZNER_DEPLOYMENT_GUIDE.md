# JONA - Hetzner Production Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Hetzner Setup](#hetzner-setup)
3. [Kubernetes Cluster](#kubernetes-cluster)
4. [JONA Deployment](#jona-deployment)
5. [SSL/TLS Configuration](#ssltls-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Backup & Recovery](#backup--recovery)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Helm
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash

# Install Hetzner CLI
curl -fsSL https://get.hetzner.cloud | bash

# Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

### Required Secrets on GitHub
```
KUBE_CONFIG           - Base64 encoded kubeconfig
DOCKER_USERNAME       - Docker Hub username
DOCKER_PASSWORD       - Docker Hub password
SNYK_TOKEN           - Snyk security token
SMTP_PASSWORD        - Email notification password
```

---

## Hetzner Setup

### 1. Create Hetzner Account & Project
```bash
# Login to Hetzner Cloud Console
# Create new project: "JONA Production"
# Generate API token with read+write permissions
hcloud config set-token <YOUR_API_TOKEN>
```

### 2. Create Network
```bash
hcloud network create --name jona-network --ip-range 10.0.0.0/8
hcloud network add-route jona-network --destination 10.0.0.0/8 --gateway 10.0.1.1
```

### 3. Create Firewall Rules
```bash
hcloud firewall create --name jona-firewall \
  --rules direction=in,protocol=tcp,port=80 \
  --rules direction=in,protocol=tcp,port=443 \
  --rules direction=in,protocol=tcp,port=6443 \
  --rules direction=in,protocol=tcp,port=30000:32767 \
  --rules direction=in,protocol=icmp
```

---

## Kubernetes Cluster

### 1. Create K3s Cluster on Hetzner
```bash
# SSH into your Hetzner server
ssh root@<SERVER_IP>

# Install K3s
curl -sfL https://get.k3s.io | sh -

# Verify installation
kubectl get nodes
kubectl get pods -A
```

### 2. Setup Persistent Storage
```bash
# Install Longhorn storage class
kubectl apply -f https://raw.githubusercontent.com/longhorn/longhorn/master/deploy/longhorn.yaml

# Verify
kubectl get storageclass
```

### 3. Install Ingress Controller
```bash
# Install NGINX Ingress Controller
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer
```

### 4. Install Cert-Manager
```bash
# Install cert-manager for Let's Encrypt
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Verify
kubectl get pods -n cert-manager
```

---

## JONA Deployment

### 1. Prepare Docker Image
```bash
# Build and push to registry
docker build -t web8kameleon-hub/jona:latest .
docker push web8kameleon-hub/jona:latest

# Verify
docker run --rm web8kameleon-hub/jona:latest --version
```

### 2. Create Namespace & Secrets
```bash
# Create namespace
kubectl create namespace jona-production

# Create secrets (update with your actual passwords)
kubectl create secret generic jona-secrets \
  --from-literal=POSTGRES_PASSWORD=$(openssl rand -base64 32) \
  --from-literal=REDIS_PASSWORD=$(openssl rand -base64 32) \
  --from-literal=MONGO_PASSWORD=$(openssl rand -base64 32) \
  --from-literal=JWT_SECRET=$(openssl rand -base64 32) \
  -n jona-production

# Verify
kubectl get secrets -n jona-production
```

### 3. Deploy JONA
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s-deployment.yaml

# Verify deployment
kubectl get deployments -n jona-production
kubectl get pods -n jona-production
kubectl get svc -n jona-production

# Watch rollout
kubectl rollout status deployment/jona-api -n jona-production
```

### 4. Verify Services
```bash
# Check all services
kubectl get all -n jona-production

# Get external IP
kubectl get svc -n jona-production

# Test API
curl http://<EXTERNAL_IP>/health/live
curl http://<EXTERNAL_IP>/health/ready
```

---

## SSL/TLS Configuration

### 1. Update DNS Records
```
# Point your domain to Hetzner IP
jona.yourdomain.com  A  <HETZNER_LOAD_BALANCER_IP>
```

### 2. Certificate Provisioning
```bash
# Cert-manager automatically provisions Let's Encrypt cert
kubectl describe certificate jona-cert -n jona-production

# Verify certificate
kubectl get certificate -n jona-production
kubectl get secret jona-tls-cert -n jona-production
```

### 3. Test HTTPS
```bash
# Wait for certificate
sleep 60

# Test HTTPS endpoint
curl -I https://jona.yourdomain.com
curl https://jona.yourdomain.com/health/live
```

---

## Monitoring & Logging

### 1. Deploy Prometheus & Grafana
```bash
# Already included in docker-compose.yml
# For K8s, apply additional monitoring manifests:

kubectl apply -f - <<EOF
apiVersion: v1
kind: Namespace
metadata:
  name: monitoring
---
# Add Prometheus & Grafana deployments here
EOF
```

### 2. Access Grafana Dashboard
```bash
# Port-forward to Grafana
kubectl port-forward -n monitoring svc/grafana 3000:80

# Access: http://localhost:3000
# Default credentials: admin/admin
```

### 3. View Logs
```bash
# View pod logs
kubectl logs -n jona-production deployment/jona-api -f

# View specific pod
kubectl logs -n jona-production <POD_NAME> -f

# View previous logs
kubectl logs -n jona-production <POD_NAME> --previous
```

### 4. Event Monitoring
```bash
# Watch events
kubectl get events -n jona-production --sort-by='.lastTimestamp'

# Continuous event monitoring
kubectl get events -n jona-production -w
```

---

## Backup & Recovery

### 1. Database Backup
```bash
# Manual PostgreSQL backup
kubectl exec -n jona-production postgres-0 -- \
  pg_dump -U jona jona_db > backup_$(date +%Y%m%d).sql

# Automated backup (CronJob)
kubectl apply -f - <<EOF
apiVersion: batch/v1
kind: CronJob
metadata:
  name: postgres-backup
  namespace: jona-production
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:16-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -U jona -h postgres-service jona_db | gzip > /backups/backup_\$(date +%Y%m%d_%H%M%S).sql.gz
            volumeMounts:
            - name: backups
              mountPath: /backups
          volumes:
          - name: backups
            emptyDir: {}
          restartPolicy: OnFailure
EOF
```

### 2. Volume Snapshots
```bash
# Create snapshot of persistent volumes
kubectl get volumesnapshot -n jona-production

# Restore from snapshot
kubectl apply -f - <<EOF
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: postgres-snapshot-restore
  namespace: jona-production
spec:
  volumeSnapshotClassName: csi-hostpath-snapclass
  source:
    volumeSnapshotContentName: snapcontent-...
EOF
```

### 3. Application Backup & Restore
```bash
# Backup entire deployment
kubectl get all -n jona-production -o yaml > jona-backup.yaml

# Restore
kubectl apply -f jona-backup.yaml
```

---

## Troubleshooting

### Pod Won't Start
```bash
# Check pod status
kubectl describe pod <POD_NAME> -n jona-production

# View pod logs
kubectl logs <POD_NAME> -n jona-production

# Check resource limits
kubectl top pods -n jona-production
```

### Database Connection Issues
```bash
# Test connectivity
kubectl run -it --rm debug --image=postgres:16-alpine --restart=Never \
  -n jona-production -- psql -h postgres-service -U jona -d jona_db -c "SELECT 1"

# Check Secret
kubectl get secret jona-secrets -n jona-production -o yaml | grep DATABASE_URL | base64 -d
```

### Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints jona-api-service -n jona-production

# Check ingress
kubectl describe ingress jona-ingress -n jona-production

# Check certificate
kubectl describe certificate jona-cert -n jona-production
```

### Memory/CPU Issues
```bash
# Check resource usage
kubectl top nodes
kubectl top pods -n jona-production --containers

# Increase resources in k8s-deployment.yaml and reapply:
kubectl set resources deployment jona-api \
  -n jona-production \
  --limits=cpu=1000m,memory=2Gi \
  --requests=cpu=500m,memory=1Gi
```

### Rollback Deployment
```bash
# Check rollout history
kubectl rollout history deployment/jona-api -n jona-production

# Rollback to previous version
kubectl rollout undo deployment/jona-api -n jona-production

# Rollback to specific revision
kubectl rollout undo deployment/jona-api -n jona-production --to-revision=2
```

---

## Production Checklist

- [ ] Hetzner account created
- [ ] K3s cluster deployed
- [ ] Storage class configured
- [ ] Ingress controller installed
- [ ] Cert-manager installed
- [ ] JONA namespace created
- [ ] Secrets configured
- [ ] JONA pods deployed and running
- [ ] SSL/TLS certificates provisioned
- [ ] DNS records updated
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Logging centralized
- [ ] Auto-scaling configured
- [ ] Network policies enforced
- [ ] Security scanning enabled

---

## Support & Documentation

- **Hetzner Docs**: https://docs.hetzner.cloud
- **Kubernetes Docs**: https://kubernetes.io/docs
- **K3s Docs**: https://docs.k3s.io
- **Cert-Manager**: https://cert-manager.io/docs
- **NGINX Ingress**: https://kubernetes.github.io/ingress-nginx

---

**Last Updated**: January 8, 2026
**Version**: 1.0
