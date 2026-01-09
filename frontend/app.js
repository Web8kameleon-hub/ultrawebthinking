// Fetch API base URL
const API_URL = 'http://localhost:3000/api';

// Dashboard updates
async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/status`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();
        document.getElementById('status').textContent = data.system_health;
        document.getElementById('uptime').textContent = formatUptime(data.uptime);
        document.getElementById('sessions').textContent = data.active_sessions;
        document.getElementById('latency').textContent = data.api_latency_ms.toFixed(0);
        
        // Update status indicator
        const indicator = document.getElementById('status-indicator');
        if (data.system_health === 'healthy') {
            indicator.classList.add('online');
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('status').textContent = 'Offline';
    }
}

// Format uptime
function formatUptime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
}

// Send chat message
async function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    
    try {
        const response = await fetch(`${API_URL}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) throw new Error('Failed to get response');
        
        const data = await response.json();
        addMessageToChat(data.response, 'bot');
    } catch (error) {
        console.error('Error sending message:', error);
        addMessageToChat('Sorry, I encountered an error. Please try again.', 'bot');
    }
}

// Add message to chat
function addMessageToChat(text, sender) {
    const chatHistory = document.getElementById('chatHistory');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = `message-content ${sender}`;
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

// Handle Enter key in input
function handleKeyPress(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
}

// Open dashboard
function openDashboard() {
    document.getElementById('dashboard').scrollIntoView({ behavior: 'smooth' });
}

// Load dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
    // Refresh dashboard every 5 seconds
    setInterval(loadDashboard, 5000);
});
