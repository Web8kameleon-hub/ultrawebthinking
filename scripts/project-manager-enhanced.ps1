# EuroWeb Ultra Project Management Script (PowerShell)
# Industrial-Grade TypeScript Project Automation
# 
# @author Ledjan Ahmati (100% Owner)
# @contact dealsjona@gmail.com
# @version 8.1.0 Ultra+
# @license MIT - Creator Protected

param(
    [Parameter(Position=0)]
    [ValidateSet("init", "fix-paths", "validate", "purity", "css-check", "test", "build", "protect", "git", "deploy", "full", "help")]
    [string]$Command = "help",

    [switch]$Force,
    [switch]$VerboseOutputOutput
)

# Enhanced Project Configuration
$ProjectConfig = @{
    ProjectName = "EuroWeb Ultra Platform"
    ProjectVersion = "8.1.0"
    Creator = "Ledjan Ahmati"
    CreatorEmail = "dealsjona@gmail.com"
    CreatorSignature = "100% Owner & Creator"
    ApprovalCode = "ULTRA8000"
    ProjectRoot = "c:\UltraBuild\EuroWeb"
}

# Enhanced Directory Structure
$DirectoryStructure = @{
    Components = "$($ProjectConfig.ProjectRoot)\components"
    Lib = "$($ProjectConfig.ProjectRoot)\lib"
    Types = "$($ProjectConfig.ProjectRoot)\types"
    Tests = "$($ProjectConfig.ProjectRoot)\__tests__"
    Docs = "$($ProjectConfig.ProjectRoot)\docs"
    Scripts = "$($ProjectConfig.ProjectRoot)\scripts"
    App = "$($ProjectConfig.ProjectRoot)\app"
    Pages = "$($ProjectConfig.ProjectRoot)\pages"
    Public = "$($ProjectConfig.ProjectRoot)\public"
    Styles = "$($ProjectConfig.ProjectRoot)\styles"
    Utils = "$($ProjectConfig.ProjectRoot)\utils"
    Hooks = "$($ProjectConfig.ProjectRoot)\hooks"
    Config = "$($ProjectConfig.ProjectRoot)\config"
    Middleware = "$($ProjectConfig.ProjectRoot)\middleware"
    API = "$($ProjectConfig.ProjectRoot)\api"
    Mesh = "$($ProjectConfig.ProjectRoot)\mesh"
    DDoS = "$($ProjectConfig.ProjectRoot)\ddos"
    UTT = "$($ProjectConfig.ProjectRoot)\utt"
    Tokens = "$($ProjectConfig.ProjectRoot)\tokens"
    Patterns = "$($ProjectConfig.ProjectRoot)\patterns"
    CSS = "$($ProjectConfig.ProjectRoot)\css"
}

# Enhanced Stack Configuration
$StackConfig = @{
    AllowedDeps = @(
        "next", "react", "react-dom", "typescript",
        "framer-motion", "class-variance-authority", "clsx",
        "@testing-library/react", "@testing-library/jest-dom", "@testing-library/user-event",
        "vitest", "@vitejs/plugin-react", "jsdom",
        "@next/bundle-analyzer"
    )
    ForbiddenDeps = @(
        "jest", "babel", "webpack", "styled-components", "emotion",
        "@emotion/react", "@emotion/styled", "styled-jsx",
        "tailwindcss", "postcss", "autoprefixer",
        "panda", "@pandacss/dev",
        "sass", "less", "stylus", 
        "chakra-ui", "material-ui", "@mui/material",
        "antd", "react-bootstrap", "semantic-ui-react",
        "css-in-js", "@stitches/react", "goober"
    )
    ProtectedFiles = @(
        "package.json", "tsconfig.json", "next.config.mts",
        "vitest.config.ts", ".gitignore", "yarn.lock",
        "CREATOR.md", "SECURITY.md"
    )
}

# Enhanced Color Output Functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White",
        [switch]$NoNewLine
    )
    
    if ($NoNewLine) {
        Write-Host $Message -ForegroundColor $Color -NoNewline
    } else {
        Write-Host $Message -ForegroundColor $Color
    }
}

