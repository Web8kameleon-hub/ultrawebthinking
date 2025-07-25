#!/usr/bin/env powershell

<#
.SYNOPSIS
EuroWeb Platform - Automated Backup & Disaster Recovery System

.DESCRIPTION
Industrial-grade backup and disaster recovery automation for production environments.
Handles database backups, file system snapshots, and automated restoration procedures.

.PARAMETER BackupType
Type of backup: full, incremental, or differential

.PARAMETER RestorePoint
Specific backup to restore from (format: YYYYMMDD-HHMMSS)

.PARAMETER Environment
Target environment: production, staging, or development

.EXAMPLE
.\backup-system.ps1 -BackupType full
.\backup-system.ps1 -RestorePoint 20250725-120000 -Environment staging

.NOTES
Creator: Ledjan Ahmati
Version: 8.0.0
Contact: dealsjona@gmail.com
#>

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("full", "incremental", "differential", "restore")]
    [string]$BackupType = "incremental",
    
    [Parameter(Mandatory=$false)]
    [string]$RestorePoint,
    
    [Parameter(Mandatory=$false)]
    [ValidateSet("production", "staging", "development")]
    [string]$Environment = "production",
    
    [Parameter(Mandatory=$false)]
    [switch]$DryRun,
    
    [Parameter(Mandatory=$false)]
    [switch]$VerifyIntegrity
)

# Configuration
$Config = @{
    BackupBasePath = "C:\Backups\EuroWeb"
    DatabaseBackupPath = "C:\Backups\EuroWeb\Database"
    FilesBackupPath = "C:\Backups\EuroWeb\Files"
    LogsPath = "C:\Backups\EuroWeb\Logs"
    RetentionDays = 30
    CompressionLevel = 9
    EncryptionEnabled = $true
    
    # Cloud storage settings
    CloudProvider = "AWS"  # AWS, Azure, GCP
    S3BucketName = "euroweb-backups-prod"
    
    # Database connections
    PostgreSQLConnection = @{
        Host = "localhost"
        Port = 5432
        Database = "euroweb"
        Username = "euroweb"
        PasswordEnvVar = "POSTGRES_PASSWORD"
    }
    
    MongoConnection = @{
        Host = "localhost"
        Port = 27017
        Database = "euroweb"
        AuthDatabase = "admin"
        UsernameEnvVar = "MONGO_USERNAME"
        PasswordEnvVar = "MONGO_PASSWORD"
    }
    
    # Notification settings
    SlackWebhook = $env:SLACK_WEBHOOK_URL
    EmailRecipients = @("admin@euroweb.ai", "alerts@euroweb.ai")
}

# Logging functions
function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("INFO", "WARN", "ERROR", "SUCCESS")]
        [string]$Level = "INFO"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logEntry = "[$timestamp] [$Level] $Message"
    
    # Color coding for console
    switch ($Level) {
        "INFO" { Write-Host $logEntry -ForegroundColor Cyan }
        "WARN" { Write-Host $logEntry -ForegroundColor Yellow }
        "ERROR" { Write-Host $logEntry -ForegroundColor Red }
        "SUCCESS" { Write-Host $logEntry -ForegroundColor Green }
    }
    
    # Write to log file
    $logFile = Join-Path $Config.LogsPath "backup-$(Get-Date -Format 'yyyyMMdd').log"
    Add-Content -Path $logFile -Value $logEntry -Encoding UTF8
}

function Initialize-BackupSystem {
    Write-Log "Initializing EuroWeb Backup System v8.0.0" "INFO"
    
    # Create backup directories
    $directories = @(
        $Config.BackupBasePath,
        $Config.DatabaseBackupPath,
        $Config.FilesBackupPath,
        $Config.LogsPath
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -Path $dir -ItemType Directory -Force | Out-Null
            Write-Log "Created directory: $dir" "INFO"
        }
    }
    
    # Verify required tools
    $requiredTools = @("pg_dump", "mongodump", "7z")
    foreach ($tool in $requiredTools) {
        if (-not (Get-Command $tool -ErrorAction SilentlyContinue)) {
            Write-Log "Required tool not found: $tool" "ERROR"
            throw "Missing required backup tool: $tool"
        }
    }
    
    Write-Log "Backup system initialized successfully" "SUCCESS"
}

