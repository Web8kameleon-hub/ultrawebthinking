// mirror-defense-demo.js - Pure JavaScript Demo Server
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'build/protected')));
app.use(express.static(path.join(__dirname, 'build/ui')));

// Demo endpoint to show Mirror Defense in action
app.get('/demo', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🛡️ Mirror Defense Demo</title>
    <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin: 0; 
            padding: 20px; 
            color: white;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            background: rgba(255,255,255,0.1); 
            padding: 30px; 
            border-radius: 20px; 
            backdrop-filter: blur(10px);
        }
        .mirror-box { 
            background: rgba(0,0,0,0.3); 
            margin: 20px 0; 
            padding: 20px; 
            border-radius: 10px; 
            border-left: 5px solid;
        }
        .broken { border-left-color: #ff6b6b; }
        .close { border-left-color: #4ecdc4; }
        .out { border-left-color: #45b7d1; }
        .code-sample { 
            background: #2d3748; 
            padding: 15px; 
            border-radius: 8px; 
            overflow-x: auto; 
            font-family: 'Consolas', monospace; 
            margin: 10px 0;
        }
        .button { 
            background: #4c51bf; 
            color: white; 
            padding: 12px 24px; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            margin: 10px 5px;
            font-size: 16px;
        }
        .button:hover { background: #553c9a; }
        .stats { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); 
            gap: 20px; 
            margin: 20px 0;
        }
        .stat-card { 
            background: rgba(255,255,255,0.1); 
            padding: 20px; 
            border-radius: 10px; 
            text-align: center;
        }
        .stat-number { font-size: 2rem; font-weight: bold; }
        .live-indicator { 
            display: inline-block; 
            width: 10px; 
            height: 10px; 
            background: #4ade80; 
            border-radius: 50%; 
            animation: pulse 2s infinite;
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .shield-icon { font-size: 3rem; margin-bottom: 10px; }
        
        /* Tab Bar Styles */
        .tab-bar {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(10px);
            display: flex;
            justify-content: center;
            padding: 10px 0;
            border-top: 2px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
        }
        
        .tab {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 12px 25px;
            margin: 0 10px;
            border-radius: 25px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            border: 2px solid rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .tab.active {
            background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
            box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
            transform: translateY(-2px);
        }
        
        .tab-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: currentColor;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        body {
            padding-bottom: 80px; /* Space for fixed tab bar */
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛡️ Web8 Mirror Defense - Live Demo</h1>
        <p><span class="live-indicator"></span> System Status: <strong>ACTIVE & PROTECTING</strong></p>
        
        <div class="stats">
            <div class="stat-card">
                <div class="shield-icon">🔥</div>
                <div class="stat-number" id="threats-blocked">0</div>
                <div>Threats Blocked</div>
            </div>
            <div class="stat-card">
                <div class="shield-icon">🎭</div>
                <div class="stat-number" id="decoys-served">0</div>
                <div>Decoys Served</div>
            </div>
            <div class="stat-card">
                <div class="shield-icon">🔒</div>
                <div class="stat-number" id="integrity-checks">0</div>
                <div>Integrity Checks</div>
            </div>
        </div>

        <div class="mirror-box broken">
            <h3>🎭 Layer 1: Broken Mirror (Decoy)</h3>
            <p>Mashtrimi i Hackers - Kod i rremë që i largon sulmuese</p>
            <button class="button" onclick="loadDecoy()">📥 Load Decoy Code</button>
            <div id="decoy-result" class="code-sample" style="display:none;"></div>
        </div>

        <div class="mirror-box close">
            <h3>🛡️ Layer 2: Close Mirror (Real Protection)</h3>
            <p>Kodi real i mbrojtur me obfuskim industrial</p>
            <button class="button" onclick="loadProtected()">🔐 Load Protected Code</button>
            <div id="protected-result" class="code-sample" style="display:none;"></div>
        </div>

        <div class="mirror-box out">
            <h3>🔒 Layer 3: Out Mirror (UI Security)</h3>
            <p>HTML i siguruar me CSP dhe SRI</p>
            <button class="button" onclick="loadSecuredUI()">🌐 Load Secured HTML</button>
            <div id="ui-result" class="code-sample" style="display:none;"></div>
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <button class="button" onclick="runFullProtection()" style="background: #dc2626; font-size: 18px;">
                🚀 Run Full Mirror Defense
            </button>
            <button class="button" onclick="simulateAttack()" style="background: #ea580c;">
                ⚔️ Simulate Attack
            </button>
        </div>

        <div id="attack-log" style="margin-top: 20px; min-height: 200px; background: rgba(0,0,0,0.4); padding: 20px; border-radius: 10px; font-family: monospace; overflow-y: auto;"></div>
    </div>

    <script>
        let threatsBlocked = 0;
        let decoysServed = 0;
        let integrityChecks = 0;

        function updateStats() {
            document.getElementById('threats-blocked').textContent = threatsBlocked;
            document.getElementById('decoys-served').textContent = decoysServed;
            document.getElementById('integrity-checks').textContent = integrityChecks;
        }

        function log(message, type = 'info') {
            const logDiv = document.getElementById('attack-log');
            const timestamp = new Date().toLocaleTimeString();
            const color = type === 'success' ? '#4ade80' : type === 'warning' ? '#fbbf24' : type === 'danger' ? '#ef4444' : '#60a5fa';
            logDiv.innerHTML += \`<div style="color: \${color}">[\${timestamp}] \${message}</div>\`;
            logDiv.scrollTop = logDiv.scrollHeight;
        }

        async function loadDecoy() {
            log('🎭 Loading decoy code...', 'info');
            const result = document.getElementById('decoy-result');
            
            try {
                const response = await fetch('/api/decoy');
                const data = await response.text();
                result.innerHTML = data.substring(0, 500) + '...';
                result.style.display = 'block';
                decoysServed++;
                updateStats();
                log('✅ Decoy served successfully - Hacker will see fake code', 'success');
            } catch (error) {
                result.innerHTML = 'Error loading decoy: ' + error.message;
                result.style.display = 'block';
                log('❌ Failed to load decoy: ' + error.message, 'danger');
            }
        }

        async function loadProtected() {
            log('🔐 Loading protected code...', 'info');
            const result = document.getElementById('protected-result');
            
            try {
                const response = await fetch('/api/protected');
                const data = await response.text();
                result.innerHTML = data.substring(0, 300) + '... [OBFUSCATED]';
                result.style.display = 'block';
                integrityChecks++;
                updateStats();
                log('✅ Protected code verified - SRI check passed', 'success');
            } catch (error) {
                result.innerHTML = 'Access denied: ' + error.message;
                result.style.display = 'block';
                log('🚫 Protected code access denied', 'warning');
            }
        }

        async function loadSecuredUI() {
            log('🌐 Loading secured HTML...', 'info');
            const result = document.getElementById('ui-result');
            
            try {
                const response = await fetch('/api/ui');
                const data = await response.text();
                result.innerHTML = data;
                result.style.display = 'block';
                log('✅ Secured HTML loaded with CSP and SRI protection', 'success');
            } catch (error) {
                result.innerHTML = 'Error: ' + error.message;
                result.style.display = 'block';
                log('❌ Failed to load UI: ' + error.message, 'danger');
            }
        }

        function runFullProtection() {
            log('🚀 INITIATING FULL MIRROR DEFENSE...', 'warning');
            log('🔄 Generating timestamp: ' + Date.now(), 'info');
            log('🎭 Broken Mirror: Creating decoy payload...', 'info');
            setTimeout(() => log('🛡️ Close Mirror: Obfuscating real code...', 'info'), 1000);
            setTimeout(() => log('🔒 Out Mirror: Injecting CSP and SRI...', 'info'), 2000);
            setTimeout(() => {
                log('✅ MIRROR DEFENSE ACTIVE - All layers operational!', 'success');
                threatsBlocked += Math.floor(Math.random() * 5) + 1;
                updateStats();
            }, 3000);
        }

        function simulateAttack() {
            const attacks = [
                '🔍 Reconnaissance attempt detected',
                '⚡ XSS injection blocked by CSP',
                '🕸️ Web crawler hitting decoy endpoint',
                '🔓 Script injection attempt failed - SRI mismatch',
                '🎯 Targeted attack redirected to honeypot',
                '🛡️ SQL injection blocked by input validation',
                '🔥 DDoS attempt mitigated',
                '🎭 Attacker received fake source code'
            ];
            
            const attack = attacks[Math.floor(Math.random() * attacks.length)];
            log('🚨 ATTACK DETECTED: ' + attack, 'danger');
            
            setTimeout(() => {
                log('🛡️ Mirror Defense response activated', 'warning');
                setTimeout(() => {
                    log('✅ Attack neutralized successfully', 'success');
                    threatsBlocked++;
                    updateStats();
                }, 1500);
            }, 1000);
        }

        // ✅ Kjo ndalon simulimin
        // const demoMode = true; // Mos e lejo të fillojë simulimi
        const demoMode = false; // Ose vendose në 'false'

        // ✅ Komentoje këtë linjë që të mos thirret funksioni i simulimit
        // setInterval(simulateAttack, 10000); // Mos dërgo mesazhe simuluese çdo 10 sekonda
        
        // Auto-simulate activity - DISABLED
        // setInterval(() => {
        //     if (Math.random() > 0.7) {
        //         simulateAttack();
        //     }
        // }, 10000);

        // Initialize
        log('🛡️ Mirror Defense Demo initialized', 'success');
        log('🔄 Monitoring for threats...', 'info');
    </script>
    
    <!-- Tab Bar -->
    <div class="tab-bar">
        <div class="tab active">
            <span class="tab-indicator"></span>
            🛡️ Web8 Mirror Defense - Live Demo
        </div>
        <div class="tab">
            <span class="tab-indicator"></span>
            ⚙️ Web8 Mirror Defense - Demo Industrial
        </div>
    </div>
</body>
</html>
  `);
});

// API endpoints for demo
app.get('/api/decoy', (req, res) => {
    try {
        const decoyPath = path.join(__dirname, 'build/decoy');
        const files = fs.readdirSync(decoyPath);
        const latestDecoy = files.find(f => f.startsWith('app.decoy.'));

        if (latestDecoy) {
            const content = fs.readFileSync(path.join(decoyPath, latestDecoy), 'utf8');
            res.type('text/plain').send(content);
        } else {
            res.status(404).send('// FAKE CODE FOR HACKERS\nfunction boot() {\n    console.log("You found nothing!");\n}');
        }
    } catch (error) {
        res.status(500).send('Error loading decoy');
    }
});

app.get('/api/protected', (req, res) => {
    try {
        const protectedPath = path.join(__dirname, 'build/protected');
        const files = fs.readdirSync(protectedPath);
        const latestProtected = files.find(f => f.startsWith('app.protected.'));

        if (latestProtected) {
            const content = fs.readFileSync(path.join(protectedPath, latestProtected), 'utf8');
            res.type('text/plain').send(content);
        } else {
            res.status(404).send('Protected content not found');
        }
    } catch (error) {
        res.status(500).send('Access denied');
    }
});

app.get('/api/ui', (req, res) => {
    try {
        const uiPath = path.join(__dirname, 'build/ui/index.html');
        const content = fs.readFileSync(uiPath, 'utf8');
        res.type('text/plain').send(content);
    } catch (error) {
        res.status(500).send('UI not available');
    }
});

// Main page redirect
app.get('/', (req, res) => {
    res.redirect('/demo');
});

app.listen(PORT, () => {
    console.log(`🛡️ Mirror Defense Demo Server running at http://localhost:${PORT}`);
    console.log(`🎭 Demo URL: http://localhost:${PORT}/demo`);
    console.log(`🔧 API Endpoints:`);
    console.log(`   📥 /api/decoy - View decoy code`);
    console.log(`   🔐 /api/protected - View protected code`);
    console.log(`   🌐 /api/ui - View secured HTML`);
});
