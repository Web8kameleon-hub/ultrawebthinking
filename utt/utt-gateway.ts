/**
 * UTT Gateway - Integration Layer
 * @author Ledjan Ahmati
 * @version 8.0.0-WEB8
 * @contact dealsjona@gmail.com
 */

import { ALB_TOKEN, toEurValue } from './albion-token';
import { getConnection, getCurrentCluster } from './albion-connection';
import { logTransaction, logSecurityEvent } from './utt-audit';

export interface GatewayMetrics {
  timestamp: number;
  source: 'lora' | 'agi' | 'search' | 'audit' | 'manual';
  type: 'transaction' | 'balance_check' | 'verification' | 'error' | 'status';
  data: {
    address?: string | undefined;
    amount?: number | undefined;
    signature?: string | undefined;
    status?: string | undefined;
    error?: string | undefined;
    metadata?: Record<string, any> | undefined;
  };
}

export interface AGICommand {
  id: string;
  timestamp: number;
  command: 'transfer' | 'balance' | 'verify' | 'audit' | 'status';
  parameters: Record<string, any>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface LoRaReport {
  deviceId: string;
  timestamp: number;
  payload: string;
  rssi: number;
  snr: number;
  tokenData?: {
    amount: number;
    recipient?: string;
    signature?: string;
  };
}

/**
 * Post metrics to gateway endpoint
 */
export async function postGatewayMetrics(metrics: GatewayMetrics): Promise<boolean> {
  try {
    // Try to post to AGI dashboard API
    if (typeof fetch !== 'undefined') {
      const response = await fetch('/api/agi/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metrics)
      });
      
      if (response.ok) {
        console.log('📊 Gateway metrics posted to AGI dashboard');
        return true;
      }
    }
    
    // Fallback: local storage
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('utt_gateway_metrics');
      const metricsList = existing ? JSON.parse(existing) : [];
      metricsList.push(metrics);
      
      // Keep only last 500 metrics
      if (metricsList.length > 500) {
        metricsList.splice(0, metricsList.length - 500);
      }
      
      localStorage.setItem('utt_gateway_metrics', JSON.stringify(metricsList));
      console.log('💾 Gateway metrics saved locally');
      return true;
    }
    
    console.log('📝 Gateway metrics:', metrics);
    return true;
  } catch (error) {
    console.error('❌ Failed to post gateway metrics:', error);
    return false;
  }
}

/**
 * Report LoRa device transaction
 */
export async function reportLoRaTransaction(
  deviceId: string,
  amount: number,
  recipient?: string,
  signature?: string
): Promise<void> {
  const metrics: GatewayMetrics = {
    timestamp: Date.now(),
    source: 'lora',
    type: 'transaction',
    data: {
      amount,
      signature,
      metadata: {
        deviceId,
        recipient,
        valueEUR: toEurValue(amount),
        cluster: getCurrentCluster()
      }
    }
  };
  
  await postGatewayMetrics(metrics);
  
  // Also log to audit system
  if (signature && recipient) {
    await logTransaction(
      deviceId,
      recipient,
      amount,
      signature,
      'success'
    );
  }
}

/**
 * Report LoRa device status
 */
export async function reportLoRaStatus(report: LoRaReport): Promise<void> {
  const metrics: GatewayMetrics = {
    timestamp: Date.now(),
    source: 'lora',
    type: 'status',
    data: {
      metadata: {
        deviceId: report.deviceId,
        payload: report.payload,
        rssi: report.rssi,
        snr: report.snr,
        signalQuality: report.rssi > -100 ? 'good' : 'poor'
      }
    }
  };
  
  await postGatewayMetrics(metrics);
}

/**
 * Get AGI commands from dashboard
 */
export async function getAgiCommands(): Promise<AGICommand[]> {
  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch('/api/agi/commands');
      if (response.ok) {
        const data = await response.json();
        return data.commands || [];
      }
    }
    
    // Fallback: check localStorage for manual commands
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('utt_agi_commands');
      if (existing) {
        return JSON.parse(existing);
      }
    }
    
    return [];
  } catch (error) {
    console.error('❌ Failed to get AGI commands:', error);
    return [];
  }
}

/**
 * Process AGI command
 */