function Invoke-PostgreSQLBackup {
    param(
        [string]$BackupPath,
        [string]$BackupType
    )
    
    Write-Log "Starting PostgreSQL backup ($BackupType)" "INFO"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = Join-Path $BackupPath "postgres-$Environment-$BackupType-$timestamp.sql"
    
    $pgPassword = [Environment]::GetEnvironmentVariable($Config.PostgreSQLConnection.PasswordEnvVar)
    if (-not $pgPassword) {
        throw "PostgreSQL password not found in environment variables"
    }
    
    $env:PGPASSWORD = $pgPassword
    
    try {
        $pgDumpArgs = @(
            "-h", $Config.PostgreSQLConnection.Host
            "-p", $Config.PostgreSQLConnection.Port
            "-U", $Config.PostgreSQLConnection.Username
            "-d", $Config.PostgreSQLConnection.Database
            "--verbose"
            "--no-password"
        )
        
        if ($BackupType -eq "full") {
            $pgDumpArgs += "--clean", "--if-exists", "--create"
        }
        
        if ($DryRun) {
            Write-Log "DRY RUN: Would execute pg_dump with args: $($pgDumpArgs -join ' ')" "INFO"
            return $backupFile
        }
        
        & pg_dump @pgDumpArgs | Out-File -FilePath $backupFile -Encoding UTF8
        
        if ($LASTEXITCODE -eq 0) {
            $fileSize = (Get-Item $backupFile).Length / 1MB
            Write-Log "PostgreSQL backup completed: $backupFile ($([math]::Round($fileSize, 2)) MB)" "SUCCESS"
            
            # Compress backup
            $compressedFile = "$backupFile.7z"
            & 7z a -t7z -mx=$($Config.CompressionLevel) $compressedFile $backupFile
            Remove-Item $backupFile -Force
            
            return $compressedFile
        } else {
            throw "pg_dump failed with exit code: $LASTEXITCODE"
        }
    } finally {
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}

function Invoke-MongoDBBackup {
    param(
        [string]$BackupPath,
        [string]$BackupType
    )
    
    Write-Log "Starting MongoDB backup ($BackupType)" "INFO"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = Join-Path $BackupPath "mongo-$Environment-$BackupType-$timestamp"
    
    $mongoUsername = [Environment]::GetEnvironmentVariable($Config.MongoConnection.UsernameEnvVar)
    $mongoPassword = [Environment]::GetEnvironmentVariable($Config.MongoConnection.PasswordEnvVar)
    
    if (-not $mongoUsername -or -not $mongoPassword) {
        throw "MongoDB credentials not found in environment variables"
    }
    
    $mongoDumpArgs = @(
        "--host", "$($Config.MongoConnection.Host):$($Config.MongoConnection.Port)"
        "--db", $Config.MongoConnection.Database
        "--username", $mongoUsername
        "--password", $mongoPassword
        "--authenticationDatabase", $Config.MongoConnection.AuthDatabase
        "--out", $backupDir
    )
    
    if ($DryRun) {
        Write-Log "DRY RUN: Would execute mongodump with args: $($mongoDumpArgs -join ' ')" "INFO"
        return $backupDir
    }
    
    & mongodump @mongoDumpArgs
    
    if ($LASTEXITCODE -eq 0) {
        Write-Log "MongoDB backup completed: $backupDir" "SUCCESS"
        
        # Compress backup
        $compressedFile = "$backupDir.7z"
        & 7z a -t7z -mx=$($Config.CompressionLevel) $compressedFile $backupDir
        Remove-Item $backupDir -Recurse -Force
        
        return $compressedFile
    } else {
        throw "mongodump failed with exit code: $LASTEXITCODE"
    }
}

function Invoke-FilesBackup {
    param(
        [string]$BackupPath,
        [string]$BackupType
    )
    
    Write-Log "Starting files backup ($BackupType)" "INFO"
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = Join-Path $BackupPath "files-$Environment-$BackupType-$timestamp.7z"
    
    # Define source directories
    $sourcePaths = @(
        "C:\Users\pc\UltraBuild\ultrawebthinking\public"
        "C:\Users\pc\UltraBuild\ultrawebthinking\uploads"
        "C:\Users\pc\UltraBuild\ultrawebthinking\logs"
        "C:\Users\pc\UltraBuild\ultrawebthinking\.env*"
    )
    
    $validPaths = $sourcePaths | Where-Object { Test-Path $_ }
    
    if ($validPaths.Count -eq 0) {
        Write-Log "No source paths found for files backup" "WARN"
        return $null
    }
    
    if ($DryRun) {
        Write-Log "DRY RUN: Would backup paths: $($validPaths -join ', ')" "INFO"
        return $backupFile
    }
    
    $sevenZipArgs = @("a", "-t7z", "-mx=$($Config.CompressionLevel)", $backupFile) + $validPaths
    & 7z @sevenZipArgs
    
    if ($LASTEXITCODE -eq 0) {
        $fileSize = (Get-Item $backupFile).Length / 1MB
        Write-Log "Files backup completed: $backupFile ($([math]::Round($fileSize, 2)) MB)" "SUCCESS"
        return $backupFile
    } else {
        throw "7z failed with exit code: $LASTEXITCODE"
    }
}

function Invoke-CloudUpload {
    param(
        [string[]]$BackupFiles
    )
    
    if (-not $BackupFiles -or $BackupFiles.Count -eq 0) {
        Write-Log "No backup files to upload to cloud" "WARN"
        return
    }
    
    Write-Log "Uploading backups to cloud storage" "INFO"
    
    foreach ($file in $BackupFiles) {
        if (-not (Test-Path $file)) {
            Write-Log "Backup file not found: $file" "WARN"
            continue
        }
        
        $fileName = Split-Path $file -Leaf
        $s3Key = "$Environment/$(Get-Date -Format 'yyyy/MM/dd')/$fileName"
        
        if ($DryRun) {
            Write-Log "DRY RUN: Would upload $file to s3://$($Config.S3BucketName)/$s3Key" "INFO"
            continue
        }
        
        try {
            # Using AWS CLI (ensure it's installed and configured)
            & aws s3 cp $file "s3://$($Config.S3BucketName)/$s3Key" --storage-class STANDARD_IA
            
            if ($LASTEXITCODE -eq 0) {
                Write-Log "Successfully uploaded to cloud: $fileName" "SUCCESS"
            } else {
                Write-Log "Failed to upload to cloud: $fileName" "ERROR"
            }
        } catch {
            Write-Log "Cloud upload error: $($_.Exception.Message)" "ERROR"
        }
    }
}

function Remove-OldBackups {
    Write-Log "Cleaning up old backups (retention: $($Config.RetentionDays) days)" "INFO"
    
    $cutoffDate = (Get-Date).AddDays(-$Config.RetentionDays)
    
    $backupDirs = @($Config.DatabaseBackupPath, $Config.FilesBackupPath)
    
    foreach ($dir in $backupDirs) {
        $oldFiles = Get-ChildItem -Path $dir -File | Where-Object { $_.LastWriteTime -lt $cutoffDate }
        
        foreach ($file in $oldFiles) {
            if ($DryRun) {
                Write-Log "DRY RUN: Would delete old backup: $($file.FullName)" "INFO"
            } else {
                Remove-Item $file.FullName -Force
                Write-Log "Deleted old backup: $($file.Name)" "INFO"
            }
        }
    }
}

function Test-BackupIntegrity {
    param(
        [string[]]$BackupFiles
    )
    
    Write-Log "Verifying backup integrity" "INFO"
    
    foreach ($file in $BackupFiles) {
        if (-not (Test-Path $file)) {
            Write-Log "Backup file not found for verification: $file" "WARN"
            continue
        }
        
        try {
            if ($file.EndsWith(".7z")) {
                & 7z t $file | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    Write-Log "Backup integrity verified: $(Split-Path $file -Leaf)" "SUCCESS"
                } else {
                    Write-Log "Backup integrity check failed: $(Split-Path $file -Leaf)" "ERROR"
                }
            }
        } catch {
            Write-Log "Backup verification error: $($_.Exception.Message)" "ERROR"
        }
    }
}