function Write-Header {
    Write-Host ""
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════════════════════╗" -Color Magenta
    Write-ColorOutput "║                     $($ProjectConfig.ProjectName) v$($ProjectConfig.ProjectVersion)                    ║" -Color Magenta
    Write-ColorOutput "║                    Creator: $($ProjectConfig.CreatorSignature)                     ║" -Color Cyan
    Write-ColorOutput "║                    Industrial TypeScript Architecture                      ║" -Color Yellow
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════════════════════╝" -Color Magenta
    Write-Host ""
}

function Write-Log {
    param(
        [string]$Message,
        [string]$Level = "INFO",
        [string]$Color = "White"
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logMessage = "[$timestamp] [$Level] $Message"
    
    switch ($Level) {
        "INFO" { $Color = "Blue" }
        "SUCCESS" { $Color = "Green" }
        "WARNING" { $Color = "Yellow" }
        "ERROR" { $Color = "Red" }
        "CREATOR" { $Color = "Magenta" }
    }
    
    Write-ColorOutput $logMessage -Color $Color
}

function Test-ProjectRoot {
    if (-not (Test-Path $ProjectConfig.ProjectRoot)) {
        Write-Log "Project root directory not found: $($ProjectConfig.ProjectRoot)" -Level ERROR
        return $false
    }
    return $true
}

function Test-CreatorApproval {
    if (-not $Force -and -not $env:CREATOR_APPROVED) {
        Write-Log "This operation requires creator approval." -Level WARNING
        Write-ColorOutput "Creator: $($ProjectConfig.Creator)" -Color Cyan
        Write-ColorOutput "Email: $($ProjectConfig.CreatorEmail)" -Color Cyan
        $approvalCode = Read-Host "Enter creator approval code"
        
        if ($approvalCode -ne $ProjectConfig.ApprovalCode) {
            Write-Log "Invalid creator approval code. Operation denied." -Level ERROR
            exit 1
        }
        
        $env:CREATOR_APPROVED = "true"
        Write-Log "Creator approval granted." -Level SUCCESS
    }
}

function Initialize-DirectoryStructure {
    Write-Log "Creating enhanced directory hierarchy..." -Level INFO
    
    try {
        foreach ($dir in $DirectoryStructure.Values) {
            if (-not (Test-Path $dir)) {
                New-Item -ItemType Directory -Path $dir -Force | Out-Null
                Write-Log "Created directory: $dir" -Level SUCCESS
            } elseif ($VerboseOutput) {
                Write-Log "Directory already exists: $dir" -Level INFO
            }
        }
        
        # Create essential files if they don't exist
        $essentialFiles = @(
            "$($ProjectConfig.ProjectRoot)\README.md",
            "$($ProjectConfig.ProjectRoot)\tsconfig.json",
            "$($ProjectConfig.ProjectRoot)\package.json"
        )
        
        foreach ($file in $essentialFiles) {
            if (-not (Test-Path $file)) {
                New-Item -ItemType File -Path $file -Force | Out-Null
                Write-Log "Created essential file: $file" -Level SUCCESS
            }
        }
        
        return $true
    } catch {
        Write-Log "Failed to create directory structure: $_" -Level ERROR
        return $false
    }
}

function Repair-AbsolutePaths {
    Write-Log "Fixing absolute import paths..." -Level INFO
    
    try {
        $tsFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.ts", "*.tsx" -ErrorAction Stop
        
        $totalFiles = 0
        $modifiedFiles = 0
        
        foreach ($file in $tsFiles) {
            $totalFiles++
            $content = Get-Content $file.FullName -Raw -ErrorAction Stop
            
            $originalContent = $content
            $content = $content.Replace("from './", "from '@/")
            $content = $content.Replace("from '../", "from '@/")
            $content = $content.Replace("import './", "import '@/")
            $content = $content.Replace("import '../", "import '@/")
            
            if ($content -ne $originalContent) {
                Set-Content -Path $file.FullName -Value $content -ErrorAction Stop
                $modifiedFiles++
                if ($VerboseOutput) {
                    Write-Log "Modified import paths in: $($file.FullName)" -Level INFO
                }
            }
        }
        
        Write-Log "Fixed import paths in $modifiedFiles of $totalFiles TypeScript files" -Level SUCCESS
        return $true
    } catch {
        Write-Log "Failed to fix import paths: $_" -Level ERROR
        return $false
    }
}

function Test-Dependencies {
    Write-Log "Validating package.json dependencies..." -Level INFO
    
    try {
        $packageJsonPath = "$($ProjectConfig.ProjectRoot)\package.json"
        if (-not (Test-Path $packageJsonPath)) {
            Write-Log "package.json not found!" -Level ERROR
            return $false
        }
        
        $packageContent = Get-Content $packageJsonPath -Raw -ErrorAction Stop
        $forbiddenFound = @()
        
        foreach ($dep in $StackConfig.ForbiddenDeps) {
            if ($packageContent -match """$dep""") {
                $forbiddenFound += $dep
            }
        }
        
        if ($forbiddenFound.Count -gt 0) {
            Write-Log "Forbidden dependencies found: $($forbiddenFound -join ', ')" -Level ERROR
            Write-Log "Only pure TypeScript + Yarn Berry + CVA + Framer Motion + Vitest allowed!" -Level WARNING
            return $false
        }
        
        # Check for required dependencies
        $missingDeps = @()
        foreach ($dep in @("typescript", "next", "react", "react-dom")) {
            if (-not ($packageContent -match """$dep""")) {
                $missingDeps += $dep
            }
        }
        
        if ($missingDeps.Count -gt 0) {
            Write-Log "Missing required dependencies: $($missingDeps -join ', ')" -Level ERROR
            return $false
        }
        
        Write-Log "Dependencies validation passed" -Level SUCCESS
        return $true
    } catch {
        Write-Log "Failed to validate dependencies: $_" -Level ERROR
        return $false
    }
}

function Update-TsConfig {
    Write-Log "Updating tsconfig.json with enhanced configuration..." -Level INFO
    
    try {
        $tsConfigContent = @'
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
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
      "@/config/*": ["./config/*"],
      "@/tests/*": ["./__tests__/*"]
    },
    "typeRoots": ["./types", "./node_modules/@types"]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", ".next", "dist", "build"]
}
'@
        
        Set-Content -Path "$($ProjectConfig.ProjectRoot)\tsconfig.json" -Value $tsConfigContent -ErrorAction Stop
        Write-Log "Updated tsconfig.json with enhanced configuration" -Level SUCCESS
        return $true
    } catch {
        Write-Log "Failed to update tsconfig.json: $_" -Level ERROR
        return $false
    }
}