export async function processAgiCommand(command: AGICommand): Promise<AGICommand> {
  const startTime = Date.now();
  
  try {
    let result: any = null;
    
    switch (command.command) {
      case 'balance':
        // Get balance for address
        if (command.parameters.address) {
          // Would call getAlbBalance here
          result = { balance: 0, address: command.parameters.address };
        }
        break;
        
      case 'transfer':
        // Process transfer
        if (command.parameters.from && command.parameters.to && command.parameters.amount) {
          // Would build and execute transfer here
          result = { signature: 'mock_signature', status: 'pending' };
        }
        break;
        
      case 'verify':
        // Verify address or transaction
        result = { verified: true, timestamp: Date.now() };
        break;
        
      case 'audit':
        // Generate audit report
        result = { entries: 0, period: '24h' };
        break;
        
      case 'status':
        // Get system status
        result = {
          cluster: getCurrentCluster(),
          healthy: true,
          uptime: Date.now() - startTime
        };
        break;
        
      default:
        throw new Error(`Unknown command: ${command.command}`);
    }
    
    const updatedCommand: AGICommand = {
      ...command,
      status: 'completed',
      result
    };
    
    await updateAgiCommand(updatedCommand);
    return updatedCommand;
    
  } catch (error: any) {
    const failedCommand: AGICommand = {
      ...command,
      status: 'failed',
      error: error.message
    };
    
    await updateAgiCommand(failedCommand);
    await logSecurityEvent('failed_auth', `AGI command failed: ${error.message}`);
    
    return failedCommand;
  }
}

/**
 * Update AGI command status
 */
async function updateAgiCommand(command: AGICommand): Promise<void> {
  try {
    if (typeof fetch !== 'undefined') {
      await fetch(`/api/agi/commands/${command.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command)
      });
    }
    
    // Update localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const existing = localStorage.getItem('utt_agi_commands');
      const commands = existing ? JSON.parse(existing) : [];
      const index = commands.findIndex((c: AGICommand) => c.id === command.id);
      
      if (index >= 0) {
        commands[index] = command;
      } else {
        commands.push(command);
      }
      
      localStorage.setItem('utt_agi_commands', JSON.stringify(commands));
    }
  } catch (error) {
    console.error('❌ Failed to update AGI command:', error);
  }
}

/**
 * Report to Search Ultra Engine
 */
export async function reportToSearchEngine(
  type: 'transaction' | 'address' | 'token',
  identifier: string,
  metadata: Record<string, any>
): Promise<void> {
  const searchData = {
    type,
    identifier,
    metadata: {
      ...metadata,
      timestamp: Date.now(),
      token: ALB_TOKEN.symbol,
      cluster: getCurrentCluster()
    }
  };
  
  try {
    if (typeof fetch !== 'undefined') {
      await fetch('/api/search/index', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(searchData)
      });
      
      console.log('🔍 Data indexed in Search Ultra Engine');
    }
  } catch (error) {
    console.error('❌ Failed to report to search engine:', error);
  }
}

/**
 * Get real-time dashboard data
 */
export async function getDashboardData(): Promise<{
  totalTransactions: number;
  totalVolume: number;
  uniqueAddresses: number;
  recentActivity: GatewayMetrics[];
  systemStatus: string;
}> {
  try {
    if (typeof fetch !== 'undefined') {
      const response = await fetch('/api/dashboard/realtime');
      if (response.ok) {
        return await response.json();
      }
    }
    
    // Fallback: calculate from localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      const metrics = localStorage.getItem('utt_gateway_metrics');
      const metricsList = metrics ? JSON.parse(metrics) : [];
      
      const transactions = metricsList.filter((m: GatewayMetrics) => m.type === 'transaction');
      const totalVolume = transactions.reduce((sum: number, m: GatewayMetrics) => 
        sum + (m.data.amount || 0), 0);
      
      const addresses = new Set(transactions.map((m: GatewayMetrics) => m.data.address).filter(Boolean));
      
      return {
        totalTransactions: transactions.length,
        totalVolume,
        uniqueAddresses: addresses.size,
        recentActivity: metricsList.slice(-10),
        systemStatus: 'operational'
      };
    }
    
    return {
      totalTransactions: 0,
      totalVolume: 0,
      uniqueAddresses: 0,
      recentActivity: [],
      systemStatus: 'unknown'
    };
  } catch (error) {
    console.error('❌ Failed to get dashboard data:', error);
    return {
      totalTransactions: 0,
      totalVolume: 0,
      uniqueAddresses: 0,
      recentActivity: [],
      systemStatus: 'error'
    };
  }
}

/**
 * Initialize gateway monitoring
 */
export function initializeGatewayMonitoring(): void {
  console.log('🚀 UTT Gateway monitoring initialized');
  
  // Report initial status
  postGatewayMetrics({
    timestamp: Date.now(),
    source: 'manual',
    type: 'status',
    data: {
      status: 'initialized',
      metadata: {
        cluster: getCurrentCluster(),
        token: ALB_TOKEN.symbol
      }
    }
  });
}

export default {
  postGatewayMetrics,
  reportLoRaTransaction,
  reportLoRaStatus,
  getAgiCommands,
  processAgiCommand,
  reportToSearchEngine,
  getDashboardData,
  initializeGatewayMonitoring
};
