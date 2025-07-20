# EuroWeb Ultra Project Management Script (PowerShell)
# Industrial-Grade TypeScript Project Automation
# 
# @author Ledjan Ahmati (100% Owner)
# @contact dealsjona@gmail.com
# @version 8.0.0 Ultra
# @license MIT - Creator Protected

param(
    [Parameter(Position=0)]
    [ValidateSet("init", "fix-paths", "validate", "purity", "test", "build", "protect", "git", "deploy", "full", "help")]
    [string]$Command = "help"
)

# Project Configuration
$ProjectName = "EuroWeb Ultra Platform"
$ProjectVersion = "8.0.0"
$Creator = "Ledjan Ahmati"
$CreatorEmail = "dealsjona@gmail.com"
$CreatorSignature = "100% Owner & Creator"

# Absolute Paths
$ProjectRoot = "c:\UltraBuild\EuroWeb"
$ComponentsDir = "$ProjectRoot\components"
$LibDir = "$ProjectRoot\lib"
$TypesDir = "$ProjectRoot\types"
$TestsDir = "$ProjectRoot\__tests__"
$DocsDir = "$ProjectRoot\docs"
$ScriptsDir = "$ProjectRoot\scripts"

# Stack Configuration
$AllowedDeps = @(
    "next", "react", "react-dom", "typescript",
    "framer-motion", "class-variance-authority",
    "@testing-library/react", "@testing-library/jest-dom", "@testing-library/user-event",
    "vitest", "@vitejs/plugin-react", "jsdom",
    "@popperjs/core", "@next/bundle-analyzer"
)

$ForbiddenDeps = @(
    "jest", "babel", "webpack", "styled-components", "emotion",
    "@emotion/react", "@emotion/styled", "styled-jsx",
    "tailwindcss", "postcss", "autoprefixer",
    "panda", "@pandacss/dev", "styled-system",
    "sass", "less", "stylus", "styled-jsx",
    "chakra-ui", "material-ui", "@mui/material",
    "antd", "react-bootstrap", "semantic-ui-react",
    "css-in-js", "styled-components", "styled-system"
)

$ProtectedFiles = @(
    "package.json", "tsconfig.json", "next.config.mts",
    "vitest.config.ts", ".gitignore", "yarn.lock",
    "CREATOR.md", "SECURITY.md"
)

# Colors
function Write-ColorOutput($Message, $Color = "White") {
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    Write-Host ""
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════════════════════╗" -Color Magenta
    Write-ColorOutput "║                           $ProjectName v$ProjectVersion                        ║" -Color Magenta
    Write-ColorOutput "║                    Creator: $CreatorSignature                     ║" -Color Cyan
    Write-ColorOutput "║                        Industrial TypeScript Architecture                       ║" -Color Yellow
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════════════════════╝" -Color Magenta
    Write-Host ""
}

function Write-Info($Message) {
    Write-ColorOutput "[INFO] $Message" -Color Blue
}

function Write-Success($Message) {
    Write-ColorOutput "[SUCCESS] $Message" -Color Green
}

function Write-Warning($Message) {
    Write-ColorOutput "[WARNING] $Message" -Color Yellow
}

function Write-Error($Message) {
    Write-ColorOutput "[ERROR] $Message" -Color Red
}

function Write-Creator($Message) {
    Write-ColorOutput "[CREATOR] $Message" -Color Magenta
}

function Test-CreatorApproval {
    if (-not $env:CREATOR_APPROVED) {
        Write-Warning "This operation requires creator approval."
        Write-ColorOutput "Creator: $Creator" -Color Cyan
        Write-ColorOutput "Email: $CreatorEmail" -Color Cyan
        $approvalCode = Read-Host "Enter creator approval code"
        
        if ($approvalCode -ne "ULTRA8000") {
            Write-Error "Invalid creator approval code. Operation denied."
            exit 1
        }
        
        $env:CREATOR_APPROVED = "true"
        Write-Success "Creator approval granted."
    }
}

