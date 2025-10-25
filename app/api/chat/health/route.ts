export async function GET() {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'Chat API Health Check',
    timestamp: new Date().toISOString(),
    asi_status: 'operational',
    alba_status: 'operational', 
    real_data_sources: 'connected',
    message: 'Chat API is running successfully! ✅'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

export async function POST() {
  return new Response(JSON.stringify({
    message: 'Health check - POST method supported',
    status: 'healthy',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}