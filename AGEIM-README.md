# 🤖 AGEIM - AGI Executive & Improvement Manager

## Overview
AGEIM është AGI engine i plotë me **ZERO-FAKE** policy që mundëson:
- Real project scanning (TypeScript, ESLint, Zero-Fake detection)
- Intelligent patch generation dhe application
- Token transfer management me approval gates
- Comprehensive audit trailing

## 🛡️ Zero-Fake Guarantee

### ❌ What AGEIM NEVER Does
- No `crypto.randomUUID().slice(-8)` fake data generation
- No `setTimeout()` simulations
- No hardcoded sample responses
- No bypassing of real validation

### ✅ What AGEIM ALWAYS Does
- Real TypeScript compilation checks
- Real ESLint error detection
- Real file system operations (gated)
- Real database queries (when configured)
- Real token transfers (with approvals)
- Real provenance tracking

## 🔧 API Endpoints

### 1. Status Check
```bash
GET /api/ageim/status
```

**Response:**
```json
{
  "ok": true,
  "ageim": {
    "status": "READY",
    "version": "8.0.0-WEB8-AGEIM",
    "uptime": 3600,
    "capabilities": ["SCAN_PROJECT", "PLAN_FIXES", "APPLY_PATCHES"]
  },
  "sandbox": {
    "mode": "DEVELOPMENT", 
    "queueLength": 3,
    "pendingApprovals": 1,
    "emergencyMode": false
  },
  "audit": {
    "totalActions": 47,
    "lastAction": "FILE_WRITE",
    "integrityValid": true
  }
}
```

### 2. Project Scanning
```bash
POST /api/ageim/scan
Headers:
  X-AGEIM-Mode: enabled
  X-Scan-Type: full
  
Body:
{
  "targets": ["src/", "components/", "app/"],
  "depth": "full"
}
```

**Real Operations Performed:**
- `npx tsc --noEmit --pretty false` - TypeScript compilation
- `npx eslint "src/**/*.{ts,tsx,js,jsx}" -f unix` - ESLint validation
- `npx ts-node tools/realonly-scanner.ts` - Zero-fake detection

**Response:**
```json
{
  "ok": true,
  "report": "/path/to/.sandbox/ageim-scan-1693330800000.json",
  "timestamp": "2025-08-29T15:30:00.000Z",
  "summary": {
    "tscErrors": 0,
    "lintErrors": 3,
    "sensorDataCount": 2,
    "totalFiles": 47
  }
}
```

### 3. Patch Management
```bash
POST /api/ageim/patch
Headers:
  X-AGEIM-Mode: enabled
  
# Generate Plan
Body:
{
  "action": "plan"
}

# Apply Patches
Body:
{
  "action": "apply",
  "patches": [
    {
      "path": "components/Cell.tsx",
      "content": "// Real patch content...",
      "reason": "Convert to RealData<T>",
      "riskLevel": "MEDIUM"
    }
  ]
}
```

**Plan Response:**
```json
{
  "ok": true,
  "action": "plan",
  "result": {
    "planPath": "/path/to/.sandbox/ageim-plan-1693330800000.json"
  },
  "nextSteps": [
    "Review generated plan",
    "Submit patches for approval"
  ]
}
```

**Apply Response (Requires Approval):**
```json
{
  "ok": false,
  "kind": "APPROVAL_REQUIRED",
  "message": "Patches submitted but require human approval",
  "approvalQueue": ["/sandbox/approvals"]
}
```

### 4. Control Operations
```bash
POST /api/ageim/status
Headers:
  X-AGEIM-Control: enabled
  
Body:
{
  "action": "emergency_stop" | "reset_queue" | "verify_audit" | "get_approvals"
}
```

## 🏗️ AGEIM Architecture

### Core Components

