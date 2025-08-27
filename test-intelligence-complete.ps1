# Web8 Intelligence Platform - Complete Test Suite
# This script tests all intelligence modules and their endpoints

Write-Host "🌟 Web8 Intelligence Platform - Complete Test Suite" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray

$baseUrl = "http://localhost:3000"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"

Write-Host "🕒 Test started at: $timestamp" -ForegroundColor Green
Write-Host ""

# Function to test an endpoint
function Test-Endpoint {
    param($name, $url, $method = "GET")
    Write-Host "Testing $name..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri $url -Method $method -TimeoutSec 10
        if ($response) {
            Write-Host "✅ $name - SUCCESS" -ForegroundColor Green
        }
        else {
            Write-Host "⚠️ $name - SUCCESS (No response data)" -ForegroundColor Yellow
        }
        return $true
    }
    catch {
        Write-Host "❌ $name - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Function to test a page
function Test-Page {
    param($name, $url)
    Write-Host "Testing $name page..." -ForegroundColor Yellow
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ $name page - SUCCESS (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        }
        else {
            Write-Host "❌ $name page - FAILED (Status: $($response.StatusCode))" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "❌ $name page - FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

Write-Host "🧪 Testing API Endpoints..." -ForegroundColor Cyan
Write-Host "-" * 40

$apiTests = @()

# Stats API
$apiTests += Test-Endpoint "System Stats API" "$baseUrl/api/stats"

# Search API
$apiTests += Test-Endpoint "Search API" "$baseUrl/api/search?q=javascript"

# Analysis API 
$apiTests += Test-Endpoint "Text Analysis API" "$baseUrl/api/analyze?text=Hello world this is a test"

# Ingestion API
$apiTests += Test-Endpoint "Content Ingestion API" "$baseUrl/api/ingest?url=https://example.com"

# Ingested Summary API
$apiTests += Test-Endpoint "Ingested Summary API" "$baseUrl/api/ingested"

# Report Generation API
$apiTests += Test-Endpoint "PDF Report API" "$baseUrl/api/report?title=Test Report&data=sample"

Write-Host ""
Write-Host "🎯 Testing Intelligence Pages..." -ForegroundColor Cyan
Write-Host "-" * 40

$pageTests = @()

# Main Intelligence Dashboard
$pageTests += Test-Page "Intelligence Dashboard" "$baseUrl/en/intelligence"

# Individual Module Pages
$pageTests += Test-Page "Search Module" "$baseUrl/en/search"
$pageTests += Test-Page "Analysis Module" "$baseUrl/en/analysis"
$pageTests += Test-Page "Statistics Module" "$baseUrl/en/stats"
$pageTests += Test-Page "Reports Module" "$baseUrl/en/reports"
$pageTests += Test-Page "Ingestion Module" "$baseUrl/en/ingestion"

Write-Host ""
Write-Host "📊 Test Summary:" -ForegroundColor Cyan
Write-Host "-" * 40

$totalApiTests = $apiTests.Count
$passedApiTests = ($apiTests | Where-Object { $_ -eq $true }).Count
$apiSuccessRate = [math]::Round(($passedApiTests / $totalApiTests) * 100, 2)

$totalPageTests = $pageTests.Count
$passedPageTests = ($pageTests | Where-Object { $_ -eq $true }).Count
$pageSuccessRate = [math]::Round(($passedPageTests / $totalPageTests) * 100, 2)

$apiResultText = "API Endpoints: {0}/{1} passed ({2} percent)" -f $passedApiTests, $totalApiTests, $apiSuccessRate
$pageResultText = "Pages: {0}/{1} passed ({2} percent)" -f $passedPageTests, $totalPageTests, $pageSuccessRate

Write-Host $apiResultText -ForegroundColor $(if ($apiSuccessRate -eq 100) { "Green" } else { "Yellow" })
Write-Host $pageResultText -ForegroundColor $(if ($pageSuccessRate -eq 100) { "Green" } else { "Yellow" })

$overallSuccessRate = [math]::Round((($passedApiTests + $passedPageTests) / ($totalApiTests + $totalPageTests)) * 100, 2)
$overallResultText = "Overall Success Rate: {0} percent" -f $overallSuccessRate
Write-Host $overallResultText -ForegroundColor $(if ($overallSuccessRate -eq 100) { "Green" } elseif ($overallSuccessRate -ge 80) { "Yellow" } else { "Red" })

Write-Host ""
Write-Host "🌟 Web8 Intelligence Platform Status:" -ForegroundColor Cyan
if ($overallSuccessRate -eq 100) {
    Write-Host "🎉 ALL SYSTEMS OPERATIONAL! Platform ready for production." -ForegroundColor Green
}
elseif ($overallSuccessRate -ge 80) {
    Write-Host "⚠️ MOSTLY OPERATIONAL. Some modules may need attention." -ForegroundColor Yellow
}
else {
    Write-Host "🚨 CRITICAL ISSUES DETECTED. Platform needs debugging." -ForegroundColor Red
}

Write-Host ""
Write-Host "🔗 Quick Access Links:" -ForegroundColor Cyan
Write-Host "Intelligence Dashboard: http://localhost:3000/en/intelligence" -ForegroundColor Blue
Write-Host "Search Module: http://localhost:3000/en/search" -ForegroundColor Blue
Write-Host "Analysis Module: http://localhost:3000/en/analysis" -ForegroundColor Blue
Write-Host "Statistics Module: http://localhost:3000/en/stats" -ForegroundColor Blue
Write-Host "Reports Module: http://localhost:3000/en/reports" -ForegroundColor Blue
Write-Host "Ingestion Module: http://localhost:3000/en/ingestion" -ForegroundColor Blue

$endTime = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Write-Host ""
Write-Host "🕒 Test completed at: $endTime" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Gray
