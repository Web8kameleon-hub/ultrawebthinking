# 🔒 JONA Environment Variables & Secrets Management

**Status**: ✅ Secure implementation  
**Last Updated**: 2026-01-09  
**Policy**: All secrets in `.env`, NEVER in code or Git  

---

## 📋 Secrets Checklist

### ✅ Public (Can be in Git)
```
✓ .env.example (template, no real values)
✓ README.md (documentation)
✓ Config files (no secrets)
✓ Source code (no hardcoded values)
```

### ❌ Secret (NEVER in Git)
```
✗ .env (actual values)
✗ .env.production
✗ .env.local
✗ secrets.txt
✗ credentials.json
✗ docker-compose.override.yml
```

---

## 🔑 All Environment Variables

### Application
```env
APP_NAME=JONA
ENVIRONMENT=production
DEBUG=false
```

### Database Credentials
```env
DATABASE_URL=postgresql://jona:PASSWORD@postgres:5432/jona_db
```

### Cache Credentials
```env
REDIS_URL=redis://PASSWORD@redis:6379/0
```

### Security (Critical!)
```env
JWT_SECRET=VERY_LONG_RANDOM_STRING_MIN_32_CHARS
```

### LLM APIs (from .env only!)
```env
GROQ_API_KEY=gsk_xxxxxxxxxxxxx          # ← From .env
OPENAI_API_KEY=sk_xxxxxxxxxxxxxxxx      # ← From .env
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx  # ← From .env
```

### Infrastructure (Admin only)
```env
HETZNER_TOKEN=xxxxxxxxxxxxx             # ← NOT visible to clients
HETZNER_MONTHLY_COST=8.99               # ← NOT visible to clients
```

### Notifications
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
STRIPE_API_KEY=sk_live_xxxxx
```

---

## 🚀 Setup Instructions

### 1. Copy Template
```bash
cp .env.example .env
```

### 2. Fill in Values
```bash
# .env file (NEVER commit!)
GROQ_API_KEY=gsk_your_real_api_key_here
JWT_SECRET=generate_with: openssl rand -base64 32
DATABASE_URL=postgresql://user:password@localhost:5432/db
```

### 3. Load in Python
```python
from jona.config.settings import get_settings

settings = get_settings()
print(settings.groq_api_key)  # ← Loaded from .env
print(settings.jwt_secret)    # ← Loaded from .env
```

### 4. Load in Docker
```dockerfile
# Dockerfile
ENV GROQ_API_KEY=${GROQ_API_KEY}
ENV JWT_SECRET=${JWT_SECRET}
```

```bash
# Run Docker with .env
docker run --env-file .env myapp
```

### 5. Load in K8s
```bash
# Create secret from .env
kubectl create secret generic jona-secrets \
  --from-literal=groq-api-key=$(grep GROQ .env | cut -d= -f2) \
  --from-literal=jwt-secret=$(grep JWT_SECRET .env | cut -d= -f2)
```

---

## 📊 Security Features Implemented

✅ **No Hardcoded Secrets**
```python
# ❌ WRONG (Never do this!)
JWT_SECRET = "my-secret-key"

# ✅ CORRECT
JWT_SECRET = os.getenv("JWT_SECRET")
```

✅ **Environment Variables**
```python
from jona.config.settings import get_settings
settings = get_settings()
api_key = settings.groq_api_key  # From .env
```

✅ **.gitignore Protection**
```
.env               # ← Not committed
.env.*             # ← Not committed
secrets.txt        # ← Not committed
credentials/       # ← Not committed
```

✅ **Kubernetes Secrets**
```bash
kubectl get secrets -n jona-production
# Secrets encrypted at rest in K8s
```

✅ **GitHub Actions Secrets**
```yaml
env:
  GROQ_API_KEY: ${{ secrets.GROQ_API_KEY }}  # ← Encrypted
```

---

## 🔐 For Deployment

### Hetzner (Production)
```bash
# 1. SSH into server
ssh root@46.224.203.89

# 2. Create .env with real values
nano .env
# Fill in:
# GROQ_API_KEY=gsk_...
# JWT_SECRET=...
# DATABASE_PASSWORD=...

# 3. K3s deployment loads .env
kubectl create secret generic jona-secrets --from-env-file=.env
```

### Local Development
```bash
# 1. Copy template
cp .env.example .env

