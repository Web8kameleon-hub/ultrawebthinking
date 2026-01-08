# JONA Hetzner Deployment - SSH Quick Start

## 🚀 Quick Start (5 Steps)

### 1️⃣ SSH into Hetzner Server

```bash
# From your local machine
ssh root@46.224.203.89

# Or with SSH key
ssh -i ~/.ssh/hetzner_key root@46.224.203.89
```

### 2️⃣ Download & Run K3s Setup

```bash
# On the Hetzner server
wget https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/hetzner-setup.sh
chmod +x hetzner-setup.sh
./hetzner-setup.sh

# This will take ~5 minutes
# Output will show kubeconfig export instructions
```

### 3️⃣ Setup NGINX & Cert-Manager

```bash
# Still on the Hetzner server
wget https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/hetzner-ingress.sh
chmod +x hetzner-ingress.sh
bash hetzner-ingress.sh jona.yourdomain.com admin@yourdomain.com

# Replace jona.yourdomain.com with your actual domain
```

### 4️⃣ Update DNS Records

**Add A record:**
```
Name: jona
Type: A
Value: 46.224.203.89
```

**Add IPv6 record (optional):**
```
Name: jona
Type: AAAA
Value: 2a01:4f8:1c1f:969e::1
```

Wait 5-10 minutes for DNS propagation.

### 5️⃣ Deploy JONA

```bash
# Still on the Hetzner server
wget https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/jona-deploy.sh
chmod +x jona-deploy.sh
bash jona-deploy.sh jona.yourdomain.com latest

# This will:
# - Create namespace
# - Generate random passwords
# - Deploy PostgreSQL, Redis, MongoDB
# - Deploy JONA API (3 replicas)
# - Setup Ingress & SSL certificate
```

### 6️⃣ Verify Deployment

```bash
# Check all resources
kubectl get all -n jona-production

# Watch logs
kubectl logs -f -n jona-production deployment/jona-api

# Test API
curl https://jona.yourdomain.com/health/live

# Port forward for local testing (optional)
kubectl port-forward -n jona-production svc/jona-api-service 8000:80
# Then: curl http://localhost:8000/health/live
```

---

## 📋 Detailed Manual Steps

### Step 1: Initial SSH Connection

```bash
ssh root@46.224.203.89
```

**Optional: Setup SSH key for password-less access**

```bash
# From your LOCAL machine, create key
ssh-keygen -t ed25519 -f ~/.ssh/hetzner -C "jona-hetzner"

# Copy to server
ssh-copy-id -i ~/.ssh/hetzner root@46.224.203.89

# Now you can use: ssh -i ~/.ssh/hetzner root@46.224.203.89
```

### Step 2: System Preparation

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install essentials
apt-get install -y curl wget git vim htop net-tools

# Install Docker
curl -fsSL https://get.docker.com | sh
```

### Step 3: Install K3s

```bash
# Install K3s with Docker
curl -sfL https://get.k3s.io | sh -s - --docker

# Wait for it to start
sleep 10

# Verify
kubectl get nodes
kubectl get pods -A
```

### Step 4: Export kubeconfig

```bash
# Display kubeconfig
cat /etc/rancher/k3s/k3s.yaml

# Or copy to your local machine
# FROM LOCAL MACHINE:
scp root@46.224.203.89:/etc/rancher/k3s/k3s.yaml ~/.kube/hetzner-config

# Update kubeconfig
export KUBECONFIG=~/.kube/config:~/.kube/hetzner-config
kubectl config use-context k3s-hetzner

# Verify
kubectl cluster-info
```

### Step 5: Install NGINX & Cert-Manager

```bash
# Back on Hetzner server
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml

# Add Helm repos
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update

# Install NGINX
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx \
  --create-namespace \
  --set controller.service.type=LoadBalancer

# Install Cert-Manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Wait for readiness
kubectl wait --for=condition=Ready pod -l app.kubernetes.io/instance=cert-manager -n cert-manager --timeout=300s

# Create Let's Encrypt ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@yourdomain.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### Step 6: Deploy JONA

