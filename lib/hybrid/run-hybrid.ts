/**
 * WEB8 Hybrid Fluid Inverter Runner
 * Quick start script for hybrid Next.js + Express application
 * 
 * @version 8.0.0-HYBRID
 * @author Ledjan Ahmati (100% Owner)
 */

import { FluidInverterApp } from './FluidInverterApp';

// Custom configuration for WEB8 Hybrid
const hybridConfig = {
  nextjs: {
    dev: process.env.NODE_ENV !== 'production',
    port: 3000,
    hostname: 'localhost'
  },
  express: {
    port: parseInt(process.env.PORT || '3000'), // Use same port for hybrid
    enableCors: true,
    enableLogging: true,
    rateLimit: 2000 // Higher limit for hybrid
  },
  fluid: {
    enableStateSync: true,
    stateRetention: 10 * 60 * 1000, // 10 minutes
    maxStates: 50000, // High capacity
    enableInverter: true
  },
  search: {
    enableCaching: true,
    maxResults: 200,
    timeout: 45000
  }
};

async function startHybridApp() {
  try {
    console.log('🌊 Starting WEB8 Hybrid Fluid Inverter Application...');
    console.log('🔧 Configuration:');
    console.log(`   - Mode: ${hybridConfig.nextjs.dev ? 'Development' : 'Production'}`);
    console.log(`   - Port: ${hybridConfig.express.port}`);
    console.log(`   - Fluid States: ${hybridConfig.fluid.maxStates} max`);
    console.log(`   - State Retention: ${hybridConfig.fluid.stateRetention / 1000}s`);
    console.log(`   - Inverters: ${hybridConfig.fluid.enableInverter ? 'Enabled' : 'Disabled'}`);
    
    const app = new FluidInverterApp(hybridConfig);
    await app.start();
    
    console.log('\\n🎉 WEB8 Hybrid Application is ready!');
    console.log('\\n📋 Available Endpoints:');
    console.log(`   🏠 Next.js Frontend: http://localhost:${  hybridConfig.express.port}`);
    console.log(`   💚 Health Check: http://localhost:${  hybridConfig.express.port  }/hybrid/health`);
    console.log(`   🌊 Fluid States: http://localhost:${  hybridConfig.express.port  }/hybrid/fluid/state`);
    console.log(`   🔄 Inverters: http://localhost:${  hybridConfig.express.port  }/hybrid/inverter/search-results`);
    console.log(`   🔍 Hybrid Search: http://localhost:${  hybridConfig.express.port  }/hybrid/search`);
    console.log(`   📊 Analytics: http://localhost:${  hybridConfig.express.port  }/hybrid/analytics`);
    console.log(`   🌊 Live Stream: http://localhost:${  hybridConfig.express.port  }/hybrid/fluid/stream`);
    
    console.log('\\n🧪 Test Commands:');
    console.log(`   curl http://localhost:${  hybridConfig.express.port  }/hybrid/health`);
    console.log(`   curl "http://localhost:${  hybridConfig.express.port  }/hybrid/search?q=typescript&invert=true"`);
    console.log(`   curl http://localhost:${  hybridConfig.express.port  }/hybrid/analytics`);
    
    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\\n🛑 Shutting down hybrid application...');
      await app.stop();
      process.exit(0);
    });
    
    process.on('SIGTERM', async () => {
      console.log('\\n🛑 Terminating hybrid application...');
      await app.stop();
      process.exit(0);
    });
    
  } catch (error) {
    console.error('❌ Failed to start hybrid application:', error);
    process.exit(1);
  }
}

// Start the hybrid application
startHybridApp();
