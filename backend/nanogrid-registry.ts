/**
 * Nanogrid Node Registration API
 * 
 * WhatsApp-style registration where users become nodes by registering their phone.
 * All nodes are opt-in - no device participates without explicit consent.
 */

import express from 'express';
import crypto from 'crypto';

// Node Types
export type NodeType = 'mobile' | 'desktop' | 'gateway' | 'server' | 'iot';
export type NodeStatus = 'pending' | 'active' | 'inactive' | 'suspended';

// Node Interface
export interface NanogridNode {
  nodeId: string;
  phoneHash: string;           // SHA-256 hash of phone number (privacy)
  phoneCountry: string;        // Country code (e.g., +355, +49)
  nodeType: NodeType;
  status: NodeStatus;
  capabilities: NodeCapabilities;
  consent: NodeConsent;
  metrics: NodeMetrics;
  createdAt: Date;
  lastSeen: Date;
  location?: {
    country: string;
    region?: string;
    lat?: number;
    lng?: number;
  };
}

export interface NodeCapabilities {
  canRelay: boolean;           // Can transport messages
  canStore: boolean;           // Can store-and-forward
  maxBandwidth: number;        // KB/s
  maxStorage: number;          // MB
  protocols: string[];         // ['ble', 'wifi', 'lora', 'nfc']
  batteryPowered: boolean;
}

export interface NodeConsent {
  acceptedTerms: boolean;
  acceptedAt: Date;
  allowRelay: boolean;
  allowStorage: boolean;
  maxDataUsageMB: number;
  maxBatteryUsage: number;     // Percentage 0-100
}

export interface NodeMetrics {
  messagesRelayed: number;
  bytesTransferred: number;
  uptime: number;              // Seconds
  lastPing: Date;
  signalStrength: number;      // 0-100
}

// In-memory storage (replace with MongoDB in production)
const nodes: Map<string, NanogridNode> = new Map();
const verificationCodes: Map<string, { code: string; expires: Date; phone: string }> = new Map();

// Generate unique node ID
function generateNodeId(phoneCountry: string): string {
  const prefix = phoneCountry.replace('+', '');
  const random = crypto.randomBytes(6).toString('hex').toUpperCase();
  return `NG-${prefix}-${random}`;
}

// Hash phone number for privacy
function hashPhone(phone: string): string {
  return crypto.createHash('sha256').update(phone).digest('hex');
}

// Generate 6-digit verification code
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Express Router
const router = express.Router();

/**
 * POST /api/nanogrid/register
 * Step 1: Request registration with phone number
 */
router.post('/register', (req, res) => {
  try {
    const { phone, country, nodeType = 'mobile' } = req.body;
    
    if (!phone || !country) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number and country code required' 
      });
    }
    
    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');
    const fullPhone = `${country}${cleanPhone}`;
    
    // Check if already registered
    const phoneHash = hashPhone(fullPhone);
    const existingNode = Array.from(nodes.values()).find(n => n.phoneHash === phoneHash);
    
    if (existingNode && existingNode.status === 'active') {
      return res.status(409).json({ 
        success: false, 
        error: 'Phone already registered as active node',
        nodeId: existingNode.nodeId
      });
    }
    
    // Generate verification code
    const code = generateVerificationCode();
    const sessionId = crypto.randomBytes(16).toString('hex');
    
    verificationCodes.set(sessionId, {
      code,
      expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      phone: fullPhone
    });
    
    console.log(`📱 Nanogrid registration started: ${country}****** - Code: ${code}`);
    
    // In production: Send SMS via Twilio/Vonage/etc.
    // For now: Return the session ID and mock the code
    res.json({
      success: true,
      message: 'Verification code sent',
      sessionId,
      // REMOVE IN PRODUCTION - only for testing
      _testCode: process.env.NODE_ENV === 'development' ? code : undefined,
      expiresIn: 600
    });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/nanogrid/verify
 * Step 2: Verify code and create node
 */
