# Web8 Intelligence Platform API Quick Test Script
# Run with: .\test-web8-apis.ps1

param(
    [string]$BaseUrl = "http://localhost:3000",
    [switch]$Verbose
)

Write-Host "🚀 Web8 Intelligence Platform API Test Suite" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

$results = @()

function Test-API {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "🧪 Testing: $Name" -ForegroundColor White
    Write-Host "📡 $Method $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri        = $Url
            Method     = $Method
            Headers    = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
        }
        
        $startTime = Get-Date
        $response = Invoke-RestMethod @params
        $endTime = Get-Date
        $responseTime = ($endTime - $startTime).TotalMilliseconds
        
        Write-Host "✅ Success: $([Math]::Round($responseTime))ms" -ForegroundColor Green
        
        if ($Verbose) {
            if ($response -is [string]) {
                Write-Host "Response (first 200 chars): $($response.Substring(0, [Math]::Min(200, $response.Length)))..." -ForegroundColor DarkGray
            }
            else {
                Write-Host "Response: $($response | ConvertTo-Json -Depth 2 -Compress)" -ForegroundColor DarkGray
            }
        }
        
        $results += @{
            Name         = $Name
            Status       = "✅ Pass"
            ResponseTime = "$([Math]::Round($responseTime))ms"
            Error        = $null
        }
        
    }
    catch {
        Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
        
        $results += @{
            Name         = $Name
            Status       = "❌ Fail"
            ResponseTime = "N/A"
            Error        = $_.Exception.Message
        }
    }
    
    Write-Host ""
}

# Test Suite
Write-Host "Starting API tests..." -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Test-API -Name "Health Check" -Url "$BaseUrl/api/health"

# 2. Search API
Test-API -Name "Real Web Search" -Url "$BaseUrl/api/search?q=artificial%20intelligence&count=3"

# 3. Text Analysis
$analysisBody = @{
    text = "Web8 Intelligence Platform është një sistem i avancuar për analizën e të dhënave në kohë reale."
} | ConvertTo-Json

Test-API -Name "Text Analysis" -Url "$BaseUrl/api/analyze" -Method "POST" -Headers @{
    "Content-Type" = "application/json"
} -Body $analysisBody

# 4. Content Ingestion
Test-API -Name "Content Ingestion" -Url "$BaseUrl/api/ingest?url=https://example.com"

# 5. Ingested Data Summary
Test-API -Name "Ingested Data Summary" -Url "$BaseUrl/api/ingested"

# 6. Aviation Weather
Test-API -Name "Aviation Weather" -Url "$BaseUrl/api/aviation/LOWW"

# 7. UTT Token Info
Test-API -Name "UTT Token Info" -Url "$BaseUrl/api/utt/info"

# 8. LoRa Network Status
Test-API -Name "LoRa Network Status" -Url "$BaseUrl/api/lora/status"

# Results Summary
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host "📊 Test Results Summary" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Gray

$passed = ($results | Where-Object { $_.Status -like "*Pass*" }).Count
$failed = ($results | Where-Object { $_.Status -like "*Fail*" }).Count
$total = $results.Count

foreach ($result in $results) {
    $color = if ($result.Status -like "*Pass*") { "Green" } else { "Red" }
    Write-Host "$($result.Status) $($result.Name) ($($result.ResponseTime))" -ForegroundColor $color
    
    if ($result.Error -and $Verbose) {
        Write-Host "    Error: $($result.Error)" -ForegroundColor DarkRed
    }
}

Write-Host ""
Write-Host "📈 Final Score: $passed/$total tests passed" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })

if ($passed -eq $total) {
    Write-Host "🎉 All tests passed! Web8 Intelligence Platform is fully operational." -ForegroundColor Green
}
else {
    Write-Host "⚠️  Some tests failed. Check the errors above and ensure the server is running." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "  • Make sure 'npm run dev' is running" -ForegroundColor Gray
Write-Host "  • Check BRAVE_API_KEY in .env.local" -ForegroundColor Gray
Write-Host "  • Use -Verbose flag for detailed responses" -ForegroundColor Gray
Write-Host "  • Open http://localhost:3000/intelligence for UI testing" -ForegroundColor Gray
