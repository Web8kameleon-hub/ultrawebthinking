# 🛡️ Mirror Defense Industrial - Documentation Guide

## Overview

Mirror Defense Industrial është një sistem sigurie multi-layer i dizajnuar për projekte enterprise. Ky sistem implementon:

- **Layer 1**: Broken Mirror (Decoy Protection)
- **Layer 2**: Close Mirror (Code Obfuscation)
- **Layer 3**: Out Mirror (UI Security)
- **Industrial Dashboard**: Real-time monitoring dhe administrim
- **CI/CD Integration**: Automatizim i plotë në pipeline

---

## 🚀 Quick Start

### 1. Instalimi

```bash
# Clone repository
git clone https://github.com/your-org/your-project.git
cd your-project

# Install dependencies
npm install

# Install Mirror Defense dependencies
npm install ws crypto
```

### 2. Konfigurimi Bazik

```bash
# Generate protected assets
npm run build:mirrors

# Start dashboard
npm run dashboard

# Start demo
npm run demo:build
```

### 3. Development Workflow

```bash
# Development mode
npm run dev:protect

# Build për production
npm run deploy:industrial

# Monitor security në real-time
npm run dashboard
```

---

## 📁 Project Structure

```
your-project/
├── security/
│   ├── broken-mirror.module.ts    # Decoy generation
│   ├── close-mirror.module.ts     # Code obfuscation
│   ├── out-mirror.module.ts       # UI security
│   └── security.ts                # Main security orchestrator
├── scripts/
│   ├── protect-industrial.ts      # Build protection
│   ├── build-decoy.js            # Decoy generation
│   ├── build-protected.js        # Protected assets
│   ├── build-sri.js              # SRI hash generation
│   └── generate-secured-html.js  # Secured HTML generation
├── dashboard/
│   └── mirror-defense-dashboard.js # Admin panel
├── .github/workflows/
│   └── mirror-defense-ci.yml     # CI/CD pipeline
└── build/
    ├── decoy/                     # Generated decoys
    ├── protected/                 # Obfuscated code
    └── ui/                        # Secured HTML
```

---

## 🔧 Configuration

### Security Configuration

Krijo `config/mirror-defense.json`:

```json
{
  "security": {
    "csp": "default-src 'self'; script-src 'self' 'unsafe-inline';",
    "sri": {
      "enabled": true,
      "algorithm": "sha384"
    },
    "decoy": {
      "refreshInterval": 30,
      "threatLevel": "medium",
      "types": ["xss", "sql", "csrf"]
    },
    "obfuscation": {
      "level": "high",
      "variableRenaming": true,
      "controlFlowFlattening": true
    }
  },
  "monitoring": {
    "realTimeAlerts": true,
    "logRetention": "30d",
    "dashboardPort": 3002
  }
}
```

### Environment Variables

```bash
# .env
MIRROR_DEFENSE_ENV=production
DASHBOARD_PORT=3002
SECRET_KEY=your-secret-key
CSP_NONCE_ENABLED=true
```

---

## 🎭 Layer 1: Broken Mirror (Decoy)

### Qëllimi
Krijon kod të rremë dhe vulnerabilitete false për të mashtruar sulmuese.

### Implementation

```typescript
import { BrokenMirror } from './security/broken-mirror.module';

const brokenMirror = new BrokenMirror({
  decoyTypes: ['sql-injection', 'xss', 'csrf'],
  refreshInterval: 30 * 60 * 1000, // 30 minutes
  complexity: 'high'
});

// Generate decoy during build
await brokenMirror.generateDecoy();
```

### Generated Decoy Example

```javascript
// build/decoy/app.decoy.1234567890.abcdef12.js
// FAKE VULNERABLE CODE - DECOY FOR HACKERS
function authenticateUser(username, password) {
  // SQL Injection vulnerability (FAKE)
  const query = 'SELECT * FROM users WHERE username = "' + username + '"';
  console.log('Executing query: ' + query);
  return true; // Always return true (fake)
}
```

---

## 🛡️ Layer 2: Close Mirror (Protection)

### Qëllimi
Obfuskon dhe mbron kodin real duke përdorur teknika të avancuara.

### Implementation

