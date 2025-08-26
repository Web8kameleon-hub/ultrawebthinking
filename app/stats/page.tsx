"use client";
import SystemStats from "../../components/SystemStats";

export default function StatsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        ⚡ Live System Statistics
                    </h1>
                    <p className="text-xl text-gray-600">
                        Real-time server telemetry • No mock data
                    </p>
                </div>

                <SystemStats />

                <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">📊 Metrics</h3>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✅ Real CPU usage from host system</li>
                            <li>✅ Live memory consumption</li>
                            <li>✅ Network bandwidth monitoring</li>
                            <li>✅ Disk I/O operations</li>
                            <li>✅ System uptime tracking</li>
                        </ul>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">🔄 Real-time Updates</h3>
                        <div className="text-sm text-gray-700 space-y-2">
                            <div>Update Frequency: Every 2 seconds</div>
                            <div>Protocol: Server-Sent Events (SSE)</div>
                            <div>Data Source: systeminformation library</div>
                            <div>Format: Streaming JSON</div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-4">🛠️ API Endpoint</h3>
                        <div className="text-sm text-gray-700 space-y-2">
                            <div className="font-mono bg-gray-100 p-2 rounded">
                                GET /api/stats
                            </div>
                            <div>Headers: Accept: text/event-stream</div>
                            <div>Response: Streaming JSON data</div>
                            <div>No authentication required</div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">💡 Usage Examples</h3>
                    <div className="grid lg:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-semibold mb-2">JavaScript (EventSource)</h4>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {`const eventSource = new EventSource('/api/stats');
eventSource.onmessage = (e) => {
  const data = JSON.parse(e.data);
  console.log('CPU Load:', data.cpu.load);
  console.log('Memory Usage:', data.mem.usagePercent);
};`}
                            </pre>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-2">PowerShell</h4>
                            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                                {`# Stream stats (requires special handling for SSE)
Invoke-RestMethod -Uri "http://localhost:3000/api/stats" \\
  -Headers @{"Accept"="text/event-stream"}`}
                            </pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
