// Test page për ultra-power
export default function TestPage() {
    return (
        <div style={{
            padding: '50px',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #667eea, #764ba2)',
            color: 'white',
            minHeight: '100vh'
        }}>
            <h1>🚀 Ultra Power Test Page</h1>
            <p>Kjo faqe po punon!</p>
            <p>Route: /ultra-power</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
