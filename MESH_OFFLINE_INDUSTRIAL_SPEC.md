# EuroWeb Ultra - Mesh Offline Industrial Specification

## 🎯 Objektivi Industrial

**Funksionim pa internet**: ingest i motit/sensorëve, alarme, cache METAR/TAF, sinkronizim kur kthehet lidhja.  
**Prioritet absolut**: `reliability > latency > throughput`

---

## 🔩 Arkitektura (Offline-First Mesh)

### Nodet

| Node Type | Hardware | Funksioni | Range |
|-----------|----------|-----------|-------|
| **GATEWAY-LoRa** | SX1302/SX1276, 868 MHz | MQTT-SN ↔ Mesh | 15-20 km |
| **RELAY** | ESP32/RPi + Wi-Fi Direct + LoRa | Bridge paketash | 100-200 m |
| **GROUND** | Stacione tokësore | Sensore: wind/temp/QNH/vis | 50-100 m |
| **FLIGHT** (demo) | ADS-B ingest ose GPS beacon | Flight tracking | 100+ km |
| **EDGE-CACHE** | LiteFS/SQLite | Store-and-forward | Local |
| **SAT-FALLBACK** (Enterprise) | Iridium/Starlink | Uplink fallback | Global |

### Transport Layers

| Layer | Protocol | Payload Size | Use Case |
|-------|----------|--------------|----------|
| **LoRa** | MQTT-SN/CoAP (CBOR) | 51–222 B | Long-range messaging |
| **Wi-Fi Direct** | gossipsub (libp2p) | Variable | Local mesh (100-200m) |
| **DTN** | Bundle + Spray-and-Wait | Variable | Hop-hop sync offline |

### Rrugëzimi (Routing)

```
Priority Queues:
1. aviation (METAR/TAF) - Priority 0
2. alerts (wind/QNH) - Priority 1  
3. sensors (routine) - Priority 2
4. telemetry (health) - Priority 3

Epidemic Fallback: kur nuk ka topologji stabile
Deduplication: msg_id + origin_id + timestamp
```

---

## 🔐 Siguria (Industrial Grade)

### Kriptografia

```
Nënshkrimi: Ed25519 (header + payload) → verifikohet në çdo hop
Kriptimi: XChaCha20-Poly1305 (nonce = timestamp|seq|origin_id)
Attestation: hash firmware + device cert → attest.log
PQ-Ready: Kyber encapsulation për gateway↔core (opsional)
```

### Verifikimi

```
1. Signature validation në çdo hop
2. Nonce anti-replay (±90s tolerance)
3. Device attestation për firmware integrity
4. Geofence quarantine për breach detection
```

---

## 🛰️ GPS & Geofencing

### Node Location Broadcasting

```javascript
// Çdo node publikon çdo 30s
{
  lat: 45.12345,
  lon: 11.67890, 
  alt: 123.4,
  snr: -85,
  battery: 87
}
```

### Nearest Airport Mapping

```javascript
// Haversine distance calculation
function nearestICAO(lat, lon) {
  // Return: { icao: 'EDDF', distance: 12.5 }
}
```

### Geofence Security

```
IF node exits authorized polygon:
  → "quarantine mode" (RX only, no TX)
  → alert core system
  → require manual re-authorization
```

---

## 💶 UTT Offline Billing

### Usage Ledger

```javascript
// Local usage.cborlz (CBOR + LZ4 compression)
{
  node_id: "GW001",
  usage: [
    { ts: 1693934400, type: "metar_req", cost: 0.001 },
    { ts: 1693934430, type: "alert_sent", cost: 0.005 },
    { ts: 1693934460, type: "data_mb", size: 0.5, cost: 0.010 }
  ],
  total_pending: 0.016,
  last_settlement: 1693930800
}
```

### E-Vouchers (Offline)

```
UTT QR Codes për offline transactions:
- Pre-paid credits për emergency operations
- Reconcile automatikisht kur kthehet internet
- Cryptographic proof për validity
```

### Pricing Formula