1. **backend/ageim.ts** - Main AGEIM singleton
2. **backend/sandbox/** - Freedom Sandbox infrastructure
3. **app/api/ageim/** - API endpoints
4. **app/ageim/test/** - Test client interface

### Sandbox Integration

```typescript
import ageim from '@/backend/ageim'

// Real operations
await ageim.scanProject()        // → Real tsc/eslint/scanner
await ageim.planFixes()          // → Real fix plan generation  
await ageim.applyPatches(patches) // → Real file writes (gated)

// Economy operations (gated)
await ageim.transferJunior(amount, address)
await ageim.transferAlbion(amount, address)

// Audit operations
const approvals = ageim.listApprovals()
const auditTrail = ageim.audit()
const isValid = ageim.verifyAudit()
```

### Policy Enforcement

**Safe Preset (WEB8_SAFE_V2):**
- `dryRunDefault: true` - Default to simulation
- `allowDomains: [...]` - Restricted network access
- `denyKinds: ["SPAWN_PROCESS", "START_NODE"]` - Blocked operations
- `reviewKinds: ["WRITE_DB", "FILE_WRITE", "TOKEN_TRANSFER"]` - Approval required

## 🚀 Usage Examples

### 1. Basic Health Check
```bash
curl -X GET http://localhost:3001/api/ageim/status \
  -H "X-AGEIM-Mode: enabled"
```

### 2. Run Full Project Scan
```bash
curl -X POST http://localhost:3001/api/ageim/scan \
  -H "X-AGEIM-Mode: enabled" \
  -H "X-Scan-Type: full" \
  -H "Content-Type: application/json" \
  -d '{"targets": ["src/", "components/"], "depth": "full"}'
```

### 3. Generate Fix Plan
```bash
curl -X POST http://localhost:3001/api/ageim/patch \
  -H "X-AGEIM-Mode: enabled" \
  -H "Content-Type: application/json" \
  -d '{"action": "plan"}'
```

### 4. Apply Patches (Triggers Approval)
```bash
curl -X POST http://localhost:3001/api/ageim/patch \
  -H "X-AGEIM-Mode: enabled" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "apply",
    "patches": [
      {
        "path": "test.txt",
        "content": "console.log(\"AGEIM patch\");",
        "reason": "Test patch application",
        "riskLevel": "LOW"
      }
    ]
  }'
```

### 5. Emergency Stop
```bash
curl -X POST http://localhost:3001/api/ageim/status \
  -H "X-AGEIM-Control: enabled" \
  -H "Content-Type: application/json" \
  -d '{"action": "emergency_stop"}'
```

## 🔍 Error Handling

### MISSING_TOOL Errors
```json
{
  "ok": false,
  "kind": "MISSING_TOOL",
  "message": "Required tool missing: PG_URL",
  "fix": [
    "Install pg",
    "Configure PG_URL environment variable",
    "Verify pg is in PATH"
  ]
}
```

### APPROVAL_REQUIRED
```json
{
  "ok": false,
  "kind": "APPROVAL_REQUIRED", 
  "message": "Patches submitted but require human approval",
  "approvalQueue": ["/sandbox/approvals"]
}
```

### AGEIM_ERROR
```json
{
  "ok": false,
  "kind": "AGEIM_ERROR",
  "message": "AGEIM scan error: Permission denied",
  "fix": [
    "Check AGEIM configuration",
    "Verify sandbox permissions",
    "Review error logs"
  ]
}
```

## 🎛️ Environment Variables

```env
# Required
WEB8_REPO_ROOT=/path/to/project
WEB8_SANDBOX_DIR=/path/to/.sandbox
WEB8_SANDBOX_SECRET=your-secret-key

# Network restrictions  
WEB8_ALLOW_DOMAINS=api.euroweb.local,status.ultra,docs.web8

# Database (optional)
PG_URL=postgres://user:pass@host/db

# Wallets (optional - for token transfers)
WEB8_JUNIOR_RPC=https://junior-rpc.api.ultrawebthinking.com
WEB8_JUNIOR_WALLET=0x...
WEB8_ALBION_RPC=https://albion-rpc.api.ultrawebthinking.com  
WEB8_ALBION_WALLET=0x...

# Emergency
SANDBOX_EMERGENCY=0  # Set to 1 to stop all operations
```

## 🧪 Testing Interface

Access the test client at: `http://localhost:3001/ageim/test`

The test interface provides:
- ✅ Real status checking
- ✅ Real scan execution
- ✅ Real patch planning and application
- ✅ Real control operations
- ✅ Zero-fake result display

## 🛡️ Security Features

### Approval Workflow
1. **Submit**: AGEIM submits risky operations for approval
2. **Queue**: Operations appear in `/sandbox/approvals`
3. **Review**: Human reviews operation details
4. **Approve/Deny**: Human makes decision
5. **Execute**: Only approved operations execute

### Audit Trail
- Every operation logged with cryptographic hash
- Hash chain ensures integrity
- `verifyAudit()` validates complete trail
- Tamper detection and alerting

### Emergency Controls
- `SANDBOX_EMERGENCY=1` stops all operations
- Emergency stop API endpoint
- Queue reset capabilities
- Real-time monitoring

---

**Remember**: AGEIM operates with **ZERO-FAKE** guarantee - every operation is real or explicitly requires approval. No simulated responses, no fake data generation.
