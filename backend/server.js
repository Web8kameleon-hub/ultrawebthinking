const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// System status
app.get('/api/status', (req, res) => {
    res.json({
        system_health: 'healthy',
        cpu_usage: Math.random() * 30,
        memory_usage: Math.random() * 50,
        active_sessions: Math.floor(Math.random() * 100),
        api_latency_ms: Math.floor(Math.random() * 50)
    });
});

// Simple chat endpoint
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    // Simple responses
    const responses = {
        hello: 'Hello! How can I help you today?',
        help: 'I can assist you with various tasks. What do you need?',
        status: 'System is running smoothly.',
        time: `Current time: ${new Date().toLocaleString()}`,
        default: `You said: "${message}". I am JONA, your intelligent assistant.`
    };

    const key = message.toLowerCase().split(' ')[0];
    const reply = responses[key] || responses.default;

    res.json({
        response: reply,
        timestamp: new Date().toISOString(),
        session_id: Math.random().toString(36).substr(2, 9)
    });
});

// Sessions endpoint
app.get('/api/sessions', (req, res) => {
    res.json({
        sessions: [
            { id: '1', user: 'User1', created: new Date(), status: 'active' },
            { id: '2', user: 'User2', created: new Date(), status: 'active' }
        ]
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✓ JONA API running on port ${PORT}`);
    console.log(`✓ Health check: http://localhost:${PORT}/api/health`);
});
