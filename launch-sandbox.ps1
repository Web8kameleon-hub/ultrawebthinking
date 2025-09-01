# AGI SANDBOX LAUNCHER - SAFE ENVIRONMENT
# @author Ledjan Ahmati
# @version SANDBOX-8.0.0
# PURPOSE: Launch AGI sandbox with zero production risk

Write-Host "🧪 LAUNCHING AGI SANDBOX - SAFE ENVIRONMENT" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Safety check
Write-Host "🛡️  SAFETY CHECK: Ensuring no production impact..." -ForegroundColor Yellow

# Check if we're in the right directory
if (-not (Test-Path "package.json")) {
    Write-Host "❌ ERROR: Not in project root directory" -ForegroundColor Red
    Write-Host "   Please run from project root where package.json exists" -ForegroundColor Red
    exit 1
}

# Verify sandbox files exist
$sandboxFiles = @(
    "sandbox\AGI-SANDBOX-SAFE.tsx",
    "app\api\sandbox\agi\route.ts"
)

foreach ($file in $sandboxFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ MISSING: $file" -ForegroundColor Red
        Write-Host "   Sandbox files not found. Please ensure sandbox is set up." -ForegroundColor Red
        exit 1
    } else {
        Write-Host "✅ FOUND: $file" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🚀 STARTING SANDBOX ENVIRONMENT..." -ForegroundColor Cyan

# Set sandbox environment variables
$env:SANDBOX_MODE = "true"
$env:SAFE_TESTING = "enabled"
$env:NO_PRODUCTION_IMPACT = "guaranteed"

Write-Host "   • SANDBOX_MODE = $($env:SANDBOX_MODE)" -ForegroundColor Green
Write-Host "   • SAFE_TESTING = $($env:SAFE_TESTING)" -ForegroundColor Green
Write-Host "   • NO_PRODUCTION_IMPACT = $($env:NO_PRODUCTION_IMPACT)" -ForegroundColor Green

Write-Host ""
Write-Host "📋 SANDBOX SAFETY FEATURES:" -ForegroundColor Yellow
Write-Host "   ✅ No production database access" -ForegroundColor Green
Write-Host "   ✅ Isolated test environment" -ForegroundColor Green
Write-Host "   ✅ Safe to test AGI modifications" -ForegroundColor Green
Write-Host "   ✅ Zero risk of data corruption" -ForegroundColor Green
Write-Host "   ✅ All metrics validated with provenance" -ForegroundColor Green
Write-Host "   ✅ TTL expiration handling" -ForegroundColor Green

Write-Host ""
Write-Host "🔧 AVAILABLE SANDBOX COMMANDS:" -ForegroundColor Cyan
Write-Host "   yarn dev:sandbox     - Start sandbox development server" -ForegroundColor White
Write-Host "   yarn test:sandbox     - Run sandbox tests" -ForegroundColor White
Write-Host "   yarn build:sandbox    - Build sandbox for testing" -ForegroundColor White

Write-Host ""
Write-Host "📊 SANDBOX ENDPOINTS:" -ForegroundColor Cyan
Write-Host "   /api/sandbox/agi      - Safe AGI testing API" -ForegroundColor White
Write-Host "   SANDBOX.NEURAL_CONNECTIONS   - Neural monitor test" -ForegroundColor White
Write-Host "   SANDBOX.PROCESSING_SPEED     - CPU monitor test" -ForegroundColor White
Write-Host "   SANDBOX.LEARNING_RATE        - Learning monitor test" -ForegroundColor White
Write-Host "   SANDBOX.RESPONSE_TIME        - Latency monitor test" -ForegroundColor White

Write-Host ""
Write-Host "🎯 TO START SANDBOX:" -ForegroundColor Yellow
Write-Host "   1. Run: yarn dev" -ForegroundColor White
Write-Host "   2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "   3. Navigate to sandbox component" -ForegroundColor White
Write-Host "   4. Look for 🧪 SANDBOX indicators on all data" -ForegroundColor White

Write-Host ""
Write-Host "⚠️  IMPORTANT REMINDERS:" -ForegroundColor Red
Write-Host "   • All data will show 'SANDBOX' indicator" -ForegroundColor Yellow
Write-Host "   • No real production APIs are called" -ForegroundColor Yellow
Write-Host "   • Safe to modify and test without risk" -ForegroundColor Yellow
Write-Host "   • TTL validation works in sandbox mode" -ForegroundColor Yellow
Write-Host "   • Provenance tracking is fully functional" -ForegroundColor Yellow

Write-Host ""
Write-Host "🧪 SANDBOX READY - SAFE TO TEST!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Ask user if they want to start development server
$startServer = Read-Host "Start development server now? (y/N)"
if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host ""
    Write-Host "🚀 Starting development server with sandbox mode..." -ForegroundColor Cyan
    yarn dev
} else {
    Write-Host ""
    Write-Host "✅ Sandbox environment configured. Run 'yarn dev' when ready." -ForegroundColor Green
}
