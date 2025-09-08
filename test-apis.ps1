// Simple PowerShell script to test APIs
$headers = @{
    'Content-Type' = 'application/json'
    'Accept' = 'application/json'
}

Write-Host "Testing APIs..."

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -Headers $headers
    Write-Host "✅ Health API working:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Health API failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/industrial/sensors" -Method GET -Headers $headers
    Write-Host "✅ Industrial Sensors API working:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Industrial Sensors API failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/industrial/machines" -Method GET -Headers $headers
    Write-Host "✅ Industrial Machines API working:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Industrial Machines API failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/industrial/metrics" -Method GET -Headers $headers
    Write-Host "✅ Industrial Metrics API working:" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "❌ Industrial Metrics API failed: $($_.Exception.Message)" -ForegroundColor Red
}