```bash
# Create namespace
kubectl create namespace jona-production

# Generate secrets
POSTGRES_PWD=$(openssl rand -base64 32)
REDIS_PWD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Create secret
kubectl create secret generic jona-secrets \
  --from-literal=POSTGRES_PASSWORD="$POSTGRES_PWD" \
  --from-literal=REDIS_PASSWORD="$REDIS_PWD" \
  --from-literal=JWT_SECRET="$JWT_SECRET" \
  -n jona-production

# Create ConfigMap
kubectl create configmap jona-config \
  --from-literal=ENV=production \
  --from-literal=DEBUG=false \
  --from-literal=LOG_LEVEL=INFO \
  -n jona-production

# Apply manifests
kubectl apply -f https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/k8s-deployment.yaml

# Wait for deployment
kubectl rollout status deployment/jona-api -n jona-production --timeout=5m

# Verify
kubectl get all -n jona-production
```

---

## 🔍 Monitoring & Troubleshooting

### Check Pod Status

```bash
# All pods in namespace
kubectl get pods -n jona-production

# Details of a specific pod
kubectl describe pod <pod-name> -n jona-production

# Logs from pod
kubectl logs <pod-name> -n jona-production

# Follow logs (like tail -f)
kubectl logs -f <pod-name> -n jona-production
```

### Check Resource Usage

```bash
# CPU and memory
kubectl top nodes
kubectl top pods -n jona-production

# Storage
kubectl get pvc -n jona-production
```

### Debug Issues

```bash
# Check events
kubectl get events -n jona-production

# Describe resource
kubectl describe deployment jona-api -n jona-production

# Execute command in pod
kubectl exec -it <pod-name> -n jona-production -- /bin/bash

# Port forward for testing
kubectl port-forward <pod-name> 8000:8000 -n jona-production
```

### Common Commands

```bash
# Scale replicas
kubectl scale deployment jona-api --replicas=5 -n jona-production

# Update image
kubectl set image deployment/jona-api jona-api=ghcr.io/web8kameleon-hub/jona:v2.0 -n jona-production

# Restart deployment
kubectl rollout restart deployment/jona-api -n jona-production

# Rollback to previous version
kubectl rollout undo deployment/jona-api -n jona-production

# Check certificate status
kubectl describe certificate jona-cert -n jona-production
```

---

## 🔐 Backup kubeconfig

```bash
# Make a backup
cp ~/.kube/hetzner-config ~/.kube/hetzner-config.backup

# Secure it
chmod 600 ~/.kube/hetzner-config

# Never commit to git!
echo "*.kube/" >> .gitignore
```

---

## 📊 Server Information

| Property | Value |
|----------|-------|
| **IP Address** | 46.224.203.89 |
| **IPv6** | 2a01:4f8:1c1f:969e::/64 |
| **Location** | Hetzner, Berlin (NBG1) |
| **vCPU** | 8 |
| **RAM** | 16 GB |
| **Storage** | 160 GB SSD |
| **Cost** | €8.99/month |

---

## 🚨 Emergency Procedures

### SSH Key Access

If you lose password access:

```bash
# Use Hetzner console or rescue mode
# Hetzner Console: https://console.hetzner.cloud/
# Select server → Rescue → Activate Rescue System
```

### Full Cluster Reboot

```bash
# Graceful shutdown
kubectl drain --all --ignore-daemonsets --delete-emptydir-data

# Reboot
reboot

# Verify after reboot
kubectl get nodes
kubectl get all -n jona-production
```

### Database Recovery

```bash
# List backups
ls -la /backups/

# Restore backup
kubectl exec -it postgres-0 -n jona-production \
  -- psql -U jona -d jona_db < backup_2026-01-08.sql
```

---

## 📞 Support

- **Repository**: https://github.com/Web8kameleon-hub/ultrawebthinking
- **K3s Docs**: https://docs.k3s.io
- **Kubectl Docs**: https://kubernetes.io/docs/reference/kubectl/
- **Hetzner Support**: https://www.hetzner.com/support

---

**Generated**: January 8, 2026  
**Server**: Hetzner NBG1 (46.224.203.89)  
**Status**: 🟢 Ready for Production