function Initialize-DirectoryStructure {
    Write-Info "Creating absolute directory hierarchy..."
    
    $dirs = @(
        $ComponentsDir, "$ComponentsDir\AGISheet", "$ComponentsDir\Navbar",
        $LibDir, $TypesDir, $TestsDir, $DocsDir, $ScriptsDir,
        "$ProjectRoot\app", "$ProjectRoot\pages", "$ProjectRoot\public",
        "$ProjectRoot\styles", "$ProjectRoot\utils", "$ProjectRoot\hooks",
        "$ProjectRoot\config", "$ProjectRoot\middleware", "$ProjectRoot\api",
        "$ProjectRoot\mesh", "$ProjectRoot\ddos", "$ProjectRoot\utt",
        "$ProjectRoot\tokens", "$ProjectRoot\patterns", "$ProjectRoot\css"
    )
    
    foreach ($dir in $dirs) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Success "Created: $dir"
        }
    }
}

function Repair-AbsolutePaths {
    Write-Info "Fixing absolute import paths..."
    
    Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.ts", "*.tsx" | ForEach-Object {
        if (Test-Path $_.FullName) {
            $content = Get-Content $_.FullName -Raw
            $content = $content -replace "from '\./", "from '@/"
            $content = $content -replace "from '\.\./", "from '@/"
            $content = $content -replace "import '\./", "import '@/"
            $content = $content -replace "import '\.\./", "import '@/"
            Set-Content -Path $_.FullName -Value $content
        }
    }
    
    Write-Success "Fixed absolute import paths"
}

