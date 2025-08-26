# 🚀 Web8 Intelligence Platform - Postman Connection Guide

## 📋 Step-by-Step Connection Process

### Step 1: Open Postman
1. **Launch Postman** (already installed)
2. If first time: Create account or skip sign-in

### Step 2: Import Collection and Environment

#### Import API Collection:
1. **File** → **Import**
2. **Select Files** or **Drag & Drop**
3. Choose: `Web8-Intelligence-APIs.postman_collection.json`
4. Click **Import**

#### Import Environment:
1. **Environments** tab (left sidebar)
2. **Import** button
3. Choose: `Web8-Environment.postman_environment.json`
4. Click **Import**

### Step 3: Activate Environment
1. **Environment dropdown** (top right)
2. Select: **"Web8 Intelligence Platform Environment"**
3. Verify variables are loaded

### Step 4: Test Basic Connection

#### First Test - Health Check:
1. **Collections** → **Web8 Intelligence Platform APIs**
2. Select: **🏥 Health Check**
3. Click **Send**
4. Expect: `200 OK` with JSON response

#### Expected Response:
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

### Step 5: Test Intelligence APIs

#### Real Web Search:
1. Select: **🔍 Real Web Search**
2. Modify query in URL if needed
3. Click **Send**
4. Expect: Real search results from Brave API

#### Text Analysis:
1. Select: **🧠 Text Analysis**
2. Review POST body (Albanian/German/English text)
3. Click **Send**
4. Expect: Language detection, keywords, sentiment

#### PDF Report:
1. Select: **📄 Generate PDF Report**
2. Click **Send**
3. Expect: PDF file download

#### Real-time Stats:
1. Select: **📊 Real-time System Stats**
2. Click **Send**
3. Expect: Streaming system metrics

## 🧪 Quick Test Commands

### PowerShell Alternative:
```powershell
# Test health endpoint
Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET

# Test search (if BRAVE_API_KEY is set)
Invoke-RestMethod -Uri "http://localhost:3000/api/search?q=test&count=3" -Method GET

# Test text analysis
$body = @{ text = "Test analysis text" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/analyze" -Method POST -Body $body -ContentType "application/json"
```

### Browser Testing:
```
http://localhost:3000/intelligence
http://localhost:3000/api/health
http://localhost:3000/api/search?q=test&count=3
```

## 🔧 Troubleshooting

### Connection Issues:
1. **Server not running**: Ensure `npm run dev` is active
2. **Port conflict**: Check if port 3000 is available
3. **Firewall**: Allow localhost connections

### API Specific Issues:
1. **Search fails**: Update BRAVE_API_KEY in environment
2. **PDF empty**: Check if search results are available
3. **Stats timeout**: Normal for SSE streams

### Postman Settings:
1. **Request timeout**: Settings → General → Request timeout (increase if needed)
2. **SSL verification**: Settings → General → SSL certificate verification (off for localhost)
3. **Proxy**: Settings → Proxy → Disable if using localhost

## 📊 Success Indicators

### ✅ Working Correctly:
- Health check returns 200 with system status
- Search returns real web results (not mock)
- Analysis processes text and returns keywords/sentiment
- PDF generates and downloads properly
- Stats stream real CPU/memory/network data
- No "mock" or "template" data anywhere

### 🔍 What to Look For:
- **Real Search Results**: URLs, titles, snippets from web
- **Actual System Metrics**: Your computer's CPU/RAM usage
- **Dynamic PDF**: Generated from search + analysis
- **Language Detection**: Correct language identification
- **Response Times**: Under 5 seconds for most endpoints

## 💡 Pro Tips

### Collection Runner:
1. Select collection → **Run**
2. Choose environment
3. Set iterations: 1
4. Delay: 1000ms
5. **Run Web8 Intelligence Platform APIs**

### Environment Variables:
- `{{baseUrl}}` - Server URL
- `{{testQuery}}` - Default search term
- `{{BRAVE_API_KEY}}` - Search API key

### Pre-request Scripts:
Collections include automatic logging and timestamp tracking

### Test Scripts:
Each request has built-in validation for:
- Response time < 5 seconds
- Status code 200/201
- Content type validation

---

## 🎯 Ready to Connect!

Your Web8 Intelligence Platform is ready for professional API testing with Postman. 

**Start with the Health Check, then explore the real intelligence features!** 🚀
