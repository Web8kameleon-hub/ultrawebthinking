#!/usr/bin/env ts-node
/**
 * Defense Layer Test Suite - Web8UltraThinking
 * Teston Layer 7 (Mirror) + Layer 8 (DDoS) nën simulime sulmi
 * 
 * @author Ledjan Ahmati
 * @version 1.0.0
 */


// Test Configuration
const TEST_CONFIG = {
    serverUrl: 'http://localhost:3000',
    concurrent: 50,
    requests: 1000,
    testDuration: 30000, // 30 sekonda
    userAgents: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'curl/7.68.0',
        'wget/1.20.3',
        'python-requests/2.25.1'
    ]
}

class DefenseTestSuite {
    private results: any[] = []
    private running = false

    async runFullTest() {
        console.log('🚀 Defense Layer Test Suite - Web8UltraThinking')
        console.log('================================================')

        // Test 1: Normal Load
        console.log('\n📊 Test 1: Normal Load (Baseline)')
        await this.testNormalLoad()

        // Test 2: Rate Limit
        console.log('\n⚡ Test 2: Rate Limit Stress Test')
        await this.testRateLimit()

        // Test 3: DDoS Simulation
        console.log('\n🔥 Test 3: DDoS Attack Simulation')
        await this.testDDoSAttack()

        // Test 4: Honeypot Trigger
        console.log('\n🍯 Test 4: Honeypot Trigger Test')
        await this.testHoneypot()

        // Test 5: CSP Violation
        console.log('\n🛡️ Test 5: CSP Header Validation')
        await this.testCSP()

        // Results Summary
        this.printResults()
    }

    private async testNormalLoad() {
        const promises = []
        const startTime = Date.now()

        for (let i = 0; i < 20; i++) {
            promises.push(this.makeRequest('/en/web8-tabs', 'normal'))
        }

        const responses = await Promise.allSettled(promises)
        const successful = responses.filter(r => r.status === 'fulfilled').length
        const duration = Date.now() - startTime

        this.results.push({
            test: 'Normal Load',
            total: 20,
            successful,
            duration,
            rps: (successful / duration * 1000).toFixed(2)
        })

        console.log(`✅ Normal Load: ${successful}/20 successful (${(successful / duration * 1000).toFixed(2)} RPS)`)
    }

    private async testRateLimit() {
        const promises = []
        const startTime = Date.now()

        // Bombardojmë me 100 requests në kohë të shkurtër
        for (let i = 0; i < 100; i++) {
            promises.push(this.makeRequest('/api/utt/info', 'rate-limit'))
        }

        const responses = await Promise.allSettled(promises)
        const successful = responses.filter(r =>
            r.status === 'fulfilled' && (r.value as any).status < 400
        ).length
        const rateLimited = responses.filter(r =>
            r.status === 'fulfilled' && (r.value as any).status === 429
        ).length
        const duration = Date.now() - startTime

        this.results.push({
            test: 'Rate Limit',
            total: 100,
            successful,
            rateLimited,
            duration,
            effectiveness: `${((rateLimited / 100) * 100).toFixed(1)  }%`
        })

        console.log(`⚡ Rate Limit: ${successful} passed, ${rateLimited} blocked (${((rateLimited / 100) * 100).toFixed(1)}% effectiveness)`)
    }

