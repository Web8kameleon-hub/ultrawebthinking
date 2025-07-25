# Guardian.ps1 - Quantum Cyber Defense (Ultra Edition)
# EuroWeb Ultra • Security Layer 5+
# Author: Ledjan Ahmati • Status: Industrial • Version: 8.0

# -- Settings --
$LogPath = "$PSScriptRoot\guardian-logs"
$BlockListPath = "$LogPath\blocked-ips.txt"
$AlertFile = "$LogPath\alerts.log"

# -- Ensure Directories --
if (!(Test-Path $LogPath)) { New-Item -Path $LogPath -ItemType Directory | Out-Null }

# -- Define Suspicious Signatures --
$SuspiciousAgents = @(
    "python-requests", "nmap", "curl", "sqlmap", "wget", "masscan", "nikto"
)
$MaxRequestsPerMin = 60
$PayloadSizeThreshold = 500000 # bytes

# -- Simulated Logs (replace with real parser or input) --
$SimulatedLogs = @(
    @{ ip="192.168.1.100"; agent="Mozilla/5.0"; path="/api/test"; rate=105; size=10000 },
    @{ ip="10.0.0.15"; agent="Mozilla/5.0"; path="/data"; rate=23; size=600000 },
    @{ ip="203.0.113.45"; agent="python-requests/2.28.1"; path="/admin"; rate=5; size=1000 }
)

# -- Process Logs --
foreach ($entry in $SimulatedLogs) {
    $ip = $entry.ip
    $ua = $entry.agent
    $path = $entry.path
    $rate = $entry.rate
    $size = $entry.size
    $threat = $false
    $reason = ""

    # Detection logic
    if ($rate -gt $MaxRequestsPerMin) {
        $threat = $true
        $reason = "High request rate ($rate req/min)"
    }
    elseif ($size -gt $PayloadSizeThreshold) {
        $threat = $true
        $reason = "Large payload detected ($size bytes)"
    }
    elseif ($SuspiciousAgents | Where-Object { $ua -like "*$_*" }) {
        $threat = $true
        $reason = "Suspicious user-agent: $ua"
    }

    if ($threat) {
        # Log Alert
        $timestamp = Get-Date -Format "u"
        Add-Content $AlertFile "$timestamp | BLOCKED $ip | $reason | UA: $ua | Path: $path"

        # Block IP if not already blocked
        if (!(Get-NetFirewallRule -PolicyStore PersistentStore | Where-Object { $_.DisplayName -eq "Block_$ip" })) {
            New-NetFirewallRule -DisplayName "Block_$ip" -Direction Inbound -Action Block -RemoteAddress $ip -Profile Any | Out-Null
            Add-Content $BlockListPath $ip
            Write-Host "🛡️ IP blocked: $ip ($reason)" -ForegroundColor Red
        }
    }
    else {
        Write-Host "✅ IP allowed: $ip" -ForegroundColor Green
    }
}

# Summary
Write-Host "`n📊 UltraGuardian finished scanning. Log: $AlertFile"
