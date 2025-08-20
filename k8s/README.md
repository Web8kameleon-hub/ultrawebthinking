# k8s/README.md
# EuroWeb Ultra Kubernetes Configuration

## 🚀 Deployment Overview

Kjo konfigurimi Kubernetes për **EuroWeb Ultra** përfshin:

### 📦 Components:
- **Frontend**: Next.js application (3 replicas)
- **Backend**: AGI Core Node.js API (2 replicas) 
- **Redis**: Cache layer për performance
- **Ingress**: Load balancing dhe SSL termination
- **HPA**: Auto-scaling bazuar në CPU/Memory

### 🛠️ Prerequisites:
```bash
# 1. Docker Desktop me Kubernetes enabled
# 2. kubectl installed
# 3. NGINX Ingress Controller (optional)
```

## 🔧 Quick Start:

### 1. Build Docker Images:
```bash
# Frontend
docker build -t euroweb-ultra/frontend:latest .

# Backend  
cd backend && docker build -t euroweb-ultra/backend:latest .
```

### 2. Deploy to Kubernetes:
```bash
cd k8s
chmod +x deploy.sh
./deploy.sh
```

### 3. Verify Deployment:
```bash
kubectl get all -n euroweb-ultra
```

## 📊 Monitoring:

### View Logs:
```bash
# Frontend logs
kubectl logs -f deployment/euroweb-frontend -n euroweb-ultra

# Backend AGI logs  
kubectl logs -f deployment/euroweb-backend -n euroweb-ultra

# Redis logs
kubectl logs -f deployment/redis -n euroweb-ultra
```

### Check Status:
```bash
# Pod status
kubectl get pods -n euroweb-ultra

# Service status  
kubectl get services -n euroweb-ultra

# HPA status
kubectl get hpa -n euroweb-ultra
```

## 🔄 Updates:

### Rolling Update:
```bash
# Update frontend
kubectl set image deployment/euroweb-frontend frontend=euroweb-ultra/frontend:v2 -n euroweb-ultra

# Update backend
kubectl set image deployment/euroweb-backend agi-backend=euroweb-ultra/backend:v2 -n euroweb-ultra
```

## 🗑️ Cleanup:
```bash
kubectl delete namespace euroweb-ultra
```

## 🌍 Production Notes:

### SSL/TLS:
- Konfiguro cert-manager për automatic SSL certificates
- Update ingress.yaml me real domain names

### Security:
- Update secrets në configmap.yaml  
- Enable RBAC
- Configure NetworkPolicies për network isolation

### Performance:
- Monitor me Prometheus + Grafana
- Tune resource requests/limits
- Configure persistent volumes për Redis

---
© Web8 UltraThinking – Ledjan Ahmati
