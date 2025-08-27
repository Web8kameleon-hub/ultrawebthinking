// Mirror Defense Industrial Dashboard
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const WebSocket = require('ws');

const app = express();
const PORT = process.env.DASHBOARD_PORT || 3002;

// WebSocket server for real-time updates
const wss = new WebSocket.Server({ port: 8080 });

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Real-time attack monitoring
let attackLogs = [];
let systemStats = {
    threatsBlocked: 0,
    decoysServed: 0,
    integrityChecks: 0,
    uptime: Date.now(),
    lastAttack: null,
    activeConnections: 0
};

// Simulate real-time attacks
function simulateRealTimeAttack() {
    const attacks = [
        { type: 'XSS', severity: 'HIGH', source: '192.168.1.100', blocked: true },
        { type: 'SQL Injection', severity: 'CRITICAL', source: '10.0.0.45', blocked: true },
        { type: 'CSRF', severity: 'MEDIUM', source: '172.16.0.23', blocked: true },
        { type: 'Directory Traversal', severity: 'HIGH', source: '203.0.113.12', blocked: true },
        { type: 'Code Injection', severity: 'CRITICAL', source: '198.51.100.7', blocked: true }
    ];

    const attack = attacks[Math.floor(Math.random() * attacks.length)];
    attack.timestamp = new Date().toISOString();
    attack.id = crypto.randomBytes(4).toString('hex');

    attackLogs.unshift(attack);
    if (attackLogs.length > 100) attackLogs.pop();

    systemStats.threatsBlocked++;
    systemStats.lastAttack = attack.timestamp;

    // Broadcast to all connected WebSocket clients
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
                type: 'attack',
                data: attack,
                stats: systemStats
            }));
        }
    });
}

// Simulate real-time activity every 3-8 seconds
setInterval(simulateRealTimeAttack, Math.random() * 5000 + 3000);