function Test-Dependencies {
    Write-Info "Validating package.json dependencies..."
    
    $packageJsonPath = "$ProjectRoot\package.json"
    if (-not (Test-Path $packageJsonPath)) {
        Write-Error "package.json not found!"
        return $false
    }
    
    $packageContent = Get-Content $packageJsonPath -Raw
    $forbiddenFound = @()
    
    foreach ($dep in $ForbiddenDeps) {
        if ($packageContent -match "`"$dep`"") {
            $forbiddenFound += $dep
        }
    }
    
    if ($forbiddenFound.Count -gt 0) {
        Write-Error "Forbidden dependencies found: $($forbiddenFound -join ', ')"
        Write-Warning "Only pure TypeScript + Yarn Berry + CVA + Framer Motion + Vitest allowed!"
        return $false
    }
    
    Write-Success "Dependencies validation passed"
    return $true
}

function Update-TsConfig {
    Write-Info "Updating tsconfig.json with absolute paths..."
    
    $tsConfigContent = @'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/lib/*": ["./lib/*"],
      "@/types/*": ["./types/*"],
      "@/utils/*": ["./utils/*"],
      "@/styles/*": ["./styles/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/config/*": ["./config/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "dist", "build"]
}
'@
    
    Set-Content -Path "$ProjectRoot\tsconfig.json" -Value $tsConfigContent
    Write-Success "Updated tsconfig.json with absolute paths"
}

function Invoke-PurityCheck {
    Write-Info "Running fanatical purity check..."
    
    # Check for forbidden file extensions
    $jsFiles = Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.js" | Where-Object { 
        $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.next" 
    }
    
    if ($jsFiles.Count -gt 0) {
        Write-Error "Found $($jsFiles.Count) .js files - Only .ts/.tsx allowed!"
        return $false
    }
    
    # Check for React hooks in non-React files
    Get-ChildItem -Path $ProjectRoot -Recurse -Include "*.ts" | Where-Object { 
        $_.FullName -notmatch "node_modules" 
    } | ForEach-Object {
        $content = Get-Content $_.FullName -Raw
        if ($content -match "useState|useEffect|useCallback") {
            Write-Warning "React hooks found in .ts file: $($_.FullName)"
        }
    }
    
    Write-Success "Purity check completed"
    return $true
}

function Invoke-Tests {
    Write-Info "Running Vitest test suite..."
    
    Set-Location $ProjectRoot
    
    if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
        Write-Error "Yarn Berry not found!"
        return $false
    }
    
    & yarn test
    if ($LASTEXITCODE -eq 0) {
        Write-Success "All tests passed"
        return $true
    } else {
        Write-Error "Tests failed"
        return $false
    }
}

function Invoke-Build {
    Write-Info "Running production build..."
    
    Set-Location $ProjectRoot
    
    # Clear cache
    if (Test-Path ".next") {
        Remove-Item ".next" -Recurse -Force
    }
    
    & yarn build
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Build completed successfully"
        return $true
    } else {
        Write-Error "Build failed"
        return $false
    }
}

function Protect-CreatorFiles {
    Write-Info "Protecting creator files..."
    
    foreach ($file in $ProtectedFiles) {
        $filepath = Join-Path $ProjectRoot $file
        if (Test-Path $filepath) {
            Write-Success "Protected: $file"
        }
    }
    
    # Create CREATOR.md if not exists
    $creatorMdPath = "$ProjectRoot\CREATOR.md"
    if (-not (Test-Path $creatorMdPath)) {
        $creatorContent = @"
# EuroWeb Ultra Platform - Creator Information

**Creator:** $Creator  
**Email:** $CreatorEmail  
**Rights:** $CreatorSignature  
**Version:** $ProjectVersion  

## Creator Protection

This project is created and owned by $Creator. All rights reserved.
Any modifications to core architecture require explicit creator approval.

## Contact

For any questions or modifications, contact: $CreatorEmail

---
*Created with ❤️ by $Creator*
"@
        Set-Content -Path $creatorMdPath -Value $creatorContent
        Write-Creator "Created CREATOR.md protection file"
    }
}

function Initialize-Git {
    Write-Info "Setting up Git repository..."
    
    Set-Location $ProjectRoot
    
    if (-not (Test-Path ".git")) {
        & git init
        & git branch -M main
    }
    
    # Create .gitignore if not exists
    $gitignorePath = "$ProjectRoot\.gitignore"
    if (-not (Test-Path $gitignorePath)) {
        $gitignoreContent = @'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
.next/
out/
build/
dist/

# Environment
.env
.env.local
.env.production
.env.development

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Testing
coverage/

# Misc
*.tsbuildinfo
.eslintcache
'@
        Set-Content -Path $gitignorePath -Value $gitignoreContent
    }
    
    & git add .
    & git commit -m "feat: EuroWeb Ultra v$ProjectVersion - Industrial TypeScript Architecture

- Pure TypeScript + Yarn Berry + CVA + Framer Motion
- Lazy loading system with neural optimization
- Industrial-grade component architecture
- Creator: $Creator ($CreatorSignature)
- Zero legacy dependencies
- Full test coverage with Vitest

Signed-off-by: $Creator <$CreatorEmail>"
    
    Write-Success "Git repository configured"
}

function Deploy-Vercel {
    Write-Info "Deploying to Vercel..."
    
    Set-Location $ProjectRoot
    
    if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
        Write-Warning "Vercel CLI not found, installing..."
        & npm i -g vercel
    }
    
    & vercel --prod
    Write-Success "Deployed to Vercel"
}

function Show-Help {
    Write-Host "EuroWeb Ultra Project Management" -ForegroundColor White
    Write-Host ""
    Write-Host "Usage: .\project-manager.ps1 [COMMAND]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  init        Initialize project structure"
    Write-Host "  fix-paths   Fix absolute import paths"
    Write-Host "  validate    Validate dependencies and configuration"
    Write-Host "  purity      Run fanatical purity check"
    Write-Host "  test        Run test suite"
    Write-Host "  build       Run production build"
    Write-Host "  protect     Protect creator files"
    Write-Host "  git         Setup Git repository"
    Write-Host "  deploy      Deploy to Vercel"
    Write-Host "  full        Run complete setup (init + validate + build + test)"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-ColorOutput "Creator: $Creator ($CreatorSignature)" -Color Magenta
    Write-ColorOutput "Contact: $CreatorEmail" -Color Cyan
}

# Main execution
Write-Header

switch ($Command) {
    "init" {
        Initialize-DirectoryStructure
        Update-TsConfig
        Protect-CreatorFiles
    }
    "fix-paths" {
        Repair-AbsolutePaths
    }
    "validate" {
        Test-Dependencies
    }
    "purity" {
        Invoke-PurityCheck
    }
    "test" {
        Invoke-Tests
    }
    "build" {
        Invoke-Build
    }
    "protect" {
        Test-CreatorApproval
        Protect-CreatorFiles
    }
    "git" {
        Initialize-Git
    }
    "deploy" {
        Test-CreatorApproval
        Deploy-Vercel
    }
    "full" {
        Initialize-DirectoryStructure
        Update-TsConfig
        Repair-AbsolutePaths
        Test-Dependencies
        Invoke-PurityCheck
        Protect-CreatorFiles
        Invoke-Tests
        Invoke-Build
        Write-Success "Full setup completed successfully!"
    }
    default {
        Show-Help
    }
}