```typescript
import { CloseMirror } from './security/close-mirror.module';

const closeMirror = new CloseMirror({
  obfuscationLevel: 'maximum',
  antiDebug: true,
  variableRenaming: true,
  controlFlowFlattening: true
});

// Protect source code
const protectedCode = await closeMirror.obfuscateCode(sourceCode);
```

### Protected Code Example

```javascript
// build/protected/app.protected.1234567890.abcdef12.js
(function(){
  'use strict';
  const _0x1a2b=['log','warn','error','debug'];
  const _0x3c4d=function(_0x5e6f,_0x7890){
    _0x5e6f=_0x5e6f-0x0;
    let _0x1abc=_0x1a2b[_0x5e6f];
    return _0x1abc;
  };
  // [Obfuscated code continues...]
})();
```

---

## 🔒 Layer 3: Out Mirror (UI Security)

### Qëllimi
Siguron UI-në me CSP, SRI, dhe timestamped assets.

### Implementation

```typescript
import { OutMirror } from './security/out-mirror.module';

const outMirror = new OutMirror({
  csp: "default-src 'self'; script-src 'self'",
  sri: true,
  timestamping: true
});

// Generate secured HTML
const securedHTML = await outMirror.generateSecuredHTML({
  protectedFileName: 'app.protected.123456.js',
  content: htmlContent
});
```

### Secured HTML Output

```html
<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Security-Policy" content="default-src 'self';">
    <meta name="mirror-defense-timestamp" content="1693123456789">
</head>
<body>
    <script src="app.protected.123456.js" 
            integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC" 
            crossorigin="anonymous"></script>
</body>
</html>
```

---

## 📊 Industrial Dashboard

### Features

- **Real-time Attack Monitoring**: Detekton dhe afishon sulme në kohë reale
- **Live Statistics**: Threats blocked, decoys served, integrity checks
- **Configuration Panel**: CSP management, decoy settings
- **WebSocket Integration**: Updates në kohë reale

### Starting Dashboard

```bash
# Start dashboard server
npm run dashboard

# Development mode with auto-reload
npm run dashboard:dev

# Open browser to http://localhost:3002
```

### Dashboard Screenshots

- **Live Statistics**: Real-time counters dhe metrics
- **Attack Monitor**: Log i sulmeve me severity levels
- **Configuration**: CSP dhe decoy settings
- **System Status**: Uptime, connections, performance

---

## 🔄 CI/CD Integration

### GitHub Actions Pipeline

Pipeline-i automatik `mirror-defense-ci.yml` kryen:

1. **Build Decoys**: Gjeneron false vulnerabilities
2. **Protect Code**: Obfuskon kodin real
3. **Calculate SRI**: Gjeneron hash-et e integritetit
4. **Generate HTML**: Krijon UI të siguruar
5. **Security Report**: Gjeneron raport të plotë
6. **Deploy**: Vendos në production

### Workflow Commands

```bash
# Trigger full pipeline
git push origin main

# Manual build
npm run deploy:industrial

# Check security report
npm run build:report
```

### Pipeline Artifacts

- `build/decoy/` - Fake vulnerable code
- `build/protected/` - Obfuscated real code
- `build/ui/` - Secured HTML with CSP/SRI
- `security-report.json` - Comprehensive security analysis

---

## 🔐 Security Features

### Content Security Policy (CSP)

```javascript
// Automatic CSP injection
const csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";

// CSP configuration në dashboard
updateCSP(newCSPDirectives);
```

### Subresource Integrity (SRI)

```javascript
// Automatic SRI hash calculation
const sriHash = crypto.createHash('sha384').update(content).digest('base64');
const integrity = `sha384-${sriHash}`;

// HTML injection
<script src="app.js" integrity="${integrity}" crossorigin="anonymous"></script>
```

### Timestamped Assets

```javascript
// Cache busting me timestamp
const timestamp = Date.now();
const filename = `app.protected.${timestamp}.${hash}.js`;
```

---

## 📈 Monitoring & Alerts

### Real-time Monitoring

Dashboard-i ofron:

- **Live Attack Feed**: Sulme në kohë reale
- **System Statistics**: Performance metrics
- **Configuration Management**: Settings në kohë reale
- **Alert System**: Njoftimet për sulme të rëndësishme

