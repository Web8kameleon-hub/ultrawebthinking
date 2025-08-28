# 🚨 Web8 Attack Simulation System

## Përshkrimi i Sistemit

Web8 Attack Simulation System është një framework i plotë për simulimin dhe testimin e sulmeve kibernetike kundër platformës UltraWeb. Sistemi përmban mbi **20 vektorë sulmesh** të ndryshëm dhe ofron testim të detajuar të sigurisë.

## ✨ Karakteristikat Kryesore

### 🎯 Vektorët e Sulmeve
- **SQL Injection** - Injektim SQL në forma dhe URL
- **Cross-Site Scripting (XSS)** - Sulme XSS reflected, DOM dhe stored  
- **Path Traversal** - Tentativa për leximin e skedarëve të sistemit
- **Brute Force** - Sulme me forcë ndaj formave të login
- **DDoS Simulation** - Simulim i sulmeve të mohimit të shërbimit
- **Scanner Detection** - Zbulimi i skanerave të sigurisë
- **Bot Attacks** - Simulim i botëve maliciozë
- **CSRF Attacks** - Cross-Site Request Forgery

### 🛡️ Nivelet e Intensitetit
- **LOW** - Teste të sigurta për produksion
- **MEDIUM** - Teste mesatare me rrezikshmëri të ulët
- **HIGH** - Teste të avancuara me rrezikshmëri të lartë
- **EXTREME** - Teste maksimale (vetëm për environment teste)

### 📊 Raportimi
- **Security Score** - Rezultat sigurie nga 0-100%
- **Vulnerability Detection** - Identifikimi i dobësive
- **Performance Metrics** - Koha e përgjigjes dhe statistika
- **Recommendations** - Rekomandimet për përmirësim

## 🚀 Përdorimi

### Web Interface

Hapni dashboard-in e simulimit:
```bash
yarn dev --port 3002
```
Pastaj vizitoni: `http://localhost:3002/attack-sim`

### Command Line Interface

#### Teste të shpejta:
```bash
yarn attack-sim:quick
```

#### Teste të plota:
```bash
yarn attack-sim:full
```

#### Teste ekstreme (kujdes!):
```bash
yarn attack-sim:extreme
```

#### Konfigurimi manual:
```bash
yarn attack-sim --target http://localhost:3000 --intensity HIGH --duration 60 --output report.json
```

### API Usage

#### Nisja e simulimit:
```bash
curl -X POST http://localhost:3002/api/attack-sim \
  -H "Content-Type: application/json" \
  -d '{
    "action": "start",
    "config": {
      "targetUrl": "http://localhost:3000",
      "intensity": "MEDIUM",
      "duration": 30
    }
  }'
```

#### Kontrolli i statusit:
```bash
curl http://localhost:3002/api/attack-sim?action=status
```

## 📋 Vektorët e Disponueshëm

### SQL Injection
1. **Classic SQL Injection** - `' OR '1'='1' --`
2. **Union-based SQL Injection** - `' UNION SELECT password FROM users --`
3. **Blind SQL Injection** - `'; WAITFOR DELAY '00:00:05' --`

### Cross-Site Scripting
1. **Reflected XSS** - `<script>alert('XSS')</script>`
2. **DOM-based XSS** - `javascript:alert(document.cookie)`
3. **Stored XSS** - `<img src=x onerror=alert('Stored XSS')>`

### Path Traversal
1. **Directory Traversal** - `../../../etc/passwd`
2. **Windows Path Traversal** - `..\\..\\..\\windows\\system32\\config\\sam`

### Scanner Detection
1. **Nikto Scanner** - Simulon Nikto web scanner
2. **Directory Scanner** - Enumerimi i direktorive

### Bot Attacks
1. **Malicious Bot** - Bot që shfleton panelin admin
2. **Scraper Bot** - Bot që kopjon të dhënat

## 🔧 Konfigurimi

### Konfigurimi Standard
```typescript
const config: SimulationConfig = {
  targetUrl: 'http://localhost:3000',
  intensity: 'MEDIUM',
  duration: 30,
  concurrent: false,
  logLevel: 'VERBOSE',
  safeguards: true
};
```

### Konfigurimi i Avancuar
```typescript
const advancedConfig: SimulationConfig = {
  targetUrl: 'https://production-site.com',
  intensity: 'HIGH',
  duration: 120,
  concurrent: true,
  logLevel: 'DEBUG',
  safeguards: true
};
```

## 📊 Interpretimi i Rezultateve

### Security Score
- **95-100%** - 🏆 **EXCELLENT** - Siguria është shumë e fortë
- **80-94%** - 👍 **GOOD** - Siguria është solide me përmirësime të vogla
- **60-79%** - ⚠️ **WARNING** - Nevojiten përmirësime të rëndësishme
- **0-59%** - 🚨 **CRITICAL** - Vëmendja e menjëhershme e sigurisë!

### Vulnerability Types
- **SQL Injection vulnerability detected** - Dobësi në validimin e input
- **Cross-Site Scripting vulnerability detected** - Mungon sanitizimi i input
- **Path Traversal vulnerability detected** - Kontrolli i pamjaftueshëm i rrugëve
- **Insufficient brute force protection** - Mbrojtja e dobët kundër sulmeve
- **Scanner detection insufficient** - Zbulimi i pamjaftueshëm i skanerave
- **Bot protection needs improvement** - Mbrojtja e botëve duhet përmirësuar

