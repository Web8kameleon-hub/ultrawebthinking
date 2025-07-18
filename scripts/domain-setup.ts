#!/usr/bin/env tsx
/**
 * EuroWeb Domain Setup Script
 * Automatic domain configuration dhe deployment setup
 */

import { writeFileSync, existsSync, readFileSync } from 'fs'
import { join } from 'path'
import colors from 'colors'

interface DomainConfig {
  primary: string
  alternatives: string[]
  subdomains: Record<string, string>
  ssl: boolean
  platform: string
}

const DOMAIN_CONFIG: DomainConfig = {
  primary: 'euroweb.ai',
  alternatives: [
    'eurowebplatform.com',
    'web8browser.ai', 
    'eurowebagi.com',
    'euroweb.com',
    'euroweb.net'
  ],
  subdomains: {
    www: 'www.euroweb.ai',
    api: 'api.euroweb.ai',
    admin: 'admin.euroweb.ai',
    docs: 'docs.euroweb.ai',
    chat: 'chat.euroweb.ai',
    ai: 'ai.euroweb.ai',
    cdn: 'cdn.euroweb.ai',
    dev: 'dev.euroweb.ai',
    staging: 'staging.euroweb.ai'
  },
  ssl: true,
  platform: 'vercel'
}

function setupDomain(): void {
  console.log(colors.cyan('\n🌐 EuroWeb Domain Setup\n'))
  
  // Display domain information
  console.log(colors.yellow('📋 Domain Configuration:'))
  console.log(colors.white(`Primary Domain: ${colors.green(DOMAIN_CONFIG.primary)}`))
  
  console.log(colors.yellow('\n🔗 Alternative Domains:'))
  DOMAIN_CONFIG.alternatives.forEach(domain => {
    console.log(colors.white(`  • ${colors.cyan(domain)}`))
  })
  
  console.log(colors.yellow('\n🏗️ Subdomains:'))
  Object.entries(DOMAIN_CONFIG.subdomains).forEach(([key, domain]) => {
    console.log(colors.white(`  • ${key}: ${colors.cyan(domain)}`))
  })

  // Create vercel.json for domain configuration
  createVercelConfig()
  
  // Create DNS configuration
  createDNSConfig()
  
  // Create domain verification files
  createDomainVerification()
  
  // Update package.json with domain info
  updatePackageJson()

  console.log(colors.green('\n✅ Domain configuration completed!'))
  console.log(colors.blue('\n🚀 Next steps for domain setup:'))
  console.log(colors.cyan('1. Register domain: euroweb.ai'))
  console.log(colors.cyan('2. Point DNS to Vercel/Cloudflare'))
  console.log(colors.cyan('3. Add domain in Vercel dashboard'))
  console.log(colors.cyan('4. Configure SSL certificate'))
  console.log(colors.cyan('5. Set up CDN and caching'))
  
  console.log(colors.yellow('\n💡 Domain registration recommendations:'))
  console.log(colors.white('  • Registrar: Namecheap, GoDaddy, Cloudflare'))
  console.log(colors.white('  • DNS: Cloudflare (free, fast, secure)'))
  console.log(colors.white('  • SSL: Free via Vercel/Let\'s Encrypt'))
  console.log(colors.white('  • CDN: Cloudflare + Vercel Edge Network'))
}

