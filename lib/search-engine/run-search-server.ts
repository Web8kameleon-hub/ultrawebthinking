/**
 * WEB8 Search API Runner - Quick Start Script
 * Simple standalone runner for testing
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati (100% Owner)
 */

import { SimpleSearchAPIServer } from './SimpleSearchAPIServer';

async function startServer() {
  try {
    console.log('🔧 Starting WEB8 Simple Search API Server...');
    
    const server = new SimpleSearchAPIServer();
    await server.start(3001, '0.0.0.0');
    
    console.log('\\n✅ Server Ready!');
    console.log('\\n📋 Available Endpoints:');
    console.log('   GET  /health                    - Server health check');
    console.log('   GET  /api/stats                 - Real-time statistics');
    console.log('   GET  /api/search?q=test         - Search query');
    console.log('   POST /api/search                - Advanced search');
    console.log('   GET  /api/engines               - Available search engines');
    console.log('   GET  /api/suggest?q=te          - Search suggestions');
    console.log('   POST /api/export                - Export results (JSON/CSV/XML)');
    
    console.log('\\n🧪 Test Commands:');
    console.log('   curl http://localhost:3001/health');
    console.log('   curl "http://localhost:3001/api/search?q=typescript"');
    console.log('   curl http://localhost:3001/api/stats');
    
    // Graceful shutdown
    process.on('SIGINT', () => {
      console.log('\\n🛑 Shutting down server...');
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
