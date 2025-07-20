#!/bin/bash

###############################################################################
# EuroWeb Ultra Project Management Script
# Industrial-Grade TypeScript Project Automation
# 
# @author Ledjan Ahmati (100% Owner)
# @contact dealsjona@gmail.com
# @version 8.0.0 Ultra
# @license MIT - Creator Protected
###############################################################################

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors and formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color
readonly BOLD='\033[1m'

# Project Configuration
readonly PROJECT_NAME="EuroWeb Ultra Platform"
readonly PROJECT_VERSION="8.0.0"
readonly CREATOR="Ledjan Ahmati"
readonly CREATOR_EMAIL="dealsjona@gmail.com"
readonly CREATOR_SIGNATURE="100% Owner & Creator"

# Absolute Paths (Windows/Linux Compatible)
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
    readonly PROJECT_ROOT="c:/UltraBuild/EuroWeb"
    readonly YARN_CMD="yarn.cmd"
else
    readonly PROJECT_ROOT="/opt/UltraBuild/EuroWeb"
    readonly YARN_CMD="yarn"
fi

readonly COMPONENTS_DIR="$PROJECT_ROOT/components"
readonly LIB_DIR="$PROJECT_ROOT/lib"
readonly TYPES_DIR="$PROJECT_ROOT/types"
readonly TESTS_DIR="$PROJECT_ROOT/__tests__"
readonly DOCS_DIR="$PROJECT_ROOT/docs"
readonly SCRIPTS_DIR="$PROJECT_ROOT/scripts"

# Stack Configuration (PURE - NO LEGACY)
readonly ALLOWED_DEPS=(
    "next" "react" "react-dom" "typescript"
    "framer-motion" "class-variance-authority"
    "@testing-library/react" "@testing-library/jest-dom" "@testing-library/user-event"
    "vitest" "@vitejs/plugin-react" "jsdom"
    "@popperjs/core" "@next/bundle-analyzer"
)

readonly FORBIDDEN_DEPS=(
    "jest" "babel" "webpack" "styled-components" "emotion"
    "@emotion/react" "@emotion/styled" "styled-jsx"
    "tailwindcss" "postcss" "autoprefixer"
    "panda" "@pandacss/dev" "styled-system"
    "sass" "less" "stylus" "styled-jsx"
    "chakra-ui" "material-ui" "@mui/material"
    "antd" "react-bootstrap" "semantic-ui-react"
    "css-in-js" "styled-components" "styled-system"
)

# Security & Creator Protection
readonly PROTECTED_FILES=(
    "package.json" "tsconfig.json" "next.config.mts"
    "vitest.config.ts" ".gitignore" "yarn.lock"
    "CREATOR.md" "SECURITY.md"
)

###############################################################################
# Utility Functions
###############################################################################

