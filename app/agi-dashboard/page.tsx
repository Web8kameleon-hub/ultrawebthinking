export const dynamic = 'force-dynamic';
export const revalidate = 60;

import RealTimeAGI from '../../components/RealTimeAGI';

// Fetch minimal initial AGI data (non-system metrics)
async function fetchInitialAGIData() {
  try {
    // Only fetch AGI-specific data, not system metrics
    const [analyticsResponse] = await Promise.allSettled([
      fetch('http://localhost:3000/api/agi/analytics').then(r => r.json())
    ]);

    const analytics = analyticsResponse.status === 'fulfilled' ? analyticsResponse.value : {};

    return {
      speed: 2.5, // Neural processing speed (not CPU)
      speedUnit: 'THz',
      memory: 'Loading...', // Will be filled by real metrics
      connections: 3847, // Neural connections
      lr: analytics.learningRate || 0.97,
      security: 'Military Grade',
      latency: 12, // API response latency
      throughput: 1.2,
      throughputUnit: 'GB/s', 
      nodes: 28, // AGI mesh nodes
      cpu: 0, // Will be filled by real metrics
      gpu: 0, // Will be filled by real metrics
      net: '1.8 TB/h',
      uptime: 'Loading...', // Will be filled by real metrics
      health: 98,
      ethics: 98,
    };
  } catch (error) {
    console.error('Failed to fetch initial AGI data:', error);
    // Minimal fallback data
    return {
      speed: 2.5, speedUnit: 'THz',
      memory: 'Loading...',
      connections: 3847,
      lr: 0.97,
      security: 'Military Grade',
      latency: 12, throughput: 1.2, throughputUnit: 'GB/s',
      nodes: 28, cpu: 0, gpu: 0, net: '1.8 TB/h',
      uptime: 'Loading...', health: 98, ethics: 98,
    };
  }
}

export default async function Page() {
  // Fetch only initial non-system data (real metrics come from hook)
  const initialData = await fetchInitialAGIData();

  return <RealTimeAGI initialData={initialData} />;
}
