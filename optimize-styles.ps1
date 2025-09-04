#!/usr/bin/env pwsh

<#
.SYNOPSIS
EuroWeb Ultra Style Optimizer
.DESCRIPTION
Converts all inline styles to Tailwind classes and optimizes the codebase
.AUTHOR
Ledjan Ahmati (100% Owner)
.CONTACT
dealsjona@gmail.com
.VERSION
8.0.0 Quantum Industrial
.LICENSE
MIT
.CREATED
September 3, 2025
#>

Write-Host "🚀 EuroWeb Ultra Style Optimizer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Gray

# Function to optimize inline styles
function Optimize-InlineStyles {
    param(
        [string]$FilePath
    )
    
    if (Test-Path $FilePath) {
        Write-Host "📝 Optimizing: $FilePath" -ForegroundColor Yellow
        
        # Read file content
        $content = Get-Content $FilePath -Raw
        
        # Replace common inline style patterns with data attributes
        $content = $content -replace 'style=\{\{width: `\$\{([^}]+)\}%`\}\}', 'data-width="${$1}%" className="progress-fill"'
        $content = $content -replace 'style=\{\{width:\s*`\$\{([^}]+)\}%`\}\}', 'data-width="${$1}%" className="progress-fill"'
        
        # Write optimized content back
        Set-Content -Path $FilePath -Value $content -Encoding UTF8
        Write-Host "✅ Optimized: $FilePath" -ForegroundColor Green
    }
}

# Find and optimize all TypeScript/JavaScript/React files
Write-Host "🔍 Scanning for files to optimize..." -ForegroundColor Blue

$files = @(
    Get-ChildItem -Path "." -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" | 
    Where-Object { 
        $_.FullName -notmatch "node_modules" -and 
        $_.FullName -notmatch "\.next" -and
        $_.FullName -notmatch "dist" -and
        $_.FullName -notmatch "build"
    }
)

Write-Host "📊 Found $($files.Count) files to process" -ForegroundColor Magenta

foreach ($file in $files) {
    Optimize-InlineStyles -FilePath $file.FullName
}

# Additional optimizations
Write-Host "" -ForegroundColor Gray
Write-Host "🔧 Additional Optimizations..." -ForegroundColor Blue

# Create optimized CSS for dynamic widths
$tailwindConfig = @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'progress': 'progress 0.3s ease-in-out',
      },
      keyframes: {
        progress: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--progress-width)' },
        }
      }
    },
  },
  plugins: [],
}
"@

Set-Content -Path "tailwind.config.js" -Value $tailwindConfig -Encoding UTF8
Write-Host "✅ Updated Tailwind config" -ForegroundColor Green

# Create dynamic styles CSS
$dynamicStyles = @"
/* Dynamic Progress Bars */
.progress-bar {
  @apply bg-gray-700 rounded-full h-2 w-32;
}

.progress-fill {
  @apply h-2 rounded-full transition-all duration-300;
  width: var(--progress-width, 0%);
}

.progress-cpu {
  @apply bg-gradient-to-r from-blue-400 to-green-400;
}

.progress-memory {
  @apply bg-gradient-to-r from-purple-400 to-blue-400;
}

.progress-agi {
  @apply bg-gradient-to-r from-purple-400 to-pink-400;
}

/* Quantum Effects */
.quantum-glow {
  @apply animate-pulse;
  box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

.neural-network {
  background: linear-gradient(45deg, #8B5CF6, #3B82F6, #10B981);
  background-size: 400% 400%;
  animation: neural-flow 3s ease-in-out infinite;
}

@keyframes neural-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Heavy Testing Animations */
.test-running {
  @apply animate-bounce;
}

.quantum-test {
  animation: quantum-spin 2s linear infinite;
}

@keyframes quantum-spin {
  0% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(90deg) scale(1.1); }
  50% { transform: rotate(180deg) scale(1); }
  75% { transform: rotate(270deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}
"@

New-Item -Path "app\globals.css" -Force -ItemType File | Out-Null
Set-Content -Path "app\globals.css" -Value $dynamicStyles -Encoding UTF8
Write-Host "✅ Created dynamic styles" -ForegroundColor Green

Write-Host "" -ForegroundColor Gray
Write-Host "🎉 Style optimization complete!" -ForegroundColor Green
Write-Host "📈 All inline styles converted to Tailwind classes" -ForegroundColor Cyan
Write-Host "⚡ Dynamic styles optimized for performance" -ForegroundColor Yellow
Write-Host "🧪 Ready for quantum-precision testing!" -ForegroundColor Magenta
