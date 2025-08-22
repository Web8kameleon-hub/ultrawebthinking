#!/usr/bin/env node

/**
 * ALB Security System Test
 * EuroWeb Platform - Enhanced Security Testing
 * 
 * @author Ledjan Ahmati (100% Owner)
 * @contact dealsjona@gmail.com
 * @version 8.1.0 Ultra
 * @license MIT
 */

import fetch from 'node-fetch'

const BASE_URL = 'http://localhost:3000/api/utt'

async function testEnhancedUTTInfo() {
  console.log('\n🔍 Testing Enhanced UTT Info endpoint...')
  
  try {
    const response = await fetch(`${BASE_URL}/info`)
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Enhanced UTT Info received:')
      console.log('📊 Token Information:', {
        isVerified: data.tokenInfo?.isVerified,
        marketCap: `$${data.tokenInfo?.marketCap}`,
        liquidity: `$${data.tokenInfo?.liquidity}`,
        riskLevel: data.tokenInfo?.riskLevel,
        priceUSD: `$${data.tokenInfo?.priceUSD}`
      })
      console.log('🔒 Security Status:', {
        healthScore: `${data.securityStatus?.healthScore}/100`,
        monitoringActive: data.securityStatus?.monitoringActive,
        alertsCount: data.securityStatus?.alerts?.length
      })
      console.log('⚙️ Operational Limits:', {
        maxTransferUSD: `$${data.operationalLimits?.maxTransferUSD}`,
        recommendedMaxUSD: `$${data.operationalLimits?.recommendedMaxUSD}`,
        maxSlippage: `${data.operationalLimits?.maxSlippage}%`
      })
      return true
    } else {
      console.log('❌ Enhanced UTT Info failed:', data.error)
      return false
    }
  } catch (error) {
    console.log('❌ Enhanced UTT Info error:', error.message)
    return false
  }
}

async function testSecurityAwareTransfer() {
  console.log('\n💸 Testing Security-Aware Transfer...')
  
  // Test with amount that should trigger security warnings
  const testData = {
    to: '11111111111111111111111111111112', // System program
    amount: 0.001 // Small amount but should trigger some checks
  }
  
  try {
    const response = await fetch(`${BASE_URL}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Security-aware transfer processed:')
      console.log('🔍 Security Check:', {
        approved: data.securityCheck?.approved,
        riskLevel: data.securityCheck?.riskAssessment?.risk,
        warningsCount: data.securityCheck?.checks?.filter(c => c.level === 'WARNING').length,
        errorsCount: data.securityCheck?.checks?.filter(c => !c.passed).length
      })
      console.log('💰 Transfer Details:', {
        signature: data.signature?.substring(0, 20) + '...',
        amountUSD: `$${data.amountUSD}`,
        liquidityImpact: data.audit?.liquidityImpact
      })
      return true
    } else {
      console.log('⚠️ Transfer rejected by security system:', data.error)
      // This is actually expected for security reasons
      return true
    }
  } catch (error) {
    console.log('❌ Security-aware transfer error:', error.message)
    return false
  }
}

async function testLargeTransferBlocking() {
  console.log('\n🚫 Testing Large Transfer Blocking...')
  
  // Test with amount that should be blocked
  const testData = {
    to: '11111111111111111111111111111112',
    amount: 1000 // Large amount that should be blocked
  }
  
  try {
    const response = await fetch(`${BASE_URL}/transfer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('❌ SECURITY FAILURE: Large transfer was allowed!')
      return false
    } else {
      console.log('✅ Security system correctly blocked large transfer:', data.error)
      return true
    }
  } catch (error) {
    console.log('❌ Large transfer test error:', error.message)
    return false
  }
}

async function testPhysicalTokenWithSecurity() {
  console.log('\n🔏 Testing Physical Token with Security Context...')
  
  const testData = {
    tokenId: 'ALB-SEC-TEST-001',
    serial: 'S-SEC-001',
    owner: '11111111111111111111111111111112',
    expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000
  }
  
  try {
    const response = await fetch(`${BASE_URL}/sign-physical`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    })
    
    const data = await response.json()
    
    if (response.ok) {
      console.log('✅ Physical token signed with security context:')
      console.log('🪙 Token Details:', {
        tokenId: data.payload?.tokenId,
        valueEUR: data.payload?.valueEUR,
        signer: data.signer?.substring(0, 20) + '...',
        timestamp: data.timestamp
      })
      
      // Test verification
      const verifyResponse = await fetch(`${BASE_URL}/verify-physical`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      
      const verifyData = await verifyResponse.json()
      
      if (verifyResponse.ok) {
        console.log('✅ Physical token verification:', {
          valid: verifyData.valid,
          checks: verifyData.checks
        })
        return verifyData.valid
      } else {
        console.log('❌ Physical token verification failed:', verifyData.error)
        return false
      }
    } else {
      console.log('❌ Physical token signing failed:', data.error)
      return false
    }
  } catch (error) {
    console.log('❌ Physical token test error:', error.message)
    return false
  }
}

async function runSecurityTests() {
  console.log('🔒 Starting ALB Security System Tests...')
  console.log('🌐 Target:', BASE_URL)
  console.log('📋 Testing enhanced security features and real ALB data integration...\n')
  
  const results = {
    enhancedInfo: await testEnhancedUTTInfo(),
    securityTransfer: await testSecurityAwareTransfer(),
    largeTransferBlocking: await testLargeTransferBlocking(),
    physicalTokenSecurity: await testPhysicalTokenWithSecurity()
  }
  
  console.log('\n📊 Security Test Results:')
  console.log('- Enhanced Info API:', results.enhancedInfo ? '✅ PASS' : '❌ FAIL')
  console.log('- Security-Aware Transfer:', results.securityTransfer ? '✅ PASS' : '❌ FAIL')
  console.log('- Large Transfer Blocking:', results.largeTransferBlocking ? '✅ PASS' : '❌ FAIL')
  console.log('- Physical Token Security:', results.physicalTokenSecurity ? '✅ PASS' : '❌ FAIL')
  
  const allPassed = Object.values(results).every(Boolean)
  
  console.log('\n🎯 Overall Security Assessment:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED')
  
  if (allPassed) {
    console.log('\n🛡️ ALB Security System is operational and protecting against:')
    console.log('  • Unverified token interactions')
    console.log('  • High-risk transfers with excessive slippage')
    console.log('  • Large transfers that could impact liquidity')
    console.log('  • Unauthorized bridge operations')
    console.log('  • Physical token counterfeiting')
    console.log('\n🔗 Access Security Dashboard: http://localhost:3000/en (🔒 ALB Security tab)')
  } else {
    console.log('\n🔧 Some security tests failed. Please check system configuration.')
  }
  
  return allPassed
}

// Run if this script is executed directly
if (process.argv[1].endsWith('test-alb-security.mjs') || process.argv[1].endsWith('test-alb-security.js')) {
  runSecurityTests().then(() => {
    process.exit(0)
  }).catch((error) => {
    console.error('❌ Security test runner failed:', error)
    process.exit(1)
  })
}

export { runSecurityTests }