```
price = w1*requests + w2*alerts + w3*megabytes
Weights: w1=0.001, w2=0.005, w3=0.020
Settlement: debit UTT account në core API
```

---

## 🗃️ Packet Format (64-byte header)

```c
struct MeshHeader {
  uint8_t  version;           // Protocol version (1)
  uint8_t  msg_type;          // 0=METAR,1=TAF,2=SENSOR,3=ALERT,4=CONTROL
  uint16_t sequence;          // Anti-replay counter
  uint32_t timestamp;         // Unix epoch seconds
  uint32_t origin_id;         // Unique node identifier
  uint32_t icao_code;         // Airport code as uint32 ('EDDF')
  uint8_t  ttl;              // Time-to-live (hops)
  uint8_t  priority;         // 0=highest, 255=lowest
  uint8_t  flags;            // Bit flags: signed|encrypted|ack_required
  uint8_t  reserved;         // Future use
  uint8_t  signature[32];    // Ed25519 signature (truncated)
} __attribute__((packed));
```

### Payload Format (CBOR)

```javascript
// METAR payload
{
  wind_speed: 15,
  wind_gust: 23,
  wind_dir: 270,
  qnh: 1013.2,
  visibility: 9999,
  temperature: 15.5,
  raw_metar: "EDDF 261020Z 27015G23KT 9999 SCT030 15/09 Q1013"
}
```

---

## 🔔 Alert Rules (Edge Processing)

### Critical Thresholds

```javascript
const ALERT_RULES = {
  wind: {
    speed_max: 35,        // kt
    gust_delta: 8,        // kt/10min
    direction_shift: 45   // degrees/5min
  },
  pressure: {
    qnh_drop: 2.0,        // hPa/30min
    qnh_min: 980,         // hPa absolute
    qnh_max: 1050         // hPa absolute
  },
  visibility: {
    minimum: 2000         // meters
  },
  system: {
    offline_threshold: 15, // minutes
    battery_critical: 10,  // percent
    signal_min: -120       // dBm
  }
}
```

### Alert Processing

```javascript
function processAlert(sensorData) {
  const alerts = []
  
  if (sensorData.wind_speed > ALERT_RULES.wind.speed_max) {
    alerts.push({
      type: 'WIND_SPEED',
      severity: 'HIGH',
      value: sensorData.wind_speed,
      threshold: ALERT_RULES.wind.speed_max
    })
  }
  
  return alerts
}
```

---

## 🖥️ UI Industrial (Mesh Panel)

### Real-time Map (MapLibre)

```javascript
// Network topology visualization
const meshMap = {
  nodes: [
    { id: 'GW001', lat: 45.123, lon: 11.678, type: 'gateway', status: 'online' },
    { id: 'REL001', lat: 45.124, lon: 11.679, type: 'relay', status: 'online' },
    { id: 'GND001', lat: 45.125, lon: 11.680, type: 'ground', status: 'offline' }
  ],
  links: [
    { from: 'GW001', to: 'REL001', quality: 0.95, latency: 150 },
    { from: 'REL001', to: 'GND001', quality: 0.78, latency: 300 }
  ],
  heatmap: {
    wind: [...],      // Wind speed overlay
    signal: [...],    // Signal strength overlay
    coverage: [...]   // Coverage area overlay
  }
}
```

### SLA Dashboard (Offline Capable)

```javascript
const slaMetrics = {
  delivery_ratio: 0.96,         // % packets delivered
  p95_latency: 450,            // ms
  cache_age: {
    metar: 180,                // seconds since last update
    taf: 900,                  // seconds since last update
    sensors: 30                // seconds since last update
  },
  network_health: 0.94,        // overall health score
  offline_duration: 0,         // seconds offline
  pending_settlements: 5       // UTT transactions pending
}
```

### Controls Panel

```javascript
const meshControls = {
  satellite_mode: true,        // Satellite fallback enabled
  rate_limit: {
    metar: 10,                // requests/hour
    alerts: 100,              // alerts/hour
    data: 50                  // MB/hour
  },
  ota_channel: 'stable',      // beta|stable|custom
  geofence: {
    enabled: true,
    radius: 50000             // meters
  },
  emergency_mode: false       // Bypass rate limits
}
```

