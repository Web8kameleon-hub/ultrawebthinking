# 🌐 Web8 Mesh Network Activation Guide

## Aktivizimi i Rrjetit Mesh nga Gjermania deri në Shqipëri

Ky guide ju tregon si të aktivizoni dhe menaxhoni rrjetin mesh që bashkon node-t tuaja nga Gjermania deri në Shqipëri.

## 🚀 Hapat për Aktivizim

### 1. **Nisja e Backend Server**

```bash
# Nise backend server me mesh support
cd backend
yarn install
yarn dev
```

Serveri do të jetë gati në: `http://localhost:4000`

### 2. **Aktivizimi Automatik i Mesh Network**

Backend serveri automatikisht fillon mesh discovery pas 5 sekondave. Por mund ta aktivizoni edhe manualisht:

```bash
# Nise mesh network manually
node backend/start-mesh.js
```

### 3. **Qasja në Mesh Control Panel**

1. Hape frontend: `http://localhost:3000`
2. Shko te tab-i "🌐 Mesh Network" 
3. Kliko "🚀 Activate Network" nëse nuk është aktivizuar automatikisht

## 📡 Konfigurimi i Node-ve të Reja

### Pre-configured Regions:

- **🇩🇪 Germany**: `de1.euroweb.network:4000`, `de2.euroweb.network:4000`
- **🇦🇹 Austria**: `at1.euroweb.network:4000`
- **🇸🇮 Slovenia**: `si1.euroweb.network:4000`
- **🇭🇷 Croatia**: `hr1.euroweb.network:4000`
- **🇲🇪 Montenegro**: `me1.euroweb.network:4000`
- **🇦🇱 Albania**: `al1.euroweb.network:4000`, `al2.euroweb.network:4000`
- **🇽🇰 Kosova**: `xk1.euroweb.network:4000`

### Shtimi i Node-ve të Reja:

1. **Përmes UI (Web Interface)**:
   - Shko te "Mesh Network" tab
   - Përdor formularin "Add New Node to Network"
   - Fut IP/hostname, port dhe zgjidh regionin
   - Kliko "🔗 Connect Node"

2. **Përmes API**:
```bash
curl -X POST http://localhost:4000/api/mesh/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "host": "192.168.1.100",
    "port": 4000,
    "region": "albania",
    "type": "client"
  }'
```

## 🔍 Monitorimi i Rrjetit

### Real-time Status
- **Active Nodes**: Shikon sa node janë online
- **Network Health**: Përqindja e shëndetit të rrjetit
- **Average Latency**: Vonesë mesatare ndërmjet node-ve
- **Total Bandwidth**: Bandwidth i kombinuar

### Regional Distribution
Harta tregon se si janë shpërndarë node-t sipas vendeve:
- 🇩🇪 Germany
- 🇦🇹 Austria  
- 🇸🇮 Slovenia
- 🇭🇷 Croatia
- 🇲🇪 Montenegro
- 🇦🇱 Albania
- 🇽🇰 Kosova

## ⚙️ API Endpoints

### Mesh Network Management

| Endpoint | Method | Pershkrim |
|----------|--------|-----------|
| `/api/mesh/status` | GET | Merr statusin e rrjetit |
| `/api/mesh/nodes` | GET | Lista e të gjithë node-ve |
| `/api/mesh/activate` | POST | Aktivizon rrjetin mesh |
| `/api/mesh/nodes` | POST | Shton node të ri |
| `/api/mesh/discover` | POST | Fillon discovery të ri |
| `/api/mesh/telemetry` | GET | Merr telemetri live |

### Shembuj përdorimi:

```javascript
// Merr statusin e rrjetit
const status = await fetch('/api/mesh/status').then(r => r.json());
console.log(`Active nodes: ${status.data.activeNodes}/${status.data.totalNodes}`);

// Shto node të ri
await fetch('/api/mesh/nodes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    host: 'my-server.com',
    port: 4000,
    region: 'albania',
    type: 'relay'
  })
});
```

## 🔐 Siguria dhe Enkriptimi

- **RSA Encryption**: Çdo node përdor RSA 2048-bit keypair
- **Handshake Protocol**: Verifikim mutual i identitetit
- **Signature Verification**: Të gjitha mesazhet janë të nënshkruara
- **Secure Channels**: Komunikim i enkriptuar ndërmjet node-ve

## 🛠️ Troubleshooting

### Node nuk lidhet:
1. Kontrollo nëse IP/port është i saktë
2. Verifikoni firewall settings
3. Testoni ping dhe telnet connectivity
4. Shikoni logs në backend console

### Network Health i ulët:
1. Kliko "🔍 Discover Nodes" për re-discovery
2. Hiq node-t që janë offline
3. Kontrollo latency dhe bandwidth
4. Restart mesh network nëse nevojitet

### Gabime të shpeshta:
- **Connection Timeout**: Node nuk përgjigjet brenda 5 sekondash
- **Handshake Failed**: Probleme me sigurinë ose version compatibility
- **Route Optimization**: Sistem automatikisht zgjedh rrugët më të mira

## 📈 Optimizimi i Performance

### Best Practices:
1. **Supernodes**: Vendos në vende strategjike (Germany, Albania)
2. **Relay Nodes**: Përdor për transit të trafikut
3. **Edge Nodes**: Connect local devices dhe sensore
4. **Load Balancing**: Shpërndaj ngarkesën ndërmjet node-ve

### Network Topology:
```
Germany (Supernodes) 
    ↓
Austria/Slovenia (Relays)
    ↓  
Croatia/Montenegro (Relays)
    ↓
Albania/Kosova (Supernodes + Edges)
```

## 🔄 Maintenance

### Automatic Tasks:
- **Heartbeat**: Çdo 30 sekonda
- **Discovery**: Çdo 5 minuta
- **Route Optimization**: Çdo 10 minuta
- **Telemetry Broadcast**: Çdo 1 minutë

### Manual Operations:
- **Full Network Restart**: POST `/api/mesh/shutdown` pastaj `/api/mesh/activate`
- **Node Health Check**: GET `/api/mesh/nodes/:nodeId`
- **Force Discovery**: POST `/api/mesh/discover`

---

## 🎯 Qëllimi Final

Ky sistem ju lejon të keni një rrjet të decentralizuar dhe të shpërndarë që:

✅ **Bashkon node-t nga Gjermania deri në Shqipëri**  
✅ **Automatic discovery dhe connection**  
✅ **Load balancing dhe route optimization**  
✅ **Real-time monitoring dhe telemetri**  
✅ **Secure encryption dhe authentication**  
✅ **Scalable architecture për shtimin e node-ve të reja**  

Tani mund të keni një rrjet mesh që punon si një organizëm i vetëm, pavarësisht se node-t janë të shpërndarë në gjithë Evropën! 🌍
