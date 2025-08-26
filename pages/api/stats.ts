import type { NextApiRequest, NextApiResponse } from "next";
import si from "systeminformation";

export const config = {
    api: {
        bodyParser: false,
        responseLimit: false
    }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
    });

    const send = async () => {
        try {
            const [cpu, mem, currentLoad, net, diskIO, osInfo] = await Promise.all([
                si.cpu(),
                si.mem(),
                si.currentLoad(),
                si.networkStats(),
                si.disksIO(),
                si.osInfo()
            ]);

            const payload = {
                ts: Date.now(),
                cpu: {
                    manufacturer: cpu.manufacturer,
                    brand: cpu.brand,
                    speed: cpu.speed,
                    cores: cpu.cores,
                    load: Math.round(currentLoad.currentLoad * 100) / 100
                },
                mem: {
                    total: mem.total,
                    free: mem.free,
                    used: mem.active,
                    available: mem.available,
                    usagePercent: Math.round((mem.active / mem.total) * 10000) / 100
                },
                net: net.slice(0, 3).map(n => ({
                    iface: n.iface,
                    rx_bytes: n.rx_bytes,
                    tx_bytes: n.tx_bytes,
                    rx_sec: n.rx_sec,
                    tx_sec: n.tx_sec
                })),
                disk: {
                    rIO: diskIO.rIO,
                    wIO: diskIO.wIO,
                    tIO: diskIO.tIO,
                    rIO_sec: diskIO.rIO_sec,
                    wIO_sec: diskIO.wIO_sec
                },
                system: {
                    platform: osInfo.platform,
                    hostname: osInfo.hostname,
                    uptime: (await si.time()).uptime
                }
            };

            res.write(`data: ${JSON.stringify(payload)}\n\n`);
        } catch (error) {
            console.error("Stats error:", error);
            res.write(`data: ${JSON.stringify({ error: "stats_unavailable", ts: Date.now() })}\n\n`);
        }
    };

    // Send initial data
    await send();

    // Send updates every 2 seconds
    const interval = setInterval(send, 2000);

    // Clean up on client disconnect
    req.on("close", () => {
        clearInterval(interval);
        res.end();
    });

    req.on("error", () => {
        clearInterval(interval);
        res.end();
    });
}