### WebSocket API

```javascript
// Connect to real-time feed
const ws = new WebSocket('ws://localhost:8080');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  if (data.type === 'attack') {
    handleAttackAlert(data.data);
  }
};
```

### Logs & Reports

```bash
# View security report
cat build/security-report.json

# Check attack logs
curl http://localhost:3002/api/attacks

# System statistics
curl http://localhost:3002/api/stats
```

---

## 🛠️ Development Guide

### Adding New Decoy Types

```typescript
// security/broken-mirror.module.ts
export class BrokenMirror {
  generateCustomDecoy(type: string) {
    switch(type) {
      case 'my-custom-vuln':
        return this.generateCustomVulnerability();
      default:
        return this.generateDefaultDecoy();
    }
  }
}
```

### Custom Obfuscation

```typescript
// security/close-mirror.module.ts
export class CloseMirror {
  customObfuscation(code: string, options: ObfuscationOptions) {
    // Implement custom obfuscation logic
    return obfuscatedCode;
  }
}
```

### Extended Security Headers

```typescript
// security/out-mirror.module.ts
export class OutMirror {
  generateSecurityHeaders() {
    return {
      'Content-Security-Policy': this.csp,
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Strict-Transport-Security': 'max-age=31536000'
    };
  }
}
```

---

## 🚨 Troubleshooting

### Common Issues

**1. SRI Hash Mismatch**
```bash
# Regenerate SRI hashes
npm run build:sri
```

**2. CSP Violations**
```bash
# Check CSP configuration
curl http://localhost:3002/api/config/csp
```

**3. Dashboard Connection Issues**
```bash
# Check WebSocket server
netstat -an | grep 8080
```

**4. Build Failures**
```bash
# Clean and rebuild
npm run clean && npm run deploy:industrial
```

### Debug Mode

```bash
# Enable debug logging
DEBUG=mirror-defense:* npm run dashboard

# Verbose build output
npm run build:mirrors --verbose
```

---

## 📚 API Reference

### Security API

```typescript
// Generate decoy
POST /api/security/decoy
{
  "type": "sql-injection",
  "complexity": "high"
}

// Update protection
POST /api/security/protect
{
  "sourceCode": "...",
  "obfuscationLevel": "maximum"
}

// Generate secured UI
POST /api/security/ui
{
  "html": "...",
  "assets": ["app.js", "style.css"]
}
```

### Dashboard API

```typescript
// Get system stats
GET /api/stats

// Get attack logs
GET /api/attacks?limit=50

// Update CSP
POST /api/config/csp
{
  "csp": "default-src 'self';"
}

// Update decoy config
POST /api/config/decoy
{
  "interval": 30,
  "threatLevel": "high"
}
```

---

## 🎯 Best Practices

### Security

1. **Regular Rotation**: Refresh decoys çdo 30 minuta
2. **SRI Validation**: Gjithmonë use SRI për assets
3. **CSP Strict**: Minimize 'unsafe-inline' directives
4. **Monitoring**: Review attack logs daily

### Performance

1. **Asset Optimization**: Compress protected files
2. **Cache Headers**: Set appropriate cache policies
3. **CDN Integration**: Use CDN për assets të sigurta
4. **Lazy Loading**: Load security features on demand

### Development

1. **Environment Separation**: Different configs për dev/prod
2. **Automated Testing**: Test security features në CI
3. **Code Reviews**: Review security changes carefully
4. **Documentation**: Keep security docs updated

---

## 📄 License

Mirror Defense Industrial është i licensuar nën MIT License.

---

## 🤝 Support

- **GitHub Issues**: Report bugs dhe feature requests
- **Documentation**: Keep updated në çdo release
- **Community**: Join Discord për discussions
- **Enterprise Support**: Contact për 24/7 support

---

## 🔄 Updates & Changelog

### v2.0.0 - Industrial Release
- ✅ Complete CI/CD integration
- ✅ Real-time dashboard
- ✅ Advanced obfuscation
- ✅ Multi-environment support

### v1.0.0 - Initial Release
- ✅ Basic mirror defense layers
- ✅ Decoy generation
- ✅ SRI/CSP implementation

---

*Për pyetje të tjera, referoju dokumentacionit të plotë ose contact support team.*
