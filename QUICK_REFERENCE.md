# ⚡ JONA Hetzner - Quick Reference Card

## 🖥️ Server Info
```
IP:         46.224.203.89
IPv6:       2a01:4f8:1c1f:969e::/64
Location:   Hetzner Berlin (NBG1)
Specs:      8 vCPU, 16GB RAM, 160GB SSD
Cost:       €8.99/month
```

## 🚀 One-Click Deployment

```bash
# 1. SSH into server
ssh root@46.224.203.89

# 2. Run K3s setup (takes ~5 min)
bash <(curl -fsSL https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/hetzner-setup.sh)

# 3. Run NGINX + Cert-Manager
bash <(curl -fsSL https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/hetzner-ingress.sh) jona.yourdomain.com admin@yourdomain.com

# 4. Update DNS: jona.yourdomain.com → 46.224.203.89

# 5. Deploy JONA (takes ~2 min)
bash <(curl -fsSL https://raw.githubusercontent.com/Web8kameleon-hub/ultrawebthinking/master/jona-deploy.sh) jona.yourdomain.com

# 6. Wait 5-10 minutes for SSL certificate
```

## 📦 Key Files

| File | Purpose |
|------|---------|
| `hetzner-setup.sh` | K3s installation & setup |
| `hetzner-ingress.sh` | NGINX & Let's Encrypt |
| `jona-deploy.sh` | JONA deployment |
| `k8s-deployment.yaml` | Kubernetes manifests |
| `Dockerfile` | Container image |
| `docker-compose.yml` | Local development |
| `.github/workflows/deploy.yml` | CI/CD automation |

## 🔍 Monitoring

```bash
# Local machine (after kubeconfig setup)
export KUBECONFIG=~/.kube/hetzner-config

# Check pods
kubectl get pods -n jona-production

# Follow logs
kubectl logs -f deployment/jona-api -n jona-production

# Check status
kubectl get all -n jona-production

# Resource usage
kubectl top pods -n jona-production
```

## 🔐 Security

| Layer | Status |
|-------|--------|
| **SSL/TLS** | ✅ Let's Encrypt (auto-renew) |
| **Network** | ✅ NetworkPolicy, Firewall |
| **Container** | ✅ Non-root, read-only FS |
| **Database** | ✅ Encrypted credentials |
| **Secrets** | ✅ K8s encrypted at rest |

## 📊 Performance

| Metric | Value |
|--------|-------|
| **Replicas** | 3-10 (auto-scaling) |
| **CPU Limit** | 500m/pod |
| **Memory Limit** | 1Gi/pod |
| **Expected Throughput** | 1000+ req/sec |
| **Target Latency** | p50: 50ms, p99: 500ms |
| **Availability** | 99.9%+ uptime |

## 🗄️ Databases

| Database | Storage | Purpose |
|----------|---------|---------|
| **PostgreSQL 16** | 20Gi | Main data store |
| **Redis 7** | 10Gi | Caching & sessions |
| **MongoDB** | Optional | Document storage |

## 🔄 API Endpoints

| Endpoint | Purpose |
|----------|---------|
| `/health/live` | Liveness probe |
| `/health/ready` | Readiness probe |
| `/api/eeg/*` | EEG endpoints (21) |
| `/api/health/*` | Health endpoints (13) |
| `/metrics` | Prometheus metrics |

## 🛠️ Common Commands

```bash
# Scale replicas
kubectl scale deployment jona-api --replicas=5 -n jona-production

# Update image
kubectl set image deployment/jona-api jona-api=ghcr.io/web8kameleon-hub/jona:v2.0 -n jona-production

# Restart
kubectl rollout restart deployment/jona-api -n jona-production

# Rollback
kubectl rollout undo deployment/jona-api -n jona-production

# View events
kubectl get events -n jona-production --sort-by='.lastTimestamp'

# Execute in pod
kubectl exec -it <pod-name> -n jona-production -- /bin/bash

# Port forward
kubectl port-forward svc/jona-api-service 8000:80 -n jona-production
```

## 🚨 Emergency Commands

```bash
# Check certificate status
kubectl describe certificate jona-cert -n jona-production

# Check ingress status
kubectl describe ingress jona-ingress -n jona-production

# Debug pod startup
kubectl describe pod <pod-name> -n jona-production

# Get pod logs
kubectl logs <pod-name> -n jona-production

# Check node status
kubectl get nodes
kubectl top nodes
```

## 📋 Checklist

- [ ] SSH key setup
- [ ] K3s deployed
- [ ] NGINX running
- [ ] Cert-Manager running
- [ ] DNS updated
- [ ] JONA deployed
- [ ] Pods running (3+)
- [ ] Health checks passing
- [ ] SSL certificate active
- [ ] Monitoring configured

## 🔗 Resources

- **GitHub**: https://github.com/Web8kameleon-hub/ultrawebthinking
- **K3s Docs**: https://docs.k3s.io
- **Kubectl Reference**: https://kubernetes.io/docs/reference/kubectl/
- **Hetzner Cloud**: https://www.hetzner.cloud
- **Deployment Guide**: See HETZNER_DEPLOYMENT_GUIDE.md
- **SSH Guide**: See HETZNER_SSH_GUIDE.md

## 📞 Support

- **Issue Tracker**: GitHub Issues
- **Troubleshooting**: HETZNER_DEPLOYMENT_GUIDE.md
- **Emergency**: oncall@yourdomain.com

---

**Status**: 🟢 Production Ready  
**Updated**: January 8, 2026  
**Server**: 46.224.203.89 (Hetzner Berlin NBG1)