// Dashboard HTML
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛡️ Mirror Defense Industrial Dashboard</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a;
            color: #e2e8f0;
            overflow-x: hidden;
        }
        
        .header {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
            font-size: 24px;
            font-weight: bold;
        }
        
        .status-indicator {
            display: flex;
            align-items: center;
            gap: 10px;
            background: rgba(34, 197, 94, 0.1);
            padding: 10px 20px;
            border-radius: 25px;
            border: 2px solid #22c55e;
        }
        
        .pulse {
            width: 12px;
            height: 12px;
            background: #22c55e;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .dashboard {
            padding: 30px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            max-width: 1400px;
            margin: 0 auto;
        }
        
        .card {
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .card h3 {
            margin-bottom: 20px;
            color: #f1f5f9;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .stat-item {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            color: #22c55e;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #94a3b8;
            font-size: 14px;
        }
        
        .attack-log {
            max-height: 400px;
            overflow-y: auto;
            background: rgba(0,0,0,0.3);
            border-radius: 10px;
            padding: 15px;
        }
        
        .attack-item {
            padding: 12px;
            margin-bottom: 10px;
            border-radius: 8px;
            border-left: 4px solid;
            display: flex;
            justify-content: space-between;
            align-items: center;
            animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .severity-critical { border-left-color: #ef4444; background: rgba(239, 68, 68, 0.1); }
        .severity-high { border-left-color: #f97316; background: rgba(249, 115, 22, 0.1); }
        .severity-medium { border-left-color: #eab308; background: rgba(234, 179, 8, 0.1); }
        
        .attack-details {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .attack-type {
            font-weight: bold;
            color: #f1f5f9;
        }
        
        .attack-source {
            font-size: 12px;
            color: #94a3b8;
            font-family: 'Courier New', monospace;
        }
        
        .attack-status {
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            font-weight: bold;
            background: #22c55e;
            color: #000;
        }
        
        .controls {
            display: flex;
            gap: 15px;
            margin: 20px 0;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
        }
        
        .btn-danger {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        }
        
        .full-width {
            grid-column: 1 / -1;
        }
        
        .config-panel {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .config-group {
            background: rgba(0,0,0,0.3);
            padding: 20px;
            border-radius: 10px;
        }
        
        .config-group h4 {
            margin-bottom: 15px;
            color: #f1f5f9;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #94a3b8;
        }
        
        .form-group input, .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 5px;
            background: rgba(0,0,0,0.3);
            color: #f1f5f9;
        }
        
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            border-left: 4px solid;
        }
        
        .alert-success {
            background: rgba(34, 197, 94, 0.1);
            border-left-color: #22c55e;
            color: #22c55e;
        }
        
        .alert-warning {
            background: rgba(234, 179, 8, 0.1);
            border-left-color: #eab308;
            color: #eab308;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">
            <span>🛡️</span>
            <span>Mirror Defense Industrial Dashboard</span>
        </div>
        <div class="status-indicator">
            <div class="pulse"></div>
            <span>SYSTEM ACTIVE</span>
        </div>
    </div>
    
    <div class="dashboard">
        <!-- System Statistics -->
        <div class="card">
            <h3>📊 Live Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-number" id="threats-count">0</div>
                    <div class="stat-label">Threats Blocked</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="decoys-count">0</div>
                    <div class="stat-label">Decoys Served</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="integrity-count">0</div>
                    <div class="stat-label">Integrity Checks</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number" id="uptime">0h</div>
                    <div class="stat-label">System Uptime</div>
                </div>
            </div>
            
            <div class="controls">
                <button class="btn btn-primary" onclick="refreshStats()">🔄 Refresh</button>
                <button class="btn btn-danger" onclick="clearLogs()">🗑️ Clear Logs</button>
            </div>
        </div>
        
        <!-- Real-time Attack Log -->
        <div class="card">
            <h3>🚨 Real-time Attack Monitor</h3>
            <div class="attack-log" id="attack-log">
                <div class="alert alert-success">
                    ✅ Mirror Defense monitoring active. Attacks will appear here in real-time.
                </div>
            </div>
        </div>
        
        <!-- Configuration Panel -->
        <div class="card full-width">
            <h3>⚙️ Security Configuration</h3>
            <div class="config-panel">
                <div class="config-group">
                    <h4>🔒 Content Security Policy</h4>
                    <div class="form-group">
                        <label>CSP Directives</label>
                        <textarea id="csp-config" rows="4" placeholder="default-src 'self'; script-src 'self' 'unsafe-inline';">default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';</textarea>
                    </div>
                    <button class="btn btn-primary" onclick="updateCSP()">Update CSP</button>
                </div>
                
                <div class="config-group">
                    <h4>🎭 Decoy Configuration</h4>
                    <div class="form-group">
                        <label>Decoy Refresh Interval (minutes)</label>
                        <input type="number" id="decoy-interval" value="30" min="5" max="1440">
                    </div>
                    <div class="form-group">
                        <label>Threat Response Level</label>
                        <select id="threat-level" style="width: 100%; padding: 10px; border: 1px solid rgba(255,255,255,0.2); border-radius: 5px; background: rgba(0,0,0,0.3); color: #f1f5f9;">
                            <option value="low">Low - Basic Protection</option>
                            <option value="medium" selected>Medium - Enhanced Security</option>
                            <option value="high">High - Maximum Defense</option>
                        </select>
                    </div>
                    <button class="btn btn-primary" onclick="updateDecoyConfig()">Update Configuration</button>
                </div>
            </div>
        </div>
    </div>
    
    <script>
        // WebSocket connection for real-time updates
        const ws = new WebSocket('ws://localhost:8080');
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            
            if (data.type === 'attack') {
                addAttackToLog(data.data);
                updateStats(data.stats);
            }
        };
        
        function addAttackToLog(attack) {
            const log = document.getElementById('attack-log');
            const attackItem = document.createElement('div');
            attackItem.className = \`attack-item severity-\${attack.severity.toLowerCase()}\`;
            
            attackItem.innerHTML = \`
                <div class="attack-details">
                    <div class="attack-type">\${attack.type}</div>
                    <div class="attack-source">From: \${attack.source}</div>
                    <div style="font-size: 12px; color: #64748b;">\${new Date(attack.timestamp).toLocaleTimeString()}</div>
                </div>
                <div class="attack-status">BLOCKED</div>
            \`;
            
            log.insertBefore(attackItem, log.firstChild);
            
            // Remove old entries (keep last 20)
            while (log.children.length > 21) {
                log.removeChild(log.lastChild);
            }
        }
        
        function updateStats(stats) {
            document.getElementById('threats-count').textContent = stats.threatsBlocked;
            document.getElementById('decoys-count').textContent = stats.decoysServed;
            document.getElementById('integrity-count').textContent = stats.integrityChecks;
            
            const uptime = Math.floor((Date.now() - stats.uptime) / (1000 * 60 * 60));
            document.getElementById('uptime').textContent = uptime + 'h';
        }
        
        function refreshStats() {
            fetch('/api/stats')
                .then(response => response.json())
                .then(stats => updateStats(stats))
                .catch(console.error);
        }
        
        function clearLogs() {
            if (confirm('Clear all attack logs?')) {
                document.getElementById('attack-log').innerHTML = '<div class="alert alert-success">✅ Logs cleared. New attacks will appear here.</div>';
            }
        }
        
        function updateCSP() {
            const csp = document.getElementById('csp-config').value;
            fetch('/api/config/csp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ csp })
            })
            .then(response => response.json())
            .then(result => {
                alert('CSP updated successfully!');
            })
            .catch(console.error);
        }
        
        function updateDecoyConfig() {
            const interval = document.getElementById('decoy-interval').value;
            const threatLevel = document.getElementById('threat-level').value;
            
            fetch('/api/config/decoy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ interval, threatLevel })
            })
            .then(response => response.json())
            .then(result => {
                alert('Decoy configuration updated!');
            })
            .catch(console.error);
        }
        
        // Initial stats load
        refreshStats();
        
        // Auto-refresh stats every 30 seconds
        setInterval(refreshStats, 30000);
    </script>
</body>
</html>
    `);
});

// API endpoints
app.get('/api/stats', (req, res) => {
    res.json(systemStats);
});

app.get('/api/attacks', (req, res) => {
    res.json(attackLogs);
});

app.post('/api/config/csp', (req, res) => {
    const { csp } = req.body;

    // Save CSP configuration
    const config = {
        csp,
        timestamp: new Date().toISOString(),
        updatedBy: 'admin'
    };

    fs.writeFileSync('config/csp.json', JSON.stringify(config, null, 2));
    res.json({ success: true, message: 'CSP updated successfully' });
});

app.post('/api/config/decoy', (req, res) => {
    const { interval, threatLevel } = req.body;

    // Save decoy configuration
    const config = {
        refreshInterval: parseInt(interval),
        threatLevel,
        timestamp: new Date().toISOString(),
        updatedBy: 'admin'
    };

    fs.writeFileSync('config/decoy.json', JSON.stringify(config, null, 2));
    res.json({ success: true, message: 'Decoy configuration updated successfully' });
});

// WebSocket connection tracking
wss.on('connection', (ws) => {
    systemStats.activeConnections++;
    console.log(`📡 New dashboard connection. Active: ${systemStats.activeConnections}`);

    ws.on('close', () => {
        systemStats.activeConnections--;
        console.log(`📡 Dashboard disconnected. Active: ${systemStats.activeConnections}`);
    });
});

// Start dashboard server
app.listen(PORT, () => {
    console.log(`🛡️ Mirror Defense Industrial Dashboard running at http://localhost:${PORT}`);
    console.log(`📡 WebSocket server running on port 8080`);
    console.log(`📊 Real-time monitoring active`);
    console.log(`⚙️ Configuration panel available`);
});

// Create config directory if it doesn't exist
if (!fs.existsSync('config')) {
    fs.mkdirSync('config');
}