function createVercelConfig(): void {
  const vercelConfig = {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "version": 2,
    "name": "euroweb-platform",
    "alias": [
      DOMAIN_CONFIG.primary,
      "www.euroweb.ai",
      ...DOMAIN_CONFIG.alternatives
    ],
    "domains": [
      DOMAIN_CONFIG.primary,
      ...Object.values(DOMAIN_CONFIG.subdomains),
      ...DOMAIN_CONFIG.alternatives
    ],
    "build": {
      "env": {
        "DOMAIN": DOMAIN_CONFIG.primary,
        "NODE_ENV": "production"
      }
    },
    "headers": [
      {
        "source": "/(.*)",
        "headers": [
          {
            "key": "X-Frame-Options",
            "value": "DENY"
          },
          {
            "key": "X-Content-Type-Options", 
            "value": "nosniff"
          },
          {
            "key": "Referrer-Policy",
            "value": "origin-when-cross-origin"
          },
          {
            "key": "Permissions-Policy",
            "value": "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ],
    "redirects": [
      {
        "source": "/home",
        "destination": "/",
        "permanent": true
      },
      {
        "source": "/ai",
        "destination": "/openmind",
        "permanent": false
      }
    ],
    "rewrites": [
      {
        "source": "/api/ai/:path*",
        "destination": "/api/openmind/:path*"
      }
    ]
  }

  const vercelPath = join(process.cwd(), 'vercel.json')
  writeFileSync(vercelPath, JSON.stringify(vercelConfig, null, 2))
  console.log(colors.green('✅ Created vercel.json with domain configuration'))
}

function createDNSConfig(): void {
  const dnsConfig = `# EuroWeb DNS Configuration
# Add these records to your DNS provider (Cloudflare recommended)

# A Records (IPv4)
A    @              76.76.19.19        # Vercel IP (example)
A    www            76.76.19.19        # WWW subdomain
A    api            76.76.19.19        # API subdomain
A    admin          76.76.19.19        # Admin subdomain
A    docs           76.76.19.19        # Documentation
A    chat           76.76.19.19        # Chat interface
A    ai             76.76.19.19        # AI/OpenMind
A    cdn            76.76.19.19        # CDN subdomain
A    dev            76.76.19.19        # Development
A    staging        76.76.19.19        # Staging

# AAAA Records (IPv6)
AAAA @              2606:4700::6810:84e5  # Vercel IPv6 (example)
AAAA www            2606:4700::6810:84e5  # WWW IPv6

# CNAME Records
CNAME api           euroweb-platform.vercel.app
CNAME admin         euroweb-platform.vercel.app
CNAME docs          euroweb-platform.vercel.app
CNAME chat          euroweb-platform.vercel.app
CNAME ai            euroweb-platform.vercel.app

# MX Records (Email)
MX   @              10 mail.euroweb.ai
MX   @              20 backup-mail.euroweb.ai

# TXT Records
TXT  @              "v=spf1 include:_spf.google.com ~all"
TXT  _dmarc         "v=DMARC1; p=quarantine; rua=mailto:dmarc@euroweb.ai"
TXT  @              "google-site-verification=YOUR_VERIFICATION_CODE"

# Security Headers via DNS
TXT  @              "security-policy=strict-transport-security"

# Domain Verification (Vercel)
TXT  _vercel        "vc-domain-verify=euroweb-ai-verification-token"

# Notes:
# 1. Replace example IPs with actual Vercel IPs
# 2. Update verification tokens with real values
# 3. Configure SSL/TLS to "Full (strict)" in Cloudflare
# 4. Enable HSTS and security features
# 5. Set up page rules for caching and performance`

  const dnsPath = join(process.cwd(), 'dns-config.txt')
  writeFileSync(dnsPath, dnsConfig)
  console.log(colors.green('✅ Created dns-config.txt with DNS records'))
}

function createDomainVerification(): void {
  const verificationFiles = [
    {
      name: 'google-site-verification.html',
      content: `<!DOCTYPE html>
<html>
<head>
  <title>EuroWeb Platform - Domain Verification</title>
  <meta name="google-site-verification" content="YOUR_GOOGLE_VERIFICATION_CODE" />
</head>
<body>
  <h1>EuroWeb Platform</h1>
  <p>Domain verification for euroweb.ai</p>
</body>
</html>`
    },
    {
      name: 'robots.txt',
      content: `# EuroWeb Platform - Robots.txt
User-agent: *
Allow: /
Allow: /openmind
Allow: /api/health

Disallow: /admin
Disallow: /api/internal
Disallow: /_next/
Disallow: /private/

Sitemap: https://euroweb.ai/sitemap.xml

# Crawl-delay for respectful bots
Crawl-delay: 1

# Specific rules for AI crawlers
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /`
    },
    {
      name: 'sitemap.xml',
      content: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://euroweb.ai/</loc>
    <lastmod>2025-07-18</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://euroweb.ai/openmind</loc>
    <lastmod>2025-07-18</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://euroweb.ai/about</loc>
    <lastmod>2025-07-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`
    }
  ]

  const publicDir = join(process.cwd(), 'public')
  verificationFiles.forEach(file => {
    const filePath = join(publicDir, file.name)
    writeFileSync(filePath, file.content)
    console.log(colors.green(`✅ Created public/${file.name}`))
  })
}

function updatePackageJson(): void {
  const packagePath = join(process.cwd(), 'package.json')
  if (!existsSync(packagePath)) return

  const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'))
  
  // Add domain info to package.json
  packageJson.homepage = `https://${DOMAIN_CONFIG.primary}`
  packageJson.repository = packageJson.repository || {}
  packageJson.repository.url = 'https://github.com/Web8kameleon-hub/ultrawebthinking'
  
  packageJson.config = packageJson.config || {}
  packageJson.config.domain = DOMAIN_CONFIG.primary
  packageJson.config.subdomains = DOMAIN_CONFIG.subdomains
  
  // Add domain-related scripts
  packageJson.scripts = packageJson.scripts || {}
  packageJson.scripts['domain:setup'] = 'tsx scripts/domain-setup.ts'
  packageJson.scripts['domain:verify'] = 'curl -I https://euroweb.ai'
  packageJson.scripts['deploy:production'] = 'vercel --prod'
  packageJson.scripts['deploy:preview'] = 'vercel'

  writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
  console.log(colors.green('✅ Updated package.json with domain configuration'))
}

// Run domain setup
setupDomain()

export default setupDomain