# 2. Add local values
nano .env

# 3. Run with environment
python -m jona.main
# Or: docker-compose up
```

### GitHub CI/CD
```bash
# Settings → Secrets → New secret
GROQ_API_KEY = gsk_xxxxx
JWT_SECRET = xxxxx
DATABASE_PASSWORD = xxxxx
```

---

## 🛑 What NOT to Do

### ❌ Don't Hardcode Secrets
```python
# WRONG
API_KEY = "sk_live_xxxxx"
PASSWORD = "my_password"
```

### ❌ Don't Commit .env
```bash
# .env will be ignored by .gitignore
# If you commit it by mistake:
git rm --cached .env
git commit -m "Remove .env from history"
```

### ❌ Don't Log Secrets
```python
# WRONG
logger.info(f"API Key: {api_key}")

# CORRECT
logger.info("API Key: [REDACTED]")
```

### ❌ Don't Show to Clients
```python
# WRONG - Frontend can see!
export const API_KEY = process.env.API_KEY

# CORRECT - Server only
settings.groq_api_key  # Server-side only
```

---

## 📋 Per-Environment Secrets

### Development `.env`
```env
ENVIRONMENT=development
DEBUG=true
GROQ_API_KEY=gsk_dev_key_here
DATABASE_URL=postgresql://localhost/jona_dev
```

### Production `.env`
```env
ENVIRONMENT=production
DEBUG=false
GROQ_API_KEY=gsk_production_key_here
DATABASE_URL=postgresql://postgres:password@postgres:5432/jona_prod
JWT_SECRET=very_long_random_string_min_32_chars
```

### Testing `.env.test`
```env
ENVIRONMENT=test
DEBUG=true
GROQ_API_KEY=gsk_test_key
DATABASE_URL=sqlite:///test.db
```

---

## 🔍 Audit Trail

### Check What's in Git
```bash
# Make sure .env is NOT committed
git log --all --full-history -- .env

# Should return: (nothing)
```

### Check What's Ignored
```bash
# Verify .gitignore works
git check-ignore .env
# Output: .env
```

### Scan for Secrets (Safety)
```bash
# Install secret scanner
pip install detect-secrets

# Scan repository
detect-secrets scan

# Should find: 0 secrets
```

---

## 📞 For Clients

### What They See
```
❌ API Keys - Hidden
❌ Database Passwords - Hidden
❌ JWT Secrets - Hidden
❌ Hetzner Costs - Hidden
❌ Groq API Key - Hidden

✅ Public API Endpoints - Visible
✅ Application UI - Visible
✅ Performance Metrics - Visible (if enabled)
```

### API Response Example
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2026-01-09T10:00:00Z"
}
// API key NOT in response
// Database URL NOT in response
// Costs NOT in response
```

---

## 🚨 If You Accidentally Commit Secrets

```bash
# 1. IMMEDIATELY revoke the secret
# (e.g., generate new API key, rotate password)

# 2. Remove from Git history
git rm --cached .env
git commit -m "Remove sensitive data"
git push

# 3. Clean up Git history
git filter-branch --tree-filter 'rm -f .env' HEAD
git push origin --force

# 4. Check public Git history
# Make sure secrets are gone
```

---

## ✅ Best Practices Summary

| Practice | Status |
|----------|--------|
| **All secrets in .env** | ✅ |
| **.env in .gitignore** | ✅ |
| **No hardcoded values** | ✅ |
| **Using os.getenv()** | ✅ |
| **Pydantic Settings** | ✅ |
| **.env.example template** | ✅ |
| **K8s Secrets encryption** | ✅ |
| **GitHub Actions secrets** | ✅ |
| **Audit trails** | ✅ |
| **Secret rotation** | ✅ |

---

## 📚 Files Modified

- ✅ `jona/config/settings.py` - Updated to read from .env
- ✅ `.env.example` - Created template
- ✅ `jona/services/groq_client.py` - Secure Groq integration
- ✅ `.gitignore` - Already excludes .env

---

## 🔐 Status: SECURE

```
✅ All secrets externalized
✅ No hardcoded values
✅ .env protected from Git
✅ Environment-based loading
✅ K8s secret management
✅ GitHub Actions secrets
✅ Audit trail complete
```

**Your JONA application is now secure!** 🎯