function Invoke-PurityCheck {
    Write-Log "Running enhanced purity check..." -Level INFO
    
    try {
        $issuesFound = 0
        
        # 1. Check for forbidden file extensions
        $jsFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.js" | 
            Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\.next" -and $_.Name -ne "sw.js" }
        
        if ($jsFiles.Count -gt 0) {
            $issuesFound += $jsFiles.Count
            Write-Log "Found $($jsFiles.Count) .js files - Only .ts/.tsx allowed!" -Level ERROR
            if ($VerboseOutput) {
                $jsFiles | ForEach-Object { Write-Log "JS file: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 2. Check for forbidden CSS approaches
        $scssFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.scss", "*.sass", "*.less" | 
            Where-Object { $_.FullName -notmatch "node_modules" }
        
        if ($scssFiles.Count -gt 0) {
            $issuesFound += $scssFiles.Count
            Write-Log "Found $($scssFiles.Count) SCSS/SASS/LESS files - Only CSS Modules allowed!" -Level ERROR
            if ($VerboseOutput) {
                $scssFiles | ForEach-Object { Write-Log "CSS preprocessor file: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 3. Check for CSS-in-JS usage
        $cssInJsFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.ts", "*.tsx" | 
            Where-Object { $_.FullName -notmatch "node_modules" } |
            Where-Object { (Get-Content $_.FullName -Raw) -match "styled|css``|styled-components|emotion" }
        
        if ($cssInJsFiles.Count -gt 0) {
            $issuesFound += $cssInJsFiles.Count
            Write-Log "Found $($cssInJsFiles.Count) files with CSS-in-JS - Only CSS Modules + CVA allowed!" -Level ERROR
            if ($VerboseOutput) {
                $cssInJsFiles | ForEach-Object { Write-Log "CSS-in-JS found in: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 4. Check for Panda CSS usage
        $pandaFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.ts", "*.tsx" | 
            Where-Object { $_.FullName -notmatch "node_modules" } |
            Where-Object { (Get-Content $_.FullName -Raw) -match "panda|@pandacss" }
        
        if ($pandaFiles.Count -gt 0) {
            $issuesFound += $pandaFiles.Count
            Write-Log "Found $($pandaFiles.Count) files with Panda CSS - Not allowed!" -Level ERROR
            if ($VerboseOutput) {
                $pandaFiles | ForEach-Object { Write-Log "Panda CSS found in: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 5. Check for React hooks in non-React files
        $hookFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.ts" | 
            Where-Object { $_.FullName -notmatch "node_modules" } |
            Where-Object { (Get-Content $_.FullName -Raw) -match "useState|useEffect|useCallback" }
        
        if ($hookFiles.Count -gt 0) {
            $issuesFound += $hookFiles.Count
            Write-Log "Found $($hookFiles.Count) .ts files with React hooks - Hooks should only be in .tsx files!" -Level WARNING
            if ($VerboseOutput) {
                $hookFiles | ForEach-Object { Write-Log "React hooks in .ts file: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 6. Check for default exports (except Next.js required)
        $defaultExportFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.tsx" | 
            Where-Object { $_.FullName -notmatch "node_modules" -and $_.FullName -notmatch "\\app\\" -and $_.FullName -notmatch "\\pages\\" } |
            Where-Object { (Get-Content $_.FullName -Raw) -match "export default" }
        
        if ($defaultExportFiles.Count -gt 0) {
            $issuesFound += $defaultExportFiles.Count
            Write-Log "Found $($defaultExportFiles.Count) files with default exports - Prefer named exports!" -Level WARNING
            if ($VerboseOutput) {
                $defaultExportFiles | ForEach-Object { Write-Log "Default export in: $($_.FullName)" -Level WARNING }
            }
        }
        
        # 7. Validate CVA usage
        $cvaComponents = (Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.tsx" | 
            Where-Object { $_.FullName -notmatch "node_modules" } |
            ForEach-Object {
                if ((Get-Content $_.FullName -Raw) -match "class-variance-authority|cva\(") { 1 }
            } | Measure-Object -Sum).Sum
        
        if ($null -eq $cvaComponents) { $cvaComponents = 0 }
        
        if ($cvaComponents -gt 0) {
            Write-Log "CVA (class-variance-authority) properly used for styling variants in $cvaComponents components" -Level SUCCESS
        } else {
            Write-Log "No CVA usage found - Consider using CVA for variant styling" -Level WARNING
        }
        
        # 8. Validate CSS Modules usage
        $cssModules = @(Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.module.css" | 
            Where-Object { $_.FullName -notmatch "node_modules" }).Count
        
        $totalCss = @(Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.css" | 
            Where-Object { $_.FullName -notmatch "node_modules" -and $_.Name -ne "globals.css" -and $_.Name -ne "theme-vars.css" }).Count
        
        if ($cssModules -lt ($totalCss - 2)) {
            $issuesFound += ($totalCss - $cssModules)
            Write-Log "Found $($totalCss - $cssModules) non-module CSS files - Prefer CSS Modules for component styling!" -Level WARNING
        } else {
            Write-Log "CSS Modules usage looks good ($cssModules module files)" -Level SUCCESS
        }
        
        # 9. Validate TypeScript Service Worker exists
        if (Test-Path "$($ProjectConfig.ProjectRoot)\public\sw.ts") {
            Write-Log "TypeScript Service Worker found: sw.ts" -Level SUCCESS
        } else {
            Write-Log "No TypeScript Service Worker found (sw.ts)" -Level WARNING
        }
        
        # Summary
        if ($issuesFound -eq 0) {
            Write-Log "Purity check completed with no issues found!" -Level SUCCESS
            return $true
        } else {
            Write-Log "Purity check completed with $issuesFound issues found!" -Level ERROR
            return $false
        }
    } catch {
        Write-Log "Failed to complete purity check: $_" -Level ERROR
        return $false
    }
}

function Invoke-CssCheck {
    Write-Log "Running comprehensive CSS approach validation..." -Level INFO
    
    try {
        $pandaUsage = 0
        $cssInJs = 0
        $cvaUsage = 0
        
        $tsFiles = Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.ts", "*.tsx" | 
            Where-Object { $_.FullName -notmatch "node_modules" }
        
        foreach ($file in $tsFiles) {
            $content = Get-Content $file.FullName -Raw
            if ($content -match "panda|@pandacss") { $pandaUsage++ }
            if ($content -match "styled|css``") { $cssInJs++ }
            if ($content -match "class-variance-authority|cva\(") { $cvaUsage++ }
        }
        
        $cssModules = @(Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.module.css" | 
            Where-Object { $_.FullName -notmatch "node_modules" }).Count
        
        $globalCss = @(Get-ChildItem -Path $ProjectConfig.ProjectRoot -Recurse -Include "*.css" | 
            Where-Object { $_.FullName -notmatch "node_modules" -and $_.Name -notlike "*.module.css" }).Count
        
        Write-ColorOutput "CSS Approach Analysis Report:" -Color Blue
        Write-ColorOutput "----------------------------------------" -Color Blue
        Write-ColorOutput "  CSS Modules: $cssModules files" -Color White
        Write-ColorOutput "  Global CSS: $globalCss files (should be minimal)" -Color White
        Write-ColorOutput "  CVA Usage: $cvaUsage components" -Color White
        Write-ColorOutput "  Panda CSS: $pandaUsage files (should be 0)" -Color White
        Write-ColorOutput "  CSS-in-JS: $cssInJs files (should be 0)" -Color White
        Write-ColorOutput "----------------------------------------" -Color Blue
        
        if ($pandaUsage -eq 0 -and $cssInJs -eq 0 -and $cssModules -gt 0) {
            Write-Log "Perfect! Using CSS Modules + CVA only" -Level SUCCESS
            return $true
        } else {
            Write-Log "CSS approach violations found!" -Level ERROR
            return $false
        }
    } catch {
        Write-Log "Failed to complete CSS check: $_" -Level ERROR
        return $false
    }
}

function Invoke-Tests {
    Write-Log "Running Vitest test suite..." -Level INFO
    
    try {
        Set-Location $ProjectConfig.ProjectRoot -ErrorAction Stop
        
        if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
            Write-Log "Yarn Berry not found!" -Level ERROR
            return $false
        }
        
        if (-not (Test-Path "$($ProjectConfig.ProjectRoot)\vitest.config.ts")) {
            Write-Log "Vitest configuration not found!" -Level ERROR
            return $false
        }
        
        $testOutput = & yarn test 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "All tests passed" -Level SUCCESS
            if ($VerboseOutput) {
                Write-ColorOutput $testOutput -Color Green
            }
            return $true
        } else {
            Write-Log "Tests failed" -Level ERROR
            Write-ColorOutput $testOutput -Color Red
            return $false
        }
    } catch {
        Write-Log "Failed to run tests: $_" -Level ERROR
        return $false
    }
}

function Invoke-Build {
    Write-Log "Running production build..." -Level INFO
    
    try {
        Set-Location $ProjectConfig.ProjectRoot -ErrorAction Stop
        
        # Clear cache
        if (Test-Path "$($ProjectConfig.ProjectRoot)\.next") {
            Remove-Item "$($ProjectConfig.ProjectRoot)\.next" -Recurse -Force -ErrorAction Stop
            Write-Log "Cleared .next cache" -Level INFO
        }
        
        if (-not (Get-Command yarn -ErrorAction SilentlyContinue)) {
            Write-Log "Yarn Berry not found!" -Level ERROR
            return $false
        }
        
        $buildOutput = & yarn build 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Build completed successfully" -Level SUCCESS
            if ($VerboseOutput) {
                Write-ColorOutput $buildOutput -Color Green
            }
            return $true
        } else {
            Write-Log "Build failed" -Level ERROR
            Write-ColorOutput $buildOutput -Color Red
            return $false
        }
    } catch {
        Write-Log "Failed to complete build: $_" -Level ERROR
        return $false
    }
}

function Protect-CreatorFiles {
    Write-Log "Protecting creator files..." -Level INFO
    
    try {
        # Verify protected files
        foreach ($file in $StackConfig.ProtectedFiles) {
            $filepath = Join-Path $ProjectConfig.ProjectRoot $file
            if (Test-Path $filepath) {
                Write-Log "Verified protected file: $file" -Level SUCCESS
            } else {
                Write-Log "Missing protected file: $file" -Level WARNING
            }
        }
        
        # Create enhanced CREATOR.md if not exists
        $creatorMdPath = "$($ProjectConfig.ProjectRoot)\CREATOR.md"
        if (-not (Test-Path $creatorMdPath)) {
            $creatorContent = "# EuroWeb Ultra Platform - Creator Information`n`n" +
                "**Creator:** $($ProjectConfig.Creator)`n" +
                "**Email:** $($ProjectConfig.CreatorEmail)`n" +
                "**Rights:** $($ProjectConfig.CreatorSignature)`n" +
                "**Version:** $($ProjectConfig.ProjectVersion)`n`n" +
                "## Creator Protection`n`n" +
                "This project is created and owned by $($ProjectConfig.Creator). All rights reserved.`n" +
                "Any modifications to core architecture require explicit creator approval.`n`n" +
                "## Project Architecture`n`n" +
                "- Stack: Pure TypeScript + React + Next.js`n" +
                "- Styling: CSS Modules + CVA (Class Variance Authority)`n" +
                "- Animation: Framer Motion`n" +
                "- Testing: Vitest + Testing Library`n" +
                "- State Management: React Context + Custom Hooks`n`n" +
                "## Contact`n`n" +
                "For any questions or modifications, contact: $($ProjectConfig.CreatorEmail)`n`n" +
                "---`n" +
                "*Created with industrial-grade precision by $($ProjectConfig.Creator)*"
            
            Set-Content -Path $creatorMdPath -Value $creatorContent -ErrorAction Stop
            Write-Log "Created enhanced CREATOR.md protection file" -Level SUCCESS
        }
        
        # Create SECURITY.md if not exists
        $securityMdPath = "$($ProjectConfig.ProjectRoot)\SECURITY.md"
        if (-not (Test-Path $securityMdPath)) {
            $securityContent = "# Security Policy`n`n" +
                "## Supported Versions`n`n" +
                "Only the latest version of EuroWeb Ultra Platform receives security updates.`n`n" +
                "## Reporting a Vulnerability`n`n" +
                "To report security vulnerabilities, contact $($ProjectConfig.CreatorEmail) directly.`n`n" +
                "All security reports will be investigated promptly."
            Set-Content -Path $securityMdPath -Value $securityContent -ErrorAction Stop
            Write-Log "Created SECURITY.md file" -Level SUCCESS
        }
        
        return $true
    } catch {
        Write-Log "Failed to protect creator files: $_" -Level ERROR
        return $false
    }
}

function Initialize-Git {
    Write-Log "Setting up enhanced Git repository..." -Level INFO
    
    try {
        Set-Location $ProjectConfig.ProjectRoot -ErrorAction Stop
        
        if (-not (Test-Path ".git")) {
            & git init
            & git branch -M main
            Write-Log "Initialized new Git repository" -Level SUCCESS
        }
        
        # Create enhanced .gitignore if not exists
        $gitignorePath = "$($ProjectConfig.ProjectRoot)\.gitignore"
        if (-not (Test-Path $gitignorePath)) {
            $gitignoreContent = @'
# Dependencies
node_modules/
.pnp
.pnp.js
.yarn/cache
.yarn/unplugged
.yarn/build-state.yml
.yarn/install-state.gz

# Production
.next/
out/
build/
dist/
.serverless/

# Debug logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment
.env
.env.local
.env.development
.env.test
.env.production
.env*.local

# IDE
.vscode/
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# TypeScript cache
*.tsbuildinfo

# Misc
*.log
*.tmp
*.temp
*~
'@
            Set-Content -Path $gitignorePath -Value $gitignoreContent -ErrorAction Stop
            Write-Log "Created enhanced .gitignore file" -Level SUCCESS
        }
        
        # Create initial commit if no commits exist
        $commitCount = (& git rev-list --count HEAD 2>$null)
        if (-not $commitCount -or $commitCount -eq 0) {
            $commitMessage = "feat: EuroWeb Ultra v$($ProjectConfig.ProjectVersion) - Industrial TypeScript Architecture - Creator: $($ProjectConfig.Creator) ($($ProjectConfig.CreatorSignature))"
            & git add .
            & git commit -m $commitMessage
            Write-Log "Created initial Git commit" -Level SUCCESS
        }
        
        Write-Log "Git repository setup completed" -Level SUCCESS
        return $true
    } catch {
        Write-Log "Failed to setup Git repository: $_" -Level ERROR
        return $false
    }
}

function Deploy-Vercel {
    Write-Log "Deploying to Vercel..." -Level INFO
    
    try {
        Set-Location $ProjectConfig.ProjectRoot -ErrorAction Stop
        
        if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
            Write-Log "Vercel CLI not found, installing..." -Level INFO
            & npm i -g vercel
        }
        
        if (-not (Test-Path "$($ProjectConfig.ProjectRoot)\vercel.json")) {
            $vercelConfig = @'
{
  "version": 2,
  "builds": [
    {
      "src": "next.config.mts",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
'@
            Set-Content -Path "$($ProjectConfig.ProjectRoot)\vercel.json" -Value $vercelConfig
            Write-Log "Created vercel.json configuration" -Level SUCCESS
        }
        
        $deployOutput = & vercel --prod 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Log "Successfully deployed to Vercel" -Level SUCCESS
            if ($VerboseOutput) {
                Write-ColorOutput $deployOutput -Color Green
            }
            return $true
        } else {
            Write-Log "Failed to deploy to Vercel" -Level ERROR
            Write-ColorOutput $deployOutput -Color Red
            return $false
        }
    } catch {
        Write-Log "Failed to deploy to Vercel: $_" -Level ERROR
        return $false
    }
}

function Show-Help {
    Write-ColorOutput "EuroWeb Ultra Project Management" -Color White
    Write-Host ""
    Write-Host "Usage: .\project-manager.ps1 [COMMAND] [-Force] [-Verbose]"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  init        Initialize project structure"
    Write-Host "  fix-paths   Fix absolute import paths"
    Write-Host "  validate    Validate dependencies and configuration"
    Write-Host "  purity      Run fanatical purity check"
    Write-Host "  css-check   Verify CSS Modules + CVA only (no Panda/CSS-in-JS)"
    Write-Host "  test        Run test suite"
    Write-Host "  build       Run production build"
    Write-Host "  protect     Protect creator files"
    Write-Host "  git         Setup Git repository"
    Write-Host "  deploy      Deploy to Vercel"
    Write-Host "  full        Run complete setup (init + validate + build + test)"
    Write-Host "  help        Show this help message"
    Write-Host ""
    Write-Host "Options:"
    Write-Host "  -Force      Skip creator approval prompts"
    Write-Host "  -Verbose    Show detailed output"
    Write-Host ""
    Write-ColorOutput "Creator: $($ProjectConfig.Creator) ($($ProjectConfig.CreatorSignature))" -Color Magenta
    Write-ColorOutput "Contact: $($ProjectConfig.CreatorEmail)" -Color Cyan
    Write-Host ""
    Write-ColorOutput "Allowed Stack:" -Color Yellow
    Write-Host "  ✅ TypeScript + React + Next.js"
    Write-Host "  ✅ Vanilla CSS + CSS Modules (*.module.css)"
    Write-Host "  ✅ Class Variance Authority (CVA) + clsx"
    Write-Host "  ✅ Framer Motion"
    Write-Host "  ✅ Vitest + Testing Library"
    Write-Host ""
    Write-ColorOutput "Forbidden:" -Color Red
    Write-Host "  ❌ Any CSS-in-JS (styled-components, emotion, stitches)"
    Write-Host "  ❌ CSS Preprocessors (SCSS/SASS/LESS)"
    Write-Host "  ❌ CSS Frameworks (Tailwind, Panda CSS)"
    Write-Host "  ❌ Jest (use Vitest)"
    Write-Host "  ❌ JavaScript files (TypeScript only)"
    Write-Host "  ❌ Default exports (prefer named exports except Next.js pages)"
    Write-Host ""
}

# Main execution
try {
    Write-Header
    
    if (-not (Test-ProjectRoot)) {
        Write-Log "Project root validation failed. Exiting." -Level ERROR
        exit 1
    }
    
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
        "css-check" {
            Invoke-CssCheck
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
            $success = $true
            
            $success = $success -and (Initialize-DirectoryStructure)
            $success = $success -and (Update-TsConfig)
            $success = $success -and (Repair-AbsolutePaths)
            $success = $success -and (Test-Dependencies)
            $success = $success -and (Invoke-PurityCheck)
            $success = $success -and (Invoke-CssCheck)
            $success = $success -and (Protect-CreatorFiles)
            $success = $success -and (Invoke-Tests)
            $success = $success -and (Invoke-Build)
            
            if ($success) {
                Write-Log "Full setup completed successfully!" -Level SUCCESS
            } else {
                Write-Log "Full setup completed with errors!" -Level ERROR
            }
        }
        default {
            Show-Help
        }
    }
} catch {
    Write-Log "Unhandled error in main execution: $_" -Level ERROR
    exit 1
}
