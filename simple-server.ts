import http from 'http'

const server = http.createServer((req, res) => {
  try {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
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
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify({ 
      status: 'OK', 
      message: 'API working perfectly!', 
      timestamp: new Date().toISOString() 
    }))
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    res.end('404 Not Found')
  }
  } catch (error) {
    console.error('Request error:', error)
    if (!res.headersSent) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('Internal Server Error')
    }
  }
})

const PORT = 8080
server.listen(PORT, () => {
  console.log(`SERVER RUNNING on http://localhost:${PORT}`)
  console.log('System is ready for use!')
})

server.on('error', (err) => {
  console.error('Server error:', err)
})

server.on('clientError', (err, socket) => {
  console.error('Client error:', err)
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT. Graceful shutdown...')
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM. Graceful shutdown...')
  server.close(() => {
    console.log('Server closed.')
    process.exit(0)
  })
})