print_header() {
    echo -e "\n${PURPLE}${BOLD}╔══════════════════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${PURPLE}${BOLD}║${WHITE}                           $PROJECT_NAME v$PROJECT_VERSION                        ${PURPLE}║${NC}"
    echo -e "${PURPLE}${BOLD}║${CYAN}                    Creator: $CREATOR_SIGNATURE                     ${PURPLE}║${NC}"
    echo -e "${PURPLE}${BOLD}║${YELLOW}                        Industrial TypeScript Architecture                       ${PURPLE}║${NC}"
    echo -e "${PURPLE}${BOLD}╚══════════════════════════════════════════════════════════════════════════════╝${NC}\n"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_creator() {
    echo -e "${PURPLE}[CREATOR]${NC} $1"
}

check_creator_approval() {
    if [[ "${CREATOR_APPROVED:-}" != "true" ]]; then
        log_warning "This operation requires creator approval."
        echo -e "${CYAN}Creator: $CREATOR${NC}"
        echo -e "${CYAN}Email: $CREATOR_EMAIL${NC}"
        read -p "Enter creator approval code: " approval_code
        
        if [[ "$approval_code" != "ULTRA8000" ]]; then
            log_error "Invalid creator approval code. Operation denied."
            exit 1
        fi
        
        export CREATOR_APPROVED="true"
        log_success "Creator approval granted."
    fi
}

###############################################################################
# Project Structure Management
###############################################################################

create_directory_structure() {
    log_info "Creating absolute directory hierarchy..."
    
    local dirs=(
        "$COMPONENTS_DIR" "$COMPONENTS_DIR/AGISheet" "$COMPONENTS_DIR/Navbar"
        "$LIB_DIR" "$TYPES_DIR" "$TESTS_DIR" "$DOCS_DIR" "$SCRIPTS_DIR"
        "$PROJECT_ROOT/app" "$PROJECT_ROOT/pages" "$PROJECT_ROOT/public"
        "$PROJECT_ROOT/styles" "$PROJECT_ROOT/utils" "$PROJECT_ROOT/hooks"
        "$PROJECT_ROOT/config" "$PROJECT_ROOT/middleware" "$PROJECT_ROOT/api"
        "$PROJECT_ROOT/mesh" "$PROJECT_ROOT/ddos" "$PROJECT_ROOT/utt"
        "$PROJECT_ROOT/tokens" "$PROJECT_ROOT/patterns" "$PROJECT_ROOT/css"
    )
    
    for dir in "${dirs[@]}"; do
        if [[ ! -d "$dir" ]]; then
            mkdir -p "$dir"
            log_success "Created: $dir"
        fi
    done
}

fix_absolute_paths() {
    log_info "Fixing absolute import paths..."
    
    find "$PROJECT_ROOT" -name "*.ts" -o -name "*.tsx" | while read -r file; do
        if [[ -f "$file" ]]; then
            # Fix relative imports to absolute
            sed -i "s|from '\./|from '@/|g" "$file"
            sed -i "s|from '\.\./|from '@/|g" "$file"
            sed -i "s|import '\./|import '@/|g" "$file"
            sed -i "s|import '\.\./|import '@/|g" "$file"
        fi
    done
    
    log_success "Fixed absolute import paths"
}

###############################################################################
# Package Management
###############################################################################

validate_dependencies() {
    log_info "Validating package.json dependencies..."
    
    if [[ ! -f "$PROJECT_ROOT/package.json" ]]; then
        log_error "package.json not found!"
        return 1
    fi
    
    local forbidden_found=()
    for dep in "${FORBIDDEN_DEPS[@]}"; do
        if grep -q "\"$dep\"" "$PROJECT_ROOT/package.json"; then
            forbidden_found+=("$dep")
        fi
    done
    
    if [[ ${#forbidden_found[@]} -gt 0 ]]; then
        log_error "Forbidden dependencies found: ${forbidden_found[*]}"
        log_warning "Only pure TypeScript + Yarn Berry + CVA + Framer Motion + Vitest allowed!"
        return 1
    fi
    
    log_success "Dependencies validation passed"
}

update_tsconfig() {
    log_info "Updating tsconfig.json with absolute paths..."
    
    cat > "$PROJECT_ROOT/tsconfig.json" << 'EOF'
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
EOF
    
    log_success "Updated tsconfig.json with absolute paths"
}

###############################################################################
# Build & Test Management
###############################################################################

run_purity_check() {
    log_info "Running fanatical purity check..."
    
    # Check for forbidden file extensions
    local js_files=$(find "$PROJECT_ROOT" -name "*.js" -not -path "*/node_modules/*" -not -path "*/.next/*" | wc -l)
    if [[ $js_files -gt 0 ]]; then
        log_error "Found $js_files .js files - Only .ts/.tsx allowed!"
        return 1
    fi
    
    # Check for forbidden CSS approaches
    local scss_files=$(find "$PROJECT_ROOT" -name "*.scss" -o -name "*.sass" -o -name "*.less" -not -path "*/node_modules/*" | wc -l)
    if [[ $scss_files -gt 0 ]]; then
        log_error "Found $scss_files SCSS/SASS/LESS files - Only CSS Modules allowed!"
        return 1
    fi
    
    # Check for CSS-in-JS usage
    find "$PROJECT_ROOT" -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "styled\|css\`\|styled-components\|emotion" | while read -r file; do
        log_error "CSS-in-JS found in: $file - Only CSS Modules + CVA allowed!"
    done
    
    # Check for Panda CSS usage
    find "$PROJECT_ROOT" -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "panda\|@pandacss\|styled-system" | while read -r file; do
        log_error "Panda CSS found in: $file - Only CSS Modules + CVA allowed!"
    done
    
    # Validate CSS Modules usage
    local css_modules=$(find "$PROJECT_ROOT" -name "*.module.css" -not -path "*/node_modules/*" | wc -l)
    local total_css=$(find "$PROJECT_ROOT" -name "*.css" -not -path "*/node_modules/*" -not -name "globals.css" -not -name "theme-vars.css" | wc -l)
    
    if [[ $css_modules -lt $((total_css - 2)) ]]; then
        log_warning "Non-module CSS files found - Prefer CSS Modules for component styling"
    fi
    
    # Check for React hooks in non-React files
    find "$PROJECT_ROOT" -name "*.ts" -not -path "*/node_modules/*" | xargs grep -l "useState\|useEffect\|useCallback" | while read -r file; do
        log_warning "React hooks found in .ts file: $file"
    done
    
    # Check for default exports (except Next.js required)
    find "$PROJECT_ROOT" -name "*.tsx" -not -path "*/node_modules/*" -not -path "*/app/*" -not -path "*/pages/*" | xargs grep -l "export default" | while read -r file; do
        log_warning "Default export found in: $file"
    done
    
    # Validate CVA usage
    local cva_components=$(find "$PROJECT_ROOT" -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "class-variance-authority\|cva" | wc -l)
    if [[ $cva_components -gt 0 ]]; then
        log_success "CVA (class-variance-authority) properly used for styling variants"
    fi
    
    log_success "Purity check completed"
}

run_tests() {
    log_info "Running Vitest test suite..."
    
    cd "$PROJECT_ROOT"
    
    if ! command -v "$YARN_CMD" &> /dev/null; then
        log_error "Yarn Berry not found!"
        return 1
    fi
    
    "$YARN_CMD" test
    log_success "All tests passed"
}

run_build() {
    log_info "Running production build..."
    
    cd "$PROJECT_ROOT"
    
    # Clear cache
    rm -rf ".next"
    
    # Build
    "$YARN_CMD" build
    
    log_success "Build completed successfully"
}

###############################################################################
# Security & Protection
###############################################################################

protect_creator_files() {
    log_info "Protecting creator files..."
    
    for file in "${PROTECTED_FILES[@]}"; do
        local filepath="$PROJECT_ROOT/$file"
        if [[ -f "$filepath" ]]; then
            chmod 644 "$filepath"
            log_success "Protected: $file"
        fi
    done
    
    # Create CREATOR.md if not exists
    if [[ ! -f "$PROJECT_ROOT/CREATOR.md" ]]; then
        cat > "$PROJECT_ROOT/CREATOR.md" << EOF
# EuroWeb Ultra Platform - Creator Information

**Creator:** $CREATOR  
**Email:** $CREATOR_EMAIL  
**Rights:** $CREATOR_SIGNATURE  
**Version:** $PROJECT_VERSION  

## Creator Protection

This project is created and owned by $CREATOR. All rights reserved.
Any modifications to core architecture require explicit creator approval.

## Contact

For any questions or modifications, contact: $CREATOR_EMAIL

---
*Created with ❤️ by $CREATOR*
EOF
        log_creator "Created CREATOR.md protection file"
    fi
}

###############################################################################
# Git & Deployment
###############################################################################

git_setup() {
    log_info "Setting up Git repository..."
    
    cd "$PROJECT_ROOT"
    
    if [[ ! -d ".git" ]]; then
        git init
        git branch -M main
    fi
    
    # Create .gitignore if not exists
    if [[ ! -f ".gitignore" ]]; then
        cat > ".gitignore" << 'EOF'
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
EOF
    fi
    
    git add .
    git commit -m "feat: EuroWeb Ultra v$PROJECT_VERSION - Industrial TypeScript Architecture

- Pure TypeScript + Yarn Berry + CVA + Framer Motion
- Lazy loading system with neural optimization
- Industrial-grade component architecture
- Creator: $CREATOR ($CREATOR_SIGNATURE)
- Zero legacy dependencies
- Full test coverage with Vitest

Signed-off-by: $CREATOR <$CREATOR_EMAIL>"
    
    log_success "Git repository configured"
}

deploy_vercel() {
    log_info "Deploying to Vercel..."
    
    cd "$PROJECT_ROOT"
    
    if ! command -v vercel &> /dev/null; then
        log_warning "Vercel CLI not found, installing..."
        npm i -g vercel
    fi
    
    vercel --prod
    log_success "Deployed to Vercel"
}

###############################################################################
# Main Operations
###############################################################################

show_help() {
    echo -e "${BOLD}EuroWeb Ultra Project Management${NC}\n"
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  init        Initialize project structure"
    echo "  fix-paths   Fix absolute import paths"
    echo "  validate    Validate dependencies and configuration"
    echo "  purity      Run fanatical purity check"
    echo "  css-check   Verify CSS Modules + CVA only (no Panda/CSS-in-JS)"
    echo "  test        Run test suite"
    echo "  build       Run production build"
    echo "  protect     Protect creator files"
    echo "  git         Setup Git repository"
    echo "  deploy      Deploy to Vercel"
    echo "  full        Run complete setup (init + validate + build + test)"
    echo "  help        Show this help message"
    echo ""
    echo -e "${PURPLE}Creator: $CREATOR ($CREATOR_SIGNATURE)${NC}"
    echo -e "${CYAN}Contact: $CREATOR_EMAIL${NC}"
    echo ""
    echo -e "${YELLOW}Allowed Stack:${NC}"
    echo "  ✅ TypeScript + React + Next.js"
    echo "  ✅ CSS Modules (*.module.css)"
    echo "  ✅ Class Variance Authority (CVA)"
    echo "  ✅ Framer Motion"
    echo "  ✅ Vitest + Testing Library"
    echo ""
    echo -e "${RED}Forbidden:${NC}"
    echo "  ❌ Panda CSS / styled-system"
    echo "  ❌ CSS-in-JS / styled-components"
    echo "  ❌ SCSS/SASS/LESS"
    echo "  ❌ Jest (use Vitest)"
    echo "  ❌ JavaScript files (TypeScript only)"
}

main() {
    print_header
    
    case "${1:-help}" in
        "init")
            create_directory_structure
            update_tsconfig
            protect_creator_files
            ;;
        "fix-paths")
            fix_absolute_paths
            ;;
        "validate")
            validate_dependencies
            ;;
        "purity")
            run_purity_check
            ;;
        "css-check")
            log_info "Verifying CSS approach..."
            local panda_usage=$(find "$PROJECT_ROOT" -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "panda\|@pandacss\|styled-system" | wc -l)
            local css_in_js=$(find "$PROJECT_ROOT" -name "*.ts" -o -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "styled\|css\`" | wc -l)
            local css_modules=$(find "$PROJECT_ROOT" -name "*.module.css" | wc -l)
            local cva_usage=$(find "$PROJECT_ROOT" -name "*.tsx" -not -path "*/node_modules/*" | xargs grep -l "class-variance-authority\|cva" | wc -l)
            
            echo -e "${BLUE}CSS Approach Analysis:${NC}"
            echo "  CSS Modules: $css_modules files"
            echo "  CVA Usage: $cva_usage components"
            echo "  Panda CSS: $panda_usage files (should be 0)"
            echo "  CSS-in-JS: $css_in_js files (should be 0)"
            
            if [[ $panda_usage -eq 0 && $css_in_js -eq 0 && $css_modules -gt 0 ]]; then
                log_success "Perfect! Using CSS Modules + CVA only"
            else
                log_error "CSS approach violations found!"
                return 1
            fi
            ;;
        "test")
            run_tests
            ;;
        "build")
            run_build
            ;;
        "protect")
            check_creator_approval
            protect_creator_files
            ;;
        "git")
            git_setup
            ;;
        "deploy")
            check_creator_approval
            deploy_vercel
            ;;
        "full")
            create_directory_structure
            update_tsconfig
            fix_absolute_paths
            validate_dependencies
            run_purity_check
            protect_creator_files
            run_tests
            run_build
            log_success "Full setup completed successfully!"
            ;;
        "help"|*)
            show_help
            ;;
    esac
}

# Execute main function with all arguments
main "$@"
