# 🛡️ Guardian Security System

## Overview
Guardian është një sistem real-time security monitoring dhe emergency response për EuroWeb platform.

## Features

### 🚨 Emergency Block System
- **Manual Blocking**: Block IP addresses immediately through Guardian UI
- **AGI Commands**: Use natural language commands like "Guardian, blloko IP 203.0.113.45"
- **Auto-Detection**: Automatic blocking based on suspicious activity

### 📊 Real-time Monitoring
- High request rate detection (>100 req/min)
- Large payload monitoring (>500KB)
- Suspicious user agent detection
- API abuse protection

### 🔧 Configuration

#### Auto-Block Rules
```typescript
// High request rate
if (requestCount > 100) {
  autoBlock(ip, 'High request rate');
}

// Large payload
if (payloadSize > 500000) {
  autoBlock(ip, 'Large payload detected');
}

// Suspicious user agents
const suspiciousAgents = [
  'python-requests',
  'curl',
  'wget',
  'bot',
  'crawler'
];
```

## Usage

### Access Guardian Panel
Navigate to `/guardian` to access the Guardian Control Panel.

### AGI Commands
Use natural language commands in the command interface:
- `Guardian, blloko IP 192.168.1.100`
- `Guardian, block IP 10.0.0.1`

### API Endpoints

#### Emergency Block
```bash
POST /api/guardian/emergency-block
Content-Type: application/json

{
  "ip": "203.0.113.45",
  "reason": "Suspicious activity detected"
}
```

#### Get Blocked IPs
```bash
GET /api/guardian/emergency-block
```

### File Structure
```
guardian/
├── blocked-ips.json     # List of blocked IP addresses
└── security-logs.json  # Security event logs
```

### Integration with Middleware
Guardian is automatically integrated with Next.js middleware for real-time protection.

## Security Alerts

### Alert Types
- 🚀 **High Rate**: Too many requests per minute
- 📦 **Large Payload**: Oversized request payload
- 🕵️ **Suspicious Agent**: Automated tools detected

### Notifications
- Console logging
- File-based logging
- Real-time UI updates
- Future: Slack/Discord webhooks

## Development

### Adding New Security Rules
Edit `lib/guardian-middleware.ts` to add new detection rules:

```typescript
function performSecurityChecks(ip: string, request: Request) {
  // Add your custom security logic here
  if (customSecurityCheck(request)) {
    return { 
      shouldBlock: true, 
      reason: 'Custom security violation detected' 
    };
  }
}
```

### Testing
```bash
# Test with curl
curl -H "User-Agent: python-requests/2.28.1" http://localhost:3000/

# Should trigger auto-block
```

## Production Deployment

### Environment Variables
```bash
GUARDIAN_ENABLED=true
GUARDIAN_LOG_LEVEL=info
GUARDIAN_WEBHOOK_URL=https://hooks.slack.com/...
```

### Monitoring
Guardian logs all security events to:
- `guardian/security-logs.json`
- Console output
- External monitoring services (configurable)

---

**⚠️ Important**: Guardian është një sistem sigurie real-time. Konfiguroni me kujdes për të shmangur bllokimin e trafikut legjitimat.
