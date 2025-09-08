import http from 'http'

const server = http.createServer(  console.log(`SERVER RUNNING on http://localhost:${PORT}`);
  console.log('System is ready for use!');eq, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <title>UltraWebThinking WORKING</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f0f0; }
        .success { color: green; font-size: 24px; }
        .button { padding: 10px 20px; background: blue; color: white; border: none; cursor: pointer; }
    </style>
</head>
<body>
    <h1 class="success">SUCCESS: UltraWebThinking WORKING!</h1>
    <p>Server is running on port 8080</p>
    <button class="button" onclick="testAPI()">Test API</button>
    <div id="result"></div>
    
    <script>
        async function testAPI() {
            try {
                const response = await fetch('/api/test');
                const data = await response.json();
                document.getElementById('result').innerHTML = 
                    '<p style="color: green;">SUCCESS API Response: ' + JSON.stringify(data) + '</p>';
            } catch (error) {
                document.getElementById('result').innerHTML = 
                    '<p style="color: red;">ERROR: ' + error.message + '</p>';
            }
        }
    </script>
</body>
</html>
    `)
  } else if (req.url === '/api/test') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'API funksionon perfekt!', 
      timestamp: new Date().toISOString() 
    }))
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('404 Not Found')
  }
})

const PORT: number = 8080
server.listen(PORT, () => {
  console.log(`🚀🚀🚀 UltraWebThinking SERVER RUNNING on http://localhost:${PORT} 🚀🚀🚀`)
  console.log('✅ Sistema është gati për përdorim!')
})

server.on('error', (err: Error) => {
  console.error('❌ Server error:', err)
})