function Send-BackupNotification {
    param(
        [string]$Status,
        [string[]]$BackupFiles,
        [string]$ErrorMessage = ""
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $hostname = $env:COMPUTERNAME
    
    $message = @{
        text = "🔄 EuroWeb Backup Report"
        attachments = @(
            @{
                color = if ($Status -eq "SUCCESS") { "good" } else { "danger" }
                fields = @(
                    @{
                        title = "Status"
                        value = $Status
                        short = $true
                    }
                    @{
                        title = "Environment"
                        value = $Environment
                        short = $true
                    }
                    @{
                        title = "Backup Type"
                        value = $BackupType
                        short = $true
                    }
                    @{
                        title = "Timestamp"
                        value = $timestamp
                        short = $true
                    }
                    @{
                        title = "Host"
                        value = $hostname
                        short = $true
                    }
                    @{
                        title = "Files Created"
                        value = ($BackupFiles | ForEach-Object { Split-Path $_ -Leaf }) -join "`n"
                        short = $false
                    }
                )
            }
        )
    }
    
    if ($ErrorMessage) {
        $message.attachments[0].fields += @{
            title = "Error Details"
            value = $ErrorMessage
            short = $false
        }
    }
    
    if ($Config.SlackWebhook -and -not $DryRun) {
        try {
            $json = $message | ConvertTo-Json -Depth 5
            Invoke-RestMethod -Uri $Config.SlackWebhook -Method Post -Body $json -ContentType "application/json"
            Write-Log "Slack notification sent" "INFO"
        } catch {
            Write-Log "Failed to send Slack notification: $($_.Exception.Message)" "WARN"
        }
    }
}

# Main execution
function Main {
    try {
        Initialize-BackupSystem
        
        $backupFiles = @()
        
        if ($BackupType -ne "restore") {
            # Perform backups
            $backupFiles += Invoke-PostgreSQLBackup -BackupPath $Config.DatabaseBackupPath -BackupType $BackupType
            $backupFiles += Invoke-MongoDBBackup -BackupPath $Config.DatabaseBackupPath -BackupType $BackupType
            $backupFiles += Invoke-FilesBackup -BackupPath $Config.FilesBackupPath -BackupType $BackupType
            
            # Filter out null values
            $backupFiles = $backupFiles | Where-Object { $_ -ne $null }
            
            if ($VerifyIntegrity) {
                Test-BackupIntegrity -BackupFiles $backupFiles
            }
            
            # Upload to cloud
            Invoke-CloudUpload -BackupFiles $backupFiles
            
            # Cleanup old backups
            Remove-OldBackups
            
            # Send notification
            Send-BackupNotification -Status "SUCCESS" -BackupFiles $backupFiles
            
            Write-Log "Backup process completed successfully" "SUCCESS"
        } else {
            # Restore operation
            if (-not $RestorePoint) {
                throw "RestorePoint parameter is required for restore operation"
            }
            
            Write-Log "Restore functionality not implemented in this version" "WARN"
            # TODO: Implement restore functionality
        }
        
    } catch {
        Write-Log "Backup process failed: $($_.Exception.Message)" "ERROR"
        Send-BackupNotification -Status "FAILED" -BackupFiles @() -ErrorMessage $_.Exception.Message
        exit 1
    }
}

# Execute main function
Main