## 🛡️ Masat e Sigurisë

### Safeguards (Mbrojtjet)
Sistemi ka disa mbrojtje të integruara:

1. **Target Validation** - Validimi i target URL
2. **Duration Limits** - Kufizimi i kohëzgjatjes (max 5 minuta)
3. **Intensity Controls** - Kontrolli i intensitetit
4. **Rate Limiting** - Kufizimi i shpejtësisë së kërkesave
5. **Error Handling** - Menaxhimi i sigurt i gabimeve

### Kujdesi në Përdorim
⚠️ **PARALAJMËRIM SIGURIE:**
- Përdorni vetëm në sisteme që i zotëroni
- Mos përdorni në produksion pa kujdes
- Testi EXTREME duhet përdorur vetëm në environment teste
- Sigurohuni që keni leje eksplicite për testime

## 🔗 Integrimi me Sistemet e Tjera

### Guardian Integration
Sistemi integrohet me Guardian Security System:
```typescript
import { Guardian } from '../backend/guardian/Guardian';
const guardian = new Guardian();
// Guardian do të zbulojë dhe bllokojë sulmet
```

### Intrusion Responder
Reagimi aktiv ndaj sulmeve:
```typescript
import { IntrusionResponder } from '../security/intrusion-responder';
const responder = IntrusionResponder.getInstance();
responder.startMonitoring();
```

## 📝 Log Format

### Console Logs
```
[14:30:25] 🚀 Starting Web8 Attack Simulation...
[14:30:25] 🎯 Target: http://localhost:3000
[14:30:25] 💥 Intensity: MEDIUM
[14:30:25] ⏱️ Duration: 30s
[14:30:26] ✅ Classic SQL Injection: BLOCKED
[14:30:27] ✅ Reflected XSS: BLOCKED
[14:30:28] ❌ Directory Traversal: ALLOWED
[14:30:55] ✅ Simulation completed successfully
[14:30:55] 🛡️ Security Score: 85%
```

### JSON Report
```json
{
  "startTime": "2025-08-28T14:30:25.000Z",
  "endTime": "2025-08-28T14:30:55.000Z",
  "duration": 30,
  "totalAttacks": 15,
  "successfulBlocks": 13,
  "failedBlocks": 2,
  "averageResponseTime": 125.5,
  "summary": {
    "securityScore": 85,
    "vulnerabilities": [
      "Path Traversal vulnerability detected"
    ],
    "recommendations": [
      "Implement path validation",
      "Add input sanitization"
    ]
  }
}
```

## 🧪 Testimi

### Testimi i Sistemit
```bash
# Testo funksionalitetin bazë
npx tsx __tests__/attack-simulation.test.ts

# Testo me vite
yarn test --grep "attack simulation"

# Testo CLI
yarn attack-sim --help
```

### Unit Tests
Sistemi përmban teste të plota:
- ✅ Basic functionality tests
- ✅ Attack vector validation
- ✅ Configuration preset tests
- ✅ Mock simulation tests
- ✅ Security validation tests
- ✅ Error handling tests

## 🔄 Workflow i Rekomanduar

### Për Zhvillim
1. **Daily Scans** - `yarn attack-sim:quick` çdo ditë
2. **Weekly Audits** - `yarn attack-sim:full` çdo javë
3. **Pre-deployment** - Test i plotë para deployment
4. **Production Monitoring** - Monitorim kontinual

### Për Security Auditing
1. **Baseline Test** - Krijo një baseline me `comprehensive` preset
2. **Regular Testing** - Testo rregullisht për regresione
3. **Penetration Testing** - Përdor `extreme` preset në environment teste
4. **Report Analysis** - Analizo raportet dhe implemento përmirësimet

## 📞 Support dhe Kontributi

### Kontakti
- **Autor:** Ledjan Ahmati
- **Email:** dealsjona@gmail.com
- **Versioni:** 8.2.0-ATTACK-SIM

### Kontributi
1. Fork repository
2. Krijo feature branch
3. Implemento vektorë të rinj sulmesh
4. Shto teste
5. Krijo pull request

### Shtimi i Vektorëve të Rinj
```typescript
this.vectors.push({
  name: "New Attack Vector",
  type: "NEW_TYPE",
  payload: "attack payload",
  description: "Përshkrimi i sulmit",
  severity: "HIGH",
  target: "/api/endpoint",
  method: "POST",
  expectedResponse: "BLOCKED"
});
```

## 📚 Dokumentacioni Teknik

### Arkitektura
```
attack-simulator.ts           # Core simulator engine
AttackSimulationDashboard.tsx # React dashboard
attack-sim-cli.ts            # Command line interface
attack-simulation.test.ts    # Comprehensive tests
/api/attack-sim/route.ts    # API endpoints
```

### Dependencies
- Next.js 14.2.31
- TypeScript (strict mode)
- React 18
- Fetch API
- Node.js 18+

### Performance
- Concurrent execution support
- Configurable timeouts
- Memory-efficient vector processing
- Real-time progress tracking

---

🔒 **Mbani mend:** Ky sistem është i fuqishëm dhe duhet përdorur me përgjegjësi. Gjithmonë sigurohuni që keni autoritet dhe leje për të kryer teste sigurie.
