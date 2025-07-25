#!/usr/bin/env tsx
/**
 * System Health Monitor
 * Monitors all system components and provides optimization recommendations
 * 
 * @version 8.0.0
 * @author Ledjan Ahmati
 */

import { FluidArchitecture } from '../lib/FluidArchitecture';
import { EthicalNeuralPlanner } from '../lib/EthicalNeuralPlanner';

class SystemHealthMonitor {
  private fluid: FluidArchitecture;
  private neural: EthicalNeuralPlanner;

  constructor() {
    this.fluid = new FluidArchitecture();
    this.neural = new EthicalNeuralPlanner();
  }

  async performHealthCheck(): Promise<void> {
    console.log('🏥 SYSTEM HEALTH CHECK STARTING...');
    console.log('='.repeat(60));

    try {
      // Check fluid streams
      const fluidMetrics = await this.fluid.getFlowMetrics();
      console.log('🚿 FLUID STREAM ANALYSIS:');
      
      let totalHealth = 0;
      let slowStreams = 0;
      let criticalStreams = 0;
      
      fluidMetrics.streams.forEach((stream: any) => {
        const statusIcon = this.getHealthIcon(stream.health);
        const velocityIcon = stream.velocity < 30 ? '🐌' : stream.velocity < 70 ? '🏃' : '🚀';
        
        console.log(`${statusIcon} ${velocityIcon} ${stream.name}:`);
        console.log(`    Velocity: ${stream.velocity}% | Health: ${stream.health}%`);
        console.log(`    Clarity: ${stream.clarity}% | Obstacles: ${stream.obstacles}`);
        
        totalHealth += stream.health;
        if (stream.velocity < 30) slowStreams++;
        if (stream.health < 50) criticalStreams++;
      });
      
      const avgHealth = totalHealth / fluidMetrics.streams.length;
      
      // Check neural system
      console.log('\n🧠 NEURAL SYSTEM ANALYSIS:');
      const neuralStatus = this.neural.getNetworkStatus();
      const complianceReport = this.neural.getEthicalComplianceReport();
      
      console.log(`🛡️ SafeThink Mode: ${neuralStatus.safeThinkActive ? '🟡 Active' : '🟢 Normal'}`);
      console.log(`⚖️ Ethical Status: ${complianceReport.ethicalCompliance.status}`);
      console.log(`🔄 Risk Level: ${complianceReport.ethicalCompliance.riskLevel}`);
      
      // Overall system status
      console.log('\n📊 OVERALL SYSTEM STATUS:');
      console.log(`🌊 Average Stream Health: ${avgHealth.toFixed(1)}%`);
      console.log(`🐌 Slow Streams: ${slowStreams}/6`);
      console.log(`🚨 Critical Streams: ${criticalStreams}/6`);
      
      // Recommendations
      console.log('\n💡 OPTIMIZATION RECOMMENDATIONS:');
      if (slowStreams > 2) {
        console.log('⚡ Run: yarn flow:optimize - Multiple slow streams detected');
      }
      if (criticalStreams > 0) {
        console.log('🚨 Run: yarn neural:boost emergency - Critical streams need attention');
      }
      if (neuralStatus.safeThinkActive) {
        console.log('🧠 Neural system in SafeThink mode - consider running neural:boost');
      }
      if (avgHealth > 85) {
        console.log('✅ System running optimally! All streams healthy.');
      }
      
      // Water quality assessment
      const waterQuality = this.assessWaterQuality(avgHealth, slowStreams, criticalStreams);
      console.log(`\n💧 WATER QUALITY: ${waterQuality.status} ${waterQuality.icon}`);
      console.log(`   ${waterQuality.description}`);
      
    } catch (error) {
      console.error('❌ Health check failed:', error);
    } finally {
      this.neural.destroy();
    }
  }

  private getHealthIcon(health: number): string {
    if (health >= 90) return '🟢';
    if (health >= 70) return '🟡';
    if (health >= 50) return '🟠';
    return '🔴';
  }

  private assessWaterQuality(avgHealth: number, slowStreams: number, criticalStreams: number) {
    if (avgHealth >= 90 && slowStreams === 0 && criticalStreams === 0) {
      return {
        status: 'CRYSTAL CLEAR',
        icon: '💎',
        description: 'Perfect water quality - system flowing like natural spring water'
      };
    } else if (avgHealth >= 75 && criticalStreams === 0) {
      return {
        status: 'CLEAN',
        icon: '💧',
        description: 'Good water quality - minor optimization possible'
      };
    } else if (avgHealth >= 60) {
      return {
        status: 'CLOUDY',
        icon: '🌫️',
        description: 'Water quality needs attention - optimization recommended'
      };
    } else {
      return {
        status: 'POLLUTED',
        icon: '🚨',
        description: 'Poor water quality - immediate system cleanup required'
      };
    }
  }

  async quickStatus(): Promise<void> {
    console.log('⚡ QUICK STATUS CHECK');
    
    try {
      const fluidMetrics = await this.fluid.getFlowMetrics();
      const neuralStatus = this.neural.getNetworkStatus();
      
      const slowStreams = fluidMetrics.streams.filter((s: any) => s.velocity < 30).length;
      const avgHealth = fluidMetrics.streams.reduce((sum: number, s: any) => sum + s.health, 0) / fluidMetrics.streams.length;
      
      console.log(`🌊 Streams: ${6 - slowStreams}/6 healthy | 🧠 Neural: ${neuralStatus.safeThinkActive ? 'SafeThink' : 'Normal'}`);
      console.log(`💧 Water Quality: ${avgHealth.toFixed(0)}% | Status: ${this.assessWaterQuality(avgHealth, slowStreams, 0).status}`);
      
    } catch (error) {
      console.error('❌ Quick status failed:', error);
    } finally {
      this.neural.destroy();
    }
  }
}

// CLI interface
async function main() {
  const monitor = new SystemHealthMonitor();
  
  const mode = process.argv[2] || 'full';
  
  switch (mode) {
    case 'quick':
      await monitor.quickStatus();
      break;
    case 'full':
    default:
      await monitor.performHealthCheck();
      break;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { SystemHealthMonitor };
