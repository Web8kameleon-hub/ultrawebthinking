// mirror-defense-server.js
const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;

// Serve static files
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/assets', express.static(path.join(__dirname, 'build/protected')));

// Demo page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'mirror-defense-demo.html'));
});

// API to get current protection status
app.get('/api/status', (req, res) => {
    try {
        const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, 'build/manifest.json'), 'utf8'));
        const uiContent = fs.readFileSync(path.join(__dirname, 'build/ui/index.html'), 'utf8');

        // Extract SRI hash from HTML
        const sriMatch = uiContent.match(/integrity="([^"]+)"/);
        const sri = sriMatch ? sriMatch[1] : 'Not found';

        // Extract CSP from HTML
        const cspMatch = uiContent.match(/content="([^"]+)"/);
        const csp = cspMatch ? cspMatch[1] : 'Not found';

        res.json({
            status: 'active',
            timestamp: manifest.timestamp,
            files: {
                decoy: manifest.decoy,
                protected: manifest.protected,
                ui: manifest.ui
            },
            security: {
                sri: sri,
                csp: csp.substring(0, 100) + '...'
            },
            uptime: Date.now() - manifest.timestamp
        });
    } catch (error) {
        res.status(500).json({ error: 'Mirror Defense not initialized' });
    }
});

// API to trigger new protection
app.post('/api/protect', (req, res) => {
    const { exec } = require('child_process');

    exec('npm run dev:protect', (error, stdout, stderr) => {
        if (error) {
            res.status(500).json({ error: error.message });
            return;
        }

        res.json({
            success: true,
            message: 'Mirror Defense protection completed',
            output: stdout
        });
    });
});

// Serve protected file with security headers
app.get('/protected/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'build/protected', filename);

    if (!fs.existsSync(filepath)) {
        return res.status(404).json({ error: 'Protected file not found' });
    }

    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Content-Type', 'application/javascript');

    res.sendFile(filepath);
});

// Live demo of UI protection
app.get('/demo/ui', (req, res) => {
    const uiPath = path.join(__dirname, 'build/ui/index.html');

    if (!fs.existsSync(uiPath)) {
        return res.status(404).send('<h1>UI not generated. Run: npm run dev:protect</h1>');
    }

    // Read and serve the protected UI
    const content = fs.readFileSync(uiPath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    res.send(content);
});

app.listen(PORT, () => {
    console.log(`🛡️ Mirror Defense Demo Server: http://localhost:${PORT}`);
    console.log(`📊 Status API: http://localhost:${PORT}/api/status`);
    console.log(`🌐 Protected UI: http://localhost:${PORT}/demo/ui`);
    console.log(`\n🔄 To run protection: npm run dev:protect`);
});
