"use client";
import { useEffect, useState } from "react";

type SystemData = {
    ts: number;
    cpu: {
        manufacturer: string;
        brand: string;
        speed: number;
        cores: number;
        load: number;
    };
    mem: {
        total: number;
        free: number;
        used: number;
        available: number;
        usagePercent: number;
    };
    net: Array<{
        iface: string;
        rx_bytes: number;
        tx_bytes: number;
        rx_sec: number;
        tx_sec: number;
    }>;
    disk: {
        rIO: number;
        wIO: number;
        tIO: number;
        rIO_sec: number;
        wIO_sec: number;
    };
    system: {
        platform: string;
        hostname: string;
        uptime: number;
    };
};

export default function SystemStats() {
    const [data, setData] = useState<SystemData | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let eventSource: EventSource;

        const connect = () => {
            try {
                eventSource = new EventSource("/api/stats");

                eventSource.onopen = () => {
                    setConnected(true);
                    setError(null);
                };

                eventSource.onmessage = (e) => {
                    try {
                        const parsed = JSON.parse(e.data);
                        if (parsed.error) {
                            setError(parsed.error);
                        } else {
                            setData(parsed);
                            setError(null);
                        }
                    } catch (err) {
                        setError("Parse error");
                    }
                };

                eventSource.onerror = () => {
                    setConnected(false);
                    setError("Connection lost");
                };
            } catch (err) {
                setError("Failed to connect");
            }
        };

        connect();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, []);

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return "0 B";
        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB", "TB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
    };

    const formatUptime = (seconds: number): string => {
        const days = Math.floor(seconds / 86400);
        const hours = Math.floor((seconds % 86400) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${days}d ${hours}h ${mins}m`;
    };

    if (error) {
        return (
            <div className="p-4 border rounded bg-red-50">
                <div className="text-red-600 font-semibold">System Stats Error</div>
                <div className="text-sm text-red-500">{error}</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="p-4 border rounded animate-pulse">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                    <span>Duke lexuar statistikat reale...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 border rounded bg-gray-50">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Real-time System Stats</h3>
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className="text-sm text-gray-600">
                        {new Date(data.ts).toLocaleTimeString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* CPU */}
                <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-blue-700">CPU</div>
                    <div className="text-sm text-gray-600">{data.cpu.brand}</div>
                    <div className="text-sm">{data.cpu.speed}GHz • {data.cpu.cores} cores</div>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm">
                            <span>Load</span>
                            <span className={data.cpu.load > 80 ? 'text-red-600 font-semibold' : data.cpu.load > 60 ? 'text-yellow-600' : 'text-green-600'}>
                                {data.cpu.load.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                                className={`h-2 rounded-full transition-all ${data.cpu.load > 80 ? 'bg-red-500' : data.cpu.load > 60 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(data.cpu.load, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Memory */}
                <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-purple-700">Memory</div>
                    <div className="text-sm">
                        {formatBytes(data.mem.used)} / {formatBytes(data.mem.total)}
                    </div>
                    <div className="mt-2">
                        <div className="flex justify-between text-sm">
                            <span>Usage</span>
                            <span className={data.mem.usagePercent > 85 ? 'text-red-600 font-semibold' : data.mem.usagePercent > 70 ? 'text-yellow-600' : 'text-green-600'}>
                                {data.mem.usagePercent.toFixed(1)}%
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                            <div
                                className={`h-2 rounded-full transition-all ${data.mem.usagePercent > 85 ? 'bg-red-500' : data.mem.usagePercent > 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(data.mem.usagePercent, 100)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* System */}
                <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-green-700">System</div>
                    <div className="text-sm text-gray-600">{data.system.hostname}</div>
                    <div className="text-sm">{data.system.platform}</div>
                    <div className="text-sm mt-1">
                        Uptime: {formatUptime(data.system.uptime)}
                    </div>
                </div>

                {/* Network */}
                <div className="bg-white p-3 rounded border md:col-span-2">
                    <div className="font-medium text-indigo-700 mb-2">Network</div>
                    <div className="space-y-2">
                        {data.net.slice(0, 2).map((n, i) => (
                            <div key={i} className="text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium">{n.iface}</span>
                                    <span className="text-gray-500">
                                        ↓ {formatBytes(n.rx_sec)}/s • ↑ {formatBytes(n.tx_sec)}/s
                                    </span>
                                </div>
                                <div className="text-xs text-gray-500">
                                    Total: ↓ {formatBytes(n.rx_bytes)} • ↑ {formatBytes(n.tx_bytes)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Disk I/O */}
                <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-orange-700">Disk I/O</div>
                    <div className="text-sm space-y-1 mt-2">
                        <div>Read: {formatBytes(data.disk.rIO_sec)}/s</div>
                        <div>Write: {formatBytes(data.disk.wIO_sec)}/s</div>
                        <div className="text-xs text-gray-500">
                            Total: {data.disk.tIO.toLocaleString()} ops
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
