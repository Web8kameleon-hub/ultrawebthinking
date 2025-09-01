# 🧪 AGI SANDBOX - SAFE TESTING ENVIRONMENT

## Purpose
Zero-risk testing environment për AGI komponentin me 0 fake data dhe plotësisht të sigurt.

## ✅ Safety Features

### 🛡️ Production Protection
- **No Database Access**: Sandbox NUK ka qasje në production database
- **Isolated Environment**: Komplet i izoluar nga production sistemi
- **Safe API Endpoints**: Përdor `/api/sandbox/*` endpoints vetëm
- **Zero Risk**: Asnjë rrezik për data corruption ose system damage

### 📊 Real Data Testing
- **No Fake Data**: Të gjitha vlerat kanë provenance të vërtetë
- **TTL Validation**: Kontrollon skadimet e të dhënave automatikisht
- **Provenance Tracking**: Çdo vlerë ka source dhe timestamp
- **Error Handling**: Tregon specific missing tool messages

## 🚀 How to Use

### 1. Launch Sandbox
```powershell
.\launch-sandbox.ps1
```

### 2. Start Development Server
```bash
yarn dev
```

### 3. Access Sandbox
Navigate to: `http://localhost:3000/sandbox/test`

### 4. Verify Safety
Look for 🧪 SANDBOX indicators on all data elements.

## 📋 Available Test Endpoints

### Sandbox AGI API: `/api/sandbox/agi`

**Safe Test Endpoints:**
- `SANDBOX.NEURAL_CONNECTIONS` - Neural monitor testing
- `SANDBOX.PROCESSING_SPEED` - CPU monitor testing  
- `SANDBOX.LEARNING_RATE` - Learning monitor testing
- `SANDBOX.RESPONSE_TIME` - Latency monitor testing
- `SANDBOX.LATENCY` - Network latency testing
- `SANDBOX.THROUGHPUT` - Data throughput testing
- `SANDBOX.SECURITY_LEVEL` - Security status testing

## 🔍 What You'll See

### Visual Indicators
- 🧪 **SANDBOX** label on every data element
- 🟢 Green color scheme for safety
- Clear "Safe testing environment" messages
- "No production impact" confirmations

### Test Data Values
- **Neural Connections**: 1,250,000 (realistic test value)
- **Processing Speed**: 12.8 TFLOPS (realistic test value)
- **Learning Rate**: 94.7% (realistic test value)
- **Response Time**: 47ms (realistic test value)
- **Latency**: 23ms (realistic test value)
- **Throughput**: 8.9 GB/s (realistic test value)
- **Security Level**: SECURE (realistic test value)

## ⚙️ Technical Implementation

### RealGuard Protection
Çdo element është mbrojtur me `SandboxGuard` që:
- Kontrollon provenance validation
- Tregon TTL expiration
- Handles missing data gracefully
- Shows specific fix instructions

### Safe API Client
`sandboxAgiCall()` function që:
- Routes vetëm në sandbox endpoints
- Includes safety headers
- Validates sandbox mode
- Returns structured error messages

### Provenance Validation
Çdo vlerë ka:
```typescript
{
  source: 'sandbox-monitor-test',
  fetchedAt: '2025-08-29T...',
  ttlSeconds: 30,
  isSandbox: true,
  validationLevel: 'TESTING'
}
```

## 🧪 Testing Workflow

### 1. Verify Environment
- Check that all data shows 🧪 SANDBOX indicator
- Confirm green safety theme is active
- Look for safety messages

### 2. Test Provenance System
- Wait for TTL expiration (30 seconds)
- Verify "Data stale (TTL expired)" message appears
- Confirm refresh fetches new data

### 3. Test Error Handling
- Kill sandbox server temporarily
- Verify proper error messages with fix instructions
- Confirm no crashes or undefined behavior

### 4. Test Real Data Flow
- Verify no `Math.random()` or `performance.now()` usage
- Check that all data comes from structured API responses
- Confirm provenance tracking works correctly

## 🛡️ Safety Guarantees

### What's Protected
✅ Production database remains untouched  
✅ Real user data is never affected  
✅ Production APIs are never called  
✅ System state is never modified  
✅ Configuration remains unchanged  

### What's Tested
✅ RealGuard component behavior  
✅ Provenance validation logic  
✅ TTL expiration handling  
✅ Error message display  
✅ API integration patterns  
✅ Data structure validation  

## 🔄 Conversion Process

### From Fake to Real (Safe Testing)
1. **Identify Fake Data**: Math.random(), hardcoded values
2. **Replace with Sandbox API**: Use `sandboxAgiCall()`
3. **Add RealGuard**: Wrap with `SandboxGuard`
4. **Test in Sandbox**: Verify behavior safely
5. **Apply to Production**: Once sandbox tests pass

### Example Conversion
```typescript
// ❌ OLD FAKE
const fakeValue = Math.random() * 1000

// ✅ NEW REAL (in sandbox)
const realValue = await sandboxAgiCall('SANDBOX.METRIC', {})
```

## 📝 Next Steps

### After Sandbox Testing
1. **Verify Safety**: All tests pass in sandbox
2. **Document Changes**: What was converted from fake to real
3. **Production Ready**: Apply same patterns to production components
4. **Monitor**: Watch for any issues in real environment

### Continuous Testing
- Run sandbox tests before every deployment
- Verify new components in sandbox first
- Use sandbox for training new developers
- Test error scenarios safely

---

**Remember**: Sandbox është 100% i sigurt për testim. Experimentoni lirshëm pa asnjë frikë!
