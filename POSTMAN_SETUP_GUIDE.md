# 🚀 Web8 Intelligence Platform - Postman Setup Guide

## 📋 Quick Setup

### 1. Import Collection & Environment
1. **Open Postman** (already installed)
2. **Import Collection**:
   - File → Import
   - Select: `Web8-Intelligence-APIs.postman_collection.json`
3. **Import Environment**:
   - Environment dropdown → Import
   - Select: `Web8-Environment.postman_environment.json`

### 2. Configure Environment
1. **Select Environment**: "Web8 Intelligence Platform Environment"
2. **Set Variables**:
   - `baseUrl`: `http://localhost:3000` ✅
   - `BRAVE_API_KEY`: `your_brave_api_key_here` (update with real key)

## 🧪 Testing API Endpoints

### 🏥 Health Check
```
GET {{baseUrl}}/api/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-26T...",
  "services": {
    "utt": { "status": "operational" },
    "lora": { "status": "operational" }
  }
}
```

### 🔍 Real Web Search
```
GET {{baseUrl}}/api/search?q=artificial intelligence&count=5
```
**Expected Response:**
```json
{
  "provider": "brave",
  "results": [
    {
      "id": "uuid-here",
      "title": "AI Article Title",
      "url": "https://...",
      "snippet": "Description...",
      "source": "brave",
      "ts": 1724662800000
    }
  ]
}
```

### 🧠 Text Analysis
```
POST {{baseUrl}}/api/analyze
Content-Type: application/json

{
  "text": "Web8 Intelligence Platform është një sistem i avancuar..."
}
```
**Expected Response:**
```json
{
  "langGuess": "sq",
  "wordCount": 25,
  "topKeywords": [
    {"token": "intelligence", "score": 3},
    {"token": "platform", "score": 2}
  ],
  "summary": ["Sentence 1", "Sentence 2"],
  "sentiment": {"score": 2, "magnitude": 3}
}
```

### 📄 PDF Report Generation
```
GET {{baseUrl}}/api/report?q=web8 intelligence
```
**Expected Response**: PDF file download

### 📊 Real-time System Stats (SSE)
```
GET {{baseUrl}}/api/stats
Accept: text/event-stream
```
**Expected Response**: Streaming JSON data
```json
{
  "ts": 1724662800000,
  "cpu": {"load": 15.2, "brand": "Intel..."},
  "mem": {"usagePercent": 45.7},
  "net": [...],
  "disk": {...}
}
```

### 🌐 Content Ingestion
```
GET {{baseUrl}}/api/ingest?url=https://example.com
```
**Expected Response:**
```json
{
  "id": "uuid-here",
  "url": "https://example.com",
  "ts": 1724662800000,
  "contentLength": 1234,
  "analysis": {
    "langGuess": "en",
    "wordCount": 150,
    "topKeywords": [...],
    "summary": [...],
    "sentiment": {...}
  }
}
```

## 🔧 Advanced Testing

### Test Scenarios
1. **Basic Functionality**: Run all GET endpoints
2. **Error Handling**: Test with invalid parameters
3. **Performance**: Check response times
4. **Real Data**: Verify no mock data in responses

### Automation Scripts
```javascript
// Pre-request Script
console.log('🚀 Testing:', pm.info.requestName);
pm.globals.set('requestTimestamp', new Date().toISOString());

// Test Script
pm.test('Response time < 5s', function () {
    pm.expect(pm.response.responseTime).to.be.below(5000);
});

pm.test('Status code is 200', function () {
    pm.response.to.have.status(200);
});
```

## 🎯 Collection Features

### ✅ Included APIs
- ✅ Health Check
- ✅ Real Web Search
- ✅ Text Analysis
- ✅ PDF Report Generation
- ✅ Real-time System Stats
- ✅ Content Ingestion
- ✅ Aviation Weather
- ✅ UTT Token Info
- ✅ LoRa Network Status

### 🔄 Auto-Tests
- Response time validation
- Status code checks
- Content type verification
- JSON/PDF format validation

## 💡 Tips & Tricks

### 1. Environment Variables
Use `{{variableName}}` for dynamic values:
- `{{baseUrl}}` - Server URL
- `{{testQuery}}` - Search queries
- `{{BRAVE_API_KEY}}` - API credentials

### 2. Response Inspection
- **Pretty Tab**: Formatted JSON view
- **Raw Tab**: Exact response data
- **Headers Tab**: Response headers
- **Test Results Tab**: Automated test results

### 3. Collection Runner
1. Select collection
2. Click "Run collection"
3. Choose environment
4. Set iterations and delays
5. Run automated test suite

## 🚨 Troubleshooting

### Common Issues
1. **Connection Refused**: Make sure `npm run dev` is running
2. **401 Unauthorized**: Check BRAVE_API_KEY in environment
3. **Timeout**: Increase timeout in Postman settings
4. **CORS Errors**: APIs should handle CORS properly

### Debug Mode
1. Open Console (View → Show Postman Console)
2. Check pre-request and test script logs
3. Inspect network requests and responses

## 🎉 Success Indicators

### All Tests Pass ✅
- Health endpoint returns 200
- Search returns real results (not mock)
- Analysis processes actual text
- PDF generates successfully
- Stats stream real system metrics
- Ingestion fetches real URLs

**Your Web8 Intelligence Platform is fully operational when all Postman tests pass!** 🚀
