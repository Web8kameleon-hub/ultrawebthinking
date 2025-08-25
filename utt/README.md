# UTT-Albion Module Stack

## 🚀 Industrial TypeScript Modules for UTT × Albion (ALB) Integration

**Version:** 8.0.0-WEB8  
**Author:** Ledjan Ahmati  
**Contact:** dealsjona@gmail.com

---

## 📦 Module Overview

### 1. **albion-token.ts** - Token Definition & Utilities
- ALB token metadata (mint, decimals, €1000 value)
- Conversion functions (toBaseUnits, toUiAmount, toEurValue)
- Validation & formatting utilities

### 2. **albion-connection.ts** - Solana Connection Manager
- Multi-cluster support (mainnet, devnet, testnet, localnet)
- Environment-based configuration
- Connection health monitoring
- Explorer URL generation

### 3. **phantom-integration.ts** - Phantom Wallet Integration
- Connect/disconnect functionality
- Transaction signing (individual & batch)
- Auto-connect for returning users
- Error handling & user feedback

### 4. **utt-bridge.ts** - SPL Token Operations
- ALB balance checking
- Transfer transaction building
- Associated token account management
- Fee estimation & validation

### 5. **utt-physical.ts** - Physical Token Interface
- NFC chip data structure
- QR code deep link generation
- Anti-counterfeit verification
- Hologram security features

### 6. **utt-audit.ts** - Audit & Security Layer
- Comprehensive transaction logging
- Security event monitoring
- Identity mapping (DID support)
- Integrity verification (SHA256)

### 7. **utt-gateway.ts** - Integration Layer
- LoRa Gateway reporting
- AGI Dashboard integration
- Search Ultra Engine indexing
- Real-time metrics collection

---

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
yarn add @solana/web3.js @solana/spl-token
```

### 2. Environment Configuration
```bash
# .env.local
NEXT_PUBLIC_SOLANA_CLUSTER=devnet
# or
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 3. Import & Initialize
```typescript
import { initializeUTT } from '@/utt';

// Initialize the system
await initializeUTT();
```

---

## 🎯 Quick Start Examples

### Basic ALB Transfer
```typescript
import { getConnection, connectPhantom, signAndSendWithPhantom } from '@/utt';
import { buildAlbTransferTx, pubkeyFrom } from '@/utt';

// Connect to wallet
const wallet = await connectPhantom();
const connection = getConnection();

// Build transfer transaction
const tx = await buildAlbTransferTx(
  connection,
  wallet.publicKey,
  pubkeyFrom("RECIPIENT_ADDRESS"),
  1.5 // 1.5 ALB = €1500
);

// Sign and send
const signature = await signAndSendWithPhantom(connection, tx);
console.log('Transfer completed:', signature);
```

### Check ALB Balance
```typescript
import { getAlbBalance, getConnection } from '@/utt';

const connection = getConnection();
const balance = await getAlbBalance(connection, "WALLET_ADDRESS");

if (balance) {
  console.log(`Balance: ${balance.balance} ALB (€${balance.balance * 1000})`);
}
```

### Physical Token Generation
```typescript
import { createPhysicalToken, buildNfcPayload, buildQrDeepLink } from '@/utt';

// Create physical token
const token = createPhysicalToken(10, "OWNER_ADDRESS"); // 10 ALB

// Generate NFC payload
const nfcData = buildNfcPayload(token);

// Generate QR code for payments
const qrLink = buildQrDeepLink(1, "RECIPIENT_ADDRESS", "Payment for services");
```

### Audit Logging
```typescript
import { logTransaction, generateSecurityReport } from '@/utt';

// Log a transaction
await logTransaction(
  "FROM_ADDRESS",
  "TO_ADDRESS", 
  5.0, // 5 ALB
  "TRANSACTION_SIGNATURE",
  "success"
);

// Generate security report
const report = await generateSecurityReport(7); // Last 7 days
console.log('Security status:', report.securityLevel);
```

---

## 🔐 Security Features

### Anti-Counterfeit Protection
- NFC signature verification
- Hologram pattern generation
- Timestamp validation
- Mint address verification

### Audit Trail
- SHA256 integrity hashing
- Immutable transaction logs
- Identity mapping (DID support)
- Security event monitoring

### Multi-Layer Validation
- Address format validation
- Amount range checking
- Fee estimation
- Network status verification

---

## 🌐 Integration Points

### LoRa Gateway
```typescript
import { reportLoRaTransaction } from '@/utt';

await reportLoRaTransaction(
  "DEVICE_ID",
  2.5, // 2.5 ALB
  "RECIPIENT_ADDRESS",
  "TX_SIGNATURE"
);
```

### AGI Dashboard
```typescript
import { postGatewayMetrics } from '@/utt';

await postGatewayMetrics({
  timestamp: Date.now(),
  source: 'agi',
  type: 'transaction',
  data: { amount: 1.0, signature: 'TX_SIG' }
});
```

### Search Ultra Engine
```typescript
import { reportToSearchEngine } from '@/utt';

await reportToSearchEngine(
  'transaction',
  'TX_SIGNATURE',
  { amount: 3.0, valueEUR: 3000 }
);
```

---

## 📊 Real-time Monitoring

### Dashboard Data
```typescript
import { getDashboardData } from '@/utt';

const data = await getDashboardData();
console.log('Total transactions:', data.totalTransactions);
console.log('Total volume:', data.totalVolume, 'ALB');
console.log('Unique addresses:', data.uniqueAddresses);
```

### Security Reports
```typescript
import { generateSecurityReport } from '@/utt';

const report = await generateSecurityReport(30); // Last 30 days
console.log('Threats detected:', report.threats);
console.log('Recommendations:', report.recommendations);
```

---

## 🎨 Token Economics

- **Symbol:** ALB
- **Decimals:** 6
- **Value:** €1000 per ALB
- **Max Supply:** 1,000,000 ALB
- **Total Value:** €1,000,000,000

---

## 🚀 Production Deployment

### Mainnet Configuration
```bash
NEXT_PUBLIC_SOLANA_CLUSTER=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### API Endpoints
- `/api/audit` - Audit log storage
- `/api/agi/metrics` - AGI dashboard metrics
- `/api/search/index` - Search engine indexing
- `/api/dashboard/realtime` - Real-time data

---

## 🎯 Next Steps

1. **Deploy API endpoints** for audit & metrics storage
2. **Integrate with Phantom wallet** for production use
3. **Setup LoRa Gateway** hardware for IoT integration
4. **Configure Search Ultra Engine** for transaction indexing
5. **Implement AGI Dashboard** for real-time monitoring

---

**Ready for industrial deployment! 🚀**
