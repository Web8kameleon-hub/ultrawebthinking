#!/bin/bash
# Web8 Intelligence Platform - Postman Quick Test
# This script creates a simple Postman test for immediate verification

echo "🚀 Web8 Intelligence Platform - Postman Connection Test"
echo "======================================================="
echo ""

# Check if server is running
echo "📡 Testing server connection..."
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health > response_code.txt
RESPONSE_CODE=$(cat response_code.txt)

if [ "$RESPONSE_CODE" = "200" ]; then
    echo "✅ Server is running (HTTP $RESPONSE_CODE)"
    echo ""
    
    echo "🏥 Health Check Response:"
    curl -s http://localhost:3000/api/health | jq '.' 2>/dev/null || curl -s http://localhost:3000/api/health
    echo ""
    echo ""
    
    echo "📋 Available Endpoints for Postman:"
    echo "1. GET  {{baseUrl}}/api/health              - System health"
    echo "2. GET  {{baseUrl}}/api/search?q=test       - Real web search"
    echo "3. POST {{baseUrl}}/api/analyze             - Text analysis"
    echo "4. GET  {{baseUrl}}/api/report?q=test       - PDF generation"
    echo "5. GET  {{baseUrl}}/api/stats               - Real-time metrics"
    echo "6. GET  {{baseUrl}}/api/ingest?url=...      - Content ingestion"
    echo ""
    
    echo "🎯 Postman Import Files:"
    echo "• Web8-Intelligence-APIs.postman_collection.json"
    echo "• Web8-Environment.postman_environment.json"
    echo ""
    
    echo "✅ Ready for Postman testing!"
    echo "Open Postman → Import files → Select environment → Test endpoints"
    
else
    echo "❌ Server not responding (HTTP $RESPONSE_CODE)"
    echo "Please start server with: npm run dev"
fi

# Cleanup
rm -f response_code.txt

echo ""
echo "🌐 Browser test URL: http://localhost:3000/intelligence"