router.post('/verify', (req, res) => {
  try {
    const { sessionId, code, nodeType = 'mobile', capabilities, consent } = req.body;
    
    if (!sessionId || !code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Session ID and verification code required' 
      });
    }
    
    const session = verificationCodes.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'Session expired or not found' 
      });
    }
    
    if (new Date() > session.expires) {
      verificationCodes.delete(sessionId);
      return res.status(410).json({ 
        success: false, 
        error: 'Verification code expired' 
      });
    }
    
    if (session.code !== code) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid verification code' 
      });
    }
    
    // Extract country code
    const phoneCountry = session.phone.slice(0, session.phone.length - 9) || '+1';
    
    // Create node
    const nodeId = generateNodeId(phoneCountry);
    const phoneHash = hashPhone(session.phone);
    
    const node: NanogridNode = {
      nodeId,
      phoneHash,
      phoneCountry,
      nodeType: nodeType as NodeType,
      status: 'active',
      capabilities: capabilities || {
        canRelay: true,
        canStore: true,
        maxBandwidth: 100,
        maxStorage: 50,
        protocols: ['ble', 'wifi'],
        batteryPowered: nodeType === 'mobile'
      },
      consent: {
        acceptedTerms: true,
        acceptedAt: new Date(),
        allowRelay: consent?.allowRelay ?? true,
        allowStorage: consent?.allowStorage ?? true,
        maxDataUsageMB: consent?.maxDataUsageMB ?? 100,
        maxBatteryUsage: consent?.maxBatteryUsage ?? 20
      },
      metrics: {
        messagesRelayed: 0,
        bytesTransferred: 0,
        uptime: 0,
        lastPing: new Date(),
        signalStrength: 100
      },
      createdAt: new Date(),
      lastSeen: new Date()
    };
    
    nodes.set(nodeId, node);
    verificationCodes.delete(sessionId);
    
    console.log(`✅ Nanogrid node created: ${nodeId} (${nodeType})`);
    
    res.json({
      success: true,
      message: 'Welcome to Nanogrid! You are now a node.',
      node: {
        nodeId: node.nodeId,
        status: node.status,
        nodeType: node.nodeType,
        capabilities: node.capabilities,
        createdAt: node.createdAt
      }
    });
    
  } catch (error: any) {
    console.error('Verification error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/nanogrid/node/:nodeId
 * Get node status
 */
router.get('/node/:nodeId', (req, res) => {
  const { nodeId } = req.params;
  const node = nodes.get(nodeId);
  
  if (!node) {
    return res.status(404).json({ success: false, error: 'Node not found' });
  }
  
  res.json({
    success: true,
    node: {
      nodeId: node.nodeId,
      status: node.status,
      nodeType: node.nodeType,
      capabilities: node.capabilities,
      metrics: node.metrics,
      lastSeen: node.lastSeen,
      location: node.location
    }
  });
});

/**
 * POST /api/nanogrid/node/:nodeId/ping
 * Node heartbeat / keep-alive
 */
router.post('/node/:nodeId/ping', (req, res) => {
  const { nodeId } = req.params;
  const { location, signalStrength, metrics } = req.body;
  
  const node = nodes.get(nodeId);
  
  if (!node) {
    return res.status(404).json({ success: false, error: 'Node not found' });
  }
  
  // Update node
  node.lastSeen = new Date();
  node.metrics.lastPing = new Date();
  
  if (signalStrength !== undefined) {
    node.metrics.signalStrength = signalStrength;
  }
  
  if (location) {
    node.location = location;
  }
  
  if (metrics) {
    node.metrics.messagesRelayed += metrics.messagesRelayed || 0;
    node.metrics.bytesTransferred += metrics.bytesTransferred || 0;
    node.metrics.uptime = metrics.uptime || node.metrics.uptime;
  }
  
  nodes.set(nodeId, node);
  
  res.json({
    success: true,
    message: 'Pong',
    serverTime: new Date().toISOString()
  });
});

/**
 * POST /api/nanogrid/node/:nodeId/optout
 * User wants to leave the network
 */
router.post('/node/:nodeId/optout', (req, res) => {
  const { nodeId } = req.params;
  const node = nodes.get(nodeId);
  
  if (!node) {
    return res.status(404).json({ success: false, error: 'Node not found' });
  }
  
  node.status = 'inactive';
  node.consent.allowRelay = false;
  node.consent.allowStorage = false;
  nodes.set(nodeId, node);
  
  console.log(`📴 Node ${nodeId} opted out of Nanogrid`);
  
  res.json({
    success: true,
    message: 'You have left the Nanogrid network. Your data will be deleted within 30 days.'
  });
});

/**
 * GET /api/nanogrid/stats
 * Network statistics
 */
router.get('/stats', (req, res) => {
  const allNodes = Array.from(nodes.values());
  const activeNodes = allNodes.filter(n => n.status === 'active');
  
  const stats = {
    totalNodes: allNodes.length,
    activeNodes: activeNodes.length,
    nodesByType: {
      mobile: allNodes.filter(n => n.nodeType === 'mobile').length,
      desktop: allNodes.filter(n => n.nodeType === 'desktop').length,
      gateway: allNodes.filter(n => n.nodeType === 'gateway').length,
      server: allNodes.filter(n => n.nodeType === 'server').length,
      iot: allNodes.filter(n => n.nodeType === 'iot').length
    },
    nodesByCountry: allNodes.reduce((acc, n) => {
      const country = n.phoneCountry;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalMessagesRelayed: allNodes.reduce((sum, n) => sum + n.metrics.messagesRelayed, 0),
    totalBytesTransferred: allNodes.reduce((sum, n) => sum + n.metrics.bytesTransferred, 0),
    networkHealth: activeNodes.length > 0 
      ? (activeNodes.reduce((sum, n) => sum + n.metrics.signalStrength, 0) / activeNodes.length)
      : 0
  };
  
  res.json({ success: true, stats });
});

/**
 * GET /api/nanogrid/nodes/nearby
 * Find nearby nodes for mesh communication
 */
router.get('/nodes/nearby', (req, res) => {
  const { lat, lng, radius = 10 } = req.query; // radius in km
  
  if (!lat || !lng) {
    return res.status(400).json({ 
      success: false, 
      error: 'Latitude and longitude required' 
    });
  }
  
  const latitude = parseFloat(lat as string);
  const longitude = parseFloat(lng as string);
  const radiusKm = parseFloat(radius as string);
  
  // Simple distance calculation (Haversine formula simplified)
  const nearbyNodes = Array.from(nodes.values())
    .filter(n => n.status === 'active' && n.location?.lat && n.location?.lng)
    .filter(n => {
      const dlat = Math.abs(n.location!.lat! - latitude);
      const dlng = Math.abs(n.location!.lng! - longitude);
      const approxDistKm = Math.sqrt(dlat * dlat + dlng * dlng) * 111; // ~111km per degree
      return approxDistKm <= radiusKm;
    })
    .map(n => ({
      nodeId: n.nodeId,
      nodeType: n.nodeType,
      capabilities: n.capabilities,
      signalStrength: n.metrics.signalStrength,
      distance: Math.sqrt(
        Math.pow(n.location!.lat! - latitude, 2) + 
        Math.pow(n.location!.lng! - longitude, 2)
      ) * 111
    }));
  
  res.json({
    success: true,
    count: nearbyNodes.length,
    nodes: nearbyNodes
  });
});

export default router;

// Standalone server for microservice deployment
if (require.main === module) {
  const app = express();
  app.use(express.json());
  
  // CORS for frontend separation
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  app.use('/api/nanogrid', router);
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'nanogrid-node-registry', nodes: nodes.size });
  });
  
  const PORT = process.env.NANOGRID_PORT || 8081;
  app.listen(PORT, () => {
    console.log(`\n🌐 Nanogrid Node Registry running on port ${PORT}`);
    console.log(`📱 Registration: POST /api/nanogrid/register`);
    console.log(`✅ Verification: POST /api/nanogrid/verify`);
    console.log(`📊 Stats: GET /api/nanogrid/stats\n`);
  });
}