    private async testDDoSAttack() {
        console.log('🔥 Simulating DDoS attack with multiple IPs...')
        const promises = []
        const startTime = Date.now()

        // Simulojmë sulm nga IP të ndryshme
        for (let i = 0; i < TEST_CONFIG.concurrent; i++) {
            for (let j = 0; j < 10; j++) {
                promises.push(this.makeRequest('/en/web8-tabs', 'ddos', {
                    'X-Forwarded-For': `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
                    'User-Agent': TEST_CONFIG.userAgents[Math.floor(Math.random() * TEST_CONFIG.userAgents.length)]
                }))
            }
        }

        const responses = await Promise.allSettled(promises)
        const successful = responses.filter(r =>
            r.status === 'fulfilled' && (r.value as any).status < 400
        ).length
        const blocked = responses.filter(r =>
            r.status === 'fulfilled' && (r.value as any).status >= 400
        ).length
        const duration = Date.now() - startTime

        this.results.push({
            test: 'DDoS Attack',
            total: promises.length,
            successful,
            blocked,
            duration,
            blockRate: `${((blocked / promises.length) * 100).toFixed(1)  }%`
        })

        console.log(`🔥 DDoS Test: ${successful} passed, ${blocked} blocked (${((blocked / promises.length) * 100).toFixed(1)}% block rate)`)
    }

    private async testHoneypot() {
        try {
            const response = await fetch(`${TEST_CONFIG.serverUrl}/defense/trap.js`, {
                headers: {
                    'User-Agent': 'AttackerBot/1.0',
                    'X-Forwarded-For': '1.2.3.4'
                }
            })

            const content = await response.text()
            const isHoneypot = content.includes('__mirror_probe__')

            this.results.push({
                test: 'Honeypot',
                triggered: isHoneypot,
                status: response.status
            })

            console.log(`🍯 Honeypot: ${isHoneypot ? '✅ Activated' : '❌ Not triggered'} (${response.status})`)
        } catch (_error) {
            console.log(`🍯 Honeypot: ❌ Error - ${error}`)
        }
    }

    private async testCSP() {
        try {
            const response = await fetch(`${TEST_CONFIG.serverUrl}/en/web8-tabs`)
            const csp = response.headers.get('content-security-policy')
            const hasCSP = !!csp
            const hasNonce = csp?.includes('nonce-') || false
            const hasStrictDynamic = csp?.includes('strict-dynamic') || false

            this.results.push({
                test: 'CSP Headers',
                hasCSP,
                hasNonce,
                hasStrictDynamic,
                cspHeader: `${csp?.substring(0, 100)  }...`
            })

            console.log(`🛡️ CSP: ${hasCSP ? '✅' : '❌'} Header, ${hasNonce ? '✅' : '❌'} Nonce, ${hasStrictDynamic ? '✅' : '❌'} Strict-Dynamic`)
        } catch (_error) {
            console.log(`🛡️ CSP: ❌ Error - ${error}`)
        }
    }

    private async makeRequest(path: string, type: string, headers?: any) {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 10000)

            const response = await fetch(`${TEST_CONFIG.serverUrl}${path}`, {
                headers: {
                    'User-Agent': TEST_CONFIG.userAgents[Math.floor(Math.random() * TEST_CONFIG.userAgents.length)],
                    ...headers
                },
                signal: controller.signal
            })

            clearTimeout(timeoutId)

            return {
                status: response.status,
                type,
                url: path,
                timestamp: Date.now()
            }
        } catch (error: any) {
            return {
                status: 0,
                type,
                url: path,
                error: error?.message ?? 'Unknown error',
                timestamp: Date.now()
            }
        }
    }

    private printResults() {
        console.log('\n📊 DEFENSE TEST RESULTS')
        console.log('========================')

        this.results.forEach(result => {
            console.log(`\n${  JSON.stringify(result, null, 2)}`)
        })

        console.log('\n🎯 SECURITY ASSESSMENT:')

        // Rate Limiting Effectiveness
        const rateLimitTest = this.results.find(r => r.test === 'Rate Limit')
        if (rateLimitTest && parseFloat(rateLimitTest.effectiveness) > 70) {
            console.log('✅ Rate Limiting: EFFECTIVE')
        } else {
            console.log('❌ Rate Limiting: NEEDS IMPROVEMENT')
        }

        // DDoS Protection
        const ddosTest = this.results.find(r => r.test === 'DDoS Attack')
        if (ddosTest && parseFloat(ddosTest.blockRate) > 50) {
            console.log('✅ DDoS Protection: OPERATIONAL')
        } else {
            console.log('❌ DDoS Protection: INSUFFICIENT')
        }

        // CSP Headers
        const cspTest = this.results.find(r => r.test === 'CSP Headers')
        if (cspTest?.hasCSP && cspTest.hasNonce) {
            console.log('✅ CSP Protection: ACTIVE')
        } else {
            console.log('❌ CSP Protection: INCOMPLETE')
        }

        // Honeypot
        const honeypotTest = this.results.find(r => r.test === 'Honeypot')
        if (honeypotTest?.triggered) {
            console.log('✅ Honeypot: ARMED')
        } else {
            console.log('❌ Honeypot: NOT RESPONDING')
        }

        console.log(`\n🚀 Overall Security Status: ${  this.calculateOverallScore() > 75 ? 'PRODUCTION READY' : 'NEEDS IMPROVEMENT'}`)
    }

    private calculateOverallScore(): number {
        let score = 0
        const tests = this.results.length

        this.results.forEach(result => {
            switch (result.test) {
                case 'Rate Limit':
                    score += parseFloat(result.effectiveness) ?? 0
                    break
                case 'DDoS Attack':
                    score += parseFloat(result.blockRate) ?? 0
                    break
                case 'CSP Headers':
                    score += (result.hasCSP && result.hasNonce) ? 100 : 0
                    break
                case 'Honeypot':
                    score += result.triggered ? 100 : 0
                    break
            }
        })

        return score / tests
    }
}

// Performance Monitoring
class PerformanceMonitor {
    private metrics = {
        startTime: Date.now(),
        requests: 0,
        errors: 0,
        avgResponseTime: 0
    }

    async monitorEndpoint(url: string, duration = 30000) {
        console.log(`📈 Monitoring ${url} for ${duration / 1000}s...`)

        const interval = setInterval(async () => {
            const start = Date.now()
            try {
                const response = await fetch(url)
                const responseTime = Date.now() - start

                this.metrics.requests++
                this.metrics.avgResponseTime = (this.metrics.avgResponseTime + responseTime) / 2

                if (response.status >= 400) {
                    this.metrics.errors++
                }
            } catch (_error) {
                this.metrics.errors++
            }
        }, 1000)

        setTimeout(() => {
            clearInterval(interval)
            this.printMetrics()
        }, duration)
    }

    private printMetrics() {
        const uptime = Date.now() - this.metrics.startTime
        console.log('\n📊 PERFORMANCE METRICS')
        console.log('======================')
        console.log(`Duration: ${uptime / 1000}s`)
        console.log(`Total Requests: ${this.metrics.requests}`)
        console.log(`Error Rate: ${((this.metrics.errors / this.metrics.requests) * 100).toFixed(2)}%`)
        console.log(`Avg Response Time: ${this.metrics.avgResponseTime.toFixed(2)}ms`)
        console.log(`RPS: ${(this.metrics.requests / (uptime / 1000)).toFixed(2)}`)
    }
}

// Main Execution
async function main() {
    const testSuite = new DefenseTestSuite()
    const monitor = new PerformanceMonitor()

    // Nis monitorimin në background
    monitor.monitorEndpoint(`${TEST_CONFIG.serverUrl}/en/web8-tabs`)

    // Ekzekuto testet kryesore
    await testSuite.runFullTest()

    console.log('\n✅ Defense testing completed!')
    console.log('📈 Performance monitoring continues...')
}

// Auto-run
main().catch(console.error)

export { DefenseTestSuite, PerformanceMonitor }