---

## 🧪 Test & Failover Plan

### Stress Tests

| Test Scenario | Target | Success Criteria |
|---------------|--------|------------------|
| **Air-gap Test** | Internet disconnection | METAR/TAF served from cache, alerts delivered via mesh |
| **Packet Loss 30%** | Network degradation | Delivery ratio ≥ 90% for alerts |
| **Geofence Breach** | Security violation | Node quarantined, no TX capability |
| **Clock Skew ±90s** | Time synchronization | Nonce tolerance maintained |
| **Recovery Test** | Network restoration | Reconciliation < 60s (usage + data) |

### Failover Procedures

```javascript
// Automatic failover sequence
const failoverPlan = {
  primary: 'ethernet',
  fallback1: 'wifi',
  fallback2: 'lora_mesh',
  fallback3: 'satellite',
  emergency: 'store_and_forward'
}
```

---

## 🧱 Module Implementation Plan

### Core Modules

| Module | File | Responsibility |
|--------|------|----------------|
| **Radio Driver** | `edge/mesh-radio.ts` | LoRa SX1302 + rate control + EU868 duty cycle |
| **Mesh Networking** | `edge/mesh-link.ts` | Wi-Fi Direct + libp2p gossipsub |
| **Store & Forward** | `edge/mesh-dtn.ts` | DTN + deduplication + TTL management |
| **Security** | `edge/mesh-sec.ts` | Ed25519 + XChaCha20 + attestation |
| **GPS Engine** | `edge/gps.ts` | NMEA parser + nearest-ICAO lookup |
| **Alert Engine** | `edge/alerts.ts` | Threshold rules + priority queues |
| **Local Cache** | `edge/cache.ts` | SQLite/LiteFS + CRDT conflict resolution |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/mesh/ingest` | POST | Packet verification + persist + rebroadcast |
| `/api/mesh/status` | GET | Network topology + health metrics |
| `/api/mesh/settle-utt` | POST | UTT usage reconciliation |
| `/api/mesh/config` | GET/PUT | Mesh configuration management |
| `/api/mesh/alerts` | GET | Active alerts + history |

### Frontend Components

| Component | File | Purpose |
|-----------|------|---------|
| **Mesh Panel** | `components/MeshPanel.tsx` | Main dashboard |
| **Network Map** | `components/NetworkMap.tsx` | MapLibre topology view |
| **SLA Dashboard** | `components/SLADashboard.tsx` | Performance metrics |
| **Alert Console** | `components/AlertConsole.tsx` | Real-time alerts |
| **UTT Billing** | `components/UTTBilling.tsx` | Offline billing status |

---

## 🚦 Implementation Roadmap

### Week 1: Core Infrastructure
- ✅ Radio link + CBOR payload + signing
- ✅ Basic cache + alert rules
- ✅ Initial mesh-radio.ts module

### Week 2: Networking & GPS
- 🔄 DTN + Wi-Fi Direct relay
- 🔄 GPS/geofence integration
- 🔄 Mesh Panel v1 (basic UI)

### Week 3: Advanced Features
- 🔄 OTA updates + Satellite Mode toggle
- 🔄 UTT ledger offline + reconcile API
- 🔄 Security hardening

### Week 4: Enterprise Ready
- 🔄 Nowcasting v1 on edge
- 🔄 SLA dashboards + monitoring
- 🔄 Pilot enterprise deployment

---

## 🎖️ Success Criteria

1. **Offline Operation**: 72+ hours without internet, full functionality
2. **Message Delivery**: 99%+ critical alerts delivered within 10s
3. **Security**: Zero successful replay/injection attacks in testing
4. **Billing**: 100% UTT transaction reconciliation accuracy
5. **Performance**: <500ms P95 latency for local mesh operations

---

**Status**: 🚀 **READY FOR IMPLEMENTATION**

This specification provides the complete industrial framework for transforming the Aviation Platform into an offline-first, mesh-capable system that operates reliably without internet connectivity while maintaining full security, billing, and performance requirements.
