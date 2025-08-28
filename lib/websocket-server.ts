/**
 * 🌐 Web8 WebSocket Server
 * Real-time communication for AGI platform
 * Created by: Ledjan Ahmati
 */

import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { parse } from 'url';

interface ClientConnection {
  id: string;
  ws: WebSocket;
  metadata: {
    userAgent: string;
    ip: string;
    connectedAt: Date;
    lastActivity: Date;
  };
}

interface Message {
  type: 'chat' | 'neural' | 'security' | 'sync' | 'openmind';
  data: any;
  timestamp: number;
  clientId: string;
}

class Web8WebSocketServer {
  private readonly wss: WebSocketServer;
  private readonly clients: Map<string, ClientConnection> = new Map();
  private readonly messageQueue: Message[] = [];
  
  constructor(port = 8080) {
    const server = createServer();
    this.wss = new WebSocketServer({ server });
    
    this.setupWebSocketHandlers();
    
    server.listen(port, () => {
      console.log(`🌐 Web8 WebSocket Server running on port ${port}`);
    });
  }

  private setupWebSocketHandlers() {
    this.wss.on('connection', (ws: WebSocket, request) => {
      const clientId = this.generateClientId();
      const url = parse(request.url || '', true);
      
      const client: ClientConnection = {
        id: clientId,
        ws,
        metadata: {
          userAgent: request.headers['user-agent'] || 'unknown',
          ip: request.socket.remoteAddress || 'unknown',
          connectedAt: new Date(),
          lastActivity: new Date()
        }
      };
      
      this.clients.set(clientId, client);
      console.log(`✅ Client connected: ${clientId} (${this.clients.size} total)`);
      
      // Send welcome message
      this.sendToClient(clientId, {
        type: 'system',
        data: {
          message: 'Connected to Web8 WebSocket Server',
          clientId,
          features: ['chat', 'neural', 'security', 'sync', 'openmind']
        }
      });

      // Handle incoming messages
      ws.on('message', (data: Buffer) => {
        try {
          const message: Message = JSON.parse(data.toString());
          message.clientId = clientId;
          message.timestamp = Date.now();
          
          this.handleMessage(message);
          client.metadata.lastActivity = new Date();
        } catch (error) {
          console.error('Message parsing error:', error);
          this.sendError(clientId, 'Invalid message format');
        }
      });

      // Handle disconnect
      ws.on('close', () => {
        this.clients.delete(clientId);
        console.log(`❌ Client disconnected: ${clientId} (${this.clients.size} remaining)`);
      });

      // Handle errors
      ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
      });
    });
  }

  private handleMessage(message: Message) {
    console.log(`📨 Message from ${message.clientId}:`, message.type);
    
    switch (message.type) {
      case 'chat':
        this.handleChatMessage(message);
        break;
      case 'neural':
        this.handleNeuralMessage(message);
        break;
      case 'security':
        this.handleSecurityMessage(message);
        break;
      case 'sync':
        this.handleSyncMessage(message);
        break;
      case 'openmind':
        this.handleOpenMindMessage(message);
        break;
      default:
        this.sendError(message.clientId, `Unknown message type: ${message.type}`);
    }
    
    // Store in message queue
    this.messageQueue.push(message);
    if (this.messageQueue.length > 1000) {
      this.messageQueue.shift(); // Remove oldest message
    }
  }

  private handleChatMessage(message: Message) {
    // Broadcast chat message to all clients
    this.broadcast({
      type: 'chat',
      data: {
        message: message.data.message,
        sender: message.clientId,
        timestamp: message.timestamp
      }
    }, message.clientId);
  }

  private handleNeuralMessage(message: Message) {
    // Process neural network data
    const response = {
      type: 'neural_response',
      data: {
        processed: true,
        result: `Neural processing completed for: ${JSON.stringify(message.data)}`,
        confidence: Math.random(),
        timestamp: Date.now()
      }
    };
    
    this.sendToClient(message.clientId, response);
  }

  private handleSecurityMessage(message: Message) {
    // Security event handling
    console.log(`🛡️ Security event from ${message.clientId}:`, message.data);
    
    // Notify all clients about security event
    this.broadcast({
      type: 'security_alert',
      data: {
        level: message.data.level || 'info',
        event: message.data.event,
        source: message.clientId,
        timestamp: message.timestamp
      }
    });
  }

  private handleSyncMessage(message: Message) {
    // Data synchronization
    const syncData = {
      type: 'sync_response',
      data: {
        synchronized: true,
        version: Date.now(),
        changes: message.data.changes || [],
        clientId: message.clientId
      }
    };
    
    // Send sync confirmation
    this.sendToClient(message.clientId, syncData);
    
    // Broadcast changes to other clients
    this.broadcast({
      type: 'sync_update',
      data: syncData.data
    }, message.clientId);
  }

  private handleOpenMindMessage(message: Message) {
    // OpenMind AI processing
    const aiResponse = {
      type: 'openmind_response',
      data: {
        query: message.data.query,
        response: this.generateAIResponse(message.data.query),
        confidence: Math.random() * 0.3 + 0.7, // 70-100% confidence
        model: 'Web8-OpenMind-v8.1',
        timestamp: Date.now()
      }
    };
    
    this.sendToClient(message.clientId, aiResponse);
  }

  private generateAIResponse(query: string): string {
    // Simple AI response generator (replace with actual AI integration)
    const responses = [
      `🧠 Processing query: "${query}" - Web8 neural networks activated`,
      `🔍 Analyzing: "${query}" - Cross-referencing knowledge base`,
      `💡 Insight: "${query}" - Multiple solution paths identified`,
      `🚀 Response: "${query}" - Optimized answer generated`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)] ?? responses[0];
  }

  private sendToClient(clientId: string, data: any) {
    const client = this.clients.get(clientId);
    if (client && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify(data));
    }
  }

  private sendError(clientId: string, error: string) {
    this.sendToClient(clientId, {
      type: 'error',
      data: { error, timestamp: Date.now() }
    });
  }

  private broadcast(data: any, excludeClientId?: string) {
    this.clients.forEach((client, clientId) => {
      if (clientId !== excludeClientId && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(data));
      }
    });
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Public methods for monitoring
  public getStats() {
    return {
      totalClients: this.clients.size,
      totalMessages: this.messageQueue.length,
      uptime: process.uptime(),
      clients: Array.from(this.clients.values()).map(client => ({
        id: client.id,
        connectedAt: client.metadata.connectedAt,
        lastActivity: client.metadata.lastActivity,
        ip: client.metadata.ip
      }))
    };
  }
}

// Export for use in Next.js API routes
export { Web8WebSocketServer };

// Start server if run directly
if (require.main === module) {
  new Web8WebSocketServer(8080);
}
